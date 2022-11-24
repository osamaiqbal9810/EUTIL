import { updateApplicationLookups } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Update Script: GI Forms Completion field added for SCIM application.");
    await updateApplicationLookups([{ listName: "appForms", code: "frmSwitchInspection", compare: "opt1" }]);
    await updateApplicationLookups([{ listName: "appForms", code: "frmAnnualSI4QNS", compare: "opt1" }]);
    await updateApplicationLookups([{ listName: "appForms", code: "frmMonthlySI4QNS", compare: "opt1" }]);
  },
};
