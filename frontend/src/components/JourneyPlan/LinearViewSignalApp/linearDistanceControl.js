import React, { Component } from "react";
import { Table } from "reactstrap";
import moment from "moment";
import { certificate } from "react-icons-kit/fa/certificate";
import SvgIcon from "react-icons-kit";

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
          let color = retroColors.first;
          let unitsComp = null;
          if (this.props.dataSet.data.length > 0 && this.props.dataSet.data[index] && this.props.dataSet.data[index][c]) {
            let units = this.props.dataSet.data[index][c];

            unitsComp =
              units &&
              units.length > 0 &&
              units.map(unit => {
                return (
                  <div style={{ color: !unit.status ? color : "red", height: "15px", margin: "10px 0px" }} key={unit.id}>
                    <SvgIcon icon={yLabel.item && yLabel.item.title ? certificate : unit.icon} />
                  </div>
                );
              });
          }

          td.push(
            <td style={{ padding: "0px", height: "25px" }} key={c}>
              {unitsComp}
            </td>,
          );
          c++;
        }
        return (
          <tr style={{ height: "25px" }} key={yLabel.key}>
            <th style={{ background: "#fbfbfb", fontWeight: "100", minWidth: "280px" }}>{yLabel.comp}</th>
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
