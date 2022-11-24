import React, { Component } from "react";
import { themeService } from "../../../theme/service/activeTheme.service";
import { commonFieldsStyles } from "./style/formsMiscItems";

class InputCheckBoxField extends Component {
  render() {
    return (
      <div>
        <input
          style={{ marginTop: "5px" }}
          type="checkbox"
          checked={this.props.checked}
          onChange={e => {
            this.props.ClickHandler(e.target.checked);
          }}
        />
        <label style={themeService(commonFieldsStyles.checkBoxInput)}>{this.props.label} </label>
      </div>
    );
  }
}

export default InputCheckBoxField;
