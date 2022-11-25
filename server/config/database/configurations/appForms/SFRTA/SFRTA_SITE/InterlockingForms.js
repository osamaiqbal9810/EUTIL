export const sfrtaMechanical = {
  code: "sfrtaMechanical236_376",
  tenantId: "ps19",
  description: "Locking Test Mechanical (FRA 236.376)",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: [],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "bloc",
      fieldName: "Mechanical (FRA 236.376)",
      fieldType: "table",
      options: [
        {
          id: "desc",
          fieldName: "Route Nomenclature",
          fieldType: "text",
        },
        {
          id: "date",
          fieldName: "Date Tested",
          fieldType: "date",
          default: "#VAR_NOW#",
          enabled: false,
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
};

export const sfrtaApproach = {
  code: "sfrtaApproach236_377",
  tenantId: "ps19",
  description: "Locking Test Approach (FRA 236.377)",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: [],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "bloc",
      fieldName: "Approach (FRA 236.377)",
      fieldType: "table",
      options: [
        {
          id: "desc",
          fieldName: "Route Nomenclature",
          fieldType: "text",
        },
        {
          id: "date",
          fieldName: "Date Tested",
          fieldType: "date",
          default: "#VAR_NOW#",
          enabled: false,
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
};

export const sfrtaTime = {
  code: "sfrtaTime236_378",
  tenantId: "ps19",
  description: "Locking Test Time (FRA 236.378)",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: [],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "bloc",
      fieldName: "Time (FRA 236.378)",
      fieldType: "table",
      options: [
        {
          id: "desc",
          fieldName: "Route Nomenclature",
          fieldType: "text",
        },
        {
          id: "date",
          fieldName: "Date Tested",
          fieldType: "date",
          default: "#VAR_NOW#",
          enabled: false,
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
};
export const sfrtaRoute = {
  code: "sfrtaRoute236_379",
  tenantId: "ps19",
  description: "Locking Test Route (FRA 236.379)",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: [],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "bloc",
      fieldName: "Route (FRA 236.379)",
      fieldType: "table",
      options: [
        {
          id: "desc",
          fieldName: "Route Nomenclature",
          fieldType: "text",
        },
        {
          id: "date",
          fieldName: "Date Tested",
          fieldType: "date",
          default: "#VAR_NOW#",
          enabled: false,
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
};
export const sfrtaIndication = {
  code: "sfrtaIndication236_380",
  tenantId: "ps19",
  description: "Locking Test Indication (FRA 236.380)",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: [],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "bloc",
      fieldName: "Indication (FRA 236.380)",
      fieldType: "table",
      options: [
        {
          id: "desc",
          fieldName: "Route Nomenclature",
          fieldType: "text",
        },
        {
          id: "date",
          fieldName: "Date Tested",
          fieldType: "date",
          default: "#VAR_NOW#",
          enabled: false,
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
};
export const sfrtaTraffic = {
  code: "sfrtaTraffic236_381",
  tenantId: "ps19",
  description: "Locking Test Traffic (FRA 236.381)",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: [],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "bloc",
      fieldName: "Traffic (FRA 236.381)",
      fieldType: "table",
      options: [
        {
          id: "desc",
          fieldName: "Route Nomenclature",
          fieldType: "text",
        },
        {
          id: "date",
          fieldName: "Date Tested",
          fieldType: "date",
          default: "#VAR_NOW#",
          enabled: false,
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
};
