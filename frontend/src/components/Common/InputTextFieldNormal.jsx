import React, { Component } from 'react'
import { Field, Label } from './Forms/formsMiscItems'

class InputTextFieldNormal extends Component {
  render() {
    return (
      <Field>
        <Label>{this.props.label} </Label>
        <input name={this.props.name} onChange={this.props.onChange} defaultValue={this.props.defaultValue} />
      </Field>
    )
  }
}

export default InputTextFieldNormal
