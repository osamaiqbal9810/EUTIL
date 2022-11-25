export const customForm_AppFormCustomAttrs = {
  title: "Add/Edit Form Attribute",
  id: "customForm_AppFormCustomAttrs",
  stateTitle: {
    create: "Add Form Attribute",
    edit: "Edit Form Attribute",
  },
  sections: [
    {
      id: "appFormAttrsSection",
      fields: [
        {
          id: "id", // required
          type: "input", // required
          labelValue: "Id",
          required: true,
          disabledStates: ["edit"],
        },
        {
          id: "allowedForms", // required
          type: "createableSelect", // required
          labelValue: "Allowed Forms",
          disabledStates: ["edit"],
        },
        {
          id: "value", // required
          type: "createableSelect", // required
          labelValue: "Allowed Values",
        },
      ],
    },
    {
      id: "appFormAttrsButtonsSection",
      fields: [
        {
          id: "addFormAttribute", // required
          type: "button", // required
          labelValue: "Add",
          action: "submit",
          callback: "addFormAttribute",
          position: "footer",
          hiddenStates: ["edit"],
          col: 6,
        },
        {
          id: "updateFormAttribute", // required
          type: "button", // required
          labelValue: "Update",
          action: "submit",
          callback: "updateFormAttribute",
          position: "footer",
          hiddenStates: ["create"],
          col: 6,
        },
        {
          id: "cancelFormAttrDialog", // required
          type: "button", // required
          labelValue: "Cancel",
          action: "cancel",
          position: "footer",
          col: 6,
        },
      ],
    },
  ],
};
