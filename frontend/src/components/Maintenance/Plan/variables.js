export const commonFields = {
    assignedTo: {
        element: 'select',
        value: 'normal',
        label: true,
        labelText: 'Assigned To',
        containerConfig: {},
        config: {
            name: 'assignedTo',
            type: 'text',
            placeholder: 'Assign To',
            options: []
        },
        validation: {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    dueDate: {
        element: 'date',
        value: '',
        label: true,
        labelText: 'Due Date',
        containerConfig: {},
        config: {
            name: 'dueDate',
            type: 'text',
            placeholder: 'Due Date'
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
        value: 'normal',
        label: true,
        labelText: 'Priority',
        containerConfig: {},
        config: {
            name: 'priority',
            type: 'text',
            placeholder: 'Priority',
            options: [
                { val: 'low', text: 'Low' },
                { val: 'normal', text: 'Normal' },
                { val: 'high', text: 'High' }
            ]
        },
        validation: {
            required: true
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
};
