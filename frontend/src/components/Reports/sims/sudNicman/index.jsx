import React from "react";
import { switchReportStyle } from "./style/index";
import { themeService } from "theme/service/activeTheme.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import moment from "moment";
import { getLanguageLocal, languageService } from "Language/language.service";
import { getFieldsReport } from "../appFormReportsUtility";
import { iconToShow, iconTwoShow } from "../../variables";
class SudNicmanReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetsData: [],
    };
    this.config = {
      minRows: 18,
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
    let rowData =
      assetsData &&
      assetsData.map((data, index) => {
        let dateTech = data.datetime ? moment(data.datetime).format("ddd, MMM D, YYYY hh:mm A") : "";
        //dateTech = data.technician ? dateTech + " / " + data.technician : dateTech;
        dateTech = data.technician ? dateTech : "";
        return (
          <tr key={index}>
            <td colSpan={2}>{dateTech}</td>
            <td colSpan={1}>{data.vpmarginfirst}</td>
            <td colSpan={2}>{data.vplongueurfirst}</td>
            <td colSpan={1}>{data.vpmarginsecond}</td>
            <td colSpan={2}>{data.vplongueursecond}</td>
            <td colSpan={1}>{data.vdmarginfirst}</td>
            <td colSpan={2}>{data.vdlongueurfirst}</td>
            <td colSpan={1}>{data.vdmarginsecond}</td>
            <td colSpan={2}>{data.vdlongueursecond}</td>
            <td colSpan={3}>{data.comments}</td>
            <td colSpan={2}>{data.technician}</td>
            <td colSpan={1}> {this.checkResponse(data)}</td>
          </tr>
        );
      });
    return (
      <React.Fragment>
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: "@media print { @page {size: auto !important} }",
          }}
          //@page{size: auto; margin: 0mm;}
          //@page{size: A3 landscape; margin: 0mm;}
        />
        <div id="mainContent" className="table-report sud-nicman-report" style={themeService(switchReportStyle.mainStyle)}>
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
                {languageService("Suivi margins-GI335")}
              </h2>
            </Col>
            <Col md={2}>
              <span style={{ ...themeService(switchReportStyle.headingStyle), fontSize: "22px" }}>
                {" "}
                <img src={themeService(iconTwoShow)} alt="Logo" style={themeService(switchReportStyle.logoStyle)} />
              </span>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <table className="table-bordered">
                <thead>
                  <tr>
                    <th colSpan={20}>
                      <h4>
                        <strong>{this.props.selectedAsset}</strong>
                      </h4>
                    </th>
                  </tr>
                  <tr className="blank-row">
                    <th colSpan={20}>&nbsp;</th>
                  </tr>
                  <tr>
                    <th colSpan={2}></th>
                    <th colSpan={6}>Voie principale</th>
                    <th colSpan={6}>Voie d'évitement</th>
                    <th colSpan={6}></th>
                  </tr>
                  <tr>
                    <th colSpan={2}>{languageService("Date")}</th>
                    <th colSpan={1}>{languageService("Margin First Half")}</th>
                    <th colSpan={2}>{languageService("Longueur de voie First Half")}</th>
                    <th colSpan={1}>{languageService("Margin Second Half")}</th>
                    <th colSpan={2}>{languageService("Longueur de voie Second Half")}</th>
                    <th colSpan={1}>{languageService("Margin First Half")}</th>
                    <th colSpan={2}>{languageService("Longueur de voie First Half")}</th>
                    <th colSpan={1}>{languageService("Margin Second Half")}</th>
                    <th colSpan={2}>{languageService("Longueur de voie Second Half")}</th>
                    <th colSpan={3}>{languageService("Commentaires")}</th>
                    <th colSpan={2}>{languageService("Vérifié par")}</th>
                    <th colSpan={1}>{languageService("Inspecté")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData}
                  {addEmptyColsIfNotEnough(rowData, this.config.minRows, 12)}
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default SudNicmanReport;

function addEmptyColsIfNotEnough(mapArray, minRows, cols) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;
  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = [];
      row = <tr>{getCols(cols)}</tr>;

      emptyRows.push(row);
    }
  }
  return emptyRows;
}
function getCols(num) {
  let cols = [];
  let span = ["2", "1", "2", "1", "2", "1", "2", "1", "2", "3", "2", "1"];
  for (let i = 0; i < num; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
