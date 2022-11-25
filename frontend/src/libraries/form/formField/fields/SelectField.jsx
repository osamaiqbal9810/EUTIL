import React from "react";
import { showValidation } from "./utilities/showValidation"
import { showLabel } from "./utilities/showLabel"

const SelectField = (props) => {

    let { formId, field } = props;
    let { element } = field;

    return (<div className="field-style">
      {showLabel(field, formId)}
      <select
        placeholder={element.placeholder.visible ? element.placeholder.value : ""}
        id={formId + "_" + field.id}
        name={formId + "_" + field.id}
        value={element.value}
        disabled={element.disabled}
        onChange={(e) => props.changeHandler(e, false)}
        onBlur={(e) => props.changeHandler(e, true)}
        className="input-style"
      >
        {element.settings.options.map((item, index) => (
          <option key={index} value={item.val}>
            {item.text}
          </option>
        ))}
      </select>

      {showValidation(field)}
    </div>
  );
};

export default SelectField;