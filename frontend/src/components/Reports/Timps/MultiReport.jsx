import React, { Component } from "react";
import DefectReport from "./LineInspection/DefectReport";
import SwitchReport from "./Switch/switchReport";
import TrackDisturbanceReport from "./TrackDisturbance/trackDisturbanceReport";
import DetailedSwitchInspection from "./Switch/DetailedSwitchInspectionSelection";
import { dateSortArrayByField } from "../../../utils/sortingMethods";
import FacilityInspForm from "../ElectricalUtility/FacilityInspForm";

class MultiReport extends Component {
  renderReports() {
    let reports = null;
    let multiReports = this.props.reportInspections ? this.props.reportInspections.length : 0;
    // if (multiReports) {
    //   multiReports = multiReports.prototype.sort((a, b) => {
    //     const a1 = new Date(a.date).getTime();
    //     const b1 = new Date(b.date).getTime();
    //     if (a1 < b1) return 1;
    //     else if (a1 > b1) return -1;
    //     else return 0;
    //   });
    // }
    if (this.props.reportInspections) {
      let filteredReports = dateSortArrayByField(this.props.reportInspections, "date");

      reports = filteredReports.map((inspec) => {
        if (this.props.reportName === "Line Inspection Report") {
          return <DefectReport inspec={inspec} key={inspec._id} signatureImage={inspec && inspec.user && inspec.user.signature} />;
        }
        if (this.props.reportName === "Switch Report") {
          return <SwitchReport inspec={inspec} key={inspec._id} />;
        }
        if (this.props.reportName === "Track Disturbance Report") {
          return <TrackDisturbanceReport inspec={inspec} key={inspec._id} />;
        }
        if (this.props.reportName === "Detailed Switch Inspection") {
          return (
            <DetailedSwitchInspection
              inspec={inspec}
              key={inspec._id}
              handleReportPrint={this.props.printbuttonhandler.show}
              handleReportPrintOff={this.props.printbuttonhandler.hide}
              multi={multiReports}
              isMulti={this.props.isMulti}
              signatureImage={inspec && inspec.user && inspec.user.signature}
            />
          );
        }
        if (this.props.reportName === "Inspection of Utility Facilities") {
          return <FacilityInspForm inspection={inspec} key={inspec._id} />;
        }
      });
    }
    return reports;
  }
  render() {
    return <div>{this.renderReports()}</div>;
  }
}

export default MultiReport;
