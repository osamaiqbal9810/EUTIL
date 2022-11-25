import { updateApplicationLookups, timpsAppForms } from "../configurations/applicationlookupslist";
import { scimAppForms } from "../configurations/appForms/SITE_AppForms";

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
