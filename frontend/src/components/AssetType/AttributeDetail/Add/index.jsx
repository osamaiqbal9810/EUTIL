import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { isEmpty, isEmail } from "validator";
import { languageService } from "../../../../Language/language.service";
import _ from "lodash";
import { commonformFields } from "./variables";
import FormFields from "../../../../wigets/forms/formFields";
import { checkFormIsValid, processFromFields } from "../../../../utils/helpers";
import { MODAL_TYPES } from "../../../../utils/globals";
const MyButton = props => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class AssetTypeAttributeAddEdit extends Component {
  state = {
    formFields: _.cloneDeep(commonformFields),
  };

  handleClose = () => {
    this.setState({
      modalState: "None",
      formFields: _.cloneDeep(commonformFields),
    });
    this.props.toggle("None", null);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.modals.type !== this.props.modals.type) {
      if (this.props.modals.type === MODAL_TYPES.ADD) {
        this.setState({ formFields: _.cloneDeep(commonformFields) });
      }

      if (this.props.modals.type === MODAL_TYPES.EDIT) {
        this.mapSelectedObjectToStateFields();
      }
    }
  }

  mapSelectedObjectToStateFields = () => {
    const { data } = this.props.modals;
    let { formFields } = this.state;

    for (let key in data) {
      if (key in formFields) {
        formFields[key].value = data[key];
      }
    }

    this.setState({ formFields });
  };

  handleSubmit = () => {
    const { formFields } = this.state;

    let dataToSubmit = {
      ...processFromFields(formFields),
    };

    let formIsValid = checkFormIsValid(formFields);

    if (formIsValid) {
      if (this.props.modals.type === MODAL_TYPES.ADD) {
        this.props.handleSubmitForm(dataToSubmit, "Add");
      } else if (this.props.modals.type === MODAL_TYPES.EDIT) {
        this.props.handleSubmitForm(dataToSubmit, "Edit");
      }

      this.setState(
        {
          selectedJourneyPlan: null,
          modalState: "None",
          formFields: _.cloneDeep(commonformFields),
        },
        () => this.props.toggle("None", null),
      );
    } else {
      this.setFormValidation(formFields, "formFields");
    }
  };

  setFormValidation = (data, stateVarName) => {
    for (let key in data) {
      data[key].touched = true;
      data[key].validationMessage = "Validation failed";
    }

    this.setState({ [stateVarName]: data });
  };

  updateForm = newState => {
    this.setState({ ...newState });
  };

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
        {this.props.modals.type === MODAL_TYPES.ADD && (
          <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Add Attribute")}</ModalHeader>
        )}
        {this.props.modals.type === MODAL_TYPES.EDIT && (
          <ModalHeader style={ModalStyles.modalTitleStyle}>
            {languageService("Update Attribute")}
          </ModalHeader>
        )}
        <ModalBody>
          <div className={"commonform"}>
            <FormFields formFields={this.state.formFields} fieldTitle={"formFields"} change={this.updateForm} />
          </div>
        </ModalBody>
        <ModalFooter style={ModalStyles.footerButtonsContainer}>
          {this.props.modals.type === MODAL_TYPES.ADD && (
            <MyButton onClick={this.handleSubmit} type="submit">
              {languageService("Add")}
            </MyButton>
          )}
          {this.props.modals.type === MODAL_TYPES.EDIT && (
            <MyButton onClick={this.handleSubmit} type="submit">
              {languageService("Update")}
            </MyButton>
          )}
          <MyButton type="button" onClick={this.handleClose}>
            {languageService("Cancel")}
          </MyButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AssetTypeAttributeAddEdit;
