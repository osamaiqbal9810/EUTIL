export const commonFields = {
   
    closedDate: {
        element: 'date',
        value: '',
        label: true,
        labelText: 'Close Date',
        containerConfig: {},
        config: {
            name: 'closedDate',
            type: 'text',
            placeholder: 'Close Date'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
    }
};
