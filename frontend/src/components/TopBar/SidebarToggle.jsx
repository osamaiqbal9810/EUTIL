import React, { Component } from "react";
import Radium from "radium";
import { hamBurger, hamBurgerBox, hamBurgerInner, hamBurgerBefore, hamBurgerAfter } from "style/components/TopBarView";

class SidebarToggle extends Component {
  state = {};
  render() {
    return (
      <div style={{ visibility: this.props.hamBurgerVisible ? "visible" : "hidden", verticalAlign: "top", display: "inline-block" }}>
        <div
          style={{ ...hamBurger, padding: "21px 25px" }}
          className="hamburger hamburger--arrow js-hamburger"
          onClick={this.props.sidebarToggle}
        >
          <div style={hamBurgerBox} className="hamburger-box">
            <div style={hamBurgerBefore} className="hamburger-before" />
            <div style={hamBurgerInner} className="hamburger-inner" />
            <div style={hamBurgerAfter} className="hamburger-after" />
          </div>
        </div>
      </div>
    );
  }
}

export default Radium(SidebarToggle);
