import React, { Component } from "react";
import "../style/style.css";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import moment from "moment";
import DefectReportView from "../LineInspection/DefectReportView";
import { yardTypeATypeTracks } from "../../../../AssetTypeConfig/Reports/DefectReportConfig";

class YardTrackDefectReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //  journeyPlan: {},
      basicData: {},
      issuesData: [],
      assetsData: [],
      staticMode: false,
    };
    this.calculateTableData = this.calculateTableData.bind(this);
  }
  componentDidMount() {
    this.calculateTableData(this.props.inspec);
  }

  calculateTableData(journeyPlan) {
    let task = journeyPlan && journeyPlan.tasks && journeyPlan.tasks.length > 0 && journeyPlan.tasks[0];
    if (task) {
      let basicData = {
        Date:
          typeof journeyPlan.date != "undefined" && journeyPlan.date != "null" && journeyPlan.date
            ? moment(journeyPlan.date).format("MM/DD/YYYY")
            : "",
        Line: typeof journeyPlan.lineName != "undefined" && journeyPlan.lineName != "null" ? journeyPlan.lineName : "",
        Weather: getWeather(task),
        InspectionWeekly: "",
        InspectionWeather: "",
        InspectionSpecial: "",
        Inspector: typeof journeyPlan.user.name != "undefined" && journeyPlan.user.name != "null" ? journeyPlan.user.name : "",
        InspectorId: typeof journeyPlan.user.id != "undefined" && journeyPlan.user.id != "null" ? journeyPlan.user.id : "",
        commentsDetail: task.inspectionTypeDescription,
      };
      basicData.Line = task.units && task.units.length > 0 && task.units[0].unitId;
      if (task.inspectionTypeTag == "special") {
        basicData.InspectionSpecial = "X";
      } else if (task.inspectionTypeTag == "weather") {
        basicData.InspectionWeather = "X";
      } else {
        basicData.InspectionWeekly = "X";
      }

      let issuesData = [];
      let assetsData = [];
      task &&
        task.units.map((unit, count) => {
          if (_.find(yardTypeATypeTracks, (item) => unit.assetType === item)) {
            let inspected = false;
            if (unit.appForms && unit.appForms.length > 0) {
              for (let appForm of unit.appForms) {
                if (appForm && inspected == false) {
                  if (appForm.form) {
                    inspected = checkInspected(appForm);
                  }
                }
              }
            }
            if (inspected) {
              let assetData = {};
              assetData = unit;
              assetData.HighRail = "";
              assetData.Walk = "";
              assetData.Observe = "";
              assetData.start = unit.startMarker ? unit.startMarker : "";
              assetData.end = unit.endMarker ? unit.endMarker : "";
              assetsData.push(assetData);
            }
          }
        });

      task &&
        task.issues.map((issue, count) => {
          let issueData = {};
          // TODO check include deficiency report
          let serverObj = issue.serverObject ? issue.serverObject : {};
          let includeAllowedDeficiencies = true; //this.props.includeAllowedDeficiencies
          let includeDeficiencyCheck = includeAllowedDeficiencies && issue.issueType == "Deficiency" && serverObj.includeFRAReport;
          if (
            _.find(yardTypeATypeTracks, (item) => issue.unit.assetType === item) &&
            (issue.issueType == "Defect" || includeDeficiencyCheck)
          ) {
            issueData.assetName = issue.unit.unitId;
            issueData.MP = startEndMP(issue);
            issueData.Deficiency = issue.issueType == "Deficiency" ? true : "";
            issueData.FRADefect = issue.issueType == "Defect" ? true : "";
            if (issue.issueType == "Deficiency") {
              issueData.DefectDescription = issue.description;
            } else {
              let codeDescription = getCodeDescription(issue, this.props.nonFraCode);
              issueData.Code = codeDescription.majorDefectCode + codeDescription.minorDefectCode;
              issueData.DefectDescription = codeDescription.minorDescription;
            }
            issueData.RemedialAction = issue.remedialAction;
            issueData.Needed = issue.ruleApplied ? issue.ruleApplied : "";

            issueData.timeStamp = moment(issue.timeStamp).format("MM/DD/YYYY");
            issueData.issueId = issue.issueId;
            issueData.comments = issue.remedialActionItems.length > 0 ? issue.remedialActionItems[0].value : "";
            issue.serverObject &&
              (issueData.repairDate =
                issue.serverObject.repairDate !== undefined ? moment(issue.serverObject.repairDate).format("MM/DD/YYYY") : "");
            issuesData.push(issueData);
          }
        });

      this.setState({ basicData, issuesData, assetsData: assetsData, staticMode: true });
    }
  }

  render() {
    return (
      <React.Fragment>
        <DefectReportView
          basicData={this.state.basicData}
          issuesData={this.state.issuesData}
          assetsData={this.state.assetsData}
          signatureImage={this.props.signatureImage}
          header={"Yard Inspection and Repair Report"}
        />
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

const YardTrackDefectReportContainer = CRUDFunction(YardTrackDefectReport, "YardTrackDefectReport", actionOptions, variableList, [
  "journeyPlanReducer",
]);
export default YardTrackDefectReportContainer;

export function getWeather(task) {
  let tempUnit = task.tempUnit ? task.tempUnit : "";
  let temp = task.temperature || task.temperature == 0 ? task.temperature + " " + tempUnit : "";
  let weatherVal = task.weatherConditions ? task.weatherConditions : "";
  return temp ? temp + (weatherVal ? ", " + weatherVal : "") : weatherVal ? weatherVal : "";
}

function startEndMP(issue) {
  let mpVal = issue.startMarker;
  if (issue.endMarker && issue.startMarker !== issue.endMarker) mpVal += " - " + issue.endMarker;
  return mpVal;
}

function getCodeDescription(issue, nonFraCode) {
  let codeDescription = {
    majorDefectCode: "",
    minorDefectCode: "",
    majorDescription: "",
    minorDescription: "",
  };
  if (!nonFraCode) {
    let titleDescription = issue.title.split("-");
    codeDescription.majorDefectCode = titleDescription[0];
    codeDescription.majorDescription = titleDescription[1];
  }
  let descriptionSplit = issue.description.split("-");

  codeDescription.minorDefectCode = descriptionSplit[0];
  codeDescription.minorDescription = descriptionSplit[1];

  return codeDescription;
}

export function checkInspected(form) {
  let completed = false;
  if (form.form && form.form.length > 0) {
    let OuiIndex = _.findIndex(form.form, (field) => {
      return field && (field.id == "yes" || field.id == "inspected" || field.tag == "completionCheck");
    });
    if (OuiIndex > -1) {
      completed = form.form[OuiIndex].value == "true" || form.form[OuiIndex].value == true ? true : false;
    }
  }
  return completed;
}
