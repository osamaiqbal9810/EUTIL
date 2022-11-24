import React from "react";
import { Row, Col } from "reactstrap";
import { languageService } from "../../../Language/language.service";
import moment from "moment";
import { themeService } from "../../../theme/service/activeTheme.service";

function ExecDetail(props) {
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
        {props.m0.timestamp && (
          <Col md={"12"}>
            <div style={props.fieldHeading}>
              {languageService("Maintenance")} {languageService("Executed at")}:
            </div>
            <div style={props.fieldText}>{moment(moment.utc(props.m0.timestamp).toDate()).format("llll")}</div>
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
          <div style={props.fieldHeading}>{languageService("Information")} :</div>
          <div style={props.fieldText}>
            {/* <Gravatar style={{ borderRadius: '30px', marginRight: '5px' }} email={'abc@abc.com'} size={20} /> */}
            {props.m0.voiceNotes}
          </div>
        </Col>
        <Col md={"6"}>
          <div style={props.fieldHeading}>{languageService("MP Start ")} :</div>
          <div style={props.fieldText}>
            {/* <Gravatar style={{ borderRadius: '30px', marginRight: '5px' }} email={'abc@abc.com'} size={20} /> */}
            {props.m0.startMp}
          </div>
        </Col>
        <Col md={"6"}>
          <div style={props.fieldHeading}>{languageService("MP End")} :</div>
          <div style={props.fieldText}>
            {/* <Gravatar style={{ borderRadius: '30px', marginRight: '5px' }} email={'abc@abc.com'} size={20} /> */}
            {props.m0.endMp}
          </div>
        </Col>

        <Col md={"12"}>
          <div style={props.fieldHeading}>{languageService("Status")}: </div>
          <div style={props.fieldText}>{props.m1.status}</div>
        </Col>
        <Col md={"12"}>
          <div style={props.fieldHeading}>{languageService("Location")}: </div>
          <div style={props.fieldText}>{props.m1.lineName ? props.m1.lineName : props.m1.lineId}</div>
        </Col>
      </Row>
    </div>
  );
}
export default ExecDetail;
