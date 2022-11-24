// import { languageService } from "Language/language.service";
// import IssueFilter from "../IssuesList/IssueFilter";
/* eslint eqeqeq: 0 */
export const TEMPLATE_ISSUES_FILTERS = {
  lineNames: [],
  assetChildren: null,
  fromDashboard: null,
  rangeState: null,
  activeSummary: "Total",
  dateFilterName: "30 Days",
  displayMenuAll: true,
  statusFilter: "Open",
  pageSize: 30,

};

export const getCurrentIssuesStateFilters = issuesFilterState => {
  let stateToReturn = TEMPLATE_ISSUES_FILTERS;
  if (issuesFilterState) {
    let dashboardRelatedFields = {
      //listViewDataToShow: issuesFilterState.listViewDataToShow,
      assetChildren: issuesFilterState.assetChildren,
      issueType: issuesFilterState.issueType,
      rangeState: issuesFilterState.rangeState,
      lineNames: issuesFilterState.lineNames,
      activeSummary: issuesFilterState.activeSummary,
      // rangeState: issuesFilterState.rangeState,
      dateFilterName: issuesFilterState.dateFilterName,
      displayMenuAll: issuesFilterState.displayMenuAll,
      statusFilter: issuesFilterState.statusFilter,
      pageSize: issuesFilterState.pageSize,
      // statusFilter: issuesFilterState.statusFilter,
    };
    if (issuesFilterState.fromDashboard) {
      dashboardRelatedFields = {
        // listViewDataToShow: issuesFilterState.fromDashboard.listViewDataToShow,
        assetChildren: issuesFilterState.fromDashboard.assetChildren,
        issueType: issuesFilterState.issueType,
        lineNames: issuesFilterState.fromDashboard.lineNames,
        rangeState: issuesFilterState.fromDashboard.rangeState,
        activeSummary: issuesFilterState.fromDashboard.activeSummary,
        // rangeState: issuesFilterState.fromDashboard.rangeState,
        dateFilterName: issuesFilterState.fromDashboard.dateFilterName,
        displayMenuAll: issuesFilterState.fromDashboard.displayMenuAll,
        pageSize: issuesFilterState.fromDashboard.pageSize,
        statusFilter: issuesFilterState.fromDashboard.statusFilter,
      };
      issuesFilterState.fromDashboard.rangeState && (dashboardRelatedFields.rangeState = issuesFilterState.fromDashboard.rangeState);
    }
    stateToReturn = {
      ...dashboardRelatedFields,
    };
  }

  return stateToReturn;
};
