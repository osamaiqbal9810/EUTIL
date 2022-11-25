import { addApplookupIfNotExist, updateApplicationLookups } from "../configurations/applicationlookupslist";
module.exports = {
  async up() {
    console.log("Add Script: Adding SFRTA Safety briefing forms");
    await addApplookupIfNotExist([
      { listName: "appForms", code: "safetyBriefing" },
      { listName: "appForms", code: "briefingChecklist" },
      { listName: "appForms", code: "formo" },
      { listName: "appForms", code: "trackandtime" },
    ]);
    await addApplookupIfNotExist([
      { listName: "appForms", code: "safetyBriefing", compare: "opt1" },
      { listName: "appForms", code: "briefingChecklist", compare: "opt1" },
      { listName: "appForms", code: "formo", compare: "opt1" },
      { listName: "appForms", code: "trackandtime", compare: "opt1" },
    ]);
  },
  attributes: { customer: "South Florida Regional Transportation Authority" },
};
