export const formGI303 = {
  tenantId: "ps19",
  listName: "appForms",
  code: "formGI303",
  description: "Form-303",
  opt1: [
    {
      id: "fiche",
      fieldName: "FICHE MAINTENANCE ACCUMULATEURS BATTERIES SAFT SPL",
      fieldType: "label",
    },
    {
      id: "div",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "gi",
      fieldName: "GI-303 Recherche de defaut à la terre",
      fieldType: "label",
    },
    {
      id: "div1",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "name",
      fieldName: "Nom du technicien ",
      fieldType: "text",
      default: "#VAR_UNAME#",
      enabled: false,
    },
    {
      id: "date",
      fieldName: "Date",
      fieldType: "text",
      default: "#VAR_NOW#",
      enabled: false,
    },
    {
      id: "pre",
      fieldName: "Présence d’un défaut à la terre?",
      fieldType: "radioList",
      options: ["Oui", "Non"],
    },
    {
      id: "sour",
      fieldName: "Source de la faute à la terre",
      fieldType: "text",
    },
    {
      id: "inspected",
      fieldName: "Vous avez terminé l'inspection requise?",
      fieldType: "label",
    },
    {
      id: "yes",
      fieldName: "Oui",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
  ],
  opt2: {
    config: [],
    allowedInstruction: ["GI303.pdf"],
  },
};
