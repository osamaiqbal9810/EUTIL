export const sfrtaBridgeLockingForm = {
  code: "sfrtaBridgeLockingForm",
  tenantId: "ps19",
  description: "Bridge Locking (FRA 236.387) Annual",
  listName: "appForms",
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "bloc",
      fieldName: "Bridge Locking (FRA 236.387) Annual",
      fieldType: "table",
      options: [
        {
          id: "desc",
          fieldName: "Circuit Nomenclature",
          fieldType: "text",
        },
        {
          id: "test",
          fieldName: "Condition Left",
          fieldType: "radioList",
          options: ["C", "A", "R", "B", "G", "NT", "N", "NI", "CO", "NC", "P", "F"],
        },
        {
          id: "resultsoftests",
          fieldName: "Conditions Master Key",
          fieldType: "label",
        },

        {
          id: "c",
          fieldName: "C = Test completed, no exceptions found, and condition left in compliance.",
          fieldType: "label",
        },

        {
          id: "a",
          fieldName: "A = Adjustments made (identified in associated comments), test completed, and condition left in compliance.",
          fieldType: "label",
        },

        {
          id: "r",
          fieldName:
            "R = Repairs and/or Replacements made (identified in associated comments), test completed, and condition left in compliance.",
          fieldType: "label",
        },
        {
          id: "b",
          fieldName: "B = Baseline data matches that recorded during the most recent Baseline test, so full test not required.",
          fieldType: "label",
        },

        {
          id: "g",
          fieldName: "G = Governed by Special Instruction.",
          fieldType: "label",
        },
        {
          id: "nt",
          fieldName: "NT = The equipment was not tested in this inspection.",
          fieldType: "label",
        },
        {
          id: "n",
          fieldName: "N = Test Not Applicable.",
          fieldType: "label",
        },
        {
          id: "ni",
          fieldName: "NI = No Inspection Required.",
          fieldType: "label",
        },
        {
          id: "co",
          fieldName: "CO = Compliant",
          fieldType: "label",
        },
        {
          id: "nc",
          fieldName: "NC = Not compliant",
          fieldType: "label",
        },
        {
          id: "p",
          fieldName: "P = Pass",
          fieldType: "label",
        },
        {
          id: "f",
          fieldName: "F = Fail",
          fieldType: "label",
        },
      ],
    },
  ],
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: [],
  },
};
