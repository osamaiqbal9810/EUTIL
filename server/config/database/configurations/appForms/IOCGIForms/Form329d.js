export const gi329fd = {
  tenantId: "ps19",
  listName: "appForms",
  code: "gi329fd",
  description: "Form-329d",

  opt1: [
    {
      id: "inspected",
      fieldName: "Vous avez terminé l'inspection requise?",
      fieldType: "label",
    },
    {
      id: "technician",
      fieldName: "Technician",
      fieldType: "text",
      default: "#VAR_UNAME#",
      enabled: false,
    },
    {
      id: "datetime",
      fieldName: "Date / Time",
      fieldType: "text",
      default: "#VAR_NOW#",
      enabled: false,
    },
    {
      id: "yes",
      fieldName: "Oui",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "comment",
      fieldName: "Commentaire",
      fieldType: "text",
    },
  ],
  opt2: {
    config: [],
    allowedInstruction: ["GI329.pdf"],
    classify: "point",
    restrictAssetTypes: [
      "Diamond",
      "Switch",
      "Crossing",
      "AEI Reader",
      "Grade Crossing Warning",
      "High Water Detector",
      "Hotbox Detector",
      "Turnout",
      "Turnout 1",
      "Turnout 2",
      "Turnout 3",
      "Turnout 4",
    ],
  },
};
