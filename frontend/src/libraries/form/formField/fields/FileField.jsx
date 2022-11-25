import React from "react";
import { showValidation } from "./utilities/showValidation";
import { showLabel } from "./utilities/showLabel";
import uuid from "uuid";
import { Component } from "react";
import { Fragment } from "react";

export default class FileField extends Component {
  constructor(props) {
    super(props);

    let { field } = props;
    let { element } = field;
    let externalUrl = element.value && typeof element.value === "object" && element.value.url;

    this.state = {
      externalUrl: externalUrl,
      checkbox_id: `icon-id-${Math.floor(Math.random() * 100000000)}`,
    };
    this.fileChangeHandler = this.fileChangeHandler.bind(this);
    this.filenameChangeHandler = this.filenameChangeHandler.bind(this);
    this.fullUrlInfoChange = this.fullUrlInfoChange.bind(this);
    this.changeUrlMode = this.changeUrlMode.bind(this);
  }

  changeUrlMode(externalUrl) {
    this.setState({
      externalUrl: !externalUrl,
    });
    this.props.changeHandler({ target: { value: "" } }, false);
  }
  fileChangeHandler(e, blur) {
    let { files } = e.target;
    let file = files.length ? files[0] : null;
    let _e = { target: { value: null } };
    if (file) {
      _e.target.value = {
        name: file.name,
        "url-rel": `${uuid.v4()}_${file.name}`,
        file: file,
      };
    }
    this.props.changeHandler(_e, blur);
  }
  filenameChangeHandler(e) {
    let { field } = this.props;
    let { element } = field;
    this.props.changeHandler({ target: { value: { ...element.value, name: e.target.value } } }, false);
  }
  fullUrlInfoChange(newUrl, newName, blur) {
    let { field } = this.props;
    let { element } = field;
    let updatedValue = element.value && typeof element.value === "object" ? element.value : {};
    if (newName !== undefined) {
      updatedValue.name = newName;
    } else if (newUrl !== undefined) {
      updatedValue.url = newUrl;
    }
    if (!updatedValue.name && !updatedValue.url) {
      updatedValue = "";
    }
    this.props.changeHandler({ target: { value: updatedValue } }, blur);
  }
  render() {
    let { formId, field, changeHandler } = this.props;
    let { element } = field;
    let { externalUrl, checkbox_id } = this.state;
    let url = "";
    let name = "";
    if (element.value) {
      element.value.url && (url = element.value.url);
      element.value.name && (name = element.value.name);
    }

    return (
      <div className="field-style">
        {showLabel(field, formId)}
        <Fragment>
          <div style={{ width: "70%" }}>
            <div>
              <input
                id={checkbox_id}
                name={formId + "_" + field.id}
                type={"checkbox"}
                placeholder={"abs"}
                value={externalUrl}
                checked={externalUrl}
                disabled={element.disabled}
                onChange={(e) => this.changeUrlMode(externalUrl)}
                className="input-style"
                style={{ width: "fit-content" }}
              />
              <span style={{ width: "-webkit-fill-available", padding: "3px" }}>{"Use external URL"}</span>
            </div>

            {externalUrl ? (
              // component with full url
              <Fragment>
                <input
                  id={`${formId}_${field.id}_fullurl_link`}
                  name={formId + "_" + field.id}
                  placeholder={"URL (e.g. https://www.example.com/resource)"}
                  disabled={element.disabled}
                  value={url}
                  onChange={(e) => this.fullUrlInfoChange(e.target.value, undefined, false)}
                  onBlur={(e) => this.fullUrlInfoChange(e.target.value, undefined, true)}
                  className="input-style"
                  style={{ width: "70%" }}
                />
                <input
                  id={`${formId}_${field.id}_fullurl_name`}
                  name={formId + "_" + field.id}
                  placeholder={"File name"}
                  value={name}
                  disabled={element.disabled}
                  onChange={(e) => this.fullUrlInfoChange(undefined, e.target.value, false)}
                  onBlur={(e) => this.fullUrlInfoChange(undefined, e.target.value, true)}
                  className="input-style"
                  style={{ width: "30%" }}
                />
              </Fragment>
            ) : // component with absolute url
            !element.value ? (
              <input
                id={formId + "_" + field.id}
                name={formId + "_" + field.id}
                type={element.type}
                accept={element.settings[element.type].accept}
                disabled={element.disabled}
                onChange={(e) => this.fileChangeHandler(e, false)}
                className="input-style"
                style={{ width: "100%" }}
              />
            ) : (
              <span style={{ position: "relative" }}>
                <input
                  id={formId + "_" + field.id}
                  name={formId + "_" + field.id}
                  value={element.value.name}
                  disabled={element.disabled}
                  onChange={(e) => this.filenameChangeHandler(e)}
                  className="input-style selected-file-style"
                  style={{ width: "100%" }}
                />
                <span className={"input-field-cross-icon"} onClick={() => changeHandler({ target: { value: null } }, false)}>
                  &#10060;
                </span>
              </span>
            )}
          </div>
        </Fragment>

        {showValidation(field)}
      </div>
    );
  }
}
