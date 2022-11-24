export const commonFields = {
    executionDate: {
        element: 'date',
        value: '',
        label: true,
        labelText: 'Execution Date',
        containerConfig: {},
        config: {
            name: 'executionDate',
            type: 'text',
            placeholder: 'Execution Date'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    }
};
