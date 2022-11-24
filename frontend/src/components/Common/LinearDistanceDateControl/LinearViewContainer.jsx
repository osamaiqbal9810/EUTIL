import React, { Component } from "react";
import LinearDistance from "./linearDistanceControl";
import moment from "moment";
import PropTypes from "prop-types";
class LinearViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: sampleDataSet,
    };
  }
  componentDidMount() {
    this.loadLinearDistance();
  }
  loadLinearDistance() {
    let yAxis = [this.props.config.startDate];
    let nextDate = this.props.config.startDate;
    let numOfDays = this.props.config.endDate.diff(this.props.config.startDate, "days");

    while (numOfDays) {
      nextDate = moment(nextDate).add(this.props.config.dateStep, "days");
      yAxis.push(nextDate);
      numOfDays = numOfDays - this.props.config.dateStep;
    }

    let result = this.calculateDataArray(yAxis);
    let units = Math.ceil((this.props.end - this.props.start) / this.props.config.unitSize);
    let dataSet = {
      yAxis: yAxis,
      data: [...result.data],
      headingLabel: this.props.headingLabel,
      prefix: this.props.config.prefix ? this.props.config.prefix : "",
      unitSize: this.props.config.unitSize,
      start: this.props.start,
      end: this.props.end,
      suffix: this.props.config.suffix ? this.props.config.suffix : "",
      units: this.props.config.units ? this.props.config.units : units,
    };
    this.setState({
      dataSet: dataSet,
      linearDataByDate: result.linearDataByDate,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.linearData != prevProps.linearData) {
      this.loadLinearDistance();
    }
  }
  calculateDataArray(yAxis) {
    // this function puts all the linear data into linearDataByDate with yAxis indexes then iterate over it once to fill the boxes,  optimized for least iterations.
    let data = [];
    let linearDataByDate = [];
    yAxis.map(y => {
      data.push([]);
      linearDataByDate.push([]);
    });
    this.props.linearData &&
      this.props.linearData.forEach(dat => {
        let check = false;
        let index = 0;
        let yAxisLength = yAxis.length;
        while (!check) {
          let dataDateFormat = moment(dat[this.props.config.dateField]).format("YYYY-MM-DD");
          let yAxisFormat = moment(yAxis[index]).format("YYYY-MM-DD");
          if (moment(dataDateFormat).isSame(yAxisFormat)) {
            linearDataByDate[index].push(dat);
            check = true;
          }
          if (index + 1 == yAxisLength) check = true;
          index++;
        }
      });
    linearDataByDate.forEach((dateData, yAxisIndex) => {
      dateData.forEach((d, dIndex) => {
        !data[yAxisIndex] && (data[yAxisIndex] = []);
        let start = parseFloat(d[this.props.config.startField]);
        let end = parseFloat(d[this.props.config.endField]);
        let iterator = this.props.start;
        let count = 0;

        while (iterator <= this.props.end) {
          let nextVal = iterator + this.props.config.unitSize;
          if (!data[yAxisIndex][count]) {
            data[yAxisIndex][count] = 0;
            // start halfway through unit
            if (end < nextVal && end > iterator) {
              let val = (nextVal - end) / this.props.config.unitSize;
              data[yAxisIndex][count] = {
                val: val,
                bgColor: d.bgColor,
                id: d[this.props.config.idField ? this.props.config.idField : "_id"],
              };
            }
            // fill all box
            if (iterator >= start && iterator <= end) {
              data[yAxisIndex][count] = { val: 1, bgColor: d.bgColor };
            } //ends halfway though unit
            if (start > iterator && start < nextVal) {
              let val = (start - nextVal) / this.props.config.unitSize;
              data[yAxisIndex][count] = { val: val, bgColor: d.bgColor };
            }
          }
          count++;
          iterator = nextVal;
        }
      });
    });

    return { data: data, linearDataByDate: linearDataByDate };
  }

  render() {
    return <LinearDistance dataSet={this.state.dataSet} />;
  }
}

LinearViewContainer.defaultProps = {
  config: {
    startDate: moment().startOf("isoWeek"),
    endDate: moment().endOf("isoWeek"),
    dateStep: 1,
    unitSize: 1,
    prefix: "MP",
    dateField: "date",
  },
};

let sampleDataSet = {
  yAxis: [
    moment().startOf("isoWeek"),
    moment()
      .startOf("isoWeek")
      .add(1, "days"),
    moment()
      .startOf("isoWeek")
      .add(2, "days"),
    moment()
      .startOf("isoWeek")
      .add(3, "days"),
    moment()
      .startOf("isoWeek")
      .add(4, "days"),
    moment()
      .startOf("isoWeek")
      .add(5, "days"),
    moment()
      .startOf("isoWeek")
      .add(6, "days"),
  ],
  data: [
    [0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  headingLabel: "",
  units: 1,
  start: 0,
  end: 0,
  prefix: "MP",
  suffix: "",
  unitSize: 1,
};

export default LinearViewContainer;
