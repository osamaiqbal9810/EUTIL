import React from 'react'

export const InputField = (props) => {
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
                <label className="label-style">{field.field_label}</label>
                <br></br>
                <input type={field.field_type} name={field.field_name} value={value ? value : ''} disabled={true} />
            </div>)
    }
}


