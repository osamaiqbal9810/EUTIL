import { showRequired } from "./showRequired"
import React  from 'react';

export const showLabelSmall = (field, formId) => {
    return showLabel(field, formId, "show-label-small");
};

export const showLabel = (field, formId, style) => {
    style = style ? style : "lbl-style";

    const { visible, value, valueExtension } = field.element.label;
    const required = field.element.validations.findIndex(val => val.type === "required") !== -1;

    return visible ? (
      <label className={style} htmlFor={formId + "_" + field.id}>
        {" "}
        {value + " " + valueExtension} {showRequired(required)}
      </label>
    ) : (
      <label className={style}>{showRequired(required)}</label>
    );
};