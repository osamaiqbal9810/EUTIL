import React, { Component } from "react";
import SvgIcon from "react-icons-kit";

import { ic_expand_less } from "react-icons-kit/md/ic_expand_less";
import { ic_expand_more } from "react-icons-kit/md/ic_expand_more";

import { formFeildStyle } from "../../wigets/forms/style/formFields";
import { themeService } from "../../theme/service/activeTheme.service";
import { cross } from "react-icons-kit/icomoon/cross";
export default class InputSelectOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      selected: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleDeSelect = this.handleDeSelect.bind(this);
  }

  handleClick(option, toDel) {
    if (!toDel) {
      this.setState({ showOptions: false, selected: true });
      this.props.handleOptionClick(option);
    }
  }
  handleDeSelect() {
    this.setState({ selected: false });
    this.props.handleOptionClick(null);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedValue !== this.props.selectedValue && this.props.selectedValue) {
      this.handleClick(this.props.selectedValue);
    }
  }

  render() {
    let options = null;
    options =
      this.props.selectOptions &&
      this.props.selectOptions.map((option) => {
        return <SelectRow value={option.val} key={option.id} onClickHandle={this.handleClick} option={option} />;
      });

    return (
      <React.Fragment>
        <div style={{ ...themeService(formFeildStyle.selectInputFieldContainer), ...this.props.containerStyle }}>
          <input
            name={this.props.name}
            value={this.props.value}
            style={{ ...themeService(formFeildStyle.inputSelectFieldStyle), ...this.props.inputFieldStyle }}
            onChange={this.props.onInputChange}
            onBlur={this.props.onBlurHandle}
            disabled={this.props.disabled}
          />

          <span style={{ ...themeService(formFeildStyle.selectInputCaret), ...this.props.caretContainerStyle }}>
            <SvgIcon
              style={{ verticalAlign: "middle" }}
              icon={!this.props.noIconSwitch ? (this.state.showOptions ? ic_expand_less : ic_expand_more) : ic_expand_more}
              size="20"
              onClick={(e) => {
                if (!this.props.disabled) {
                  this.setState({ showOptions: !this.state.showOptions });
                }
              }}
            />
          </span>
          <span style={{ ...themeService(formFeildStyle.selectInputCaret), ...this.props.caretCrossContainerStyle }}>
            {this.props.disabled && this.state.selected && (
              <SvgIcon
                style={{ verticalAlign: "middle" }}
                icon={cross}
                size="10"
                onClick={(e) => {
                  this.setState(this.handleDeSelect);
                }}
              />
            )}
          </span>
          {this.state.showOptions && (
            <div style={{ ...this.props.optionRowContainerStyle, ...themeService(formFeildStyle.selectInputDropDown) }}>{options}</div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const SelectRow = (props) => {
  return (
    <div
      style={themeService(formFeildStyle.inputSelectRowContainer)}
      onClick={(e) => {
        props.onClickHandle(props.option);
      }}
    >
      {props.value}
    </div>
  );
};
