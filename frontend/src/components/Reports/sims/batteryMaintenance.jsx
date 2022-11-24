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

class BatteryMaintenance extends Component {
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
  checkResponse(data) {
    return data.yes === "true" || data.yes === null || data.yes === true ? "Oui" : "Non";
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
    let assetsData = this.state.assetsData;
    assetsData.sort(function (a, b) {
      const a1 = new Date(a.date).getTime();
      const b1 = new Date(b.date).getTime();
      if (a1 < b1) return 1;
      else if (a1 > b1) return -1;
      else return 0;
    });
    let dateInstallation = assetsData && assetsData.length > 0 ? moment(assetsData[0].dateInstallation).format("MM-DD-YYYY") : "";
    let rowData =
      assetsData &&
      assetsData.map((data, index) => {
        let dateTech = data.date ? moment(data.date).format("ddd, MMM D, YYYY hh:mm A") : "";
        dateTech = data.name ? dateTech + " / " + data.name : dateTech;
        return (
          <tr key={index}>
            <td>{dateTech} </td>
            <td>{data.pre}</td>
            <td>{data.sour}</td>
            <td>{this.checkResponse(data)}</td>
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
                {/* {this.props.reportName}
                <br />
                {this.props.selectedAsset}*/}
                FICHE MAINTENANCE ACCUMULATEURS BATTERIES SAFT SPL
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
                <th rowSpan="3" colSpan="4" style={{ width: "100px" }}>
                  <span>{languageService("GI-303 Recherche de defaut à la terre")}</span>
                </th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th rowSpan="2" style={{ width: "25px" }}>
                  <span>{languageService("Nom du technicien et Date")}</span>
                </th>
                <th rowSpan="2" style={{ width: "30px" }}>
                  <span>{languageService("Présence d’un défaut à la terre? Oui/Non")}</span>
                </th>
                <th rowSpan="2" style={{ width: "40px" }}>
                  <span>{languageService("Source de la faute à la terre")}</span>
                </th>
                <th rowSpan="2" style={{ width: "5px" }}>
                  <span>{languageService("Inspecté")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData}

              {addEmptyColsIfNotEnough(rowData, this.config.minRows, 4)}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default BatteryMaintenance;
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
