/* eslint eqeqeq: 0 */

import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import { Modal, ModalHeader, ModalBody, ModalFooter, Col, Row } from "reactstrap";
// import { isEmpty, isEmail } from "validator";
import "./planform.css";
import { languageService } from "../../../Language/language.service";
import { findTreeNode, groupTreeNodeByProperty } from "../../../utils/treeData";
import _ from "lodash";
import {
  INSPECTION_TYPES,
  keyValueProperties,
  otherKeyValueProperties,
  inspectionFields,
  inspectionRunRelatedFields,
  otherInspectionFields,
} from "./variables";
import FormFields from "../../../wigets/forms/formFields";
import { checkFormIsValid, processFromFields } from "../../../utils/helpers";
import { CRUDFunction } from "../../../reduxCURD/container";
import { getAssetLinesWithSelf } from "../../../reduxRelated/actions/assetHelperAction";
import { curdActions } from "reduxCURD/actions";
import moment from "moment-timezone";
import { getUniqueRunRangesFromLines } from "./methods";
import { getFilteredAsset } from "../../../services/methods";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "../../../theme/service/activeTheme.service";
import { updateGenericOptionsWithValue, updateFormFieldsWithValues } from "wigets/forms/common";
import { InspectionOptionsFRA } from "../../../templates/FRAInspectionOptions";
import { retroColors } from "../../../style/basic/basicColors";
import { inspectionSettings } from "./setting";
import FreqArea from "./JourneyPlanFrequency/FreqArea";
import { freqObj } from "./JourneyPlanFrequency/InspectionFreqRow";
import { guid } from "utils/UUID";
import AlertSetupForm from "../../Common/Notification/AlertSetupForm";
//import {timpsSignalApp} from "../../../config/config";
import { versionInfo } from "../../MainPage/VersionInfo";
import ProblemsView from "./ProblemsView";

const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

const FORM_TYPES = {
  INSPECTION: "inspectionForm",
  ALERT_SETUP: "alertSetupForm",
  ALERT_SETUP_VIEW_ONLY_MODE: "alertSetupFormViewOnlyMode",
};

class JourneyPlanAdd extends Component {
  constructor(props) {
    super(props);
    this.defaultInspectionFieldsValue = {
      title: "",
      user: "",
      startDate: "",
      inspectionType: inspectionSettings.logic == "perTime" ? INSPECTION_TYPES.CUSTOM : INSPECTION_TYPES.FIXED,
      inspectionFrequency: 0,
      maxAllowable: 0,
      minDays: 0,
      FRAOption: "",
    };
    this.defaultOtherFieldsValue = { workZone: false, foulTime: false, watchmen: "" };
    this.defaultInspectionRunRelatedFields = {
      lineId: "",
      inspectionRun: "",
      runStart: 0,
      runEnd: 0,
      inspectionAssets: [],
    };

    this.state = {
      selectedJourneyPlan: null,
      modalState: "None",
      showRunCreation: false,
      isRunEditMode: false,
      selectedAssets: [],
      inspectionFieldsValue: _.cloneDeep(this.defaultInspectionFieldsValue),
      inspectionRunFieldsValue: _.cloneDeep(this.defaultInspectionRunRelatedFields),
      otherInspectionFieldStateValue: _.cloneDeep(this.defaultOtherFieldsValue),
      alertSetupValues: null,
      alertSetupValuesUpdated: false,
      selectedRunRange: null,
      infoValue: null,
      lineProblems: [],
      inspectionFrequencies: [{ ...freqObj, id: guid() }],
      showProblemsDlg: false,
      formType: FORM_TYPES.INSPECTION,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getOptionsArray = this.getOptionsArray.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);

    this.updateInspectionFields = this.updateInspectionFields.bind(this);
    this.updateInspectionRunRelatedFields = this.updateInspectionRunRelatedFields.bind(this);
    this.updateOtherInspectionFields = this.updateOtherInspectionFields.bind(this);
    this.updateTextWithInspectionFreq = this.updateTextWithInspectionFreq.bind(this);
    this.checkChangesToPerformInInspectionRunRelatedFields = this.checkChangesToPerformInInspectionRunRelatedFields.bind(this);
    this.handleRunOptionClick = this.handleRunOptionClick.bind(this);
    this.handleInspectionFrequenciesAreaChange = this.handleInspectionFrequenciesAreaChange.bind(this);
    this.handleSwitchForms = this.handleSwitchForms.bind(this);
    this.handleAlertFormAction = this.handleAlertFormAction.bind(this);

    this.initializeFormFields();
  }

  handleInspectionFrequenciesAreaChange(newFreqRowObj, index, remove) {
    let inspecFreqs = [...this.state.inspectionFrequencies];
    if (remove && inspecFreqs[index]) {
      _.remove(inspecFreqs, (freq, i) => {
        return i == index;
      });
    } else if (inspecFreqs[index]) {
      inspecFreqs[index] = newFreqRowObj;
    } else {
      inspecFreqs.push({ ...newFreqRowObj, id: guid() });
    }
    this.setState({
      inspectionFrequencies: inspecFreqs,
    });
  }

  handleRunOptionClick(run) {
    let existingRange = null;
    let _inspectionRunFieldsValue = { ...this.state.inspectionRunFieldsValue };
    if (run) {
      const { runRanges } = this.props;
      existingRange = _.find(runRanges, { id: run.id });
      if (existingRange) {
        _inspectionRunFieldsValue.inspectionRun = run.val;
        _inspectionRunFieldsValue.runStart = existingRange.mpStart;
        _inspectionRunFieldsValue.runEnd = existingRange.mpEnd;
        _inspectionRunFieldsValue = this.changeInspectionRunAssets(
          run.val,
          existingRange.mpStart,
          existingRange.mpEnd,
          _inspectionRunFieldsValue,
        );
        _inspectionRunFieldsValue = this.changeStartEndRunMP(
          existingRange.mpStart,
          existingRange.mpEnd,
          _inspectionRunFieldsValue,
          true,
          _inspectionRunFieldsValue.lineId,
        );
        this.inspectionRunRelatedFields.inspectionRun.value = run.val;
        this.inspectionRunRelatedFields.inspectionRun.valid = true;
      }
    } else {
      _inspectionRunFieldsValue.inspectionRun = "";
      this.inspectionRunRelatedFields.inspectionRun.value = "";
      this.inspectionRunRelatedFields.inspectionRun.valid = false;
      _inspectionRunFieldsValue = this.changeStartEndRunMP("", "", _inspectionRunFieldsValue, false, _inspectionRunFieldsValue.lineId);
      this.inspectionRunRelatedFields.inspectionAssets.value = [];
      this.inspectionRunRelatedFields.inspectionAssets.config.options = [];
      this.inspectionRunRelatedFields.inspectionAssets.valid = false;
      this.inspectionRunRelatedFields.inspectionRun.config.disabled = false;
      this.inspectionRunRelatedFields.inspectionRun.config.selectedValue = null;
    }
    this.setState({
      selectedRunRange: existingRange,
      inspectionRunFieldsValue: _inspectionRunFieldsValue,
    });
  }

  componentDidMount() {
    this.props.getAssetLinesWithSelf();
    this.props.getAssets();
    this.props.getApplicationlookupss(["userConfig"]);
  }
  initializeFormFields() {
    this.inspectionFields = _.cloneDeep(inspectionFields);
    this.otherInspectionFields = _.cloneDeep(otherInspectionFields);
    this.inspectionRunRelatedFields = _.cloneDeep(inspectionRunRelatedFields);
    this.inspectionRunRelatedFields.inspectionRun.config.handleOptionClick = this.handleRunOptionClick;
  }
  componentDidUpdate(prevProps, prevState) {
    // if (this.props.assetActionType === "ASSETS_READ_SUCCESS" && prevProps.assetActionType !== this.props.assetActionType) {}
    if (prevProps.modalState !== this.props.modalState && this.props.modalState == "Add") {
      this.initializeFormFields();
      let _inspectionFieldsValue = { ...this.defaultInspectionFieldsValue };
      let _inspectionRunFieldsValue = { ...this.defaultInspectionRunRelatedFields };
      let _inspectionOtherFields = { ...this.defaultOtherFieldsValue };
      _inspectionFieldsValue = this.updateInspectorsOptions(_inspectionFieldsValue);
      _inspectionOtherFields = this.updateWatchmenOptions(_inspectionOtherFields);
      _inspectionFieldsValue = this.updateFRAOptions(_inspectionFieldsValue);
      this.inspectionFields.FRAOption.config.disabled = false;
      this.inspectionFields.perTime.config.disabled = false;
      this.inspectionFields.timeFrame.config.disabled = false;
      this.inspectionFields.minDays.config.disabled = false;
      // this.daysRelatedDisableEnable(false);
      inspectionSettings.logic != "perTime" &&
        (_inspectionFieldsValue = this.changeInspectionFrequencyOptions(_inspectionFieldsValue.inspectionType, _inspectionFieldsValue));
      _inspectionRunFieldsValue = this.updateLocationOptions(_inspectionRunFieldsValue);
      this.inspectionRunRelatedFields.lineId.config.disabled = false;
      _inspectionRunFieldsValue = this.changeRunRangeFieldsBasedOnLine(_inspectionRunFieldsValue.lineId, _inspectionRunFieldsValue);
      _inspectionRunFieldsValue = this.changeInspectionRunAssets(
        _inspectionRunFieldsValue.inspectionRun,
        _inspectionRunFieldsValue.runStart,
        _inspectionRunFieldsValue.runEnd,
        _inspectionRunFieldsValue,
      );
      _inspectionRunFieldsValue = this.changeStartEndRunMP("", "", _inspectionRunFieldsValue, false, _inspectionRunFieldsValue.lineId);
      this.setInspectionFreqLabels(0);

      updateFormFieldsWithValues(this.inspectionFields, keyValueProperties, _inspectionFieldsValue);
      updateFormFieldsWithValues(this.otherInspectionFields, otherKeyValueProperties, _inspectionOtherFields);

      let alertSetupValues = this.setTemplateAlertValues(this.props.applicationlookupss);

      this.validateLocation(_inspectionRunFieldsValue.lineId);

      this.setState({
        selectedJourneyPlan: null,
        modalState: "Add",
        showRunCreation: false,
        isRunEditMode: false,
        selectedAssets: [],
        inspectionFieldsValue: _inspectionFieldsValue,
        inspectionRunFieldsValue: _inspectionRunFieldsValue,
        otherInspectionFieldStateValue: _inspectionOtherFields,
        infoValue: null,
        alertSetupValues,
        alertSetupValuesUpdated: false,
        formType: FORM_TYPES.INSPECTION,
      });
    } else if (prevProps.modalState !== this.props.modalState && this.props.modalState == "Edit") {
      this.initializeFormFields();
      const { selectedJourneyPlan } = this.props;
      let inspectionFieldStateValue = { ...this.defaultInspectionFieldsValue };
      let inspectionRunFieldsStateValue = { ...this.defaultInspectionRunRelatedFields };
      let inspectionOtherFields = { ...this.defaultOtherFieldsValue };
      let infoValue = null;
      let alertSetupValues = null;
      if (selectedJourneyPlan) {
        if (selectedJourneyPlan.alertRules) alertSetupValues = selectedJourneyPlan.alertRules;
        const userVal = selectedJourneyPlan.user ? selectedJourneyPlan.user._id : null;
        const watchmenVal = selectedJourneyPlan.watchmen ? selectedJourneyPlan.watchmen._id : null;
        for (let key in inspectionFieldStateValue) {
          selectedJourneyPlan[key] && (inspectionFieldStateValue[key] = selectedJourneyPlan[key]);
        }
        for (let key in inspectionOtherFields) {
          selectedJourneyPlan[key] && (inspectionOtherFields[key] = selectedJourneyPlan[key]);
        }
        inspectionFieldStateValue = this.updateInspectorsOptions(inspectionFieldStateValue, userVal);
        inspectionOtherFields = this.updateWatchmenOptions(inspectionOtherFields, watchmenVal);
        inspectionFieldStateValue = this.updateFRAOptions(inspectionFieldStateValue, selectedJourneyPlan.FRAOption);
        this.inspectionFields.FRAOption.config.disabled = true;

        //this.daysRelatedDisableEnable(true);
        inspectionFieldStateValue.startDate = moment(selectedJourneyPlan.startDate).format("YYYY-MM-DD");
        inspectionFieldStateValue.minDays = selectedJourneyPlan.minDays ? selectedJourneyPlan.minDays : 0;
        inspectionFieldStateValue.maxAllowable = selectedJourneyPlan.maxAllowable ? selectedJourneyPlan.maxAllowable : 0;
        inspectionFieldStateValue.perTime = selectedJourneyPlan.perTime ? selectedJourneyPlan.perTime : 0;
        inspectionFieldStateValue.timeFrame = selectedJourneyPlan.timeFrame ? selectedJourneyPlan.timeFrame : "";

        if (selectedJourneyPlan.FRAOption) {
          this.inspectionFields.perTime.config.disabled = true;
          this.inspectionFields.timeFrame.config.disabled = true;
          this.inspectionFields.minDays.config.disabled = true;

          let opt = _.find(InspectionOptionsFRA, { id: selectedJourneyPlan.FRAOption });
          if (opt) {
            infoValue = opt.info;
          }
        }
        updateFormFieldsWithValues(this.inspectionFields, keyValueProperties, inspectionFieldStateValue);
        updateFormFieldsWithValues(this.otherInspectionFields, otherKeyValueProperties, inspectionOtherFields);
        this.inspectionFields.maxAllowable.hide = true;
        //!(inspectionFieldStateValue.inspectionType == INSPECTION_TYPES.CUSTOM) || inspectionFieldStateValue.timeFrame;
        this.inspectionRunRelatedFields.lineId.config.disabled = true;

        inspectionRunFieldsStateValue = this.updateLocationOptions(inspectionRunFieldsStateValue, selectedJourneyPlan.lineId);
        inspectionRunFieldsStateValue = this.changeRunRangeFieldsBasedOnLine(
          inspectionRunFieldsStateValue.lineId,
          inspectionRunFieldsStateValue,
          selectedJourneyPlan.inspectionRun,
        );
        let runRangeOptions = getUniqueRunRangesFromLines(this.props.lineRunNumbers, inspectionRunFieldsStateValue.lineId, true);
        let planRun = _.find(runRangeOptions, { id: selectedJourneyPlan.runRanges[0].id });
        inspectionRunFieldsStateValue = this.changeInspectionRunAssets(
          selectedJourneyPlan.inspectionRun,
          planRun.mpStart,
          planRun.mpEnd,
          inspectionRunFieldsStateValue,
          selectedJourneyPlan.inspectionAssets,
        );
        inspectionRunFieldsStateValue = this.changeStartEndRunMP(
          planRun.mpStart,
          planRun.mpEnd,
          inspectionRunFieldsStateValue,
          true,
          selectedJourneyPlan.lineId,
        );

        this.setInspectionFreqLabels(inspectionFieldStateValue.inspectionFrequency);
      }
      let inspectionFrequencies = [...this.state.inspectionFrequencies];
      selectedJourneyPlan.inspectionFrequencies &&
        selectedJourneyPlan.inspectionFrequencies.length > 0 &&
        (inspectionFrequencies = selectedJourneyPlan.inspectionFrequencies);
      this.validateLocation(inspectionRunFieldsStateValue.lineId);
      this.setState({
        inspectionFieldsValue: inspectionFieldStateValue,
        inspectionRunFieldsValue: inspectionRunFieldsStateValue,
        otherInspectionFieldStateValue: inspectionOtherFields,
        selectedAssets: inspectionRunFieldsStateValue.inspectionAssets,
        showRunCreation: false,
        isRunEditMode: false,
        infoValue: infoValue,
        inspectionFrequencies,
        alertSetupValuesUpdated: false,
        alertSetupValues,
        formType: this.props.formType ? this.props.formType : FORM_TYPES.INSPECTION,
      });
      this.inspectionRunRelatedFields.inspectionRun.config.selectedValue = null;
    }
  }
  setTemplateAlertValues(applicationlookupss) {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let config = applicationlookupss.find((c) => c.code === loggedInUser._id);
    let alertSetupValues = null;
    if (config && !!config.opt1.rule2139bAlertTemplate) {
      alertSetupValues = [
        {
          field: "Rule 213.9(b) Issue 30day Expiry",
          type: "web",
          event: "before",
          unitOfTime: "minutes",
          destinations: [loggedInUser._id],
          time: "15",
          editMode: false,
          isTemplate: true,
          disableRecalculate: true,
          title: `Issue "{issueTitle}" is approaching its 30 day maintenance expiry period against Rule 213.9(b)`,
          message: `Issue "{issueTitle}" of Inspection "{modelTitle}" is approaching its 30 day maintenance expiry period against Rule 213.9(b) in {time}. Please take appropriate action`,
          reference: {
            fieldDisplayText: "Rule 213.9(b) Issue 30day Expiry",
            field: "rule2139bIssue",
          },
        },
      ];
    }

    return alertSetupValues;
  }
  changeStartEndRunMP(mpStart, mpEnd, inspectionRunFieldsStateValue, disabled, lineId) {
    if (lineId) {
      let findAsset = _.find(this.props.lineAssets, { _id: lineId });
      if (findAsset) {
        this.inspectionRunRelatedFields.runStart.validation.min = findAsset.start;
        this.inspectionRunRelatedFields.runStart.validation.max = findAsset.end;
        this.inspectionRunRelatedFields.runStart.labelText = "Start: (" + findAsset.start + " , " + findAsset.end + ")";
        this.inspectionRunRelatedFields.runEnd.labelText = "End: (" + (mpStart ? mpStart : findAsset.start) + " , " + findAsset.end + ")";
        this.inspectionRunRelatedFields.runEnd.validation.max = findAsset.end;
        this.inspectionRunRelatedFields.runEnd.validation.min = mpStart ? mpStart : findAsset.start;
      }
    }

    this.inspectionRunRelatedFields.runStart.value = mpStart;
    this.inspectionRunRelatedFields.runEnd.value = mpEnd;
    this.inspectionRunRelatedFields.runStart.touched = false;
    this.inspectionRunRelatedFields.runEnd.touched = false;
    this.inspectionRunRelatedFields.runStart.valid = mpStart ? true : false;
    this.inspectionRunRelatedFields.runEnd.valid = checkMPEndValid(mpStart, mpEnd);

    this.inspectionRunRelatedFields.inspectionRun.config.disabled = disabled;
    this.inspectionRunRelatedFields.runStart.config.disabled = disabled;
    this.inspectionRunRelatedFields.runEnd.config.disabled = disabled;
    inspectionRunFieldsStateValue.runStart = mpStart;
    inspectionRunFieldsStateValue.runEnd = mpEnd;
    return inspectionRunFieldsStateValue;
  }

  updateInspectionFields(newFields) {
    this.inspectionFields = newFields.inspectionFields;
    let newInspectionFields = this.updateFieldsToState(newFields.inspectionFields);
    newInspectionFields = this.checkChangesToPerformInInspectionFields(newFields.inspectionFields, newInspectionFields);

    this.setState({
      inspectionFieldsValue: newInspectionFields,
    });
  }
  updateOtherInspectionFields(newFields) {
    this.otherInspectionFields = newFields.otherInspectionFields;
    let newOtherFields = this.updateFieldsToState(newFields.otherInspectionFields);
    this.setState({
      otherInspectionFieldStateValue: newOtherFields,
    });
  }
  updateInspectionRunRelatedFields(newRunRelatedFields) {
    this.inspectionRunRelatedFields = newRunRelatedFields.inspectionRunRelatedFields;
    let newInspectionRunFields = this.updateFieldsToState(newRunRelatedFields.inspectionRunRelatedFields);
    newInspectionRunFields = this.checkChangesToPerformInInspectionRunRelatedFields(
      newRunRelatedFields.inspectionRunRelatedFields,
      newInspectionRunFields,
    );
    this.setState({
      inspectionRunFieldsValue: newInspectionRunFields,
    });
  }

  checkChangesToPerformInInspectionFields(newFields, newInspectionFields) {
    // change inspection type based on frequency type
    newFields.inspectionType.value !== this.state.inspectionFieldsValue.inspectionType &&
      (newInspectionFields = this.changeInspectionFrequencyOptions(newFields.inspectionType.value, newInspectionFields));
    newFields.inspectionFrequency.value !== this.state.inspectionFieldsValue.inspectionFrequency &&
      (newInspectionFields = this.updateTextWithInspectionFreq(newFields.inspectionFrequency.value, newInspectionFields));
    !newFields.maxAllowable.hide &&
      (newFields.maxAllowable.value !== this.state.inspectionFieldsValue.maxAllowable ||
        newFields.inspectionFrequency.value !== this.state.inspectionFieldsValue.inspectionFrequency) &&
      (newInspectionFields = this.checkMaxInspectionFrequency(newFields.maxAllowable.value, newInspectionFields));

    newFields.FRAOption.value !== this.state.inspectionFieldsValue.FRAOption &&
      (newInspectionFields = this.onChangeFRAOption(newFields.FRAOption.value, newInspectionFields));
    return newInspectionFields;
  }

  onChangeFRAOption(FRAOptVal, newInspectionFields) {
    if (FRAOptVal) {
      let opt = _.find(InspectionOptionsFRA, { id: FRAOptVal });
      if (opt) {
        let inspectionFields = this.inspectionFields;
        newInspectionFields.minDays = opt.minDays;
        newInspectionFields.perTime = opt.perTime;
        newInspectionFields.timeFrame = opt.timeFrame;

        inspectionFields.minDays.value = opt.minDays;
        inspectionFields.perTime.value = opt.perTime;
        inspectionFields.timeFrame.value = opt.timeFrame;
        this.setState({
          infoValue: opt.info,
        });
      }
    } else {
      newInspectionFields.minDays = 0;
      newInspectionFields.perTime = 0;
      newInspectionFields.timeFrame = "";

      inspectionFields.minDays.value = 0;
      inspectionFields.perTime.value = 0;
      inspectionFields.timeFrame.value = "";

      this.setState({ infoValue: null });
    }
    //console.log(newInspectionFields);
    return newInspectionFields;
  }
  daysRelatedDisableEnable(value) {
    let inspectionFields = this.inspectionFields;
    inspectionFields.inspectionFrequency.config.disabled = value;
    inspectionFields.inspectionType.config.disabled = value;
    inspectionFields.maxAllowable.config.disabled = value;
    inspectionFields.minDays.config.disabled = value;
  }
  changeInspectionFrequencyOptions(inspectionType, newInspectionFields) {
    let inspectionFields = this.inspectionFields;
    if (inspectionType == INSPECTION_TYPES.FIXED) {
      newInspectionFields = { ...newInspectionFields, inspectionType: INSPECTION_TYPES.FIXED };
      inspectionFields.maxAllowable.hide = true;
      inspectionFields.maxAllowable.valid = true;
    }
    if (inspectionType == INSPECTION_TYPES.CUSTOM) {
      newInspectionFields = { ...newInspectionFields, inspectionType: INSPECTION_TYPES.CUSTOM };
      newInspectionFields.maxAllowable = newInspectionFields.inspectionFrequency;
      inspectionFields.maxAllowable.hide = false;
      inspectionFields.maxAllowable.value = newInspectionFields.inspectionFrequency;
      inspectionFields.maxAllowable.labelText = `${languageService("Must be performed once within")} ${
        newInspectionFields.maxAllowable
      } ${languageService("days")}`;
    }
    return newInspectionFields;
  }

  setInspectionFreqLabels(freqValue) {
    let inspectionFields = this.inspectionFields;
    let options = [...inspectionFields.inspectionType.config.options];
    options[0].text = `${languageService("Inspection recurs at day")} ${freqValue}`;
    options[1].text = `${languageService("Inspection due at day")} ${freqValue}`;
    inspectionFields.inspectionType.config = { ...inspectionFields.inspectionType.config, options: options };
  }

  updateTextWithInspectionFreq(freqValue, newInspectionFields) {
    this.setInspectionFreqLabels(freqValue);
    !inspectionFields.maxAllowable.hide &&
      inspectionFields.maxAllowable < freqValue &&
      (inspectionFields.maxAllowable.valid =
        (newInspectionFields.maxAllowValue ? parseInt(newInspectionFields.maxAllowValue) : 0) > freqValue);
    return newInspectionFields;
  }

  checkMaxInspectionFrequency(maxAllowableVal, newInspectionFields) {
    let inspectionFields = this.inspectionFields;
    let maxAllowValue = maxAllowableVal ? parseInt(maxAllowableVal) : "";
    let inspectionFreqVal = newInspectionFields.inspectionFrequency ? parseInt(newInspectionFields.inspectionFrequency) : 0;
    const maxAllowValLessThenInspectionFreq = (maxAllowValue ? maxAllowValue : 0) >= inspectionFreqVal;
    inspectionFields.maxAllowable.validation.min = inspectionFreqVal;
    inspectionFields.maxAllowable.value = maxAllowValue;
    inspectionFields.maxAllowable.valid = maxAllowValLessThenInspectionFreq;
    inspectionFields.maxAllowable.labelText = `${languageService("Must be performed once within")} ${maxAllowValue} ${languageService(
      "days",
    )}`;
    newInspectionFields = { ...newInspectionFields, maxAllowable: maxAllowValue };
    return newInspectionFields;
  }

  checkChangesToPerformInInspectionRunRelatedFields(newRunRelatedFields, newInspectionRunFields) {
    // change run range fields based on line
    if (newRunRelatedFields.lineId.value !== this.state.inspectionRunFieldsValue.lineId) {
      // validate the selected location and display the list of problems if there are any.
      this.validateLocation(newRunRelatedFields.lineId.value);

      newInspectionRunFields = this.changeRunRangeFieldsBasedOnLine(newRunRelatedFields.lineId.value, newInspectionRunFields);
      newInspectionRunFields = this.changeStartEndRunMP("", "", newInspectionRunFields, false, newRunRelatedFields.lineId.value);
    }
    // change assets based on run range selected
    // newRunRelatedFields.inspectionRun.value !== this.state.inspectionRunFieldsValue.inspectionRun &&

    let existingRunMatch = _.find(newRunRelatedFields.inspectionRun.config.options, { val: newRunRelatedFields.inspectionRun.value });
    if (existingRunMatch) {
      newRunRelatedFields.inspectionRun.config.selectedValue = existingRunMatch;
    } else if (this.inspectionRunChangeCheck(newRunRelatedFields)) {
      newInspectionRunFields = this.changeStartEndRunMP(
        newRunRelatedFields.runStart.value,
        newRunRelatedFields.runEnd.value,
        newInspectionRunFields,
        false,
        newRunRelatedFields.lineId.value,
      );
      newInspectionRunFields = this.changeInspectionRunAssets(
        newRunRelatedFields.inspectionRun.value,
        newRunRelatedFields.runStart.value,
        newRunRelatedFields.runEnd.value,
        newInspectionRunFields,
      );
    }
    return newInspectionRunFields;
  }
  validateLocation(lineId) {
    let problems = this.validatePlannableLocation(lineId);
    if (problems && problems.length > 0) {
      this.setState({ lineProblems: problems, showProblemsDlg: true }); // display problems on console for now
      //console.log("Selected Location Has Issues:");
      //console.log(problems);
    } else {
      this.setState({ lineProblems: [], showProblemsDlg: false });
    }
  }
  inspectionRunChangeCheck(newRunRelatedFields) {
    const inspectionRunValChange = newRunRelatedFields.inspectionRun.value !== this.state.inspectionRunFieldsValue.inspectionRun;
    const inspectionRunStartChange = newRunRelatedFields.runStart.value !== this.state.inspectionRunFieldsValue.runStart;
    const inspectionRunEndChange = newRunRelatedFields.runEnd.value !== this.state.inspectionRunFieldsValue.runEnd;
    return inspectionRunValChange || inspectionRunStartChange || inspectionRunEndChange ? true : false;
  }

  changeRunRangeFieldsBasedOnLine(locValue, newInspectionRunFields, activeValue) {
    let inspectionRunFields = this.inspectionRunRelatedFields;
    let runRangeOptions = getUniqueRunRangesFromLines(this.props.lineRunNumbers, locValue);
    let runValue = activeValue ? activeValue : "";
    inspectionRunFields.inspectionRun.config.options = runRangeOptions;
    // check if no run range exist for location then auto fill the field with location name
    if (!runRangeOptions.length && !runValue) {
      let loc = _.find(this.inspectionRunRelatedFields.lineId.config.options, { val: locValue });
      runValue = loc.text;
      inspectionRunFields.runStart.value = loc.start;
      inspectionRunFields.runEnd.value = loc.end;
      this.state.selectedRunRange = false;
      inspectionRunFields.inspectionRun.config.selectedValue = null;
    }
    // check if only 1 run range exist for that location then select it auto

    inspectionRunFields.inspectionRun.value = runValue;

    inspectionRunFields.inspectionRun.valid = runValue !== "";
    if (runRangeOptions && runRangeOptions.length == 1) {
      inspectionRunFields.inspectionRun.config.selectedValue = inspectionRunFields.inspectionRun.config.options[0];
    } else {
      inspectionRunFields.inspectionRun.config.selectedValue = null;
    }
    newInspectionRunFields = { ...newInspectionRunFields, inspectionRun: runValue };
    return newInspectionRunFields;
  }

  changeInspectionRunAssets(runValue, runStart, runEnd, newInspectionRunFields, activeValue) {
    let inspectionRunFields = this.inspectionRunRelatedFields;
    let _options = [];

    if (runValue && (runStart || runEnd) && runEnd) {
      let _start = parseFloat(runStart);
      let _end = parseFloat(runEnd);
      this.getOptionsArray(newInspectionRunFields.lineId, _start, _end, _options);
    }

    inspectionRunFields.inspectionAssets.config.options = _options;
    inspectionRunFields.inspectionAssets.config.onAssetChange = this.handleAssetChange;
    inspectionRunFields.inspectionAssets.value = activeValue ? activeValue : [];
    inspectionRunFields.inspectionAssets.valid = true;
    newInspectionRunFields = { ...newInspectionRunFields, inspectionAssets: activeValue ? activeValue : [] };
    return newInspectionRunFields;
  }

  updateInspectorsOptions(_inspectionFieldsValue, activeValue) {
    let resultValue = updateGenericOptionsWithValue(
      [...this.props.supervisors, ...this.props.inspectors],
      "_id",
      "name",
      "user",
      this.inspectionFields,
      activeValue,
    );

    _inspectionFieldsValue = { ..._inspectionFieldsValue, user: resultValue };

    return _inspectionFieldsValue;
  }
  updateFRAOptions(_inspectionFieldsValue, activeValue) {
    let resultValue = updateGenericOptionsWithValue(
      InspectionOptionsFRA,
      "id",
      "name",
      "FRAOption",
      this.inspectionFields,
      activeValue,
      true,
      "Custom",
    );
    _inspectionFieldsValue = { ..._inspectionFieldsValue, FRAOption: resultValue };
    return _inspectionFieldsValue;
  }
  updateWatchmenOptions(_inspectionFieldsValue, activeValue) {
    let resultValue = updateGenericOptionsWithValue(
      this.props.inspectors,
      "_id",
      "name",
      "watchmen",
      this.otherInspectionFields,
      activeValue,
      true,
    );
    this.otherInspectionFields.watchmen.valid = true;
    _inspectionFieldsValue = { ..._inspectionFieldsValue, watchmen: resultValue };

    return _inspectionFieldsValue;
  }
  updateLocationOptions(_inspectionRunFieldsValue, activeValue) {
    let locValue = updateGenericOptionsWithValue(
      this.props.lineAssets,
      "_id",
      "unitId",
      "lineId",
      this.inspectionRunRelatedFields,
      activeValue,
    );
    _inspectionRunFieldsValue = { ..._inspectionRunFieldsValue, lineId: locValue };
    this.inspectionRunRelatedFields.lineId.valid = locValue !== "";

    return _inspectionRunFieldsValue;
  }

  updateFieldsToState(newFields) {
    let stateFields = {};
    let fieldKeys = Object.keys(newFields);
    fieldKeys.forEach((fKey) => {
      stateFields[fKey] = newFields[fKey].value;
    });
    return stateFields;
  }

  getOptionsArray = (lineId, start, end, existingOptions) => {
    let assetTree = this.props.assets.assetTree;
    let lineNode = findTreeNode(assetTree, lineId);
    let resultObj = groupTreeNodeByProperty(lineNode, "assetType", {});
    let options = existingOptions || [];
    Object.keys(resultObj).map((key, index) => {
      let existObj = _.find(options, { label: key });
      let obj = existObj || {};
      obj["label"] = key;
      let optArray = resultObj[key].map((item, i) => {
        if (item.inspectable) {
          if (start !== undefined && end !== undefined) {
            let asset = _.filter(this.props.assets.assetsList, (v) => v._id === item._id);
            if (asset.length > 0) {
              asset = asset[0];
            } else {
              asset = undefined;
            }
            if (asset) {
              if (
                (asset.start >= start && asset.end <= end) ||
                (asset.start >= start && asset.start <= end) ||
                (asset.end >= start && asset.end <= end) ||
                (start >= asset.start && end <= asset.end) ||
                asset.assetType == "Yard Track"
              ) {
                return obj["options"]
                  ? !_.find(obj["options"], { value: item._id }) && { value: item._id, label: item.unitId }
                  : { value: item._id, label: item.unitId };
              }
            }
          }
        }
      });
      let newOptions = optArray.filter((v) => v);
      obj["options"] = obj["options"] ? [...obj["options"], ...newOptions] : newOptions;
      if (obj["options"].length > 0 && !existObj) {
        options.push(obj);
      }
    });
    return options;
  };

  handleSubmit() {
    let inspectionFieldsValue = { ...this.state.inspectionFieldsValue };
    let inspectionRunFieldsStateValue = { ...this.state.inspectionRunFieldsValue };
    let otherInspectionFieldStateValue = { ...this.state.otherInspectionFieldStateValue };
    let submitData, filteredAssets, rrangesDataToSend, formValid;

    if (this.state.lineProblems && this.state.lineProblems.length > 0) return;
    processFromFields(this.inspectionFields);
    processFromFields(this.inspectionRunRelatedFields);
    processFromFields(this.otherInspectionFields);
    formValid = checkFormIsValid(this.inspectionFields);
    formValid = checkFormIsValid(this.inspectionRunRelatedFields) && formValid;
    formValid = checkFormIsValid(this.otherInspectionFields) && formValid;

    // TODO Check inspection frequencies validation before sending
    if (formValid) {
      // let alertSetupValues = this.state.alertSetupValues;

      let alertSetupValues = null;

      if (this.props.modalState === "Edit")
        alertSetupValues = this.state.alertSetupValuesUpdated ? this.state.alertSetupValues : this.props.selectedJourneyPlan.alertRules;
      else alertSetupValues = this.state.alertSetupValues;

      submitData = {
        ...this.state.inspectionFieldsValue,
        ...this.state.inspectionRunFieldsValue,
        ...this.state.otherInspectionFieldStateValue,
      };

      // Object.keys(alertSetupValues).map(key =>{
      //   if (key in submitData) {
      //     alertSetupValues[key].eventExactDate = submitData[key];
      //   }
      // });

      const formatTime = "YYYY-MM-DD HH:mm";
      const user = this.props.userList.find((inspector) => inspector._id === submitData.user);
      const watchmen = this.props.inspectors.find((inspector) => inspector._id === submitData.watchmen);
      const { assetsList, assetsTypes } = this.props.assets;
      filteredAssets = getFilteredAsset(assetsList, assetsTypes, {
        location: true,
        plannable: true,
      });
      const line = filteredAssets.find((ln) => ln._id === submitData.lineId);
      rrangesDataToSend = [
        {
          runId: submitData.inspectionRun,
          runStart: submitData.runStart,
          runEnd: submitData.runEnd,
          isNew: this.state.selectedRunRange ? false : true,
          runParentId: this.state.selectedRunRange ? this.state.selectedRunRange.runParentId : null,
          id: this.state.selectedRunRange ? this.state.selectedRunRange.id : null,
        },
      ];

      // // send only Ids to backend
      // rrangesDataToSend = rranges.map(rr => {
      //   return { id: rr.id, runId: rr.runId, runParentId: rr.runParentId };
      // });
      let startDateAuto =
        this.props.selectedJourneyPlan && this.props.selectedJourneyPlan.startDate
          ? this.props.selectedJourneyPlan.startDate
          : moment().startOf("week").format();
      submitData = {
        ...submitData,
        user: user ? { _id: user._id, name: user.name, email: user.email } : "",
        watchmen: watchmen ? { _id: watchmen._id, name: watchmen.name, email: watchmen.email } : "",
        startDate: startDateAuto,
        runRanges: rrangesDataToSend,
        inspectionFrequencies: this.state.inspectionFrequencies,
      };

      // Map event date in alertRules;
      if (alertSetupValues) {
        alertSetupValues.forEach((al, index) => {
          alertSetupValues[index].eventExactDate = submitData[al.field];
        });
      }

      submitData = {
        ...submitData,
        alertSetupValues,
      };

      //console.log("submitData", submitData);
      this.props.modalState === "Add" && this.props.handleAddSubmit(submitData);
      this.props.modalState === "Edit" && this.props.handleEditSubmit(submitData);
      this.props.toggle("None", null);
      inspectionFieldsValue = { ...this.defaultInspectionFieldsValue };
      inspectionRunFieldsStateValue = { ...this.defaultInspectionRunRelatedFields };
      otherInspectionFieldStateValue = { ...this.defaultOtherFieldsValue };
    } else {
      this.setFormValidation(this.inspectionFields);
      this.setFormValidation(this.inspectionRunRelatedFields);
    }
    this.setState({
      inspectionFieldsValue: inspectionFieldsValue,
      inspectionRunFieldsStateValue: inspectionRunFieldsStateValue,
      otherInspectionFieldStateValue: otherInspectionFieldStateValue,
      infoValue: null,
      inspectionFrequencies: [{ ...freqObj, id: guid() }],
    });
  }

  handleAssetChange = (selected) => {
    const { inspectionRunFieldsValue } = this.state;
    const _inspectionRunFieldsValue = {
      ...inspectionRunFieldsValue,
      inspectionAssets: selected,
    };
    let inspectionRunFields = this.inspectionRunRelatedFields;
    inspectionRunFields.inspectionAssets.value = _inspectionRunFieldsValue.inspectionAssets;
    inspectionRunFields.inspectionAssets.valid = _inspectionRunFieldsValue.inspectionAssets.length > 0 ? true : false;
    this.setState({ selectedAssets: selected, inspectionRunFieldsValue: _inspectionRunFieldsValue });
  };
  handleClose = () => {
    this.setState({
      modalState: "None",
      selectedAssets: [],
      showDuplicatePlanText: false,
      inspectionFieldsValue: _.cloneDeep(this.defaultInspectionFieldsValue),
      inspectionRunFieldsValue: _.cloneDeep(this.defaultInspectionRunRelatedFields),
      inspectionFrequencies: [{ ...freqObj, id: guid() }],
      formType: FORM_TYPES.INSPECTION,
    });
    this.props.toggle("None", null);
  };

  setFormValidation = (data) => {
    const msg = languageService("Validation failed") + ": ";
    for (let key in data) {
      data[key].touched = true;
      if (!data[key].validationMessage.startsWith(msg)) data[key].validationMessage = msg + data[key].validationMessage;
    }
  };

  validatePlannableLocation(lineId) {
    let problems = [];
    if (!this.props.lineAssets || this.props.lineAssets.length === 0) {
      problems.push("Invalid location. Location collection is empty.");
    } else {
      let plocation = _.find(this.props.lineAssets, { _id: lineId });
      if (plocation) {
        if (!(plocation.attributes && plocation.attributes.geoJsonCord)) {
          problems.push("Location doesn't contain GIS data. No geojson.");
        }

        // if (!plocation.childAsset || plocation.childAsset.length === 0) {
        //   problems.push("This location does not contain any assets.");
        // }
      } else {
        problems.push("Invalid location. It does not exist in collection.");
      }
    }

    return problems;
  }

  handleSwitchForms(formType) {
    this.setState({ formType });
  }

  handleAlertFormAction(actionObject) {
    if (actionObject.type === "cancel") this.setState({ formType: FORM_TYPES.INSPECTION });
    if (actionObject.type === "add") {
      this.setState({
        alertSetupValues: actionObject.data,
        formType: FORM_TYPES.INSPECTION,
        alertSetupValuesUpdated: true,
      });
    }
  }

  render() {
    let headerText = "Add Inspection Plan";
    let alertFields = ["nextExpiryDate", "lastInspection"];
    let timpsSignalApp = versionInfo.isSITE();

    // if (!timpsSignalApp) alertFields.push("Rule 213.9(b) Issue 30day Expiry");

    if (this.state.formType === FORM_TYPES.INSPECTION) {
      if (this.props.modalState === "Edit") headerText = "Update Inspection Plan";
    } else if (this.state.formType === FORM_TYPES.ALERT_SETUP || this.state.formType === FORM_TYPES.ALERT_SETUP_VIEW_ONLY_MODE) {
      headerText = languageService("Setup alert for inspection");
    }

    return (
      <Modal
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        contentClassName={themeService({ default: this.props.className, retro: "retro" })}
        style={{ maxWidth: "98vw" }}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {languageService(headerText)}
        </ModalHeader>

        <ModalBody style={{ ...themeService(CommonModalStyle.body), minHeight: "350px" }}>
          {this.state.formType === FORM_TYPES.INSPECTION && (
            <div className={"commonform"}>
              <Row>
                <Col md={6}>
                  <FormFields
                    inspectionFields={this.inspectionFields}
                    fieldTitle={"inspectionFields"}
                    change={this.updateInspectionFields}
                  />
                  {/* <FreqArea
                    frequenciesChangeHandler={this.handleInspectionFrequenciesAreaChange}
                    inspectionFrequencies={this.state.inspectionFrequencies}
                  /> */}
                  <FormFields
                    otherInspectionFields={this.otherInspectionFields}
                    fieldTitle={"otherInspectionFields"}
                    change={this.updateOtherInspectionFields}
                  />
                  {/* {this.state.infoValue && <InfoContainer value={this.state.infoValue} />} */}
                </Col>
                <Col md={6}>
                  <FormFields
                    inspectionRunRelatedFields={this.inspectionRunRelatedFields}
                    fieldTitle={"inspectionRunRelatedFields"}
                    change={this.updateInspectionRunRelatedFields}
                  />
                </Col>
              </Row>
              {/* <Row>
              <Col md={12}>
                <FreqArea
                  frequenciesChangeHandler={this.handleInspectionFrequenciesAreaChange}
                  inspectionFrequencies={this.state.inspectionFrequencies}
                />
              </Col>
            </Row> */}
            </div>
          )}

          {(this.state.formType === FORM_TYPES.ALERT_SETUP || this.state.formType === FORM_TYPES.ALERT_SETUP_VIEW_ONLY_MODE) && (
            <AlertSetupForm
              fields={alertFields}
              handleAction={this.handleAlertFormAction}
              users={[...this.props.userList]}
              alertRules={this.state.alertSetupValues}
              formType={this.state.formType}
              handleClose={this.handleClose}
            />
          )}
          {this.state.formType == FORM_TYPES.INSPECTION && this.state.showProblemsDlg && this.state.lineProblems.length > 0 && (
            <ProblemsView problems={this.state.lineProblems} />
          )}
        </ModalBody>
        <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          {this.state.formType === FORM_TYPES.INSPECTION && (
            <MyButton
              onClick={() => this.handleSwitchForms(FORM_TYPES.ALERT_SETUP)}
              type="submit"
              style={themeService(ButtonStyle.commonButton)}
            >
              {languageService("Alerts")}
            </MyButton>
          )}

          {this.state.formType === FORM_TYPES.INSPECTION && (
            <React.Fragment>
              {this.props.modalState === "Add" && (
                <MyButton onClick={this.handleSubmit} type="submit" style={themeService(ButtonStyle.commonButton)}>
                  {languageService("Add")}
                </MyButton>
              )}
              {this.props.modalState === "Edit" && (
                <MyButton onClick={this.handleSubmit} type="submit" style={themeService(ButtonStyle.commonButton)}>
                  {languageService("Update")}
                </MyButton>
              )}
              <MyButton type="button" onClick={this.handleClose} style={themeService(ButtonStyle.commonButton)}>
                {languageService("Cancel")}
              </MyButton>
            </React.Fragment>
          )}
        </ModalFooter>
      </Modal>
    );
  }

  // handleShowAddNewRunRange(showFields, isEditMode = false) {
  //   let inspectionPlanFields = this.handleGetUpdatedCommonFields(this.state.inspectionPlanFields, showFields);

  //   if (isEditMode) {
  //     inspectionPlanFields.runId.value = inspectionPlanFields.inspectionRun.value;
  //   } else {
  //     inspectionPlanFields.runId.value = "";
  //   }

  //   this.setState({
  //     showRunCreation: showFields,
  //     isRunEditMode: isEditMode,
  //     inspectionPlanFields: inspectionPlanFields,
  //   });
  // }

  // handleUpdateRunRange() {
  //   let { inspectionPlanFields } = this.state;
  //   inspectionPlanFields.inspectionAssets.valid = true;

  //   let formIsValid = checkFormIsValid(inspectionPlanFields);

  //   if (formIsValid) {
  //     let runRangeObject = processRangeFieldsFromVariables(this.state.inspectionPlanFields, this.state.inspectionTitleFields);

  //     this.props.createRunDetail({
  //       run_id: null,
  //       range: runRangeObject,
  //     });
  //   } else {
  //     this.setFormValidation(inspectionPlanFields, "inspectionPlanFields");
  //   }
  // }
}

const getAssets = curdActions.getAssets;
const createRunDetail = curdActions.createRunDetail;
const getApplicationlookupss = curdActions.getApplicationlookupss;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getAssets, createRunDetail, getAssetLinesWithSelf, getApplicationlookupss },
};

let variables = {
  assetReducer: { assets: [] },
  assetHelperReducer: {
    lineAssets: [],
    inspectableUserAssets: [],
  },
  runDetailReducer: { runDetail: null },
  applicationlookupsReducer: {
    applicationlookupss: [],
  },
};

let AddJourneyPlanContainer = CRUDFunction(JourneyPlanAdd, "addJourneyPlan", actionOptions, variables, [
  "assetReducer",
  "runDetailReducer",
  "assetHelperReducer",
  "applicationlookupsReducer",
]);
export default AddJourneyPlanContainer;

function checkMPEndValid(mpStart, mpEnd) {
  let mpStartNum = mpStart ? parseFloat(mpStart) : 0;
  let mpEndNum = mpEnd ? parseFloat(mpEnd) : 0;
  return mpEnd && mpEndNum >= mpStartNum ? true : false;
}

const InfoContainer = (props) => {
  return (
    <p
      style={{
        background: retroColors.fifth,
        border: "1px solid #00000033",
        fontSize: "12px",
        padding: " 10px 15px",
      }}
    >
      {props.value}
    </p>
  );
};
