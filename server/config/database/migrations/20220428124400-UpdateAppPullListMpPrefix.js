import { updateApplicationLookups } from "../configurations/applicationlookupslist";

module.exports = {
    async up(){
        console.log('Update database: update application lookups, appPullList MP prefix');
        await updateApplicationLookups([
            { listName: "AppPullList", code: "21", compare: "opt2" }            
        ]);
    }
};