import React from "react";
import "./style.css";
import CrossingHeading from "./header";
import { getFieldsReportForm } from "../../appFormReportsUtility";

const reportData = [
  { cable: "Underground", tobs: "12", wsiz: "14", frun: "HOUSE", trun: "CP NORTHWOOD B", test: "C" },
  { cable: "Underground", tobs: "13", wsiz: "14", frun: "HOUSE", trun: "CP NORTHWOOD B", test: "C" },
  { cable: "Underground", tobs: "6", wsiz: "14", frun: "HOUSE", trun: "CP NORTHWOOD B", test: "C" },
  { cable: "Underground", tobs: "13", wsiz: "14", frun: "HOUSE", trun: "CP NORTHWOOD B", test: "C" },
  { cable: "Underground", tobs: "6", wsiz: "14", frun: "HOUSE", trun: "CP NORTHWOOD B", test: "C" },
  { cable: "Underground", tobs: "13", wsiz: "14", frun: "HOUSE", trun: "CP NORTHWOOD B", test: "C" },
  { cable: "Underground", tobs: "6", wsiz: "14", frun: "HOUSE", trun: "CP NORTHWOOD B", test: "C" },
  { cable: "Underground", tobs: "13", wsiz: "14", frun: "HOUSE", trun: "CP NORTHWOOD B", test: "C" },
  { cable: "Underground", tobs: "6", wsiz: "14", frun: "HOUSE", trun: "CP NORTHWOOD B", test: "C" },
  { cable: "Underground", tobs: "12", wsiz: "14", frun: "HOUSE", trun: "CP NORTHWOOD B", test: "C" },
];
class InsulationTestInspection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicData: {},
      data: [],
      inspected: false,
    };
  }
  componentDidMount() {
    this.calculateInsulationData(this.props.insulationData);
  }
  componentDidUpdate(prevProps, prevState) {}
  calculateInsulationData(insulationData) {
    let data = [];
    let inspected = false;
    insulationData &&
      insulationData.forEach((insulData) => {
        let completionField = insulData && insulData.formData && insulData.formData.find((field) => field.tag === "completionCheck");
        if (completionField && (completionField.value === "true" || completionField.value === true)) inspected = true;

        let table = insulData && insulData.formData && insulData.formData.find((field) => field.type === "table");
        if (table && table.value) {
          let dataArray = getFieldsReportForm(table.value);
          data = [...data, ...dataArray];
        }
      });
    this.setState({ data: data, inspected: inspected });
  }
  render() {
    let insulationData =
      this.state.data &&
      this.state.data.map((data) => {
        return (
          <React.Fragment>
            <tr key={data.id}>
              <td colSpan={4}>
                <strong>Cable Type </strong>
                <br />
                <div>{data.cable}</div>
              </td>
              <td colSpan={2}>
                <strong>Conductors</strong>
                <br />
                <div>{data.tobs}</div>
              </td>
              <td colSpan={2}>
                <strong>Wire Size</strong>
                <br />
                <div>{data.wsiz}</div>
              </td>
              <td colSpan={4}>
                <strong>Run From</strong>
                <br />
                <div>{data.frun}</div>
              </td>
              <td colSpan={5}>
                <strong>Run To</strong>
                <br />
                <div>{data.trun}</div>
              </td>
              <td colSpan={1}>
                <strong>Cond.</strong>
                <br />
                <div>{data.test}</div>
              </td>
            </tr>
            <tr>
              <td colSpan={18}>
                <strong>Comments</strong>
                <br />
                {data.com}
              </td>
            </tr>
          </React.Fragment>
        );
      });

    return (
      <React.Fragment>
        {this.state.inspected && (
          <div id="mainContent" className="table-report InsulationTestInspection" style={{ minHeight: "800px", pageBreakAfter: "always" }}>
            <CrossingHeading
              testType="Insulation"
              mainTitle="Inspection Report - Insulation Tests and Inspections"
              data={this.props.basicData}
              selectedAssetId={this.props.selectedAssetId}
            />
            <br />
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th colSpan={18}>
                    <h2>Insulation Tests (FRA 234.267, 236.108)</h2>
                  </th>
                </tr>
              </thead>
              <tbody>
                {insulationData}
                {addEmptyColsIfNotEnough(insulationData, 8, 6)}
              </tbody>
            </table>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default InsulationTestInspection;
function addEmptyColsIfNotEnough(mapArray, minRows, cols) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;
  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr>{getCols(cols)}</tr>;
      emptyRows.push(row);
    }
  }
  return emptyRows;
}
function getCols() {
  let cols = [];
  let span = [];

  span = [4, 2, 2, 4, 5, 1];
  for (let i = 0; i < 6; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
