import React, { Component } from 'react'
import { Label, Field, Required, MyButton } from './formsMiscItems'
import { Control, Errors } from 'react-redux-form'
import propTypes from 'prop-types'
class InputTextField extends Component {
  constructor(props) {
    super(props)
    this.errorWrapper = props => <div style={{ marginTop: '5px', fontSize: '12px', color: '#9d0707' }}>{props.children}</div>
    this.errorShow = { touched: true, focus: false }
  }

  render() {
    let requiredVal = {}
    if (this.props.requiredField) {
      requiredVal = {
        required: val => val && val.length
      }
    }
    return (
      <Field>
        <Label>
          {this.props.textLabel}
          {this.props.requiredField && <Required />}
        </Label>
        <Control.text
          model={this.props.fieldModel}
          placeholder={this.props.fieldPlaceHolder ? this.props.fieldPlaceHolder : ''}
          validators={this.props.fieldValidator ? this.props.fieldValidator : requiredVal}
          disabled={this.props.disabled ? true : false}
          onChange={this.props.handleInputChange}
          name={this.props.name}
        />
        <Errors
          model={this.props.fieldModel}
          wrapper={this.errorWrapper}
          component={this.props.errorComponent ? this.props.errorComponent : this.errorComponent}
          show={this.errorShow}
          messages={{
            required: this.props.errorMessage ? this.props.errorMessage : 'missing ' + this.props.fieldModel
          }}
        />
      </Field>
    )
  }
}

InputTextField.propTypes = {
  textLabel: propTypes.string,
  requiredField: propTypes.bool,
  fieldModel: propTypes.string,
  fieldPlaceHolder: propTypes.string,
  fieldValidator: propTypes.object,
  errorComponent: propTypes.func,
  errorMessage: propTypes.string
}

export default InputTextField
