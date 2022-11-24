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
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.frequenciesChangeHandler = this.frequenciesChangeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        selectedForm.opt2.allowedInstruction &&
          selectedForm.opt2.allowedInstruction.forEach((instruc) => {
            instructionOptions.push({ text: instruc, val: instruc });
            instructionOptions[0] && (formField.instructionFile = instructionOptions[0].val);
          });
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
    this.setState({
      formField: formField,
      instructionOptions: instructionOptions,
      allValid: true,
    });
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
  render() {
    return (
      <div className="card" style={{ margin: " 0 10px 0 0" }}>
        <div className="card-header " style={themeService(GITestStyle.cardBodyHeader)}>
          {languageService("Add") + " " + "Tests"}
        </div>
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
          )}{" "}
          <MyButton onClick={this.handleSubmit} type="submit" style={themeService(ButtonStyle.commonButton)}>
            {this.props.formMode == "Add" ? languageService("Add") : languageService("Update")}
          </MyButton>
        </div>
      </div>
    );
  }
}

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

const SelectField = (props) => {
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

const DateField = (props) => {
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
      style={{ ...themeService(formFeildStyle.inputStyle) }}
    />
  );
};
