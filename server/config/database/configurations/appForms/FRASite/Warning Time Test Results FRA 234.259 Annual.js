export const WarningTimeTestResultsFRA234_259Annual = [
  {
    id: "Inspected",
    fieldName: "Inspected",
    fieldType: "checkbox",
    tag: "completionCheck",
  },
  {
    id: "tblBatt",
    fieldName: "Warning Time Test Results",
    fieldType: "table",
    options: [
      {
        id: "track",
        fieldName: "Track #",
        fieldType: "text",
      },
      {
        id: "rout",
        fieldName: "Route",
        fieldType: "text",
      },
      {
        id: "dir",
        fieldName: "Direction",
        fieldType: "list",
        options: ["-", "North", "South", "East", "West"],
      },
      {
        id: "asby",
        fieldName: "Active/ Standby",
        fieldType: "radioList",
        options: ["Active", "Standby"],
      },
      {
        id: "test",
        fieldName: "Condition",
        fieldType: "radioList",
        options: ["C", "A", "R", "G", "NT", "N"],
      },
      {
        id: "ctype",
        fieldName: "Control Type",
        fieldType: "text",
      },
      {
        id: "method",
        fieldName: "Timing Method",
        fieldType: "text",
      },
      {
        id: "tpresc",
        fieldName: "Time (seconds) Presc.",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "tobs",
        fieldName: "Obs. (seconds)",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "tdate",
        fieldName: "Test Date",
        fieldType: "text",
        default: "#VAR_NOW#",
        enabled: true,
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
  },
];
