import React, { Component } from "react";

import "../style/style.css";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import moment from "moment";
import DefectReportView from "./DefectReportView";
import { getServerEndpoint } from "../../../../utils/serverEndpoint";
import { checkInspected } from "../YardTrackInspection/YardTrackDefectReport";
import { assetTypesForIssues, assetTypeTracks, yardTypeATypeTracks } from "../../../../AssetTypeConfig/Reports/DefectReportConfig";
import { LocPrefixService } from "../../../LocationPrefixEditor/LocationPrefixService";
import { getIssueRemedialActionComments } from "../../utils/getIssueRemedialActionComments";

class DefectReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //  journeyPlan: {},
      basicData: {},
      issuesData: [],
      assetsData: [],
      loadedImages: [],
      staticMode: false,
      disableRule213Config: false,
    };
    //   this.calculateTableData = this.calculateTableData.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
  }
  componentDidMount() {
    // this.calculateTableData(this.props.inspec);
    this.props.getApplicationlookups("config/disableRule213");
    this.calculateData(this.props.inspec);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.usersSignatures !== prevProps.usersSignatures) {
      this.calculateData(this.props.inspec);
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType === "APPLICATIONLOOKUPS_READ_SUCCESS"
    ) {
      this.setState({
        disableRule213Config: this.props.applicationlookups && this.props.applicationlookups[0] && this.props.applicationlookups[0].opt2,
      });
    }
  }
  calculateData(journeyPlan) {
    let basicData = {};
    let issuesData = [];
    let sortedIssuesData;
    let assetIntervalList = [];
    let task = journeyPlan && journeyPlan.tasks && journeyPlan.tasks.length > 0 && journeyPlan.tasks[0];
    if (task) {
      basicData = this.basicDataMaker(task, journeyPlan);
      this.assetsAndIssuesData(journeyPlan, task, issuesData, assetIntervalList);
      sortedIssuesData = _.sortBy(issuesData, (issue) => {
        let start = issue.sortMP ? parseFloat(issue.sortMP) : 0;
        return start;
      });
    }

    this.setState({ basicData, issuesData: sortedIssuesData, assetsData: assetIntervalList, staticMode: true, rule213: true });
  }
  assetsAndIssuesData(journeyPlan, task, issuesData, assetIntervalList) {
    let intervals = !journeyPlan.intervals || journeyPlan.intervals.length <= 0 ? [] : _.cloneDeep(journeyPlan.intervals);
    let assetsData = [];
    // let allAssets =
    //   task && task.units
    //     ? _.sortBy(task.units, (unit) => {
    //         let start = unit.start ? parseFloat(unit.start) : 0;
    //         return start;
    //       })
    //     : [];
    task.units.map((asset, count) => {
      if (_.find(assetTypeTracks, (item) => asset.assetType === item)) {
        let assetData = {};
        assetData = { ...asset };
        assetData.HighRail = "";
        assetData.Walk = "";
        asset.Train = "";
        assetData.Observe = "";
        assetsData.push(assetData);
      }
      if (_.find(yardTypeATypeTracks, (item) => asset.assetType === item)) {
        let inspected = false;
        if (asset.appForms && asset.appForms.length > 0) {
          for (let appForm of asset.appForms) {
            if (appForm && inspected == false) {
              if (appForm.form) {
                inspected = checkInspected(appForm);
              }
            }
          }
        }
        if (inspected) {
          let assetData = {};
          assetData = { ...asset };
          assetData.HighRail = task.traverseBy === "Hi-Rail" ? "X" : "";
          assetData.Walk = task.traverseBy === "Walking" || !task.traverseBy ? "X" : "";
          assetData.Train = task.traverseBy === "train" ? "X" : "";
          assetData.Observe = "";
          assetData.start = asset.startMarker ? asset.startMarker : "";
          assetData.sortMp = asset.start;
          assetData.end = asset.endMarker ? asset.endMarker : "";
          assetIntervalList.push(assetData);
        }
      }
      //console.log(unit.end, unit.start);
      let issues = _.filter(task.issues, (issueObj) => {
        return issueObj.unit.id === asset.id;
      });
      if (this.inspectedCheck(asset)) {
        if (issues && issues.length > 0) {
          issues.forEach((issue) => {
            // issuesIncluded.push(issue);
            this.issueDataMaker(issue, asset, issuesData, journeyPlan.lineId);
          });
        } else {
          let issueData = {};
          let markers = asset.startMarker ? asset.startMarker + (asset.endMarker ? "-" + asset.endMarker : "") : "";
          issueData.assetName = asset.unitId;
          issueData.sortMP = asset.start;
          issueData.startPrefix = LocPrefixService.getPrefixMp(asset.start, journeyPlan.lineId);
          issueData.endPrefix = LocPrefixService.getPrefixMp(asset.end, journeyPlan.lineId);
          issueData.MP = markers ? markers : startEndMP(asset, "start", "end", issueData.startPrefix, issueData.endPrefix);
          issueData.RemedialAction = "No Exception Found";
          issuesData.push(issueData);
        }
      } else {
        if (issues && issues.length > 0) {
          issues.forEach((issue) => {
            this.issueDataMaker(issue, asset, issuesData, journeyPlan.lineId);
          });
        }
      }
    });

    for (let session of intervals) {
      let intervalStart = parseFloat(session.start) < parseFloat(session.end) ? parseFloat(session.start) : parseFloat(session.end);
      let intervalEnd = parseFloat(session.start) > parseFloat(session.end) ? parseFloat(session.start) : parseFloat(session.end);
      if (session.hasOwnProperty("traversed") && session.hasOwnProperty("observed")) {
        let traversed = _.find(assetsData, { id: session.traversed });
        let observed = _.find(assetsData, { id: session.observed });
        if (traversed && considerAssetInInterval(traversed, intervalStart, intervalEnd)) {
          let asset = _.cloneDeep(traversed);
          asset.HighRail = task.traverseBy === "Hi-Rail" ? "X" : "";
          asset.Walk = task.traverseBy === "Walking" || !task.traverseBy ? "X" : "";
          asset.Train = task.traverseBy === "train" ? "X" : "";
          if (parseFloat(asset.start) < parseFloat(session.start)) asset.start = session.start;
          if (parseFloat(asset.end) > parseFloat(session.end)) asset.end = session.end;
          let startPrefix = LocPrefixService.getPrefixMp(asset.start, journeyPlan.lineId);
          let endPrefix = LocPrefixService.getPrefixMp(asset.end, journeyPlan.lineId);
          asset.start = startPrefix + asset.start;
          asset.end = endPrefix + asset.end;
          assetIntervalList.push(asset);
        }
        if (observed && considerAssetInInterval(observed, intervalStart, intervalEnd)) {
          let asset = _.cloneDeep(observed);
          asset.Observe = "X";
          if (parseFloat(asset.start) < parseFloat(session.start)) asset.start = session.start;
          if (parseFloat(asset.end) > parseFloat(session.end)) asset.end = session.end;
          let startPrefix = LocPrefixService.getPrefixMp(asset.start, journeyPlan.lineId);
          let endPrefix = LocPrefixService.getPrefixMp(asset.end, journeyPlan.lineId);
          asset.start = startPrefix + asset.start;
          asset.end = endPrefix + asset.end;
          assetIntervalList.push(asset);
        }
      } else {
        for (let asset of assetsData) {
          let assetToConsider = _.cloneDeep(asset);
          if (considerAssetInInterval(assetToConsider, intervalStart, intervalEnd)) {
            if (task.traverseTrack === asset.id) {
              assetToConsider.HighRail = task.traverseBy === "Hi-Rail" ? "X" : "";
              assetToConsider.Walk = task.traverseBy === "Walking" || !task.traverseBy ? "X" : "";
              assetToConsider.Train = task.traverseBy === "train" ? "X" : "";
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
  }
  issueDataMaker(issue, unit, issuesData, lineId) {
    let issueData = {};
    // TODO check include deficiency report
    let serverObj = issue.serverObject ? issue.serverObject : {};
    let includeAllowedDeficiencies = true; //this.props.includeAllowedDeficiencies
    let includeDeficiencyCheck = includeAllowedDeficiencies && issue.issueType == "Deficiency" && serverObj.includeFRAReport;
    if (_.find(assetTypesForIssues, (item) => issue.unit.assetType === item) && (issue.issueType == "Defect" || includeDeficiencyCheck)) {
      issueData.assetName = issue.unit.unitId;
      issueData.startPrefix = LocPrefixService.getPrefixMp(issue.startMp, lineId);
      issueData.endPrefix = LocPrefixService.getPrefixMp(issue.endMp, lineId);
      issueData.MP =
        unit && unit.startMarker
          ? unit.startMarker + (unit.endMarker ? "-" + unit.endMarker : "")
          : startEndMP(issue, null, null, issueData.startPrefix, issueData.endPrefix);
      issueData.sortMP = !issue.startMp && issue.startMarker ? issue.unit.start : issue.startMp;
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
      issueData.rule213Applied = issue.ruleApplied ? issue.ruleApplied : "";

      issueData.timeStamp = moment(issue.timeStamp).format("MM/DD/YYYY");
      issueData.issueId = issue.issueId;
      issueData.comments = getIssueRemedialActionComments(issue);
      if (issue.serverObject) {
        issueData.repairDate =
          issue.serverObject.repairDate !== undefined ? moment(issue.serverObject.repairDate).format("MM/DD/YYYY") : "";
        if (issue.serverObject.repairedBy && this.props.usersSignatures && this.props.usersSignatures.length > 0) {
          let sig = _.find(this.props.usersSignatures, { email: issue.serverObject.repairedBy.email });
          let userName = issue.serverObject.repairedBy.name;
          if (sig && sig.signature) issueData.repairBySignature = sig.signature.imgName;
          if (userName) issueData.repairByName = issue.serverObject.repairedBy.name;
          // let img = new Image();
          // img.src = getServerEndpoint() + "applicationresources" + "/" + sig.signature.imgName;
          // img.onload = (e) => {
          //   this.onImageLoad(sig.signature.imgName, img);
          // };
        }
      }
      issuesData.push(issueData);
    }
  }

  inspectedCheck(unit) {
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
    return inspected;
  }
  basicDataMaker(task, journeyPlan) {
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
    return basicData;
  }

  onImageLoad(signature, img) {
    let loadedImgs = [...this.state.loadedImages];
    loadedImgs.push({ name: signature, img: img });
    this.setState({
      loadedImages: loadedImgs,
    });
  }

  render() {
    return (
      <React.Fragment>
        <DefectReportView
          basicData={this.state.basicData}
          issuesData={this.state.issuesData}
          assetsData={this.state.assetsData}
          signatureImage={this.props.signatureImage}
          userName={this.props.userName}
          header={"Line Inspection and Repair Report"}
          displayModified={false}
          InspectionReportType={this.props.InspectionReportType}
          loadedImages={this.state.loadedImages}
          onImageLoa={this.onImageLoad}
          disableRule213Config={this.state.disableRule213Config}
        />
      </React.Fragment>
    );
  }
}

const getJourneyPlan = curdActions.getJourneyPlan;
const getApplicationlookups = curdActions.getApplicationlookups;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    getJourneyPlan,
    getApplicationlookups,
  },
};

let variableList = {
  journeyPlanReducer: { journeyPlan: "" },
  applicationlookupsReducer: { applicationlookups: [] },
};

const DefectReportContainer = CRUDFunction(DefectReport, "defectReportTask", actionOptions, variableList, [
  "journeyPlanReducer",
  "applicationlookupsReducer",
]);
export default DefectReportContainer;

export function getWeather(task) {
  let tempUnit = task.tempUnit ? task.tempUnit : "";
  let temp = task.temperature || task.temperature == 0 ? task.temperature + " " + tempUnit : "";
  let weatherVal = task.weatherConditions ? task.weatherConditions : "";
  return temp ? temp + (weatherVal ? ", " + weatherVal : "") : weatherVal ? weatherVal : "";
}

function startEndMP(issue, startField, endField, startPrefix, endPrefix) {
  let start = startField ? issue[startField] : issue.startMp;
  let end = endField ? issue[endField] : issue.endMp;
  let mpVal = startPrefix + start;
  if (end && start !== end) mpVal += " - " + (endPrefix ? endPrefix : "") + end;
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
    let titleIndex = issue.title.indexOf("-");
    if (titleIndex !== -1) {
      codeDescription.majorDefectCode = issue.title.slice(0, titleIndex).split(".")[0] + ".";
      codeDescription.majorDescription = issue.title.slice(titleIndex, issue.title.length);
    } else {
      codeDescription.majorDescription = issue.title;
    }
  }
  let tDescIndex = issue.description.indexOf("-");
  if (tDescIndex !== -1) {
    codeDescription.minorDefectCode = issue.description.slice(0, tDescIndex);
    codeDescription.minorDescription = issue.description.slice(tDescIndex + 1, issue.description.length);
  } else {
    codeDescription.minorDescription = issue.description;
  }
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
