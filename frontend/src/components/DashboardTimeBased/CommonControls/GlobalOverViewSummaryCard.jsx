import React, { Component } from "react";
import SvgIcon from "react-icons-kit";
import "../dashboard.css";
import { Row, Col } from "reactstrap";
class GlobalOverViewSummaryCard extends Component {
  render() {
    return (
      <Col lg={2} md={4} sm={4} xs={12}>
        <div className="summary-element" style={{ background: this.props.data.bgColor }}>
          <IconArea icon={this.props.data.icon} />
          <TextArea value={this.props.data.value} label={this.props.data.label} type={this.props.data.type} />
        </div>
      </Col>
    );
  }
}

export default GlobalOverViewSummaryCard;

const IconArea = props => {
  return (
    <div className="summary-icon">
      <div>
        <SvgIcon size={30} icon={props.icon} />
      </div>
    </div>
  );
};

const TextArea = props => {
  return (
    <div className="summary-text">
      <div className="summary-value">{props.value} </div>
      <div className="summary-label">{props.label} </div>
      <span className="summary-tag">{props.type}</span>
    </div>
  );
};

const MainControlStyle = {};
