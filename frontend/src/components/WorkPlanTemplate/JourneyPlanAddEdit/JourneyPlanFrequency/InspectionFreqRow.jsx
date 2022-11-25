import React, { Component } from "react";
import { formFeildStyle } from "../../../../wigets/forms/style/formFields";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { Col, Row } from "reactstrap";
import { languageService } from "../../../../Language/language.service";
import { locationListStyle } from "../../../LocationSetup/LocationListStyle";
import SvgIcon from "react-icons-kit";
import { cross } from "react-icons-kit/icomoon/cross";
export const freqObj = {
  freq: 5,
  timeFrame: "Year",
  timeFrameNumber: 1,
  recurNumber: 1,
  recurTimeFrame: "Year",
  maxInterval: 0,
  minDays: 0,
};

export default class InspectionFreqRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      freqObj: this.props.freqObject ? this.props.freqObject : freqObj,
    };

    this.changeHandler = this.changeHandler.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.freqObject !== this.props.freqObject) {
      this.setState({
        freqObj: this.props.freqObject,
      });
    }
  }

  changeHandler(e, blur) {
    let freqObj = { ...this.state.freqObj };
    freqObj[e.target.name] = e.target.value;
    if (blur) {
      // TODO : validation on blur
    } else {
      // TODO : basic validation
    }
    this.setState({
      freqObj: freqObj,
    });
    this.props.frequenciesChangeHandler(freqObj, this.props.rowIndex);
  }
  render() {
    return (
      <div>
        <div
          style={{
            border: "1px solid rgb(177, 177, 177)",
            padding: "10px",
            width: "auto",
            marginBottom: "10px",
          }}
        >
          <div>
            <LabelWithFieldWrapper label={languageService("Inspection Frequency")}>
              <InputField
                inputFieldProps={{ name: "freq", type: "number", min: 0 }}
                changeHandler={this.changeHandler}
                value={this.state.freqObj.freq}
              />
            </LabelWithFieldWrapper>
            <InputField
              inputFieldProps={{ name: "timeFrameNumber", label: languageService("in"), type: "number", min: 0 }}
              changeHandler={this.changeHandler}
              value={this.state.freqObj.timeFrameNumber}
            />
            <SelectField
              inputFieldProps={{ name: "timeFrame" }}
              options={[...timeFrameOptions]}
              changeHandler={this.changeHandler}
              value={this.state.freqObj.timeFrame}
            />
            <InputField
              inputFieldProps={{ name: "recurNumber", label: languageService("every"), type: "number", min: 0 }}
              changeHandler={this.changeHandler}
              value={this.state.freqObj.recurNumber}
            />
            <SelectField
              inputFieldProps={{ name: "recurTimeFrame" }}
              options={[...timeFrameOptions]}
              changeHandler={this.changeHandler}
              value={this.state.freqObj.recurTimeFrame}
            />

            {this.props.rowIndex > 0 && (
              <span
                id={`freqId-${this.props.rowIndex}`}
                onClick={(e) => {
                  this.props.frequenciesChangeHandler(this.state.freqObj, this.props.rowIndex, true);
                }}
                style={{
                  ...themeService(locationListStyle.saveInputIcon),
                  ...{ color: "#840f0f", float: "none", padding: "0px 7px", height: "auto" },
                }}
              >
                <SvgIcon style={{ verticalAlign: "middle" }} icon={cross} size="15" />
              </span>
            )}
          </div>
          <div>
            <InputField
              inputFieldProps={{ name: "minDays", label: languageService("Days between Inspections"), type: "number", min: 0 }}
              changeHandler={this.changeHandler}
              value={this.state.freqObj.minDays}
              style={{ minWidth: "50%" }}
            />
            <InputField
              inputFieldProps={{ name: "maxInterval", label: languageService("Max Interval"), type: "number", min: 0 }}
              changeHandler={this.changeHandler}
              value={this.state.freqObj.maxInterval}
            />
          </div>
        </div>
      </div>
    );
  }
}

const InputField = (props) => {
  return (
    <div style={{ ...props.style, ...themeService(formFeildStyle.feildStyle), display: "inline-block", margin: "0px 0px 15px 0px" }}>
      {props.inputFieldProps.label && (
        <label style={{ ...themeService(formFeildStyle.lblStyle), width: "inherit", margin: "0px 5px 5px" }}>
          {props.inputFieldProps.label + ":"}
        </label>
      )}
      <input
        style={{ ...themeService(formFeildStyle.inputStyle), width: "inherit" }}
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
    <div style={{ ...themeService(formFeildStyle.feildStyle), display: "inline-block", margin: "0px 0px 15px 0px" }}>
      {props.label && (
        <label style={{ ...themeService(formFeildStyle.lblStyle), width: "inherit", margin: "0px 5px 5px" }}>
          {languageService(props.label) + ":"}
        </label>
      )}
      <select
        style={{ ...themeService(formFeildStyle.inputStyle), width: "inherit" }}
        onChange={(e) => props.changeHandler(e, false, "select")}
        onBlur={(e) => props.changeHandler(e, true, "select")}
        {...props.inputFieldProps}
        value={props.value}
      >
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

const timeFrameOptions = [
  { val: "Day", text: "Day" },
  { val: "Week", text: "Week" },
  { val: "Month", text: "Month" },
  { val: "Year", text: "Year" },
];

const LabelWithFieldWrapper = (props) => {
  return (
    <div style={{ display: "inline-block" }}>
      <div style={{ marginBottom: "5px", fontSize: "14px", fontWeight: 600 }}>{languageService(props.label)}</div>
      {props.children}
    </div>
  );
};
