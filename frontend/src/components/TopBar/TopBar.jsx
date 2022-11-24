import React, { Component } from "react";
import { Container, Col, Label, Button, FormGroup } from "reactstrap";
import moment from "moment";
import logo from "../../logo.png";
import { CRUDFunction } from "reduxCURD/container";
import TIMPS_Logo from "../../TIMPS_Logo.png";

import TopBarView from "./TopBarView";
import { ToastContainer, toast } from "react-toastify";
import * as types from "reduxRelated/ActionTypes/actionTypes.js";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import { setDynamicWords } from "Language/DynamicLanguage";
import { languageService } from "../../Language/language.service";
import TIMPS_Logo_old from "../../TIMPS_Logo_old.png";
import { themeService } from "../../theme/service/activeTheme.service";
import tekterkking from "../../tekterkking.png";
import ElectricalLogo from "../../EUIS_Logo.png";
const iconToShow = {
  default: TIMPS_Logo_old,
  retro: ElectricalLogo,
};
class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarVisible: true,
      topBarVisible: true,
      userLoggedOn: false,
      routes: [],
      user: this.loggedInUser(),
      isCheckedIn: false,
      attendanceBtnTxt: "",
      userSession: {},
      currentAttendance: {},
      sessionTime: 0,
      lastSession: 0,
      showTimer: true,
      timer: "",
      intervalHandler: {},
      checkOutTimeLimit: 60000,
      sessionLimit: 14,
      isSessionLocked: false,
      toggleView: "none",
    };
    this.startTimer = this.startTimer.bind(this);
    this.AttendanceBtnHandler = this.AttendanceBtnHandler.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.timeFormat = this.timeFormat.bind(this);
    this.handelClick = this.handelClick.bind(this);
  }
  handelClick() {
    this.setState({ toggleView: "block" });
  }
  showToastInfo(message) {
    toast.warn(message, {
      position: toast.POSITION.TOP_LEFT,
    });
  }

  showToastError(message, error) {
    toast.error(message + ": " + error, {
      position: toast.POSITION.TOP_LEFT,
    });
  }
  AttendanceBtnHandler() {
    if (this.state.isCheckedIn) {
      let totalTime = moment() - moment(this.state.currentAttendance.checkInTime);
      if (totalTime < this.state.checkOutTimeLimit) {
        this.showToastError(languageService("Please Wait "), languageService("Unable to checkout before 1m"));
      } else {
        let checkOutStatus = "Web";
        let checkOutTime = new Date();
        this.props.onCheckOut({
          checkOutStatus: checkOutStatus,
          checkOutTime: checkOutTime,
          attendanceId: this.state.currentAttendance._id,
        });
      }
    } else {
      let checkInStatus = "Web";
      let checkInTime = new Date();
      this.props.onCheckIn({
        checkInStatus: checkInStatus,
        checkInTime: checkInTime,
        userId: this.state.user._id,
      });
    }
  }

  isLoggedOn = () => localStorage.getItem("access_token") !== null;
  loggedInUser = () => localStorage.getItem("loggedInUser");

  componentWillMount() {
    if (this.isLoggedOn()) {
      let user = localStorage.getItem("loggedInUser");
      this.setState({ user: JSON.parse(user) });
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalHandler);
  }

  componentDidMount() {
      let lang = localStorage.getItem("language");
      let user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (user != null)
        this.props.getAppMockupsTypes("DynamicLanguage_" + (lang ? lang : ""));
    if (!this.isLoggedOn) {
      this.setState({
        sidebarVisible: false,
        topBarVisible: true,
        userLoggedOn: this.isLoggedOn(),
      });
    } else {

      if (user != null) {
        this.setState({ user: user, userLoggedOn: this.isLoggedOn() });
        //  this.props.onAttendanceStatus(user._id)
      }
    }
    function is_touch_device() {
      try {
        document.createEvent("TouchEvent");
        return true;
      } catch (e) {
        return false;
      }
    }
    //console.log(is_touch_device());
    is_touch_device() ? localStorage.setItem("touch-device", true) : localStorage.setItem("touch-device", false);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.diagnosticsActionType !== prevProps.diagnosticsActionType &&
      this.props.diagnosticsActionType == "DYNAMIC_LANGUAGE_GET_SUCCESS"
    ) {
      setDynamicWords(this.props.dynamicLanguageList[0] ? this.props.dynamicLanguageList[0].opt1 : null);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.actionType !== nextProps.actionType && nextProps.actionType === types.ATTENDANCE_GET_SUCCESS) {
    //   if (nextProps.attendance.checkOutTime) {
    //     let checkIn = nextProps.attendance.checkInTime;
    //     let checkOut = nextProps.attendance.checkOutTime;
    //     let totalTime = moment(checkOut) - moment(checkIn);
    //     this.setState({
    //       isCheckedIn: false,
    //       attendanceBtnTxt: "Check In",
    //       showTimer: false,
    //       lastSession: totalTime,
    //     });
    //   } else if (nextProps.attendance.checkInTime) {
    //     let timeDifference = moment() - moment(nextProps.attendance.checkInTime);
    //     this.setState({
    //       isCheckedIn: true,
    //       attendanceBtnTxt: "Check Out",
    //       sessionTime: timeDifference,
    //       showTimer: true,
    //     });
    //     this.startTimer(nextProps.attendance);
    //   } else {
    //     this.setState({
    //       isCheckedIn: false,
    //       attendanceBtnTxt: "Check In",
    //       showTimer: false,
    //       lastSession: "00:00:00",
    //     });
    //   }
    //   this.setState({ currentAttendance: nextProps.attendance });
    // }
    // if (this.props.actionType !== nextProps.actionType && nextProps.actionType === types.ATTENDANCE_CHECKOUT_SUCCESS) {
    //   this.setState({ userSession: nextProps.userSession });
    //   let checkIn = nextProps.userSession.checkInTime;
    //   let checkOut = nextProps.userSession.checkOutTime;
    //   let totalTime = moment(checkOut) - moment(checkIn);
    //   clearInterval(this.state.intervalHandler);
    //   this.setState({
    //     isCheckedIn: false,
    //     attendanceBtnTxt: "Check In",
    //     showTimer: false,
    //     lastSession: totalTime,
    //   });
    //   this.setState({ isSessionLocked: false });
    //   this.props.onAttendanceSummary({ user: this.state.user._id, days: 60 });
    // }
    // if (this.props.actionType !== nextProps.actionType && nextProps.actionType === types.ATTENDANCE_CHECKIN_SUCCESS) {
    //   let timeDifference = moment() - moment(nextProps.attendance.checkInTime);
    //   this.setState({ currentAttendance: nextProps.attendance });
    //   this.setState({
    //     isCheckedIn: true,
    //     attendanceBtnTxt: "Check Out",
    //     showTimer: true,
    //     sessionTime: timeDifference,
    //   });
    //   this.startTimer(nextProps.attendance);
    // }
    if (this.props.loginActionType !== nextProps.loginActionType && nextProps.loginActionType === types.LOGOUT_SUCCESS) {
      this.setState({ userLoggedOn: false, sessionTime: 0 });
      //    clearInterval(this.state.intervalHandler);
    }
    if (this.props.loginActionType !== nextProps.loginActionType && nextProps.loginActionType === types.LOGOUT_FAILURE) {
      //      clearInterval(this.state.intervalHandler);
      this.setState({ userLoggedOn: false, sessionTime: 0 });
    }
    if (this.props.loginActionType !== nextProps.loginActionType && nextProps.loginActionType === types.LOGIN_SUCCESS) {
      let user = JSON.parse(localStorage.getItem("loggedInUser"));
      let lang = localStorage.getItem("language");
      this.props.getAppMockupsTypes("DynamicLanguage_" + (lang ? lang : ""));
      this.setState({ user: user, userLoggedOn: true });
      // this.props.onAttendanceStatus(user._id);
    }
  }

  startTimer(record) {
    if (this.state.intervalHandler) {
      clearInterval(this.state.intervalHandler);
    }
    let forTimer = moment().diff(record.checkInTime);
    if (parseInt(forTimer / (1000 * 60 * 60)) >= this.state.sessionLimit) {
      this.setState({ isSessionLocked: true });
    } else {
      this.setState({ isSessionLocked: false });
      let timerInterval = () => {
        forTimer = forTimer + 1000;
        this.setState({ timer: this.timeFormat(forTimer) });
      };
      let intervalHandler = setInterval(timerInterval, 1000);
      this.setState({ intervalHandler: intervalHandler });
    }
  }

  timeFormat(time) {
    let milliseconds = parseInt((time % 1000) / 100),
      seconds = parseInt((time / 1000) % 60),
      minutes = parseInt((time / (1000 * 60)) % 60),
      hours = parseInt((time / (1000 * 60 * 60)) % 24);
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (hours >= this.state.sessionLimit) {
      clearInterval(this.state.intervalHandler);
      this.setState({ isSessionLocked: true });
    } else return hours + ":" + minutes + ":" + seconds;
  }
  render() {
    // console.log("TobBar", this.props.language);
    const { user } = this.state;
    const loggedUser = this.loggedInUser();
    return (
      <div>
        <TopBarView
          onAttendanceClick={this.AttendanceBtnHandler}
          attendanceBtnTxt={this.state.attendanceBtnTxt}
          sessionTime={this.state.sessionTime}
          isTimer={this.state.showTimer}
          lastSession={this.state.lastSession}
          userName={user}
          logo={themeService(iconToShow)}
          user={loggedUser}
          userLoggedOn={this.state.userLoggedOn}
          timer={this.state.timer}
          isSessionLocked={this.state.isSessionLocked}
          language={this.props.language}
          sidebarToggle={this.props.sidebarToggle}
          hamBurgerVisible={this.state.userLoggedOn}
          hideToolTip={this.props.hideToolTip}
          toggleView={this.state.toggleView}
          handelClick={this.handelClick}
          hideToolTip={this.props.hideToolTip}
          toggleRight={this.props.toggleRight}
          notifications={this.props.notifications}
        />
        <ToastContainer autoClose={10000} />
      </div>
    );
  }
}

let variables = {
  languageHelperReducer: {
    language: "",
  },
  diagnosticsReducer: { dynamicLanguageList: [] },
  loginReducer: { user: null },
    notificationReducer: {notifications: []},
};

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getAppMockupsTypes },
};
let TopBarContainer = CRUDFunction(TopBar, "TopBar", actionOptions, variables, [
  "languageHelperReducer",
  "diagnosticsReducer",
  "loginReducer",
    "notificationReducer"
]);

export default TopBarContainer;
