import React, { Component } from "react";
import { themeService } from "../../theme/service/activeTheme.service";
import { settingStyles } from "./style/settingStyle";
import { retroColors } from "../../style/basic/basicColors";

export const Heading = props => {
  return <div style={themeService(settingStyles.heading(props.heading))}>{props.children}</div>;
};

export const MainPageHeading = props => {
  return (
    <div style={themeService(settingStyles.heading(props.heading))}>
      <Heading {...props}>{props.children}</Heading>
    </div>
  );
};

export const Seperator = props => {
  return (
    <div style={themeService({ default: { border: "1px solid " + "#d1d1d1" }, retro: { border: "1px solid " + retroColors.fourth } })} />
  );
};
