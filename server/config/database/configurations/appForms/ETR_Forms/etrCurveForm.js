export const curveTestFormETR = {
  tenantId: "ps19",
  listName: "appForms",
  code: "curveTestFormETR",
  description: "Curve Inspection",
  opt2: { config: [], allowedInstruction: [], restrictAssetTypes: [], allowedAssetTypes: ["Curve"] },
  opt1: [
    {
      id: "inspected",
      fieldName: "Inspected",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "t-ind",
      fieldName: "Indicate Conditions Found At Time Of Inspection",
      fieldType: "label",
    },
    {
      id: "div",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "tx-over",
      fieldName: "Overall Tie Condition",
      fieldType: "text",
    },

    {
      id: "tx-side",
      fieldName: "Gage Side Curve Wear",
      fieldType: "text",
    },

    {
      id: "tx-plate",
      fieldName: "Differential Plate Cutting",
      fieldType: "text",
    },
    {
      id: "tx-gage",
      fieldName: "Gage",
      fieldType: "text",
    },
    {
      id: "tx-cgrease",
      fieldName: "Curved Grease",
      fieldType: "checkbox",
    },
    {
      id: "tx-rem",
      fieldName: "Remarks",
      fieldType: "text",
    },
  ],
};
