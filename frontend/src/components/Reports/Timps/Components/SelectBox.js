import React from 'react'

export const SelectBox = (props) => {
    const { field,values } = props || undefined;
    if (field && values ) {
        let value = null;
        let key = Object.keys(values).find(key => key == field.field_name);
        if(key)
        {
            value = values[key];
        }
        return (
            <div >
                <label className="label-style">{field.field_label}</label>
                <br></br>
                <select name={field.field_name} disabled={true}>
                    {
                        field.options.map((option) => {
                            return (
                                <option value={option.value} selected={option.value == value ? true : false}>{option.label}</option>
                            )
                        })
                    }
                </select>
            </div>)
    }
}

