import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import SetupOptions from "./SetupOptions";
// import { optionsTexts } from './options'
import Radium from "radium";
import { Switch, Route, Link } from "react-router-dom";
import permissionCheck from "./../../utils/permissionCheck.js";
// import LineSelectionWrapper from 'components/TrackLineSelect/LineSelectionWrapper'
import { timpsSetupRoute, setupRoute } from "./../../routes/setupRoutes/setupRoutes.js";
import { themeService } from "theme/service/activeTheme.service";
import { setupStyle } from "./style/index";
import { versionInfo } from "../MainPage/VersionInfo";

class SetupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLine: null,
    };
    this.routeSetupComponent = null;
  }
  componentDidMount() {
    let viewSetupCheck = permissionCheck("SETUP", "view");
    if (!viewSetupCheck) {
      this.props.history.push("/");
    }

    if (this.props.location.pathname === "/Setup") this.props.history.push("/setup/staff");

    let routeToLoad = timpsSetupRoute;
    if (versionInfo.loaded && versionInfo.isLAMP()) routeToLoad = setupRoute;

    this.routeSetupComponent = routeToLoad.map((route) => {
      return permissionCheck(route.permissionCheckFirstArg, route.permissionCheckSecondArg) || route.permissionCheck == false ? (
        <Route key={route.path} path={route.path} component={route.component} />
      ) : (
        ""
      );
    });
  }

  render() {
    const { path } = this.props.match;

    const styles = getStyles(this.props, this.state);

    return (
      <Col id="mainContent" md="12">
        <Row>
          <Col md={themeService(setupStyle.linkColSize).size} style={{ ...styles.optionsPannelContainer, paddingLeft: "27px" }}>
            <SetupOptions path={path} history={this.props.history} />
          </Col>
          <Col md={themeService(setupStyle.detailColSize).size} style={themeService(styles.pannelColContainer)}>
            <Switch>
              {/* <Route path={`${path}/Company`} component={Company} />
              <Route path={`${path}/Staff`} component={User} />
              <Route path={`${path}/Run`} component={RunNumber} />
              <Route path={`${path}/Runs/:line/:id`} component={RunNumberDetail} /> */}
              {this.routeSetupComponent}
            </Switch>
          </Col>
        </Row>
      </Col>
    );
  }
}

let getStyles = (props, state) => {
  return {
    optionsPannelContainer: {
      padding: "30px 0px 0px 15px",
    },
    pannelColContainer: {
      default: {
        margin: "30px 0px 0px 0px",
        padding: "0px 15px 15px 0px",
      },
      retro: {
        margin: "30px 0px 0px 0px",
        padding: "0px 15px 15px 0px",
      },
      electric: {
        margin: "30px 0px 0px 0px",
        padding: "0px 15px 15px 0px",
      },
    },
  };
};

export default Radium(SetupPage);
