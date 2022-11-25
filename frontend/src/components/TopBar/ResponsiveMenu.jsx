import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import LineSelectionAreaTopBar from "./LineSelectionArea";
import LangSelectionAreaTopBar from "components/TopBar/LangSelectionArea";
import Gravatar from "react-gravatar";
import { Icon } from "react-icons-kit";
import { earth } from "react-icons-kit/icomoon/earth";
import { ic_timeline } from "react-icons-kit/md/ic_timeline";
import { user } from "react-icons-kit/icomoon/user";
import Radium from "radium";
import { Router, Route, HashRouter, withRouter } from "react-router-dom";
import { ddElementStyle, menuStyule, topBarStyle } from "./style/TopBarView";
import { themeService } from "theme/service/activeTheme.service";
import { languageService } from "Language/language.service";
import { logout } from "react-icons-kit/iconic/logout";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
let DropdownItemRadium = Radium(DropdownItem);
class ResponsiveMenu extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }
  redirect = () => {
    this.props.history.push("/line");
  };
  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  render() {
    let comment = (
      <DropdownMenu style={menuStyule} right>
        <DropdownItem header style={ddElementStyle}>
          <Icon size={12} icon={user} />
          <div style={{ display: "inline-block", marginLeft: "5px" }}>{this.props.name}</div>
        </DropdownItem>
        <DropdownItem style={{ margin: "0.2rem 0" }} divider />
        {/* <DropdownItemRadium
          onClick={() => {
            this.props.history.push("/line");
          }}
          style={ddElementStyle}
        >
          <Icon size={12} icon={ic_timeline} />
          <div style={itemsStyle}>
            <LineSelectionAreaTopBar language={this.props.language} hideToolTip={this.props.hideToolTip} />
          </div>
        </DropdownItemRadium> */}
        <DropdownItemRadium
          onClick={() => {
            this.props.history.push("/lang");
          }}
          style={ddElementStyle}
        >
          <Icon size={12} icon={earth} id="line-id" />
          <div style={{ display: "inline-block", marginLeft: "5px" }}>
            <LangSelectionAreaTopBar language={this.props.language} />
          </div>
        </DropdownItemRadium>
        <DropdownItemRadium
          onClick={() => {
            this.props.history.push("/Logout");
          }}
          style={ddElementStyle}
        >
          <Icon size={12} icon={logout} id="line-id" />
          <div style={{ display: "inline-block", marginLeft: "5px" }}>
            <span style={{ color: retroColors.second }}>{languageService("Logout")}</span>
          </div>
        </DropdownItemRadium>
      </DropdownMenu>
    );

    let dropd = this.state.dropdownOpen ? comment : null;

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle style={{ background: "transparent", border: "none", WebkitBoxShadow: "none", boxShadow: "none" }} caret>
          <Gravatar style={{ borderRadius: "50%" }} email={this.props.email} size={30} />
        </DropdownToggle>
        {dropd}
      </Dropdown>
    );
  }
}

export default Radium(withRouter(ResponsiveMenu));
