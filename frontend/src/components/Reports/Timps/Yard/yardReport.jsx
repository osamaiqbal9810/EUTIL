import React, { Component } from "react";

import "../style/style.css";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import moment from "moment";
import YardReportView from "./yardReportView";
import { yardTypeATypeTracks } from "../../../../AssetTypeConfig/Reports/DefectReportConfig";
import { checkYardTrackReportMethod } from "../../../../AssetTypeConfig/Reports/YardTrackReportConfig";

class YardReport extends Component {
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
    this.props.reportId && this.props.getJourneyPlan(this.props.reportId);

    //console.log(this.props);
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
      let assetWithInterval = [];
      //console.log(task.runStart, task.runEnd);
      task &&
        task.units.map((unit, count) => {
          if (checkYardTrackReportMethod(unit.assetType)) {
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
      assetWithInterval = assetsData.reduce((array, asset) => {
        let assetStart = parseFloat(asset.start) < parseFloat(asset.end) ? asset.start : asset.end;
        let assetEnd = parseFloat(asset.start) > parseFloat(asset.end) ? asset.start : asset.end;
        let intervals = !journeyPlan.intervals || journeyPlan.intervals.length <= 0 ? interval : _.cloneDeep(journeyPlan.intervals);
        let isFound = intervals.filter((interval) => {
          assetStart = parseFloat(assetStart);
          assetEnd = parseFloat(assetEnd);
          let intervalStart = parseFloat(interval.start) < parseFloat(interval.end) ? parseFloat(interval.start) : parseFloat(interval.end);
          let intervalEnd = parseFloat(interval.start) > parseFloat(interval.end) ? parseFloat(interval.start) : parseFloat(interval.end);

          if (assetStart <= intervalStart && assetEnd >= intervalEnd) {
            return true;
          } else if (assetStart >= intervalStart && assetStart <= intervalEnd) {
            return true;
          } else if (assetEnd >= intervalStart && assetEnd <= intervalEnd) {
            return true;
          }

          return false;
        });

        if (isFound && isFound.length) {
          isFound.forEach((item) => {
            let assetToPush = _.cloneDeep(asset);
            if (parseFloat(assetToPush.start) < parseFloat(item.start)) assetToPush.start = item.start;
            if (parseFloat(assetToPush.end) > parseFloat(item.end)) assetToPush.end = item.end;

            array.push(assetToPush);
          });
        }
        return array;
      }, []);
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

            issueData.timeStamp = issue.timpeStamp;
            issueData.comments = issue.remedialActionItems.length > 0 ? issue.remedialActionItems[0].value : "";
            issuesData.push(issueData);
          }
        });
      assetWithInterval.forEach((aData) => {
        // traverse detail
        // if (aData.start < task.userStartMP) {
        //   aData.start = task.userStartMP;
        // }
        // if (task.userEndMP && aData.end > task.userEndMP) {
        //   aData.end = task.userEndMP;
        // }

        if (aData.id == task.traverseTrack) {
          if (task.traverseBy === "Hi-Rail") {
            aData.HighRail = "X";
          } else {
            aData.Walk = "X";
          }
        } else {
          aData.Observe = "X";
        }
      });

      //let uniqueAssetsData = _.uniqBy(assetWithInterval, "id");
      this.setState({ basicData, issuesData, assetsData: assetWithInterval, staticMode: true });
    }
  }

  render() {
    return (
      <React.Fragment>
        <YardReportView basicData={this.state.basicData} issuesData={this.state.issuesData} assetsData={this.state.assetsData} />
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

const YardReportContainer = CRUDFunction(YardReport, "yardReport", actionOptions, variableList, ["journeyPlanReducer"]);
export default YardReportContainer;

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
