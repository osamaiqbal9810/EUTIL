import React from "react";
import { Col } from "reactstrap";
import "./style.css";
import { checkAllValidations } from "../validations";
import Field from "./fields/index";

const FormField = (props) => {
  let field = props.field;
  let formId = props.formId;
  let { id } = field;

  const onClick = (e) => {
    props.onClick(id); // button callback
  };

  // Change state field
  const changeHandler = (e, blur) => {
    let { value } = e.target;
    let { validations, type } = field.element;
    let { fieldValid, validationMessage } = checkAllValidations(validations, value, type);

    // Callback only if value needs to be changed
    props.change(id, value, blur, fieldValid, validationMessage);
  };

  return (
    <React.Fragment>
      {!field.element.hide && (
        <Col md={field.element.uiConfig.col}>
          <div className={"field"} {...field.element.uiConfig.container}>
            <Field
              field={field}
              formId={formId}
              onClick={onClick}
              changeHandler={changeHandler}
              onEnterPressed={(e) => props.onEnterPressed && props.onEnterPressed(e)}
            />
          </div>
        </Col>
      )}
    </React.Fragment>
  );
};

export default FormField;
