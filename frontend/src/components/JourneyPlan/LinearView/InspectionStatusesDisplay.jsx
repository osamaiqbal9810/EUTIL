import React, { Component } from "react";
import { Table } from "reactstrap";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { inspectionStatusDisplayTableStyles } from "./styles";
export default class InspectionStatusesDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      xAxis: null,
    };
  }

  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {
    if (this.props.dataSet !== prevProps.dataSet && this.props.dataSet) {
      this.calculateTableData();
    }
  }
  calculateTableData() {
    let data =
      this.props.dataSet &&
      this.props.dataSet.yAxis.map((yLabel, index) => {
        let td = [];

        td =
          this.props.dataSet.data[index] &&
          this.props.dataSet.data[index].map((dat, datIndex) => {
            return (
              <td
                style={inspectionStatusDisplayTableStyles.dataCell}
                key={yLabel.text + this.props.dataSet.headingLabel + "xAxis" + datIndex}
              >
                {dat && dat.comp ? dat.comp : null}
              </td>
            );
          });

        return (
          <tr style={inspectionStatusDisplayTableStyles.yAxisRowStyle} key={yLabel.text + index + this.props.dataSet.headingLabel}>
            <th style={inspectionStatusDisplayTableStyles.yAxisHeadingStyle}>{yLabel.comp ? yLabel.comp : yLabel.text}</th>
            {td}
          </tr>
        );
      });
    let xAxis = this.calculateXAxis();
    this.setState({
      data: data,
      xAxis: xAxis,
    });
  }
  calculateXAxis() {
    let xAxisComp = null;
    if (this.props.dataSet) {
      let th = [];
      th = this.props.dataSet.xAxis.map((xAx) => {
        return (
          <th style={inspectionStatusDisplayTableStyles.xAxisHeadingStyle} key={xAx.id}>
            {xAx.comp && xAx.comp}
            {!xAx.comp && <React.Fragment> {this.props.dataSet.prefix + " " + xAx.text + " " + this.props.dataSet.suffix}</React.Fragment>}
          </th>
        );
      });
      xAxisComp = <React.Fragment>{th}</React.Fragment>;
    }
    return xAxisComp;
  }
  render() {
    return (
      <Table style={inspectionStatusDisplayTableStyles.tableStyle}>
        <thead>{/* <tr style={themeService(calenderCellStyle.dayRow)}>{this.dayNamesHeaderComp}</tr> */}</thead>
        <tbody>
          <tr style={inspectionStatusDisplayTableStyles.xAxisRowStyle} key={this.props.dataSet && this.props.dataSet.headingLabel}>
            <th style={inspectionStatusDisplayTableStyles.mainHeadingStyle}>{this.props.dataSet && this.props.dataSet.headingLabel}</th>
            {this.state.xAxis}
          </tr>
          {this.state.data}
        </tbody>
      </Table>
    );
  }
}
