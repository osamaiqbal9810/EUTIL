import React, { Component } from "react";
import CalendarDatesTable from "./CalendarDatesTable";
import CalendarControls from "./CalendarControls";
import moment from "moment";
import { themeService } from "theme/service/activeTheme.service";
import { calenderStyle } from "./style/Calender";
class CalendarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonthName: this.props.calendarMonth ? this.props.calendarMonth : moment.months()[moment().month()],
      monthIndex: this.props.calendarMonth
        ? parseInt(
            moment()
              .month(this.props.calendarMonth)
              .format("M"),
            10,
          ) - 1
        : moment().month(),
      months: moment.months(),
      currentYear: this.props.calendarYear ? this.props.calendarYear : moment().year(),
      data: {},
    };
    console.log(this.state.monthIndex);
    this.setCurrentDateCalender = this.setCurrentDateCalender.bind(this);
    this.updateDataCalender = this.updateDataCalender.bind(this);
    this.props.reCalculateDataCaller(this.updateDataCalender);
  }

  setCurrentDateCalender(mnthName, year) {
    this.setState({
      currentMonthName: mnthName,
      currentYear: year,
    });

    this.props.getCurrentDate(mnthName, year);
  }

  updateDataCalender(data, dateProperty) {
    let data_obj = {};
    data.forEach(d => {
      let date = moment(d[dateProperty]).format("YYYYMMDD");
      this.props.dateWithoutConversion &&
        (date = moment(d[dateProperty])
          .parseZone()
          .format("YYYYMMDD"));
      if (data_obj[date]) {
        data_obj[date].push(d);
      } else {
        data_obj[date] = [d];
      }
    });
    this.setState({
      data: data_obj,
    });
  }

  componentDidMount() {
    if (this.props.getDateControls) {
      this.props.getDateControls(
        <CalendarControls
          setCurrentMonth={this.setCurrentDateCalender}
          year={this.state.currentYear}
          monthIndex={this.state.monthIndex}
          months={this.state.months}
        />,
      );
    }
    this.props.getCurrentDate(this.state.months[this.state.monthIndex], this.state.currentYear);
  }

  render() {
    return (
      <div style={themeService(calenderStyle.calender)}>
        {!this.props.getDateControls && (
          <CalendarControls
            setCurrentMonth={this.setCurrentDateCalender}
            year={this.state.currentYear}
            monthIndex={this.state.monthIndex}
            months={this.state.months}
          />
        )}
        <CalendarDatesTable
          month={this.state.currentMonthName}
          year={this.state.currentYear}
          version={this.props.version}
          data={this.state.data}
          selectionListData={this.props.selectionListData}
          userList={this.props.userList}
          updateSelectionData={this.props.updateSelectionData}
          handleViewItem={this.props.handleViewItem}
        />
      </div>
    );
  }
}

export default CalendarView;
