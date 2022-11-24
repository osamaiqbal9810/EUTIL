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

class MaintenanceReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicData: {},
      assetsData: [],
    };
    this.config = {
      minRows: 7,
      minCommentsRow: 7,
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
      const a1 = new Date(a.datetime).getTime();
      const b1 = new Date(b.datetime).getTime();
      if (a1 < b1) return 1;
      else if (a1 > b1) return -1;
      else return 0;
    });
    let dateInstallation =
      assetsData && assetsData.length > 0 && assetsData[0].dateinstallation !== undefined
        ? moment(assetsData[0].dateinstallation).format("MM-DD-YYYY")
        : "";
    let rowData =
      assetsData &&
      assetsData.map((data, index) => {
        let dateTech = data.datetime ? moment(data.datetime).format("ddd, MMM D, YYYY hh:mm A") : "";
        dateTech = data.technician ? dateTech + " / " + data.technician : dateTech;
        return (
          <tr key={index}>
            <td colSpan="4">{dateTech} </td>
            <td colSpan="2">{data.vaccharge}</td>
            <td colSpan="2">{data.idcccharge}</td>
            <td colSpan="2">{data.aveccharge}</td>
            <td colSpan="2">{data.sanscharge}</td>
            <td colSpan="1">{data.tension1}</td>
            <td colSpan="1">{data.tension2}</td>
            <td colSpan="1">{data.tension3}</td>
            <td colSpan="1">{data.tension4}</td>
            <td colSpan="1">{data.tension5}</td>
            <td colSpan="1">{data.tension6}</td>
            <td colSpan="1">{data.tension7}</td>
            <td colSpan="1">{data.tension8}</td>
            <td colSpan="1">{data.tension9}</td>
            <td colSpan="1">{data.tension10}</td>
            <td colSpan="2">{this.checkResponse(data)}</td>
          </tr>
        );
      });
    let commentsData =
      assetsData &&
      assetsData.map((data, index) => {
        let dateTech = data.datetime ? moment(data.datetime).format("ddd, MMM D, YYYY hh:mm A") : "";
        dateTech = data.technician ? dateTech + " / " + data.technician : dateTech;
        return (
          <tr key={index}>
            <td colSpan="4">{dateTech}</td>
            <td colSpan="20">{data.comments}</td>
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
                {languageService("FICHE MAINTENANCE ACCUMULATEURS MICROLOK II-2008")}
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
          <Row>
            <Col md={12}>
              <table className="table-bordered switch-side-track" style={{ marginBottom: "0" }}>
                <thead>
                  <tr className="main-heading">
                    <th colSpan="3" style={{ width: "5vw", borderBottom: "transparent", textAlign: "left" }}>
                      <h4>{languageService("Type: SPL 165/10 éléments")}</h4>
                    </th>
                    <th colSpan="3" style={{ width: "4.8vw", borderBottom: "transparent", textAlign: "left" }}>
                      <h4>{languageService("Date d'installation") + ": " + dateInstallation}</h4>
                    </th>
                    <th colSpan="3" style={{ width: "4.8vw", borderBottom: "transparent", textAlign: "left" }}>
                      <h4 style={{ textAlign: "center" }}>B 12</h4>
                    </th>
                    <th colSpan="3" style={{ width: "3.8vw", borderBottom: "transparent", textAlign: "left" }}></th>
                  </tr>
                </thead>
              </table>
            </Col>
          </Row>
          <table className="table-bordered switch-side-track">
            <thead>
              <tr>
                <th rowSpan="2" colSpan="4" style={{ width: "15px" }}>
                  <span>{languageService("Date/Technicien")}</span>
                </th>
                <th rowSpan="2" colSpan="2" style={{ width: "6px" }}>
                  <span>
                    <h4>
                      <strong style={{ fontSize: "30px" }}>V</strong>AC
                    </h4>{" "}
                    <div>{languageService("Chargeur")}</div>
                  </span>
                </th>
                <th rowSpan="2" colSpan="2" style={{ width: "6px" }}>
                  <span>
                    <h4>
                      <strong style={{ fontSize: "30px" }}>I</strong>DC
                    </h4>{" "}
                    <div>{languageService("Chargeur")}</div>
                  </span>
                </th>
                <th colSpan="4" style={{ width: "15px" }}>
                  <span>
                    <h4 style={{ display: "inline-block" }}>
                      <strong style={{ fontSize: "30px" }}>V</strong>DC
                    </h4>{" "}
                    <div style={{ display: "inline-block" }}>{languageService("Batteries")}</div>
                  </span>
                </th>
                {/* <th rowSpan="2" colSpan="4" style={{ width: "6px" }}>
                  <span>{languageService("Loss to earth (rule 303)")}</span>
                </th> */}
                <th colSpan="10" style={{ width: "35px" }}>
                  <span>{languageService("Tension par élément (Sans chargeur)")}</span>
                </th>
                <th rowSpan="2" colSpan="2" style={{ width: "3px" }}>
                  <span>{languageService("Inspecté")}</span>
                </th>
              </tr>
              <tr>
                <th colSpan="2" style={{ width: "10px" }}>
                  <span>
                    {languageService("Avec")}
                    <div>{languageService("Chargeur")}</div>
                  </span>
                </th>
                <th colSpan="2" style={{ width: "10px" }}>
                  <span>
                    {languageService("Sans")}
                    <div>{languageService("charger")}</div>
                  </span>
                </th>

                <th colSpan="1" style={{ width: "1px" }}>
                  <div>1</div>
                  {/* <small>11</small> */}
                </th>
                <th colSpan="1" style={{ width: "1px" }}>
                  <div>2</div>
                </th>
                <th colSpan="1" style={{ width: "1px" }}>
                  <div>3</div>
                </th>
                <th colSpan="1" style={{ width: "1px" }}>
                  <div>4</div>
                </th>
                <th colSpan="1" style={{ width: "1px" }}>
                  <div>5</div>
                </th>
                <th colSpan="1" style={{ width: "1px" }}>
                  <div>6</div>
                </th>
                <th colSpan="1" style={{ width: "1px" }}>
                  <div>7</div>
                </th>
                <th colSpan="1" style={{ width: "1px" }}>
                  <div>8</div>
                </th>
                <th colSpan="1" style={{ width: "1px" }}>
                  <div>9</div>
                </th>
                <th colSpan="1" style={{ width: "1px" }}>
                  <div>10</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData}
              {addEmptyColsIfNotEnough(rowData, this.config.minRows, 16, "one")}
            </tbody>
            <thead>
              <tr>
                <th colSpan="4"></th>
                <th colSpan="20">
                  <h5>
                    <strong>{languageService("Commentaires (ajout de l’eau distillée, etc.)")}</strong>
                  </h5>
                </th>
              </tr>
            </thead>
            <tbody>
              {commentsData}
              {addEmptyColsIfNotEnough(assetsData, this.config.minCommentsRow, 2, "two")}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default MaintenanceReport;
function addEmptyColsIfNotEnough(mapArray, minRows, cols, type) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;
  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr>{getCols(cols, type)}</tr>;
      emptyRows.push(row);
    }
  }
  return emptyRows;
}
function getCols(num, type) {
  let cols = [];
  let span = [];
  if (type === "two") span = [4, 20];
  else span = [4, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2];
  for (let i = 0; i < num; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
