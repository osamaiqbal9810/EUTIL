import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Add Script: Adding 2 safety briefing forms");
    await addApplookupIfNotExist([{ listName: "appForms", code: "safetyBriefing" }]);
    await addApplookupIfNotExist([{ listName: "appForms", code: "briefingChecklist" }]);
    //Not adding as they are not related to SITE
    /*await addApplookupIfNotExist([{ listName: "appForms", code: "trackandtime" }]);
        await addApplookupIfNotExist([{ listName: "appForms", code: "formo" }]);*/
  },
  attributes: { customer: "South Florida Regional Transportation Authority" },
};
