import React  from 'react';

export const showValidation = (field) => {
    let { element } = field;
    let errorMessage = null;
    let { validationMessage, valid, touched } = element;

    if (touched && !valid && validationMessage) {
        errorMessage = (
            <div className="error-message">
                <span>{validationMessage}</span>
            </div>
        );
    }

    return errorMessage;
};