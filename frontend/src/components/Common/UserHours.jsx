import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // CustomInput,
  FormGroup,
  Label,
  Input,
  // Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import { languageService } from "Language/language.service";
let addButtonStyle = {
  marginBottom: "20px",
  color: "rgba(64, 118, 179)",
  fontSize: "26px",
  cursor: "pointer",
  textDecoration: "none",
};
let labelStyling = {
  margin: "0",
  float: "left",
  fontSize: "14px",
  color: "rgba(64, 118, 179)",
  lineHeight: "34px",
};
let modalHeadinStyle = {
  padding: "15px",
  textAlign: "left",
  fontWeight: "600",
  color: "rgb(64, 118, 179)",
};
let inputStyle = {
  display: "block",
  width: "100%",
  height: "34px",
  padding: "6px 12px",
  fontSize: "12px",
  lineHeight: "1.42857143",
  color: "rgba(64, 118, 179)",
  backgroundColor: "#fff",
  backgroundImage: "none",
  border: "1px solid #e3e9ef",
  borderRadius: "2px",
  boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
  transition: "border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
  transition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s",
  transition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
};
let btnStyle = {
  height: "30px",
  width: "160px",
  backgroundColor: "rgba(64, 118, 179)",
  border: "1px solid #e3e9ef",
  color: "#fff",
  fontSize: "12px",
  cursor: "pointer",
  borderRadius: "4px",
  transitionDuration: "0.4s",
};
let btnStyleCancel = {
  height: "30px",
  width: "160px",
  backgroundColor: "#6c757d",
  border: "1px solid #e3e9ef",
  color: "#fff",
  fontSize: "12px",
  cursor: "pointer",
  borderRadius: "4px",
  transitionDuration: "0.4s",
};
export const UserHours = props => (
  <div className="static-modal">
    <Modal isOpen={props.modal}>
      <ModalHeader style={modalHeadinStyle} toggle={props.onCancel}>
        {languageService("User Availability")}
      </ModalHeader>
      <ModalBody>
        <div>
          {props.userHours.map((obj, key) => {
            return (
              <HoursRow
                key={key}
                day={obj}
                index={key}
                toggleBreakClick={props.onClickBreak}
                onChangeStart={props.onChangeStart}
                onChangeEnd={props.onChangeEnd}
                onChangeStartBreakTime={props.onChangeStartBreak}
                onChangeEndBreakTime={props.onChangeEndBreak}
                onChangeBreakTag={props.onChangeBreakTag}
              />
            );
          })}
        </div>
        <div>{props.children} </div>
      </ModalBody>
      <ModalFooter>
        <Button style={btnStyle} color="primary" onClick={props.update}>
          {languageService("Update")}
        </Button>{" "}
        <Button style={btnStyleCancel} color="secondary" onClick={props.onCancel}>
          {languageService("Cancel")}
        </Button>
      </ModalFooter>
    </Modal>
  </div>
);

export const HoursRow = props => (
  <div key={props.index}>
    <Row>
      <Col md="3">
        <Label style={labelStyling} id={props.index}>
          {languageService(props.day.checkboxLabel)}
        </Label>
      </Col>
      <Col md="4" style={{ paddingRight: "2px" }}>
        <Input
          style={inputStyle}
          type="time"
          name="time"
          id={props.index}
          value={props.day.startTime}
          placeholder="time placeholder"
          onChange={value => {
            props.onChangeStart(props.index, value);
          }}
        />
      </Col>
      <Col md="4" style={{ paddingLeft: "2px", paddingRight: "4px" }}>
        <Input
          style={inputStyle}
          type="time"
          name="time"
          id={props.index}
          placeholder="time placeholder"
          value={props.day.endTime}
          onChange={value => {
            props.onChangeEnd(props.index, value);
          }}
        />{" "}
      </Col>
      <Col md="1" style={{ paddingRight: "2px" }}>
        <UncontrolledTooltip placement="right" target={props.day.checkboxLabel}>
          {languageService("Add Break!")}
        </UncontrolledTooltip>
        <a
          style={addButtonStyle}
          id={props.day.checkboxLabel}
          href="#"
          onClick={e => {
            props.toggleBreakClick(props.index, !props.day.toggleBreak);
          }}
        >
          {" "}
          +
        </a>
      </Col>
    </Row>
    {props.day.toggleBreak && (
      <Row>
        <Col md="3">
          <FormGroup>
            <Input
              style={inputStyle}
              type="text"
              name="breakTag"
              id="break-tag"
              placeholder="Tag a break"
              value={props.day.breakTag}
              onChange={e => {
                props.onChangeBreakTag(props.index, e);
              }}
            />
          </FormGroup>
        </Col>
        <Col md="4" style={{ paddingRight: "2px" }}>
          <Input
            style={inputStyle}
            type="time"
            name="time"
            id={props.index}
            value={props.day.breakStartTime}
            placeholder="time placeholder"
            onChange={value => {
              props.onChangeStartBreakTime(props.index, value);
            }}
          />
        </Col>
        <Col md="4" style={{ paddingLeft: "2px", paddingRight: "4px" }}>
          <Input
            style={inputStyle}
            type="time"
            name="time"
            id={props.index}
            value={props.day.breakEndTime}
            placeholder="time placeholder"
            onChange={value => {
              props.onChangeEndBreakTime(props.index, value);
            }}
          />
        </Col>
      </Row>
    )}
  </div>
);
