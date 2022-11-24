export const formFicheB12 = {
  tenantId: "ps19",
  listName: "appForms",
  code: "formFicheB12",
  description: "Form-305-B12",

  opt1: [
    {
      id: "splelement",
      fieldName: "Type: SPL 165/10 éléments",
      fieldType: "label",
    },
    {
      id: "technician",
      fieldName: "Technicien",
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
      id: "vaccharge",
      fieldName: "V AC chargeur",
      fieldType: "text",
    },
    {
      id: "dateinstallation",
      fieldName: "Date installation:",
      fieldType: "date",
    },
    {
      id: "idcccharge",
      fieldName: "I DC Chargeur",
      fieldType: "text",
    },
    {
      id: "vdcbatterie",
      fieldName: "V DC batterie",
      fieldType: "label",
    },
    {
      id: "aveccharge",
      fieldName: "Avec chargeur",
      fieldType: "text",
    },
    {
      id: "sanscharge",
      fieldName: "Sans chargeur",
      fieldType: "text",
    },
    {
      id: "b12",
      fieldName: "B 12",
      fieldType: "label",
    },
    {
      id: "tensionperelement",
      fieldName: "Tension per élément (Sans chargeur)",
      fieldType: "label",
    },
    {
      id: "tension1",
      fieldName: "1",
      fieldType: "number",
      numberDecimal: true,
    },
    {
      id: "tension2",
      fieldName: "2",
      fieldType: "number",
      numberDecimal: true,
    },
    {
      id: "tension3",
      fieldName: "3",
      fieldType: "number",
      numberDecimal: true,
    },
    {
      id: "tension4",
      fieldName: "4",
      fieldType: "number",
      numberDecimal: true,
    },
    {
      id: "tension5",
      fieldName: "5",
      fieldType: "number",
      numberDecimal: true,
    },
    {
      id: "tension6",
      fieldName: "6",
      fieldType: "number",
      numberDecimal: true,
    },
    {
      id: "tension7",
      fieldName: "7",
      fieldType: "number",
      numberDecimal: true,
    },
    {
      id: "tension8",
      fieldName: "8",
      fieldType: "number",
      numberDecimal: true,
    },
    {
      id: "tension9",
      fieldName: "9",
      fieldType: "number",
      numberDecimal: true,
    },
    {
      id: "tension10",
      fieldName: "10",
      fieldType: "number",
      numberDecimal: true,
    },
    {
      id: "comments",
      fieldName: "Commentaires (ajout de l'eau distillée, etc.)",
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
    allowedInstruction: ["GI305.pdf"],
  },
};
