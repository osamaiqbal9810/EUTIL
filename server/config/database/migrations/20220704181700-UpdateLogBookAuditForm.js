import { logBookOpt1 } from "../configurations/appForms/ONR_Forms/SiteForms/testForms/Log book audit";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";

module.exports = {
  async up() {
    console.log("Update Logbook audit form if exist.");
    let logbookAuditForm = await ApplicationLookupsModel.findOne({listName:"appForms", code:"grade_1001b1"});
    if(logbookAuditForm) {
        logbookAuditForm.opt1 = logBookOpt1;
        await logbookAuditForm.save();
        console.log('Updated the Logbook Audit Form.');
    }
    else {
        console.log('Logbook Audit Form does not exist. Igonring the update.');
    }
  },
};
