export const fieldTemplate = {
  id: "myUniqueFieldId", // required: this is the id of the field which must be unique within this group
  element: {
    type: "input", // input, textarea        // by default its input but can be defined by the user
    disabled: false, // false/true
    hide: false,
    settings: {
      input: {
        subType: "text", // (applicable only for input field). types: text, email, password, number, etc.
      },
      button: {
        action: "simple", // types of actions for button field. types: simple,
        resetFieldIds: null,
        callback: null, // button callback
        showFieldIds: null,
        hideFieldIds: null,
      },
      options: [], // (applicable only for select field)
      select: {
        showFieldsOnCertainValue: [],
        updatedSectionFieldsOnCertainValue: [],
      },
      file: {
        accept: undefined, // should be a string with comma separated file formats
      },
      date: {
        format: "yyyy-MM-dd", // Date Format (todo: do we also need this from backend or from some configs)
        showYearMonthControls: false,
        minDate: new Date(1970, 0), // default start Date to shown in date picker
        maxDate: new Date(new Date().getFullYear() + 50, 11), // default end Date to be shown in date picker
        futureOnly: false,
        pastOnly: false,
        showTimeInput: false,
      },
      dateTime: {
        format: "yyyy-MM-dd hh:mm a", // Date Format (todo: do we also need this from backend or from some configs)
        showYearMonthControls: false,
        minDate: new Date(1970, 0), // default start Date to shown in date picker
        maxDate: new Date(new Date().getFullYear() + 50, 11), // default end Date to be shown in date picker
        futureOnly: false,
        pastOnly: false,
      },
      time: {
        format: "hh:mm a", // Time Format (todo: do we also need this from backend or from some configs)
        minTime: "00:00:00" /*optional: start time*/,
        maxTime: "23:59:59" /*optional: end time*/,
      },
    },
    uiConfig: {
      container: {}, // todo: to be used for comtainerization and ui grouping
      position: "body", // todo: to be used for position of particular field
      col: 12,
    },
    value: "", // default value of the element
    label: {
      visible: true, // display/hide the label
      value: "Default Label", // label to be displayed for this element
      valueExtension: "",
    },
    placeholder: {
      visible: true, // display/hide the placeholder
      value: "Default Placeholder", // placeholder to be displayed
      valueExtension: "",
    },
    touched: false,
    valid: true,
    validationMessage: null,
    // optional: provide other validations
    validations: [],
  },
};
