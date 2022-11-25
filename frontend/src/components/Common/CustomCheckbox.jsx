import SvgIcon from "react-icons-kit";
import React, { Component } from "react";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import { themeService } from "../../theme/service/activeTheme.service";
import { locationListStyle } from "../LocationSetup/LocationListStyle";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
export default class CustomCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: this.props.check,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.check !== prevProps.check) {
      this.setState({
        check: this.props.check,
      });
    }
  }
  render() {
    return (
      <span
        style={{
          ...themeService(locationListStyle.customCheckBoxContainer),
          ...this.props.containerStyle,
          ...{
            color: this.state.check ? "var(--first)" : "var(--second)",
            cursor: this.props.disabled ? "disabled" : "pointer",
          },
        }}
        onClick={(e) => {
          if (!this.props.disabled) {
            this.setState({
              check: !this.state.check,
            });
            this.props.handleCheckChange && this.props.handleCheckChange(!this.state.check);
          }
        }}
      >
        {this.state.check && <SvgIcon style={{ verticalAlign: "middle" }} icon={checkmark} size={this.props.size ? this.props.size : 15} />}
      </span>
    );
  }
}
