import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";
import { updateApplicationLookups } from "../configurations/applicationlookupslist";
module.exports = {
  async up() {
    console.log("Add Script: Adding SFRTA more reports (interlocking, hotbox, update bridge and switch forms)");
    await addApplookupIfNotExist([
      { listName: "appForms", code: "sfrtaHotBox30Days" },
      { listName: "appForms", code: "sfrtaHotBox90Days" },
      { listName: "appForms", code: "sfrtaDraggingEquip30Days" },
      { listName: "appForms", code: "sfrtaMechanical236_376" },
      { listName: "appForms", code: "sfrtaApproach236_377" },
      { listName: "appForms", code: "sfrtaTime236_378" },
      { listName: "appForms", code: "sfrtaRoute236_379" },
      { listName: "appForms", code: "sfrtaIndication236_380" },
      { listName: "appForms", code: "sfrtaTraffic236_381" },
      { listName: "appForms", code: "sfrtaBridgeLockingForm" },
    ]);
    await updateApplicationLookups([
      { listName: "appForms", code: "sfrtaSwitchLockRodNormal", compare: "opt1" },
      { listName: "appForms", code: "sfrtaSwitchLockRodReverse", compare: "opt1" },
      { listName: "appForms", code: "sfrtaSwitchcircuitControllerNormal", compare: "opt1" },
      { listName: "appForms", code: "sfrtaSwitchcircuitControllerReverse", compare: "opt1" },
      { listName: "appForms", code: "sfrtaSwitchshuntFouling", compare: "opt1" },
      { listName: "appForms", code: "sfrtaBridgeLockingForm", compare: "opt2" },
    ]);
  },
  attributes: { customer: "South Florida Regional Transportation Authority", applicationType: "SITE" },
};
