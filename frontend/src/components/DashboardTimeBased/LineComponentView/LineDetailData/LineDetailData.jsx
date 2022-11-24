import React, { Component } from "react";
import DailyTile from "./DailyTile";
import { Row, Col } from "reactstrap";
class LineDetailData extends Component {
  render() {
    return (
      <Row>
        <Col md={9}>
          <DailyTile />
        </Col>
      </Row>
    );
  }
}

export default LineDetailData;
