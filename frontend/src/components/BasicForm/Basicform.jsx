import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import "../Common/commonform.css";
import "../Common/Forms/formsMiscItems";

class BasicForm extends Component {
  constructor() {
    super();
    this.state = { label: "First Name" };
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          {this.state.label}:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default BasicForm;
