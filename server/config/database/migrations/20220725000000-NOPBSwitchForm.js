import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Ontario NorthLand monthly detailed switch app form Update");
    await addApplookupIfNotExist([{ listName: "appForms", code: "nopbSwitchForm" }]);
  },
  attributes: { customer: "NOPB", applicationType: "TIMPS" },
};
