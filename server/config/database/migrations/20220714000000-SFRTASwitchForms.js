import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";
module.exports = {
  async up() {
    console.log("Ontario NorthLand monthly detailed switch app form Update");
    await addApplookupIfNotExist([
      { listName: "appForms", code: "sfrtaSwitchLockRodNormal" },
      { listName: "appForms", code: "sfrtaSwitchLockRodReverse" },
      { listName: "appForms", code: "sfrtaSwitchcircuitControllerNormal" },
      { listName: "appForms", code: "sfrtaSwitchcircuitControllerReverse" },
      { listName: "appForms", code: "sfrtaSwitchshuntFouling" },
    ]);
  },
  attributes: { customer: "South Florida Regional Transportation Authority", applicationType: "SITE" },
};
