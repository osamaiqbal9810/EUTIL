import React, { Component } from "react";
import TopBar from "components/TopBar/TopBar";
import logo from "./../../logo.png";
import { Switch, Route, Link, withRouter } from "react-router-dom";
//import './App.css';
/* import LoginView from './../Login/LoginView';
import LoginPage from './../Login/LoginPage';
 */
import SideNavBar from "../SideNavBar/SideNavBar";
import moment from "moment";
import _ from "lodash";
import Basicform from "components/BasicForm/Basicform";
import * as types from "reduxRelated/ActionTypes/actionTypes.js";
import ForgotPassword from "components/Login/ForgotPassword/ForgotPassword";
import VerifyResetPass from "components/Login/ForgotPassword/VerifyResetPass";
import ResetPassword from "components/Login/ForgotPassword/ResetPassword";
// import JourneyPlan from 'components/JourneyPlan/index'
// import WorkPlanTemplate from 'components/WorkPlanTemplate/index'
// import IssuesReports from 'components/IssuesReports/index'
// //import FieldMonitoring from 'components/FieldMonitoring/index'
// import FieldMonitoringV1 from 'components/FieldMonitoringSubTables/index'
// import Team from 'components/Team/index'
// import Track from 'components/Track/index'
// import TrackDetail from 'components/Track/TrackDetail/index'
// import JourneyPlanDetail from 'components/JourneyPlan/JourneyPlanDetail/index'
// import WorkPlanTemplateDetail from 'components/WorkPlanTemplate/JourneyPlanDetail/index'
import NotificationBar from "components/Common/NotificationBar/index";
import {timpsRoutes, lampRoutes} from "routes/routes.js";
import SocketIO from "containers/SocketIOContainer";
import { sidebarWidth, sidebarWidthSmall } from "components/Common/Variables/CommonVariables";
import Diagnostics from "components/diagnostics/index";
import LoginContainer from "../../containers/LoginContainer";
import Logout from "../../containers/LogOutContainer";
import FloatingNavigation from "components/Common/FloatingNavigation/index";
import { themeService } from "theme/service/activeTheme.service";
//import Test from 'components/TestComponent/test'
// import Data from 'components/data/data'
import { getServerEndpoint } from "utils/serverEndpoint";

import { tabTitle } from "../../config/tabConfig";
import VersionManager from './VersionManager.jsx';
import eventBus from '../../utils/eventBus';

const routeComponent = timpsRoutes.map((route, index) => {
  return <Route key={route.path} path={route.path} component={route.component} />;
});

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarVisible: false,
      topBarVisible: true,
      userLoggedOn: false,
      routes: [],
      user: "",
      isCheckedIn: false,
      attendanceBtnTxt: "",
      userSession: {},
      currentAttendance: {},
      sessionTime: 0,
      lastSession: 0,
      showTimer: true,
      showSideNav: true,
      language: "en",
      theme: "retro",
      rightValue: "-20%",
      // routeComponent: timpsRoutes.map((route, index) => {
      //   return <Route key={route.path} path={route.path} component={route.component} />;
      // }),
      routesToLoad: timpsRoutes,
      hideNav: window.innerWidth,
      sidebarWidth: sidebarWidth,
      textDisplay: "inline-flex",
      sideNavDispaly: "0px",
      hideToolTip: window.innerWidth <= 760,
      mainSectionLeft: this.isLoggedOn() ? sidebarWidth : 0,
      applicationType: null,
      featureset: []
    };
    this.AttendanceBtnHandler = this.AttendanceBtnHandler.bind(this);
    // this.languageChanged = this.languageChanged.bind(this);
    // this.themeChanged = this.themeChanged.bind(this);
    this.sidebarToggle = this.sidebarToggle.bind(this);
    this.toggleRight = this.toggleRight.bind(this);
    this.versionLoaded = this.versionLoaded.bind(this);
    // console.log(routePath)
  }

  isLoggedOn = () => localStorage.getItem("access_token") !== null;
  loggedInUser = () => localStorage.getItem("loggedInUser");
  isApp = () => localStorage.getItem("source");

  AttendanceBtnHandler() {
    if (this.state.isCheckedIn) {
      let checkOutStatus = "Web";
      let checkOutTime = new Date();
      this.props.onCheckOut({
        checkOutStatus: checkOutStatus,
        checkOutTime: checkOutTime,
        attendanceId: this.state.currentAttendance._id,
      });
    } else {
      let checkInStatus = "Web";
      let checkInTime = new Date();
      this.props.onCheckIn({
        checkInStatus: checkInStatus,
        checkInTime: checkInTime,
      });
    }
  }

  componentWillMount() {
    //themeService("retro");
    tabTitle();
    localStorage.setItem("theme", this.state.theme);
    let lang = localStorage.getItem("language");
    if (!lang) {
      localStorage.setItem("language", this.state.language);
    }

    if (this.isLoggedOn()) {
      let user = localStorage.getItem("loggedInUser");
      this.setState({ user: user });
    } else if (
      !this.props.history.location.pathname.includes("confirmreset") &&
      !this.props.history.location.pathname.includes("resetPassword")
    ) {
      this.props.history.push("/login");
    }
    //console.log('MainPage.componentWillMount');
  }

  componentDidMount() {
    if (this.isLoggedOn()) {
      this.setState({
        sidebarVisible: true,
        topBarVisible: true,
        userLoggedOn: this.isLoggedOn(),
        hamBurgerVisible: this.isLoggedOn(),
      });
    } else {
      this.setState({
        sidebarVisible: false,
        topBarVisible: true,
        userLoggedOn: this.isLoggedOn(),
        hamBurgerVisible: this.isLoggedOn(),
      });
    }
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    eventBus.on('VersionLoaded', this.versionLoaded);
  }
  resize() {
    let currentHideNav = window.innerWidth <= 760;
    if (currentHideNav !== this.state.hideNav) {
      this.setState({ hideNav: currentHideNav, hideToolTip: currentHideNav });
      if (currentHideNav) {
        this.setState({ sidebarWidth: sidebarWidthSmall, textDisplay: "none", mainSectionLeft: sidebarWidthSmall });
      } else if (this.isApp()) {
        this.setState({ sidebarWidth: "0px", textDisplay: "none", mainSectionLeft: "0px" });
      } else {
        this.setState({ sidebarWidth: sidebarWidth, textDisplay: "inline-flex", mainSectionLeft: sidebarWidth });
      }
    }
  }
  sidebarToggle() {
    //let el = document.getElementById("sideNav");
    //let toggleVal = window.getComputedStyle(el).getPropertyValue("left");
    this.resize();
    if (this.state.showSideNav) {
      this.setState({ showSideNav: false, mainSectionLeft: "0px" });
    } else {
      this.setState({ showSideNav: true, mainSectionLeft: this.state.sidebarWidth });
      console.log();
    }
  }
  toggleRight() {
    //console.log(this.state.rightValue);
    if (this.state.rightValue == "-20%") {
      this.setState({ rightValue: "0px" });
    } else {
      this.setState({ rightValue: "-20%" });
    }
  }
  // languageChanged(lang) {
  //   let renderResult = routePath.map((route, index) => {
  //     return <Route key={route.path} path={route.path} component={route.component} />;
  //   });
  //   this.setState({ language: lang, routeComponent: renderResult });
  // }
  // themeChanged(theme) {
  //   this.setState({ theme });
  // }
  versionLoaded(versionInfo)
  {

        let routeToLoad = timpsRoutes;
        if(versionInfo.isLAMP())
          routeToLoad = lampRoutes;

        //let rc = routeToLoad.map((route, index) => {return <Route key={route.path} path={route.path} component={route.component} />;});
        this.setState({applicationType: versionInfo.getApplicationType(), routesToLoad: routeToLoad});
      
        tabTitle();

        const fi = document.getElementById("favicon");
        if(versionInfo.isSITE())
        {
            fi.href = "/SCIM_Tab_Logo.png";
        }
        else
        {
          fi.href = "/EUIS_Tab_Logo.png";
        }

        this.resize();
       
  }

  render() {
    // const isLoggedOnCheck = this.loggedInUser()
    // if (!isLoggedOnCheck) {
    //   if (this.props.history.location.pathname !== '/login') {
    //     this.props.history.push('/login')
    //   }
    // }
    let routeComponent = this.state.routesToLoad.map((route, index) => {return <Route key={route.path} path={route.path} component={route.component} />;});


    const loggedUser = this.loggedInUser();
    const { topBarVisible, sidebarVisible, userLoggedOn, user } = this.state;
    const loginScreen = (
      <div className="App-container">
        <div className="App-login">
          <LoginContainer />
        </div>
      </div>
    );
    // console.log("routeComponent")
    // console.log(routeComponent)
    let switchComp = (
      <Switch>
        <Route path="/login" component={LoginContainer} />
        <Route path="/logout" component={Logout} />
        <Route path="/diagnostics" component={Diagnostics} />
        <Route path="/dev" component={Basicform} />
        <Route path="/forgotPassword" component={ForgotPassword} />
        <Route path="/confirmreset/:id" component={VerifyResetPass} />
        <Route path="/resetPassword" component={ResetPassword} />
        {routeComponent}
      </Switch>
    );
    return (
      <React.Fragment>
        <div className={"App " + this.state.theme}>
        <VersionManager loadCallback={this.versionLoaded}/>
          <SocketIO />
          {topBarVisible && (
            <TopBar sidebarToggle={this.sidebarToggle} hideToolTip={this.state.hideToolTip} toggleRight={this.toggleRight} />
          )}
          {this.loggedInUser() && this.state.showSideNav && !this.isApp() && this.state.applicationType &&  (
            <SideNavBar
              hideNav={window.innerWidth}
              textDisplay={this.state.textDisplay}
              sidebarWidth={this.state.sidebarWidth}
              sideNavDispaly={this.state.sideNavDispaly}
              hamBurgerVisible={this.state.hamBurgerVisible}
              hideToolTip={this.state.hideToolTip}
              applicationType = {this.state.applicationType}
            />
          )}

          <div
            className="main-content-area"
            style={{
              position: "absolute",
              left: this.state.mainSectionLeft,
              top: "70px",
              right: 0,
              bottom: 0,
            }}
          >
            {switchComp}
          </div>
          {/* !userLoggedOn && loginScreen */}
          {/* userLoggedOn && <DashBoard/> */}
          <FloatingNavigation></FloatingNavigation>
        </div>
        <NotificationBar rightValue={this.state.rightValue} toggleRight={this.toggleRight} />
        <div
          className="modal-cover"
          style={{
            visibility: this.state.rightValue === "-20%" ? "hidden" : "visible",
            top: this.state.rightValue === "-20%" ? "100vh" : "0px",
          }}
          onClick={this.toggleRight}
        />
      </React.Fragment>
    );
  }
}

const DashBoard = () => (
  <div>
    <h2>Dashboard Component </h2>
  </div>
);
export default withRouter(MainPage);
