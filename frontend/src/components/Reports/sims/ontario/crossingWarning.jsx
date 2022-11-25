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
import MonthlyCrossingWarning from "./monthlyCrossingWarning";
import { PillTextButton } from "../../../../libraries/GeneralButtons";
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
class CrossingWarning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicData: {},
      crossingTests: {},
      showReports: false,
    };
    this.toggleReports = this.toggleReports.bind(this);
  }
  toggleReports() {
    this.setState({ showReports: !this.state.showReports });
  }
  componentDidMount() {
    this.calculateData(this.props.reportData);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.reportData !== prevProps.reportData && this.props.reportData) {
      this.calculateData(this.props.reportData);
    }
  }

  calculateData(reportDetail) {
    let userSignatureFetchList = [];
    let _crossingTests = _.cloneDeep(crossTests);
    let primaryBatteryReports = [];
    let secondaryBatteryReports = [];
    let batteryLoadReports = [];
    let exhaustionBatteryReports = [];
    let highwayCrossingReports = [];
    let lightUnitAlignmentReports = [];
    let basicData = {
      locationName: "",
      year: "",
      mileage: "",
    };
    if (reportDetail && reportDetail.length > 0) {
      for (let testSched of reportDetail) {
        if (!basicData.year) basicData.year = moment(testSched.data).format("YYYY");
        if (!basicData.mileage) basicData.mileage = testSched.assetMP;
        if (!basicData.locationName) basicData.locationName = testSched.assetName;
        if (!basicData.lineName) basicData.lineName = testSched.lineName;
        let month = moment(testSched.date).format("MMM");
        let check = checkInspectedForm(testSched, "formData");
        if (check && month) {
          let resField = testSched && testSched.formData && testSched.formData.find((field) => field && field.id === "test");
          let comField = testSched && testSched.formData && testSched.formData.find((field) => field && field.id === "com");
          let userField = testSched && testSched.user && testSched.user.name;
          let dateField = testSched && testSched.date;
          //comField && (resField["com"] = comField.value);

          if (resField) {
            _crossingTests[testSched.testCode][month] = {
              inspected: true,
              result: resField && resField.value ? resField.value : "",
              comment: comField && comField.value ? comField.value : "",
              user: userField ? userField : "",
              testDate: dateField ? moment(dateField).format("MM-DD-YYYY") : "",
            };
          }
        }
        if (check && testSched.testCode === "grade_202") {
          primaryBatteryReports.push(testSched);
        }
        if (check && testSched.testCode === "grade_203") {
          secondaryBatteryReports.push(testSched);
        }
        if (check && testSched.testCode === "grade_1001(e)2") {
          batteryLoadReports.push(testSched);
        }
        if (check && testSched.testCode === "grade_1001(c)1") {
          exhaustionBatteryReports.push(testSched);
        }
        if (check && testSched.testCode === "grade_1001(e)9") {
          let checkExist = userSignatureFetchList.find((us) => us === testSched.user.email);
          if (!checkExist) userSignatureFetchList.push(testSched.user.email);
          highwayCrossingReports.push(testSched);
        }
        if (check && testSched.testCode === "grade_1001(e)3") {
          let checkExist = userSignatureFetchList.find((us) => us === testSched.user.email);
          if (!checkExist) userSignatureFetchList.push(testSched.user.email);
          lightUnitAlignmentReports.push(testSched);
        }
      }
      let ulength = userSignatureFetchList.length;
      if (ulength) {
        let query = "?";
        userSignatureFetchList.forEach((email, index) => {
          let andToAdd = index == ulength - 1 ? "" : "&";
          query = query + "emails[]=" + email + andToAdd;
        });
        this.props.getUserSignature(query);
      }
    }
    this.setState({
      crossingTests: _crossingTests,
      basicData: basicData,
      batteryReports: [
        { name: "Primary Batteries", value: primaryBatteryReports },
        { name: "Secondary Batteries", value: secondaryBatteryReports },
        { name: "Battery Test - Exhaustion", value: exhaustionBatteryReports },
        { name: "Battery Load Test", value: batteryLoadReports },
      ],
      highwayCrossingReports: highwayCrossingReports,
      lightUnitAlignmentReports: lightUnitAlignmentReports,
    });
  }
  render() {
    let monthWise = [];
    this.state.crossingTests &&
      months.forEach((month) => {
        monthWise.push(monthlyReport(this.state.basicData, this.state.crossingTests, month));
      });

    let highwayReportRender =
      this.state.highwayCrossingReports &&
      this.state.highwayCrossingReports.map((report) => {
        return <HighwayTraffic testExec={report} assetData={this.props.selectedAsset} usersSignatures={this.props.usersSignatures} />;
      });
    let lightUnitAlignmentRender =
      this.state.lightUnitAlignmentReports &&
      this.state.lightUnitAlignmentReports.map((report) => {
        return <LightUnitAlignment testExec={report} assetData={this.props.selectedAsset} usersSignatures={this.props.usersSignatures} />;
      });
    let batteryReports =
      this.state.batteryReports &&
      this.state.batteryReports.length > 0 &&
      this.state.batteryReports.map((testBatteryReports) => {
        let modelsBatteriesReports = [];
        testBatteryReports &&
          testBatteryReports.value &&
          testBatteryReports.value.length > 0 &&
          testBatteryReports.value.map((testForm) => {
            let tableData = testForm.formData.find((field) => field && field.type === "table");
            if (tableData && tableData.value.length > 0) {
              for (let formCont of tableData.value) {
                let modelVal = formCont.form.find((field) => field.id === "circ");
                if (modelVal) {
                  let mIndex = modelsBatteriesReports.findIndex((bat) => bat.model === modelVal.value);
                  if (mIndex > -1) {
                    !modelsBatteriesReports[mIndex].value && (modelsBatteriesReports[mIndex].value = []);
                    modelsBatteriesReports[mIndex].value.push(formCont);
                  } else {
                    modelsBatteriesReports.push({ value: [formCont], model: modelVal.value });
                  }
                }
              }
            }
          });
        let batReports = modelsBatteriesReports.map((batteryReport) => {
          return <SignalStorageBattery testData={batteryReport.value} name={testBatteryReports.name} formData={"form"} />;
        });
        return batReports;
      });
    let { showReports } = this.state;
    return (
      <React.Fragment>
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: "@media print { .show-monthly-reports {display:none;visibility:hidden;opacity:0}",
          }}
        />
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
                {languageService("Annual Test Form")}
              </h2>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <table>
                <thead>
                  <tr>
                    <th colSpan={12}>
                      <span className="th-text">Subdivision: {this.state.basicData && this.state.basicData.lineName}</span>{" "}
                    </th>
                    <th colSpan={8}>
                      <span className="th-text">Year: {this.state.basicData && this.state.basicData.year}</span>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={12}>
                      <span className="th-text">Mileage: {this.state.basicData && this.state.basicData.mileage} </span>
                    </th>
                    <th colSpan={8}>
                      <span className="th-text">Location Name: {this.state.basicData && this.state.basicData.locationName} </span>
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
                    <th colSpan={1}>Jan </th>
                    <th colSpan={1}>Feb</th>
                    <th colSpan={1}>Mar </th>
                    <th colSpan={1}>Apr </th>
                    <th colSpan={1}>May </th>
                    <th colSpan={1}>Jun </th>
                    <th colSpan={1}>Jul </th>
                    <th colSpan={1}>Aug </th>
                    <th colSpan={1}>Sep </th>
                    <th colSpan={1}>Oct </th>
                    <th colSpan={1}>Nov </th>
                    <th colSpan={1}>Dec </th>
                  </tr>

                  <tr>
                    <th colspan={20}>
                      <span className="min-heading">Monthly Tests (1 Month)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthsCols(this.state.crossingTests, "grade_1001b1")}
                  {monthsCols(this.state.crossingTests, "grade_303")}
                  {monthsCols(this.state.crossingTests, "grade_201")}
                  {monthsCols(this.state.crossingTests, "grade_202")}
                  {monthsCols(this.state.crossingTests, "grade_203")}
                  {monthsCols(this.state.crossingTests, "grade_1001(b)2")}
                  {monthsCols(this.state.crossingTests, "grade_1001(b)3")}
                  {monthsCols(this.state.crossingTests, "grade_1001(b)4")}
                  {monthsCols(this.state.crossingTests, "grade_1001(b)5")}
                  {monthsCols(this.state.crossingTests, "grade_1001(b)6")}
                  {monthsCols(this.state.crossingTests, "grade_1001(b)7")}
                  {monthsCols(this.state.crossingTests, "grade_1001(b)8")}
                </tbody>
                <thead>
                  <tr>
                    <th colspan={20}>
                      <span className="min-heading">Quarterly Tests (3 Months)</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {monthsCols(this.state.crossingTests, "grade_801")}
                  {monthsCols(this.state.crossingTests, "grade_703")}
                  {monthsCols(this.state.crossingTests, "grade_1001(c)1")}
                </tbody>
                <thead>
                  <tr>
                    <th colspan={20}>
                      <span className="min-heading">Semi-annual Tests (6 Months) </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthsCols(this.state.crossingTests, "grade_401(a)")}
                  {monthsCols(this.state.crossingTests, "grade_701")}
                  {monthsCols(this.state.crossingTests, "grade_1001(d)1")}
                  {monthsCols(this.state.crossingTests, "grade_1001(d)2")}
                </tbody>
                <thead>
                  <tr>
                    <th colspan={20}>
                      <span className="min-heading">Yearly (12 Months) </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthsCols(this.state.crossingTests, "grade_1001(e)1")}
                  {monthsCols(this.state.crossingTests, "grade_1001(e)2")}
                  {monthsCols(this.state.crossingTests, "grade_1001(e)3")}
                  {monthsCols(this.state.crossingTests, "grade_702")}
                  {monthsCols(this.state.crossingTests, "grade_1001(e)4")}
                  {monthsCols(this.state.crossingTests, "grade_1001(e)5")}
                  {monthsCols(this.state.crossingTests, "grade_1001(e)6")}
                  {monthsCols(this.state.crossingTests, "grade_1001(e)7")}
                  {monthsCols(this.state.crossingTests, "grade_1001(e)8")}
                  {monthsCols(this.state.crossingTests, "grade_402")}
                  {monthsCols(this.state.crossingTests, "grade_901")}
                  {monthsCols(this.state.crossingTests, "grade_1101")}
                  {monthsCols(this.state.crossingTests, "grade_1001(e)9")}
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
            <Col md={5}>
              <div style={{ textAlign: 'end', paddingBottom: '10px' }} className="text-right">
                <span style={{ fontWeight: 600 }}>{`${"Note"}: `}</span>
                {"See Monthly Details for Inspectors Names and Dates of Inspection"}
              </div>
              <div style={{ textAlign: "right" }} className="show-monthly-reports">
                <PillTextButton title={`${showReports ? "Hide" : "Show"} Month Details`} onClick={() => this.toggleReports()} />
              </div>
            </Col>
          </Row>
        </div>
        {this.state.showReports && monthWise}
        {batteryReports}
        {highwayReportRender}
        {lightUnitAlignmentRender}
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

const CrossingWarningCont = CRUDFunction(CrossingWarning, "crossingwarning", actionOptions, variables, ["userReducer"]);
export default CrossingWarningCont;

function checkValidMethod(stateObj, code, month) {
  let toRet = "";
  //if (stateObj && stateObj[code] && stateObj[code][month]) toRet = <Icon icon={checkmark} />;
  if (stateObj && stateObj[code] && stateObj[code][month]) toRet = stateObj[code][month].result;
  return toRet;
}

function monthsCols(stateObj, code) {
  return (
    <tr>
      <td colSpan={2}>{crossTests[code].SSIT} </td>
      <td colSpan={6}>{crossTests[code].description} </td>
      <td colSpan={1}>{checkValidMethod(stateObj, code, "Jan")} </td>
      <td colSpan={1}>{checkValidMethod(stateObj, code, "Feb")} </td>
      <td colSpan={1}>{checkValidMethod(stateObj, code, "Mar")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Apr")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "May")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Jun")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Jul")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Aug")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Sep")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Oct")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Nov")} </td>
      <td colSpan={1}> {checkValidMethod(stateObj, code, "Dec")} </td>
    </tr>
  );
}

function monthlyReport(basicData, crossingTests, month) {
  // let result;
  // result = months.map((month) => (
  let valid = null;
  for (let codeData in crossingTests) {
    if (crossingTests[codeData] && crossingTests[codeData][month]) valid = true;
  }
  return valid && <MonthlyCrossingWarning basicData={basicData} crossingTests={crossingTests} month={month} />;
  // ));

  // return result;
}
