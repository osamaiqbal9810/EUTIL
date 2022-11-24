import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import { Control, LocalForm, Errors, actions } from "react-redux-form";
import "../commonform.css";
import { MILEPOST_VARS } from "../../../utils/globals";
import { languageService } from "../../../Language/language.service";
import { Label, Field, MyButton } from "../Forms/formsMiscItems";

import { themeService } from "theme/service/activeTheme.service";
import { CommonFormStyle } from "components/SetupPage/User/UserForm/style";
import { retroColors } from "style/basic/basicColors";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";

// const Label = props => <label> {props.children}</label>;
// const Field = props => <div className="field">{props.children}</div>;
// const MyButton = props => (
//   <button className="setPasswordButton" {...props}>
//     {props.children}
//   </button>
// );
class LocationSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationSpecial: this.props.locationSpecial
        ? this.props.locationSpecial
        : {
            lat: "",
            lon: "",
            start: "",
            end: "",
          },
    };
  }

  handleChange(loc) {
    const { locationSpecial } = this.state;
    let locCopy = { ...locationSpecial };
    locCopy = loc;
    this.setState({
      locationSpecial: locCopy,
    });
  }
  handleSubmit(loc) {
    let start = parseFloat(loc.start);
    let end = parseFloat(loc.end);
    let message = "";
    let valid = true;

    if (valid && start >= end) {
      valid = false;
      message = `Milepost start must be less  or equal to milepost end`;
    }

    if (valid && start < MILEPOST_VARS.MIN) {
      valid = false;
      message = `Milepost start must be greater or equal to ${MILEPOST_VARS.MIN}`;
    }

    if (valid && start > MILEPOST_VARS.MAX) {
      valid = false;
      message = `Milepost start must be less or equal to ${MILEPOST_VARS.MAX}`;
    }

    if (valid && end < MILEPOST_VARS.MIN) {
      valid = false;
      message = `Milepost end must be greater or equal to ${MILEPOST_VARS.MIN}`;
    }

    if (valid && end > MILEPOST_VARS.MAX) {
      valid = false;
      message = `Milepost end must be less or equal to ${MILEPOST_VARS.MAX}`;
    }

    if (valid) {
      loc = {
        ...loc,
        start: start ? start.toFixed(2) : "",
        end: end ? end.toFixed(2) : "",
      };
      this.props.saveLocation(loc);
    } else {
      this.setState({ message });
    }
  }

  render() {
    return (
      <div>
        <LocalForm
          model="locationSpecial"
          onUpdate={form => {}}
          validators={this.trackValidator}
          onChange={values => this.handleChange(values)}
          onSubmit={values => this.handleSubmit(values)}
          initialState={this.state.locationSpecial}
        >
          <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
            {languageService("Location")}
          </ModalHeader>

          <ModalBody style={themeService(CommonModalStyle.body)}>
            <Field>
              <div style={{ marginBottom: "20px" }}>
                <Label>Lat :</Label>
                <Control.text
                  type="number"
                  model="locationSpecial.lat"
                  placeholder="Lat"
                  // validators={{
                  //   required: val => val && val.length
                  // }}
                />
              </div>
            </Field>
            <Field>
              <div style={{ marginBottom: "20px" }}>
                <Label>Lon :</Label>
                <Control.text
                  type="number"
                  model="locationSpecial.lon"
                  placeholder="Lon"
                  // validators={{
                  //   required: val => val && val.length
                  // }}
                />
              </div>
            </Field>
            <Field>
              <div style={{ marginBottom: "20px" }}>
                <Label>{languageService("Milepost Start")} :</Label>
                <Control.text
                  type="number"
                  model="locationSpecial.start"
                  placeholder={languageService("Start")}
                  // validators={{
                  //   required: val => val && val.length
                  // }}
                />
              </div>
            </Field>
            <Field>
              <div style={{ marginBottom: "20px" }}>
                <Label>{languageService("Milepost End")} :</Label>
                <Control.text
                  type="number"
                  model="locationSpecial.end"
                  placeholder={languageService("End")}
                  // validators={{
                  //   required: val => val && val.length
                  // }}
                />
              </div>
            </Field>
          </ModalBody>
          <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
            <MyButton type="submit">{languageService("Save")} </MyButton>
            <MyButton type="button" onClick={this.props.handleCloseLocationSelection}>
              {languageService("Cancel")}
            </MyButton>
          </ModalFooter>
        </LocalForm>
      </div>
    );
  }
}

export default LocationSelection;
