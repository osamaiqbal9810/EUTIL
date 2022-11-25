export const InsulationTestsFRA234_267And236_108 = [
  {
    id: "Inspected",
    fieldName: "Inspected",
    fieldType: "checkbox",
    tag: "completionCheck",
  },
  {
    id: "tblBatt",
    fieldName: "Insulation Tests",
    fieldType: "table",
    options: [
      {
        id: "cable",
        fieldName: "Cable Type",
        fieldType: "text",
      },
      {
        id: "tobs",
        fieldName: "Conductors",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "wsiz",
        fieldName: "Wire Size",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "frun",
        fieldName: "Run From",
        fieldType: "text",
      },
      {
        id: "trun",
        fieldName: "Run To",
        fieldType: "text",
      },
      {
        id: "test",
        fieldName: "Condition",
        fieldType: "radioList",
        options: ["C", "A", "R", "NT", "N"],
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
        fieldName:
          "C = Test completed, condition left in compliance. Indicates that all wires in trunking and cable measured 500K Ohms and above.",
        fieldType: "label",
      },

      {
        id: "a",
        fieldName:
          "A = Annual test required; insulation resistance between 500K and 200K Ohms. Prompt action shall be taken to remedy condition.",
        fieldType: "label",
      },

      {
        id: "r",
        fieldName:
          "R = Repairs and/or Replacements made (identifed in associated comments), test completed, and condition left in compliance.",
        fieldType: "label",
      },
      {
        id: "nt",
        fieldName: "NT = The equipment was not tested in this inspection.",
        fieldType: "label",
      },
      {
        id: "n",
        fieldName: "N = No inspection required. This is an annual re-inspection of a different conductor.",
        fieldType: "label",
      },
    ],
  },
];
