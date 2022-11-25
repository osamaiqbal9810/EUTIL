export const RelayTestsFRA234_263And236_106 = [
  {
    id: "Inspected",
    fieldName: "Inspected",
    fieldType: "checkbox",
    tag: "completionCheck",
  },
];
export const RelayAppForm = [
  {
    id: "sname",
    fieldName: "Shelf Name",
    fieldType: "text",
  },
  {
    id: "rname",
    fieldName: "Relay Name",
    fieldType: "text",
  },
  {
    id: "sno",
    fieldName: "Serial Number",
    fieldType: "number",
    numberDecimal: true,
  },
  {
    id: "test",
    fieldName: "Condition Left",
    fieldType: "radioList",
    options: ["C", "R", "V", "NT", "N"],
  },
  {
    id: "rtype",
    fieldName: "Relay Type (Drawing and/or Catalog Number)",
    fieldType: "text",
  },
  {
    id: "resis",
    fieldName: "Resistance (Ohms)",
    fieldType: "number",
    numberDecimal: true,
  },
  {
    id: "cont",
    fieldName: "Contacts",
    fieldType: "text",
  },
  {
    id: "tdate",
    fieldName: "Date Tested",
    fieldType: "text",
    default: "#VAR_NOW#",
    enabled: true,
  },

  {
    id: "drop",
    fieldName: "Neutral Dropaway",
    fieldType: "text",
  },
  {
    id: "pick",
    fieldName: "Neutral Pickup",
    fieldType: "text",
  },
  {
    id: "work",
    fieldName: "Neutral Working",
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
    fieldName: "C = Test completed, condition left in compliance.",
    fieldType: "label",
  },
  {
    id: "r",
    fieldName: "R = Replacements made (identified in associated comments), test completed, and condition left in compliance.",
    fieldType: "label",
  },

  {
    id: "v",
    fieldName: "V = Visual inspection completed, condition left in compliance.",
    fieldType: "label",
  },
  {
    id: "nt",
    fieldName: "NT = The equipment was not tested in this inspection.",
    fieldType: "label",
  },
  {
    id: "n",
    fieldName: "N = No inspection required. The given relay does not require inspection at this time.",
    fieldType: "label",
  },
];
