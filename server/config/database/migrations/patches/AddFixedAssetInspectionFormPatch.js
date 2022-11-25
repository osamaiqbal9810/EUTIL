import { addApplookupIfNotExist } from "../../configurations/applicationlookupslist";

module.exports = {
  async apply() {
    console.log("Patch: Add/Remove Fixed Asset Form");
    await addApplookupIfNotExist([
      { listName: "appForms", code: "fixedInspectionForm1" },
      { listName: "appForms", code: "fixedInspectionForm2" },
      { listName: "appForms", code: "fixedInspectionForm3" },
    ]);
  },
};
