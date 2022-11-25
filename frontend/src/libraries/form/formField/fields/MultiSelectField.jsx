import React from "react";
import Select from "react-select";
import { showValidation } from "./utilities/showValidation"
import { showLabel } from "./utilities/showLabel"

const MultiSelectField = (props) => {

    let { formId, field } = props;
    let { element } = field;

    return (<div className="field-style">
            {showLabel(field, formId)}
            <Select
                placeholder={element.placeholder.visible ? element.placeholder.value : ""}
                id={formId + "_" + field.id}
                name={formId + "_" + field.id}
                value={element.value}
                isMulti
                options={element.settings.options}
                isDisabled={element.disabled}
                onChange={(opt) => props.changeHandler({ target: { value: opt } }, false)}
                onBlur={() => props.changeHandler({ target: { value: element.value } }, true)}
                className="basic-multi-select"
                classNamePrefix="select"
            />

            {showValidation(field)}
        </div>
    );
};

export default MultiSelectField;