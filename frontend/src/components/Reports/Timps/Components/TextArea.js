
import React from 'react'

export const TextArea = (props) => {
    const { field, values } = props || undefined;
    if (field && values) {
        let value = null;
        let key = Object.keys(values).find(key => key == field.field_name);
        if (key) {
            value = values[key];
        }
        return (
            <div style={{ marginTop: '3px' }}>
                <label className="label-style">{field.field_label}</label>
                <br></br>
                <textarea disabled={true} type={field.field_type} rows={10} value={value ? value : ''} name={field.field_name} style={{ width: '100%' }} />
            </div>)

    }
}


