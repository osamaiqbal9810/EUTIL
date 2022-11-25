// import { languageService } from "Language/language.service";
// import IssueFilter from "../IssuesList/IssueFilter";
import moment from "moment";
const InputObj = {
  location: "",
  user: "",
  assetType: "",
  defectCode: "",
  defectStatus: "",
};
export const TEMPLATE_REPORT_FILTERS = {
  reportName: "Asset Inspection Reports",
  reportTitle: "Asset Inspection Reports",
  InputObj: { ...InputObj },
  inspec: {},
  InspectionReportType: "Original",
  dateRange: { from: new Date(moment().startOf("day")), today: new Date(moment().startOf("day")), to: new Date(moment().endOf("day")) },
  iPeriod: "",
  year: moment().year(Number).format("YYYY"),
  pRange: "",
  submit: false,
};

export const getCurrentReportStateFilters = (reportFilterState) => {
  let stateToReturn = TEMPLATE_REPORT_FILTERS;
  if (reportFilterState) {
    let siteDateControl = {};
    reportFilterState.year && (siteDateControl["year"] = reportFilterState.year);
    reportFilterState.pRange && (siteDateControl["pRange"] = reportFilterState.pRange);
    reportFilterState.iPeriod && (siteDateControl["iPeriod"] = reportFilterState.iPeriod);
    reportFilterState.submit && (siteDateControl["submit"] = reportFilterState.submit);
    stateToReturn = {
      ...stateToReturn,
      reportName: reportFilterState.reportName,
      reportTitle: reportFilterState.reportTitle,
      InputObj: { ...reportFilterState.InputObj },
      dateRange: reportFilterState.dateRange,
      inspec: reportFilterState.inspec,
      InspectionReportType: reportFilterState.InspectionReportType,
      ...siteDateControl,
    };
  }

  return stateToReturn;
};
