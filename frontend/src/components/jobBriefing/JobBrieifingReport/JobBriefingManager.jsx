import React, { Component } from "react";
import _ from "lodash";
import JobBriefing from "./JobBriefing";
import SafetyRemindersChecklist from "./SafetyRemindersChecklist";
import { getFormSummary } from "../../Reports/utils/getFormSummary";
import JobBriefingOntario from "./Ontario/JobBriefingOntario";
import SafetyWatchONR from "./Ontario/safetyWatch";
import LoneWorkerONR from "./Ontario/loneWorker";
import SFRTA_TrackAndTimeForm from "../../Reports/SFRTA/TrackAndTimeForm";
import SFRTA_TracksRemovedFromServiceFormOReport from "../../Reports/SFRTA/TracksRemovedFromServiceFormO";
import { ReportGeneratorUtils } from "../../Reports/utils/reportGeneratorUtils";

// add more inspection reports here
const supportedJobBriefings = [
  { formId: "safetyBriefing", component: JobBriefing },
  { formId: "briefingChecklist", component: SafetyRemindersChecklist },
  { formId: "onrSafetyBriefing", component: JobBriefingOntario },
  { formId: "onrloneWorkerBriefing", component: LoneWorkerONR },
  { formId: "onrsafetyWatchBriefing", component: SafetyWatchONR },
  { formId: "sfrtaTrackAndTime", component: SFRTA_TrackAndTimeForm },
  { formId: "sfrtaFormO", component: SFRTA_TracksRemovedFromServiceFormOReport },
];

export default class JobBriefingManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      briefings: [],
    };
  }

  componentDidMount() {
    let { inspec } = this.props;
    this.setState(ReportGeneratorUtils.getInspectionJobBriefings(inspec));
  }

  render() {
    let { briefings, workers } = this.state;
    return (
      <React.Fragment>
        {supportedJobBriefings.map((suppBriefing) => {
          let foundBriefings = briefings.filter((briefing) => briefing.formId === suppBriefing.formId);
          return (
            foundBriefings &&
            Array.isArray(foundBriefings) &&
            foundBriefings.map((foundBriefing) =>
              foundBriefing.jobBriefingForms
                ? foundBriefing.jobBriefingForms.map((briefingForm, i) => {
                    let comp = suppBriefing.component;
                    let summary = getFormSummary(briefingForm);
                    return React.createElement(comp, {
                      data: summary,
                      workers: workers,
                      key: i,
                    });
                  })
                : null,
            )
          );
        })}
      </React.Fragment>
    );
  }
}
