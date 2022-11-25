import React from "react";
import { Row, Col } from "reactstrap";
import { languageService } from "../../../Language/language.service";
import moment from "moment";
import { themeService } from "../../../theme/service/activeTheme.service";

function Detail(props) {
  return (
    <div
      style={{
        margin: "0 0 10px 0",
        boxShadow: "rgb(207, 207, 207) 1px 1px 2px",
        padding: "15px",
        textAlign: "left",
        marginBottom: "20px",
      }}
    >
      <Row>
        {props.m1.timestamp && (
          <Col md={"12"}>
            <div style={props.fieldHeading}>
              {languageService("Issue")} {languageService("Created at")}:{" "}
            </div>
            <div style={props.fieldText}>{moment(moment.utc(props.m1.timestamp).toDate()).format("llll")}</div>
          </Col>
        )}

        {props.m1.workOrderNumber && (
          <Col md={"12"}>
            <div style={props.fieldHeading}>{languageService("Work Order")} #: </div>
            <div style={props.fieldText}>{props.m1.workOrderNumber}</div>
          </Col>
        )}
        <Col md={"12"}>
          <div style={props.fieldHeading}>{languageService("MR Number")} :</div>
          <div style={props.fieldText}>
            {/* <Gravatar style={{ borderRadius: '30px', marginRight: '5px' }} email={'abc@abc.com'} size={20} /> */}
            {props.m1.mrNumber}
          </div>
        </Col>
        <Col md={"12"}>
          <div style={props.fieldHeading}>{languageService("Type")}: </div>
          <div style={props.fieldText}>{props.m1.maintenanceType ? props.m1.maintenanceType : ""}</div>
        </Col>
        <Col md={"12"}>
          <div style={props.fieldHeading}>{languageService("Information")}:</div>
          <div style={props.fieldText}>{props.m1.issue && props.m1.issue.voiceNotes ? props.m1.issue.voiceNotes : ""}</div>
        </Col>
        {moment(props.m1.createdAt).isValid() && (
          <Col md={"12"}>
            <div style={props.fieldHeading}>MR {languageService("Created at")}: </div>
            <div style={props.fieldText}>{moment(props.m1.createdAt).format("llll")}</div>
          </Col>
        )}
        {
          <Col md={"12"}>
            <div style={props.fieldHeading}>{languageService("Created by")}: </div>
            {props.getUserDisplay(props.m1.createdBy, props.execution)}
          </Col>
        }

        <Col md={"12"}>
          <div style={props.fieldHeading}>{languageService("Status")}: </div>
          <div style={props.fieldText}>{props.m1.status}</div>
        </Col>

        {/* <Col md={"3"}>
            <div style={props.fieldHeading}>{languageService("Marked On Site")}</div>
            <div style={props.fieldText}>{m1.markedOnSite ? m1.markedOnSite.toString() : ""}</div>
          </Col> */}

        {/* <Col md={"12"}>
          <div style={props.fieldHeading}>{languageService("Priority")}: </div>
          <div style={props.fieldText}>{props.m1.priority}</div>
        </Col> */}
        <Col md={"12"}>
          <div style={props.fieldHeading}>{languageService("Source")}: </div>
          <div style={props.fieldText}>{props.m1.sourceType}</div>
        </Col>
        <Col md={"12"}>
          <div style={props.fieldHeading}>{languageService("Location")}: </div>
          <div style={props.fieldText}>{props.m1.lineName ? props.m1.lineName : props.m1.lineId}</div>
        </Col>
        {/* <Col md="1">{showAddButton}</Col> */}
      </Row>
    </div>
  );
}

export default Detail;
