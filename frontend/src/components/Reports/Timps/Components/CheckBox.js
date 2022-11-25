import React from 'react'

export const CheckBox = (props) => {
    const { field,values } = props || undefined;
    if (field && values) {
        let value = null;
        let key = Object.keys(values).find(key => key == field.field_name);
        if(key)
        {
            value = values[key];
        }
        return (
            <div style={{ marginTop: '3px' }}>
                <input type={field.field_type} name={field.field_name} checked={value =="True" ? true : false} disabled={true} />
                <label className="label-style">{field.field_label}</label>
            </div>)
    }
}

