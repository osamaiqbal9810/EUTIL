import React, { Component } from "react";

class LineSmartSummary extends Component {
  render() {
    let smartSums = null;
    console.log(this.props.smartSummary);
    smartSums = this.props.smartSummary.map(summ => {
      return <SmartSummaryComp key={summ.id} value={summ.value} bgColor={summ.bgColor} label={summ.label} />;
    });
    return <div style={basicStyling}>{smartSums} </div>;
  }
}

export default LineSmartSummary;

const SmartSummaryComp = props => {
  return (
    <div style={basicStyling}>
      <div style={basicStyling}>Color </div>
      <div style={basicStyling}>
        <div>{props.value} </div>
        <div> {props.label} </div>
      </div>
    </div>
  );
};
const basicStyling = {
  display: "inline-block",
};
