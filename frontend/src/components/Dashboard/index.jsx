/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import DashboardPage from "./DashboardPage";
class DashboardMain extends Component {
  render() {
    let dashBoard = <DashboardPage history={this.props.history} />;
    return <div>{dashBoard}</div>;
  }
}

export default DashboardMain;
