import { ic_save } from "react-icons-kit/md/ic_save";
import React, { Component } from "react";
import Icon from "react-icons-kit";
import { pencil } from "react-icons-kit/icomoon/pencil";
import { cross } from "react-icons-kit/icomoon/cross";
import { plus } from "react-icons-kit/icomoon/plus";
import { arrowUp } from "react-icons-kit/icomoon/arrowUp";
import { arrowDown } from "react-icons-kit/icomoon/arrowDown";
export const AppFormListHeader = (props) => {
  return (
    <div className="app-form-list-header">
      <h5>
        App Form List{" "}
        <span onClick={props.onAddNewForm}>
          <Icon size={20} icon={plus} />
        </span>
      </h5>
    </div>
  );
};
export const AppFormEditorHeader = (props) => {
  return (
    <div className="app-form-editor-header">
      <h5>
        {props.selectedAppForm ? props.selectedAppForm.description : "No Form Selected"}{" "}
        <ul className="app-form-editor-controls">
          <li>
            <Icon size={20} icon={arrowUp} onClick={() => props.handleMove(-1)} />
          </li>
          <li>
            <Icon size={20} icon={arrowDown} onClick={() => props.handleMove(1)} />
          </li>
          <li>
            <SaveOne handleClick={props.handleSave} iconChanged={props.iconChanged} size={20} />
          </li>
        </ul>
      </h5>
    </div>
  );
};
export const AppFormToolBar = (props) => {
  return (
    <div>
      <SaveOne handleClick={props.handleSave} iconChanged={props.iconChanged} size={32} />
    </div>
  );
};
export const SaveOne = (props) => {
  return (
    <span className="item-icon" onClick={props.handleClick}>
      <Icon icon={ic_save} size={props.size} />
    </span>
  );
};
