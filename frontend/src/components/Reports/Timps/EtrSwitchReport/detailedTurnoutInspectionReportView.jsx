import React, { Component } from "react";
import { switchReportStyle } from "../../sims/style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { getLanguageLocal, languageService } from "Language/language.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { Rect } from "react-konva";
import moment from "moment";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../../variables";
import { getFieldsReport } from "../../sims/appFormReportsUtility";
import "../../sims/style.css";
import LeftImage from "images/LH-Switch.png";
import RightImage from "images/RH-Switch.png";
import { SignatureImage } from "../../utils/SignatureImage";
import { switchLhTypes, switchRhTypes } from "../../../../AssetTypeConfig/Reports/ETRDetailedTurnoutInspectionReport";

function checkRh(assetData) {
  let check = false;
  if (assetData) {
    check = _.find(switchRhTypes, (item) => item === assetData.assetType);
  }
  return check;
}

const TurnoutInspectionReportView = (props) => {
  let issues = null;

  let data = {};
  if (props.assetData) {
    props.assetData.form &&
      props.assetData.form.forEach((field) => {
        if (field && field.id) data[field.id] = field.value;
      });
    issues =
      props.assetData.issues &&
      props.assetData.issues.map((issue) => {
        return <span className="line-long long">{issue.description}</span>;
      });
  }
  let switchRH = props.assetData && checkRh(props.assetData);
  return (
    <React.Fragment>
      {
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: "@media print {@page{size: A4 portrait; margin: 0mm;} }",
          }}
          //@page{size: auto; margin: 0mm;}
          //@page{size: A4 portrait; margin: 0mm;}
        />
      }
      <div
        id="mainContent"
        className="table-report logix-services turn"
        style={{ ...themeService(switchReportStyle.mainStyle), breakAfter: "page" }}
      >
        <Row>
          <Col md={2}>
            <img
              src={themeService(iconToShow)}
              alt="Logo"
              style={{ ...themeService(switchReportStyle.logoStyle), display: "flex", margin: "0 auto" }}
            />
          </Col>
          <Col md={8}>
            <h2
              style={{
                ...themeService(switchReportStyle.headingStyle),
                transform: "translateX(-21px)",
              }}
            >
              ETR DETAILED TURNOUT INSPECTION REPORT
            </h2>
          </Col>
          <Col md={2}>
            <span style={{ ...themeService(switchReportStyle.headingStyle), fontSize: "22px" }}>
              {" "}
              <img src={themeService(iconTwoShow)} alt="Logo" style={themeService(switchReportStyle.logoStyle)} />
            </span>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <div className="form-field">
              <label className="top-title">Location:</label>
              <span className="line-long">{props.assetData && props.assetData.location}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="form-field right">
              <label className="top-title">Date of Inspection:</label>
              <span className="line-long small" style={{ marginRight: "60px" }}>
                {props.basicData && props.basicData.date}
              </span>
            </div>
          </Col>
          <Col md={6}>
            <div className="form-field">
              <label className="top-title">Switch Name:</label>
              <span className="line-long">{props.assetData && props.assetData.assetName}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="form-field right"></div>
          </Col>
          <Col md={6}>
            <div className="form-field">
              <label className="top-title">Inspected By:</label>
              <span className="line-long"> {props.basicData && props.basicData.userName}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="form-field right">
              <label className="top-title">Signature:</label>
              <span className="line-long" style={{ marginRight: "60px" }}>
                <SignatureImage signatureImage={props.signatureImage} userName={props.user} />
              </span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <img src={switchRH ? RightImage : LeftImage} alt="image" />
            <Row>
              <Col md={12}>
                1. <label className="lbl-border">TURNOUT INFORMATION</label>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <label>Rail Weight and Section:</label>
                <span className="line-long mini">{data.rail}</span>Lbs.
              </Col>
              <Col md={12}>
                <label>Switch Pt. Length:</label>
                <span className="line-long mini"> {data.feet}</span>
                <label style={{ marginRight: "15px" }}>Feet</label> <span className="line-long mini">{data.inch}</span>Inches
              </Col>
            </Row>
          </Col>
          <Col md={7}>
            <Row>
              <Col md={4}>
                <span className="spacer"></span>
                <label className="lbl-border" style={{ marginLeft: "40px" }}>
                  {switchRH ? "STRAIGHT" : "TURNOUT"}
                </label>
              </Col>
              <Col md={8}>
                <span className="spacer"></span>
                <label className="lbl-border">{switchRH ? "TURNOUT" : "STRAIGHT"}</label>
              </Col>
              {switchRH ? guageField(data.gs1, data.gt1) : guageField(data.gt1, data.gs1)}
              {spacerMaker(2)}
              {switchRH ? guageField(data.gs2, data.gt2) : guageField(data.gt2, data.gs2)}
              {spacerMaker(1)}
              <br />
              {switchRH ? guageField(data.gs3, data.gt3) : guageField(data.gt3, data.gs3)}
              {spacerMaker(1)}
              <br />
              {switchRH ? guageField(data.gs4, data.gt4) : guageField(data.gt4, data.gs4)}
              <br />
              <br />
              {switchRH ? guageField(data.gs5, data.gt5) : guageField(data.gt5, data.gs5)}
              <br />
              <br />

              {switchRH ? guageField(data.gs6, data.gt6) : guageField(data.gt6, data.gs6)}
              {switchRH ? guageField(data.gs7, data.gt7) : guageField(data.gt7, data.gs7)}
              {spacerMaker(2)}
              {switchRH ? rightGaugeField(data.gs8) : guageField(data.gt8, data.gs8, { noright: true })}

              <Col md={12}>
                <span className="spacer"></span>
                <label className="lbl-border"> GAUGE IN 10 FEET INTERVALS BEHIND THE FROG ROUTE</label>
                <Row>
                  {feetIntervalGuage("10FT", data.g1, data.g11)}
                  {feetIntervalGuage("20FT", data.g2, data.g22)}
                  {feetIntervalGuage("30FT", data.g3, data.g33)}
                  {feetIntervalGuage("40FT", data.g4, data.g44)}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <div className="form-field">
              <label>Frog #8:</label>
              <span className="line-long small">{data.frog8}</span>
            </div>
          </Col>
          <Col md={4}>
            <div className="form-field">
              <label>Switch Stand:</label>
              <span className="line-long small">{data.stand}</span>
            </div>
          </Col>
          <Col md={4}></Col>
        </Row>
        <Row>
          <Col md={5}>
            <Row>
              <Col md={8}>
                2. <label className="lbl-border">GENERAL CONDITION</label>
              </Col>
              <Col md={1}>
                <label className="title-yn">YES</label>
              </Col>
              <Col md={1}>
                <label className="title-yn">NO</label>
              </Col>
              <Col md={8}>
                <label>Ballast Section Standard </label>
              </Col>
              {yesNoBoxes(data.ballast)}

              <Col md={8}>
                <label>Switch Ties in Good Condition </label>
              </Col>
              {yesNoBoxes(data.ties)}
              <Col md={8}>
                <label>Line Correct Throughout Turnout </label>
              </Col>
              {yesNoBoxes(data.correct)}

              <Col md={8}>
                <label>Rail Conditions Satisfactory </label>
              </Col>
              {yesNoBoxes(data.satisfy)}
            </Row>
            <Row>
              <Col md={8}>
                3. <label className="lbl-border">SWITCH STAND</label>
              </Col>
              <Col md={1}>
                <label className="title-yn">YES</label>
              </Col>
              <Col md={1}>
                <label className="title-yn">NO</label>
              </Col>
              <Col md={8}>
                <label>Stand Securely Fastened to Ties</label>
              </Col>
              {yesNoBoxes(data.fast)}

              <Col md={8}>
                <label>Latches in Good Condition</label>
              </Col>
              {yesNoBoxes(data.latch)}

              <Col md={8}>
                <label>Lock in Good Condition and Fastened</label>
              </Col>
              {yesNoBoxes(data.lock)}

              <Col md={8}>
                <label>Lever in Good Condition</label>
              </Col>
              {yesNoBoxes(data.lever)}
              <Col md={8}>
                <label>Proper Motion in Stand</label>
              </Col>
              {yesNoBoxes(data.motion)}
            </Row>
            <Row>
              <Col md={8}>
                4. <label className="lbl-border"> SWITCH</label>
              </Col>
              <Col md={1}>
                <label className="title-yn">YES</label>
              </Col>
              <Col md={1}>
                <label className="title-yn">NO</label>
              </Col>
              <Col md={8}>
                <label>Points in Good Condition</label>
              </Col>
              {yesNoBoxes(data.points)}
              <Col md={8}>
                <label>Points Tight</label>
              </Col>
              {yesNoBoxes(data.p_tight)}

              <Col md={8}>
                <label>Heel Blocks in Good Condition</label>
              </Col>
              {yesNoBoxes(data.heel)}

              <Col md={8}>
                <label>Stock Rail in Good Condition</label>
              </Col>
              {yesNoBoxes(data.stock)}
              <Col md={8}>
                <label>Braces in Place and Tight</label>
              </Col>
              {yesNoBoxes(data.braces)}
              <Col md={8}>
                <label>Bolts in Place and Tight</label>
              </Col>
              {yesNoBoxes(data.bolts)}
              <Col md={8}>
                <label>Cotter Keys in Place and Tight</label>
              </Col>
              {yesNoBoxes(data.cotter)}
            </Row>
          </Col>
          <Col md={7}>
            <Row className="boxes-right">
              <Col md={12}>
                <Row className="right-new">
                  <Col md={7}>
                    5. <label className="lbl-border">FROG</label>
                  </Col>
                  <Col md={1}>
                    <label className="title-yn">YES</label>
                  </Col>
                  <Col md={1}>
                    <label className="title-yn">NO</label>
                  </Col>
                  <Col md={7}>
                    <label>Point and Wing in Good Condition</label>
                  </Col>
                  {yesNoBoxes(data.wing)}
                  <Col md={7}>
                    <label>Bolts in Place and Tight</label>
                  </Col>
                  {yesNoBoxes(data.place)}
                  <Col md={7}>
                    <label>Joints at Ends in Good Condition</label>
                  </Col>
                  {yesNoBoxes(data.ends)}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <span className="spacer"></span>
                <span className="spacer"></span>
                <label className="lbl-border" style={{ fontSize: "20px" }}>
                  DEFECTS NOTED
                </label>

                <span className="spacer"></span>
                <span className="spacer"></span>
                {issues && issues}
                {!issues ||
                  (issues.length == 0 && (
                    <React.Fragment>
                      <span className="line-long long"></span>
                      <span className="line-long long"></span>
                      <span className="line-long long"></span>
                    </React.Fragment>
                  ))}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default TurnoutInspectionReportView;
const rightGaugeField = (gs) => {
  return (
    <React.Fragment>
      <Col md={4}>
        <label>Gauge</label>
        <span className="line-long mini">{gs}</span>
      </Col>
      <Col md={8}></Col>
    </React.Fragment>
  );
};

const guageField = (gt, gs, config) => {
  return (
    <React.Fragment>
      <Col md={4}>
        {(!config || config.noright) && (
          <div className="form-field">
            <label>Gauge</label>
            <span className="line-long mini">{gt}</span>
          </div>
        )}
      </Col>
      <Col md={8}>{(!config || !config.noright) && <span className="line-long mini">{gs}</span>}</Col>
    </React.Fragment>
  );
};

const spacerMaker = (count) => {
  let spc = <span className="spacer"></span>;
  let spacers = [];
  for (let i = 0; i < count; i++) {
    spacers[i] = spc;
  }
  return spacers;
};
const feetIntervalGuage = (label, left, right) => {
  return (
    <React.Fragment>
      <Col md={4}>
        <label>{label}</label>
        <span className="line-long mini"> {left}</span>
      </Col>
      <Col md={8}>
        <label>{label}</label>
        <span className="line-long mini">{right}</span>
      </Col>
    </React.Fragment>
  );
};

const yesNoBoxes = (value) => {
  return (
    <Col md={3}>
      <div className="two-boxes">
        <span className="first">{value == "Yes" ? "Y" : ""}</span> <span className="second">{value == "No" ? "N" : ""}</span>
      </div>
    </Col>
  );
};
