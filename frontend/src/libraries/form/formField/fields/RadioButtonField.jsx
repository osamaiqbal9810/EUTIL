import React from "react";
import { showValidation } from "./utilities/showValidation"
import { showLabel } from "./utilities/showLabel"

const RadioButtonField = (props) => {

    let { formId, field } = props;
    let { element } = field;

    return (<div className="field-style">
        {showLabel(field, formId)}
        <div className={"row"}>
        {element.settings.options.map(({ val, text }) => (
            <div key={val} className={"col-md-12 form-checkbox"}>
            <input
                id={formId + "_" + field.id + "_" + val}
                name={formId + "_" + field.id}
                type={element.type}
                value={element.value}
                disabled={element.disabled}
                checked={element.value === val}
                onChange={() => props.changeHandler({ target: { value: val } }, false)}
                onBlur={() => props.changeHandler({ target: { value: element.value } }, true)}
            />
            <label className="show-label-small" htmlFor={formId + "_" + field.id + "_" + val}>
                {text}
            </label>
            </div>
        ))}
        </div>
        {showValidation(field)}
    </div>
    );
};

export default RadioButtonField;