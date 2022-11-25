import React, { Component } from "react";
import { languageService } from "../../Language/language.service";

class SelectOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selected: "",
      name: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { options: nextProps.options, selected: nextProps.selected, name: nextProps.name };
  }

  //   componentDidMount() {
  //     if (this.props.options) {
  //       this.mapOptions()
  //     }
  //   }

  //   componentDidUpdate(prevProps, prevState) {
  //     if (this.props.options !== prevProps.options) {
  //       this.mapOptions()
  //     }
  //   }
  handleChange(event) {
    //console.log('selectOption', this.props.name,' = ' , event.target.value);
    this.props.onChange(this.props.name, event.target.value);
    this.setState({ selected: event.target.value });
  }

  render() {
    let opts = this.state.options.map((val, index) => {
      let disable = false;
      let optionStyle = {};
      if (val.startsWith("---") && val.endsWith("---")) {
        // it's a header disable it
        val = val.substring(3, val.length - 3); // trim --- from both sides
        disable = true;
        optionStyle = { ...optionStyle, color: "white", backgroundColor: "var(--first)" };
      }

      if (val === this.state.selected) {
        return (
          <option style={optionStyle} key={val} value={val} selected disabled={disable}>
            {" "}
            {languageService(val)}{" "}
          </option>
        );
      }

      return (
        <option style={optionStyle} disabled={disable} key={val} value={val}>
          {" "}
          {languageService(val)}{" "}
        </option>
      );
    });
    let datalist = this.state.options[0] === "";

    return (
      <div>
        {!datalist && <select onChange={this.handleChange}> {opts} </select>}
        {datalist && (
          <div>
            <input value={this.state.selected} list={this.state.name} onChange={this.handleChange} />
            <datalist id={this.state.name}>{opts}</datalist>
          </div>
        )}
      </div>
    );
  }
}

export default SelectOption;
