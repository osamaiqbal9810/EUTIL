export const gi329fb = {
  tenantId: "ps19",
  listName: "appForms",
  code: "gi329fb",
  description: "Form-329b",

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
  },
};
