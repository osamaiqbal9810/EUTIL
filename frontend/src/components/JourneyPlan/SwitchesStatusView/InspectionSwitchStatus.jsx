import React, { Component } from "react";
import moment from "moment";
import { getStatusColor } from "../../../utils/statusColors";
import _ from "lodash";
import { random } from "react-icons-kit/fa/random";

import SvgIcon from "react-icons-kit";
import InspectionStatusesDisplay from "../LinearView/InspectionStatusesDisplay";
import { inspectionSwitchStatusStyle } from "./styles";
import CustomTooltip from "../../Common/CustomTooltip";
export default class InspectionSwitchStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: null,
    };
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data != prevProps.data && this.props.data) {
      this.loadData();
    }
  }
  loadData() {
    let dataObj = this.calculateDataAndXAxis();

    let dataSet = {
      data: dataObj.data,
      headingLabel: this.props.data.location.unitId,
      prefix: this.props.config.prefix ? this.props.config.prefix : "",
      suffix: this.props.config.suffix ? this.props.config.suffix : "",
      yAxis: dataObj.yAxis,
      xAxis: dataObj.xAxis,
    };
    this.setState({
      dataSet,
    });
  }
  calculateDataAndXAxis() {
    const { data } = this.props;

    let xAxis = [];
    let cellData = [];
    let yAxis = [...this.props.yAxis];

    cellData.push([]); // first row for assets
    yAxis.unshift({ text: "" });
    let yAxisLength = yAxis.length;
    data.assetsToPass.forEach((asset, aIndex) => {
      xAxis.push({
        id: asset._id,
        text: truncateNumber(asset.start),
        comp: (
          <div key={asset._id} style={{ textAlign: "center" }}>
            <span id={`check-${asset._id}`}> {"MP " + truncateNumber(asset.start)}</span>
            <CustomTooltip target={`check-${asset._id}`} value={asset.unitId} placement={"top"} />
          </div>
        ),
      });
      // layOut asset on first row after Axis
      let assetComp = (
        <div style={{ ...inspectionSwitchStatusStyle.assetWithIcon(asset.status), textAlign: "center" }} key={asset._id}>
          <SvgIcon icon={random} size={25} />
        </div>
      );
      cellData[0].push({ comp: assetComp });

      // handle inspection data of each asset on yAxises
      asset.inspections &&
        asset.inspections.forEach((ins_id) => {
          let findIns = _.find(data.inspectionRelated, { id: ins_id });
          let inspecInRangeIndex = -1;
          if (findIns) {
            inspecInRangeIndex = _.findIndex(yAxis, function (yAxDate, index) {
              const sameDateDayCheck = yAxDate && yAxDate.date && moment(yAxDate.date).isSame(moment(findIns.date), "day");
              //&&(index + 1 == yAxisLength ? true : moment(yAxis[index + 1].text).isAfter(moment(findIns.date), "day"));
              return sameDateDayCheck;
            });
          }
          if (inspecInRangeIndex > -1) {
            !cellData[inspecInRangeIndex] && (cellData[inspecInRangeIndex] = []);
            !cellData[inspecInRangeIndex][aIndex] && (cellData[inspecInRangeIndex][aIndex] = []);
            let comp = <div style={inspectionSwitchStatusStyle.inspectionCell(getStatusColor(findIns.status))}>{findIns.title}</div>;
            cellData[inspecInRangeIndex][aIndex] = { comp: comp, key: findIns.id };
          }
        });
      yAxis.forEach((yAxDate, index) => {
        !cellData[index] && (cellData[index] = []);
        !cellData[index][aIndex] && (cellData[index][aIndex] = null);
      });
    });

    let dataObj = { xAxis: xAxis, yAxis: yAxis, data: cellData };
    return dataObj;
  }
  render() {
    return (
      <div>
        <InspectionStatusesDisplay dataSet={this.state.dataSet} />
      </div>
    );
  }
}

function truncateNumber(num) {
  let retNum = num ? parseFloat(num) : 0;
  let checkNum = Number.isInteger(retNum);
  if (!checkNum) {
    retNum = parseFloat(retNum.toFixed(2));
  }
  return retNum;
}
