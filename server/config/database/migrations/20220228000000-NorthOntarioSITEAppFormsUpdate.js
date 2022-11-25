import { gradeFormGet } from "../configurations/appForms/ONR_Forms/SiteForms/gradeCrossingForms";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
import { batteryCardForm } from "../configurations/appForms/ONR_Forms/SiteForms/batteryCardForm";

module.exports = {
  async up() {
    console.log("Ontario NorthLand switch app form Update");
    let testForms = gradeFormGet();
    for (let form of testForms) {
      let additionalSet = {};
      if (form.code === "grade_203") {
        additionalSet = { opt1: batteryCardForm };
      }
      let setCrit = { $set: { "opt2.allowedInstruction": form.allowedInstruction, ...additionalSet } };
      await ApplicationLookupsModel.updateOne({ listName: "appForms", code: form.code }, setCrit);
    }
  },
  attributes: { customer: "Ontario Northland", applicationType: "SITE" },
};
