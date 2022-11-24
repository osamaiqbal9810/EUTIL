import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Control, LocalForm, Errors, actions } from "react-redux-form";
import { ModalStyles } from "components/Common/styles.js";
import { languageService } from "../../../../Language/language.service";

const Label = (props) => <label> {props.children}</label>;
const Field = (props) => <div className="field">{props.children}</div>;

const Required = () => <span className="required-fld">*</span>;
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class PermissionAddEdit extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      name: "",
      resource: "",
      action: "",
    };
    this.state = {
      modalState: "None",
      permission: {
        name: "",
        resource: "",
        action: "",
      },
    };

    this.handleClose = this.handleClose.bind(this);
  }
  handleClose() {
    this.setState({
      modalState: "None",
      permission: this.initialState,
      showCodeDuplciateMsg: false,
    });
    this.props.toggle("None", null);
  }

  handleChange(newPermValue) {
    this.setState({
      permission: newPermValue,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modalState == "Add" && nextProps.modalState !== prevState.modalState) {
      return {
        permission: {
          name: "",
          resource: "",
          action: "",
        },
        modalState: nextProps.modalState,
      };
    } else if (
      nextProps.modalState == "Edit" &&
      nextProps.modalState !== prevState.modalState &&
      nextProps.selectedPermission !== prevState.permission
    ) {
      return {
        permission: nextProps.selectedPermission,
        modalState: nextProps.modalState,
      };
    } else {
      return null;
    }
  }
  handleSubmit(permission) {
    if (this.state.modalState == "Add") {
      this.props.handleAddSubmit(this.state.permission);
    }
    if (this.state.modalState == "Edit") {
      this.props.handleEditSubmit(this.state.permission);
    }
    this.setState({
      modalState: "None",
      permission: this.initialState,
    });
    this.props.toggle("None", null);
  }

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
        <LocalForm
          className="commonform"
          model="permission"
          onChange={(values) => this.handleChange(values)}
          onSubmit={(values) => this.handleSubmit(values)}
          initialState={this.state.permission}
        >
          {this.state.modalState == "Add" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Add Permission")}</ModalHeader>
          )}
          {this.state.modalState == "Edit" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Edit Permission")}</ModalHeader>
          )}
          <ModalBody>
            <Field>
              <Label>
                {languageService("Name")} :<Required />
              </Label>
              <Control.text model="permission.name" placeholder="name" />
              <Errors
                model="permission.name"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Permission Name.",
                }}
              />
            </Field>
            <Field>
              <Label>{languageService("Resource")} :</Label>
              <Control.text model="permission.resource" placeholder="resource" />
              <Errors
                model="permission.resource"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Permission Resource.",
                }}
              />
            </Field>

            <Field>
              <Label>{languageService("Action")} :</Label>
              <Control.text model="permission.action" placeholder="action" />
              <Errors
                model="permission.action"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Action.",
                }}
              />
            </Field>
          </ModalBody>
          <ModalFooter style={ModalStyles.footerButtonsContainer}>
            {this.state.modalState == "Add" && <MyButton type="submit">{languageService("Add")} </MyButton>}
            {this.state.modalState == "Edit" && <MyButton type="submit">{languageService("Update")} </MyButton>}
            <MyButton type="button" onClick={this.handleClose}>
              {languageService("Close")}
            </MyButton>
          </ModalFooter>
        </LocalForm>
      </Modal>
    );
  }
}

export default PermissionAddEdit;
