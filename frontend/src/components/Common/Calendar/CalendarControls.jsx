import React, { Component } from "react";
import { angleLeft } from "react-icons-kit/fa/angleLeft";
import { angleRight } from "react-icons-kit/fa/angleRight";
import moment from "moment";
import DropDownMonths from "./DropDownMonths";
import YearControlComponent from "./YearControlComponent";
import { ControlArrow, CenterTextControl } from "./ControlItems.js";
import { languageService } from "../../../Language/language.service";
class CalendarControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monthIndex: this.props.monthIndex,
      months: this.props.months,
      displayMonthDropDown: false,
      year: this.props.year,
      yearOnControl: this.props.year,
      opacity: "0",
      top: "25px",
      zIndex: -1,
    };

    this.handleMonthControlClick = this.handleMonthControlClick.bind(this);
    this.toggleDropDownMonths = this.toggleDropDownMonths.bind(this);
    this.handleMonthClick = this.handleMonthClick.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
  }
  handleMonthControlClick(arg) {
    const { monthIndex } = this.state;
    let c_mnthIndex = monthIndex;
    let year = this.state.year;
    let yearDate = moment().set("year", this.state.year);
    if (arg == "left") {
      if (c_mnthIndex == 0) {
        year = yearDate.subtract("year", 1).year();
        c_mnthIndex = 11;
      } else {
        c_mnthIndex--;
      }
    }
    if (arg == "right") {
      if (c_mnthIndex == 11) {
        year = yearDate.add("year", 1).year();
        c_mnthIndex = 0;
      } else {
        c_mnthIndex++;
      }
    }
    this.setState({
      monthIndex: c_mnthIndex,
      year: year,
      yearOnControl: year,
    });
    this.props.setCurrentMonth(this.state.months[c_mnthIndex], year);
  }

  toggleDropDownMonths() {
    this.setState({
      displayMonthDropDown: !this.state.displayMonthDropDown,
      opacity: !this.state.displayMonthDropDown ? "1" : "0",
      top: !this.state.displayMonthDropDown ? "50px" : "25px",
      zIndex: !this.state.displayMonthDropDown ? 100 : -1,
    });
  }

  handleMonthClick(mnthIndex) {
    this.setState({
      monthIndex: mnthIndex,
      displayMonthDropDown: false,
      year: this.state.yearOnControl,
      opacity: "0",
      top: "25px",
      zIndex: -1,
    });
    this.props.setCurrentMonth(this.state.months[mnthIndex], this.state.yearOnControl);
  }
  handleYearChange(control_arg, curr_year) {
    let yearDate = moment().set("year", curr_year);

    if (control_arg == "left") {
      yearDate = yearDate.subtract("year", 1).year();
    }
    if (control_arg == "right") {
      yearDate = yearDate.add("year", 1).year();
    }

    this.setState({
      yearOnControl: yearDate,
    });
  }
  render() {
    let yearComp = <YearControlComponent handleYearChange={this.handleYearChange} browseYear={this.state.yearOnControl} />;
    return (
      <div>
        {/* {this.state.displayMonthDropDown && ( */}
        <div style={{ position: "relative" }}>
          <DropDownMonths
            months={this.state.months}
            handleMonthClick={this.handleMonthClick}
            yearComp={yearComp}
            opacity={this.state.opacity}
            top={this.state.top}
            zIndex={this.state.zIndex}
          />
        </div>
        {/* )} */}
        <ControlArrow
          icon={angleLeft}
          click_arg="left"
          itemIndex={this.state.monthIndex}
          handleControlClick={this.handleMonthControlClick}
        />
        <CenterTextControl
          textName={`${languageService(this.state.months[this.state.monthIndex])} ${this.state.year}`}
          toggleDropDownMonths={this.toggleDropDownMonths}
        />
        <ControlArrow
          icon={angleRight}
          click_arg="right"
          itemIndex={this.state.monthIndex}
          handleControlClick={this.handleMonthControlClick}
        />
      </div>
    );
  }
}

export default CalendarControls;
