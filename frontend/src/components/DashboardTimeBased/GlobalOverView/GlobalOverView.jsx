import React, { Component } from "react";
import GlobalOverViewSummaryCard from "../CommonControls/GlobalOverViewSummaryCard";
import { ic_search } from "react-icons-kit/md/ic_search";
import { ic_library_books } from "react-icons-kit/md/ic_library_books";
import { ic_build } from "react-icons-kit/md/ic_build";
import { Row, Col } from "reactstrap";
import "../dashboard.css";
class GlobalOverView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: this.props.lines,
      fields: [
        { id: "totalInspections", label: "Inspections", type: "Inspections", value: "10", bgColor: "var(--first)", icon: ic_search },
        { id: "inProgress", label: "In Progress", type: "Inspections", value: "2", bgColor: "#25a9e0", icon: ic_search },
        { id: "totalIssues", label: "Total Issues", type: "Issues", value: "30", bgColor: "var(--first)", icon: ic_library_books },
        {
          id: "highPriorityIssues",
          label: "High Priority Issues",
          type: "Issues",
          value: "2",
          bgColor: "#ec1c24",
          icon: ic_library_books,
        },
        {
          id: "plannedMaintenance",
          label: "Planned Maintenance",
          type: "Maintenance",
          value: "3",
          bgColor: "#f6921e",
          icon: ic_build,
        },
        { id: "notstarted", label: "Not Started", type: "Maintenance", value: "13", bgColor: "rgb(166, 168, 171)", icon: ic_build },
      ],
    };
  }
  componentDidMount() {}
  render() {
    return (
      <Col md={12}>
        <Row>
          <PageTitle></PageTitle>
          <div className="dashboard-summary">
            <Row>
              <SectionTitle></SectionTitle>
              <GlobalOverViewSummaryCard data={this.state.fields[0]} />
              <GlobalOverViewSummaryCard data={this.state.fields[1]} />
              <GlobalOverViewSummaryCard data={this.state.fields[2]} />
              <GlobalOverViewSummaryCard data={this.state.fields[3]} />
              <GlobalOverViewSummaryCard data={this.state.fields[4]} />
              <GlobalOverViewSummaryCard data={this.state.fields[5]} />
            </Row>
          </div>
        </Row>
      </Col>
    );
  }
}

export default GlobalOverView;

const PageTitle = (props) => {
  return (
    <div style={{ borderBottom: "2px solid rgb(209, 209, 209)", margin: "0px 20px", padding: "10px 0px", width: "100%" }}>
      <Col md={12}>
        <Row>
          <div style={{ float: "left", fontFamily: "Myriad Pro", fontSize: "24px", letterSpacing: "0.5px", color: "var(--first)" }}>
            Dashboard
          </div>
        </Row>
      </Col>
    </div>
  );
};

const SectionTitle = (props) => {
  return (
    <Col md={12}>
      <Row>
        <div style={{ padding: "0px 0px 0px 22px" }}>
          <h4 style={{ float: "left", fontFamily: "Arial", fontSize: "18px", letterSpacing: "0.95px", color: "var(--first)" }}>
            Overview Summary
          </h4>
        </div>
      </Row>
    </Col>
  );
};
