import React, { Component } from "react";
import { switchReportStyle } from "./style/index";
import { themeService } from "../../../theme/service/activeTheme.service";
import { getLanguageLocal, languageService } from "Language/language.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { Rect } from "react-konva";
import moment from "moment";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../variables";
import { getFieldsReport } from "./appFormReportsUtility";

class DefaultReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicData: {},
      assetsData: [],
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
    if (reportData && reportData.length > 0) {
      assetsData = getFieldsReport(reportData);
    }
    this.setState({
      assetsData: assetsData,
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
        let dateTech = data.datetime ? moment(data.datetime).format("ddd, MMM D, YYYY hh:mm A") : "";
        dateTech = data.technician ? dateTech + " / " + data.technician : dateTech;
        return (
          <tr key={index}>
            <td>{dateTech} </td>
            <td>{this.checkResponse(data)}</td>
            <td>{data.comment}</td>
          </tr>
        );
      });

    return (
      <React.Fragment>
        <div id="mainContent" className="table-report" style={themeService(switchReportStyle.mainStyle)}>
          <Row>
            <Col md={2}>
              <img
                src={themeService(iconToShow)}
                alt="Logo"
                style={{ ...themeService(switchReportStyle.logoStyle), display: "flex", margin: "0 auto" }}
              />
            </Col>
            <Col md={8}>
              <h2 style={{ ...themeService(switchReportStyle.headingStyle), transform: "translateX(-21px)" }}>
                {this.props.reportName}
                <br />
                {this.props.selectedAsset}
              </h2>
            </Col>
            <Col md={2}>
              <span style={{ ...themeService(switchReportStyle.headingStyle), fontSize: "22px" }}>
                {" "}
                <img src={themeService(iconTwoShow)} alt="Logo" style={themeService(switchReportStyle.logoStyle)} />
              </span>
            </Col>
          </Row>
          <span className="spacer"></span>
          <table className="table-bordered switch-side-track">
            <thead>
              <tr>
                <th rowSpan="2" style={{ width: "10px" }}>
                  <span>{languageService("Date / Technicien")}</span>
                </th>
                <th rowSpan="2" style={{ width: "10px" }}>
                  <span>{languageService("Inspecté")}</span>
                </th>
                <th rowSpan="2" style={{ width: "80px" }}>
                  <span>{languageService("Commentaires")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData}

              {addEmptyColsIfNotEnough(rowData, this.config.minRows, 3)}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default DefaultReport;
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
function getCols(num) {
  let cols = [];
  for (let i = 0; i < num; i++) {
    cols.push(<td></td>);
  }
  return cols;
}
