import React, { Component } from "react";
import "./index.css";

// interface IProps {
//   options: Array<string | number>;
//   value: string | number;
//   disabled?: boolean;
//   onSelected?: { (val: string | number): void };
// }
// interface IStates {}

class ToggleButton extends Component {
  constructor(props) {
    super(props);
    this.onClickTouch = this.onClickTouch.bind(this);
  }

  onClickTouch(option) {
    let { disabled, onSelected } = this.props;
    !disabled && onSelected && onSelected(option);
  }

  render() {
    let { options, value, disabled } = this.props;
    let no_of_option = options.length;
    return (
      <div className={`toggle-button-flex ${disabled ? "disabled" : ""}`}>
        {options.map((option, index) => {
          let selected = option === value;
          return (
            <div
              key={`option${index}`}
              onClick={() => !selected && this.onClickTouch(option)}
              onTouchEnd={() => !selected && this.onClickTouch(option)}
              className={`option ${selected && "selected"} ${index >= 0 && index < no_of_option - 1 && "right-border"}`}
            >
              {option}
            </div>
          );
        })}
      </div>
    );
  }
}

export default ToggleButton;
