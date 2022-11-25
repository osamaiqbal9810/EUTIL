import React, { Component } from "react";
import { Row, Col, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Calendar from "components/Common/Calendar/Calendar";
import moment from "moment";
import _ from "lodash";
class AssetCalendarWrapper extends Component {
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
    this.state = { cal_data: [], ...this.inspectionCalendarFilter };
    this.getCurrentDate = this.getCurrentDate.bind(this);
    this.handleViewInspection = this.handleViewInspection.bind(this);
  }

  getCurrentDate(mnthName, year) {
    let range = {
      from: moment().month(mnthName).year(year).startOf("month"),
      today: moment().endOf("day"),
      to: moment().month(mnthName).year(year).endOf("month"),
    };
    this.props.getRangeDataFromServer && this.props.getRangeDataFromServer(range);
    this.props.handleUpdateFilterState &&
      this.props.handleUpdateFilterState({ calendarRange: range, calendarMonth: mnthName, calendarYear: year });
    this.setState({
      range: range,
      calendarMonth: mnthName,
      calendarYear: year,
    });
  }

  componentDidMount() {
    this.dataUpdater(this.props.data, "date");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data && this.props.actionType == this.props.actionReadSuccess) {
      this.dataUpdater(this.props.data, "date");
    }
  }

  handleViewInspection(item) {}

  render() {
    return (
      <Col md="12">
        <Calendar
          getCurrentDate={this.getCurrentDate}
          data={this.state.cal_data}
          dataDateProperty={"date"}
          reCalculateDataCaller={(method) => {
            this.dataUpdater = method;
          }}
          version="assetSchedules"
          handleViewItem={this.handleViewInspection}
          calendarMonth={this.state.calendarMonth}
          calendarYear={this.state.calendarYear}
        />
      </Col>
    );
  }
}

export default AssetCalendarWrapper;
