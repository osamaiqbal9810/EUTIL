import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Add Essex Terminal Railway curve app form");
    await addApplookupIfNotExist([{ listName: "appForms", code: "curveTestFormETR" }]);
  },
  attributes: { customer: "Essex Terminal Railway", applicationType: "TIMPS" },
};
