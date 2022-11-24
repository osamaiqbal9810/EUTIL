import { updateApplicationLookups } from "../configurations/applicationlookupslist";
import {updateIndividualConfigurations} from "../configurations/configurations";

module.exports = {
    async up(){
        console.log('Update database: update application lookups and configs');
        await updateApplicationLookups([
            { listName: "AppPullList", code: "23", compare: "opt2" }            
        ]);
        await updateIndividualConfigurations([
            { listName: "config", code:"apptaskviewbypass", compare:"opt1"},
            { listName: "config", code:"appdefaultasset", compare:"opt1"}
        ]);
    }
};