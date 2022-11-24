import React from "react";

import TrackReport from "components/Reports/Track/index.jsx";
import MultiReportTrack from "./multiReportTrack";

class MultiReportPrint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    // return (
    //   <React.Fragment>
    //     {this.props.reportName === "Track Report" && <MultiReportTrack reportFilter={this.props.reportFilter} />}
    //     {this.props.reportName === "Switch Report" && <MultiReportTrack reportFilter={this.props.reportFilter} />}
    //     {this.props.reportName === "Track Disturbance Report" && <MultiReportTrack reportFilter={this.props.reportFilter} />}
    //   </React.Fragment>
    // );
    const reportData =
      this.props.reportFilter &&
      this.props.reportFilter.length > 0 &&
      this.props.reportFilter.map((inspec, index) => {
        return <TrackReport reportId={inspec._id} key={inspec._id} />;
      });
    return <React.Fragment>{reportData}</React.Fragment>;
  }
}

export default MultiReportPrint;
