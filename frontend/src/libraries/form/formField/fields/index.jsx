import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import SelectField from "./SelectField";
import MultiSelectField from "./MultiSelectField";
import CreateableSelectField from "./CreateableSelectField";
import DatePickerField from "./DatePickerField";
import TimePickerField from "./TimePickerField";
import DateTimePickerField from "./DateTimePickerField";
import RadioButtonField from "./RadioButtonField";
import CheckBoxField from "./CheckBoxField";
import ButtonField from "./ButtonField";
import FileField from "./FileField";
import React from "react";

const Fields = {
  input: InputField,
  textarea: TextAreaField,
  select: SelectField,
  multiSelect: MultiSelectField,
  date: DatePickerField,
  time: TimePickerField,
  dateTime: DateTimePickerField,
  radio: RadioButtonField,
  checkbox: CheckBoxField,
  button: ButtonField,
  file: FileField,
  createableSelect: CreateableSelectField
};

const Field = (props) => {
  let { field } = props;
  let { element } = field;
  let formTemplate = null;

  if (Fields.hasOwnProperty(element.type)) {
    if (typeof Fields[element.type] === "function") {
      formTemplate = React.createElement(Fields[element.type], { ...props });
    }
  }

  return formTemplate;
};

export default Field;
