import React from "react";
import { appFormFieldtypes } from "./AppFormInfo";
import Icon from "react-icons-kit";
import { download } from "react-icons-kit/icomoon/download";
import { upload } from "react-icons-kit/icomoon/upload";

export const AppFormAdd = (props) => {
  let addTypes = appFormFieldtypes.map((fieldType) => {
    return <AddTypeRow key={fieldType.type} type={fieldType.type} fieldType={fieldType} handleAddType={props.handleAddType} />;
  });

  return (
    <React.Fragment>
      <ul className="app-form-add">{addTypes}</ul>
      <ul className="app-form-controls">
        <li>
          <Icon size={20} icon={download} onClick={props.exportData} />
        </li>
        <li>
          <div className="input-file">
            <Icon size={20} icon={upload} />
            <input type="file" onChange={props.handleChange} />
          </div>
        </li>
      </ul>
    </React.Fragment>
  );
};

const AddTypeRow = (props) => {
  return (
    <li
      onClick={(e) => {
        props.handleAddType(props.fieldType);
      }}
    >
      {props.type}
    </li>
  );
};
