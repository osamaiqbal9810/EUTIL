import React, { Component } from "react";
import { Tooltip } from "reactstrap";
import { languageService } from "../../Language/language.service";
export default class CustomTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltip: false,
    };
  }

  render() {
    return (
      <Tooltip isOpen={this.state.tooltip} target={this.props.target} toggle={() => this.setState({ tooltip: !this.state.tooltip })}>
        {languageService(this.props.value)}
      </Tooltip>
    );
  }
}
