
import React from 'react'
import {Col } from 'reactstrap';
import { CheckBox } from "./CheckBox";
import { TextArea } from './TextArea';
import { InputField } from './InputField';
import { SelectBox } from './SelectBox';
export const TabSection = (props) => {
    const { tabSection,appFormValues } = props || undefined;
    if (tabSection && appFormValues) {
        return (
            <Col md={3}>
                <div style={{ border: '1px solid lightgrey', padding: '10px', margin: '10px' }}>
                    <div>
                        <p style={{ fontWeight: 'bold' }}>{tabSection.section_name ? tabSection.section_name : ''}</p>
                    </div>
                    <div>
                        {
                            tabSection.fields.map((field) => {
                                if (field && field.field_type == "select") {
                                   return(<SelectBox field={field} values={appFormValues}/>)
                                } else if (field && field.field_type == "text") {
                                    return(<InputField field={field} values={appFormValues} />)
                                }
                                else if (field && field.field_type == "checkbox") {
                                   return(<CheckBox field={field} values={appFormValues}/>)
                                }
                                else if (field && field.field_type == "textArea") {
                                   return(<TextArea field={field} values={appFormValues}/>)
                                }
                            })
                        }
                    </div>
                </div>
            </Col>
        )

    }
}


