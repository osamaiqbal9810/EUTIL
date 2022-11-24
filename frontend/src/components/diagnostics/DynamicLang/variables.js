export const langFieldsTemplates = {
    key: {
        element: "input",
        value: "",
        label: true,
        labelText: "Key",
        containerConfig: {
            col: 12,
        },
        config: {
            name: "key",
            type: "text",
            placeholder: "",
            disabled: false
        },
        validation: {
            required: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
    },
    en: {
        element: "input",
        value: "",
        label: true,
        labelText: "English",
        containerConfig: {
            col: 12,
        },
        config: {
            name: "en",
            type: "text",
            placeholder: "",
        },
        validation: {
            required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
    },
    es: {
        element: "input",
        value: "",
        label: true,
        labelText: "Español",
        containerConfig: {
            col: 12,
        },
        config: {
            name: "es",
            type: "text",
            placeholder: "",
        },
        validation: {
            required: false,
        },
        valid: false,
        touched: false,
        validationMessage: "",
    },
    fr: {
        element: "input",
        value: "",
        label: true,
        labelText: "Française",
        containerConfig: {
            col: 12,
        },
        config: {
            name: "fr",
            type: "text",
            placeholder: "",
        },
        validation: {
            required: false,
        },
        valid: false,
        touched: false,
        validationMessage: "",
    },
};
