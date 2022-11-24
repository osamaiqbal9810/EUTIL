export const suivimargingi335 = {
  tenantId: "ps19",
  listName: "appForms",
  code: "suivimargingi335",
  description: "Suivi margins-GI335",
  opt1: [
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
      id: "vpprin",
      fieldName: "Voie principale",
      fieldType: "label",
    },
    {
      id: "vpmarginfirst",
      fieldName: "VP Margin First Half",
      fieldType: "text",
    },
    {
      id: "vplongueurfirst",
      fieldName: "Longueur de voie First Half",
      fieldType: "text",
    },
    {
      id: "vpmarginsecond",
      fieldName: "VP Margin Second Half",
      fieldType: "text",
    },
    {
      id: "vplongueursecond",
      fieldName: "Longueur de voie Second Half",
      fieldType: "text",
    },
    {
      id: "div",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "vpemnt",
      fieldName: "Voie d'évitement",
      fieldType: "label",
    },
    {
      id: "vdmarginfirst",
      fieldName: "VE Margin First Half",
      fieldType: "text",
    },
    {
      id: "vdlongueurfirst",
      fieldName: "Longueur de voie First Half",
      fieldType: "text",
    },
    {
      id: "vdmarginsecond",
      fieldName: "VE Margin Second Half",
      fieldType: "text",
    },
    {
      id: "vdlongueursecond",
      fieldName: "Longueur de voie Second Half",
      fieldType: "text",
    },
    {
      id: "comments",
      fieldName: "Commentaire",
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
    allowedInstruction: ["GI335.pdf"],
  },
};
