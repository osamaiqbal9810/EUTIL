import { updateApplicationLookups, scimAppForms, timpsAppForms } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Update Script: GI Forms Completion Tag added.");
    for (let timpsForm of timpsAppForms) {
      await updateApplicationLookups([{ listName: "appForms", code: timpsForm.code, compare: "opt1" }]);
    }
    for (let scimAppForm of scimAppForms) {
      await updateApplicationLookups([{ listName: "appForms", code: scimAppForm.code, compare: "opt1" }]);
    }
  },
};
