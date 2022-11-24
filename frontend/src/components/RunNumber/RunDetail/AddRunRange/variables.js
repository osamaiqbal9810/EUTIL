export const formFieldsTemplate = {
  runDescription: {
    element: "input",
    value: "",
    label: true,
    labelText: "Description",
    containerConfig: {},
    config: {
      name: "runDescription",
      type: "text",
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: "",
  },
  runId: {
    element: "input",
    value: "",
    label: true,
    labelText: "ID",
    containerConfig: {},
    config: {
      name: "runId",
      type: "text",
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: "",
  },
  mpStart: {
    element: "input",
    value: 0,
    label: true,
    labelText: "Milepost Start",
    containerConfig: {},
    config: {
      name: "mpStart",
      type: "number",
      step: 0.1,
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  mpEnd: {
    element: "input",
    value: 0,
    label: true,
    labelText: "Milepost End",
    containerConfig: {},
    config: {
      name: "mpEnd",
      type: "number",
      step: 0.1,
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
};
