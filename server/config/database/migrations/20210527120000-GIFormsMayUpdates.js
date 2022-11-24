import { updateApplicationLookups } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Update Script: GI Forms Completion field added for SCIM application.");
    await updateApplicationLookups([
      { listName: "appForms", code: "frmSwitchInspection", compare: "opt1" },
      { listName: "appForms", code: "suivimargingi335", compare: "opt1" },
    ]);
  },
};
