import React from "react";
export const AppFormEditor = (props) => {
  let fieldList =
    props.selectedAppForm &&
    props.selectedAppForm.opt1 &&
    props.selectedAppForm.opt1.map((field, index) => {
      return (
        <AppFormFieldRow
          key={field.id + index}
          field={field}
          appForm={props.selectedAppForm}
          handleSelectedField={props.handleSelectedField}
          activeRowID={props.activeRowID}
        />
      );
    });
  return <div className="app-form-editor">{fieldList}</div>;
};

const AppFormFieldRow = (props) => {
  return (
    <div
      className={props.activeRowID == props.field.id ? "app-form-row active" : "app-form-row"}
      id={props.field.id}
      onClick={(e) => {
        props.handleSelectedField(props.field, props.appForm._id);
      }}
    >
      <span className="app-form-pills">{props.field.fieldType}</span>
      {props.field.fieldName && <span className="app-form-name">{props.field.fieldName}</span>}
      <span className="app-form-id">({props.field.id})</span>
    </div>
  );
};
