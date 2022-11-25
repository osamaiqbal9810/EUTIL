export const appFormFieldtypes = [
  { type: "text", name: "Text Field" },
  { type: "checkbox", name: "Check Box" },
  { type: "date", name: "Date" },
  { type: "radioList", name: "Radio List" },
  { type: "divider", name: "Divider" },
  { type: "label", name: "Label" },
  { type: "number", name: "Number" },
  { type: "table", name: "Table" },
  { type: "list", name: "List" },
];

export const appFormFieldTemplate = {
  text: { id: "", fieldName: "", fieldType: "text" },
  checkbox: { id: "", fieldName: "", fieldType: "checkbox", tag: "" },
  date: { id: "", fieldName: "", fieldType: "date", enabled: true },
  radioList: { id: "", fieldName: "", fieldType: "radioList", options: [] },
  divider: { id: "" },
  label: { id: "", fieldName: "", fieldType: "label" },
  number: { id: "", fieldName: "", fieldType: "number" },
  table: { id: "", fieldName: "", fieldType: "table" },
  list: { id: "", fieldName: "", fieldType: "list", options: [] },
};

export const appFormTemplate = {
  code: "",
  description: "",
  listName: "appForms",
  opt2: { config: [], classify: "", allowedInstruction: [], restrictAssetTypes: [], allowedAssetTypes: [] },
  opt1: [],
};
