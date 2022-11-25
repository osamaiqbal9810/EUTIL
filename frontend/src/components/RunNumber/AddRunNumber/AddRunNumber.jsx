import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import "components/Common/commonform.css";
import { languageService } from "../../../Language/language.service";
import _ from "lodash";
import FormFields from "../../../wigets/forms/formFields";
import { formFieldsTemplate } from "./variables";
import { checkFormIsValid, processFromFields } from "../../../utils/helpers";
import { FORM_SUBMIT_TYPES } from "../../../utils/globals";
import { themeService } from "../../../theme/service/activeTheme.service";
import { CommonModalStyle } from "../../../style/basic/commonControls";

class AddRunNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // rangeLine: { mpStart: '', mpEnd: '', lineId: '', lineName: '', runDescription: '', runCommonName: '', runName: '' }
      run: _.cloneDeep(formFieldsTemplate),
    };

    this.style = {
      lableStyle: {
        color: "var(--first)",
        fontSize: "14px",
      },
      FieldContainerStyle: {
        padding: "10px 10px ",
        height: "40px",
        color: "var(--first)",
        fontSize: "14px",
        margin: "10px -15px",
        border: "1px solid #e7e7e7",
        borderRadius: "3px",
      },
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleChangeFormValue = this.handleChangeFormValue.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let { run } = this.state;

    const { modalState, runNumber } = this.props;
    if (modalState !== prevProps.modalState) {
      if (modalState === "Add") {
        let run = _.cloneDeep(formFieldsTemplate);

        run.runLineID.config.options = this.props.locations ? this.props.locations.map((loc) => ({ val: loc._id, text: loc.unitId })) : [];

        run.runLineID.value = run.runLineID.config.options[0] ? run.runLineID.config.options[0].val : "";
        run.runLineID.valid = run.runLineID.value !== "";

        this.setState({ run });
      } else if (modalState === "Edit") {
        const run = _.cloneDeep(formFieldsTemplate);

        for (let key in runNumber) {
          if (key in run) {
            run[key].value = runNumber[key];
          }
        }

        this.setState({ run });
      }
    }
  }

  handleSubmitForm() {
    let dataToSubmit = processFromFields(this.state.run);

    let location = this.props.locations.find((loc) => loc._id === dataToSubmit.runLineID);

    dataToSubmit.runLineName = location ? location.unitId : "";
    dataToSubmit.lineStart = location.start;
    dataToSubmit.lineEnd = location.end;

    let isFormValid = checkFormIsValid(this.state.run);

    if (isFormValid) {
      this.props.submitRun(this.props.modalState === "Add" ? FORM_SUBMIT_TYPES.ADD : FORM_SUBMIT_TYPES.EDIT, dataToSubmit);
    } else {
      this.setFormValidation(this.state.run, "run");
    }
  }

  setFormValidation = (data, stateVarName) => {
    const msg = languageService("Validation failed") + ": ";
    for (let key in data) {
      data[key].touched = true;
      // data[key].validationMessage = "Validation failed";
      if (!data[key].validationMessage.startsWith(msg)) data[key].validationMessage = msg + data[key].validationMessage;
    }

    this.setState({ [stateVarName]: data });
  };

  handleChangeFormValue(run) {
    this.setState({
      run: run,
    });
  }

  handleClose() {
    this.setState({
      run: _.cloneDeep(formFieldsTemplate),
    });
    this.props.toggle("None", null);
  }

  updateFrom = (newState) => this.setState({ ...newState });

  render() {
    return (
      <Modal
        isOpen={this.props.addEditModal}
        toggle={this.props.toggle}
        contentClassName={themeService({ default: this.props.className, retro: "retroModal", electric: "electricModal" })}
      >
        <div className="commonform">
          {this.props.modalState === "Add" && (
            <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
              {languageService("Add New Run")}
            </ModalHeader>
          )}
          {this.props.modalState === "Edit" && (
            <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
              {languageService("Edit Run")}
            </ModalHeader>
          )}

          <ModalBody
            style={{
              ...ModalStyles.footerButtonsContainer,
              ...themeService(CommonModalStyle.body),
              ...{ textAlign: "center", overflow: "hidden" },
            }}
          >
            <FormFields run={this.state.run} fieldTitle={"run"} change={this.updateFrom} />
          </ModalBody>

          <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
            {this.props.modalState === "Add" && (
              <MyButton onClick={this.handleSubmitForm} type="submit">
                {languageService("Add")}
              </MyButton>
            )}
            {this.props.modalState === "Edit" && (
              <MyButton onClick={this.handleSubmitForm} type="submit">
                {languageService("Edit")}
              </MyButton>
            )}
            <MyButton type="button" onClick={this.handleClose}>
              {languageService("Cancel")}
            </MyButton>
          </ModalFooter>
        </div>
      </Modal>
    );
  }
}

export default AddRunNumber;
