/* eslint eqeqeq: 0 */
import React from "react";
import { themeService } from "../../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { languageService } from "../../../Language/language.service";
import { Col, Input, Row } from "reactstrap";

const FormLayout1 = (props) => {
  return (
    <React.Fragment>
      {props.form &&
        props.form.form &&
        props.form.form.length &&
        props.form.form.map((f, index) => <ResponseFormFieldArea field={f} key={index} {...props} />)}
    </React.Fragment>
  );
};

export default FormLayout1;

const ResponseFormFieldArea = (props) => {
  let row = null;
  if (props.fields) {
    row = props.fields.map((row, index) => {
      return <FieldRowData {...props} key={row.id} data={row} />;
    });
  }

  return <FieldRowData {...props} data={props.field} headings={props.headings} />;
};

const FieldRowData = (props) => {
  return props.data ? (
    <Row
      style={{
        border: "1px solid ##e7e7e7",
        boxShadow: " rgba(0, 0, 0, 0.15) 1px 1px 5px",
        borderRadius: "4px",
        padding: "0px",
        margin: "10px 5px",
      }}
    >
      <Col md={6} style={{ padding: "0px" }}>
        <SingleView heading field={props.data} value={props.data && props.data.name ? props.data.name : ""} {...props} />
      </Col>

      <Col md={6} style={{ padding: "0px" }}>
        <SingleView field={props.data} value={props.data && props.data.value ? props.data.value : ""} {...props} />
      </Col>
    </Row>
  ) : null;
};

const SingleView = (props) => {
  let colon = props.field.description !== " " && props.field.description ? ":" : "";
  const { type } = props.field;
  let { handleUpdateFormsState, formIndex, formsStack, appForms } = props;

  const processAppFormClick = (form) => {
    if (form.length) {
      formsStack.push({ formIndex, appForms });
      formIndex = 0;
      appForms = form;

      if (Array.isArray(appForms[formIndex])) {
        appForms = appForms.reduce((arr, f) => {
          arr.push(f[0]);
          return arr;
        }, []);
      }

      handleUpdateFormsState({ formsStack, appForms, formIndex });
    }
  };

  if (!["checkbox", "radio", "submit", "password", "table"].includes(type))
    return (
      <div>
        <div style={{ textAlign: "left", padding: "15px 15px" }}>
          {props.value} {colon}
        </div>
      </div>
    );

  return (
    <div>
      {type === "checkbox" && (
        <div style={{ marginLeft: "15px" }}>
          {props.heading ? props.value : <Input type="checkbox" disabled checked={props.value ? props.value : false} />}
        </div>
      )}
      {type === "radio" && (
        <div style={{ marginLeft: "15px" }}>
          {props.heading ? props.value : <Input type="radio" disabled checked={props.value ? props.value : false} />}
        </div>
      )}
      {type === "submit" && <div style={{ marginLeft: "15px" }}>{props.heading ? props.value : <Input type="submit" disabled />}</div>}
      {type === "password" && <div style={{ marginLeft: "15px" }}>{props.heading ? props.value : <Input type="password" disabled />}</div>}
      {type === "table" && (
        <div style={{ marginLeft: "15px" }}>
          {props.heading ? props.value : <button onClick={() => processAppFormClick(props.value)}>App Form</button>}
        </div>
      )}
    </div>
  );
};
