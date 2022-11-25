import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";
import { gradeFormGet } from "../configurations/appForms/ONR_Forms/SiteForms/gradeCrossingForms";

module.exports = {
  async up() {
    console.log("Add Ontario NorthLand switch app form");
    let testForms = gradeFormGet();
    for (let form of testForms) {
      await addApplookupIfNotExist([{ listName: form.listName, code: form.code }]);
    }
  },
  attributes: { customer: "Ontario Northland", applicationType: "SITE" },
};
