import React, { Component } from "react";
import { ic_arrow_drop_down } from "react-icons-kit/md/ic_arrow_drop_down";
import { ic_done } from "react-icons-kit/md/ic_done";
import { Icon } from "react-icons-kit";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { DropDownStyle } from "./style/index";
import { themeService } from "theme/service/activeTheme.service";
import Radium from "radium";

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childElements: null,
      subElementClasses: "dropdown-menu",
      locations: this.props.locations,
      dropdownOpen: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChildClick = this.handleChildClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleClick(tabId, tabValue, tabState) {
    // if (this.state.subElementClasses == "dropdown-menu") {
    //   this.setState({ subElementClasses: "dropdown-menu show" });
    // } else {
    //   this.setState({ subElementClasses: "dropdown-menu" });
    // }
    // console.log(tabId, tabValue, tabState);
    this.props.handelParentClick(tabValue, tabId, tabState);
  }
  handleChildClick(title, id, state) {
    //this.setState({ subElementClasses: "dropdown-menu" });

    if (state) {
      //this.setState({ elementSeleted: "d-none" });
      this.props.handleElementClick(title, id, false);
    } else {
      //this.setState({ elementSeleted: "d-inline-block" });
      this.props.handleElementClick(title, id, true);
    }
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }
  componentDidMount() {}
  render() {
    let styles = getDropDownStyle(this.props, this.state);
    let selector = this.props.selector;
    if (this.props.locations) {
      var children = this.props.locations.map((child) => {
        //console.log(child.title);
        return (
          <div key={"divHover" + child.id} style={themeService(styles.dropdownItem)}>
            <DropdownItem
              key={child[selector]}
              className="dropdown-item"
              toggle={false}
              onClick={() => {
                this.handleChildClick(child.title, child.id, child.state);
              }}
              style={{ paddingLeft: "5px" }}
            >
              {/* <input type="checkbox" id={child.id} defaultChecked={this.state.elementSeleted} /> */}

              <span key={"dropDownSpan" + child.id} style={themeService(styles.iconStyle)}>
                {child.state && <Icon size={18} icon={ic_done} />}
              </span>

              <label key={"dropDownLabel" + child.id} style={themeService(styles.lblDropDown)}>
                {child[selector]}
              </label>
            </DropdownItem>
          </div>
        );
      });
      //console.log("::", children);
    }

    return (
      <React.Fragment>
        {/* <div className="tab-element" onClick={() => this.handleClick()} > */}
        <div
          className="tab-values"
          style={{ display: "inline-Block", padding: "0 5px 0 10px" }}
          onClick={() => this.handleClick(this.props.tabId, this.props.tabValue, this.props.tabState)}
        >
          {this.props.tabValue}
        </div>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} style={{ display: "inline-Block" }}>
          <DropdownToggle caret>{/*this.props.tabValue*/}</DropdownToggle>
          {/* {children && <Icon size={18} icon={ic_arrow_drop_down} style={{ verticalAlign: "bottom" }} />} */}
          {/* </div> */}

          <DropdownMenu left={0}>
            {/* {children && <ul className={this.state.subElementClasses}>{children}</ul>} */}
            {children}
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

export default Radium(DropDown);

let getDropDownStyle = (props, state) => {
  return DropDownStyle;
};
