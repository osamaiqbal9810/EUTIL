export const relaytestForm = {
  tenantId: "ps19",
  listName: "appForms",
  code: "relayTestForm",
  description: "Relay Test Form",
  opt2: { config: [], classify: "point", allowedInstruction: [], restrictAssetTypes: [], allowedAssetTypes: ["Grade Crossing Warning"] },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Inspected",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "fra",
      fieldName: "FRA Rules: 236.102  236.105   236.106",
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
      id: "signal",
      fieldName: "Nomenclature or Signal Number",
      fieldType: "text",
    },
    {
      id: "date",
      fieldName: "Date Tested",
      fieldType: "text",
      default: "#VAR_NOW#",
      enabled: false,
    },

    {
      id: "make",
      fieldName: "Make",
      fieldType: "text",
    },

    {
      id: "type",
      fieldName: "Type",
      fieldType: "text",
    },

    {
      id: "resist",
      fieldName: "Resistance (Ohms)",
      fieldType: "text",
    },

    {
      id: "serial",
      fieldName: "Serial Number",
      fieldType: "text",
    },

    {
      id: "pick",
      fieldName: "Pick-up",
      fieldType: "label",
    },

    {
      id: "nor1",
      fieldName: "Normal (R-G)",
      fieldType: "text",
    },

    {
      id: "rev1",
      fieldName: "Reverse (R-Y)",
      fieldType: "text",
    },

    {
      id: "drop",
      fieldName: "Drop-away",
      fieldType: "label",
    },

    {
      id: "nor2",
      fieldName: "Normal (G-R)",
      fieldType: "text",
    },

    {
      id: "rev2",
      fieldName: "Reverse (Y-R)",
      fieldType: "text",
    },

    {
      id: "work",
      fieldName: "Working",
      fieldType: "label",
    },

    {
      id: "nor3",
      fieldName: "Normal (R-G)",
      fieldType: "text",
    },

    {
      id: "rev3",
      fieldName: "Reverse (R-Y)",
      fieldType: "text",
    },

    {
      id: "timeflash",
      fieldName: "Timing/Flash Rate",
      fieldType: "label",
    },

    {
      id: "set",
      fieldName: "Set",
      fieldType: "text",
    },

    {
      id: "actual",
      fieldName: "Actual",
      fieldType: "text",
    },

    {
      id: "resulttest",
      fieldName: "Results of Test",
      fieldType: "text",
    },

    {
      id: "remarks",
      fieldName: "Remarks",
      fieldType: "text",
    },
    {
      id: "resultsoftests",
      fieldName: "Results of tests:",
      fieldType: "label",
    },

    {
      id: "ok",
      fieldName: "OK-- Test complete equipment in satisfactory condition.",
      fieldType: "label",
    },

    {
      id: "ac",
      fieldName: "A/C-- Adjustments made/test complete-equipment in satisfactory condition.",
      fieldType: "label",
    },

    {
      id: "rc",
      fieldName: "R/C-- Repair or replacement/test complete-equipment in satisfactory condition.",
      fieldType: "label",
    },

    {
      id: "lastresult",
      fieldName: "If results are 'A/C' or 'R/C' explain the procedure in the remarks column.",
      fieldType: "label",
    },
  ],
};
