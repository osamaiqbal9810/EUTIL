import React, { PropTypes } from "react";

import SvgIcon from "react-icons-kit";
import { user } from "react-icons-kit/metrize/user";
import { themeService } from "theme/service/activeTheme.service";
import { basicColors, retroColors } from "../../../../style/basic/basicColors";
export const UserCreateProfileViewAvatar = props => (
  <div style={props.userAvatarStyle}>
    <SvgIcon size={100} icon={user} style={{ color: "#fff" }} />
    {/* <div style={props.userAvatarArrowStyle}>
            <FaChevronDown />
        </div> */}
  </div>
);

UserCreateProfileViewAvatar.defaultProps = themeService({
  default: {
    userAvatarStyle: {
      backgroundColor: basicColors.first,
      borderStyle: "Solid",
      borderColor: "#A7A7A7",
      borderWidth: "1px",
      width: "110px",
      height: "110px",
      borderRadius: "100px",
      MozBorderRadius: "100px",
      WebkitBorderRadius: "100px",
      display: "block",
      float: "left",
      position: "relative",

      paddingTop: "4px",
      marginLeft: "30px",
      marginTop: "30px",
      marginBottom: "60px",
    },
    userAvatarArrowStyle: {
      display: "block",
      float: "left",
      left: "calc(50 % - 102px)",
      marginLeft: "140px",
    },
    userAvatarAreaName: {
      display: "block",
      float: "left",
      width: "100%",
      marginTop: "20px",
      textAlign: "center",
      fontSize: "20px",
    },
  },
  retro: {
    userAvatarStyle: {
      backgroundColor: retroColors.first,
      borderStyle: "Solid",
      borderColor: "#A7A7A7",
      borderWidth: "1px",
      width: "110px",
      height: "110px",
      borderRadius: "0",
      MozBorderRadius: "0px",
      WebkitBorderRadius: "0px",
      display: "block",
      float: "left",
      position: "relative",
      paddingLeft: "4px",
      paddingTop: "4px",
      marginLeft: "30px",
      marginTop: "30px",
      marginBottom: "60px",
    },
    userAvatarArrowStyle: {
      display: "block",
      float: "left",
      left: "calc(50 % - 102px)",
      marginLeft: "140px",
    },
    userAvatarAreaName: {
      display: "block",
      float: "left",
      width: "100%",
      marginTop: "20px",
      textAlign: "center",
      fontSize: "20px",
    },
  },
});
