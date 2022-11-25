import { MILEPOST_VARS } from "../../../utils/globals";
export const requiredValidationMessage = "This field is required";

export const commonFields = {
  lineId: {
    element: "select",
    value: "",
    label: true,
    labelText: "Location",
    containerConfig: {},
    config: {
      name: "lineId",
      type: "text",
      placeholder: "",
      disabled: false,
      options: [],
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
    hide:false
  },
  assetType: {
    element: "select",
    value: "",
    label: true,
    labelText: "Asset Type",
    containerConfig: {},
    config: {
      name: "assetType",
      type: "text",
      placeholder: "Location",
      disabled: false,
      options: [],
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  unitId: {
    element: "input",
    value: "",
    label: true,
    labelText: "Asset Name",
    containerConfig: {},
    config: {
      name: "unitId",
      type: "text",
      placeholder: "Asset Name",
      options: [],
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: requiredValidationMessage,
  },
  description: {
    element: "textarea",
    value: "",
    label: true,
    labelText: "Description",
    containerConfig: {},
    config: {
      name: "description",
      type: "text",
      placeholder: "Enter Description",
      style: { width: "100%" },
    },
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
};

export const locationFields = {
  latStart: {
    element: "input",
    value: "",
    label: true,
    labelText: "Latitude :",
    containerConfig: {
      col: 6,
    },
    config: {
      name: "latStart",
      type: "text",
      placeholder: "Start",
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: requiredValidationMessage,
  },
  latEnd: {
    element: "input",
    value: "",
    label: false,
    labelText: "Location Latitude :",
    containerConfig: {
      col: 6,
    },
    config: {
      name: "latEnd",
      type: "text",
      placeholder: "End",
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: requiredValidationMessage,
  },
  lonStart: {
    element: "input",
    value: "",
    label: true,
    labelText: "Longitude :",
    containerConfig: {
      col: 6,
    },
    config: {
      name: "lonStart",
      type: "text",
      placeholder: "Start",
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: requiredValidationMessage,
  },
  lonEnd: {
    element: "input",
    value: "",
    label: false,
    labelText: "Location Longitude :",
    containerConfig: {
      col: 6,
    },
    config: {
      name: "lonEnd",
      type: "text",
      placeholder: "End",
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: requiredValidationMessage,
  },
};

// export const locationGPSFields = {
//     start_lat: {
//         element: 'input',
//         value: '',
//         label: true,
//         labelText: 'GPS Latitude ',
//         containerConfig: {
//             col: 6
//         },
//         config: {
//             name: 'start_lat',
//             type: 'number',
//             step: 0.1,
//             placeholder: 'Start'
//         },
//         validation: {
//             required: true
//         },
//         valid: false,
//         touched: false,
//         validationMessage: ''
//     },
//     end_lat: {
//         element: 'input',
//         value: '',
//         label: false,
//         labelText: 'Location Latitude ',
//         containerConfig: {
//             col: 6
//         },
//         config: {
//             name: 'end_lat',
//             type: 'number',
//             step: 0.1,
//             placeholder: 'End'
//         },
//         validation: {
//             required: true
//         },
//         valid: false,
//         touched: false,
//         validationMessage: ''
//     },
//     start_lon: {
//         element: 'input',
//         value: '',
//         label: true,
//         labelText: 'GPS Longitude ',
//         containerConfig: {
//             col: 6
//         },
//         config: {
//             name: 'start_lon',
//             type: 'number',
//             step: 0.1,
//             placeholder: 'Start'
//         },
//         validation: {
//             required: true
//         },
//         valid: false,
//         touched: false,
//         validationMessage: ''
//     },
//     end_lon: {
//         element: 'input',
//         value: '',
//         label: false,
//         labelText: 'Location Latitude ',
//         containerConfig: {
//             col: 6
//         },
//         config: {
//             name: 'end_lon',
//             type: 'number',
//             step: 0.1,
//             placeholder: 'End'
//         },
//         validation: {
//             required: true
//         },
//         valid: false,
//         touched: false,
//         validationMessage: ''
//     }
// };

export const locationMilepostFields = {
  start: {
    element: "input",
    value: 0,
    label: true,
    labelText: "Latitude",
    containerConfig: {
      col: 12,
    },
    config: {
      name: "start",
      type: "text",
      step: "0.01",
      placeholder: "Start",
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  end: {
    element: "input",
    value: 0,
    label: true,
    labelText: "Logitude",
    containerConfig: {
      col: 12,
    },
    config: {
      name: "end",
      type: "text",
      step: "0.01",
      placeholder: "End",
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
};

export const LOCATION_TYPES = [
  // {
  //     name: 'GPS',
  //     disabled: false,
  //     model: locationGPSFields,
  //     modelName: 'locationGPSFields'
  // },
  {
    name: "Milepost",
    disabled: false,
    model: locationMilepostFields,
    modelName: "locationMilepostFields",
  },
];

export const attributesFields = {
  geoJsonCord: {
    element: "file",
    value: "",
    label: true,
    labelText: "Geo-JsonCord",
    containerConfig: {
      col: 12,
    },
    config: {
      name: "GeoJsonCord",
      type: "file",
      placeholder: "",
    },
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
};

export const dynamicFields = {
  railOrientation: {
    element: 'select',
    value: '',
    label: true,
    labelText: 'Track Orientation',
    config: {
      options: [{ text: 'Select', val: '' }, { text: 'North/South', val: 'EW' }, { text: 'East/West', val: 'NS' }]
    }
  }
};

export const POPUP_TYPES_TO_SHOW = {
  MAIN_FORM: "main-form",
  IMAGE_GALLERY: "image-gallery",
  LINE_CANVAS: "line-canvas",
};

export const LINE_OBJ_TEMPLATE = {
  tooltipText: "New Line",
  objectId: "newLine",
  object: {
    stroke: "red",
    strokeWidth: 5,
    tension: 0,
    points: [],
  },
};
