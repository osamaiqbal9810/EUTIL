import React, { Component } from 'react'
import { Label, Field, Required, MyButton } from './formsMiscItems'
import { Control, Errors } from 'react-redux-form'
import propTypes from 'prop-types'
class InputSelectOptionField extends Component {
  constructor(props) {
    super(props)
    this.errorWrapper = props => <div style={{ marginTop: '5px', fontSize: '12px', color: '#9d0707' }}>{props.children}</div>
    this.errorShow = { touched: true, focus: false }
    this.state = {
      optionFieldComponent: null
    }
  }
  componentDidMount() {
    if (this.props.optionFields) {
      this.mapOptionField()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.optionFields !== prevProps.optionFields) {
      this.mapOptionField()
    }
  }
  mapOptionField() {
    let optionFieldComp = this.props.optionFields.map((option, index) => {
      return (
        <option key={index} value={option}>
          {option}
        </option>
      )
    })
    this.setState({
      optionFieldComponent: optionFieldComp
    })
  }

  render() {
    let optionFieldComp = null
    if (this.props.optionFields) {
      optionFieldComp = this.props.optionFields.map((option, index) => {
        return (
          <option key={index} value={option}>
            {option}
          </option>
        )
      })
    }
    if (this.props.optionChildren) {
      optionFieldComp = this.props.optionChildren
    }
    return (
      <Field>
        <Label>
          {this.props.textLabel}
          {this.props.requiredField && <Required />}
        </Label>
        <Control.select model={this.props.fieldModel} onChange={this.props.handleInputChange} name={this.props.name}>
          {optionFieldComp}
        </Control.select>

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

InputSelectOptionField.propTypes = {
  textLabel: propTypes.string,
  requiredField: propTypes.bool,
  fieldModel: propTypes.string,
  fieldPlaceHolder: propTypes.string,
  fieldValidator: propTypes.object,
  errorComponent: propTypes.func,
  errorMessage: propTypes.string
}

export default InputSelectOptionField
