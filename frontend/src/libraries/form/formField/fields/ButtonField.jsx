import React from "react";
import { themeService } from "theme/service/activeTheme.service";
import { ButtonStyle, CommonModalStyle } from "style/basic/commonControls";

const ButtonField = (props) => {
  let { formId, field } = props;
  let { element } = field;

  return (
    <button
      id={formId + "_" + field.id}
      type={element.settings[element.type].action}
      className="btn btn-secondary common-button"
      disabled={element.disabled}
      onClick={(e) => props.onClick(e)}
      style={themeService(ButtonStyle.commonButton)}
    >
      {element.label.value}
    </button>
  );
};

export default ButtonField;
