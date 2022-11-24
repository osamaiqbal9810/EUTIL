import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Control, LocalForm, Errors, actions } from "react-redux-form";
import { isEmpty, isEmail } from "validator";
import DayPicker from "react-day-picker";
import "./unitform.css";
import moment from "moment";
import Select from "react-select";
import NumberFormat from "react-number-format";
import _ from "lodash";
import { languageService } from "../../../../Language/language.service";
const Label = (props) => <label> {props.children}</label>;
const Field = (props) => <div className="field">{props.children}</div>;

const Required = () => <span className="required-fld">*</span>;
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class UnitsAddEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalState: "None",
      unit: {
        assetType: "",
        end: "",
        start: "",
        assetLength: "",
        pastIssue: "",
        lastInspection: "",
        nextInspection: "",
        lonStart: "",
        lonEnd: "",
        latStart: "",
        latEnd: "",
      },
    };
    this.handleClose = this.handleClose.bind(this);

    this.errorWrapper = (props) => <div style={{ marginTop: "5px", fontSize: "12px", color: "#9d0707" }}>{props.children}</div>;
    this.errorShow = { touched: true, focus: false };
  }

  handleClose() {
    this.setState({
      modalState: "None",
      unit: {
        assetType: "",
        end: "",
        start: "",
        assetLength: "",
        pastIssue: "",
        lastInspection: "",
        nextInspection: "",
        unitId: "",
        lonStart: "",
        lonEnd: "",
        latStart: "",
        latEnd: "",
      },
    });
    this.props.toggle("None", null);
  }

  handleChange(unitForm) {
    const unitCopy = this.state.unit;
    let unitState = { ...unitCopy };
    unitState.assetType = unitForm.assetType;
    unitState.start = unitForm.start;
    unitState.end = unitForm.end;
    unitState.assetLength = unitForm.assetLength;
    unitState.unitId = unitForm.unitId;
    if (this.state.modalState == "Add") {
      unitState.pastIssue = unitForm.pastIssue;
      unitState.lastInspection = unitForm.lastInspection;
      unitState.nextInspection = unitForm.nextInspection;
    }
    this.setState({
      unit: unitState,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modalState == "Add" && nextProps.modalState !== prevState.modalState) {
      return {
        unit: {
          assetType: "",
          end: "",
          start: "",
          assetLength: "",
          pastIssue: "",
          lastInspection: "",
          nextInspection: "",
          lonStart: "",
          lonEnd: "",
          latStart: "",
          latEnd: "",
          unitId: "",
        },
        modalState: nextProps.modalState,
      };
    } else if (nextProps.modalState == "Edit" && nextProps.modalState !== prevState.modalState) {
      let unitObj = _.cloneDeep(nextProps.selectedUnit);
      if (nextProps.selectedUnit.coordinates) {
        if (nextProps.selectedUnit.coordinates.length > 0) {
          if (nextProps.selectedUnit.coordinates[0]) {
            unitObj.latStart = nextProps.selectedUnit.coordinates[0][0];
            unitObj.lonStart = nextProps.selectedUnit.coordinates[0][1];
          }
          if (nextProps.selectedUnit.coordinates[1]) {
            unitObj.latEnd = nextProps.selectedUnit.coordinates[1][0];
            unitObj.lonEnd = nextProps.selectedUnit.coordinates[1][1];
          }
        }
      }

      return {
        unit: unitObj,
        modalState: nextProps.modalState,
      };
    } else {
      return null;
    }
  }

  handleUpdate(form) {}
  handleSubmit(unit) {
    //console.log(unit)
    //console.log('state unit : ')
    //console.log(this.state.unit)
    let unitCopy = _.cloneDeep(this.state.unit);
    unitCopy.coordinates = [
      [unit.latStart, unit.lonStart],
      [unit.latEnd, unit.lonEnd],
    ];
    if (this.state.modalState == "Add") {
      this.props.handleAddSubmit(unitCopy);
    }
    if (this.state.modalState == "Edit") {
      this.props.handleEditSubmit(unitCopy);
    }
    this.setState({
      modalState: "None",

      unit: {
        assetType: "",
        end: "",
        start: "",
        assetLength: "",
        pastIssue: "",
        lastInspection: "",
        nextInspection: "",
        lonStart: "",
        lonEnd: "",
        latStart: "",
        latEnd: "",
        unitId: "",
      },
    });
    this.props.toggle("None", null);
  }

  render() {
    let assetTypes = <option> </option>;
    if (this.props.assetTypes) {
      assetTypes = this.props.assetTypes.map((assetType) => {
        return (
          <option key={assetType.code} value={assetType.description}>
            {assetType.description}
          </option>
        );
      });
    }
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
        <LocalForm
          className="unitform"
          model="unit"
          onUpdate={(form) => this.handleUpdate(form)}
          validators={this.trackValidator}
          onChange={(values) => this.handleChange(values)}
          onSubmit={(values) => this.handleSubmit(values)}
          initialState={this.state.unit}
        >
          {this.state.modalState == "Add" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Add New Asset")}</ModalHeader>
          )}
          {this.state.modalState == "Edit" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Edit Asset")}</ModalHeader>
          )}
          <ModalBody>
            <Field>
              <Label>
                {languageService("Asset Type")} :<Required />
              </Label>
              <Control.select
                model="unit.assetType"
                validators={{
                  required: (val) => val && val.length,
                }}
              >
                <option> </option>
                {assetTypes}
              </Control.select>
              <Errors
                model="unit.assetType"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please Select Asset Type.",
                }}
              />
            </Field>
            <Field>
              <Label>
                {languageService("Asset ID")} :<Required />
              </Label>
              <Control.text
                model="unit.unitId"
                placeholder="Asset ID"
                validators={{
                  required: (val) => val && val.length,
                }}
              />
              <Errors
                model="unit.unitId"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Asset ID.",
                }}
              />
            </Field>
            <Field>
              <Row style={{ margin: "0px" }}>
                <Label>{languageService("Location Lattitude Start")} :</Label>
              </Row>
              <Row>
                <Col md="4">
                  <Control.text model="unit.latStart" component={NumberFormat} placeholder="Lat Start" />
                  <Errors
                    model="unit.latStart"
                    wrapper={this.errorWrapper}
                    component={this.errorComponent}
                    show={this.errorShow}
                    messages={{
                      required: "Please provide Start Latitude.",
                    }}
                  />
                </Col>
                <Col md="4">
                  <Control.text model="unit.lonStart" component={NumberFormat} placeholder="Lon Start" />
                  <Errors
                    model="unit.lonStart"
                    wrapper={this.errorWrapper}
                    component={this.errorComponent}
                    show={this.errorShow}
                    messages={{
                      required: "Please provide Start Longitude.",
                    }}
                  />
                </Col>
              </Row>
            </Field>
            <Field>
              <Row style={{ margin: "0px" }}>
                <Label>{languageService("Location Lattitude End")} :</Label>
              </Row>
              <Row>
                <Col md="4">
                  <Control.text model="unit.latEnd" component={NumberFormat} placeholder="Lat End" />
                  <Errors
                    model="unit.latEnd"
                    wrapper={this.errorWrapper}
                    component={this.errorComponent}
                    show={this.errorShow}
                    messages={{
                      required: "Please provide End Latitude.",
                    }}
                  />
                </Col>
                <Col md="4">
                  <Control.text model="unit.lonEnd" component={NumberFormat} placeholder="Lon End" />
                  <Errors
                    model="unit.lonEnd"
                    wrapper={this.errorWrapper}
                    component={this.errorComponent}
                    show={this.errorShow}
                    messages={{
                      required: "Please provide End Longitude.",
                    }}
                  />
                </Col>
              </Row>
            </Field>

            <Field>
              <Label>Start (milepost) :</Label>
              <Control.text model="unit.start" component={NumberFormat} placeholder="Starting Milepost" />
              <Errors
                model="unit.start"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Starting Milepost.",
                }}
              />
            </Field>
            <Field>
              <Label>{languageService("End (milepost)")} :</Label>
              <Control.text model="unit.end" component={NumberFormat} placeholder="End Milepost" />
              <Errors
                model="unit.end"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide End Milepost.",
                }}
              />
            </Field>
            <Field>
              <Label>{languageService("Length (mileposts)")} :</Label>
              <Control.text model="unit.assetLength" component={NumberFormat} placeholder="Length in Milepost" />
              <Errors
                model="unit.assetLength"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Length.",
                }}
              />
            </Field>
            {/* <Field>
              <Label>Past Issue :</Label>
              <Control.text model="unit.pastIssue" placeholder="Past Issue" />
              <Errors
                model="unit.pastIssue"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: 'Please provide .'
                }}
              />
            </Field>
            <Field>
              <Label>Last Inspection :</Label>
              <Control.text model="unit.lastInspection" placeholder="Date" />
              <Errors
                model="unit.lastInspection"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: 'Please provide .'
                }}
              />
            </Field>
            <Field>
              <Label>Next Inspection :</Label>
              <Control.text model="unit.nextInspection" placeholder="Date" />
              <Errors
                model="unit.nextInspection"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: 'Please provide .'
                }}
              />
            </Field> */}
          </ModalBody>
          <ModalFooter style={ModalStyles.footerButtonsContainer}>
            {this.state.modalState == "Add" && <MyButton type="submit">{languageService("Add")}</MyButton>}
            {this.state.modalState == "Edit" && <MyButton type="submit">{languageService("Edit")} </MyButton>}
            <MyButton type="button" onClick={this.handleClose}>
              {languageService("Close")}
            </MyButton>
          </ModalFooter>
        </LocalForm>
      </Modal>
    );
  }
}

export default UnitsAddEdit;
