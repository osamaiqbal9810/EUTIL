import _ from 'lodash';
import React from 'react';
import DayPickerInput from "react-day-picker/DayPickerInput";
import { languageService } from "Language/language.service";

export const maintenanceAddFields = {
    lineId:
    {
        element: 'select',
        value: '',
        label: true,
        labelText: languageService('Line'),
        containerConfig: {},
        config:
        {
            name: 'lineId',
            type: 'text',
            options: []
        },
        validation:
        {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    maintenanceType: {
        element: 'select',
        value: '',
        label: true,
        labelText: languageService('Maintenance Type'),
        containerConfig: {},
        config: {
            name: 'maintenanceType',
            type: 'text',
            placeholder: this.labelText,
            options: []
        },
        validation: {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    // assignedTo: {
    //     element: 'select',
    //     value: '',
    //     label: true,
    //     labelText: 'Assigned To',
    //     containerConfig: {},
    //     config: {
    //         name: 'assignedTo',
    //         type: 'text',
    //         placeholder: 'Assigned to',
    //         options: []
    //     },
    //     validation: {
    //         required: true
    //     },
    //     valid: false,
    //     touched: false,
    //     validationMessage: ''
    // },
    priority: {
        element: 'select',
        value: 'Normal',
        label: true,
        labelText: languageService('Priority'),
        containerConfig: {},
        config: {
            name: 'priority',
            type: 'text',
            placeholder: 'Priority',
            options: [
                { val: 'Low', text: 'Low' },
                { val: 'Normal', text: 'Normal' },
                { val: 'High', text: 'High' }
            ]
        },
        validation: {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    description: {
        element: 'textarea',
        value: '',
        label: true,
        labelText: languageService('Description'),
        containerConfig: {},
        config: {
            name: 'description',
            type: 'text',
            placeholder: 'Enter Description',
            style: { width: '100%' }
        },
        validation: {
            required: false
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    /*trackType: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Track Type',
        containerConfig: {
            col: 12
        },
        config: {
            name: 'trackType',
            type: 'text',
            placeholder: 'Track Type'
        },
        validation: {
            required: false
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    trackNumber: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Track Number',
        containerConfig: {
            col: 12
        },
        config: {
            name: 'trackNumber',
            type: 'text',
            placeholder: 'Track Number'
        },
        validation: {
            required: false
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    class: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Class',
        containerConfig: {
            col: 12
        },
        config: {
            name: 'class',
            type: 'text',
            placeholder: 'Class'
        },
        validation: {
            required: false
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },*/
};

export const locationGPSFields = {
    start_lat: {
        element: 'input',
        value: '',
        label: true,
        labelText: languageService('GPS Latitude Start'),
        containerConfig: {
            col: 12
        },
        config: {
            name: 'start_lat',
            type: 'number',
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
        label: true,
        labelText: languageService('GPS Latitude End'),
        containerConfig: {
            col: 12
        },
        config: {
            name: 'end_lat',
            type: 'number',
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
        labelText: languageService('GPS Longitude Start'),
        containerConfig: {
            col: 12
        },
        config: {
            name: 'start_lon',
            type: 'number',
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
        label: true,
        labelText: languageService('GPS Longitude End'),
        containerConfig: {
            col: 12
        },
        config: {
            name: 'end_lon',
            type: 'number',
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
        value: 0,
        label: true,
        labelText: languageService('Milepost Start'),
        containerConfig: {
            col: 12
        },
        config: {
            name: 'start',
            type: 'text',
            placeholder: 'Start'
        },
        validation: {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    end: {
        element: 'input',
        value: 0,
        label: true,
        labelText: languageService('Milepost End'),
        containerConfig: {
            col: 12
        },
        config: {
            name: 'end',
            type: 'text',
            placeholder: 'End'
        },
        validation: {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    }
};

export const locationMarkerFields = {
    start: {
        element: 'input',
        value: 0,
        label: true,
        labelText: languageService('Marker Start'),
        containerConfig: {
            col: 12
        },
        config: {
            name: 'start',
            type: 'text',
            placeholder: 'Start'
        },
        validation: {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    end: {
        element: 'input',
        value: 0,
        label: true,
        labelText: languageService('Marker End'),
        containerConfig: {
            col: 12
        },
        config: {
            name: 'end',
            type: 'text',
            placeholder: 'End'
        },
        validation: {
            required: true
        },
        valid: true,
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
];

export const maintenanceEditFields = {
    mrNumber: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'MR#',
        containerConfig: {
            col: 12
        },
        config: {
            name: 'mrNumber',
            type: 'text',
            placeholder: 'Line ID',
            disabled: true
        },
        validation: {
            required: false
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    status: {
        element: 'input',
        value: '',
        label: true,
        labelText: languageService('Status'),
        containerConfig: {
            col: 12
        },
        config: {
            name: 'status',
            type: 'text',
            placeholder: 'Line ID',
            disabled: true
        },
        validation: {
            required: false
        },
        valid: true,
        touched: false,
        validationMessage: ''
    }
};

function CustomOverlay({ classNames, selectedDay, children, ...props }) {
    return (
        <div
            className={classNames.overlayWrapper}
            style={{ marginLeft: -330 }}
            {...props}
        >
            <div className={classNames.overlay}>
                {/*<h3>Hello day picker!</h3>*/}
                {/*<p>*/}
                {/*  <input />*/}
                {/*  <button onClick={() => console.log('clicked!')}>button</button>*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*  {selectedDay*/}
                {/*      ? `You picked: ${selectedDay.toLocaleDateString()}`*/}
                {/*      : 'Please pick a day'}*/}
                {/*</p>*/}
                {children}
            </div>
        </div>
    );
}

export const historyFields = {
    // workOrderNumber: {
    //     element: 'input',
    //     value: '',
    //     label: true,
    //     labelText: languageService('Work Order'),
    //     containerConfig: {
    //         col: 12
    //     },
    //     config: {
    //         name: 'workOrderNumber',
    //         type: 'text',
    //         placeholder: 'Work Order'
    //     },
    //     validation: {
    //         required: true
    //     },
    //     valid: false,
    //     touched: false,
    //     validationMessage: ''
    // },
    executionDate: {
        element: 'date',
        value: '',
        label: true,
        labelText: languageService('Execution Date'),
        containerConfig: {},
        config: {
            name: 'executionDate',
            type: 'text',
            placeholder: 'YYYY-M-D',
            width: '70%',
            overlayComponent: CustomOverlay,
            captionElement: true
        },
        validation: {
            required: false
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    // closedDate: {
    //     element: 'date',
    //     value: '',
    //     label: true,
    //     labelText: languageService('Closed Date'),
    //     containerConfig: {},
    //     config: {
    //         name: 'closedDate',
    //         type: 'text',
    //         placeholder: 'YYYY-M-D',
    //         overlayComponent: CustomOverlay,
    //         captionElement: true
    //     },
    //     validation: {
    //         required: true
    //     },
    //     valid: false,
    //     touched: false,
    //     validationMessage: ''
    // },
};


export const FormModels = {
    maintenanceAddFields: {
        dueDate: {
            element: 'date',
            value: '',
            label: true,
            labelText: languageService('Due Date'),
            containerConfig: {},
            config: {
                name: 'dueDate',
                type: 'text',
                placeholder: 'YYYY-M-D',
            },
            validation: {
                required: true
            },
            valid: false,
            touched: false,
            validationMessage: ''
        },
        assignedTo: {
            element: 'select',
            value: '',
            label: true,
            labelText: languageService('Assigned To'),
            containerConfig: {},
            config: {
                name: 'assignedTo',
                type: 'text',
                placeholder: 'Assigned to',
                options: []
            },
            validation: {
                required: true
            },
            valid: false,
            touched: false,
            validationMessage: ''
        },
        priority: {
            element: 'select',
            value: 'Normal',
            label: true,
            labelText: languageService('Priority'),
            containerConfig: {},
            config: {
                name: 'priority',
                type: 'text',
                placeholder: 'Priority',
                options: [
                    { val: 'Low', text: 'Low' },
                    { val: 'Medium', text: 'Medium' },
                    { val: 'High', text: 'High' }
                ]
            },
            validation: {
                required: true
            },
            valid: true,
            touched: false,
            validationMessage: ''
        },
        description: {
            element: 'textarea',
            value: '',
            label: true,
            labelText: languageService('Description'),
            containerConfig: {},
            config: {
                name: 'description',
                type: 'text',
                placeholder: 'Enter Description',
                style: { width: '100%' }
            },
            validation: {
                required: false
            },
            valid: true,
            touched: false,
            validationMessage: ''
        }
    },
    locationGPSFields: {
        start_lat: {
            element: 'input',
            value: '',
            label: true,
            labelText: languageService('GPS Latitude'),
            containerConfig: {
                col: 12
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
            label: true,
            labelText: languageService('Location Latitude'),
            containerConfig: {
                col: 12
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
            labelText: languageService('GPS Longitude'),
            containerConfig: {
                col: 12
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
            label: true,
            labelText: languageService('Location Latitude'),
            containerConfig: {
                col: 12
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
    },
    locationMilepostFields: {
        start: {
            element: 'input',
            value: '',
            label: true,
            labelText: languageService('Milepost Start'),
            containerConfig: {
                col: 12
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
            label: true,
            labelText: languageService('Milepost End'),
            containerConfig: {
                col: 12
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
    },
    maintenanceEditFields: {
        mwoNumber: {
            element: 'input',
            value: '',
            label: true,
            labelText: 'MWO# :',
            containerConfig: {
                col: 12
            },
            config: {
                name: 'mwoNumber',
                type: 'text',
                placeholder: 'Line ID',
                disabled: true
            },
            validation: {
                required: false
            },
            valid: true,
            touched: false,
            validationMessage: ''
        },
        status: {
            element: 'input',
            value: '',
            label: true,
            labelText: languageService('Status'),
            containerConfig: {
                col: 12
            },
            config: {
                name: 'status',
                type: 'text',
                placeholder: 'Line ID',
                disabled: true
            },
            validation: {
                required: false
            },
            valid: true,
            touched: false,
            validationMessage: ''
        }
    },

    getFormModel: key => _.cloneDeep(FormModels[key])
};
