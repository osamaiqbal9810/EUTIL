import React from "react";
// import DatePicker from 'react-datepicker'
// import "react-datepicker/dist/react-datepicker.css";

import { showValidation } from "./utilities/showValidation"
import { showLabel } from "./utilities/showLabel"

const TimePickerField = (props) => {

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
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat={element.settings[element.type].format}
                minTime={element.settings[element.type].minTime}
                maxTime={element.settings[element.type].maxTime}
            /> */}
            {showValidation(field)}
        </div>
    );
};

export default TimePickerField;