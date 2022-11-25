import React, { Component } from "react";
import SafetyBriefingReportContainer from "../../Reports/Timps/reportfilter";

export default class Safetybriefiing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.list = ["Safety Briefing"];
  }

  render() {
    return <SafetyBriefingReportContainer list={this.list} defaultActive="Safety Briefing" stateRetentionObjName={"safetyBriefingRetention"} />;
  }
}
