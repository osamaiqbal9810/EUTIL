import React from 'react';
import FormLayout1 from "./FormLayout1";
import FormLayout2 from "./FormLayout2";

const DefaultFormLayout = ({form}) => {
    const {id} = form;

    switch (id) {
        case 'form1':
            return <FormLayout1
                    form={form.form}
                />;

        case 'form2':
            return <FormLayout2 form={form.form}/>;

        default:
            return <FormLayout1 form={form.form}/>;
    }


};

export default DefaultFormLayout;