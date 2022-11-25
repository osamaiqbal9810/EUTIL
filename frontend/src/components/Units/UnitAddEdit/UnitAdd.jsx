import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Control, LocalForm, Errors, actions } from "react-redux-form";
import { isEmpty, isEmail } from "validator";
import DayPicker from "react-day-picker";
import "./planform.css";
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

class UnitAddEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: null,
      showDatePicker: false,
      unit: {
        name: "",
        start: "",
        end: "",
        length: "",
      },
    };
    // this.handleDayClick = this.handleDayClick.bind(this);
    // this.handleCalanderShow = this.handleCalanderShow.bind(this);
    // this.handleChangeMultiSelect = this.handleChangeMultiSelect.bind(this);

    this.unitOptions = [
      { value: "123", label: "Unit 201" },
      { value: "234", label: "Unit 20" },
      { value: "345", label: "Unit 50" },
    ];
    this.multiSelectStyle = {
      control: (styles) => ({ ...styles, backgroundColor: "white", height: "15px" }),
      option: (base, state) => ({
        ...base,
        color: "var(--first)",
        fontSize: "12px",
      }),
    };
  }

  // handleCalanderShow() {
  // 	this.setState({
  // 		showDatePicker: !this.state.showDatePicker,
  // 	});
  // }

  // handleDayClick(day, { selected }) {
  // 	this.setState({
  // 		selectedDay: selected ? undefined : day,
  // 		showDatePicker: !this.state.showDatePicker,
  // 		unit: {
  // 			name: this.state.unit.name,
  // 			start: this.state.unit.start,
  // 		},
  // 	});
  // }

  handleChange(unit) {
    this.setState({
      unit: {
        name: unit.name,
        start: unit.start,
        end: unit.end,
        length: unit.length,
      },
    });
  }
  // handleChangeMultiSelect(selectedUnits) {
  // 	this.setState({
  // 		unit: {
  // 			name: this.state.unit.name,
  // 			start: this.state.unit.start,
  // 		},
  // 	});
  // }

  handleUpdate(form) {}
  handleSubmit(unit) {
    //console.log(unit);
    //console.log("state unit : ");
    //console.log(this.state.unit);
    this.props.toggle();
  }

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
        <LocalForm
          className="unitform"
          model="unit"
          onUpdate={(form) => this.handleUpdate(form)}
          validators={this.planValidator}
          onChange={(values) => this.handleChange(values)}
          onSubmit={(values) => this.handleSubmit(values)}
        >
          <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Add New Unit")} </ModalHeader>
          <ModalBody>
            <Field>
              <Label>
                NAME :<Required />
              </Label>
              <Control.text model="unit.name" placeholder="Name" />
              <Errors
                model="unit.name"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Unit Name.",
                }}
              />
            </Field>
            <Field>
              <Label>
                Start :<Required />
              </Label>
              <Control.text model="unit.start" placeholder="Start Range" />
              <Errors
                model="unit.start"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Start Range.",
                }}
              />
            </Field>
            <Field>
              <Label>
                End :<Required />
              </Label>
              <Control.text model="unit.end" placeholder="End Range" />
              <Errors
                model="unit.end"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide End Range.",
                }}
              />
            </Field>
            <Field>
              <Label>
                Length :<Required />
              </Label>
              <Control.text model="unit.length" placeholder="Length" />
              <Errors
                model="unit.length"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Length.",
                }}
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

export default UnitAddEdit;
