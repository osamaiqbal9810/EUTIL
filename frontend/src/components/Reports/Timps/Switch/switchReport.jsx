import React from "react";
import { switchReportStyle } from "./style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { getLanguageLocal } from "Language/language.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { Rect } from "react-konva";
import _ from "lodash";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { getAllowedSwitches } from "../../../../AssetTypeConfig/Reports/SwitchinspectionReport";
import moment from "moment";
import { iconToShow, iconTwoShow } from "../../variables";
import { LocPrefixService } from "../../../LocationPrefixEditor/LocationPrefixService";
function getWeather(task) {
  let tempUnit = task.tempUnit ? task.tempUnit : "";
  let temp = task.temperature || task.temperature == 0 ? task.temperature + " " + tempUnit : "";
  let weatherVal = task.weatherConditions ? task.weatherConditions : "";
  return temp ? temp + (weatherVal ? ", " + weatherVal : "") : weatherVal ? weatherVal : "";
}
class SwitchReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switchData: [],
      inspectionData: {
        lineName: "",
        user: "",
        date: "",
        weather: "",
      },
      staticMode: false,
    };
    this.config = {
      minSwitchRows: 6,
    };
  }
  componentDidMount() {
    this.props.inspec && this.calculateSwitchData(this.props.inspec);
  }

  calculateSwitchData(jPlan) {
    let switchSideTrack = null;
    let jPlanFirstTask = jPlan && jPlan.tasks && jPlan.tasks.length > 0 && jPlan.tasks[0];
    if (jPlanFirstTask && jPlan.tasks[0].units.length > 0) {
      switchSideTrack = [];

      jPlanFirstTask.units.forEach((asset, index) => {
        if (getAllowedSwitches(asset.assetType) || asset.assetType === "Side Track") {
          switchSideTrack.push(asset);
        }
      });
    }
    let data = [];
    let inspectionData = {};
    if (jPlan) {
      inspectionData.date = jPlan.date;
      inspectionData.user = jPlan.user.name;
      inspectionData.weather = jPlanFirstTask ? getWeather(jPlanFirstTask) : "";
      inspectionData.lineName = jPlanFirstTask && jPlanFirstTask.units.length > 0 ? jPlanFirstTask.units[0].unitId : "";
    }
    if (switchSideTrack) {
      switchSideTrack.forEach((asset) => {
        let basicFieldsOfAsset = getAllowedSwitches(asset.assetType) ? true : false;
        let dataRow = {};
        dataRow.id = asset.id;
        let prefix = LocPrefixService.getPrefixMp(asset.start, jPlan.lineId);
        dataRow.mp = (prefix ? prefix : "") + asset.start;
        if (basicFieldsOfAsset) {
          dataRow.Operated = findSwitchDataFromAppForm(asset, "operateswitch");
          dataRow.GatePoints = findSwitchDataFromAppForm(asset, "gagepoints");
          dataRow.GuardCheckGage = findSwitchDataFromAppForm(asset, "guardcheck");
          dataRow.GuardFaceGage = findSwitchDataFromAppForm(asset, "guardface");
          dataRow.GuardCheckOut = findSwitchDataFromAppForm(asset, "guardcheckout");
          dataRow.GuardFaceOut = findSwitchDataFromAppForm(asset, "guardfaceout");
        }
        dataRow.assetName = asset.unitId;
        dataRow.issues = [];
        if (jPlanFirstTask) {
          dataRow.issues = _.filter(jPlanFirstTask.issues, (issue) => {
            return issue.unit && issue.unit.id == asset.id;
          });
        }
        data.push(dataRow);
      });
    }
    this.setState({
      inspectionData: inspectionData,
      switchData: data,
      staticMode: true,
    });
  }
  mapIssues(dataRow) {
    let issueComps = null;
    if (dataRow.issues && dataRow.issues.length > 0)
      dataRow.issues.forEach((issue, index) => {
        if (index > 0) {
          let comp = (
            <tr key={issue.timeStamp} style={{ pageBreakInside: "avoid" }}>
              <td colSpan="5">{issue.description}</td>
              <td>{issue.remedialAction}</td>
            </tr>
          );
          !issueComps && (issueComps = []);
          issueComps.push(comp);
        }
      });

    return issueComps;
  }
  mapFirstIssue(dataRow) {
    let issueComps = null;
    if (dataRow.issues && dataRow.issues.length > 0)
      issueComps = (
        <React.Fragment key={dataRow.issues[0].timeStamp}>
          <td colSpan="5">{dataRow.issues[0].description}</td>
          <td>{dataRow.issues[0].remedialAction}</td>
        </React.Fragment>
      );
    return issueComps;
  }
  mapData() {
    let comps = null;
    let switchData = this.state.switchData;
    if (switchData && switchData.length > 0) {
      comps = switchData.map((dataRow) => {
        let firstIssue = this.mapFirstIssue(dataRow);
        let issueArea = this.mapIssues(dataRow);
        let lengthOfIssues = dataRow.issues.length > 3 ? dataRow.issues.length : 3;
        // this.mapIssues(dataRow);
        issueArea = addEmptyIssueRow(issueArea);
        if (!firstIssue) {
          firstIssue = (
            <React.Fragment>
              <td colSpan="5"></td>
              <td></td>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={dataRow.id}>
            <tr style={{ pageBreakInside: "avoid" }}>
              <td rowSpan={lengthOfIssues}>{dataRow.mp ? dataRow.mp : ""}</td>
              <td rowSpan={lengthOfIssues} style={{ wordBreak: "break-all" }}>
                {dataRow.assetName}
              </td>
              <td rowSpan={lengthOfIssues}>{dataRow.Operated ? dataRow.Operated : ""}</td>
              <td rowSpan={lengthOfIssues}>{dataRow.GatePoints ? dataRow.GatePoints : ""}</td>
              <td rowSpan={lengthOfIssues}>{dataRow.GuardCheckGage ? dataRow.GuardCheckGage : ""}</td>
              <td rowSpan={lengthOfIssues}>{dataRow.GuardFaceGage ? dataRow.GuardFaceGage : ""}</td>
              <td rowSpan={lengthOfIssues}>{dataRow.GuardCheckOut ? dataRow.GuardCheckOut : ""}</td>
              <td rowSpan={lengthOfIssues}>{dataRow.GuardFaceOut ? dataRow.GuardFaceOut : ""}</td>
              {firstIssue}
            </tr>
            {issueArea}
          </React.Fragment>
        );
      });
    }
    return comps;
  }

  render() {
    return (
      <React.Fragment>
        <div
          id="mainContent"
          className="table-report switch-report"
          style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}
        >
          <Row>
            <Col md={2}>
              <img src={themeService(iconToShow)} alt="Logo" style={{ ...themeService(switchReportStyle.logoStyle), width: "100%" }} />
            </Col>
            <Col md={8}>
              <h2 style={{ ...themeService(switchReportStyle.headingStyle), transform: "translateX(-21px)" }}>
                {"Switch and Side Track Inspection Form"}
              </h2>
            </Col>
            <Col md={2}>
              <span style={{ ...themeService(switchReportStyle.headingStyle), fontSize: "22px" }}>
                {this.state.inspectionData.lineName}
              </span>
            </Col>
          </Row>
          <span className="spacer"></span>
          <Row>
            <Col md={12}>
              <table className="table-bordered switch-side-track" style={{ marginBottom: "0" }}>
                <thead>
                  <tr className="main-heading">
                    <th colSpan="2" style={{ width: "20px", borderBottom: "transparent" }}>
                      <span>
                        {"Date: " + (this.state.inspectionData.date ? moment(this.state.inspectionData.date).format("MM/DD/YYYY") : "")}
                      </span>
                    </th>
                    <th colSpan="6" style={{ width: "60px", borderBottom: "transparent" }}>
                      <span>{"Inspector(s): " + this.state.inspectionData.user}</span>
                    </th>
                    <th colSpan="6" style={{ width: "60px", borderBottom: "transparent" }}>
                      <span>{"Weather: " + this.state.inspectionData.weather}</span>
                    </th>
                  </tr>
                </thead>
              </table>
            </Col>
          </Row>
          <table className="table-bordered switch-side-track">
            <thead>
              <tr>
                <th colSpan="1" style={{ width: "10px" }}>
                  <span>Mp</span>
                </th>
                <th colSpan="1" style={{ width: "10px" }}>
                  <span>{"Switch"}</span>
                </th>
                <th colSpan="1" style={{ width: "10px" }}>
                  <span>{"Operated Y/N"}</span>
                </th>
                <th colSpan="1" style={{ width: "10px" }}>
                  <span>{"Gage at Point"}</span>
                </th>
                <th colSpan="1" style={{ width: "10px" }}>
                  <span>{"Guard Check Gage - Straight"}</span>
                </th>
                <th colSpan="1" style={{ width: "10px" }}>
                  <span>{"Guard Face Gage - Straight"}</span>
                </th>
                <th colSpan="1" style={{ width: "10px" }}>
                  <span>{"Guard Check Gage - Turn Out"}</span>
                </th>
                <th colSpan="1" style={{ width: "10px" }}>
                  <span>{"Guard Face Gage- Turn Out"}</span>
                </th>
                <th colSpan="5" style={{ width: "50px" }}>
                  <span>{"Defects/Comments"}</span>
                </th>
                <th colSpan="1" style={{ width: "10px" }}>
                  <span>{"Defect Repaired"}</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {this.mapData()}
              {addEmptyColsIfNotEnough(this.state.switchData, this.config.minSwitchRows, 10)}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}
const getJourneyPlan = curdActions.getJourneyPlan;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    getJourneyPlan,
  },
};

let variableList = {
  journeyPlanReducer: { journeyPlan: "" },
};

const SwitchReportContainer = CRUDFunction(SwitchReport, "SwitchReportInspection", actionOptions, variableList, ["journeyPlanReducer"]);
export default SwitchReportContainer;
function addEmptyColsIfNotEnough(mapArray, minRows, cols) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;
  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = [];
      if (i === 0 || i === 3 || i === 6)
        row = (
          <tr key={i} rowSpan="3">
            {getCols(cols)}
          </tr>
        );
      else
        row = (
          <tr key={i} style={{ pageBreakInside: "avoid" }}>
            <td colSpan="5"></td>
            <td></td>
          </tr>
        );
      emptyRows.push(row);
    }
  }
  return emptyRows;
}
function getCols(num) {
  let cols = [];
  for (let i = 0; i < num; i++) {
    if (i < 8) cols.push(<td key={i} rowSpan="3"></td>);
    else if (i === 8) cols.push(<td key={i} colSpan="5"></td>);
    else cols.push(<td key={i}></td>);
  }
  return cols;
}

function findSwitchDataFromAppForm(asset, propertyName) {
  let val = "";
  if (asset.appForms && asset.appForms.length > 0) {
    // # check form name
    let switchForm = _.find(asset.appForms, { id: "frmSwitchInspection" });
    if (switchForm) {
      let propertyVal = _.find(switchForm.form, { id: propertyName });
      if (propertyVal) {
        val = propertyVal.value;
      }
    }
  }
  return val;
}

function addEmptyIssueRow(issuesArea) {
  let comp = issuesArea;
  if (!issuesArea) {
    comp = (
      <React.Fragment>
        <tr style={{ pageBreakInside: "avoid" }}>
          <td colSpan="5"></td>
          <td></td>
        </tr>
        <tr style={{ pageBreakInside: "avoid" }}>
          <td colSpan="5"></td>
          <td></td>
        </tr>
      </React.Fragment>
    );
  } else if (issuesArea.length < 2) {
    comp.push(
      <tr style={{ pageBreakInside: "avoid" }}>
        <td colSpan="5"></td>
        <td></td>
      </tr>,
    );
  }
  return comp;
}
