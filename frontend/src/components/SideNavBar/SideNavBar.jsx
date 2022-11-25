import React from "react";
import { logout } from "react-icons-kit/iconic/logout";
import { speedometer } from "react-icons-kit/ionicons/speedometer";
import { gear } from "react-icons-kit/fa/gear";
import { navBarItemsTimps, navBarItemsSITE, navBarItemseUtility } from "./timps.Nav";
import { NavTimpsWraper } from "./lamp.Nav";
import { NavElement, NavImg, NavData, CustomNav } from "components/Common/Forms/formsMiscItems.jsx";
import { withRouter } from "react-router-dom";
import NavRow from "./NavRow";
import { SideNavBarStyle } from "./style/SideNavBar";
import { themeService } from "theme/service/activeTheme.service";
//const theme = themeService("");
import TIMPS_Logo_new from "../../TIMPS_Logo_new.png";
import TIMPS_Logo from "../../TIMPS_Logo.png";
import sideBarLogo from "../../logo-sidebar.png";
import SCIMS from "../../SCIM 1.png";
//import { timpsSignalApp } from "../../config/config";

class SideNavBar extends React.Component {
  constructor(props) {
    super(props);

    this.navBarItems = [
      {
        navId: "dashboard",
        navIndex: 1,
        navIcon: speedometer,
        navText: "Dashboard",
        permissionCheckFirstArg: "DASHBOARD",
        permissionCheckSecondArg: "view",
        permissionCheck: true,
      },
      {
        navId: "Setup",
        navIndex: 9,
        navIcon: gear,
        navText: "Setup",
        permissionCheckFirstArg: "SETUP",
        permissionCheckSecondArg: "view",
        permissionCheck: true,
      },
    ];
    let itemsToAdd = navItemsDecider(this.props.applicationType);
    this.navBarItems = [...this.navBarItems, ...NavTimpsWraper, ...itemsToAdd].sort(function (a, b) {
      return a.navIndex - b.navIndex;
    });

    this.onLinkClick = this.onLinkClick.bind(this);
  }

  onLinkClick(navItem) {
    this.props.history.push("/${navItem}");
  }

  componentDidMount() {}

  render() {
    //console.log(theme);
    //console.log(SideNavBarStyle.sideNav[theme]);
    let timpsSignalApp = !!(this.props.applicationType === "SITE");
    let electricapp = this.props.applicationType === "EUtility";
    return (
      <React.Fragment>
        <div
          id="sideNav"
          className="scrollbar"
          style={{
            ...themeService(SideNavBarStyle.sideNav),
            width: this.props.sidebarWidth,
            left: this.props.sideNavDispaly,
          }}
        >
          <div style={themeService({ default: { display: "none" }, retro: { textAlign: "center" }, electric: { textAlign: "center" } })}>
            {!electricapp && <img src={timpsSignalApp ? SCIMS : TIMPS_Logo} style={{ width: "145px", top: "0", left: "14px" }} />}
          </div>
          {
            <CustomNav>
              <NavRow
                navBarItems={this.navBarItems}
                onLinkClick={this.onLinkClick}
                history={this.props.history}
                textDisplay={this.props.textDisplay}
                sidebarWidth={this.props.sidebarWidth}
                hideToolTip={this.props.hideToolTip}
              />
            </CustomNav>
          }
          {/* <div style={{ position: "absolute", bottom: "75px" }}>
            <img src={sideBarLogo} alt="" style={{ width: "190px" }} />
          </div> */}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SideNavBar);

function navItemsDecider(appType) {
  return navItemsTypes[appType] ? navItemsTypes[appType] : [];
}

const navItemsTypes = {
  TIMPS: navBarItemsTimps,
  SITE: navBarItemsSITE,
  EUtility: navBarItemseUtility,
};
