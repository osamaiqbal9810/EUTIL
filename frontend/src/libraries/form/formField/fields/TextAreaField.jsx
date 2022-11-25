import React from "react";
import { showValidation } from "./utilities/showValidation";
import { showLabel } from "./utilities/showLabel";

const TextAreaField = (props) => {
  let { formId, field } = props;
  let { element } = field;

  return (
    <div className="field-style">
      {showLabel(field, formId)}
      <textarea
        placeholder={element.placeholder.visible ? element.placeholder.value : ""}
        id={formId + "_" + field.id}
        name={formId + "_" + field.id}
        value={element.value}
        disabled={element.disabled}
        onChange={(e) => props.changeHandler(e, false)}
        onBlur={(e) => props.changeHandler(e, true)}
      />
      {showValidation(field)}
    </div>
  );
};

export default TextAreaField;
