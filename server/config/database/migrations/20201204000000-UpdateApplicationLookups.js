import { updateApplicationLookups } from "../configurations/applicationlookupslist";

module.exports = {
    async up(){
    console.log('Update database: update application lookups: Monthly and Annual Switch forms');
       await updateApplicationLookups([
           { listName: "appForms", code: "frmMonthlySI4QNS", compare: "opt1" },
           { listName: "appForms", code: "frmMonthlySI4QNS", compare: "description" },
           { listName: "appForms", code: "frmAnnualSI4QNS", compare: "opt1" },
           { listName: "appForms", code: "frmAnnualSI4QNS", compare: "description" },
    ]);
    }
};