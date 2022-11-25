import React, { Component } from "react";
import { basicColors, retroColors, electricColors } from "../../style/basic/basicColors";
import { themeService } from "theme/service/activeTheme.service";

class SelectionListDropDown extends Component {
  render() {
    let opts = this.props.userList.map((user, index) => {
      return (
        <option key={index} value={user.email} style={{ padding: "3px 0px" }}>
          {user.name}
        </option>
      );
    });
    return (
      <select
        onChange={this.props.changeSelection}
        style={themeService({
          default: { width: "100%", padding: "3px 0px", color: basicColors.first },
          retro: { width: "100%", padding: "3px 0px", color: retroColors.second },
          electric: { width: "100%", padding: "3px 0px", color: electricColors.second },
        })}
        defaultValue={this.props.selectedItem}
      >
        {opts}
      </select>
    );
  }
}

export default SelectionListDropDown;
