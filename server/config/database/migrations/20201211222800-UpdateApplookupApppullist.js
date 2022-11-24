import { updateApplicationLookups } from "../configurations/applicationlookupslist";

module.exports = {
    async up(){
    console.log('Update database: update application lookups');
       await updateApplicationLookups([
      { listName: "AppPullList", code: "21", compare: "opt2" }
    ]);
    }
};