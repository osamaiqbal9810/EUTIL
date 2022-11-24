import React, { Component } from "react";
import { Row, Col, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Calendar from "components/Common/Calendar/Calendar";
import moment from "moment";
import _ from "lodash";
class CalendarInspections extends Component {
  constructor(props) {
    super(props);
    this.inspectionCalendarFilter = {};
    if (this.props.inspectionFilter) {
      this.inspectionCalendarFilter = {
        calendarMonth: this.props.inspectionFilter.calendarMonth,
        calendarYear: this.props.inspectionFilter.calendarYear,
        range: this.props.inspectionFilter.calendarRange,
      };
    }
    this.state = { cal_data: [], selectionList: [], ...this.inspectionCalendarFilter };
    this.getCurrentDate = this.getCurrentDate.bind(this);
    this.changeUserAndUpdate = this.changeUserAndUpdate.bind(this);
    this.handleViewInspection = this.handleViewInspection.bind(this);
  }

  getCurrentDate(mnthName, year) {
    let date = moment().month(mnthName).year(year).startOf("month");
    let range = {
      from: moment().month(mnthName).year(year).startOf("month"),
      today: moment().endOf("day"),
      to: moment().month(mnthName).year(year).endOf("month"),
    };

    this.props.assetChildren && this.props.getRangeDataFromServer(range);
    this.props.handleUpdateFilterState({ calendarRange: range, calendarMonth: mnthName, calendarYear: year });
    this.setState({
      range: range,
      calendarMonth: mnthName,
      calendarYear: year,
    });
  }

  componentDidMount() {
    this.dataUpdater(this.props.journeyPlans, "date");
    let list = this.props.userList.map((user) => {
      return user.email;
    });
    this.setState({
      selectionList: list,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.actionType !== this.props.actionType && this.props.actionType == "JOURNEYPLANS_READ_SUCCESS") {
    //   this.dataUpdater(this.props.journeyPlans, "date");
    // }
    if (prevProps.journeyPlans !== this.props.journeyPlans && this.props.actionType == "JOURNEYPLANS_READ_SUCCESS") {
      this.dataUpdater(this.props.journeyPlans, "date");
    }
    if (
      prevProps.lineSelectionActionType !== this.props.lineSelectionActionType &&
      this.props.lineSelectionActionType == "GET_MULTIPLE_LINES_DATA_SUCCESS"
    ) {
      this.dataUpdater(this.props.multiData, "date");
    }
    if (this.props.userList !== prevProps.userList && this.props.userList.length > 0) {
      let list = this.props.userList.map((user) => {
        return user.email;
      });
      this.setState({
        selectionList: list,
      });
    }
    if (this.props.assetChildren && !prevProps.assetChildren) {
      this.props.getRangeDataFromServer(this.state.range);
    }
  }

  changeUserAndUpdate(email, inspection) {
    let foundUser = _.find(this.props.userList, { email: email });
    if (foundUser) {
      this.props.changeUserAndUpdate(foundUser._id, inspection);
    }
  }

  handleViewInspection(inspection) {
    let checkRealObj = inspection._id;
    if (!checkRealObj) {
      checkRealObj = "futureInspection";
    }
    this.props.history.push("inspections/" + checkRealObj);
    this.props.handleViewClick(inspection);
  }

  render() {
    return (
      <Col md="12">
        <Calendar
          getDateControls={this.props.getDateControls}
          getCurrentDate={this.getCurrentDate}
          data={this.state.cal_data}
          dataDateProperty={"date"}
          reCalculateDataCaller={(method) => {
            this.dataUpdater = method;
          }}
          version="inspection"
          selectionListData={this.state.selectionList}
          userList={this.props.userList}
          updateSelectionData={this.changeUserAndUpdate}
          handleViewItem={this.handleViewInspection}
          calendarMonth={this.state.calendarMonth}
          calendarYear={this.state.calendarYear}
          // dateWithoutConversion
        />
      </Col>
    );
  }
}

export default CalendarInspections;
