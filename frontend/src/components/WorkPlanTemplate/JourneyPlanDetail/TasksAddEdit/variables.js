
export const keyValueProperties = ["title", "desc", "notes"];

export const basicFields = {
    title: {
            element: 'input',
            value: '',
            label: true,
            labelText: 'Title',
            containerConfig: {},
            config:
                {
                    name: 'title',
                    type: 'text',
                    placeholder: 'Title'
                },
            validation:
                {
                    required: true
                },
            valid: false,
            touched: false,
            validationMessage: ''
        },
    desc: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Description',
        containerConfig: {},
        config:
            {
                name: 'desc',
                type: 'text',
                placeholder: 'Description'
            },
        validation:
            {
                required: true
            },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    notes: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Notes',
        containerConfig: {},
        config:
            {
                name: 'notes',
                type: 'text',
                placeholder: 'Notes'
            },
        validation:
            {
                required: true
            },
        valid: false,
        touched: false,
        validationMessage: ''
    },
    // imgs: {
    //     element: 'file',
    //     value: '',
    //     label: true,
    //     labelText: 'Image',
    //     containerConfig: {},
    //     config:
    //         {
    //             name: 'image',
    //             type: 'file',
    //             placeholder: 'Image'
    //         },
    //     validation:
    //         {
    //             required: true
    //         },
    //     valid: true,
    //     touched: false,
    //     validationMessage: ''
    // },
};

export const locationMilepostFields = {
    start: {
        element: 'input',
        value: 0,
        label: true,
        labelText: 'Milepost Start',
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
        value: 0,
        label: true,
        labelText: 'Milepost End',
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
};
