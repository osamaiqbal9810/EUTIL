import { updateApplicationLookups } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Update database: update application lookups");
    await updateApplicationLookups([{ listName: "appForms", code: "form1", compare: "opt2" }], true);
  },
};
