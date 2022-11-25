import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";
module.exports = {
  async up() {
    console.log("Ontario NorthLand Detailed Turnout form create");

    await addApplookupIfNotExist([{ listName: "appForms", code: "onrTurnoutForm" }]);
  },
  attributes: { customer: "Ontario Northland", applicationType: "TIMPS" },
};
