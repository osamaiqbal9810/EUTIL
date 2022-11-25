import React, { Component } from "react";
import DefectReport from "./LineInspection/DefectReport";
import SwitchReport from "./Switch/switchReport";
import TrackDisturbanceReport from "./TrackDisturbance/trackDisturbanceReport";
import DetailedSwitchInspection from "./Switch/DetailedSwitchInspectionSelection";
import { dateSortArrayByField } from "../../../utils/sortingMethods";
import YardTrackDefectReport from "./YardTrackInspection/YardTrackDefectReport";
import MonthlyBridgeInspection from "./Bridge/monthlyBridgeInspection";
import CurveReport from "./CurveReport/CurveReport";
import DetailedTurnoutInspection from "./EtrSwitchReport/detailedTurnoutInspectionReport";
import { SignatureImage } from "../utils/SignatureImage";
import DetailedTurnoutInspectionReport from "./Ontario/DetailedTurnoutInspectionReport";
import MonthlyTurnoutInspectionReport from "./Ontario/MonthlyTurnoutInspectionReport";

import JobBriefingManager from "../../jobBriefing/JobBrieifingReport/JobBriefingManager";
import NOPB_SwitchInspectionReport from "../NOPB/SwitchInspectionReport";

class MultiReport extends Component {
  renderReports() {
    let reports = null;
    let multiReports = this.props.reportInspections ? this.props.reportInspections.length : 0;
    if (this.props.reportInspections) {
      let filteredReports = dateSortArrayByField(this.props.reportInspections, "date");

      reports = filteredReports.map((inspec) => {
        return reportSelector(this.props, this.props.reportName, inspec, multiReports);
      });
    }
    return reports;
  }
  render() {
    return <div>{this.renderReports()}</div>;
  }
}

export default MultiReport;

function reportSelector(props, report, inspec, multiReports) {
  let obj = {
    "Asset Inspection Reports": (
      <DefectReport
        inspec={inspec}
        key={inspec._id}
        signatureImage={inspec && inspec.user && inspec.user.signature}
        userName={inspec && inspec.user && inspec.user.name}
        InspectionReportType={props.InspectionReportType}
        usersSignatures={props.usersSignatures}
        nonFraCode={props.nonFraCode}
      />
    ),
    "Yard Inspection Report": (
      <YardTrackDefectReport
        inspec={inspec}
        key={inspec._id}
        signatureImage={inspec && inspec.user && inspec.user.signature}
        usersSignatures={props.usersSignatures}
        nonFraCode={props.nonFraCode}
      />
    ),
    "Switch Report": <SwitchReport inspec={inspec} key={inspec._id} nonFraCode={props.nonFraCode} />,
    "Track Disturbance Report": <TrackDisturbanceReport inspec={inspec} key={inspec._id} />,
    "Detailed Switch Inspection": (
      <DetailedSwitchInspection
        inspec={inspec}
        key={inspec._id}
        handleReportPrint={props.printbuttonhandler.show}
        handleReportPrintOff={props.printbuttonhandler.hide}
        multi={multiReports}
        isMulti={props.isMulti}
        usersSignatures={props.usersSignatures}
        signatureImage={inspec && inspec.user && inspec.user.signature}
      />
    ),
    "Bridge Inspection Report": (
      <MonthlyBridgeInspection inspec={inspec} key={inspec._id} signatureImage={inspec && inspec.user && inspec.user.signature} />
    ),
    "Inspection of Curves": (
      <CurveReport inspec={inspec} key={inspec._id} signatureImage={inspec && inspec.user && inspec.user.signature} />
    ),
    "Turnout Inspection Report": (
      <DetailedTurnoutInspection inspec={inspec} key={inspec._id} signatureImage={inspec && inspec.user && inspec.user.signature} />
    ),
    "Turnout Inspection Report ONR": (
      <DetailedTurnoutInspectionReport inspec={inspec} key={inspec._id} signatureImage={inspec && inspec.user && inspec.user.signature} />
    ),
    "Monthly Turnout Report ONR": (
      <MonthlyTurnoutInspectionReport
        inspec={inspec}
        key={inspec._id}
        signatureImage={inspec && inspec.user && inspec.user.signature}
        usersSignatures={props.usersSignatures}
      />
    ),
    "Safety Briefing": (
      <JobBriefingManager inspec={inspec} key={inspec._id} signatureImage={inspec && inspec.user && inspec.user.signature} />
    ),
    "Switch Inspection Report": (
      <NOPB_SwitchInspectionReport inspec={inspec} key={inspec._id} signatureImage={inspec && inspec.user && inspec.user.signature} />
    ),
  };
  return obj[report] ? obj[report] : null;
}
