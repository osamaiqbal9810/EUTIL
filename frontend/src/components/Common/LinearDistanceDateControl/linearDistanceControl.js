import React, { Component } from "react";
import { Table } from "reactstrap";
import moment from "moment";
import { retroColors } from "../../../style/basic/basicColors";
import { truncateNumber } from "../../../utils/utils";
class LinearDistance extends Component {
  calculateXAxis() {
    let xAxisComp = null;
    if (this.props.dataSet) {
      let th = [];
      let c = 0;
      let s = this.props.dataSet.start;
      while (c <= this.props.dataSet.units) {
        th.push(
          <th style={{ minWidth: "120px" }} key={c}>
            {this.props.dataSet.prefix + " " + s + " " + this.props.dataSet.suffix}
          </th>,
        );
        s = s + this.props.dataSet.unitSize;
        s = truncateNumber(s);
        c++;
      }
      xAxisComp = <React.Fragment>{th}</React.Fragment>;
    }
    return xAxisComp;
  }
  render() {
    let data =
      this.props.dataSet &&
      this.props.dataSet.yAxis.map((yLabel, index) => {
        let td = [];
        let c = 0;
        while (c <= this.props.dataSet.units) {
          let width = 0;
          let onRight = {};
          let color = retroColors.first;
          if (this.props.dataSet.data.length > 0 && this.props.dataSet.data[index] && this.props.dataSet.data[index][c]) {
            width = this.props.dataSet.data[index][c].val * 100;
            this.props.dataSet.data[index][c].bgColor && (color = this.props.dataSet.data[index][c].bgColor);
            if (this.props.dataSet.data[index][c].val < 0) {
              onRight = { float: "right" };
              width = -width;
            }
          }

          td.push(
            <td style={{ padding: "0px", height: "25px" }} key={c}>
              <div style={{ background: color, height: "15px", margin: "10px 0px", width: width + "%", ...onRight }}></div>
            </td>,
          );
          c++;
        }
        return (
          <tr style={{ height: "25px" }} key={yLabel}>
            <th style={{ background: retroColors.fourth, minWidth: "150px" }}>{moment(yLabel).format("LL")}</th>
            {td}
          </tr>
        );
      });
    return (
      <Table style={{ background: "#fff", marginBottom: "0px" }}>
        <thead>{/* <tr style={themeService(calenderCellStyle.dayRow)}>{this.dayNamesHeaderComp}</tr> */}</thead>
        <tbody>
          <tr style={{ height: "35px", background: retroColors.fourth }} key={this.props.dataSet && this.props.dataSet.headingLabel}>
            <th style={{ width: "150px" }}>{this.props.dataSet && this.props.dataSet.headingLabel}</th>
            {this.calculateXAxis()}
          </tr>
          {data}
        </tbody>
      </Table>
    );
  }
}

export default LinearDistance;
