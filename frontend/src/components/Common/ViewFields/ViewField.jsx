import React, { Component } from "react";
import { basicColors, retroColors } from "../../../style/basic/basicColors";
import { themeService } from "../../../theme/service/activeTheme.service";

class ViewFieldSimple extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      fieldLabel: {
        default: {
          color: basicColors.fifth,
          fontSize: "14px",
          paddingBottom: "1em",
        },
        retro: {
          color: retroColors.second,
          fontSize: "14px",
          paddingBottom: "1em",
          fontWeight: 600,
        },
      },
      fieldDataStyle: {
        default: {
          border: "1px solid #f1f1f1",
          boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
          padding: "10px",
          borderRadius: "5px",
        },
        retro: { border: "1px solid #f1f1f1", boxShadow: "rgb(238, 238, 238) 1px 1px 1px", padding: "10px" },
      },
    };
  }
  render() {
    return (
      <div>
        <div style={themeService(this.styles.fieldLabel)}>{this.props.label}</div>
        <div style={themeService(this.styles.fieldDataStyle)}>{this.props.children}</div>
      </div>
    );
  }
}

export default ViewFieldSimple;
