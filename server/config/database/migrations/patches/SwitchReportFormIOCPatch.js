import { deleteApplicationLookups, addApplookupIfNotExist } from "../../configurations/applicationlookupslist";

module.exports = {
  async apply() {
    console.log("Patch: Add/Remove required Switch Form for IOC Timps application.");

    await deleteApplicationLookups([{ listName: "appForms", code: "frmSwitchInspection" }]);

    await addApplookupIfNotExist([
      { listName: "appForms", code: "frmMonthlySI4QNS" },
      { listName: "appForms", code: "frmAnnualSI4QNS" },
    ]);
  },
};
