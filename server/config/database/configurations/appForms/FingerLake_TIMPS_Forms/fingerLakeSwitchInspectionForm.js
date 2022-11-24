export const frmSwitchInspection = {
  tenantId: "ps19",
  listName: "appForms",
  code: "frmSwitchInspection",
  description: "Detailed Switch Inspection",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: ["Switch"],
  },
  opt1: [
    {
      id: "inspected",
      fieldName: "Inspection Complete",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "operateswitch",
      fieldName: "Operate Switch:",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "gagepoints",
      fieldName: "Gage at Points:",
      fieldType: "text",
    },
    {
      id: "guardcheck",
      fieldName: "Guard Check Gage - Straight:",
      fieldType: "text",
    },
    {
      id: "guardface",
      fieldName: "Guard Face Gage - Straight:",
      fieldType: "text",
    },
    {
      id: "guardcheckout",
      fieldName: "Guard Check Gage - Turn Out:",
      fieldType: "text",
    },
    {
      id: "guardfaceout",
      fieldName: "Guard Face Gage - Turn Out:",
      fieldType: "text",
    },
  ],
};
