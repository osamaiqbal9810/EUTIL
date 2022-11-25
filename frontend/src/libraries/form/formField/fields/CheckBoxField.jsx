import React from "react";
import { showValidation } from "./utilities/showValidation";
import { showLabelSmall } from "./utilities/showLabel";

const CheckBoxField = (props) => {
  let { formId, field } = props;
  let { element } = field;
  return (
    <div className="field-checkbox-style">
      <input
        id={formId + "_" + field.id}
        name={formId + "_" + field.id}
        type={element.type}
        value={element.value}
        checked={element.value}
        disabled={element.disabled}
        onChange={(e) => props.changeHandler({ target: { value: e.target.checked } }, false)}
        onBlur={(e) => props.changeHandler({ target: { value: e.target.checked } }, true)}
      />
      {showLabelSmall(field, formId)}
      {showValidation(field)}
    </div>
  );
};

export default CheckBoxField;
