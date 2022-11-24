/**
 * Created by Shehz on 18-Jun-18.
 */
import React from 'react';

export default function(ComposedClass) {
    class DatePickerWrapper extends React.Component {

        render () {
            return (
                <div>
                    <ComposedClass
                        {...this.props}
                    />
                </div>
            )
        }
    }

    return DatePickerWrapper
}
