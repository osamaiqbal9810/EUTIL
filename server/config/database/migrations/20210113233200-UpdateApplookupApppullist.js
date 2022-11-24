import { updateApplicationLookups } from "../configurations/applicationlookupslist";

module.exports = {
    async up(){
    console.log('Update database: update application lookups');
       await updateApplicationLookups([
      { listName: "AppPullList", code: "23", compare: "opt2" }
    ]);
    }
};