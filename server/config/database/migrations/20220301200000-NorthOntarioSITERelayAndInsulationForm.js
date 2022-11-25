import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Add Ontario NorthLand insulation and relayTest app form");
    await addApplookupIfNotExist([
      { listName: "appForms", code: "insulationResistance" },
      { listName: "appForms", code: "relayTestForm" },
    ]);
  },
  attributes: { customer: "Ontario Northland", applicationType: "SITE" },
};
