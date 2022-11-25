import CreatableSelect from "react-select";
import { showValidation } from "./utilities/showValidation";
import { showLabel } from "./utilities/showLabel";
import { createNewCreateableSelectOption } from '../../../utils/select-options'
import React, { Component } from "react";

class CreateableSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
  }

  setInputValue(val) {
    this.setState({
      inputValue: val,
    });
  }

  handleKeyDown(event) {
    let { inputValue } = this.state;
    let { field } = this.props;
    let { element } = field;
    const value = element.value;

    if (!inputValue || inputValue === "") return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        this.setInputValue("");
        this.props.changeHandler({ target: { value: [...value, createNewCreateableSelectOption(inputValue)] } }, false);
        event.preventDefault();
    }
  }

  render() {
    let { inputValue } = this.state;
    let { formId, field } = this.props;
    let { element } = field;
    const value = element.value;
    return (
      <div className="field-style">
        {showLabel(field, formId)}
        <CreatableSelect
          placeholder={element.placeholder.visible ? element.placeholder.value : ""}
          id={formId + "_" + field.id}
          name={formId + "_" + field.id}
          value={value}
          components={{ DropdownIndicator: null }}
          inputValue={inputValue}
          isClearable
          isMulti
          menuIsOpen={false}
          isDisabled={element.disabled}
          onChange={(val) => this.props.changeHandler({ target: { value: val } }, false)}
          onInputChange={(val) => this.setInputValue(val)}
          onBlur={() => this.props.changeHandler({ target: { value: value } }, true)}
          onKeyDown={this.handleKeyDown}
          className="basic-multi-select input-style"
          classNamePrefix="select"
        />

        {showValidation(field)}
      </div>
    );
  }
}

export default CreateableSelectField;
