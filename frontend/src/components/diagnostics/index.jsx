import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { Switch, Route, Link } from "react-router-dom";
import ApplicationLookups from "./applicationlookups/index";
import Permissions from "./permissions/index";
import UserGroupPermission from "./groupsPermission/index";
import DiagOptions from "./DiagOptions";
import { optionsTexts } from "./options";
import DynamicLang from "./DynamicLang/index";
import Patches from "./Patches/index";

class Diagnostics extends Component {
  componentWillMount() {
    let check = false;
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const currentUser = JSON.parse(loggedInUser);
      if (currentUser) {
        check = currentUser.isAdmin ? currentUser.isAdmin : false;
      }
    }
    if (!check) {
      this.props.history.push("/");
    }
  }

  render() {
    const { path } = this.props.match;
    return (
      <Col md="12">
        <DiagOptions list={optionsTexts} path={path} />
        <Row>
          <Switch>
            <Route path={`${path}/applicationLookups`} component={ApplicationLookups} />
            <Route path={`${path}/permission`} component={Permissions} />
            <Route path={`${path}/usergrouppermissions`} component={UserGroupPermission} />
            <Route path={`${path}/dynamiclanguage`} component={DynamicLang} />
            <Route path={`${path}/patches`} component={Patches}/>
          </Switch>
        </Row>
      </Col>
    );
  }
}

export default Diagnostics;
