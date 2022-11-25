export const commonFormFields = {
  assetTypeClassify: {
    element: "select",
    value: "",
    label: true,
    labelText: "Asset Type Classify",
    containerConfig: {},
    config: {
      name: "assetTypeClassify",
      options: [
        { val: "", text: "Select Asset Type Classify" },
        { val: "linear", text: "linear" },
        { val: "point", text: "point" },
      ],
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: "",
  },
  assetType: {
    element: "input",
    value: "",
    label: true,
    labelText: "Asset Type",
    containerConfig: {},
    config: {
      name: "assetType",
      type: "text",
      placeholder: "",
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: "",
  },
  inspectionInstructions: {
    element: "textarea",
    value: "",
    label: true,
    labelText: "Inspection Instructions",
    containerConfig: {},
    config: {
      name: "inspectionInstructions",
      type: "text",
      style: { width: "100%" },
    },
    validation: {
      required: false,
    },
    valid: false,
    touched: false,
    validationMessage: "",
  },
  inspectionForms: {
    element: "textarea",
    value: "",
    label: true,
    labelText: "Inspection Forms",
    containerConfig: {},
    config: {
      name: "inspectionForms",
      type: "text",
      style: { width: "100%" },
    },
    validation: {
      required: false,
    },
    valid: false,
    touched: false,
    validationMessage: "",
  },
  inspectable: {
    element: "checkbox",
    value: false,
    label: true,
    labelText: "Inspectable",
    containerConfig: { col: 12, className: "custom-checkbox" },
    config: {
      name: "inspectable",
      type: "checkbox",
    },
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  location: {
    element: "checkbox",
    value: false,
    label: true,
    labelText: "Location",
    containerConfig: { col: 4, className: "custom-checkbox" },
    config: {
      name: "location",
      type: "checkbox",
    },
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  plannable: {
    element: "checkbox",
    value: false,
    label: true,
    labelText: "Plannable",
    containerConfig: { col: 4, className: "custom-checkbox" },
    config: {
      name: "plannable",
      type: "checkbox",
    },
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
};

export const POPUP_TYPES_TO_SHOW = {
  MAIN_FORM: "main-form",
  IMAGE_GALLERY: "image-gallery",
  LINE_CANVAS: "line-canvas",
};
