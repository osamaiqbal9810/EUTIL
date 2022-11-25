import React from "react";
// import DatePicker from 'react-datepicker'
// import "react-datepicker/dist/react-datepicker.css";

import { showValidation } from "./utilities/showValidation"
import { showLabel } from "./utilities/showLabel"

const DatePickerField = (props) => {

    let { formId, field } = props;
    let { element } = field;

    return (<div className="field-style">
        {showLabel(field, formId)}
        {/* <DatePicker
            placeholderText={element.placeholder.visible ? element.placeholder.value.toUpperCase() : ""}
            id={formId + "_" + field.id}
            name={formId + "_" + field.id}
            selected={element.value}
            disabled={element.disabled}
            onChange={(date) => props.changeHandler({ target: { value: date } }, false)}
            dateFormat={element.settings[element.type].format}
            minDate={element.settings[element.type].minDate}
            maxDate={element.settings[element.type].maxDate}
            showMonthDropdown={element.settings[element.type].showYearMonthControls}
            showYearDropdown={element.settings[element.type].showYearMonthControls}
        /> */}
        {showValidation(field)}
    </div>
);
};

export default DatePickerField;