import { updateApplicationLookups } from "../configurations/applicationlookupslist";

module.exports = {
    async up(){
    console.log('Update database: update application lookups');
       await updateApplicationLookups([
      { listName: "resolveIssueRemedialAction", code: "resolveIssuesOnRemedialAction", compare: "opt1" },
      { listName: "remedialAction", code: "01 slowOrderApplied", compare: "opt1" },
      { listName: "appForms", code: "form1", compare: "opt1" },
      { listName: "AppPullList", code: "25", compare: "opt2" },
    ]);
    }
};