// import { languageService } from "Language/language.service";
// import IssueFilter from "../IssuesList/IssueFilter";
/* eslint eqeqeq: 0 */
export const TEMPLATE_ISSUES_FILTERS = {
  //lineNames: [],
  // assetChildren: null,
  // fromDashboard: null,
  // rangeState: null,
  // activeSummary: "Total",
  // dateFilterName: "30 Days",
  // displayMenuAll: true,
  // statusFilter: "Open",
  listPage: 0,
  planPageSize: 30,

};

export const getCurrentIssuesStateFilters = issuesFilterState => {
  let stateToReturn = TEMPLATE_ISSUES_FILTERS;
  //let stateToReturn  = {}
  if (issuesFilterState) {
     stateToReturn  = {
      //listViewDataToShow: issuesFilterState.listViewDataToShow,
      // assetChildren: issuesFilterState.assetChildren,
      // issueType: issuesFilterState.issueType,
      // rangeState: issuesFilterState.rangeState,
      // lineNames: issuesFilterState.lineNames,
      // activeSummary: issuesFilterState.activeSummary,
      // // rangeState: issuesFilterState.rangeState,
      // dateFilterName: issuesFilterState.dateFilterName,
      // displayMenuAll: issuesFilterState.displayMenuAll,
      // statusFilter: issuesFilterState.statusFilter,
      planPageSize: issuesFilterState.planPageSize,
      listPage:issuesFilterState.listPage,
      // statusFilter: issuesFilterState.statusFilter,
    };
  
    
  }

  return stateToReturn;
};
