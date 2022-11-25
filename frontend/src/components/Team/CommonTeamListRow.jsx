import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import Gravatar from "react-gravatar";
export default class CommonTeamListRow extends Component {
  render() {
    let list = null;
    if (this.props.userList) {
      list = this.props.userList.map((user, index) => {
        return <CommonTeamRow key={index} user={user} />;
      });
    }
    return (
      <Col md={12} style={{ background: "#fff", boxShadow: "3px 3px 5px #cfcfcf" }}>
        {list}
      </Col>
    );
  }
}

class CommonTeamRow extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      rowContainer: {
        padding: "10px",
        background: "var(--fifth)",
        borderTop: "1px solid #e2e2e2",
        margin: "0px 0px",
        fontSize: "12px",
        textAlign: "-webkit-auto",
      },
      rowIconContainer: { display: "inline-block" },
      rowIcon: {},
      rowNameContainer: { display: "inline-block" },
      rowName: {},
      rowEmailContainer: { display: "inline-block" },
      rowEmail: {},
    };
  }
  render() {
    return (
      <Row style={this.styles.rowContainer}>
        <Col md={2}>
          {" "}
          <Gravatar email={this.props.user.email} size={20} />
        </Col>
        <Col md={4}> {this.props.user.name} </Col>
        <Col md={4}> {this.props.user.email} </Col>
        <Col md={2}> Actions </Col>
      </Row>
    );
  }
}
