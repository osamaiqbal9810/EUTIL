export const genericFormEntry = {
    tenantId: "ps19",
    listName: "appForms",
    code: "GReplacementForm",
    description: "Equipment Replacement Form",
    opt2: {
      target: "equipment",
      allowedEquipmentTypes: [],
      type: "replacement",
    },
    opt1: [
      {
        id: "Serial Number",
        fieldName: "Serial Number",
        fieldType: "text",
        numberDecimal: true,
      },
      {
        id: "Part Number",
        fieldName: "Part Number",
        fieldType: "text",
      },
    ],
  };
  