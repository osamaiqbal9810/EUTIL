import {languageService} from "../../../Language/language.service";

export const requiredValidationMessage = languageService('This field is required');

export const basicFields = {
    name: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Name',
        containerConfig: {},
        config: {
            name: 'name',
            type: 'text',
            placeholder: 'Name',
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    },
    email: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Email',
        containerConfig: {},
        config: {
            name: 'email',
            type: 'email',
            placeholder: 'Email',
            autoComplete: 'off'
        },
        validation: {
            required: true,
            email: true
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    },
    genericEmail: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Alert Email',
        containerConfig: {},
        config: {
            name: 'genericEmail',
            type: 'email',
            placeholder: 'Alert Email',
        },
        validation: {
            required: true,
            email: true
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    }
};

export const passwordFields = {
    password: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Password',
        containerConfig: {},
        config: {
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            autoComplete: 'off'
        },
        validation: {
            required: true,
            minLen: 5
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    },
    confirmPassword: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Confirm Password',
        containerConfig: {},
        config: {
            name: 'confirmPassword',
            type: 'password',
            placeholder: 'Confirm Password',
        },
        validation: {
            required: true,
            match: true,
            matchField: 'password'
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    }
};

export const additionalFields = {
    // group_id: {
    //     element: 'select',
    //     value: '',
    //     label: true,
    //     labelText: 'Group',
    //     containerConfig: {},
    //     config: {
    //         name: 'group_id',
    //         type: 'text',
    //         placeholder: 'Group',
    //         options: []
    //     },
    //     validation: {
    //         required: true
    //     },
    //     valid: false,
    //     touched: false,
    //     validationMessage: requiredValidationMessage
    // },
    // userGroups: {
    //     element: 'multiSelect',
    //     value: [],
    //     label: true,
    //     labelText: 'User Groups',
    //     containerConfig: {},
    //     config: {
    //         name: 'userGroups',
    //         type: 'text',
    //         placeholder: 'User Group',
    //         options: []
    //     },
    //     validation: {
    //         required: true
    //     },
    //     valid: false,
    //     touched: false,
    //     validationMessage: requiredValidationMessage
    // },
    assignedLocation: {
        element: 'select',
        value: '',
        label: true,
        labelText: 'Assigned Location',
        containerConfig: {},
        config: {
            name: 'assignedLocation',
            type: 'text',
            placeholder: 'Location',
            options: []
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    },
    // department: {
    //     element: 'select',
    //     value: '',
    //     label: true,
    //     labelText: 'Department',
    //     containerConfig: {},
    //     config: {
    //         name: 'department',
    //         type: 'text',
    //         placeholder: 'Department',
    //         options: []
    //     },
    //     validation: {
    //         required: true
    //     },
    //     valid: false,
    //     touched: false,
    //     validationMessage: requiredValidationMessage
    // },
    phone: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Phone',
        containerConfig: {},
        config: {
            name: 'phone',
            type: 'text',
            placeholder: 'Phone',
        },
        validation: {
            required: false,
            phoneNumber: true,
            minLen: 10,
            maxLen: 12
        },
        valid: true,
        touched: false,
        validationMessage: ''
    },
    mobile: {
        element: 'input',
        value: '',
        label: true,
        labelText: 'Mobile',
        containerConfig: {},
        config: {
            name: 'mobile',
            type: 'text',
            placeholder: 'Mobile',
        },
        validation: {
            required: true,
            phoneNumber: true,
            minLen: 10,
            maxLen: 12
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    }
};

export const userGroupsTemplate = {
    group_id: {
        element: 'select',
        value: '',
        label: true,
        labelText: 'Role',
        containerConfig: {},
        config: {
            name: 'group_id',
            type: 'text',
            placeholder: 'Group',
            options: []
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    },
    department: {
        element: 'multiSelect',
        value: [],
        label: true,
        labelText: 'Department',
        containerConfig: {},
        config: {
            name: 'department',
            type: 'text',
            placeholder: 'Department',
            options: []
        },
        validation: {
            required: false
        },
        valid: false,
        touched: false,
        validationMessage: requiredValidationMessage
    },
}
