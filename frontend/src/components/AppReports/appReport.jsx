import React, { Component } from "react";
import ReportModule from "../Reports";

class AppReport extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    localStorage.setItem("source", "MobileApp");
    if (this.props.match && this.props.match.params.token) {
      localStorage.setItem("access_token", this.props.match.params.token);
    }
  }
  render() {
    return (
      <div
        className="app-report"
        style={{ zIndex: "100", background: "rgba(227, 233, 239, 1)", height: "100%", width: "100%", margin: 0, padding: 0 }}
      >
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html:
              "@media print { .report-controls,.report-print,header,div#sideNav,.report-arrow,.nav-wrapper{display: none;visibility:hidden,opacity:0}.table-report.bridge{margin:0;padding:0} #mainContent {zoom:.75;margin:0;padding:0},@page {size: landscape !important;size: auto !important;margin:0;padding:0}}",
          }}
        />
        <ReportModule />
      </div>
    );
  }
}
export default AppReport;
