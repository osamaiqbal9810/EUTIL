import React, { Component } from "react";
import DataTiles from "./DataTiles/DataTiles";
import { getStatusColor } from "../../../../utils/statusColors.js";
import { Row, Col } from "reactstrap";
class DailyTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tileFields: [
        { id: "futureInspection", label: "Planned", value: "5", bgColor: getStatusColor("Future Inspection") },
        { id: "inProgress", label: "In Progress", value: "2", bgColor: getStatusColor("In Progress") },
        { id: "finished", label: "Finished", value: "0", bgColor: getStatusColor("Finished") },
      ],
    };
  }
  render() {
    return (
      <Row>
        <Col md={12}>
          <Miniheading heading={"Daily"} />
        </Col>
        <Col md={2}>
          <DataTiles tileFields={this.state.tileFields} />
        </Col>
      </Row>
    );
  }
}

export default DailyTile;

const Miniheading = (props) => {
  return <div style={{ fontSize: "12px", color: "var(--first)", fontWeight: 600 }}>{props.heading}</div>;
};
