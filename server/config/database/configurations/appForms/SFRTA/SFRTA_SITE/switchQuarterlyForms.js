export const sfrtaSwitchcircuitControllerNormal = {
  code: "sfrtaSwitchcircuitControllerNormal",
  tenantId: "ps19",
  description: "Circuit Controller Points - NORMAL (FRA 236.103)",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: ["Switch"],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "test",
      fieldName: "Condition",
      fieldType: "radioList",
      options: ["C", "A", "R", "G", "NT", "N"],
    },
    {
      id: "com",
      fieldName: "Comments",
      fieldType: "text",
    },
    {
      id: "resultsoftests",
      fieldName: "Conditions Master Key",
      fieldType: "label",
    },

    {
      id: "c",
      fieldName: "C = Tests completed on all applicable components, no exceptions found, and condition left in compliance.",
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
  ],
};

export const sfrtaSwitchcircuitControllerReverse = {
  code: "sfrtaSwitchcircuitControllerReverse",
  tenantId: "ps19",
  description: "Circuit Controller Points - REVERSE (FRA 236.103)",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: ["Switch"],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "test",
      fieldName: "Condition",
      fieldType: "radioList",
      options: ["C", "A", "R", "G", "NT", "N"],
    },
    {
      id: "com",
      fieldName: "Comments",
      fieldType: "text",
    },
    {
      id: "resultsoftests",
      fieldName: "Conditions Master Key",
      fieldType: "label",
    },

    {
      id: "c",
      fieldName: "C = Tests completed on all applicable components, no exceptions found, and condition left in compliance.",
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
  ],
};

export const sfrtaSwitchshuntFouling = {
  code: "sfrtaSwitchshuntFouling",
  tenantId: "ps19",
  description: "Shunt Fouling - Circuit Type (FRA 236.104)",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: ["Switch"],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "test",
      fieldName: "Condition",
      fieldType: "radioList",
      options: ["C", "A", "R", "G", "NT", "N"],
    },
    {
      id: "com",
      fieldName: "Comments",
      fieldType: "text",
    },
    {
      id: "resultsoftests",
      fieldName: "Conditions Master Key",
      fieldType: "label",
    },

    {
      id: "c",
      fieldName: "C = Tests completed on all applicable components, no exceptions found, and condition left in compliance.",
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
  ],
};