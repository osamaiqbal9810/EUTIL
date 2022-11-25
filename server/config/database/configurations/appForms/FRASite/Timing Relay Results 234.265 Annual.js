export const TimingRelayResultsFRA234_265Annual = [
  {
    id: "Inspected",
    fieldName: "Inspected",
    fieldType: "checkbox",
    tag: "completionCheck",
  },
  {
    id: "tblBatt",
    fieldName: "Timing Relay & Devices Test Results",
    fieldType: "table",
    options: [
      {
        id: "desc",
        fieldName: "Timer Nomenclature",
        fieldType: "text",
      },
      {
        id: "test",
        fieldName: "Condition",
        fieldType: "radioList",
        options: ["C", "A", "R", "G", "NT", "N"],
      },
      {
        id: "dpt",
        fieldName: "Design / Plan Time",
        fieldType: "text",
      },
      {
        id: "met",
        fieldName: "Measured Time",
        fieldType: "text",
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
