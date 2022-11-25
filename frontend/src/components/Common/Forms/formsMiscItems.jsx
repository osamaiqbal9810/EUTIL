import React from "react";
import "../commonform.css";
import { NavElementStyle } from "./style/formsMiscItems";
import { themeService } from "theme/service/activeTheme.service";
import { formFeildStyle } from "../../../wigets/forms/style/formFields";
import { ButtonStyle } from "../../../style/basic/commonControls";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
//const theme = themeService("");
export const Label = (props) => (
  <label style={props.styles ? props.styles : { ...themeService(formFeildStyle.lblStyle), float: "none" }}> {props.children}</label>
);
export const Field = (props) => (
  <div style={{ ...themeService(formFeildStyle.formFeildStyle), marginBottom: "10px" }}>{props.children}</div>
);
let navStyle = {
  paddingLeft: "0",
};
export const CustomNav = (props) => (
  <ul style={navStyle} className="side-nav">
    {props.children}
  </ul>
);
export let NavElement = (props) => (
  <li
    //style={{ display: "inline-block", width: "100%", background: "rgba(55, 139, 119,0.3)", marginBottom: "1px" }}
    style={themeService(NavElementStyle.NavElement)}
    className="side-nav-element"
  >
    {props.children}
  </li>
);
export const NavImg = (props) => (
  <div
    className="side-icon"
    //style={{ display: "inline-flex", width: "20%", fontSize: "24px" }}
    style={themeService(NavElementStyle.NavIcon)}
  >
    {props.children}
  </div>
);
export const NavData = (props) => (
  <div className="side-text" style={{ display: props.textDisplay, ...themeService(NavElementStyle.NavText) }}>
    {props.children}
  </div>
);
export const Required = () => (
  <span
    className="required-fld"
    style={themeService({ default: {}, retro: { color: retroColors.second }, electric: { color: electricColors.second } })}
  >
    *
  </span>
);
export const MyButton = (props) => (
  <button style={themeService(ButtonStyle.commonButton)} {...props}>
    {props.children}
  </button>
);
//NavElement = Radium(NavElement);
//export default NavElement;
