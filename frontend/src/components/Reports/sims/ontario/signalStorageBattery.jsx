import React, { Component } from "react";
import { switchReportStyle } from "../style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { getLanguageLocal, languageService } from "Language/language.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { Rect } from "react-konva";
import moment from "moment";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../../variables";
//import { getFieldsReport } from "./appFormReportsUtility";
import "./style.css";

class SignalStorageBattery extends Component {
  constructor(props) {
    super(props);
    this.config = {
      minRows: 8,
      minCommentsRow: 3,
    };
  }

  render() {
    let basicData = {};
    let rowData = [];
    let repairData = [];
    let equalizeData = [];
    this.props.testData &&
      this.props.testData.length > 0 &&
      (rowData = this.props.testData.map((testSched) => {
        let form = {};
        testSched[this.props.formData] &&
          testSched[this.props.formData].length > 0 &&
          testSched[this.props.formData].forEach((field) => {
            if (field) {
              form[field.id] = field.value;
            }
          });

        !basicData.circuit && (basicData.circuit = form.circ ? form.circ : "");
        !basicData.installed && (basicData.installed = form.d_inst ? moment(form.d_inst).format("MM-DD-YYYY") : "");
        !basicData.mode && (basicData.mode = form.mode ? form.mode : "");
        !basicData.batteryType && (basicData.batteryType = form.ni ? form.ni : "");
        let repairRow = (
          <tr key={testSched._id + "repairRow"}>
            <td colSpan="2">{form.date && moment(form.date).format("MM-DD-YYYY")}</td>
            <td colSpan="2">{form["test-by"]}</td>
            <td colSpan="2">{form.type}</td>
            <td colSpan="26">{form.rep}</td>
          </tr>
        );
        repairData.push(repairRow);
        let equalizeRow = (
          <tr key={testSched._id + "repairRow"}>
            <td colSpan="2">{form.date && moment(form.date).format("MM-DD-YYYY")}</td>
            <td colSpan="2">{form["test-by"]}</td>
            <td colSpan="2">{form.type}</td>
            <td colSpan="26">{form.e_app}</td>
          </tr>
        );
        equalizeData.push(equalizeRow);
        return (
          <tr key={testSched._id}>
            <td colSpan="2">{form.date && moment(form.date).format("MM-DD-YYYY")}</td>
            <td colSpan="2">{form["test-by"]}</td>
            <td colSpan="2">{form.type}</td>
            <td colSpan="2">{form.charg}</td>
            <td colSpan="2">{form.c_curr}</td>
            <td colSpan="2">{form.stdby}</td>
            <td colSpan="2">{form.c_on}</td>
            <td colSpan="2">{form.c_off}</td>
            <td colSpan="1">{form.row1}</td>
            <td colSpan="1">{form.row2}</td>
            <td colSpan="1">{form.row3}</td>
            <td colSpan="1">{form.row4}</td>
            <td colSpan="1">{form.row5}</td>
            <td colSpan="1">{form.row6}</td>
            <td colSpan="1">{form.row7}</td>
            <td colSpan="1">{form.row8}</td>
            <td colSpan="1">{form.row9}</td>
            <td colSpan="1">{form.row10}</td>
            <td colSpan="2">{form.g_volt}</td>
            <td colSpan="2">{form.adjust}</td>
            <td colSpan="2">{form.water}</td>
          </tr>
        );
      }));
    return (
      <React.Fragment>
        <div
          id="mainContent"
          className="table-report signal-battery"
          style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}
        >
          <Row>
            <Col md={6}>
              <img src={themeService(iconToShow)} style={{ width: "28vw" }} alt="Logo" />
            </Col>
            <Col md={6}>
              <h2>
                SSIT-F-002
                <br />
                {languageService("Signal Storage Battery Record")}
                <br />
              </h2>
              <div style={{ textAlign: "right", fontSize: "16px", fontWeight: "bold" }}> {this.props.name}</div>
            </Col>
          </Row>
          <span className="spacer"></span>
          <Row>
            <Col md={12}>
              <table className="table-bordered switch-side-track" style={{ marginBottom: "0" }}>
                <thead>
                  <tr className="main-heading">
                    <th colSpan="8">
                      <span className="th-text">{languageService("Circuit") + ": " + basicData.circuit}</span>
                    </th>
                    <th colSpan="6">
                      <span className="th-text">{languageService("Date installed") + ": " + basicData.installed}</span>
                    </th>
                    <th colSpan="5">
                      <span className="th-text">{languageService("Model") + ": " + basicData.mode}</span>
                    </th>
                    <th colSpan="7">
                      <span className="th-text">Ni-Cd or VRLA : {basicData.batteryType}</span>
                    </th>
                    <th colSpan="6">
                      <span className="th-text">&nbsp;</span>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan="2" colSpan="2">
                      <span>{languageService("Date")}</span>
                    </th>
                    <th rowSpan="2" colSpan="2">
                      <span>Tested By</span>{" "}
                    </th>
                    <th rowSpan="2" colSpan="2">
                      <span>
                        Test Type
                        <br />
                        M/Q/A
                      </span>
                    </th>
                    <th rowSpan="2" colSpan="2">
                      <span>Charger AC voltage</span>
                    </th>
                    <th rowSpan="2" colSpan="2">
                      <span>{languageService("Battery Charge Current")}</span>
                    </th>
                    <th rowSpan="2" colSpan="2">
                      <span>{languageService("Equip Load Current (Stdby)")}</span>
                    </th>
                    <th rowSpan="1" colSpan="4">
                      <span>{languageService("Overall battery voltage")}</span>
                    </th>
                    <th rowSpan="1" colSpan="10">
                      <span>{languageService("Cell Discharge Voltage (End of test with charger off)")}</span>
                    </th>
                    <th rowSpan="2" colSpan="2">
                      <span>{languageService("Battery Grounds Voltage")}</span>
                    </th>
                    <th rowSpan="2" colSpan="2">
                      <span>{languageService("Charger Adjusted?Yes/No")}</span>
                    </th>
                    <th rowSpan="2" colSpan="2">
                      <span>{languageService("Water Added (inches)")}</span>
                    </th>
                  </tr>

                  <tr>
                    <th colSpan="2">
                      <span>{languageService("Charger On")}</span>
                    </th>
                    <th colSpan="2">
                      <span>{languageService("Charger Off")}</span>
                    </th>

                    <th colSpan="1">
                      <div>1</div>
                    </th>
                    <th colSpan="1">
                      <div>2</div>
                    </th>
                    <th colSpan="1">
                      <div>3</div>
                    </th>
                    <th colSpan="1">
                      <div>4</div>
                    </th>
                    <th colSpan="1">
                      <div>5</div>
                    </th>
                    <th colSpan="1">
                      <div>6</div>
                    </th>
                    <th colSpan="1">
                      <div>7</div>
                    </th>
                    <th colSpan="1">
                      <div>8</div>
                    </th>
                    <th colSpan="1">
                      <div>9</div>
                    </th>
                    <th colSpan="1">
                      <div>10</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowData}
                  {addEmptyColsIfNotEnough(rowData, this.config.minRows, 21, "one")}
                </tbody>
                <thead>
                  <tr>
                    <th colSpan="2"></th>
                    <th colSpan="2"></th>
                    <th colSpan="2"></th>
                    <th colSpan="26">
                      <h5 className="comments-title">
                        <strong>{languageService("Equalizing Charges Applied (Reason, duration, results)")}</strong>
                      </h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {equalizeData}
                  {addEmptyColsIfNotEnough(equalizeData, this.config.minCommentsRow, 4, "two")}
                </tbody>
                <thead>
                  <tr>
                    <th colSpan="2"></th>
                    <th colSpan="2"></th>
                    <th colSpan="2"></th>
                    <th colSpan="26">
                      <h5 className="comments-title">
                        <strong>{languageService("Repairs, Replacement, etc. (Provide details)")}</strong>
                      </h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {repairData}
                  {addEmptyColsIfNotEnough(repairData, 2, 4, "two")}
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default SignalStorageBattery;
function addEmptyColsIfNotEnough(mapArray, minRows, cols, type) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;
  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr>{getCols(cols, type)}</tr>;
      emptyRows.push(row);
    }
  }
  return emptyRows;
}
function getCols(num, type) {
  let cols = [];
  let span = [];
  if (type === "two") span = [2, 2, 2, 26];
  else span = [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, , 1, 1, 2, 2, 2, 2];
  for (let i = 0; i < num; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
