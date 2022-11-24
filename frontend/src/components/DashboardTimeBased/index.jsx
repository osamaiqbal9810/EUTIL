import React, { Component } from "react";
import GlobalOverView from "./GlobalOverView/GlobalOverView";
import LineComponentView from "./LineComponentView/LineComponentView";
class DashboardV1TimeBased extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [{ id: "1", name: "NHSL" }],
    };
  }

  render() {
    let linesComp = null;
    linesComp = this.state.lines.map(line => {
      return <LineComponentView line={line} key={line.id} />;
    });
    return (
      <div>
        <GlobalOverView lines={this.state.lines} />
        {linesComp}
      </div>
    );
  }
}

export default DashboardV1TimeBased;
