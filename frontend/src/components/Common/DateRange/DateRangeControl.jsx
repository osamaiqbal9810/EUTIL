import React, { Component } from "react";
import moment from "moment";
import { MyButton } from "../Forms/formsMiscItems";
import "./style.css";

export default class DateRangeControl extends Component {
  constructor(props) {
    super(props);

    this.state = { iPeriod: this.props.iPeriod, year: this.props.year, pRange: this.props.pRange, submit: this.props.submit };

    this.inputPeriodSelect = this.inputPeriodSelect.bind(this);
    this.onYearSelect = this.onYearSelect.bind(this);
    this.periodRangeSelect = this.periodRangeSelect.bind(this);
    this.getFinalDate = this.getFinalDate.bind(this);
  }
  onYearSelect(e) {
    this.setState({
      year: e.target.value,
      submit: this.checkSubmit(e.target.value, this.state.iPeriod, this.state.pRange),
    });
    this.props.handleUpdateFilterState({
      year: e.target.value,
      submit: this.checkSubmit(e.target.value, this.state.iPeriod, this.state.pRange),
    });
  }

  inputPeriodSelect(e) {
    let pR = getpR(e.target.value);
    this.setState({
      iPeriod: e.target.value,
      pRange: e.target.value === "Year" ? parseInt(this.state.year) : pR ? pR[0] : "",
      submit: this.checkSubmit(this.state.year, e.target.value, pR ? pR[0] : this.state.pRange),
    });
    this.props.handleUpdateFilterState({
      iPeriod: e.target.value,
      pRange: e.target.value === "Year" ? parseInt(this.state.year) : pR ? pR[0] : "",
      submit: this.checkSubmit(this.state.year, e.target.value, pR ? pR[0] : this.state.pRange),
    });
  }
  periodRangeSelect(e) {
    this.setState({
      pRange: e.target.value,
      submit: this.checkSubmit(this.state.year, this.state.iPeriod, e.target.value),
    });
    this.props.handleUpdateFilterState({
      pRange: e.target.value,
      submit: this.checkSubmit(this.state.year, this.state.iPeriod, e.target.value),
    });
  }
  checkSubmit(y, ip, pr) {
    if (y && ip && pr) return true;
    else return false;
  }
  getFinalDate() {
    let dateRange = rangeCalculater(this.state.year, this.state.iPeriod, this.state.pRange, "start");
    dateRange.today = moment();
    this.setState({
      submit: false,
    });
    let stateRange = { year: this.state.year, iPeriod: this.state.iPeriod, pRange: this.state.pRange };

    this.props.dateRangeChanged && this.props.dateRangeChanged(dateRange, stateRange);
  }
  render() {
    let yearsOpts = null;
    let y = moment().add("year", 1).year(Number);
    if (y) {
      yearsOpts = [];
      for (let i = 0; i < 19; i++) {
        let val = y.subtract("year", 1).format("YYYY");
        yearsOpts.push(
          <option value={val} key={val}>
            {val}
          </option>,
        );
      }
    }
    let ipVals = ["", "Month", "Quarter", "Six Month", "Year"];
    let ipOptions = ipVals.map((val) => {
      return (
        <option value={val} key={val}>
          {val}
        </option>
      );
    });
    return (
      <div>
        <div className="rep-filter-select">
          <span className="rep-filter-title">Report Period </span>
          <span style={{ display: "inline-block" }}>
            {/* <span>Year</span> */}
            <span>
              <select style={selectStyle} value={this.state.year} onChange={this.onYearSelect}>
                {yearsOpts}
              </select>
            </span>
          </span>
        </div>
        <div className="rep-filter-select">
          <span className="rep-filter-title">Time Period </span>
          <span style={{ display: "inline-block" }}>
            {/* <span>Report Period</span> */}
            <span>
              <select style={selectStyle} value={this.state.iPeriod} onChange={this.inputPeriodSelect}>
                {ipOptions}
              </select>
            </span>
          </span>
        </div>
        <div className="rep-filter-select">
          <span className="rep-filter-title">{this.state.iPeriod}</span>
          <span style={{ display: "inline-block" }}>
            {/* <span>Period Range</span> */}
            <span>
              <select style={selectStyle} onChange={this.periodRangeSelect} value={this.state.pRange}>
                {periodRangeOpts(this.state.iPeriod)}
              </select>
            </span>
          </span>
        </div>

        <span style={{ display: "inline-block", marginLeft: "10px" }}>
          <MyButton onClick={this.getFinalDate} disabled={!this.state.submit}>
            Search
          </MyButton>
        </span>
      </div>
    );
  }
}
const selectStyle = {
  width: "150px",
};
const monthsArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const periodRangeOpts = (iPeriod) => {
  let opts = null;
  let pR = getpR(iPeriod);
  if (pR) {
    opts = pR.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ));
  }
  return opts;
};
function getpR(iP) {
  let pR = {
    Month: monthsArray,
    Quarter: [1, 2, 3, 4],
    "Six Month": ["Jan-June", "July-December"],
    Year: getYears(),
  };
  return pR[iP];
}
function getYears() {
  let y = moment().add("year", 1).year(Number);
  let years = [];
  for (let i = 0; i < 20; i++) {
    let val = y.subtract("year", 1).format("YYYY");
    years.push(val);
  }
  return years;
}

function rangeCalculater(year, iPeriod, pRange, direc) {
  let dateVal = { from: moment(), to: moment() };

  dateVal.from.set("year", year);
  dateVal.to.set("year", year);
  if (direc === "start") {
    switch (iPeriod) {
      case "Month":
        let mI = monthsArray.findIndex((m) => m === pRange);
        if (mI > -1) {
          dateVal.from.set("month", mI).startOf("month");
          dateVal.to.set("month", mI).endOf("month");
        }
        break;
      case "Quarter":
        dateVal.from.quarter(pRange).startOf("quarter");
        dateVal.to.quarter(pRange).endOf("quarter");
        break;
      case "Six Month":
        let m0 = pRange === "Jan-June" ? 0 : 6;
        let m1 = pRange === "Jan-June" ? 5 : 11;
        dateVal.from.set("month", m0).startOf("month");
        dateVal.to.set("month", m1).endOf("month");
        break;
      case "Year":
        dateVal.to.endOf("year");
        dateVal.from.set("year", pRange).startOf("year");
        if (dateVal.from.isAfter(dateVal.to)) {
          dateVal.to.set("year", pRange).endOf("year");
          dateVal.from.set("year", year).startOf("year");
        }
        break;
      default:
        dateVal.from.startOf("month");
        dateVal.to.endOf("month");
    }
  }
  return dateVal;
}
