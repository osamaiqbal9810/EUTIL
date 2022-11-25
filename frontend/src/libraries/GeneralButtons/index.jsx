import React, { Component, Fragment } from "react";
import CustomIcon from "../CustomIcon";
import "./index.css";

const RenderIcon = (props) => {
  let { iconState, iconGroup } = props;
  return iconState && iconGroup ? <CustomIcon status={iconState} iconGroup={iconGroup} /> : null;
};

export const UnderlinedTextButton = (props) => {
  let { title, onClick } = props;
  return (
    <Fragment>
      <button className="general-button-underlined grey" onClick={onClick}>
        <RenderIcon {...props} />
        {title}
      </button>
    </Fragment>
  );
};

export const PillTextButton = (props) => {
  let { title, onClick } = props;
  return (
    <Fragment>
      <button className="general-button-pill non-toggleAble" onClick={onClick}>
        <RenderIcon {...props} />
        {title}
      </button>
    </Fragment>
  );
};

export const PillTextButtonToggleAble = (props) => {
  let { title, onClick, state, latch } = props;
  return (
    <Fragment>
      <button className={`general-button-pill toggleAble ${state ? 'pressed' : 'released'} ${latch ? 'latch-behavior' : ''}`} onClick={onClick}>
        <RenderIcon {...props} />
        {title}
      </button>
    </Fragment>
  );
};

export const HyperlinkTextButton = (props) => {
  let { title, onClick } = props;
  return (
    <Fragment>
      <button className="general-button-underlined file-hyperlink" onClick={onClick}>
        <RenderIcon {...props} />
        {title}
      </button>
    </Fragment>
  );
};
