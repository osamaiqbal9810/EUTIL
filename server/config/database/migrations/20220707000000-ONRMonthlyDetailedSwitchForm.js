import { addApplookupIfNotExist, updateApplicationLookups } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Ontario NorthLand monthly detailed switch app form Update");
    await addApplookupIfNotExist([{ listName: "appForms", code: "monthlydetailedformONR" }]);
    await updateApplicationLookups([{ listName: "appForms", code: "onrTurnoutForm", compare: "opt1" }]);
  },
  attributes: { customer: "Ontario Northland", applicationType: "TIMPS" },
};
