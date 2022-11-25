import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import "./style.css";
import { languageService } from "Language/language.service";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../variables";
import moment from "moment";
import { getFieldsReport } from "./appFormReportsUtility";
class RelayTest extends Component {
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
    };

    let Data = this.state.assetsData.map((data) => {
      !assetData.milepost && data && data.testSched && (assetData.milepost = data.testSched.assetMP);
      !assetData.locationName && data && data.testSched && (assetData.locationName = data.testSched.lineName);
      let dateTech = data.date ? moment(data.date).format("ddd, MMM D, YYYY hh:mm A") : "";
      dateTech = data["tx-insp"] ? dateTech + " / " + data["tx-insp"] : dateTech;
      return (
        <tr>
          <td colSpan="2">{this.props.selectedAsset}</td>
          <td colSpan="2">{dateTech}</td>
          <td colSpan="1">{data.make}</td>
          <td colSpan="1">{data.type}</td>
          <td colSpan="2">{data.resist}</td>
          <td colSpan="1">{data.serial}</td>
          <td colSpan="1">{data.nor1}</td>
          <td colSpan="1">{data.rev1}</td>
          <td colSpan="1">{data.nor2}</td>
          <td colSpan="1">{data.rev2}</td>
          <td colSpan="1">{data.nor3}</td>
          <td colSpan="1">{data.rev3}</td>
          <td colSpan="1">{data.set}</td>
          <td colSpan="1">{data.actual}</td>
          <td colSpan="1">{data.resulttest}</td>
          <td colSpan="4">{data.remarks}</td>
        </tr>
      );
    });
    return (
      <React.Fragment>
        <div className="table-report logix-services relay-test" id="mainContent">
          <Row>
            <Col md={12}>
              <Row>
                <Col md={2}>
                  {" "}
                  <img src={themeService(iconToShow)} style={{ width: "200px" }} alt="Logo" />{" "}
                </Col>
                <Col md={8}>
                  <div className="title-area">
                    <h3 className="report-title">Relay Test</h3>

                    <h4 className="report-title">FRA Rules:  236.102    236.105   236.106</h4>
                  </div>
                </Col>
                <Col md={6}>
                  {/* <div className="report-parameters">
                    <label className="lbl-title">Railroad:</label>
                    <span className="parameters-values mini"></span>
                  </div> */}
                  <div className="report-parameters">
                    <label className="lbl-title">Location:</label>
                    <span className="parameters-values mini">{assetData.locationName}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="report-parameters">
                    <label className="lbl-title"> M.P.: </label>
                    <span className="parameters-values mini">{assetData.milepost}</span>
                  </div>
                  <div className="report-parameters">
                    <label className="lbl-title">DOT#:</label> <span className="parameters-values mini"></span>
                  </div>
                  <span className="spacer"></span>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <table>
                    <thead>
                      <tr>
                        <th colSpan="2" rowSpan="3">
                          Nomenclature or Signal Number
                        </th>
                        <th colSpan="2" rowSpan="3">
                          Date Tested
                        </th>

                        <th colSpan="1" rowSpan="3">
                          Make
                        </th>
                        <th colSpan="1" rowSpan="3">
                          Type
                        </th>
                        <th colSpan="2" rowSpan="3">
                          Resistance (Ohms)
                        </th>
                        <th colSpan="1" rowSpan="3">
                          Serial  Number
                        </th>

                        <th colSpan="2">Pick‐up</th>
                        <th colSpan="2">Drop‐away</th>
                        <th colSpan="2">Working</th>
                        <th colSpan="2" rowSpan="2">
                          Timing/Flash Rate
                        </th>
                        <th colSpan="1" rowSpan="3">
                          Results of Test
                        </th>
                        <th colSpan="4" rowSpan="3">
                          Remarks
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="1" rowSpan="1">
                          Normal
                        </th>
                        <th colSpan="1" rowSpan="1">
                          Reverse
                        </th>
                        <th colSpan="1" rowSpan="1">
                          Normal
                        </th>
                        <th colSpan="1" rowSpan="1">
                          Reverse
                        </th>
                        <th colSpan="1" rowSpan="1">
                          Normal
                        </th>
                        <th colSpan="1" rowSpan="1">
                          Reverse
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="1" rowSpan="1">
                          (R‐G)
                        </th>
                        <th colSpan="1" rowSpan="1">
                          (R‐Y)
                        </th>
                        <th colSpan="1" rowSpan="1">
                          (G‐R)
                        </th>
                        <th colSpan="1" rowSpan="1">
                          (Y‐R)
                        </th>
                        <th colSpan="1" rowSpan="1">
                          (R‐G)
                        </th>
                        <th colSpan="1" rowSpan="1">
                          (R‐Y)
                        </th>
                        <th colSpan="1" rowSpan="1">
                          Set
                        </th>
                        <th colSpan="1" rowSpan="1">
                          Actual
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Data}
                      {addEmptyColsIfNotEnough(Data, this.config.minRows)}
                    </tbody>
                  </table>
                </Col>
                <Col md="7">
                  <p>
                    <strong>Results of tests:</strong>
                    <span className="spacer"></span>
                    <div>OK‐‐Test complete equipment in satisfactory condition</div>
                    <div>A/C‐‐Adjustments made / Test complete ‐ equipment in satisfactory condition </div>
                    <div>R/C‐‐Repair or replacement / Test complete ‐ equipment in satisfactory condition</div>
                    <div>If results are "A/C" or "R/C" explain the procedure in the remarks column</div>
                  </p>
                </Col>
                <Col md="5">
                  {" "}
                  <div className="report-parameters">
                    <label className="lbl-title">Tested By:</label>
                    <span className="parameters-values small"></span>
                  </div>
                  <div className="report-parameters">
                    <label className="lbl-title">Title:</label>
                    <span className="parameters-values small"></span>
                  </div>
                  <div className="report-parameters">
                    <label className="lbl-title">Signature:</label>
                    <span className="parameters-values small"></span>
                  </div>{" "}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
export default RelayTest;
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

  span = [2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4];
  for (let i = 0; i < 16; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
