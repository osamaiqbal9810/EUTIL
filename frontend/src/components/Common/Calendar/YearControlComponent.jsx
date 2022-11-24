import React, { Component } from "react";
import { ControlArrow, CenterTextControl } from "./ControlItems.js";
import { angleLeft } from "react-icons-kit/fa/angleLeft";
import { angleRight } from "react-icons-kit/fa/angleRight";
import DropDownMonths from "./DropDownMonths";
import { themeService } from "../../../theme/service/activeTheme.service";
import { basicColors, retroColors } from "../../../style/basic/basicColors";
class YearControlComponent extends Component {
  render() {
    return (
      <div
        style={{
          textAlign: "center",
          background: themeService({ default: basicColors.second, retro: retroColors.fourth }),
          border: "1px solid #d0d0d0",
        }}
      >
        {/* {this.state.displayMonthDropDown && (
          <div style={{ position: "relative" }}>
            <DropDownMonths months={this.state.months} handleMonthClick={this.handleMonthClick} />
          </div>
        )} */}
        <ControlArrow
          icon={angleLeft}
          click_arg="left"
          itemIndex={this.props.browseYear}
          handleControlClick={this.props.handleYearChange}
        />
        <CenterTextControl textName={this.props.browseYear} disableMonthSelector />
        <ControlArrow
          icon={angleRight}
          click_arg="right"
          itemIndex={this.props.browseYear}
          handleControlClick={this.props.handleYearChange}
        />
      </div>
    );
  }
}

export default YearControlComponent;
