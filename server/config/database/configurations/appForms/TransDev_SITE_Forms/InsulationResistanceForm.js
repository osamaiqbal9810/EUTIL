export const insulationResistance = {
  tenantId: "ps19",
  listName: "appForms",
  code: "insulationResistance",
  description: "Insulation Resistance Test",
  opt2: { config: [], classify: "point", allowedInstruction: [], restrictAssetTypes: [], allowedAssetTypes: ["Grade Crossing Warning"] },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Inspected",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "t-fra",
      fieldName: "FRA Rules 234.267  236.108",
      fieldType: "label",
    },
    {
      id: "tx-insp",
      fieldName: "Inspector",
      fieldType: "text",
      default: "#VAR_UNAME#",
      enabled: false,
    },
    {
      id: "tx-date",
      fieldName: "Date Tested",
      fieldType: "text",
      default: "#VAR_NOW#",
      enabled: false,
    },

    {
      id: "tx-cable",
      fieldName: "Cable/Conductor Nomenclature",
      fieldType: "text",
    },

    {
      id: "t-circuit",
      fieldName: "Circuits less than 500k Ohms",
      fieldType: "label",
    },

    {
      id: "tx-ground",
      fieldName: "Insulation Resistance to Ground (Ohms)",
      fieldType: "text",
    },

    {
      id: "tx-conduct",
      fieldName: "Insulation Resistance between Conductors (Ohms)",
      fieldType: "text",
    },

    {
      id: "tx-result",
      fieldName: "Results of Test",
      fieldType: "text",
    },

    {
      id: "tx-remark",
      fieldName: "Remarks",
      fieldType: "text",
    },

    {
      id: "t-note",
      fieldName: "Note: If conductor is below 200K Ohms, it must be removed from service",
      fieldType: "label",
    },

    {
      id: "t-test",
      fieldName: "Results of tests:",
      fieldType: "label",
    },

    {
      id: "t-ok",
      fieldName: "OK-- Test complete equipment in satisfactory condition.",
      fieldType: "label",
    },

    {
      id: "t-rc",
      fieldName: "R/C-- Repair or replacement/test complete-equipment in satisfactory condition.",
      fieldType: "label",
    },

    {
      id: "t-result1",
      fieldName: "If results are 'R/C' explain the procedure in the remarks column.",
      fieldType: "label",
    },
  ],
};
