import React, { Component } from "react";
import SvgIcon from "react-icons-kit";
import { themeService } from "../../../theme/service/activeTheme.service";
import { retroColors, basicColors } from "../../../style/basic/basicColors";

export const ControlArrow = props => {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "5px",
        cursor: "pointer",
        verticalAlign: "middle",
        color: themeService({ default: basicColors.first, retro: retroColors.second }),
      }}
    >
      <SvgIcon
        icon={props.icon}
        size={25}
        onClick={e => {
          e.preventDefault();
          props.handleControlClick(props.click_arg, props.itemIndex);
        }}
        onMouseDown={e => {
          console.log("double clicked");
          e.preventDefault();
        }}
      />
    </div>
  );
};

export const CenterTextControl = props => {
  return (
    <div
      onClick={e => {
        props.disableMonthSelector ? {} : props.toggleDropDownMonths();
      }}
      style={{
        display: "inline-block",
        margin: "0px 15px",
        textAlign: "center",
        cursor: "pointer",
        fontFamily: "Arial",
        fontSize: "18px",
        letterSpacing: "0.95px",
        color: themeService({ default: basicColors.first, retro: retroColors.second }),
      }}
    >
      {props.textName}
    </div>
  );
};
