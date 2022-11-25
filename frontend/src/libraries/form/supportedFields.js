// NOTE: Don't change following object without permission
export const supportedFields = {
    "input": {
        "types": [
        "text", 
        "email", 
        "password", 
        "number"
        ],
        "userTemplate": {
        id                        : "uniqueInputId",        /*required: must be a unique id*/ 
        type                      : "input",                /*required: must be input*/ 
        subType                   : "text",                 /*optional: by default, its "text". See types above */
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        placeholderVisibility     : true,                   /*optional: placeholder visibility for this field*/ 
        placeholderValue          : "",                     /*optional: placeholder value for this field*/ 
        placeholderValueExtension : "",                     /*optional: value to be appended at the end of the placeholder*/ 
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        minLength                 : 3,                      /*optional: provide this field only for subType="text/email/password" */
        minLengthMessage          : null,                   /*optional: if provided, this message will override the default message*/
        maxLength                 : 50,                     /*optional: provide this field only for subType="text/email/password" */
        maxLengthMessage          : null,                   /*optional: if provided, this message will override the default message*/
        minValue                  : 8,                      /*optional: provide this field only for subType="number" */
        minValueMessage           : null,                   /*optional: if provided, this message will override the default message*/
        maxValue                  : 100,                    /*optional: provide this field only for subType="number" */
        maxValueMessage           : null,                   /*optional: if provided, this message will override the default message*/
        matchFieldId              : null,                   /*optional: another fieldId with which this field must match. supported only for "input" field type*/
        disabledPasswordValidation: false,                  /*optional: disable password validation*/
        validations: [                                      /*optional: list of additional validations to apply */
            {
                type: "pattern",
                regEx: "",                                      // regEx -> provide pattern only if pattern validation is required. // these should mainly be from a list of predefined regEx'es but user can also define their own regEx on the fly or from the server
                message: ""                                     // optional: if provided, this message will override the default message
            },
            {
                type: "custom",                                 // Add as many custom validations as required (In the order to be validated)
                callback: "myCustomValidator",                  // required: validator function name in form's parent class module
                message: ""                                     // optional: if provided, this message will override the default message
            },
        ]
        },
        "defaultType": "text",
        "defaultValue": ""
    },
    "textarea": {
        "userTemplate": {
        id                        : "uniqueTextAreaId",     /*required: must be a unique id*/ 
        type                      : "textarea",             /*required: must be textarea*/ 
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        placeholderVisibility     : true,                   /*optional: placeholder visibility for this field*/ 
        placeholderValue          : "",                     /*optional: placeholder value for this field*/ 
        placeholderValueExtension : "",                     /*optional: value to be appended at the end of the placeholder*/ 
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        minLength                 : 3,                      /*optional: provide this field only for subType="text/email/password" */
        minLengthMessage          : null,                   /*optional: if provided, this message will override the default message*/
        maxLength                 : 50,                     /*optional: provide this field only for subType="text/email/password" */
        maxLengthMessage          : null,                   /*optional: if provided, this message will override the default message*/
        },
        "defaultValue": ""
    },
    "radio": {
        "userTemplate": {
        id                        : "uniqueRadioButtonId",  /*required: must be a unique id*/ 
        type                      : "radio",                /*required: must be radio*/ 
        radioOptions			  : [],		                /*required: must be an array lookup*/
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        },
        "defaultValue"              : "",       
    },
    "select": {
        "userTemplate": {
        id                        : "uniqueSelectId",       /*required: must be a unique id*/ 
        type                      : "select",               /*required: must be select*/ 
        selectOptions			  : [],		                /*required: must be an array lookup*/
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        showFieldsOnCertainValue  : null,                   //[{targetIds: ["targetFieldId"], values: []}],
        },
        "defaultValue": "",
    },
    "multiSelect": {
        "userTemplate": {
        id                        : "uniqueMultiSelectId",  /*required: must be a unique id*/ 
        type                      : "multiSelect",          /*required: must be multiSelect*/ 
        selectOptions					    : [],		                  /*required: must be an array lookup*/
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        },
        "defaultValue": []
    },
    "createableSelect": {
        "userTemplate": {
        id                        : "uniqueCreateableSelectId",  /*required: must be a unique id*/ 
        type                      : "createableSelect",          /*required: must be multiSelect*/
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        },
        "defaultValue": []
    },
    "file": {
        "userTemplate": {
        id                        : "uniqueFileFieldId",  /*required: must be a unique id*/ 
        type                      : "file",          /*required: must be multiSelect*/ 
        acceptedFormats           : [],                     /*optional: provide a list of supported file formats i.e. ['.js', 'jsx'] */
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        },
        "defaultValue": null // ["filename", "guid"]
    },
    "checkbox": {
        "userTemplate": {
        id                        : "uniqueCheckboxId",     /*required: must be a unique id*/ 
        type                      : "checkbox",             /*required: must be checkbox*/ 
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        },
        "defaultValue": false
    },
    "date": {
        "userTemplate": {
        id                        : "uniqueDateId",         /*required: must be a unique id*/ 
        type                      : "date",                 /*required: must be input*/ 
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        placeholderVisibility     : true,                   /*optional: placeholder visibility for this field*/ 
        placeholderValue          : "",                     /*optional: placeholder value for this field*/ 
        placeholderValueExtension : "",                     /*optional: value to be appended at the end of the placeholder*/ 
        futureOnly                : false,                  /*Only future dates will be selectable */
        pastOnly                  : false,                  /*Only past dates will be selectable */
        minDate                   : "1990-01-01T00:00:00.000Z",/*optional: start date in ISO 8601 Format. ignored when futureOnly or futureOnly are true */
        maxDate                   : "2100-12-12T00:00:00.000Z",/*optional: end date in ISO 8601 Format. ignored when futureOnly or futureOnly are true */
        format                    : "yyyy-MM-dd",           // Date Format (todo: do we also need this from backend or from some configs)
        showYearMonthControls     : false,                  /*optional: display additional dropdown buttons for month and year selection */
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        },
        "defaultValue": null
    },
    "dateTime": {
        "userTemplate": {
        id                        : "uniqueDateTimeId",     /*required: must be a unique id*/ 
        type                      : "dateTime",             /*required: must be input*/ 
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        placeholderVisibility     : true,                   /*optional: placeholder visibility for this field*/ 
        placeholderValue          : "",                     /*optional: placeholder value for this field*/ 
        placeholderValueExtension : "",                     /*optional: value to be appended at the end of the placeholder*/ 
        futureOnly                : false,                  /*Only future dates will be selectable */
        pastOnly                  : false,                  /*Only past dates will be selectable */
        minDate                   : "1990-01-01T00:00:00.000Z",/*optional: start date in ISO 8601 Format. ignored when futureOnly or futureOnly are true */
        maxDate                   : "2100-12-01T00:00:00.000Z",/*optional: end date in ISO 8601 Format. ignored when futureOnly or futureOnly are true */
        format                    : "yyyy-MM-dd hh:mm a",   // Date Format (todo: do we also need this from backend or from some configs)
        showYearMonthControls     : false,                  /*optional: display additional dropdown buttons for month and year selection */
        showTimeInput             : false,                  /**optional: display time input instead of time select */
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        },
        "defaultValue": null
    },
    "time": {
        "userTemplate": {
        id                        : "uniqueTimeId",         /*required: must be a unique id*/ 
        type                      : "time",                 /*required: must be input*/ 
        disabled                  : false,                  /*optional: by default, field is enabled*/ 
        hide                      : false,                  /*optional: by default, field is not hidden*/ 
        labelValue                : "Field Display Name",   /*optional: label for this field*/ 
        labelVisibility           : true,                   /*optional: label visibility this field*/ 
        labelValueExtension       : "",                     /*optional: value to be appended at the end of the label*/ 
        placeholderVisibility     : true,                   /*optional: placeholder visibility for this field*/ 
        placeholderValue          : "",                     /*optional: placeholder value for this field*/ 
        placeholderValueExtension : "",                     /*optional: value to be appended at the end of the placeholder*/ 
        minTime                   : "00:00:00",             /*optional: start time*/
        maxTime                   : "23:59:59",             /*optional: end time*/
        format                    : "hh:mm a",           // Time Format (todo: do we also need this from backend or from some configs)
        required                  : false,                  /*optional: should be true if this field is required */
        requiredMessage           : null,                   /*optional: if provided, this message will override the default message*/
        },
        "defaultValue": null
    },
    "button": {
        "actions": [
        "simple",
        "resetCustom",
        "resetAll",
        "submit",
        "cancel",
        "print",
        "showHideFields"
        ],
        "userTemplate": {
        id                  : "uniqueButtonId",             /*required: must be a unique id*/ 
        type                : "button",                     /*required: must be button*/ 
        action              : "simple",                     /*optional: by default. it is "simple". see "actions above" */ 
        hide                : false,                        /*optional: by default, field is not hidden*/ 
        callback            : null,                         /*optional: Button callback. but must be provided for "submit" button*/
        disabled            : false,                        /*optional: by default, field is enabled*/ 
        labelValue          : "Button Display Name",        /*required: label for this field*/ 
        labelVisibility     : true,                         /*optional: label visibility this field*/ 
        labelValueExtension : "",                           /*optional: value to be appended at the end of the label*/
        resetFieldIds       : [],                           /*optional: list of other fieldIds in the form to reset upon button click. must be provided when "action" is set to "resetCustom"*/
        showFieldIds        : [],                           /*optional: list of fieldIds in the form to show upon button click. must be provided when "action" is set to "showHideFields"*/
        hideFieldIds        : [],                           /*optional: list of fieldIds in the form to hide upon button click. must be provided when "action" is set to "showHideFields"*/
        },
        "defaultAction": "simple",
        "defaultValue": ""
    }
}

export const getDefaultValue = (type) => {
    let defaultValue = "";
    if (type in supportedFields) {
        defaultValue = ("defaultValue" in supportedFields[type]) ? supportedFields[type].defaultValue : "";
    }
    return defaultValue;
}