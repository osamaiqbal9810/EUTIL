import React, { Component } from "react";
import Radium from "radium";
import permissionCheck from "utils/permissionCheck.js";
import { NavElement, NavImg, NavData, CustomNav } from "components/Common/Forms/formsMiscItems.jsx";
import SvgIcon from "react-icons-kit";
import { languageService } from "../../Language/language.service";
import { NavLink } from "react-router-dom";
import { UncontrolledTooltip } from "reactstrap";
import { NavrowStyle } from "./style/NavRow";
import { themeService } from "theme/service/activeTheme.service";

const oddEvent = (match, location, navId) => {
  let path = location.pathname;
  //console.log(path + " " + path.indexOf("Setup"));
  if (match) {
    return true;
  } else if (location.pathname == "/" && navId == "dashboard") {
    return true;
  } else if (path.indexOf(navId + "s") != -1) {
    return true;
  }

  //console.log(location.pathname + "::" + navId);
};
//const RadiatingNavLink = Radium(NavLink);
class Navrow extends Component {
  render() {
    let styles = getNavrowStyle(this.props, this.state);
    return (this.NavStr = this.props.navBarItems.map((item, index) => {
     return permissionCheck(item.permissionCheckFirstArg, item.permissionCheckSecondArg) || item.permissionCheck == false ? (
      (  
        <NavElement className="navBar " key={item.navId}>
          <div style={themeService(styles.navWrapper)} key={index + "div>"}>
            <NavLink
              key={index}
              style={themeService(styles.navElement)}
              to={"/" + item.navId}
              isActive={(match, location) => oddEvent(match, location, item.navId)}
              activeStyle={themeService(styles.navActive)}
              onClick={e => {
                this.props.onLinkClick(item.navId);
              }}
              id={item.navId}
              className="nav-link"
            >
              <NavImg>
                <SvgIcon size={themeService(styles.navIconSize).size} icon={item.navIcon} />
              </NavImg>
              <NavData textDisplay={this.props.textDisplay}>{languageService(item.navText)}</NavData>
            </NavLink>
          </div>
          {/* {this.props.hideToolTip && (
            <UncontrolledTooltip placement="right" target={item.navId}>
              {item.navId}
            </UncontrolledTooltip>
          )} */}
        </NavElement>
      )
     ) : <React.Fragment/>;
    }));
  }
}

export default Radium(Navrow);

let getNavrowStyle = (props, state) => {
  return NavrowStyle;
};
