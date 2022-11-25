import { gradeFormGet } from "../configurations/appForms/ONR_Forms/SiteForms/gradeCrossingForms";
import { updateApplicationLookups } from "../configurations/applicationlookupslist";
module.exports = {
  async up() {
    console.log("Ontario NorthLand site app forms Update");
    let testForms = gradeFormGet();
    for (let form of testForms) {
      await updateApplicationLookups([{ listName: "appForms", code: form.code, compare: "opt1" }]);
    }
  },
  attributes: { customer: "Ontario Northland", applicationType: "SITE" },
};
