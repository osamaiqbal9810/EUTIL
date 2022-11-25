import { addApplookupIfNotExist } from "../../configurations/applicationlookupslist";

module.exports = {
  async apply() {
    console.log("Patch: Add/Remove required for TIMPS application.");

    await addApplookupIfNotExist([
      { listName: "appForms", code: "insulationResistance" },
      { listName: "appForms", code: "relayTestForm" },
      { listName: "appForms", code: "form234.249B12_M" },
      { listName: "appForms", code: "form234.249B_M" },
      { listName: "appForms", code: "form234.251B12_M" },
      { listName: "appForms", code: "form234.251B_M" },
      { listName: "appForms", code: "form234.253C_M" },
      { listName: "appForms", code: "form234.257A_M" },
      { listName: "appForms", code: "form234.257B_M" },
      { listName: "appForms", code: "form234.271_Q" },
      { listName: "appForms", code: "form234.253A_Y" },
      { listName: "appForms", code: "form234.253B_Y" },
      { listName: "appForms", code: "form234.259_Y" },
    ]);
  },
};
