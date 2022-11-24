import React, { Component } from "react";
import Radium from "radium";
import propTypes from "prop-types";
import SvgIcon from "react-icons-kit";
class Button1 extends Component {
  render() {
    const styles = getStyles(this.props, this.state);

    return (
      <button style={styles.ButtonStyle} onClick={this.props.handleClick} disabled={this.props.disabled}>
        {this.props.buttonText && this.props.buttonText}
        {this.props.icon && (
          <SvgIcon size={this.props.iconSize} icon={this.props.icon} style={styles.iconStyle} onClick={this.handleAddUserClick} />
        )}
      </button>
    );
  }
}

let getStyles = (props, state) => {
  let iconStyle = {
    color: "#fff",
    verticalAlign: "middle",
  };
  if (props.iconStyle) {
    iconStyle = props.iconStyle;
  }
  return {
    ButtonStyle: {
      height: props.height ? props.height : "30px",
      width: props.width ? props.width : "90px",
      backgroundColor: props.backgroundColor ? props.backgroundColor : "rgba(64, 118, 179)",
      border: props.border ? props.border : "1px solid #e3e9ef",
      color: props.color ? props.color : "#fff",
      fontSize: props.fontSize ? props.fontSize : "14px",
      float: props.float ? props.float : null,
      margin: props.margin ? props.margin : "0px",
      padding: props.padding ? props.padding : "0px",
      cursor: "pointer",
      borderRadius: props.borderRadius ? props.borderRadius : "4px",
      WebkitTransitionDuration: "0.4s",
      transitionDuration: "0.4s",
      ":hover": {
        color: props.hoverColor ? props.hoverColor : " #fff",
        border: props.hoverBorder ? props.hoverBorder : "1px solid rgba(64, 118, 179)",
        backgroundColor: props.hoverBackgroundColor ? props.hoverBackgroundColor : "rgba(64, 118, 179)",
      },
    },
    iconStyle: iconStyle,
  };
};

Button1.propTypes = {
  handleClick: propTypes.func.isRequired,
  height: propTypes.string,
  width: propTypes.string,
  border: propTypes.string,
  color: propTypes.string,
  fontSize: propTypes.string,
  float: propTypes.string,
  borderRadius: propTypes.string,
  hoverColor: propTypes.string,
  hoverBorder: propTypes.string,
  hoverBackgroundColor: propTypes.string,
  buttonText: propTypes.string,
  margin: propTypes.string,
  padding: propTypes.string,
};

export const ButtonMain = Radium(Button1);

class ButtonCircleAdd extends Component {
  render() {
    const styles = getStylesButtonCirclePlus(this.props, this.state);
    let permissionValue = true;

    if (this.props.permissionCheckProps) {
      permissionValue = this.props.permissionCheck;
    }
    return (
      <div>
        {" "}
        {permissionValue && (
          <div>
            <div style={styles.buttonTextTitleStyle}>{this.props.buttonTitleText}</div>
            <button style={styles.ButtonStyle} onClick={this.props.handleClick}>
              {this.props.buttonText && this.props.buttonText}
              {this.props.icon && <SvgIcon size={this.props.iconSize} icon={this.props.icon} style={styles.iconStyle} />}
            </button>
          </div>
        )}
      </div>
    );
  }
}

let getStylesButtonCirclePlus = (props, state) => {
  let iconStyle = {
    color: "#fff",
    verticalAlign: "middle",
  };
  let buttonTextTitleStyle = { fontWeight: "600", color: props.buttonTextColor ? props.buttonTextColor : "rgba(64, 118, 179)", fontSize: "small" };
  if (props.textTitleStyle) {
    buttonTextTitleStyle = props.textTitleStyle;
  }
  if (props.iconStyle) {
    iconStyle = props.iconStyle;
  }
  return {
    ButtonStyle: {
      height: props.height ? props.height : "inherit",
      width: props.width ? props.width : "inherit",
      backgroundColor: props.backgroundColor ? props.backgroundColor : "rgba(64, 118, 179)",
      border: props.border ? props.border : "1px solid #e3e9ef",
      color: props.color ? props.color : "#fff",
      fontSize: props.fontSize ? props.fontSize : "14px",
      float: props.float ? props.float : null,
      margin: props.margin ? props.margin : "0px",
      padding: props.padding ? props.padding : "0px",
      cursor: "pointer",
      borderRadius: props.borderRadius ? props.borderRadius : "4px",
      WebkitTransitionDuration: "0.4s",
      transitionDuration: "0.4s",
      outline: "none",
      ":hover": {
        color: props.hoverColor ? props.hoverColor : " #fff",
        border: props.hoverBorder ? props.hoverBorder : "1px solid rgba(64, 118, 179)",
        backgroundColor: props.hoverBackgroundColor ? props.hoverBackgroundColor : "rgba(64, 118, 179)",
      },
      ":active": {
        border: props.activeBorder ? props.activeBorder : "2px solid rgba(64, 118, 179)",
      },
    },
    iconStyle: iconStyle,
    buttonTextTitleStyle: buttonTextTitleStyle,
  };
};

ButtonCircleAdd.propTypes = {
  handleClick: propTypes.func.isRequired,
  height: propTypes.string,
  width: propTypes.string,
  border: propTypes.string,
  color: propTypes.string,
  fontSize: propTypes.string,
  float: propTypes.string,
  borderRadius: propTypes.string,
  hoverColor: propTypes.string,
  hoverBorder: propTypes.string,
  hoverBackgroundColor: propTypes.string,
  buttonText: propTypes.string,
  margin: propTypes.string,
  padding: propTypes.string,
};

export const ButtonCirclePlus = Radium(ButtonCircleAdd);

class ButtonTableActions extends Component {
  render() {
    const styles = getStylesButtonTableActions(this.props, this.state);

    return (
      <button style={styles.ButtonStyle} onClick={this.props.handleClick}>
        {this.props.buttonText && this.props.buttonText}
        {this.props.icon && <SvgIcon size={this.props.iconSize} icon={this.props.icon} style={styles.iconStyle} />}
      </button>
    );
  }
}

let getStylesButtonTableActions = (props, state) => {
  let iconStyle = {
    color: "#fff",
    verticalAlign: "middle",
  };
  if (props.iconStyle) {
    iconStyle = props.iconStyle;
  }
  let hover = {
    color: props.hoverColor ? props.hoverColor : " #inherit",
    border: props.hoverBorder ? props.hoverBorder : "1px solid inherit",
    backgroundColor: "transparent",
  };
  let active = {
    border: props.activeBorder ? props.activeBorder : "2px solid rgba(64, 118, 179)",
  };
  if (props.noEffect) {
    active = {};
  }
  return {
    ButtonStyle: {
      height: props.height ? props.height : "fit-content",
      width: props.width ? props.width : "fit-content",
      backgroundColor: props.backgroundColor ? props.backgroundColor : "inherit",
      border: props.border ? props.border : "none",
      color: props.color ? props.color : "rgb(107, 110, 110)",
      fontSize: props.fontSize ? props.fontSize : "12px",
      float: props.float ? props.float : null,
      margin: props.margin ? props.margin : "0px",
      padding: props.padding ? props.padding : "0px",
      cursor: "pointer",
      borderRadius: props.borderRadius ? props.borderRadius : "4px",
      WebkitTransitionDuration: "0.4s",
      transitionDuration: "0.4s",
      outline: "none",
      ":hover": props.hover ? props.hover :hover,
      ":active": props.active ? props.active :active,
    },
    iconStyle: iconStyle,
  };
};

ButtonTableActions.propTypes = {
  handleClick: propTypes.func.isRequired,
  height: propTypes.string,
  width: propTypes.string,
  border: propTypes.string,
  color: propTypes.string,
  fontSize: propTypes.string,
  float: propTypes.string,
  borderRadius: propTypes.string,
  hoverColor: propTypes.string,
  hoverBorder: propTypes.string,
  hoverBackgroundColor: propTypes.string,
  buttonText: propTypes.string,
  margin: propTypes.string,
  padding: propTypes.string,
};

export const ButtonActionsTable = Radium(ButtonTableActions);
