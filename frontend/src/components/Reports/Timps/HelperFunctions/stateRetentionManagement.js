// import { languageService } from "Language/language.service";
// import IssueFilter from "../IssuesList/IssueFilter";
import moment from "moment";
const InputObj = {
  location: "",
  user: "",
  assetType: "",
  defectCode: "",
  defectStatus: "",
  asset_name:"",
  priority_level:"1",
  assetStatus:""
};
export const TEMPLATE_REPORT_FILTERS = {
  reportName: "Asset Inspection Reports",
  reportTitle: "Asset Inspection Reports",
  InputObj: { ...InputObj },
  showReport: false,
  inspec: {},
  InspectionReportType: "Original",
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
      InspectionReportType: reportFilterState.InspectionReportType
    };
  }

  return stateToReturn;
};
