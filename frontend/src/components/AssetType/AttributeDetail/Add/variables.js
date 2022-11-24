export const commonformFields = {
    name: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Attribute Title',
        containerConfig: {},
        config: {
            name: 'name',
            type: 'text',
            placeholder: 'Enter Attribute Title',
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    type: {
        element: 'select',
        value: 'string',
        label: true,
        labelText: 'Attribute type',
        containerConfig: {},
        config: {
            name: 'type',
            type: 'text',
            placeholder: 'Enter Attribute type',
            options: [
                {val: 'string', text: 'string'},
                {val: 'array', text: 'array'},
                {val: 'checkbox', text: 'checkbox'},
            ]
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    order: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Attribute Order',
        containerConfig: {},
        config: {
            name: 'order',
            type: 'number',
            placeholder: 'Enter Attribute Order',
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    value: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Initial Value',
        containerConfig: {},
        config: {
            name: 'value',
            placeholder: 'Enter Initial Value',
            type: 'text',
        },
        validation: {
            required: false
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
};
