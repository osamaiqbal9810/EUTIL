import React, { Component } from "react";

import "./style/style.css";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import _ from "lodash";
import moment from "moment";
import TrackReportView from "./TrackReportView";

class MultiTrackReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      basicData: {},
      issuesData: [],
      assetsData: [],
      staticMode: false,
    };
    this.calculateTableData = this.calculateTableData.bind(this);
  }
  componentDidMount() {
    this.props.reportFilter.length > 0 &&
      this.props.reportFilter.map((inspection, index) => {
        this.props.getJourneyPlan(inspection._id);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.state.staticMode &&
      this.props.journeyPlan &&
      prevProps.journeyPlanActionType !== this.props.journeyPlanActionType &&
      this.props.journeyPlanActionType == "JOURNEYPLAN_READ_SUCCESS"
    ) {
      let jPlan = _.cloneDeep(this.props.journeyPlan);
      this.calculateTableData(jPlan);
    }
    if (this.props.reportId !== prevProps.reportId) {
      this.props.getJourneyPlan(this.props.reportId);
    }
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
        task.issues.map((issue, count) => {
          let assetData = {};
          let issueData = {};
          // TODO check include deficiency report
          let serverObj = issue.serverObject ? issue.serverObject : {};
          let includeAllowedDeficiencies = true; //this.props.includeAllowedDeficiencies
          let includeDeficiencyCheck = includeAllowedDeficiencies && issue.issueType == "Deficiency" && serverObj.includeFRAReport;
          if (
            (issue.unit.assetType == "track" || issue.unit.assetType == "CWR Track") &&
            (issue.issueType == "Defect" || includeDeficiencyCheck)
          ) {
            issueData.MP = startEndMP(issue);
            issueData.Deficiency = issue.issueType == "Deficiency" ? true : "";
            issueData.FRADefect = issue.issueType == "Defect" ? true : "";
            if (issue.issueType == "Deficiency") {
              issueData.DefectDescription = issue.description;
            } else {
              let codeDescription = getCodeDescription(issue);
              issueData.Code = codeDescription.majorDefectCode + codeDescription.minorDefectCode;
              issueData.DefectDescription = codeDescription.minorDescription;
            }
            issueData.RemedialAction = issue.remedialAction;
            issueData.Needed = issue.ruleApplied ? issue.ruleApplied : "";
            assetData = issue.unit;
            assetData.HighRail = "";
            assetData.Walk = "";
            assetData.Observe = "";
            issueData.timeStamp = issue.timpeStamp;

            issuesData.push(issueData);
            assetsData.push(assetData);
          }
        });
      assetsData.forEach((aData) => {
        // traverse detail
        if (aData.start < task.userStartMP) {
          aData.start = task.userStartMP;
        }
        if (task.userEndMP && aData.end > task.userEndMP) {
          aData.end = task.userEndMP;
        }

        if (aData.id == task.traverseTrack) {
        } else {
          aData.Observe = "X";
        }
        if (task.traverseBy === "Hi-Rail") {
          aData.HighRail = "X";
        } else {
          aData.Walk = "X";
        }
      });

      let uniqueAssetsData = _.uniqBy(assetsData, "id");
      this.setState({ basicData, issuesData, assetsData: uniqueAssetsData, staticMode: true });
    }
  }

  render() {
    return (
      <React.Fragment>
        <TrackReportView basicData={this.state.basicData} issuesData={this.state.issuesData} assetsData={this.state.assetsData} />
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

const MultiTrackReportContainer = CRUDFunction(MultiTrackReport, "MultiTrackInspectionReportTask", actionOptions, variableList, [
  "journeyPlanReducer",
]);
export default MultiTrackReportContainer;

export function getWeather(task) {
  let tempUnit = task.tempUnit ? task.tempUnit : "";
  let temp = task.temperature || task.temperature == 0 ? task.temperature + " " + tempUnit : "";
  let weatherVal = task.weatherConditions ? task.weatherConditions : "";
  return temp ? temp + (weatherVal ? ", " + weatherVal : "") : weatherVal ? weatherVal : "";
}

function startEndMP(issue) {
  let mpVal = issue.startMp;
  if (issue.endMp && issue.startMp !== issue.endMp) mpVal += " - " + issue.endMp;
  return mpVal;
}

function getCodeDescription(issue) {
  let codeDescription = {
    majorDefectCode: "",
    minorDefectCode: "",
    majorDescription: "",
    minorDescription: "",
  };
  let titleCode = issue.title.split(".");
  let titleDescription = issue.title.split("-");
  codeDescription.majorDefectCode = titleCode[0];
  codeDescription.majorDescription = titleDescription[1];
  let descriptionSplit = issue.description.split("-");

  codeDescription.minorDefectCode = descriptionSplit[0];
  codeDescription.minorDescription = descriptionSplit[1];

  return codeDescription;
}
