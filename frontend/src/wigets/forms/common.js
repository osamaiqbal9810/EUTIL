import React from "react";

export const createFieldFromTemplate = (name, placeholder, labelText = "", value = "", index = null) => {
  let fieldObj = {
    element: "input",
    value: value,
    label: labelText !== "",
    labelText,
    containerConfig: {},
    config: {
      name,
      type: "text",
      placeholder,
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: "",
  };
  if (index !== null && typeof index === "number") {
    fieldObj.index = index;
  }

  return fieldObj;
};

export const updateGenericOptionsWithValue = (
  optionsToIterate,
  valField,
  valText,
  fieldName,
  formToFillIn,
  value,
  fillEmptyTop = false,
  placeHolderForEmpty,
) => {
  let options = optionsToIterate.map(op => ({ val: op[valField], text: op[valText] }));
  formToFillIn[fieldName].config.options = options;
  fillEmptyTop && options.unshift({ val: "", text: placeHolderForEmpty });
  let activeValue = value ? value : options[0] ? options[0].val : "";
  formToFillIn[fieldName].value = activeValue;
  formToFillIn[fieldName].valid = activeValue !== "";

  return activeValue;
};

export const updateFormFieldsWithValues = (form, keys, valueObj) => {
  keys.forEach(key => {
    form[key].value = valueObj[key];
    form[key].valid = true;
  });
};

const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear - 20, 0);
const toMonth = new Date(currentYear + 10, 11);

export function YearMonthForm({ date, localeUtils, onChange }) {
  const months = localeUtils.getMonths();

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(e) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  return (
    <form className="DayPicker-Caption">
      <div className="row">
        <div className="col-4">
          <select name="month" onChange={handleChange} value={date.getMonth()}>
            {months.map((month, i) => (
              <option key={month} value={i}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="col-4">
          <select name="year" onChange={handleChange} value={date.getFullYear()}>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}
