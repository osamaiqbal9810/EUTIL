import React from "react";
import { showValidation } from "./utilities/showValidation"
import { showLabel } from "./utilities/showLabel"

const InputField = (props) => {

    let { formId, field } = props;
    let { element } = field;

    return (<div className="field-style">
        {showLabel(field, formId)}
        <input
            placeholder={element.placeholder.visible ? element.placeholder.value : ""}
            id={formId + "_" + field.id}
            name={formId + "_" + field.id}
            type={element.settings[element.type].subType}
            value={element.value}
            disabled={element.disabled}
            onChange={(e) => props.changeHandler(e, false)}
            onBlur={(e) => props.changeHandler(e, true)}
            onKeyDown={(e) => (e.key  === 'Enter') && props.onEnterPressed(e)}
            className="input-style"
        />
        {showValidation(field)}
    </div>);
};

export default InputField;