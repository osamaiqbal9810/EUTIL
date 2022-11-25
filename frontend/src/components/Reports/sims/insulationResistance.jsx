import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import "./style.css";
import { languageService } from "Language/language.service";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../variables";
import { getFieldsReport } from "./appFormReportsUtility";
import moment from "moment";
class InsulationResistance extends Component {
  constructor(props) {
    super(props);
    this.state = { assetsData: [] };
    this.config = {
      minRows: 16,
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
      let dateTech = data["tx-date"] ? moment(data["tx-date"]).format("ddd, MMM D, YYYY hh:mm A") : "";
      dateTech = data["tx-insp"] ? dateTech + " / " + data["tx-insp"] : dateTech;
      return (
        <tr>
          <td colSpan="2">{dateTech}</td>
          <td colSpan="3">{data["tx-cable"]}</td>
          <td colSpan="3">{data["tx-ground"]}</td>
          <td colSpan="3">{data["tx-conduct"]}</td>
          <td colSpan="1">{data["tx-result"]}</td>
          <td colSpan="5">{data["tx-remark"]}</td>
        </tr>
      );
    });
    return (
      <React.Fragment>
        <div className="table-report logix-services" id="mainContent">
          <Row>
            <Col md={12}>
              <Row>
                <Col md={2}>
                  {" "}
                  <img src={themeService(iconToShow)} style={{ width: "200px" }} alt="Logo" />{" "}
                </Col>
                <Col md={8}>
                  <div className="title-area">
                    <h3 className="report-title">Insulation Resistance Test</h3>

                    <h4 className="report-title">FRA Rule 234.267       236.108</h4>
                  </div>
                </Col>
                <Col md={6}>
                  {/* <div className="report-parameters">
                    <label className="lbl-title">Railroad:</label>
                    <span className="parameters-values"></span>
                  </div> */}
                  {/* <div className="report-parameters">
                    <label className="lbl-title">Subdivision:</label>
                    <span className="parameters-values"></span>
                  </div> */}
                  <div className="report-parameters">
                    <label className="lbl-title"> M.P.:</label>
                    <span className="parameters-values">{assetData.milepost}</span>
                  </div>
                  {/* <div className="report-parameters">
                    <label className="lbl-title">Street:</label>
                    <span className="parameters-values"></span>
                  </div> */}
                  <div className="report-parameters">
                    <label className="lbl-title">DOT#:</label> <span className="parameters-values"></span>
                  </div>
                  <span className="spacer"></span>
                </Col>
                <Col md={6}>
                  <div className="report-parameters">
                    <label className="lbl-title">Location: </label>
                    <span className="parameters-values"> {assetData.locationName}</span>
                  </div>
                  {/* <div className="report-parameters">
                    <label className="lbl-title">Territory:</label> <span className="parameters-values small"></span>
                  </div> */}
                  {/* <span className="spacer"></span>
                  <span className="spacer"></span> */}
                  <span className="spacer"></span>
                  <div className="report-parameters">
                    <label className="lbl-title">Tested By:</label>
                    <span className="parameters-values"></span>
                  </div>
                  <div className="report-parameters">
                    <label className="lbl-title">Title:</label> <span className="parameters-values"></span>
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
                        <th colSpan="2" rowSpan="4">
                          Date Tested
                        </th>
                        <th colSpan="3" rowSpan="4">
                          Cable / Conductor  Nomenclature
                        </th>

                        <th colSpan="6">Circuits less than 500k Ohms</th>
                        <th colSpan="1" rowSpan="4">
                          Results of Test {" "}
                        </th>
                        <th colSpan="5" rowSpan="4">
                          Remarks
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="3" rowSpan="3">
                          Insulation Resistance  to Ground (Ohms)
                        </th>
                        <th colSpan="3" rowSpan="3">
                          Insulation Resistance between Conductors(Ohms)
                        </th>
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
                    <h5>Note: If conductor is below 200K Ohms, it must be removed from service.</h5>
                    <span className="spacer"></span>
                    <strong>Results of tests:</strong>
                    <span className="spacer"></span>
                    <div>OK‐‐Test complete equipment in satisfactory condition</div>
                    <div>R/C‐‐Repair or replacement </div>
                    <div>Test complete ‐ equipment in satisfactory condition</div>
                    <div>If results are "R/C" explain the procedure in the remarks column</div>
                  </p>
                  <span className="spacer"></span>
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
                    <label className="lbl-title">Date:</label>
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
export default InsulationResistance;
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

  span = [2, 3, 3, 3, 1, 5];
  for (let i = 0; i < 6; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
