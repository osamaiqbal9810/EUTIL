import {getTimeZones} from "./timeZones";

export const lineAddFields = {
    subdivision: {
        element: 'select',
        value: '',
        label: true,
        labelText: 'Subdivision :',
        containerConfig: {},
        config: {
            name: 'subdivision',
            options: []
        },
        validation: {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    assetType: {
        element: 'select',
        value: 'line',
        label: true,
        labelText: 'Asset Type :',
        containerConfig: {},
        config: {
            name: 'assetType',
            type: 'text',
            placeholder: 'Asset Type',
            disabled: true,
            options: []
        },
        validation: {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    unitId: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Asset Id :',
        containerConfig: {},
        config: {
            name: 'unitId',
            type: 'text',
            placeholder: 'Asset Id',
            options: []
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    description: {
        element: 'textarea',
        value: '',
        label: true,
        labelText: 'Description :',
        containerConfig: {},
        config: {
            name: 'description',
            type: 'text',
            placeholder: 'Enter Description',
            style: {width: '100%'}
        },
        validation: {
            required: false
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    timeZone: {
        element: 'select',
        value: 'America/Phoenix',
        label: true,
        labelText: 'Time Zone :',
        containerConfig: {},
        config: {
            name: 'timeZone',
            options: getTimeZones()
        },
        validation: {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
};

export const locationFields = {
    latStart: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Latitude :',
        containerConfig: {
            col: 6
        },
        config: {
            name: 'latStart',
            type: 'text',
            placeholder: 'Start'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    latEnd: {
        element: 'input',
        value: '',
        label: false,
        labelText: 'Location Latitude :',
        containerConfig: {
            col: 6
        },
        config: {
            name: 'latEnd',
            type: 'text',
            placeholder: 'End'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    lonStart: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Longitude :',
        containerConfig: {
            col: 6
        },
        config: {
            name: 'lonStart',
            type: 'text',
            placeholder: 'Start'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    lonEnd: {
        element: 'input',
        value: '',
        label: false,
        labelText: 'Location Longitude :',
        containerConfig: {
            col: 6
        },
        config: {
            name: 'lonEnd',
            type: 'text',
            placeholder: 'End'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
};

export const locationGPSFields = {
    start_lat: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'GPS Latitude :',
        containerConfig: {
            col: 6
        },
        config: {
            name: 'start_lat',
            type: 'text',
            placeholder: 'Start'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    end_lat: {
        element: 'input',
        value: '',
        label: false,
        labelText: 'Location Latitude :',
        containerConfig: {
            col: 6
        },
        config: {
            name: 'end_lat',
            type: 'text',
            placeholder: 'End'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    start_lon: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'GPS Longitude :',
        containerConfig: {
            col: 6
        },
        config: {
            name: 'start_lon',
            type: 'text',
            placeholder: 'Start'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    end_lon: {
        element: 'input',
        value: '',
        label: false,
        labelText: 'Location Latitude :',
        containerConfig: {
            col: 6
        },
        config: {
            name: 'end_lon',
            type: 'text',
            placeholder: 'End'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    }
};

export const locationMilepostFields = {
    start: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Milepost :',
        containerConfig: {
            col: 6
        },
        config: {
            name: 'start',
            type: 'text',
            placeholder: 'Start'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    end: {
        element: 'input',
        value: '',
        label: false,
        labelText: 'Milepost :',
        containerConfig: {
            col: 6
        },
        config: {
            name: 'end',
            type: 'text',
            placeholder: 'End'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    }
};

export const LOCATION_TYPES = [
    {
        name: 'GPS',
        disabled: false,
        model: locationGPSFields,
        modelName: 'locationGPSFields'
    },
    {
        name: 'Milepost',
        disabled: false,
        model: locationMilepostFields,
        modelName: 'locationMilepostFields'
    }
];

export const attributes = {
    geoJsonCord: {
        element: 'textarea',
        value: '',
        label: true,
        labelText: 'geoJsonCord',
        containerConfig: {
            col: 12
        },
        config: {
            name: 'geoJsonCord',
            type: 'text',
            placeholder: ''
        },
        validation: {
            required: false
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
};

export const POPUP_TYPES_TO_SHOW = {
    MAIN_FORM: 'main-form',
    IMAGE_GALLERY: 'image-gallery',
    LINE_CANVAS: 'line-canvas'
};

export const LINE_OBJ_TEMPLATE =  {
    tooltipText: 'New Line',
    objectId: "newLine",
    object: {
        stroke: "red",
        strokeWidth: 5,
        tension: 0,
        points: []
    },
};
