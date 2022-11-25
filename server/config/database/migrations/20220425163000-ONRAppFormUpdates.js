import { gradeFormGet } from "../configurations/appForms/ONR_Forms/SiteForms/gradeCrossingForms";
import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";
module.exports = {
  async up() {
    console.log("Ontario NorthLand switch app form Update");
    let testForms = gradeFormGet();
    for (let form of testForms) {
      await addApplookupIfNotExist([{ listName: "appForms", code: form.code, compare: "opt1" }]);
    }
    
  },
  attributes: { customer: "Ontario Northland", applicationType: "SITE" },
};
