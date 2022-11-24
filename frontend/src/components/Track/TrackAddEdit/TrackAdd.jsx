import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Control, LocalForm, Errors, actions } from "react-redux-form";
import { isEmpty, isEmail } from "validator";
import DayPicker from "react-day-picker";
import "./trackform.css";
import moment from "moment";
import Select from "react-select";
import NumberFormat from "react-number-format";
import _ from "lodash";
import { languageService } from "../../../Language/language.service";
const Label = (props) => <label> {props.children}</label>;
const Field = (props) => <div className="field">{props.children}</div>;

const Required = () => <span className="required-fld">*</span>;
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class TrackAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: null,
      modalState: "None",
      track: {
        subdivision: "",
        trackType: "",
        trackId: "",
        weight: "",
        end: "",
        start: "",
        assetGroupLength: "",
        trafficType: "",
        class: "",
        units: [],
      },
    };

    this.errorWrapper = (props) => <div style={{ marginTop: "5px", fontSize: "12px", color: "#9d0707" }}>{props.children}</div>;
    this.errorShow = { touched: true, focus: false };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({
      modalState: "None",
      track: {
        subdivision: "",
        trackType: "",
        trackId: "",
        weight: "",
        end: "",
        start: "",
        assetGroupLength: "",
        trafficType: "",
        class: "",
        units: [],
      },
    });
    this.props.toggle("None", null);
  }

  handleChange(track) {
    this.setState({
      track: track,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modalState == "Add" && nextProps.modalState !== prevState.modalState) {
      let trafficType = "";
      let trackType = "";
      let classProp = "";
      if (nextProps.trafficTypes.length > 0) {
        trafficType = nextProps.trafficTypes[0].description;
      }
      if (nextProps.trackTypes.length > 0) {
        trackType = nextProps.trackTypes[0].description;
      }
      if (nextProps.classLevels.length > 0) {
        classProp = nextProps.classLevels[0].description;
      }
      return {
        track: {
          subdivision: "",
          trackType: trackType,
          trackId: "",
          weight: "",
          end: "",
          start: "",
          assetGroupLength: "",
          trafficType: trafficType,
          class: classProp,
          units: [],
        },
        modalState: nextProps.modalState,
      };
    } else if (nextProps.modalState == "Edit" && nextProps.modalState !== prevState.modalState) {
      return {
        selectedTrack: nextProps.selectedTrack,
        track: {
          subdivision: nextProps.selectedTrack.subdivision,
          trackType: nextProps.selectedTrack.trackType,
          trackId: nextProps.selectedTrack.trackId,
          weight: nextProps.selectedTrack.weight,
          end: nextProps.selectedTrack.end,
          start: nextProps.selectedTrack.start,
          assetGroupLength: nextProps.selectedTrack.assetGroupLength,
          trafficType: nextProps.selectedTrack.trafficType,
          class: nextProps.selectedTrack.class,
          units: nextProps.selectedTrack.units,
        },
        modalState: nextProps.modalState,
      };
    } else {
      return null;
    }
  }

  handleUpdate(form) {}
  handleSubmit(track) {
    // console.log(track)
    // console.log('state track : ')
    // console.log(this.state.track)
    if (this.state.modalState == "Add") {
      this.props.handleAddSubmit(this.state.track);
    }
    if (this.state.modalState == "Edit") {
      let copyTrack = _.cloneDeep(this.state.track);
      copyTrack.units = this.state.selectedTrack.units;
      this.props.handleEditSubmit(copyTrack);
    }
    this.setState({
      modalState: "None",
      track: {
        subdivision: "",
        trackType: "",
        trackId: "",
        weight: "",
        end: "",
        start: "",
        assetGroupLength: "",
        trafficType: "",
        class: "",
        units: [],
      },
    });
    this.props.toggle("None", null);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.trafficTypes !== prevProps.trafficTypes && this.props.trafficTypes.length > 0) {
      const { track } = this.state;
      let copyTrack = { ...track };
      copyTrack.trafficType = this.props.trafficTypes[0].description;
      this.setState({
        track: copyTrack,
      });
    }
    if (this.props.trackTypes !== prevProps.trackTypes && this.props.trackTypes.length > 0) {
      const { track } = this.state;
      let copyTrack = { ...track };
      copyTrack.trackType = this.props.trackTypes[0].description;
      this.setState({
        track: copyTrack,
      });
    }
    if (this.props.classLevels !== prevProps.classLevels && this.props.classLevels.length > 0) {
      const { track } = this.state;
      let copyTrack = { ...track };
      copyTrack.class = this.props.classLevels[0].description;
      this.setState({
        track: copyTrack,
      });
    }
  }

  render() {
    let trackTypeOptions = <option> </option>;
    if (this.props.trackTypes) {
      trackTypeOptions = this.props.trackTypes.map((trackType) => {
        return (
          <option key={trackType.code} value={trackType.description}>
            {trackType.description}
          </option>
        );
      });
    }
    let trafficOptions = <option> </option>;
    if (this.props.trafficTypes) {
      trafficOptions = this.props.trafficTypes.map((trafficType) => {
        return (
          <option key={trafficType.code} value={trafficType.description}>
            {trafficType.description}
          </option>
        );
      });
    }
    let subdivision = <option> </option>;
    if (this.props.subdivisions) {
      subdivision = this.props.subdivisions.map((subdiv) => {
        return (
          <option key={subdiv.code} value={subdiv.description}>
            {subdiv.description}
          </option>
        );
      });
    }
    let classOptions = <option> </option>;
    if (this.props.classLevels) {
      classOptions = this.props.classLevels.map((classObj) => {
        return (
          <option key={classObj.code} value={classObj.description}>
            {classObj.description}
          </option>
        );
      });
    }
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
        <LocalForm
          className="trackform"
          model="track"
          onUpdate={(form) => this.handleUpdate(form)}
          validators={this.trackValidator}
          onChange={(values) => this.handleChange(values)}
          onSubmit={(values) => this.handleSubmit(values)}
          initialState={this.state.track}
        >
          {this.state.modalState == "Add" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Add New Asset Group")}</ModalHeader>
          )}
          {this.state.modalState == "Edit" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Edit Asset Group")}</ModalHeader>
          )}
          <ModalBody>
            <Field>
              <Label>{languageService("Subdivision")} :</Label>
              <Control.select model="track.subdivision">
                <option> </option>
                {subdivision}
              </Control.select>
            </Field>

            <Field>
              <Label>
                {languageService("Segment ID")} :<Required />
              </Label>
              <Control.text
                model="track.trackId"
                disabled={this.state.modalState == "Edit" ? true : false}
                placeholder="Segment ID"
                validators={{
                  required: (val) => val && val.length,
                }}
              />
              <Errors
                model="track.trackId"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Segment ID.",
                }}
              />
            </Field>
            <Field>
              <Label>Weight (MGT) :</Label>
              <Control.text model="track.weight" component={NumberFormat} placeholder="Track Allowed Weight MGT" />
              <Errors
                model="track.weight"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Allowed Weight.",
                }}
              />
            </Field>
            <Field>
              <Label>{languageService("Track Type")} :</Label>
              <Control.select model="track.trackType">{trackTypeOptions}</Control.select>
            </Field>
            <Field>
              <Label>{languageService("Traffic Type")} :</Label>
              <Control.select model="track.trafficType">{trafficOptions}</Control.select>
            </Field>
            <Field>
              <Label>{languageService("Class")} :</Label>
              <Control.select model="track.class">{classOptions}</Control.select>
            </Field>

            <Field>
              <Label>{languageService("Start (milepost)")} :</Label>
              <Control.text model="track.start" component={NumberFormat} placeholder="Starting Milepost" />
              <Errors
                model="track.start"
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
              <Control.text model="track.end" component={NumberFormat} placeholder="End Milepost" />
              <Errors
                model="track.end"
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
              <Control.text model="track.assetGroupLength" component={NumberFormat} placeholder="Length in Milepost" />
              <Errors
                model="track.assetGroupLength"
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
            {this.state.modalState == "Add" && <MyButton type="submit">{languageService("Add")} </MyButton>}
            {this.state.modalState == "Edit" && <MyButton type="submit">{languageService("Update ")}</MyButton>}
            <MyButton type="button" onClick={this.handleClose}>
              {languageService("Close")}
            </MyButton>
          </ModalFooter>
        </LocalForm>
      </Modal>
    );
  }
}

export default TrackAdd;
