import React, { Component } from "react";
//import Radium from "radium";
import { themeService } from "../../theme/service/activeTheme.service";
import { basicColors, retroColors } from "../../style/basic/basicColors";

class ButtonSimple extends Component {
  render() {
    return (
      <div
        className="simple-button"
        style={themeService({
          default: {
            color: basicColors.first,
          },
          retro: { color: retroColors.second },
        })}
        onClick={this.props.handleClick}
        disabled={this.props.disabled}
      >
        <span className="line1"></span>
        <span className="line2"></span>
        <span className="line3"></span>
        <span className="line4"></span>
        {this.props.buttonText && this.props.buttonText}{" "}
      </div>
    );
  }
}

export default ButtonSimple;
