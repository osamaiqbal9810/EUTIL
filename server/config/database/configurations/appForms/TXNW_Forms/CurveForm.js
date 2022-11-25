export const curveTestForm = {
  tenantId: "ps19",
  listName: "appForms",
  code: "curveTestForm",
  description: "Inspection of Curves",
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
      id: "tx-begMP",
      fieldName: "Beg MP",
      fieldType: "text",
    },
    {
      id: "tx-endMP",
      fieldName: "End MP",
      fieldType: "text",
    },
    {
      id: "tx-over",
      fieldName: "Overall Tie Condition",
      fieldType: "text",
    },
    {
      id: "tx-sup",
      fieldName: "Super Elevation",
      fieldType: "text",
    },
    {
      id: "tx-side",
      fieldName: "Gage Side Curve Wear",
      fieldType: "text",
    },
    {
      id: "tx-head",
      fieldName: "Head Loss",
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
      id: "tx-rem",
      fieldName: "Remarks",
      fieldType: "text",
    },
  ],
};
