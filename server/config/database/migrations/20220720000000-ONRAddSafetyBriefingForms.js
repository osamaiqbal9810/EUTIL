import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Add Script: Adding safety briefing forms for ONR");
    await addApplookupIfNotExist([
      { listName: "appForms", code: "onrSafetyBriefing" },
      { listName: "appForms", code: "onrloneWorkerBriefing" },
      { listName: "appForms", code: "onrsafetyWatchBriefing" },
    ]);
  },
  attributes: { customer: "Ontario Northland" },
};
