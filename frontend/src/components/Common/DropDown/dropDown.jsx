/* eslint eqeqeq: 0 */
import React, { Component } from "react";
//import DropDown from "components/Common/DropDown/index";
import { retroColors } from "../../../style/basic/basicColors";
import DropDownWrapper from "./DropDownWrapper.jsx";
import { loc } from "./sampleData";
class DropDownComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      tabClasses: "dropdown-menu",
    };
  }
  componentDidMount() {
    document.getElementById("elementId").scrollIntoView();
  }
  render() {
    return (
      <div id="elementId" className="scrollbar drop-down-menu">
        <ul id="menu" style={{ overflow: this.state.menuHover ? "visible" : "overflow: auto hidden" }}>
          <DropDownWrapper locations={this.props.items} onSelectItem={this.props.onSelectItem} />
        </ul>
      </div>
    );
  }
}

export default DropDownComp;
