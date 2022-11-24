import React, { Component } from "react";
import { Row, Col, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Calendar from "components/Common/Calendar/Calendar";
import moment from "moment";
import _ from "lodash";

class WOCalendarView extends Component {
  constructor(props) {
    super(props);
    this.state = { cal_data: [], selectionList: [{ name: "", email: "" }] };
    this.getCurrentDate = this.getCurrentDate.bind(this);
    /// this.changeUserAndUpdate = this.changeUserAndUpdate.bind(this);
    this.handleViewInspection = this.handleViewInspection.bind(this);
  }

  getCurrentDate(mnthName, year) {
    let date = moment()
      .month(mnthName)
      .year(year)
      .startOf("month");
    // console.log(date);
    let range = {
      from: moment()
        .month(mnthName)
        .year(year)
        .startOf("month"),
      today: moment().endOf("day"),
      to: moment()
        .month(mnthName)
        .year(year)
        .endOf("month"),
    };
    this.props.getRangeDataFromServer(range);
  }

  componentDidMount() {
    if (this.props.workorders)
      this.dataUpdater(this.props.workorders, "dueDate");
    // let list = this.props.userList.map(user => {
    //   return user.email;
    // });
    // this.setState({
    //   selectionList: list,
    // });
  }

  componentDidUpdate(prevProps, prevState) {
      if (this.props.workorders)
          this.dataUpdater(this.props.workorders, "dueDate");
    // if (prevProps.actionType !== this.props.actionType && this.props.actionType == "JOURNEYPLANS_READ_SUCCESS") {
    //   this.dataUpdater(this.props.journeyPlans, "date");
    // }
    // if (
    //   prevProps.lineSelectionActionType !== this.props.lineSelectionActionType &&
    //   this.props.lineSelectionActionType == "GET_MULTIPLE_LINES_DATA_SUCCESS"
    // ) {
    //   this.dataUpdater(this.props.multiData, "date");
    // }
    // if (this.props.userList !== prevProps.userList && this.props.userList.length > 0) {
    //   let list = this.props.userList.map(user => {
    //     return user.email;
    //   });
    //   this.setState({
    //     selectionList: list,
    //   });
    // }
  }

  //   changeUserAndUpdate(email, inspection) {
  //     let foundUser = _.find(this.props.userList, { email: email });
  //     if (foundUser) {
  //       this.props.changeUserAndUpdate(foundUser._id, inspection);
  //     }
  //   }

  handleViewInspection(inspection) {
    // let checkRealObj = inspection._id;
    // if (!checkRealObj) {
    //   checkRealObj = "futureInspection";
    // }
    // this.props.history.push("inspections/" + checkRealObj);
    // this.props.handleViewClick(inspection);
  }

  render() {
    return (
      <Col md="12">
        <Calendar
          getDateControls={this.props.getDateControls}
          getCurrentDate={this.getCurrentDate}
          data={this.state.cal_data}
          dataDateProperty={"dueDate"}
          reCalculateDataCaller={method => {
            this.dataUpdater = method;
          }}
          version="workOrder"
          selectionListData={this.state.selectionList}
          updateSelectionData={this.changeUserAndUpdate}
          handleViewItem={this.handleViewInspection}
        />
      </Col>
    );
  }
}

export default WOCalendarView;
