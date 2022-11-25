import { getmodifiedOpts } from "../appFormsUtils";

export const crossingInspectionOpts = [
  // {
  //   id: "t-relay",
  //   fieldName: "Highway Crossing Maintenance, Inspection and Test",
  //   fieldType: "label",
  // },
  // {
  //   id: "t-fra",
  //   fieldName: "FRA Rules 234.XXX",
  //   fieldType: "label",
  // },
  {
    id: "Inspected",
    fieldName: "Inspected",
    fieldType: "checkbox",
    tag: "completionCheck",
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
    fieldName: "Date",
    fieldType: "text",
    default: "#VAR_NOW#",
    enabled: false,
  },
  {
    id: "tx-result",
    fieldName: "Results",
    fieldType: "radioList",
    options: ["-", "OK", "A/C", "R/C"],
  },

  {
    id: "tx-remark",
    fieldName: "Remarks",
    fieldType: "text",
  },

  {
    id: "t-res",
    fieldName: "Results of tests:",
    fieldType: "label",
  },

  {
    id: "t-ok",
    fieldName: "OK-- Test complete equipment in satisfactory condition.",
    fieldType: "label",
  },

  {
    id: "t-ac",
    fieldName: "A/C-- Adjustments made/test complete-equipment in satisfactory condition.",
    fieldType: "label",
  },

  {
    id: "t-rc",
    fieldName: "R/C-- Repair or replacement/test complete-equipment in satisfactory condition.",
    fieldType: "label",
  },

  {
    id: "t-result1",
    fieldName: "If results are 'A/C' or 'R/C' explain the procedure in the remarks column.",
    fieldType: "label",
  },
];

export const fra234_249_B12 = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.249B12_M",
  description: "234.249 B12 Grounds (Monthly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.249 B12 ", fieldType: "label" }),
  opt2: { config: [] },
};
export const fra234_249_B = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.249B_M",
  description: "234.249 B Grounds (Monthly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.249 B", fieldType: "label" }),
  opt2: { config: [] },
};
export const fra234_251_B12 = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.251B12_M",
  description: "234.251 B12 Standby power (Monthly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.251 B12", fieldType: "label" }),
  opt2: { config: [] },
};
export const fra234_251_B = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.251B_M",
  description: "234.251 B Standby power (Monthly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.251 B", fieldType: "label" }),
  opt2: { config: [] },
};
export const fra234_253C = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.253C_M",
  description: "234.253C All lamp unit Visibility (Monthly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.253C", fieldType: "label" }),
  opt2: { config: [] },
};
export const fra234_257A = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.257A_M",
  description: "234.257A System Operation (Monthly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.257A", fieldType: "label" }),
  opt2: { config: [] },
};
export const fra234_257B = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.257B_M",
  description: "234.257B Bell (Monthly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.257B", fieldType: "label" }),
  opt2: { config: [] },
};
export const fra234_271 = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.271_Q",
  description: "234.271 Insulated rail joints, bond wires, and track connections (Quarterly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.271", fieldType: "label" }),
  opt2: { config: [] },
};
export const fra234_253A = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.253A_Y",
  description: "234.253A All Alignment & Flash Rate (Yearly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.253A", fieldType: "label" }),
  opt2: { config: [] },
};
export const fra234_253B = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.253B_Y",
  description: "234.253B All Lamp Voltage (Yearly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.253B", fieldType: "label" }),
  opt2: { config: [] },
};
export const fra234_259 = {
  tenantId: "ps19",
  listName: "appForms",
  code: "form234.259_Y",
  description: "234.259 Warning time (Yearly)",
  opt1: getmodifiedOpts({ id: "t-fra", fieldName: "FRA Rule 234.259", fieldType: "label" }),
  opt2: { config: [] },
};
