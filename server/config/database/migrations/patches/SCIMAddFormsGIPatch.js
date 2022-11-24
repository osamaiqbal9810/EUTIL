import { addApplookupIfNotExist } from "../../configurations/applicationlookupslist";

module.exports = {
  async apply() {
    console.log("Patch: Add/Remove required for SCIM application.");
    await addApplookupIfNotExist([
      { listName: "appForms", code: "formGI303" },
      { listName: "appForms", code: "formFicheB12B24" },
      { listName: "appForms", code: "gi313f" },
      { listName: "appForms", code: "gi329fa" },
      { listName: "appForms", code: "gi329fb" },
      { listName: "appForms", code: "gi329fc" },
      { listName: "appForms", code: "gi329fd" },
    ]);
  },
};
