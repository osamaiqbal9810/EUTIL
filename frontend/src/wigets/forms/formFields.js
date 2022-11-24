import React from "react";
import { Col, Row } from "reactstrap";
import DayPickerInput from "react-day-picker/DayPickerInput";
import MomentLocaleUtils from "react-day-picker/moment";
import AssetSelection from "./../../components/LampAssets/AssetSelection/AssetSelection";
import "./test.css";
import { getLanguageLocal, languageService } from "../../Language/language.service";
import _ from "lodash";
import { validate, doBasicValidation } from "../../utils/helpers";

import { formFeildStyle } from "./style/formFields";
import { themeService } from "theme/service/activeTheme.service";
import { retroColors } from "../../style/basic/basicColors";
import Select from "react-select";
import InputSelectOptions from "../../components/Common/inputSelectOptions";
import moment from "moment";
import { YearMonthForm } from "./common";

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

const FormFields = (props) => {
  let formData = props[props.fieldTitle];

  const renderFields = () => {
    if (formData) {
      const formArray = [];
      let fdKeys = Object.keys(formData);
      let isIndexed =
        fdKeys && fdKeys.length
          ? fdKeys.every((k) => {
            return formData[k].hasOwnProperty("index") ? true : false;
          })
          : false;

      if (isIndexed) {
        fdKeys = fdKeys.sort((k1, k2) => {
          return formData[k1].index - formData[k2].index;
        });
      }
      for (let elementName of fdKeys) {
        formArray.push({
          id: elementName,
          settings: formData[elementName],
        });
      }

      return formArray.map((item, index) => {
        return (
          <React.Fragment key={index}>
            {!item.settings.hide && (
              <Col key={index} md={item.settings.containerConfig.col ? item.settings.containerConfig.col : 12}>
                <div className={"field"} {...item.settings.containerConfig}>
                  {renderTemplates(item)}
                </div>
              </Col>
            )}
          </React.Fragment>
        );
      });
    }
  };

  const showLabelSmall = (element) => {
    const { label, labelText, validation } = element;
    return label ? (
      <label style={themeService(formFeildStyle.lblSmallStyle)}>
        {" "}
        {languageService(labelText) + " :"} {showRequired(validation)}
      </label>
    ) : (
      <label style={themeService(formFeildStyle.lblSmallStyle)}>{showRequired(validation)}</label>
    );
  };
  const showLabel = (element) => {
    const { label, labelText, validation } = element;
    return label ? (
      <label style={themeService(formFeildStyle.lblStyle)}>
        {" "}
        {languageService(labelText) + " :"} {showRequired(validation)}
      </label>
    ) : (
      <label style={themeService(formFeildStyle.lblStyle)}>{showRequired(validation)}</label>
    );
  };

  const showRequired = (validation) => {
    return validation.required ? (
      <span className="required-fld" style={themeService({ default: {}, retro: { color: retroColors.second } })}>
        *
      </span>
    ) : null;
  };

  const renderTemplates = (data) => {
    let formTemplate = "";
    let values = data.settings;

    switch (values.element) {
      case "input":
        formTemplate = (
          <div style={themeService(formFeildStyle.feildStyle)}>
            {showLabel(values)}
            <input
              {...{ ...values.config, placeholder: languageService(values.config.placeholder) }}
              value={values.value}
              onChange={(e) => changeHandler(e, false)}
              onBlur={(e) => changeHandler(e, true)}
              style={themeService(formFeildStyle.inputStyle)}
            />
            {showValidation(values)}
            {values.customFieldComp && values.customFieldComp}
          </div>
        );

        break;
      case "textarea":
        formTemplate = (
          <div style={themeService(formFeildStyle.feildStyle)}>
            {showLabel(values)}
            <textarea
              {...{ ...values.config, placeholder: languageService(values.config.placeholder) }}
              value={values.value}
              onChange={changeHandler}
              onBlur={(e) => changeHandler(e, true)}
              style={themeService(formFeildStyle.inputStyle)}
            />
            {showValidation(values)}
          </div>
        );

        break;
      case "select":
        formTemplate = (
          <div style={themeService(formFeildStyle.feildStyle)}>
            {showLabel(values)}
            <select
              value={values.value}
              name={values.config.name}
              disabled={values.config.disabled}
              onChange={changeHandler}
              style={{ ...themeService(formFeildStyle.inputStyle), ...{ float: "none" }, ...values.config.style }}
            >
              {values.config.options.map((item, index) => (
                <option key={index} value={item.val}>
                  {languageService(item.text)}
                </option>
              ))}
            </select>

            {showValidation(values)}
            {values.customFieldComp && values.customFieldComp}
          </div>
        );

        break;
      case "multiSelect":
        // debugger;
        let options = values.config.options.map((v) => ({ value: v.val, label: v.text }));
        formTemplate = (
          <div style={themeService(formFeildStyle.feildStyle)}>
            {showLabel(values)}
            <Select
              value={values.value}
              isMulti
              options={options}
              name="colors"
              className="basic-multi-select"
              classNamePrefix="select"
              isDisabled={values.config.disabled}
              onChange={(opt) => {
                changeHandler({ target: { name: values.config.name, value: opt } });
              }}
            />

            {showValidation(values)}
            {values.customFieldComp && values.customFieldComp}
          </div>
        );

        break;
      case "date":
        formTemplate = (
          <div className={values.config.captionElement ? "YearNavigation" : ""} style={themeService(formFeildStyle.feildStyle)}>
            {showLabel(values)}
            <DayPickerInput

              inputProps={{ readOnly: true, disabled: values.config.disabled || false }}
              {...{ ...values.config, placeholder: languageService(values.config.placeholder) }}
              value={values.value ? moment(values.value).format("Y-M-D") : ""}
              dayPickerProps={{

                month: values.value ? new Date(values.value) : new Date(),
                localeUtils: MomentLocaleUtils,
                locale: getLanguageLocal(),
                captionElement: values.config.captionElement
                  ? ({ date, localeUtils }) => (
                    <YearMonthForm
                      date={date}
                      localeUtils={localeUtils}
                      onChange={(day) => {
                        changeHandler({ target: { name: values.config.name, value: day } });
                      }}
                    />
                  )
                  : undefined,
              }}
              onDayChange={(day) => {
                changeHandler({ target: { name: values.config.name, value: day } });
              }}
              style={themeService(formFeildStyle.inputStyle)}
            />
            {showValidation(values)}
          </div>
        );

        break;
      case "radio":
        formTemplate = (
          <div style={themeService(formFeildStyle.feildStyle)}>
            {showLabelSmall(values)}
            <div className={"row"}>
              {values.config.options.map(({ val, text }) => (
                <div key={val} className={"col-md-12"}>
                  <span>
                    <input
                      checked={values.value === val}
                      name={values.config.name}
                      id={values.config.name}
                      type={"radio"}
                      style={{ position: "relative", margin: "0", width: "auto" }}
                      onChange={() => {
                        changeHandler({ target: { name: values.config.name, value: val } });
                      }}
                    />
                  </span>
                  <label htmlFor={values.config.name} style={themeService(formFeildStyle.lblSmallStyle)}>
                    {text}
                  </label>
                </div>
              ))}
            </div>
            {showValidation(values)}
          </div>
        );
        break;
      case "checkbox":
        formTemplate = (
          <div
            style={themeService(formFeildStyle.feildStyle)}
            onClick={() => {
              if (!values.config.disabled)
                changeHandler({ target: { name: values.config.name, value: !values.value } });
            }}
          >
            <input {...values.config} checked={values.value} />
            {showLabelSmall(values)}
            {showValidation(values)}
          </div>
        );

        break;
      case "AssetSelection":
        formTemplate = (
          <div style={themeService(formFeildStyle.feildStyle)}>
            {showValidation(values)}
            {showLabel(values)}
            <AssetSelection {...values.config} selected={values.value} style={themeService(formFeildStyle.inputStyle)} />
          </div>
        );

        break;
      case "datalist":
        formTemplate = (
          <div style={themeService(formFeildStyle.feildStyle)}>
            {showLabel(values)}
            <input
              list={values.config.name}
              name={values.config.name}
              style={themeService(formFeildStyle.inputStyle)}
              onChange={changeHandler}
              disabled={values.config.disabled}
              value={values.value}
            />
            <datalist
              id={values.config.name}
            // style={{ ...themeService(formFeildStyle.inputStyle), ...{ float: "none" }, ...values.config.style }}
            >
              {values.config.options.map((item, index) => (
                <option key={index} value={item.val}>
                  {languageService(item.text)}
                </option>
              ))}
            </datalist>

            {showValidation(values)}
            {values.customFieldComp && values.customFieldComp}
          </div>
        );

        break;
      case "inputSelect":
        formTemplate = (
          <div style={themeService(formFeildStyle.feildStyle)}>
            {showLabel(values)}
            <InputSelectOptions
              name={values.config.name}
              selectOptions={values.config.options}
              onInputChange={(e) => changeHandler(e, false)}
              onBlurHandle={(e) => changeHandler(e, true)}
              value={values.value}
              containerStyle={{ display: "inline-block" }}
              caretContainerStyle={{ float: "right" }}
              caretCrossContainerStyle={{ minWidth: "45px", float: "right" }}
              inputFieldStyle={{ float: "left" }}
              optionRowContainerStyle={{ marginTop: "34px" }}
              handleOptionClick={values.config.handleOptionClick}
              disabled={values.config.disabled}
              selectedValue={values.config.selectedValue}
            //    noIconSwitch
            />
            {showValidation(values)}
            {values.customFieldComp && values.customFieldComp}
          </div>
        );

        break;
      case "file":
        formTemplate = (
          <div style={themeService(formFeildStyle.feildStyle)}>
            {showValidation(values)}
            {showLabel(values)}
            <input
              type="file"
              accept={values.accept}
              style={themeService(formFeildStyle.inputStyle)}
              name={values.config.name}
              onChange={changeHandler}
              disabled={values.config.disabled}
            //value={values.value}
            />
            {/*             <div style={themeService(formFeildStyle.feildStyle)}>
              <textarea
                {...{ ...values.config, placeholder: languageService(values.config.placeholder) }}
                value={values.fileData}
                style={themeService(formFeildStyle.inputStyle)}
              />
            </div>
            <div style={{ marginLeft: "154px" }}>
              <input
                type="file"
                accept={values.accept}
                style={themeService(formFeildStyle.inputStyle)}
                name={values.config.name}
                onChange={changeHandler}
                disabled={values.config.disabled}
                value={values.value}
              />
            </div>
 */}{" "}
          </div>
        );

        break;

      default:
        formTemplate = "";
    }

    return formTemplate;
  };

  // Change state field
  const changeHandler = (e, blur) => {
    let formData = _.cloneDeep(props[[props.fieldTitle]]);

    const { name, value } = e.target;
    formData[name].value = value;

    if (blur) {
      let validData = validate(formData[name], formData);
      formData[name].valid = validData[0];
      formData[name].validationMessage = validData[1];
    } else {
      let validData = doBasicValidation(formData[name], formData);
      formData[name].valid = validData[0];
      formData[name].validationMessage = validData[1];
    }

    if (formData[name].element === "select" || formData[name].element === "date") {
      formData[name].valid = true;
      formData[name].validationMessage = "";
    }

    formData[name].touched = true;

    props.change({ [props.fieldTitle]: formData }, e);
  };

  // const validate = element => {
  //   let error = [true, ""];

  //   if (element.validation.required) {
  //     const valid = element.value.trim() !== "";
  //     const message = `${!valid ? "This field is required" : ""}`;

  //     error = !valid ? [valid, message] : error;
  //   }

  //   if (!element.value && !element.validation.required) {
  //     return error;
  //   }

  //   if (element.validation.minLen) {
  //     const valid = element.value.length >= element.validation.minLen;
  //     const message = `${!valid ? "Length must be greater or equal to " + element.validation.minLen : ""}`;

  //     error = !valid ? [valid, message] : error;
  //   }

  //   if (element.validation.maxLen) {
  //     const valid = element.value.length <= element.validation.maxLen;
  //     const message = `${!valid ? "Length must be less or equal to " + element.validation.maxLen : ""}`;

  //     error = !valid ? [valid, message] : error;
  //   }

  //   if (element.validation.min || element.validation.min === 0) {
  //     const valid = parseFloat(element.value) >= element.validation.min;
  //     const message = (element.validation.min !== element.validation.max) ?
  //                      `${!valid ? "Must be greater or equal to " + element.validation.min : ""}`
  //                     :`${!valid ? "Must be equal to " + element.validation.min : ""}`;

  //     error = !valid ? [valid, message] : error;
  //   }

  //   if (element.validation.max) {
  //     const valid = parseFloat(element.value) <= element.validation.max;
  //     const message = (element.validation.max !== element.validation.min) ?
  //                     `${!valid ? "Must be less or equal to " + element.validation.max : ""}`
  //                    :`${!valid ? "Must be equal to " + element.validation.max : ""}`;

  //     error = !valid ? [valid, message] : error;
  //   }

  //   if (element.validation.match) {
  //     let compareVar = formData[element.validation.matchField];
  //     const valid = element.value === compareVar.value;
  //     const message = `${!valid ? `${element.validation.matchField} doesn't match, please verify ` : ""}`;

  //     error = !valid ? [valid, message] : error;
  //   }

  //   if (error[0] && element.validation.phoneNumber) {
  //     let reg = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
  //     const valid = reg.test(element.value);
  //     const message = `${!valid ? `Number is not valid` : ""}`;

  //     error = !valid ? [valid, message] : error;
  //   }

  //   return error;
  // };

  const showValidation = (element) => {
    let errorMessage = null;

    if (element.touched && element.validation && !element.valid) {
      errorMessage = (
        <div
          style={themeService({
            default: { marginTop: "5px", fontSize: "12px", color: "rgb(157, 7, 7)" },
            retro: { marginTop: "5px", fontSize: "12px", color: "rgb(157, 7, 7)", textAlign: "right" },
          })}
        >
          <span>{languageService(element.validationMessage)}</span>
        </div>
      );
    }

    return errorMessage;
  };

  return <Row>{renderFields()}</Row>;
};

FormFields.defaultProps = {
  fieldTitle: "formFields",
};

export default FormFields;
