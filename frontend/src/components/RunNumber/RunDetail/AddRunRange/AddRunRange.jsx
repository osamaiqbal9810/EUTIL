import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import { Control, LocalForm, Errors, actions } from "react-redux-form";
import InputTextField from "components/Common/Forms/InputTextField";
import InputSelectOptionField from "components/Common/Forms/InputSelectOptionField";
import { Label, Field } from "components/Common/Forms/formsMiscItems";
import "components/Common/commonform.css";
import Select from "react-select";
import { languageService } from "../../../../Language/language.service";
import { formFieldsTemplate } from "./variables";
import _ from "lodash";
import FormFields from "../../../../wigets/forms/formFields";
import { checkFormIsValid, processFromFields } from "../../../../utils/helpers";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { CommonModalStyle } from "../../../../style/basic/commonControls";
class AddRunRange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formFields: _.cloneDeep(formFieldsTemplate),
      tracks: [],
      trackOptions: [],
      message: {
        type: "error",
        status: true,
        text: "",
      },
    };

    this.multiSelectStyle = {
      control: (styles) => ({
        ...styles,
        fontSize: "12px",
        backgroundColor: "white",
        height: "auto",
        minHeight: "15px",
      }),
      option: (base, state) => ({
        ...base,
        color: "var(--first)",
        fontSize: "12px",
      }),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.modal && this.props.modal !== prevProps.modal) {
      if (this.props.modalState === "Add") {
        let formFields = _.cloneDeep(formFieldsTemplate);

        if (this.props.parentAsset) {
          const { parentAsset } = this.props;
          // let asset = this.props.parentAsset;

          formFields.mpStart.validation.min = parseFloat(parentAsset.start);
          formFields.mpStart.validation.max = parseFloat(parentAsset.end);

          formFields.mpEnd.validation.min = parseFloat(parentAsset.start);
          formFields.mpEnd.validation.max = parseFloat(parentAsset.end);

          const limitMsg = ": [" + parentAsset.start + " to " + parentAsset.end + "] ";

          if (!formFields.mpStart.labelText.endsWith(limitMsg)) formFields.mpStart.labelText += limitMsg;

          if (!formFields.mpEnd.labelText.endsWith(limitMsg)) formFields.mpEnd.labelText += limitMsg;
        }

        this.setState({
          formFields,
          tracks: [],
        });
      }

      if (this.props.modalState === "Edit") {
        if (this.props.rangeLine !== prevProps.rangeLine) {
          this.mapSelectedRangeToFormFields(this.props.rangeLine);
        }
      }

      /*       let trackOptions = null;
      if (this.props.tracks && this.state.tracks.length <= 0) {
        trackOptions = this.props.tracks.map((asset, index) => {
          return { value: asset._id, label: asset.unitId };
        });
        trackOptions.push({ value: "others", label: "Other Assets" });

        this.setState({ trackOptions });
      } */
    }
  }

  mapSelectedRangeToFormFields = (range) => {
    let { formFields } = this.state;

    let tracks = [];

    for (let key in range) {
      if (key in formFields) {
        formFields[key].value = range[key];
        formFields[key].valid = true;
      }

      if (key === "tracks") {
        if (this.props.tracks) {
          this.props.tracks.forEach((asset) => {
            if (range[key] && range[key].includes(asset._id)) {
              tracks.push({ value: asset._id, label: asset.unitId });
            }
          });
        }
        if (range[key].includes("others")) {
          tracks.push({ value: "others", label: "Other Assets" });
        }
      }
    }

    if (this.props.parentAsset) {
      const { parentAsset } = this.props;
      formFields.mpStart.validation.min = parseFloat(parentAsset.start);
      formFields.mpStart.validation.max = parseFloat(parentAsset.end);

      formFields.mpEnd.validation.min = parseFloat(parentAsset.start);
      formFields.mpEnd.validation.max = parseFloat(parentAsset.end);

      const limitMsg = ": [" + parentAsset.start + " to " + parentAsset.end + "] ";

      if (!formFields.mpStart.labelText.endsWith(limitMsg)) formFields.mpStart.labelText += limitMsg;

      if (!formFields.mpEnd.labelText.endsWith(limitMsg)) formFields.mpEnd.labelText += limitMsg;
    }

    this.setState({ formFields, tracks });
  };

  handleSubmitForm = () => {
    let { formFields, tracks, message } = this.state;

    let rangeLine = processFromFields(formFields);

    rangeLine.mpStart = parseFloat(rangeLine.mpStart).toFixed(2);
    rangeLine.mpEnd = parseFloat(rangeLine.mpEnd).toFixed(2);

    let isFormValid = checkFormIsValid(formFields);

    if (isFormValid) {
      if (parseFloat(rangeLine.mpStart) >= parseFloat(rangeLine.mpEnd)) {
        message.status = true;
        message.type = "error";
        message.text = languageService("Milepost start must be less than Milepost End");

        this.setState({ message });
        return false;
      }

      if (tracks) {
        rangeLine.tracks = tracks.map((track) => track.value);
      }

      this.props.addRun(rangeLine, this.props.modalState);
    } else {
      this.setFormValidation(formFields, "formFields");
    }
  };

  setFormValidation = (data, stateVarName) => {
    const msg = languageService("Validation failed") + ": ";
    for (let key in data) {
      data[key].touched = true;

      if (!data[key].validationMessage.startsWith(msg)) data[key].validationMessage = msg + data[key].validationMessage;
    }

    this.setState({ [stateVarName]: data });
  };

  handleChangeTracks = (tracks) => {
    this.setState({ tracks });
  };

  formFieldsChangeHandler = (newState) =>
    this.setState({
      ...newState,
      message: {
        type: "error",
        status: true,
        text: "",
      },
    });

  render() {
    return (
      <Modal
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        contentClassName={themeService({ default: this.props.className, retro: "retroModal", electric: "electricModal" })}
      >
        <div className={"commonform"}>
          {this.props.modalState === "Add" && (
            <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
              {languageService("Add New Run Range")}
            </ModalHeader>
          )}
          {this.props.modalState === "Edit" && (
            <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
              {languageService("Edit Run Range")}
            </ModalHeader>
          )}

          <ModalBody
            style={{
              ...ModalStyles.footerButtonsContainer,
              ...themeService(CommonModalStyle.body),
            }}
          >
            <FormFields formFields={this.state.formFields} fieldTitle={"formFields"} change={this.formFieldsChangeHandler} />
            {/*             <Select
              value={this.state.tracks}
              closeMenuOnSelect={false}
              styles={this.multiSelectStyle}
              options={this.state.trackOptions}
              isMulti
              onChange={this.handleChangeTracks}
            />
 */}
            {this.state.message.status && (
              <div style={{ marginTop: "5px", fontSize: "12px", color: "rgb(157, 7, 7)" }}>
                <span>{this.state.message.text}</span>
              </div>
            )}
          </ModalBody>

          <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
            {
              <MyButton onClick={this.handleSubmitForm} type="submit">
                {languageService(this.props.modalState === "Add" ? "Add" : "Update")}
              </MyButton>
            }
            <MyButton type="button" onClick={this.props.handleClose}>
              {languageService("Cancel")}
            </MyButton>
          </ModalFooter>
        </div>
      </Modal>
    );
  }
}

export default AddRunRange;
