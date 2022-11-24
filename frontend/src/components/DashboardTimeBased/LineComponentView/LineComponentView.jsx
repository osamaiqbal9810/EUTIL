import React, { Component } from "react";
import _ from "lodash";
import LineSmartSummary from "./LineSmartSummary";
import { ic_expand_more } from "react-icons-kit/md/ic_expand_more";
import { Icon } from "react-icons-kit";
import LineDetailData from "./LineDetailData/LineDetailData";
class LineComponentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      smartSummary: smartSummary,
      displayDetail: true,
    };
    this.handleDisplayClick = this.handleDisplayClick.bind(this);
  }
  handleDisplayClick() {
    this.setState({
      displayDetail: !this.state.displayDetail,
    });
  }
  render() {
    return (
      <div style={{ background: "#fff" }}>
        <div>
          <LineNameArea name={this.props.line.name} />
          <LineSmartSummary smartSummary={this.state.smartSummary} />
          <DropDownIcon icon={ic_expand_more} displayDetail={this.state.displayDetail} handleDisplayClick={this.handleDisplayClick} />
        </div>
        {this.state.displayDetail && <LineDetailData />}
      </div>
    );
  }
}

export default LineComponentView;

const LineNameArea = props => {
  return <div style={{ display: "inline-block" }}> {props.name}</div>;
};

const DropDownIcon = props => {
  let iconShowHideStyle = {
    background: "transparent",
    border: "none",
    display: "inline-block",
    verticalAlign: "bottom",
    color: "rgb(64, 118, 179)",
    transition: "all .3s ease-in-out",
    cursor: "pointer",
    outline: "0px",

    transform: "rotate(" + (props.displayDetail ? 180 : 0) + "deg)",
  };
  return (
    <div style={{ display: "inline-block" }}>
      <button onClick={props.handleDisplayClick} style={iconShowHideStyle}>
        <Icon size={"24"} icon={props.icon} style={{ color: "rgba(64, 118, 179)", verticalAlign: "top" }} />
      </button>
    </div>
  );
};

const smartSummary = [
  { id: "inProgress", value: "5", label: "Inspection", bgColor: "#25a9e0" },
  { id: "issues", value: "3", label: "Issues", bgColor: "#ec1c24" },
  // third: { id: "", value: "", label: "", bgColor: "" },
  // fourth: { id: "", value: "", label: "", bgColor: "" },
];
