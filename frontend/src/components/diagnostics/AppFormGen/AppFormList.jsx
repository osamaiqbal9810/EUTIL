import React from "react";
export const AppFormList = (props) => {
  let appForms = props.appForms.map((appForm) => {
    return (
      <AppFormRow
        handleSelectAppForm={props.handleSelectAppForm}
        appForm={appForm}
        key={appForm._id}
        selectedAppFormCode={props.selectedAppFormCode}
      />
    );
  });
  return <div className="app-form-list"> {appForms}</div>;
};
const AppFormRow = (props) => {
  return (
    <div
      onClick={(e) => {
        props.handleSelectAppForm(props.appForm);
      }}
      className={props.appForm.code === props.selectedAppFormCode ? "active" : ""}
    >
      {props.appForm.description}
    </div>
  );
};
