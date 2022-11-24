// import { languageService } from "Language/language.service";
// import IssueFilter from "../IssuesList/IssueFilter";
import moment from "moment";
const InputObj = {
  location: "",
  user: "",
};
export const TEMPLATE_REPORT_FILTERS = {
  reportName: "Inspection of Utility Facilities",
  reportTitle: "Inspection of Utility Facilities",
  InputObj: { ...InputObj },
  showReport: false,
  inspec: {},
  dateRange: { from: new Date(moment().startOf("day")), today: new Date(moment().startOf("day")), to: new Date(moment().endOf("day")) },
};

export const getCurrentReportStateFilters = (reportFilterState) => {
  let stateToReturn = TEMPLATE_REPORT_FILTERS;
  if (reportFilterState) {
    stateToReturn = {
      reportName: reportFilterState.reportName,
      reportTitle: reportFilterState.reportTitle,
      //location: reportFilterState.location,
      InputObj: { ...reportFilterState.InputObj },
      dateRange: reportFilterState.dateRange,
      showReport: reportFilterState.showReport,
      inspec: reportFilterState.inspec,
    };
  }

  return stateToReturn;
};
