export const requiredValidationMessage = 'This field is required';

export const formFieldsTemplate = {
    runLineID: {
        element: 'select',
        value: '',
        label: true,
        labelText: 'Location',
        containerConfig: {},
        config: {
            name: 'runLineID',
            type: 'text',
            options: []
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    },
    runId: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Run ID',
        containerConfig: {},
        config: {
            name: 'runId',
            type: 'text',
            placeholder: 'Run Id'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    },
    runName: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Run Name',
        containerConfig: {},
        config: {
            name: 'runName',
            type: 'text',
            placeholder: 'Run Name'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    },
};
