import React, { Component } from "react";
import { getLanguageLocal, languageService } from "../../../Language/language.service";
import { themeService } from "../../../theme/service/activeTheme.service";
import { formFeildStyle } from "../../../wigets/forms/style/formFields";
import InspectionFreqRow, { freqObj } from "../../WorkPlanTemplate/JourneyPlanAddEdit/JourneyPlanFrequency/InspectionFreqRow";
import DayPickerInput from "react-day-picker/DayPickerInput";
import moment from "moment";
import { MyButton } from "../../Common/Forms/formsMiscItems";
import { ButtonStyle } from "../../../style/basic/commonControls";
import { GITestStyle } from "./style/GITestStyle";
import MomentLocaleUtils from "react-day-picker/moment";
import _ from "lodash";
import CommonModal from "../../Common/CommonModal";
import { reportsPreview } from "./reportsPreview";
import AssetTestContainer from "../../AssetTests/AssetTests";
import AssetTestCreateConfigContainer from "./AssetTestCreateConfigContainer";

const defaultFormVal = {
  name: "",
  inspectionFreq: { ...freqObj },
  instructionFile: "",
  startDate: "",
  test: "",
  inspectionType: "traversed",
};

export default class AddTestsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formField: { ...defaultFormVal },
      validationMsgs: {
        name: { required: "", custom: "" },
        //   instructionFile: { required: "", custom: "" },
        startDate: { required: "", custom: "" },
        test: { required: "", custom: "" },
      },
      testsOptions: [],
      instructionOptions: [],
      allValid: true,
      previewOption: false,
      previewCode: "",
      assetsList: null,
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.frequenciesChangeHandler = this.frequenciesChangeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showPreview = this.showPreview.bind(this);
    this.setModalOpener = this.setModalOpener.bind(this);
    this.setConfigAssetsModalOpener = this.setConfigAssetsModalOpener.bind(this);
    this.setAddAssetTestConfig = this.setAddAssetTestConfig.bind(this);
    this.receiveToggleMethod = this.receiveToggleMethod.bind(this);
    this.setAssetsConfigLIst = this.setAssetsConfigLIst.bind(this);
    this.setLocationOptions = this.setLocationOptions.bind(this);
  }
  changeHandler(e, blur) {
    let formField = { ...this.state.formField };
    formField[e.target.name] = e.target.value;
    let instructionOptions = [...this.state.instructionOptions];
    const { appFormsTests } = this.props;
    if (e.target.name == "test" && appFormsTests) {
      instructionOptions = [];
      let selectedForm = _.find(appFormsTests, { code: e.target.value });
      if (selectedForm) {
        this.setState({ previewOption: reportsPreview(selectedForm.code) ? true : false, previewCode: selectedForm.code });
        //this.setState({ previewOption: true, previewCode: selectedForm.code });
        selectedForm.opt2.allowedInstruction &&
          selectedForm.opt2.allowedInstruction.forEach((instruc) => {
            instructionOptions.push({ text: instruc, val: instruc });
            instructionOptions[0] && (formField.instructionFile = instructionOptions[0].val);
          });
      } else {
        this.setState({ previewOption: false, previewCode: "" });
      }
    }
    // if (e.target.name == "startDate") {
    //   formField[e.target.name] = Date.UTC(e.target.value);
    // }
    if (blur) {
      // TODO : validation on blur
    } else {
      // TODO : basic validation
    }
    let assetsListChange = e.target.name === "startDate" ? { assetsList: null } : {};
    this.setState({
      formField: formField,
      instructionOptions: instructionOptions,
      allValid: true,
      ...assetsListChange,
    });
  }
  showPreview(code) {
    this.openModelMethod && this.openModelMethod();
  }

  frequenciesChangeHandler(newFreqRowObj, index, remove) {
    let formField = { ...this.state.formField };
    formField.inspectionFreq = newFreqRowObj;

    this.setState({
      formField: formField,
    });
  }
  componentDidMount() {
    this.calculateValues();
  }
  componentDidUpdate(prevProps, prevState) {
    const { formMode } = this.props;
    const { appFormsTests } = this.props;
    if (formMode && formMode !== prevProps.formMode) {
      this.calculateValues();
    } else if (formMode && appFormsTests && appFormsTests !== prevProps.appFormsTests) {
      this.calculateValues();
    } else if (formMode == "Edit" && this.props.selectedTest && prevProps.selectedTest !== this.props.selectedTest) {
      this.calculateValues();
    }
  }
  calculateValues() {
    const { formMode } = this.props;
    const { appFormsTests } = this.props;
    const { selectedTest } = this.props;
    let formField = { ...defaultFormVal };

    let instructionOptions = [];
    let testsOptions = [];
    if (formMode == "Edit" && selectedTest && selectedTest.opt2.config) {
      let findAssetType = _.find(selectedTest.opt2.config, (aTypeConfig) => {
        return this.props.selectedAssetType && aTypeConfig.assetType == this.props.selectedAssetType.assetType;
      });
      if (findAssetType) {
        formField = { ...findAssetType, ...{ inspectionFreq: findAssetType.inspectionFreq } };
        formField.instructionFile = findAssetType.instructionFile[0];
        formField.startDate = findAssetType.inspectionFreq.startDate;
        formField.test = selectedTest.code;
        selectedTest.opt2 &&
          selectedTest.opt2.allowedInstruction &&
          selectedTest.opt2.allowedInstruction.forEach((instruc) => {
            instructionOptions.push({ text: instruc, val: instruc });
          });
        testsOptions.push({ text: selectedTest.description, val: formField.test });
        // if (findAssetType.assetTypeClassify && this.props.selectedAssetType.assetTypeClassify == "linear") {
        //   formField.inspectionType == "traversed";
        // }
      }
      this.setState({
        previewOption: reportsPreview(selectedTest.code) ? true : false,
        previewCode: selectedTest.code,
        showCurentAssetTests: true,
        assetsList: null,
      });

      //this.setState({ previewOption: true, previewCode: selectedTest.code });
    } else {
      this.setState({ previewOption: false, previewCode: "", showCurentAssetTests: false, assetsList: null });
    }
    appFormsTests &&
      appFormsTests.forEach((form, index) => {
        if (form.opt2 && form.opt2.config) {
          let findAssetType = _.find(form.opt2.config, (aTypeConfig) => {
            return this.props.selectedAssetType.assetType && aTypeConfig.assetType == this.props.selectedAssetType.assetType;
          });
          if (!findAssetType) testsOptions.push({ text: form.description, val: form.code });
        }
        // if (index == 0 && formMode !== "Edit") {
        //   form.opt2.allowedInstruction.forEach((instruc) => {
        //     instructionOptions.push({ text: instruc, val: instruc });
        //   });
        // }
      });

    this.setState({
      formField: formField,
      instructionOptions,
      testsOptions,
      allValid: true,
    });
  }
  handleSubmit() {
    let isValid = this.validateFields();
    if (isValid) {
      let formField = { ...this.state.formField };
      formField.instructionFile = [formField.instructionFile];
      formField.inspectionFreq.startDate = formField.startDate;
      formField.assetsList = this.state.assetsList;
      this.props.handleAddEditTest(formField);
    }
  }

  validateFields() {
    let allValid = true;
    let objKeys = Object.keys(this.state.validationMsgs);
    let validationMsgs = _.cloneDeep(this.state.validationMsgs);
    objKeys.forEach((fieldName) => {
      let isFieldValid = true;
      !this.state.formField[fieldName] && (isFieldValid = false);
      if (isFieldValid) {
        validationMsgs[fieldName].required = false;
        validationMsgs[fieldName].custom = "";
      } else {
        allValid = false;
        validationMsgs[fieldName].required = true;
      }
    });
    this.setState({
      validationMsgs: validationMsgs,
      allValid: false,
    });
    return allValid;
  }
  setModalOpener(method) {
    this.openModelMethod = method;
  }
  setConfigAssetsModalOpener(method) {
    this.openAssetConfigModel = method;
    //console.log("::" + this.state.formField.name);
  }
  setAddAssetTestConfig(method) {
    this.openAddAssetConfigModel = method;
  }
  receiveToggleMethod(state, field) {
    let stateObj = {};
    stateObj[field] = state;
    if (state === false) {
      this.setState(stateObj);
    }
  }
  setAssetsConfigLIst(assetsList) {
    this.setState({
      assetsList: assetsList,
    });
  }
  setLocationOptions(locations) {
    this.setState({ locations: locations });
  }
  render() {
    return (
      <div className="card" style={{ margin: " 0 10px 0 0" }}>
        <AddAssetTestHeader
          showCurentAssetTests={true}
          openAssetConfigModel={this.props.formMode == "Add" ? this.openAddAssetConfigModel : this.openAssetConfigModel}
          showConfigSetState={
            this.props.formMode === "Add"
              ? (state) => this.setState({ showCreateAssetTestConfig: state })
              : (state) => this.setState({ showConfigAssetsModel: state })
          }
          disabled={this.props.formMode === "Add" && !this.state.formField.startDate}
        />

        <div className="card-body">
          <LabelWithFieldWrapper label={languageService("Name") + " *"}>
            <InputField
              inputFieldProps={{ name: "name", type: "text" }}
              changeHandler={this.changeHandler}
              value={this.state.formField.name}
              validation={this.state.validationMsgs.name}
            />
          </LabelWithFieldWrapper>
          <LabelWithFieldWrapper label={languageService("Test") + " *"}>
            <SelectField
              inputFieldProps={{ name: "test", disabled: this.props.formMode == "Add" ? false : true, id: "test" }}
              addEmptyOption={this.props.formMode == "Add" ? true : false}
              options={this.state.testsOptions}
              changeHandler={this.changeHandler}
              value={this.state.formField.test}
              validation={this.state.validationMsgs.test}
              previewOption={this.state.previewOption}
              previewCode={this.state.previewCode}
              showPreview={this.showPreview}
            />
          </LabelWithFieldWrapper>
          <LabelWithFieldWrapper label={languageService("Instruction File")}>
            <SelectField
              inputFieldProps={{ name: "instructionFile" }}
              options={this.state.instructionOptions}
              changeHandler={this.changeHandler}
              value={this.state.formField.instructionFile}
            />
          </LabelWithFieldWrapper>

          {this.props.selectedAssetType && this.props.selectedAssetType.assetTypeClassify == "linear" && (
            <LabelWithFieldWrapper label={languageService("Inspection Type")}>
              <SelectField
                inputFieldProps={{ name: "inspectionType" }}
                options={[
                  { val: "traversed", text: "Traverse" },
                  { val: "observed", text: "Observe" },
                ]}
                changeHandler={this.changeHandler}
                value={this.state.formField.inspectionType}
              />
            </LabelWithFieldWrapper>
          )}
          <LabelWithFieldWrapper label={languageService("Start Date") + " *"}>
            <DateField
              inputFieldProps={{ name: "startDate" }}
              changeHandler={this.changeHandler}
              value={this.state.formField.startDate}
              validation={this.state.validationMsgs.startDate}
            />
          </LabelWithFieldWrapper>
          <span className="spacer"></span>
          <InspectionFreqRow
            frequenciesChangeHandler={this.frequenciesChangeHandler}
            rowIndex={0}
            freqObject={this.state.formField.inspectionFreq}
          />
        </div>
        <div className="card-footer" style={{ ...themeService(GITestStyle.cardBodyHeader), textAlign: "right" }}>
          {!this.state.allValid && (
            <span style={{ fontSize: "12px", color: "red" }}> {languageService("Validation failed , please fill required fields")} </span>
          )}
          <MyButton
            onClick={(e) => {
              this.handleSubmit();
            }}
            type="submit"
            style={themeService(ButtonStyle.commonButton)}
          >
            {this.props.formMode == "Add" ? languageService("Add") : languageService("Update")}
          </MyButton>
        </div>
        <CommonModal className="report-view" setModalOpener={this.setModalOpener} modalStyle={{ maxWidth: "80vw" }}>
          {reportsPreview(this.state.previewCode)}
        </CommonModal>
        <CommonModal
          setModalOpener={this.setConfigAssetsModalOpener}
          className="report-view"
          receiveToggleMethod={(state) => this.receiveToggleMethod(state, "showConfigAssetsModel")}
          modalStyle={{ maxWidth: "50vw", maxHeight: "70vh" }}
          headerText={languageService("Assets Tests Configuration")}
          footerCancelText={"Close"}
        >
          {this.state.showConfigAssetsModel && (
            <AssetTestContainer assetType={this.props.selectedAssetType} testCode={this.props.selectedTest} />
          )}
        </CommonModal>
        <CommonModal
          setModalOpener={this.setAddAssetTestConfig}
          className="report-view"
          receiveToggleMethod={(state) => this.receiveToggleMethod(state, "showCreateAssetTestConfig")}
          modalStyle={{ maxWidth: "50vw", maxHeight: "70vh" }}
          headerText={languageService("Assets Tests Configuration")}
          footerCancelText={"Close"}
          handleCancelClick={() => {
            this.receiveToggleMethod(false, "showCreateAssetTestConfig");
          }}
        >
          {this.state.showCreateAssetTestConfig && (
            <AssetTestCreateConfigContainer
              startDate={this.state.formField.startDate}
              assetType={this.props.selectedAssetType}
              testCode={this.state.formField.test}
              assetsList={this.state.assetsList}
              setAssetsConfigLIst={this.setAssetsConfigLIst}
              locations={this.state.locations}
              setLocationOptions={this.setLocationOptions}
            />
          )}
        </CommonModal>
      </div>
    );
  }
}

const AddAssetTestHeader = (props) => {
  return (
    <div className="card-header " style={themeService(GITestStyle.cardBodyHeader)}>
      {languageService("Add") + " " + "Tests"}
      {props.showCurentAssetTests && (
        <span style={{ float: "right" }}>
          <MyButton
            onClick={(e) => {
              props.openAssetConfigModel && props.openAssetConfigModel();
              props.showConfigSetState && props.showConfigSetState(true);
            }}
            disabled={props.disabled}
          >
            {languageService("Configure Assets")}
          </MyButton>
        </span>
      )}
    </div>
  );
};

const InputField = (props) => {
  return (
    <div style={{ ...props.style, ...themeService(formFeildStyle.feildStyle), margin: "0px 0px 15px 0px", display: "inline-block" }}>
      {props.inputFieldProps.label && (
        <label style={{ ...themeService(formFeildStyle.lblStyle), width: "inherit", margin: "0px 5px 5px" }}>
          {props.inputFieldProps.label + ":"}
        </label>
      )}
      <input
        style={{ ...themeService(formFeildStyle.inputStyle), minWidth: "250px" }}
        disabled={props.inputFieldProps.disabled}
        onChange={(e) => props.changeHandler(e, false)}
        onBlur={(e) => props.changeHandler(e, true)}
        value={props.value}
        {...props.inputFieldProps}
      />
    </div>
  );
};

export const SelectField = (props) => {
  return (
    <div style={{ ...themeService(formFeildStyle.feildStyle) }}>
      {props.label && (
        <label style={{ ...themeService(formFeildStyle.lblStyle), width: "inherit", margin: "0px 5px 5px" }}>
          {languageService(props.label) + ":"}
        </label>
      )}
      <select
        style={{ ...themeService(formFeildStyle.inputStyle), minWidth: "250px", borderWidth: "2px" }}
        onChange={(e) => props.changeHandler(e, false, "select")}
        onBlur={(e) => props.changeHandler(e, true, "select")}
        {...props.inputFieldProps}
        value={props.value}
      >
        {props.addEmptyOption && <option> </option>}
        {props.options &&
          props.options.map((item, index) => (
            <option key={index} value={item.val}>
              {languageService(item.text)}
            </option>
          ))}
      </select>
      {props.previewOption && (
        <span style={{ color: "var(--first)", cursor: "pointer", marginLeft: "10px" }} onClick={() => props.showPreview(props.previewCode)}>
          Preview...
        </span>
      )}
    </div>
  );
};

const LabelWithFieldWrapper = (props) => {
  return (
    <div>
      <div style={{ margin: "0 10px 5px 0", fontSize: "14px", fontWeight: 600, display: "inline-block", width: "150px" }}>
        {languageService(props.label)}
      </div>
      <div style={{ display: "inline-block", minWidth: "250px" }}>{props.children}</div>
    </div>
  );
};

export const DateField = (props) => {
  return (
    <DayPickerInput
      inputProps={{ readOnly: true, disabled: props.disabled || false }}
      {...props.inputFieldProps}
      value={props.value ? moment(props.value).format("Y-M-D") : ""}
      dayPickerProps={{
        month: props.value ? new Date(props.value) : new Date(),
        localeUtils: MomentLocaleUtils,
        locale: getLanguageLocal(),
      }}
      onDayChange={(day) => {
        props.changeHandler({ target: { name: props.inputFieldProps.name, value: day } });
      }}
      style={props.style ? props.style : { ...themeService(formFeildStyle.inputStyle) }}
    />
  );
};
