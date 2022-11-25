import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Control, LocalForm, Errors, actions } from "react-redux-form";
import { isEmpty, isEmail } from "validator";
import DayPicker from "react-day-picker";
import "./teamform.css";
import moment from "moment";
import Select from "react-select";
import { languageService } from "../../../Language/language.service";

const Label = (props) => <label>{props.children}</label>;
const Field = (props) => <div className="field">{props.children}</div>;

const Required = () => <span className="required-fld">*</span>;
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class TeamAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: null,
      showDatePicker: false,
      team: {
        teamLead: "",
        users: [],
      },
    };

    this.handleChangeMultiSelect = this.handleChangeMultiSelect.bind(this);

    this.usersOptions = [
      { value: "abc@abc.com", label: "John Jack" },
      { value: "abc2@abc.com", label: "John Jack" },
      { value: "abc3@abc.com", label: "John Jack" },
    ];
    this.teamLeadOptions = [
      { value: "abc@abc.com", label: "Supervisor 1" },
      { value: "abc2@abc.com", label: "Supervisor 4" },
    ];
    this.multiSelectStyle = {
      control: (styles) => ({ ...styles, fontSize: "12px", backgroundColor: "white", height: "15px" }),
      option: (base, state) => ({
        ...base,
        color: "var(--first)",
        fontSize: "12px",
      }),
    };
    this.selectStyle = {
      control: (styles) => ({ ...styles, fontSize: "12px", backgroundColor: "white", height: "15px" }),
      option: (base, state) => ({
        ...base,
        color: "var(--first)",
        fontSize: "12px",
      }),
    };
  }

  handleChange(team) {
    this.setState({
      team: this.state.team,
    });
  }
  handleChangeMultiSelect(selectedUsers) {
    this.setState({
      team: {
        teamLead: this.state.team.teamLead,
        users: selectedUsers,
      },
    });
  }
  handleChangeSelect(selectedUser) {
    this.setState({
      team: {
        teamLead: selectedUser,
        users: this.state.team.users,
      },
    });
  }

  handleUpdate(form) {}
  handleSubmit(team) {
    //console.log(team);
    //console.log("state team : ");
    //console.log(this.state.team);
    this.props.toggle();
  }

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
        <LocalForm
          className="teamform"
          model="team"
          onUpdate={(form) => this.handleUpdate(form)}
          validators={this.teamValidator}
          onChange={(values) => this.handleChange(values)}
          onSubmit={(values) => this.handleSubmit(values)}
        >
          <ModalHeader style={ModalStyles.modalteamLeadStyle}>{languageService("Create New Team")}</ModalHeader>
          <ModalBody>
            <Field>
              <label className="fullWidth">
                {languageService("Team Lead")} :<Required />
              </label>

              <Select styles={this.selectStyle} options={this.teamLeadOptions} onChange={this.handleChangeMultiSelect} />
            </Field>
            <Field>
              <label className="fullWidth">
                {languageService("Team Members")} :<Required />
              </label>

              <Select
                closeMenuOnSelect={false}
                styles={this.multiSelectStyle}
                options={this.usersOptions}
                isMulti
                onChange={this.handleChangeMultiSelect}
              />
            </Field>
          </ModalBody>

          <ModalFooter style={ModalStyles.footerButtonsContainer}>
            <MyButton type="submit">{languageService("Add")}</MyButton>{" "}
            <MyButton type="button" onClick={this.props.toggle}>
              {languageService("Close")}
            </MyButton>
          </ModalFooter>
        </LocalForm>
      </Modal>
    );
  }
}

export default TeamAdd;
