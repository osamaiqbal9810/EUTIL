import React from "react";
// import { Container, Col, Label, Button, FormGroup } from "reactstrap";
// import moment from "moment";
import Gravatar from "react-gravatar";
// import { ButtonMain } from "components/Common/Buttons";
// import { play2 } from "react-icons-kit/icomoon/play2";
// import { stop } from "react-icons-kit/icomoon/stop";
// import { locked } from "react-icons-kit/ionicons/locked";
// import SvgIcon from "react-icons-kit";
// import { bell } from "react-icons-kit/fa/bell";
// import { checkSquare } from "react-icons-kit/fa/checkSquare";
// import topBarBackground from "../../images/topBarBackground.png";
//import { getImageOf } from "theme/themeconfig";

import LangSelectionAreaTopBar from "components/TopBar/LangSelectionArea";
import SidebarToggle from "./SidebarToggle";
import { languageService } from "../../Language/language.service";
// import { Icon } from "react-icons-kit";
// import { ic_arrow_drop_down } from "react-icons-kit/md/ic_arrow_drop_down";
// import Radium from "radium";
import { logout } from "react-icons-kit/iconic/logout";
import { Icon } from "react-icons-kit";
import ResponsiveMenu from "./ResponsiveMenu";
import { themeService } from "theme/service/activeTheme.service";
import { topBarStyle } from "./style/TopBarView";
// import tekterkking from "../../tekterkking.png";
// import ferromex from "../../logo-ferromex.png";

const TopBarView = (props) => {
  const { notifications } = props;
  let notificationCount = 0;
  if (notifications) {
    notificationCount = notifications.reduce((count, noti) => {
      if (noti.status === "unread") count++;

      return count;
    }, 0);
  }

  return (
    <header style={themeService(topBarStyle.headerStyle)}>
      {/*{props.sessionTime}*/}
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html:
            "@media print{.report-controls,.report-print,header,div#sideNav,.report-arrow,.nav-wrapper{display: none;}.main-content-area{top:0 !important;left:0 !important;position:relative !important;background:#fff}}.comment-box { page-break-inside: avoid !important; }",
        }}
        //@page { size:auto;margin: 10px 0 2px 0; }
        //@page{size: auto; margin: 0mm;}
        //@page{size: A3 landscape; margin: 0mm;}
        // @media print { @page { margin: 0; }
        //body { margin: 1.6cm; } }
      />
      <img src={props.logo} alt="Logo" style={themeService(topBarStyle.coLogoStyle)} />
      <span style={themeService(topBarStyle.dividerStyle)}>&nbsp;</span>
      <SidebarToggle sidebarToggle={props.sidebarToggle} hamBurgerVisible={props.hamBurgerVisible} />

      {/* <img src={ferromex} className="App-logo" alt="PMS" style={themeService(topBarStyle.logoStyle)} /> */}
      {/* <div style={themeService(topBarStyle.TTLogoStyle)}>
        <img src={ferromex} alt="ferromex" style={themeService(topBarStyle.centerLogoStyle)} />
      </div> */}
      {props.userLoggedOn && (
        <div className="user-area-topbar" style={themeService(topBarStyle.userAreaStyle)}>
          <ul style={themeService(topBarStyle.menuStyle)} className="list-unstyled  d-none d-sm-none d-md-block">
            {/*<li style={itemsStyle} data-value="value 1">*/}
            {/*<LineSelectionAreaTopBar language={props.language} hideToolTip={props.hideToolTip} />*/}
            {/*</li>*/}
            {/*<li style={lineStyle}> |</li>{" "}*/}
            <li style={themeService(topBarStyle.itemsStyle)} data-value="value 2">
              {" "}
              <LangSelectionAreaTopBar language={props.language} />
            </li>
            <li style={themeService(topBarStyle.lineStyle)}> |</li>{" "}
            <li style={{ ...themeService(topBarStyle.itemsStyle), textTransform: "capitalize" }} data-value="value 3">
              {languageService("Hi")}, {props.userName.name}
            </li>
            <li style={{ display: "inline-block" }}>
              <div className={`notification-bar-click ${notificationCount > 0 ? "active" : ""}`} onClick={props.toggleRight}>
                <Gravatar style={themeService(topBarStyle.iconStyle)} email={props.userName.email} size={30} />
                <span>{notificationCount}</span>
                {/* <Icon style={iconStyle} size={32} icon={ic_arrow_drop_down} /> */}
              </div>
            </li>
            <li style={{ display: "inline-block", paddingLeft: "40px" }}>
              <a className="nav-link" id="Logout" href="/Logout">
                <div>
                  <Icon size={20} icon={logout} style={{ transform: "rotate(180deg)", ...themeService(topBarStyle.logoutStyle) }} />
                  <span style={themeService(topBarStyle.logoutStyle)}>{languageService("Logout")}</span>
                </div>
              </a>
            </li>
          </ul>
          <div className=" d-sm-block d-md-none">
            <ResponsiveMenu
              language={props.language}
              name={props.userName.name}
              email={props.userName.email}
              hideToolTip={props.hideToolTip}
            />
          </div>
        </div>
      )}
    </header>
  );
};
export default TopBarView;
