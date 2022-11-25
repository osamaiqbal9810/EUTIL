export const monthlyDetailedSwitchFormONR = {
  listName: "appForms",
  tenantId: "ps19",
  code: "monthlydetailedformONR",
  description: "Monthly Mainline Turnout Inspection Form",
  opt1: [
    {
      id: "inspected",
      fieldName: "Inspection Complete",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "div",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "div1",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "meas",
      fieldName: "Measurements",
      fieldType: "label",
    },
    {
      id: "div2",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "div3",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "gage",
      fieldName: "Gauge",
      fieldType: "label",
    },
    {
      id: "div4",
      fieldName: "",
      fieldType: "divider",
    },

    {
      id: "mmax",
      fieldName: "Main Line Gauge Max.",
      fieldType: "text",
    },

    {
      id: "mmin",
      fieldName: "Main Line Gauge Min.",
      fieldType: "text",
    },

    {
      id: "smax",
      fieldName: "Siding Gauge Max.",
      fieldType: "text",
    },

    {
      id: "smin",
      fieldName: "Siding Gauge Min.",
      fieldType: "text",
    },
    {
      id: "div5",
      fieldName: "",
      fieldType: "divider",
    },

    {
      id: "gcheck",
      fieldName: "Guard Check",
      fieldType: "label",
    },
    {
      id: "div6",
      fieldName: "",
      fieldType: "divider",
    },

    {
      id: "mline",
      fieldName: "Main Line",
      fieldType: "text",
    },

    {
      id: "cside",
      fieldName: "Siding",
      fieldType: "text",
    },
    {
      id: "div7",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "gface",
      fieldName: "Guard Face",
      fieldType: "label",
    },
    {
      id: "div8",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "fline",
      fieldName: "Mainline",
      fieldType: "text",
    },

    {
      id: "fside",
      fieldName: "Siding",
      fieldType: "text",
    },
    {
      id: "div9",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "div10",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "cond",
      fieldName: "Conditions",
      fieldType: "label",
    },
    {
      id: "div11",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "div12",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "value",
      fieldName: "√-Within standards            X-Defective",
      fieldType: "label",
    },
    {
      id: "div13",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "stand",
      fieldName: "Switch Stand",
      fieldType: "radioList",
      options: ["Within standards", "Defective"],
    },
    {
      id: "point",
      fieldName: "Switch Points",
      fieldType: "radioList",
      options: ["Within standards", "Defective"],
    },
    {
      id: "srail",
      fieldName: "Stock Rails",
      fieldType: "radioList",
      options: ["Within standards", "Defective"],
    },
    {
      id: "rrail",
      fieldName: "Running Rails",
      fieldType: "radioList",
      options: ["Within standards", "Defective"],
    },
    {
      id: "frog",
      fieldName: "Frog",
      fieldType: "radioList",
      options: ["Within standards", "Defective"],
    },
    {
      id: "surf",
      fieldName: "Surface",
      fieldType: "radioList",
      options: ["Within standards", "Defective"],
    },
    {
      id: "alig",
      fieldName: "Alignment",
      fieldType: "radioList",
      options: ["Within standards", "Defective"],
    },
    {
      id: "ocond",
      fieldName: "Other conditions",
      fieldType: "radioList",
      options: ["Within standards", "Defective"],
    },
    {
      id: "sp",
      fieldName: "",
      fieldType: "label",
    },
  ],
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: ["Switch", "Turnout 2", "Turnout 3", "Turnout 4"],
  },
};
