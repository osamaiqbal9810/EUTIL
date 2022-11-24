import React, { Component } from "react";
import { cross } from "react-icons-kit/icomoon/cross";
import { Icon } from "react-icons-kit";
import { NotificationStyle } from "./style/index";
import { themeService } from "theme/service/activeTheme.service";
import NotificationBox from "./NotificationBox.jsx";
import { CRUDFunction } from "../../../reduxCURD/container";
import * as types from "reduxRelated/ActionTypes/actionTypes.js";
import { languageService } from "Language/language.service";
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightValue: this.props.rightValue,
      notifications: [],
      notificationDataFetched: false,
    };
    this.topHit = this.topHit.bind(this);
    this.notificationReadAction = this.notificationReadAction.bind(this);
    this.deleteNotification = this.deleteNotification.bind(this);
    this.loggedInUser = null;
  }

  componentDidMount() {
    let LoggedInUser = localStorage.getItem("loggedInUser");
    if (LoggedInUser) {
      this.loggedInUser = LoggedInUser;
      this.props.getNotifications();
    }
  }

  notificationReadAction(notificationId) {
    this.props.updateNotification({ notificationId, status: "read" });
  }

  deleteNotification(id) {
    this.props.deleteNotification({ _id: id });
  }

  topHit() {
    this.props.toggleRight();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.notifications &&
      this.props.notifications.length > 0 &&
      this.props.notifications.length !== prevProps.notifications.length
    ) {
      this.setState({ notifications: this.props.notifications });
    }

    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "NOTIFICATIONS_READ_SUCCESS")
      this.setState({ notifications: this.props.notifications, notificationDataFetched: true });

    if (
      this.props.actionType !== prevProps.actionType &&
      (this.props.actionType === "NOTIFICATION_DELETE_SUCCESS" || this.props.actionType === "NOTIFICATION_UPDATE_SUCCESS")
    )
      this.props.getNotifications();

    // if (this.props.actionType !== "NOTIFICATIONS_READ_SUCCESS" && !this.state.notificationDataFetched && this.loggedInUser) {
    //   let { response } = await this.props.getNotifications();
    //   this.setState({ notifications: response, notificationDataFetched: true });
    // }

    if (this.state.rightValue !== this.props.rightValue) {
      this.setState({ rightValue: this.props.rightValue });
    }

    if (this.props.loginActionType != prevProps.loginActionType && this.props.loginActionType == types.LOGIN_SUCCESS) {
      let LoggedInUser = localStorage.getItem("loggedInUser");
      if (LoggedInUser) {
        this.loggedInUser = LoggedInUser;
      }
      this.props.getNotifications();
    }
  }
  render() {
    return (
      <React.Fragment>
        <div
          className={"notification-bar"}
          style={{
            ...themeService(NotificationStyle.notificationBar),
            height: this.state.rightValue === "-20%" ? "0" : "92vh",
            minWidth: "372px",
          }}
        >
          <h4 style={{ color: "#050505", textAlign: "left", letterSpacing: "1px", margin: "20px 16px 12px 16px", fontWeight: "bold" }}>
            {languageService("Notifications")}
          </h4>
          {/* <div className="close-button" onClick={this.topHit} style={{ cursor: "pointer", marginBottom: "10px", float: "right" }}>
            {" "}
            <Icon size={"16"} icon={cross} />
          </div> */}
          <div className={"scrollbar"} style={{ height: "auto", overflow: "auto", maxHeight: "85vh" }}>
            {this.state.notifications &&
              this.props.notifications &&
              this.props.notifications.map((note, index) => (
                <NotificationBox
                  notificationReadAction={this.notificationReadAction}
                  notification={note}
                  key={index}
                  deleteNotification={this.deleteNotification}
                />
              ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

let actionOptions = {
  create: false,
  update: true,
  read: true,
  delete: true,
  others: {},
};
let NotificationContainer = CRUDFunction(Notification, "notification", actionOptions, { loginReducer: { actionType: "" } }, [
  "loginReducer",
]);
export default NotificationContainer;
