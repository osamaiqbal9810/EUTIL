export const commonFields = {
  maintenanceType: {
    element: "select",
    value: "normal",
    label: true,
    labelText: "Maintenance Type",
    containerConfig: {},
    config: {
      name: "maintenanceType",
      type: "text",
      placeholder: this.labelText,
      options: [],
    },
    validation: {
      required: false,
    },
    valid: false,
    touched: false,
    validationMessage: "",
  },
  // startMP: {
  //     element: 'input',
  //     value: '',
  //     label: true,
  //     labelText: 'Start MP',
  //     containerConfig: {},
  //     config: {
  //         name: 'startMP',
  //         type: 'number',
  //         placeholder: this.labelText
  //     },
  //     validation: {
  //         required: true
  //     },
  //     valid: false,
  //     touched: false,
  //     validationMessage: ''
  // },
  // endMP: {
  //     element: 'input',
  //     value: '',
  //     label: true,
  //     labelText: 'End MP',
  //     containerConfig: {},
  //     config: {
  //         name: 'endMP',
  //         type: 'number',
  //         placeholder: this.labelText
  //     },
  //     validation: {
  //         required: true
  //     },
  //     valid: false,
  //     touched: false,
  //     validationMessage: ''
  // },
};
