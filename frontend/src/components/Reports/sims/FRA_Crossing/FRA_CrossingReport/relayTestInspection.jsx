import React from "react";
import _ from "lodash";
import "./style.css";
import CrossingHeading from "./header";
import { getFieldsReport, getFieldsReportForm } from "../../appFormReportsUtility";
import moment from "moment";
const reportData = [
  {
    sname: "ROW 1",
    rname: "MDR",
    sno: "1717087",
    test: "C",
    rtype: "ST (400004 / 400004)",
    resis: "500",
    cont: "4FB-2F-1B",
    tdate: "02/09/2021",
    drop: "0.0053 A DC",
    pick: "0.0104 A DC",
    work: "0.0104 A DC",
  },
  {
    sname: "ROW 1",
    rname: "1XR",
    sno: "1717087",
    test: "C",
    rtype: "ST (400004 / 400004)",
    resis: "500",
    cont: "4FB-2F-1B",
    tdate: "02/09/2021",
    drop: "0.0053 A DC",
    pick: "0.0104 A DC",
    work: "0.0104 A DC",
  },
  {
    sname: "ROW 1",
    rname: "XGPR",
    sno: "1717087",
    test: "C",
    rtype: "ST (400004 / 400004)",
    resis: "500",
    cont: "4FB-2F-1B",
    tdate: "02/09/2021",
    drop: "0.0053 A DC",
    pick: "0.0104 A DC",
    work: "0.0104 A DC",
  },
  {
    sname: "ROW 1",
    rname: "GPXR",
    sno: "1717087",
    test: "C",
    rtype: "ST (400004 / 400004)",
    resis: "500",
    cont: "4FB-2F-1B",
    tdate: "02/09/2021",
    drop: "0.0053 A DC",
    pick: "0.0104 A DC",
    work: "0.0104 A DC",
  },
  {
    sname: "ROW 1",
    rname: "FR",
    sno: "1717087",
    test: "C",
    rtype: "ST (400004 / 400004)",
    resis: "500",
    cont: "4FB-2F-1B",
    tdate: "02/09/2021",
    drop: "0.0053 A DC",
    pick: "0.0104 A DC",
    work: "0.0104 A DC",
  },
  {
    sname: "ROW 1",
    rname: "TAM-3NBAR ",
    sno: "1717087",
    test: "C",
    rtype: "ST (400004 / 400004)",
    resis: "500",
    cont: "4FB-2F-1B",
    tdate: "02/09/2021",
    drop: "0.0053 A DC",
    pick: "0.0104 A DC",
    work: "0.0104 A DC",
  },
  {
    sname: "ROW 1",
    rname: "MDR",
    sno: "1717087",
    test: "C",
    rtype: "ST (400004 / 400004)",
    resis: "500",
    cont: "4FB-2F-1B",
    tdate: "02/09/2021",
    drop: "0.0053 A DC",
    pick: "0.0104 A DC",
    work: "0.0104 A DC",
  },
  {
    sname: "ROW 1",
    rname: "MDR",
    sno: "1717087",
    test: "C",
    rtype: "ST (400004 / 400004)",
    resis: "500",
    cont: "4FB-2F-1B",
    tdate: "02/09/2021",
    drop: "0.0053 A DC",
    pick: "0.0104 A DC",
    work: "0.0104 A DC",
  },
  {
    sname: "ROW 1",
    rname: "MDR",
    sno: "1717087",
    test: "C",
    rtype: "ST (400004 / 400004)",
    resis: "500",
    cont: "4FB-2F-1B",
    tdate: "02/09/2021",
    drop: "0.0053 A DC",
    pick: "0.0104 A DC",
    work: "0.0104 A DC",
  },
];
class RelayTestInspection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    this.calculateRelayData(this.props.relaysData);
  }
  componentDidUpdate(prevProps, prevState) {}

  calculateRelayData(relaysData) {
    let data = [];
    relaysData &&
      relaysData.map((relayData) => {
        let childForms = relayData.childForms ? relayData.childForms : [];
        if (childForms && childForms.length > 0) {
          let dataArray = getFieldsReportForm(childForms, "FRA234_263And236_106", "parentTestCode");
          if (dataArray) {
            data = [...data, ...dataArray];
          }
        }
      });
    this.setState({
      data: data,
    });
  }

  render() {
    let relayData =
      this.state.data &&
      this.state.data.map((data) => {
        return (
          <tbody>
            <tr>
              <td colSpan={3}>
                <strong>Shelf Name</strong>
                <br />
                <div>{data.sname}</div>
              </td>
              <td colSpan={3}>
                <strong>Relay Name</strong>
                <br />
                <div>{data.rname}</div>
              </td>
              <td colSpan={3}>
                <strong>Serial Number</strong>
                <br />
                <div>{data.sno}</div>
              </td>
              <td colSpan={3}>
                <strong>Condition Left</strong>
                <br />
                <div>{data.test}</div>
              </td>
            </tr>
            <tr>
              <td colSpan={6}>
                <strong>Relay Type (Drawing and/or Catalog Number)</strong>
                <br />
                <div>{data.rtype}</div>
              </td>
              <td colSpan={2}>
                <strong>Resistance (Ohms)</strong>
                <br />
                <div>{data.resis}</div>
              </td>
              <td colSpan={3}>
                <strong>Contacts </strong>
                <br />
                <div>{data.cont}</div>
              </td>
              <td colSpan={1}>
                <strong>Date Tested</strong>
                <br />
                <div>{data && data.tdate && moment(data.tdate).format("MM-DD-YYYY")}</div>
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <strong>Neutral Dropaway</strong>
                <br />
                <div>{data.drop}</div>
              </td>
              <td colSpan={2}>
                <strong>Neutral Pickup </strong>
                <br />
                <div>{data.pick}</div>
              </td>
              <td colSpan={2}>
                <strong>Neutral Working</strong>
                <br />
                <div>{data.work}</div>
              </td>
              <td colSpan={6}>
                <strong>Comments</strong>
                <br />
                <div>{data.com}</div>
              </td>
            </tr>
          </tbody>
        );
      });
    return (
      <React.Fragment>
        <div id="mainContent" className="table-report RelayTestInspection" style={{ minHeight: "800px", pageBreakAfter: "always" }}>
          <CrossingHeading
            selectedAssetId={this.props.selectedAssetId}
            testType="relay"
            mainTitle="Inspection Report - Relay Tests and Inspections"
            data={this.props.basicData}
          />
          <br />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th colSpan={12}>
                  <h2>Relay Tests (FRA 234.263, 236.106)</h2>
                </th>
              </tr>
            </thead>
            {relayData}
            {addEmptyColsIfNotEnough(relayData, 11)}
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default RelayTestInspection;
function addEmptyColsIfNotEnough(mapArray, minRows) {
  let emptyRows = null;
  let grpRows = [];
  let countToAdd = minRows - mapArray.length;
  let typeToAdd = ["one", "two", "three"];
  if (countToAdd > 0) {
    emptyRows = [];
    let count = 0;
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr key={`tr-${i}`}>{getCols(typeToAdd[count])}</tr>;
      grpRows.push(row);
      if (count < 2) {
        count++;
      } else {
        emptyRows.push(<tbody  key={`tbody-${count}${i}`}>{grpRows}</tbody>);
        count = 0;
        grpRows = [];
      }
    }
  }
  return emptyRows;
}
function getCols(type) {
  let cols = [];
  let span = [];
  if (type == "one") span = [3, 3, 3, 3];
  else if (type == "two") span = [6, 2, 3, 1];
  else span = [2, 2, 2, 6];
  for (let i = 0; i < span.length; i++) {
    cols.push(<td colSpan={span[i]} key={`td-${i}`}></td>);
  }
  return cols;
}
