import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import "../style.css";
import _ from "lodash";
import { getFieldsReport } from "../appFormReportsUtility";
import moment from "moment";
import { combineFRATests } from "./highwayCrossingUtils";
import { LocPrefixService } from "../../../LocationPrefixEditor/LocationPrefixService";
class HighWayCrossing extends Component {
  constructor(props) {
    super(props);
    this.state = { assetsData: [] };
    this.config = {
      minRows: 17,
    };
    this.content = {
      headers: {},
    };
  }
  componentDidMount() {
    this.calculateData(this.props.reportData);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.reportData !== prevProps.reportData && this.props.reportData) {
      this.calculateData(this.props.reportData);
    }
  }

  calculateData(reportData) {
    let assetsData = [];
    if (reportData && reportData.length > 0) {
      assetsData = getFieldsReport(reportData);
    }
    this.setState({
      assetsData: assetsData,
    });
  }

  render() {
    let assetData = {
      milepost: "",
      locationName: "",
      prefix: "",
    };
    let intervals = {
      Y: false,
      M: false,
      Q: false,
    };
    let Data = this.state.assetsData.map((data) => {
      !assetData.milepost && data && data.testSched && (assetData.milepost = data.testSched.assetMP);
      !assetData.locationName && data && data.testSched && (assetData.locationName = data.testSched.lineName);
      !assetData.prefix &&
        data &&
        data.testSched &&
        (assetData.prefix = LocPrefixService.getPrefixMp(assetData.milepost, assetData.lienId));
      let dateTech = data["tx-date"] ? moment(data["tx-date"]).format("ddd, MMM D, YYYY hh:mm A") : "";
      dateTech = data["tx-insp"] ? dateTech + " / " + data["tx-insp"] : dateTech;
      let fraRule = data.testSched && fetchField(data.testSched.testCode, "rule");
      let interval = data.testSched && fetchField(data.testSched.testCode, "interval");
      let device = data.testSched && fetchField(data.testSched.testCode, "device");
      interval && intervals[interval] == false && (intervals[interval] = true);
      return (
        <tr>
          <td colSpan="2">{dateTech}</td>
          <td colSpan="1">{fraRule}</td>
          <td colSpan="1">{interval}</td>
          <td colSpan="4">{device}</td>
          <td colSpan="1">{data["tx-result"]}</td>
          <td colSpan="4">{data["tx-remark"]}</td>
        </tr>
      );
    });
    return (
      <React.Fragment>
        <div className="table-report logix-services highway-crossing" id="mainContent">
          <Row>
            <Col md={12}>
              <Row>
                {/* <Col md={2}>{/* <img src={themeService(iconToShow)} alt="Logo" /> </Col> */}
                <Col md={12}>
                  <div className="title-area">
                    <h3 className="report-title">Highway Crossing Maintenance, Inspection and Test</h3>

                    <h4 className="report-title">FRA Rule 234.XXX</h4>
                  </div>
                </Col>
                <Col md={6}>
                  {/* <div className="report-parameters">
                    <label className="lbl-title">Railroad:</label>
                    <span className="parameters-values small"></span>
                  </div>
                  <div className="report-parameters">
                    <label className="lbl-title">Subdivision:</label>
                    <span className="parameters-values small"></span>
                  </div> */}
                  <div className="report-parameters">
                    <label className="lbl-title">M.P.:</label>
                    <span className="parameters-values small">
                      {assetData.prefix ? assetData.prefix : ""}
                      {assetData.milepost}
                    </span>
                  </div>
                  <div className="report-parameters">
                    <label className="lbl-title">Location:</label>
                    <span className="parameters-values small">{assetData.locationName}</span>
                  </div>
                  {/* <div className="report-parameters">
                    <label className="lbl-title">City / State:</label>
                    <span className="parameters-values small"></span>
                  </div>
                  <div className="report-parameters">
                    <label className="lbl-title"> Street:</label>
                    <span className="parameters-values small"></span>
                  </div> */}
                  <div className="report-parameters">
                    <label className="lbl-title">DOT#:</label> <span className="parameters-values small"></span>
                  </div>
                  {/* <span className="spacer"></span> */}
                </Col>
                <Col md={6}>
                  {/* <span className="spacer"></span> */}
                  <div className="report-parameters">
                    <label className="lbl-title ml-5">Monthly:</label>
                    <span className="parameters-values micro">{intervals.M ? "Yes" : ""}</span>
                  </div>
                  <div className="report-parameters">
                    <label className="lbl-title ml-5">Quarterly:</label>
                    <span className="parameters-values micro">{intervals.Q ? "Yes" : ""}</span>
                  </div>

                  <div className="report-parameters">
                    <label className="lbl-title ml-5">Yearly:</label>
                    <span className="parameters-values micro">{intervals.Y ? "Yes" : ""}</span>
                  </div>
                  <span className="spacer"></span>
                  <div className="report-parameters">
                    <label className="lbl-title">Name:</label>
                    <span className="parameters-values small"></span>
                  </div>
                </Col>

                {/* <Col md={2} style={{ textAlign: "right" }}>
                   <img src={themeService(iconTwoShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
                </Col> */}
              </Row>
              <Row>
                <Col md={12}>
                  <table>
                    <thead>
                      <tr>
                        <th colSpan="2">Date</th>
                        <th colSpan="1">FRA Rule</th>
                        <th colSpan="1">Interval</th>
                        <th colSpan="4">Device inspected or tested</th>
                        <th colSpan="1">Results </th>
                        <th colSpan="4">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Data}
                      {addEmptyColsIfNotEnough(Data, this.config.minRows)}
                    </tbody>
                  </table>
                </Col>
                <Col md="12">
                  <p>
                    <span className="spacer"></span>
                    Results of tests:
                    <span className="spacer"></span>
                    <div>OK‐‐Test complete equipment in satisfactory condintion.</div>
                    <div>A/C‐‐Adjustments made/test complete‐equipment in satisfactory condition</div>
                    <div>R/C‐‐Repair or replacement /test complete‐ equipment in satisfactory condition.</div>
                    <div>If results are "A/C" or "R/C" explain the procedure in the remarks column.</div>
                  </p>
                </Col>
                <Col md="6">
                  {" "}
                  <div className="report-parameters">
                    <label className="lbl-title">Signature:</label>
                    <span className="parameters-values"></span>
                  </div>
                </Col>
                <Col md="5">
                  {" "}
                  <div className="report-parameters">
                    <label className="lbl-title"> Date:</label>
                    <span className="parameters-values small"></span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
export default HighWayCrossing;

function fetchField(testCode, field) {
  let found = _.find(combineFRATests, { code: testCode });
  if (found) return found[field];
  else return "";
}
function addEmptyColsIfNotEnough(mapArray, minRows) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;
  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr>{getCols()}</tr>;
      emptyRows.push(row);
    }
  }
  return emptyRows;
}
function getCols() {
  let cols = [];
  let span = [];

  span = [2, 1, 1, 4, 1, 4];
  for (let i = 0; i < 6; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
