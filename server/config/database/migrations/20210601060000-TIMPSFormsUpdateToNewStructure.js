import { updateApplicationLookups, addApplookupIfNotExist } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Update Script: Add 3 Inspection Forms to TIMPS and Switch Forms opt 2 configs structure update");
    await updateApplicationLookups([{ listName: "appForms", code: "frmSwitchInspection", compare: "opt2" }]);
    await updateApplicationLookups([{ listName: "appForms", code: "frmAnnualSI4QNS", compare: "opt2" }]);
    await updateApplicationLookups([{ listName: "appForms", code: "frmMonthlySI4QNS", compare: "opt2" }]);
    await addApplookupIfNotExist([{ listName: "appForms", code: "inspectionForm1" }]);
    await addApplookupIfNotExist([{ listName: "appForms", code: "inspectionForm2" }]);
    await addApplookupIfNotExist([{ listName: "appForms", code: "inspectionForm3" }]);
  },
};
