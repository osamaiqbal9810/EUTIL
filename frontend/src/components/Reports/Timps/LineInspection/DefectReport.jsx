import React, { Component } from "react";

import "../style/style.css";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import moment from "moment";
import DefectReportView from "./DefectReportView";

class DefectReport extends Component {
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
      let assetWithInterval = [];
      //console.log(task.runStart, task.runEnd);
      task &&
        task.units.map((unit, count) => {
          if (unit.assetType == "track" || unit.assetType == "CWR Track" || unit.assetType == "Side Track") {
            let assetData = {};
            assetData = unit;
            assetData.HighRail = "";
            assetData.Walk = "";
            assetData.Observe = "";
            assetsData.push(assetData);
          }
          //console.log(unit.end, unit.start);
        });
      let interval = [];

      if (!journeyPlan.intervals || journeyPlan.intervals.length <= 0) {
        interval = [
          {
            start: journeyPlan.tasks[0].userStartMP, //journeyPlan.tasks[0].runStart,
            end: journeyPlan.tasks[0].userEndMP == "" ? journeyPlan.tasks[0].runEnd : journeyPlan.tasks[0].userEndMP,
            //journeyPlan.tasks[0].runEnd,
          },
        ];
      }

      //journeyPlan.intervals &&
      // assetWithInterval = assetsData.reduce((array, asset) => {
      //   let assetStart = parseFloat(asset.start) < parseFloat(asset.end) ? asset.start : asset.end;
      //   let assetEnd = parseFloat(asset.start) > parseFloat(asset.end) ? asset.start : asset.end;
      //   let intervals = !journeyPlan.intervals || journeyPlan.intervals.length <= 0 ? interval : _.cloneDeep(journeyPlan.intervals);
      //   let isFound = intervals.filter((interval) => {
      //     assetStart = parseFloat(assetStart);
      //     assetEnd = parseFloat(assetEnd);
      //     let intervalStart = parseFloat(interval.start) < parseFloat(interval.end) ? parseFloat(interval.start) : parseFloat(interval.end);
      //     let intervalEnd = parseFloat(interval.start) > parseFloat(interval.end) ? parseFloat(interval.start) : parseFloat(interval.end);
      //     let traverseObsereved = false;
      //     if (interval.traversed == asset.id) {
      //       asset.HighRail = task.traverseBy === "Hi-Rail" ? "X" : "";
      //       asset.Walk = task.traverseBy === "Walking" ? "X" : "";
      //       traverseObsereved = true;
      //     }
      //     if (interval.observed == asset.id) {
      //       asset.Observe = interval.observed == asset.id ? "X" : "";
      //       traverseObsereved = true;
      //     }
      //     if (traverseObsereved) {
      //       if (assetStart <= intervalStart && assetEnd >= intervalEnd) {
      //         return true;
      //       } else if (assetStart >= intervalStart && assetStart <= intervalEnd) {
      //         return true;
      //       } else if (assetEnd >= intervalStart && assetEnd <= intervalEnd) {
      //         return true;
      //       }
      //     }
      //     return false;
      //   });

      //   if (isFound && isFound.length) {
      //     isFound.forEach((item) => {
      //       let assetToPush = _.cloneDeep(asset);
      //       if (parseFloat(assetToPush.start) < parseFloat(item.start)) assetToPush.start = item.start;
      //       if (parseFloat(assetToPush.end) > parseFloat(item.end)) assetToPush.end = item.end;

      //       array.push(assetToPush);
      //     });
      //   }
      //   return array;
      // }, []);
      let intervals = !journeyPlan.intervals || journeyPlan.intervals.length <= 0 ? [] : _.cloneDeep(journeyPlan.intervals);
      let assetIntervalList = [];
      for (let session of intervals) {
        let intervalStart = parseFloat(session.start) < parseFloat(session.end) ? parseFloat(session.start) : parseFloat(session.end);
        let intervalEnd = parseFloat(session.start) > parseFloat(session.end) ? parseFloat(session.start) : parseFloat(session.end);
        if (session.hasOwnProperty("traversed") && session.hasOwnProperty("observed")) {
          let traversed = _.find(assetsData, { id: session.traversed });
          let observed = _.find(assetsData, { id: session.observed });
          if (traversed && considerAssetInInterval(traversed, intervalStart, intervalEnd)) {
            let asset = _.cloneDeep(traversed);
            asset.HighRail = task.traverseBy === "Hi-Rail" ? "X" : "";
            asset.Walk = task.traverseBy === "Walking" ? "X" : "";
            if (parseFloat(asset.start) < parseFloat(session.start)) asset.start = session.start;
            if (parseFloat(asset.end) > parseFloat(session.end)) asset.end = session.end;
            assetIntervalList.push(asset);
          }
          if (observed && considerAssetInInterval(observed, intervalStart, intervalEnd)) {
            let asset = _.cloneDeep(observed);
            asset.Observe = "X";
            if (parseFloat(asset.start) < parseFloat(session.start)) asset.start = session.start;
            if (parseFloat(asset.end) > parseFloat(session.end)) asset.end = session.end;
            assetIntervalList.push(asset);
          }
        } else {
          for (let asset of assetsData) {
            let assetToConsider = _.cloneDeep(asset);
            if (considerAssetInInterval(assetToConsider, intervalStart, intervalEnd)) {
              if (task.traverseTrack === asset.id) {
                assetToConsider.HighRail = task.traverseBy === "Hi-Rail" ? "X" : "";
                assetToConsider.Walk = task.traverseBy === "Walking" ? "X" : "";
              } else {
                assetToConsider.Observe = "X";
              }
              if (parseFloat(assetToConsider.start) < parseFloat(session.start)) assetToConsider.start = session.start;
              if (parseFloat(assetToConsider.end) > parseFloat(session.end)) assetToConsider.end = session.end;
              assetIntervalList.push(assetToConsider);
            }
          }
        }
      }

      task &&
        task.issues.map((issue, count) => {
          let issueData = {};
          // TODO check include deficiency report
          let serverObj = issue.serverObject ? issue.serverObject : {};
          let includeAllowedDeficiencies = true; //this.props.includeAllowedDeficiencies
          let includeDeficiencyCheck = includeAllowedDeficiencies && issue.issueType == "Deficiency" && serverObj.includeFRAReport;
          if (
            (issue.unit.assetType == "track" ||
              issue.unit.assetType == "CWR Track" ||
              issue.unit.assetType == "Switch" ||
              issue.unit.assetType == "Yard Track" ||
              issue.unit.assetType == "Side Track") &&
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

            issueData.timeStamp = moment(issue.timeStamp).format("MM/DD/YYYY");
            issueData.issueId = issue.issueId;
            issueData.comments = issue.remedialActionItems.length > 0 ? issue.remedialActionItems[0].value : "";
            issue.serverObject &&
              (issueData.repairDate =
                issue.serverObject.repairDate !== undefined ? moment(issue.serverObject.repairDate).format("MM/DD/YYYY") : "");
            issuesData.push(issueData);
          }
        });
      // assetWithInterval.forEach((aData) => {
      //   // traverse detail
      //   // if (aData.start < task.userStartMP) {
      //   //   aData.start = task.userStartMP;
      //   // }
      //   // if (task.userEndMP && aData.end > task.userEndMP) {
      //   //   aData.end = task.userEndMP;
      //   // }

      //   if (aData.id == task.traverseTrack) {
      //     if (task.traverseBy === "Hi-Rail") {
      //       aData.HighRail = "X";
      //     } else {
      //       aData.Walk = "X";
      //     }
      //   } else {
      //     aData.Observe = "X";
      //   }
      // });

      //let uniqueAssetsData = _.uniqBy(assetWithInterval, "id");
      this.setState({ basicData, issuesData, assetsData: assetIntervalList, staticMode: true });
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

const DefectReportContainer = CRUDFunction(DefectReport, "defectReportTask", actionOptions, variableList, ["journeyPlanReducer"]);
export default DefectReportContainer;

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

function checkInRangeAsset(assetStart, assetEnd, intervalStart, intervalEnd) {
  if (assetStart <= intervalStart && assetEnd >= intervalEnd) {
    return true;
  } else if (assetStart >= intervalStart && assetStart <= intervalEnd) {
    return true;
  } else if (assetEnd >= intervalStart && assetEnd <= intervalEnd) {
    return true;
  } else {
    return false;
  }
}

function considerAssetInInterval(asset, intervalStart, intervalEnd) {
  let assetStart = parseFloat(asset.start) < parseFloat(asset.end) ? asset.start : asset.end;
  let assetEnd = parseFloat(asset.start) > parseFloat(asset.end) ? asset.start : asset.end;
  let inRange = checkInRangeAsset(assetStart, assetEnd, intervalStart, intervalEnd);
  return inRange;
}
