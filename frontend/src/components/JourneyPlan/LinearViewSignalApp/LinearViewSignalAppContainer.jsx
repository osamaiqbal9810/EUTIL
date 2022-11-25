import React, { Component } from "react";
import LinearDistance from "./linearDistanceControl";
import moment from "moment";
import PropTypes from "prop-types";
import { glass } from "react-icons-kit/fa/glass";
import { cross } from "react-icons-kit/icomoon/cross";
import SvgIcon from "react-icons-kit";
import { caretUp } from "react-icons-kit/fa/caretUp";
import { caretDown } from "react-icons-kit/fa/caretDown";
import _ from "lodash";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
class LinearViewSignalAppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: sampleDataSet,
      yAxisItems: yAxisItems,
    };

    this.handleStatusClick = this.handleStatusClick.bind(this);
  }
  componentDidMount() {
    this.loadLinearDistance(this.state.yAxisItems);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.linearData != prevProps.linearData) {
      this.loadLinearDistance(this.state.yAxisItems);
    }
  }
  handleStatusClick(item) {
    let yAxisItemsCopy = _.cloneDeep(this.state.yAxisItems);
    let foundItemIndex = _.findIndex(yAxisItemsCopy, { id: item.id });
    if (foundItemIndex > -1) {
      yAxisItemsCopy[foundItemIndex] = { ...yAxisItemsCopy[foundItemIndex], expand: !yAxisItemsCopy[foundItemIndex].expand };
      this.setState({
        yAxisItems: yAxisItemsCopy,
      });
    }
    this.loadLinearDistance(yAxisItemsCopy);
  }
  loadLinearDistance(yAxisItemsArg) {
    // let yAxis = [this.props.config.startDate];

    let yAxis = [];
    yAxisItemsArg.map((item, index) => {
      yAxis.push({
        comp: (
          <div key={item.name} onClick={(e) => this.handleStatusClick(item)}>
            {item.name}
            <span>
              <SvgIcon icon={item.expand ? caretUp : caretDown} />
            </span>
          </div>
        ),
        item: item,
        key: item.name ? item.name + this.props.headingLabel : index + this.props.headingLabel,
      });
      if (item.expand) {
        let AType = _.find(this.props.assetTypes, { assetType: item.match });
        if (AType && AType.defectCodesObj) {
          let list = [];
          recurDefectCode(AType.defectCodesObj.details, list);

          list.forEach((item) => {
            yAxis.push({
              comp: <div key={item.code}> {item.code + " " + item.title}</div>,
              item: item,
              assetType: AType.assetType,
              key: item.code + "--" + AType.assetType,
            });
          });
        }
      }
    });
    yAxis.unshift([]);
    let result = this.calculateDataArray(yAxis, yAxisItemsArg);
    let units = (this.props.end - this.props.start) / this.props.config.unitSize;
    let dataSet = {
      data: result.data,
      headingLabel: this.props.headingLabel,
      prefix: this.props.config.prefix ? this.props.config.prefix : "",
      unitSize: this.props.config.unitSize,
      start: this.props.start,
      end: this.props.end,
      suffix: this.props.config.suffix ? this.props.config.suffix : "",
      units: this.props.config.units ? this.props.config.units : units,
      yAxis: yAxis,
    };
    this.setState({
      dataSet: dataSet,
      //   linearDataByAssetType: result.linearDataByAssetType,
    });
  }

  calculateDataArray(yAxis, yAxisItemsArg) {
    // this function puts all the linear data into linearDataByAssetType with yAxis indexes then iterate over it once to fill the boxes,  optimized for least iterations.
    let data = [];
    let linearDataByAssetType = [];
    let uniqueUnits = {};
    yAxis.map((y) => {
      data.push([]);
    });
    this.props.linearData &&
      this.props.linearData.forEach((dat) => {
        dat &&
          dat.tasks &&
          dat.tasks.forEach((task) => {
            if (task.units) {
              task.issues &&
                task.issues.forEach((issue) => {
                  let uIndex = _.findIndex(task.units, { id: issue.unit.id });
                  if (uIndex > -1 && issue.defectCodes.length > 0) {
                    !task.units[uIndex].defectCodes && (task.units[uIndex].defectCodes = []);

                    issue.defectCodes.forEach((dc) => {
                      if (dc) {
                        task.units[uIndex].defectCodes.push(dc);
                        task.units[uIndex].status = 1;
                      }
                    });
                  }
                });
              task.units.forEach((unit) => {
                if (!uniqueUnits[unit.id]) {
                  let unitObj = _.find(yAxisItemsArg, { match: unit.assetType });
                  unitObj && linearDataByAssetType.push({ ...unit, taskId: task.taskId, planId: dat._id, icon: unitObj.icon });
                  uniqueUnits[unit.id] = true;
                } else if (unit.status == 1) {
                  let findIndex = _.findIndex(linearDataByAssetType, { id: unit.id });
                  if (findIndex > -1) {
                    linearDataByAssetType[findIndex].status = 1;
                    linearDataByAssetType[findIndex].defectCodes &&
                      (linearDataByAssetType[findIndex].defectCodes = [
                        ...linearDataByAssetType[findIndex].defectCodes,
                        ...unit.defectCodes,
                      ]);
                    !linearDataByAssetType[findIndex].defectCodes && (linearDataByAssetType[findIndex].defectCodes = unit.defectCodes);
                  }
                }
              });
            }
          });
      });
    linearDataByAssetType.forEach((unit) => {
      let start = parseFloat(unit[this.props.config.startField]);
      // we assume its a fixed asset so no end is used
      //let end = parseFloat(unit[this.props.config.endField]);
      let iterator = this.props.start;
      let count = 0;

      while (iterator <= this.props.end) {
        let nextVal = iterator + this.props.config.unitSize;
        // unit is inside the box area
        !data[0][count] && (data[0][count] = []);
        let unitToUpdate = null;
        if (iterator <= start && nextVal > start) {
          let unitToPush = { ...unit };
          if (!unit.added) {
            unit.added = true;
            data[0][count].push(unitToPush);
            unitToUpdate = _.cloneDeep(unitToPush);
          }
        }
        yAxis.forEach((yAx, yAxisIndex) => {
          !data[yAxisIndex][count] && (data[yAxisIndex][count] = []);
          if (yAx.item && yAx.item.title && unitToUpdate && unitToUpdate.assetType == yAx.assetType) {
            let newUnitCopy = _.cloneDeep(unitToUpdate);
            newUnitCopy.status = 0;
            let dcCheck = _.find(newUnitCopy.defectCodes, (dc) => {
              return dc == yAx.item.code;
            });
            if (dcCheck) newUnitCopy.status = 1;
            data[yAxisIndex][count].push(newUnitCopy);
          }
        });

        count++;
        iterator = nextVal;
      }
    });

    return { data: data };
  }

  render() {
    return <LinearDistance dataSet={this.state.dataSet} yAxisMainItems={this.state.yAxisItems} />;
  }
}

LinearViewSignalAppContainer.defaultProps = {
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
    moment().startOf("isoWeek").add(1, "days"),
    moment().startOf("isoWeek").add(2, "days"),
    moment().startOf("isoWeek").add(3, "days"),
    moment().startOf("isoWeek").add(4, "days"),
    moment().startOf("isoWeek").add(5, "days"),
    moment().startOf("isoWeek").add(6, "days"),
  ],
  data: [
    [1, 1, 1, 0.5],
    [0, 0, 0, -0.5, 1, 1, 0.75],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [],
    [0, 0, 0, -0.25, 1, 1, 1],
    [1, 1, 1, 0.5],
    [0, 1, 1, 1, 1, 1, 0.5, 0, 0, 0],
  ],
  headingLabel: "Lahore",
  units: 10,
  start: 4,
  end: 14,
  prefix: "MP",
  suffix: "",
  unitSize: 1,
};

export default LinearViewSignalAppContainer;

let yAxisItems = [
  { name: "Crossing Status", id: "crossing", expand: false, match: "Crossing", icon: cross },
  { name: "Signal Status ", id: "signal", expand: false, match: "Signal", icon: glass },
];

function recurDefectCode(details, arrayToPush) {
  if (details && details.length > 0) {
    details.forEach((detail) => {
      if (!detail.details) {
        arrayToPush.push(detail);
      } else {
        recurDefectCode(detail.details, arrayToPush);
      }
    });
  }
}
