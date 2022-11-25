import React, { Component } from "react";
import { CRUDFunction } from "./../../../reduxCURD/container";
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalStyles } from "./../../Common/styles.js";
import { plus } from "react-icons-kit/icomoon/plus";
import _ from "lodash";
import "components/Common/commonform.css";
import { languageService } from "../../../Language/language.service";
import { commonFormFields, POPUP_TYPES_TO_SHOW } from "./variables";
import FormFields from "../../../wigets/forms/formFields";
import { FORM_SUBMIT_TYPES, MODAL_TYPES } from "../../../utils/globals";
import { curdActions } from "reduxCURD/actions";
import { checkFormIsValid, processFromFields } from "../../../utils/helpers";
import Select from "react-select";
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

const multiSelectStyle = {
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

class AddAssetTypeIndex extends Component {
  state = {
    assetTypeFields: _.cloneDeep(commonFormFields),
    locationType: 0,

    popupTypeToShow: POPUP_TYPES_TO_SHOW.MAIN_FORM,
    modalState: "None",
    assetTypeOptions: [],
    allowedAssetTypes: [],
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.modal !== prevProps.modal) {
      if (this.props.modals.type === MODAL_TYPES.EDIT) {
        this.mapSelectedAssetTypeFieldsToState();
      }

      if (this.props.modals.type === MODAL_TYPES.ADD) {
        this.setState({
          assetTypeFields: _.cloneDeep(commonFormFields),
          assetTypeOptions: [],
          allowedAssetTypes: [],
        });
      }
    }

    if (this.props.assetTypes && this.props.assetTypes.length > 0 && this.state.assetTypeOptions.length <= 0) {
      this.setAllowedAssetTypes();
    }
  }

  setAllowedAssetTypes = () => {
    let assetTypeOptions = this.props.assetTypes.map((at) => ({ value: at.assetType, label: at.assetType }));
    this.setState({ assetTypeOptions });
  };

  mapSelectedAssetTypeFieldsToState = () => {
    const { data } = this.props.modals;
    let allowedAssetTypes = [];
    const { assetTypeFields } = this.state;

    for (let key in data) {
      if (key in assetTypeFields) {
        assetTypeFields[key].value = data[key];
        assetTypeFields[key].valid = data[key] !== "";
      }

      if (key === "allowedAssetTypes") {
        allowedAssetTypes = data[key].map((aat) => ({ value: aat, label: aat }));
      }
    }

    this.updateFrom({ assetTypeFields, allowedAssetTypes });
  };

  handleSubmitAssetType = (formType) => () => {
    let { assetTypeFields, allowedAssetTypes } = this.state;

    let dataToSubmit = {
      ...processFromFields(assetTypeFields),
    };

    let isFormValid = checkFormIsValid(assetTypeFields);
    // debugger;
    if (isFormValid) {
      if (allowedAssetTypes) {
        dataToSubmit.allowedAssetTypes = allowedAssetTypes.map((aat) => aat.value);
      }

      this.props.handleSubmitForm(dataToSubmit, formType);
    } else {
      this.setFormValidation(assetTypeFields, "assetTypeFields");
    }
  };

  setFormValidation = (data, stateVarName) => {
    for (let key in data) {
      data[key].touched = true;
      data[key].validationMessage = "Validation failed";
    }

    this.setState({ [stateVarName]: data });
  };

  handleClose = () => {
    this.setState({
      assetTypeFields: _.cloneDeep(commonFormFields),
      popupTypeToShow: POPUP_TYPES_TO_SHOW.MAIN_FORM,
      modalState: "None",
    });
    this.props.toggle("None", null);
  };

  updateFrom = (newState) => {
    if (
      newState.assetTypeFields.plannable.value !== this.state.assetTypeFields.plannable.value &&
      newState.assetTypeFields.plannable.value
    ) {
      newState.assetTypeFields.location.value = newState.assetTypeFields.plannable.value;
    }

    this.setState({ ...newState });
  };

  handleChangeAllowedAssetTypes = (allowedAssetTypes) => this.setState({ allowedAssetTypes });

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} /*style={{ maxWidth: "98vw" }}*/>
        {this.props.modals.type === MODAL_TYPES.ADD && (
          <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Add New Asset Type")}</ModalHeader>
        )}
        {this.props.modals.type === MODAL_TYPES.EDIT && (
          <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Edit Asset Type")}</ModalHeader>
        )}
        <ModalBody>
          {this.state.popupTypeToShow === POPUP_TYPES_TO_SHOW.MAIN_FORM && (
            <Row>
              <Col md={12}>
                <ModalHeader style={ModalStyles.modalTitleStyle}>Asset Type Attributes </ModalHeader>
                <div className={"commonform"}>
                  <FormFields assetTypeFields={this.state.assetTypeFields} fieldTitle={"assetTypeFields"} change={this.updateFrom} />

                  <Select
                    value={this.state.allowedAssetTypes}
                    closeMenuOnSelect={false}
                    styles={multiSelectStyle}
                    options={this.state.assetTypeOptions}
                    isMulti
                    onChange={this.handleChangeAllowedAssetTypes}
                  />
                </div>
              </Col>
            </Row>
          )}
        </ModalBody>
        {this.state.popupTypeToShow === POPUP_TYPES_TO_SHOW.MAIN_FORM && (
          <ModalFooter style={ModalStyles.footerButtonsContainer}>
            {this.props.modals.type === MODAL_TYPES.ADD && (
              <MyButton type="submit" onClick={this.handleSubmitAssetType(FORM_SUBMIT_TYPES.ADD)}>
                {languageService("Add")}
              </MyButton>
            )}
            {this.props.modals.type === MODAL_TYPES.EDIT && (
              <MyButton type="submit" onClick={this.handleSubmitAssetType(FORM_SUBMIT_TYPES.EDIT)}>
                {languageService("Update")}{" "}
              </MyButton>
            )}
            <MyButton type="button" onClick={this.handleClose}>
              {languageService("Cancel")}
            </MyButton>
          </ModalFooter>
        )}
      </Modal>
    );
  }
}

// const getAssetType = curdActions.getAssetType;

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {},
};

let variables = {
  // diagnosticsReducer: {
  //     subdivisions: [],
  // },
};

let AddLineContainer = CRUDFunction(AddAssetTypeIndex, "AddAssetTypes", actionOptions, variables, [
  // "diagnosticsReducer",
]);
export default AddLineContainer;
