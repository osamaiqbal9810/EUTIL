import React, { Component } from "react";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import _ from "lodash";
import moment from "moment";
import { iconToShow, iconTwoShow } from "../../variables";
import { getFieldsReport } from "../appFormReportsUtility";
import { LocPrefixService } from "../../../LocationPrefixEditor/LocationPrefixService";

class FRADefaultReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicData: {},
      assetsData: [],
      rptTitle: "",
      assetName: "",
      milepost: "",
      userName: "",
      subDivision: "",
    };
    this.config = {
      minRows: 10,
    };
    this.checkResponse = this.checkResponse.bind(this);
  }
  componentDidMount() {
    this.calculateData(this.props.reportData);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.reportData !== prevProps.reportData && this.props.reportData) {
      this.calculateData(this.props.reportData);
    }
  }
  checkResponse(data) {
    return data.yes === "true" || data.yes === null || data.yes === true ? "Oui" : "Non";
  }
  calculateData(reportData) {
    let assetsData = [];
    let rptTitle = "";
    let assetName = "";
    let milepost = "";
    let userName = "";
    let subDivision = "";
    if (reportData && reportData.length > 0) {
      assetsData = getFieldsReport(reportData);
      rptTitle = this.props.reportData[0].title;
      assetName = this.props.reportData[0].assetType + " : " + this.props.reportData[0].assetName;
      milepost =
        LocPrefixService.getPrefixMp(this.props.reportData[0].assetStart, this.props.reportData[0].lineId) +
        " " +
        this.props.reportData[0].assetStart;
      userName = this.props.reportData[0].user.name;
      subDivision = this.props.reportData[0].lineName;
    }
    this.setState({
      assetsData: assetsData,
      rptTitle,
      assetName,
      milepost,
      userName,
      subDivision,
    });
  }
  render() {
    let assetsData = this.state.assetsData;
    assetsData.sort(function (a, b) {
      const a1 = new Date(a.datetime).getTime();
      const b1 = new Date(b.datetime).getTime();
      if (a1 < b1) return 1;
      else if (a1 > b1) return -1;
      else return 0;
    });
    let dateInstallation = assetsData && assetsData.length > 0 ? moment(assetsData[0].dateInstallation).format("MM-DD-YYYY") : "";
    let rowData =
      assetsData &&
      assetsData.map((data, index) => {
        let dateTech = this.props.reportData[0].date ? moment(data.datetime).format("ddd, MMM D, YYYY hh:mm A") : "";
        //dateTech = data.technician ? dateTech + " / " + data.technician : dateTech;
        return (
          <tr key={index}>
            <td colSpan={1}>
              <span>{dateTech}</span>
            </td>
            <td colSpan={1}>
              <span>{this.state.userName}</span>
            </td>
            <td colSpan={1}>
              <span>{data.test}</span>
            </td>
            <td colSpan={4}>
              <span>{data.com}</span>
            </td>
          </tr>
        );
      });

    return (
      <React.Fragment>
        <div id="mainContent" className="table-report default">
          <Row>
            <Col md={2}>
              <img src={themeService(iconToShow)} alt="Logo" style={{ width: "100%" }} />
            </Col>
            <Col md={8}>
              <h2 style={{ fontWeight: "900", textAlign: "center" }}>
                {this.state.rptTitle}
                <br />
              </h2>
            </Col>
            <Col md={2}>
              <img src={themeService(iconTwoShow)} alt="Logo" />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className="border border-dark heading">
                <Row>
                  <Col md={6}>
                    <div className="heading-info">
                      <strong>Subdivision:</strong>
                      <span>{this.state.subDivision}</span>
                    </div>
                    <div className="heading-info">
                      <strong>Milepost:</strong>
                      <span>{this.state.milepost}</span>
                    </div>
                    {/* <div className="heading-info">
                      <strong>Location / Highway Name:</strong>
                      <span>{this.props.data && this.props.data.assetUnitId}</span>
                    </div> */}
                    {/* <div className="heading-info">
                    <strong>County:</strong>
                    <span>{this.props.data && this.props.data.county}</span>
                  </div> */}
                    {/* <div className="heading-info">
                      <strong>Employee’s Name:</strong>
                      <span>{this.props.data && this.props.data.userName}</span>
                    </div> */}
                  </Col>
                  <Col md={6}>
                    <div className="heading-info">
                      <strong>Asset Name: </strong>
                      <span>{this.state.assetName}</span>
                    </div>
                    {/* <div className="heading-info">
                      <strong>Test Date:</strong>
                      <span>{this.props.data && this.props.data.date}</span>
                    </div> */}
                    {/* <div className="heading-info">
                    <strong>State:</strong>
                    <span></span>
                  </div> */}
                    <span className="spacer"></span>
                    <span className="spacer"></span>
                    {/* <div className="heading-info">
                    <strong>Position Number:</strong>
                    <span></span>
                  </div> */}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className="info-heading">
                <strong>Conditions Master Key</strong>
              </div>
              <div className="info-section">
                <React.Fragment>
                  <br />C = Tests completed on all applicable components, no exceptions found, and condition left in compliance.
                </React.Fragment>

                <React.Fragment>
                  <br /> A = Adjustments made (identified in associated comments), test completed, and condition left in compliance.
                </React.Fragment>

                <React.Fragment>
                  <br />R = Repairs and/or Replacements made (identified in associated comments), test completed, and condition left in
                  compliance.
                </React.Fragment>

                <React.Fragment>
                  <br />G = Governed by Special Instruction
                </React.Fragment>
                <React.Fragment>
                  <br />
                  NT = The equipment was not tested in this inspection.
                  <br />
                </React.Fragment>

                <React.Fragment>N = Test Not Applicable.</React.Fragment>
                <br />
              </div>
            </Col>
          </Row>
          <span className="spacer"></span>
          <table className="table-bordered switch-side-track">
            <thead>
              <tr>
                <th colSpan={1}>
                  <span>Date</span>
                </th>
                <th colSpan={1}>
                  <span>Tested By</span>
                </th>
                <th colSpan={1}>
                  <span>Condition</span>
                </th>
                <th colSpan={4}>
                  <span>Comments</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData}

              {addEmptyColsIfNotEnough(rowData, this.config.minRows, 5)}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default FRADefaultReport;
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

  span = [1, 1, 1, 4];
  for (let i = 0; i < span.length; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
