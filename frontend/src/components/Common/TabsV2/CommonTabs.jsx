/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import Radium from "radium";
import { getColorsArray } from "utils/colors";
import DropDown from "components/Common/DropDown/index";
import { retroColors } from "../../../style/basic/basicColors";

class CommonTabsV2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [
        {
          id: 0,
          title: "New York",
          selected: false,
          key: "location",
        },
        {
          id: 1,
          title: "Dublin",
          selected: false,
          key: "location",
        },
        {
          id: 2,
          title: "California",
          selected: false,
          key: "location",
        },
        {
          id: 3,
          title: "Istanbul",
          selected: false,
          key: "location",
        },
        {
          id: 4,
          title: "Izmir",
          selected: false,
          key: "location",
        },
        {
          id: 5,
          title: "Oslo",
          selected: false,
          key: "location",
        },
      ],
      closeAll: false,
      tabClasses: "common-tab",
      tabState: this.props.tabState,
    };
    this.handleTabClick = this.handleTabClick.bind(this);
    this.colors = getColorsArray();
    this.handelcloseAll = this.handelcloseAll.bind(this);
  }

  handleTabClick(tabValue, color) {
    let displayName = [];
    displayName.name = tabValue;

    this.props.handleTabClick(displayName, color);
    if (!this.state.tabState) {
      this.setState({ tabClasses: "common-tab active", tabState: !this.state.tabState });
    } else {
      this.setState({ tabClasses: "common-tab", tabState: !this.state.tabState });
    }
  }
  handelcloseAll() {
    this.setState({
      closeAll: !this.state.closeAll,
    });
  }
  componentDidMount() {
    //console.log("this.props.tab", this.props.tab.children);
  }
  render() {
    let childActive = false;
    //debugger;
    this.props.tab.children.forEach((element) => {
      if (element.state) {
        childActive = true;
      }
    });
    let activeTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default";
    let finalChcek = true;
    this.props.displayMenuAll ? (finalChcek = false) : (finalChcek = childActive);
    let tabStyle =
      activeTheme == "default"
        ? {
            backgroundColor: finalChcek ? "rgb(64, 118, 179)" : "#f4f4f4",
            borderColor: finalChcek ? "#fff" : "rgb(64, 118, 179)",
            color: finalChcek ? "#fff" : "rgba(64, 118, 179)",
            backgroundImage: finalChcek
              ? ""
              : "-webkit-gradient(linear, 0 0, 0 100%, from(#f2f2f2), color-stop(85%, #ffffff), to(#cccccc))",
            backgroundImage: finalChcek ? "" : "-webkit-linear-gradient(#f2f2f2, #ffffff 85%, #cccccc)",
            backgroundImage: finalChcek ? "" : "-moz-linear-gradient(top, #f2f2f2, #ffffff 85%, #cccccc)",
            backgroundImage: finalChcek ? "" : "-o-linear-gradient(#f2f2f2, #ffffff 85%, #cccccc)",
            backgroundImage: finalChcek ? "" : "linear-gradient(#f2f2f2, #ffffff 85%, #cccccc)",
            backgroundRepeat: "no-repeat",
          }
        : {
            backgroundColor: "#fff",
            border: "1px solid #d8d8d8",
            color: "#000000",
            borderBottom: finalChcek ? "3px solid " + retroColors.first : "3px solid " + retroColors.fourth,
            borderRadius: "0px",
          };
    // console.log(childActive);
    //const styles = getStyles(this.props, this.state);
    return (
      <div
        key={this.props.tabValue}
        onClick={(e) => {
          this.handleTabClick(this.props.tabValue, "rgb(64, 118, 179)");
        }}
        className={this.state.tabClasses}
        style={tabStyle}
      >
        {/* {this.props.tabValue} */}
        <DropDown
          tabValue={this.props.tabValue}
          tabState={this.props.tabState}
          tabId={this.props.tabId}
          closeAll={this.state.closeAll}
          handelcloseAll={this.handelcloseAll}
          locations={this.props.tab.children}
          selector="title"
          handleElementClick={this.props.handleElementClick}
          handelParentClick={this.props.handelParentClick}
        ></DropDown>
      </div>
    );
  }
}

export default Radium(CommonTabsV2);
