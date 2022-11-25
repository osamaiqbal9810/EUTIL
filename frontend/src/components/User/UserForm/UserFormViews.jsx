import React, { PropTypes } from "react";
import { Row, Col, Button, Checkbox, FormGroup, ControlLabel, FormControl } from "reactstrap";
import { isJSON } from "utils/isJson";
import Gravatar from "react-gravatar";
import { userAvtarStyle } from "./style/UserFormViews";
import { themeService } from "theme/service/activeTheme.service";
//import permissionCheck from "../../../utils/permissionCheck.js";
import { clock } from "react-icons-kit/icomoon/clock";
import { Icon } from "react-icons-kit";
import { languageService } from "../../../Language/language.service";

const permission = JSON.parse(isJSON(localStorage.getItem("permissions")));

export const UserProfileViewTitleBar = (props) => (
  <Col md={12}>
    <Row style={props.userTitleBarMain}>
      <div style={props.userTitleBarIconContainer}>
        <img src={props.profileTitlebarImg} alt="Profile" />
      </div>
      <div style={props.userTitleBarHeader}>{props.titleName}</div>
    </Row>
  </Col>
);
export const UserProfileViewAvatar = (props) => (
  <React.Fragment>
    <Col md="9">
      <div style={{ display: "inline-block" }}>
        <div style={props.userAvatarStyle}>
          <Gravatar email={props.email} default="mm" size={100} style={{ borderRadius: "inherit" }} className="img-thumbnail " />
          {/*<div style={props.userAvatarArrowStyle}>
            <FaChevronDown />
        </div>*/}
        </div>
      </div>
      <div style={{ display: "inline-block", paddingLeft: "30px", marginTop: "0px" }}>
        {" "}
        <div style={props.userAvatarAreaName}>{props.ProfileName}</div>
      </div>
    </Col>
    <Col md="3">
      {props.userGroup == "inspector" && props.isSite && (
        <div className="button-hos" onClick={() => props.showPreview(props.ProfileName)}>
          <label>{languageService("Hours of Service")}</label>
          <span style={{ verticalAlign: "unset" }}>
            <Icon size={"20px"} icon={clock} />
          </span>
        </div>
      )}
    </Col>
  </React.Fragment>
);
UserProfileViewAvatar.defaultProps = {
  userAvatarStyle: {
    ...themeService(userAvtarStyle.AvatarStyle),
  },
  userAvatarArrowStyle: {
    display: "block",
    float: "left",
    left: "calc(50 % - 102px)",
    marginLeft: "140px",
  },
  userAvatarAreaName: {
    ...themeService(userAvtarStyle.userAvatarAreaName),
  },
};

UserProfileViewTitleBar.defaultProps = {
  userTitleBarMain: {
    height: "60px",
    //background: "#F9F1BA",
    background: "rgba(249, 241, 186, 1)",
  },
  userTitleBarIconContainer: {
    float: "left",
  },
  userTitleBarHeader: {
    ...themeService(userAvtarStyle.userTitleBarHeader),
  },
};
