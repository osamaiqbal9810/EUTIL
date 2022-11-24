import React, { Component } from "react";
// import { Icon } from "react-icons-kit";
import { ic_close } from "react-icons-kit/md/ic_close";
// import { NotificationStyle } from "./style/index";
import { themeService } from "theme/service/activeTheme.service";
import { Alert, Collapse, CardBody, Card } from "reactstrap";
import moment from "moment";
import { notification as ni } from "react-icons-kit/entypo/notification";
import { Icon } from "react-icons-kit";
import { record } from "react-icons-kit/iconic/record";
class NotificationBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      visible: false,
    };
  }

  handleNotificationClick = (notification) => {
    this.setState({
      expanded: !this.state.expanded,
    });
    if (notification.status === "unread") this.props.notificationReadAction(notification._id);
  };

  render() {
    const { expanded } = this.state;
    const { notification } = this.props;
    return (
      <React.Fragment>
        <Alert
          isOpen={this.visible}
          toggle={() => this.props.deleteNotification(notification._id)}
          color={notification.status === "unread" ? "primary" : "secondary"}
          style={{ marginBottom: 0 }}
        >
          <div className="media-image">
            <Icon size="50px" icon={ni} />
          </div>
          <div
            className="notification-text"
            onClick={() => this.handleNotificationClick(notification)}
            style={{ fontSize: "15px", fontWeight: "bold" }}
          >
            {notification.title}
            <span className="notification-date">{moment(notification.createdAt).format("DD-MM-YYYY HH:mm:ss a")}</span>
          </div>
          <span className="media-icon">
            <Icon size="18" icon={record}></Icon>
          </span>
          <Collapse isOpen={expanded}>
            <Card>
              <CardBody>{notification.message}</CardBody>
            </Card>
          </Collapse>
        </Alert>
      </React.Fragment>
    );
  }
}

export default NotificationBox;
