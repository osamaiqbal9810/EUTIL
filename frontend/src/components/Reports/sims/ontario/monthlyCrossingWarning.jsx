import React from "react";
import _ from "lodash";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { languageService } from "Language/language.service";
import "./style.css";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../variables";
import moment from "moment";
import { cross } from "react-icons-kit/icomoon/cross";
import { checkInspectedForm } from "../checkInspected";
import Icon from "react-icons-kit";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import SignalStorageBattery from "./signalStorageBattery";
import HighwayTraffic from "./highwayTraffic";
import LightUnitAlignment from "./lightUnitAlignment";
import { CRUDFunction } from "../../../../reduxCURD/container";
import { getUserSignature } from "../../../../reduxRelated/actions/userActions";
let crossTests = {
  grade_1001b1: { SSIT: "1001(b)1", description: "Log Book Audit" },
  grade_303: { SSIT: "303", description: "Lightning and Surge Protection" },
  grade_201: { SSIT: "201", description: "Circuit Ground and Isolation Faults" },
  grade_202: { SSIT: "202", description: "Primary Batteries" },
  grade_203: { SSIT: "203", description: "Secondary Batteries" },
  "grade_1001(b)2": { SSIT: "1001(b)2", description: "Light Units & Signs: Operation" },
  "grade_1001(b)3": { SSIT: "1001(b)3", description: "Bell Operation" },
  "grade_1001(b)4": { SSIT: "1001(b)4", description: "Gate Operation" },
  "grade_1001(b)5": { SSIT: "1001(b)5", description: "Standby Power Operation" },
  "grade_1001(b)6": { SSIT: "1001(b)6", description: "Power Off Indicator" },
  "grade_1001(b)7": { SSIT: "1001(b)7", description: "Preemption" },
  "grade_1001(b)8": { SSIT: "1001(b)8", description: "CW & MS - Equipment" },
  grade_801: { SSIT: "801", description: "Switch Circuit Controller" },
  grade_703: { SSIT: "703", description: "Fouling Circuits" },
  "grade_1001(c)1": { SSIT: "1001(c)1", description: "Battery Test - Exhaustion" },
  "grade_401(a)": { SSIT: "401(a)", description: "Relays - Visual Inspection" },
  grade_701: { SSIT: "701", description: "Insulated Track Hardware" },
  "grade_1001(d)1": { SSIT: "1001(d)1", description: "Cut-Out Circuits" },
  "grade_1001(d)2": { SSIT: "1001(d)2", description: "Gate Mechanism - Inspection" },
  "grade_1001(e)1": { SSIT: "1001(e)1", description: "Lamp Voltage" },
  "grade_1001(e)2": { SSIT: "1001(e)2", description: "Battery Load Test" },
  "grade_1001(e)3": { SSIT: "1001(e)3", description: "Light Units - Alignment" },
  grade_702: { SSIT: "702", description: "Track Circuits" },
  "grade_1001(e)4": { SSIT: "1001(e)4", description: "Flasher Operation" },
  "grade_1001(e)5": { SSIT: "1001(e)5", description: "Warning System - Approaches" },
  "grade_1001(e)6": { SSIT: "1001(e)6", description: "Warning Time" },
  "grade_1001(e)7": { SSIT: "1001(e)7", description: "Condition of Site Plans" },
  "grade_1001(e)8": { SSIT: "1001(e)8", description: "Recording Devices" },
  grade_402: { SSIT: "402", description: "Timer Relays & Devices" },
  grade_901: { SSIT: "901", description: "Cable Housing" },
  grade_1101: { SSIT: "1101", description: "Inspecting Foundations" },
  "grade_1001(e)9": { SSIT: "1001(e)9", description: "Preemption – Road Authority" },
};
class MonthlyCrossingWarning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicData: {},
      crossingTests: {},
    };
  }
  componentDidMount() {
    this.setState({
      crossingTests: this.props.crossingTests,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div id="mainContent" className="table-report crossing" style={{ minHeight: "800px", pageBreakAfter: "always" }}>
          <Row>
            <Col md={6}>
              <img src={themeService(iconToShow)} style={{ maxWidth: "28vw" }} alt="Logo" />
            </Col>
            <Col md={6}>
              <h2>
                {languageService("SSIT-F-001")}
                <br />
                {languageService("Grade Crossing Warning System")}
                <br />
                {monthShort[this.props.month] ? "Month: " + monthShort[this.props.month] : "Month Report"}
              </h2>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <table>
                <thead>
                  <tr>
                    <th colSpan={12}>
                      <span className="th-text">Subdivision: {this.props.basicData && this.props.basicData.lineName}</span>{" "}
                    </th>
                    <th colSpan={8}>
                      <span className="th-text">Year: {this.props.basicData && this.props.basicData.year}</span>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={12}>
                      <span className="th-text">Mileage: {this.props.basicData && this.props.basicData.mileage} </span>
                    </th>
                    <th colSpan={8}>
                      <span className="th-text">Location Name: {this.props.basicData && this.props.basicData.locationName} </span>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={20}> </th>
                  </tr>
                  <tr>
                    <th colSpan={2}>SSIT </th>
                    <th colSpan={6}>
                      <span className="th-text">Description</span>
                    </th>
                    <th colSpan={12}>{monthShort[this.props.month] ? monthShort[this.props.month] : ""} </th>
                  </tr>

                  <tr>
                    <th colspan={20}>
                      <span className="min-heading">Monthly Tests (1 Month)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthsCols(this.props.crossingTests, "grade_1001b1", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_303", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_201", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_202", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_203", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(b)2", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(b)3", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(b)4", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(b)5", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(b)6", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(b)7", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(b)8", this.props.month)}
                </tbody>
                <thead>
                  <tr>
                    <th colspan={20}>
                      <span className="min-heading">Quarterly Tests (3 Months)</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {monthsCols(this.props.crossingTests, "grade_801", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_703", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(c)1", this.props.month)}
                </tbody>
                <thead>
                  <tr>
                    <th colspan={20}>
                      <span className="min-heading">Semi-annual Tests (6 Months) </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthsCols(this.props.crossingTests, "grade_401(a)", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_701", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(d)1", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(d)2", this.props.month)}
                </tbody>
                <thead>
                  <tr>
                    <th colspan={20}>
                      <span className="min-heading">Yearly (12 Months) </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthsCols(this.props.crossingTests, "grade_1001(e)1", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(e)2", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(e)3", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_702", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(e)4", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(e)5", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(e)6", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(e)7", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(e)8", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_402", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_901", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1101", this.props.month)}
                  {monthsCols(this.props.crossingTests, "grade_1001(e)9", this.props.month)}
                </tbody>
              </table>
            </Col>
            <Col md={7}>
              <p>
                <strong>Results of tests:</strong>

                <div>OK‐‐Test complete equipment in satisfactory condition</div>
                <div>A/C‐‐Adjustments made / Test complete ‐ equipment in satisfactory condition </div>
                <div>R/C‐‐Repair or replacement / Test complete ‐ equipment in satisfactory condition</div>
                <div>N/A‐‐Test Not Applicable</div>
              </p>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
let variables = {
  userReducer: {
    usersSignatures: [],
  },
};

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getUserSignature },
};

const MonthlyCrossingWarningCont = CRUDFunction(MonthlyCrossingWarning, "Monthlycrossingwarning", actionOptions, variables, [
  "userReducer",
]);
export default MonthlyCrossingWarningCont;

function checkValidMethod(stateObj, code, month) {
  //let toRet = "";
  //if (stateObj && stateObj[code] && stateObj[code][month]) toRet = <Icon icon={checkmark} />;
  //if (stateObj && stateObj[code] && stateObj[code][month]) toRet = stateObj[code][month].result;

  //return toRet;
  let condition;
  let comment;
  let user;
  let testDate;
  if (stateObj && stateObj[code] && stateObj[code][month]) {
    condition = stateObj[code][month].result && (
      <React.Fragment>
        <label style={{ marginLeft: "25px" }}>Condition:</label>
        <div style={{ display: "inline-block", width: "100px" }}>{stateObj[code][month].result}</div>
      </React.Fragment>
    );
    comment = stateObj[code][month].comment && (
      <React.Fragment>
        <label>Comment:</label>
        <span>{stateObj[code][month].comment}</span>
      </React.Fragment>
    );
    user = stateObj[code][month].user && (
      <React.Fragment>
        <label>User:</label>
        <span>{stateObj[code][month].user}</span>
      </React.Fragment>
    );
    testDate = stateObj[code][month].testDate && (
      <React.Fragment>
        <label style={{ marginLeft: "25px" }}>Date:</label>
        <span>{stateObj[code][month].testDate}</span>
      </React.Fragment>
    );
  }
  return (
    <div className="monthly-test-result">
      {user}
      {testDate}
      {condition}

      {comment}
    </div>
  );
}

function monthsCols(stateObj, code, month) {
  return (
    <tr>
      <td colSpan={2}>{crossTests[code].SSIT} </td>
      <td colSpan={6}>{crossTests[code].description} </td>
      <td colSpan={12}>{checkValidMethod(stateObj, code, month)} </td>
      {/* <td colSpan={1}>{checkValidMethod(stateObj, code, "Feb")} </td>
      <td colSpan={1}>{checkValidMethod(stateObj, code, "Mar")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Apr")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "May")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "June")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "July")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Aug")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Sep")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Oct")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Nov")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Dec")} </td> */}
    </tr>
  );
}

let monthShort = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};
