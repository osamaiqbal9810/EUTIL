import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";

import { themeService } from "../../../../theme/service/activeTheme.service";

import { trackReportStyle } from "../style/index";
import "../style/style.css";
import { ruble } from "react-icons-kit/fa/ruble";
import { languageService } from "Language/language.service";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import moment from "moment";
import { iconToShow, iconTwoShow } from "../../variables";

class TrackReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.config = {
      minAssetRows: 4,
      minIssueRows: 8,
    };
  }
  render() {
    let issuesData = this.props.issuesData.map((issue, index) => {
      return (
        <tr key={issue.timpeStamp}>
          <td>{issue.MP}</td>
          <td>{issue.Deficiency && <SvgIcon icon={checkmark} />}</td>
          <td>{issue.FRADefect && <SvgIcon icon={checkmark} />}</td>
          <td>{issue.Code}</td>
          <td>{issue.DefectDescription}</td>
          <td>{issue.RemedialAction}</td>
          <td>{issue.Needed && <SvgIcon icon={checkmark} />}</td>
          <td>{issue.comments}</td>
        </tr>
      );
    });

    let assetsData = this.props.assetsData.map((asset, index) => {
      return (
        <tr key={asset.unitId}>
          <td>
            {asset.attributes.primaryTrack && (
              <div style={{ width: "20px", marginRight: "10px", display: "inline-block", color: "rgb(58, 179, 74)" }}>
                <SvgIcon icon={ruble} />
              </div>
            )}

            {<div style={{ display: "inline-block", width: "80%", verticalAlign: "middle" }}>{asset.unitId}</div>}
          </td>
          <td>{asset.start}</td>
          <td>{asset.end}</td>
          <td>{asset.HighRail}</td>
          <td>{asset.Walk}</td>
          <td>{asset.Observe}</td>
        </tr>
      );
    });
    return (
      <React.Fragment>
        <div className="table-report" style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={2}>
                  <img src={themeService(iconToShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
                </Col>
                <Col md={8}>
                  <h2 style={themeService(trackReportStyle.headingStyle)}>{languageService("Track Inspection and Repair Report")}</h2>
                </Col>
                <Col md={2}>
                  <img src={themeService(iconTwoShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
                </Col>

                <Col md={12}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: "20px" }}></th>
                        <th style={{ width: "20px" }}></th>
                        <th style={{ width: "30px" }}></th>
                        <th colSpan="3" scope="colgroup" data-field="inspection type" style={{ width: "30px", border: "1px solid black" }}>
                          {languageService("Inspection Type")}
                        </th>
                        <th style={{ width: "20px" }}></th>
                      </tr>
                      <tr>
                        <th data-field="date" style={{ width: "20px" }}>
                          {languageService("Date")}
                        </th>
                        <th data-field="line" style={{ width: "20px" }}>
                          {languageService("Line")}
                        </th>
                        <th data-field="weather" style={{ width: "30px" }}>
                          {languageService("Weather")}
                        </th>
                        <th data-field="weekly" style={{ width: "10px", border: "1px solid black" }}>
                          {languageService("Required")}
                        </th>
                        <th data-field="Weather" style={{ width: "10px", border: "1px solid black" }}>
                          {languageService("Weather")}
                        </th>
                        <th data-field="special" style={{ width: "10px", border: "1px solid black" }}>
                          {languageService("Special")}
                        </th>
                        <th data-field="inspector" style={{ width: "20px" }}>
                          {languageService("Inspector")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{moment(this.props.basicData.Date).format("MM/DD/YYYY")}</td>
                        <td>{this.props.basicData.Line}</td>
                        <td>{this.props.basicData.Weather}</td>
                        <td>{this.props.basicData.InspectionWeekly}</td>
                        <td>{this.props.basicData.InspectionWeather}</td>
                        <td>{this.props.basicData.InspectionSpecial}</td>
                        <td>{this.props.basicData.Inspector}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md={1}></Col>
                <Col md={10}>
                  <table>
                    <thead>
                      <tr>
                        <th data-field="track" style={{ width: "20px" }}>
                          {languageService("Track")}
                        </th>
                        <th data-field="from" style={{ width: "20px" }}>
                          {languageService("From")}
                        </th>
                        <th data-field="to" style={{ width: "20px" }}>
                          {languageService("To")}
                        </th>
                        <th data-field="hirail" style={{ width: "10px" }}>
                          {languageService("Hi-rail")}
                        </th>
                        <th data-field="walk" style={{ width: "10px" }}>
                          {languageService("Walk")}
                        </th>
                        <th data-field="observe" style={{ width: "10px" }}>
                          {languageService("Observe")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetsData}
                      {addEmptyColsIfNotEnough(assetsData, this.config.minAssetRows, 6)}
                    </tbody>
                  </table>
                </Col>
                <Col md={1}></Col>
              </Row>
              <Row>
                <Col md={12}>
                  <table>
                    <thead>
                      <tr>
                        <th data-field="mp" style={{ width: "12px" }}>
                          {languageService("MP")}
                        </th>
                        <th data-field="deficiency" style={{ width: "9px" }}>
                          {languageService("Deficiency")}
                        </th>
                        <th data-field="fradefect" style={{ width: "9px" }}>
                          {languageService("FRA Defect")}
                        </th>
                        <th data-field="code" style={{ width: "12px" }}>
                          {languageService("Code")}
                        </th>
                        <th data-field="defectdescription" style={{ width: "20px" }}>
                          {languageService("Defect Description")}
                        </th>
                        <th data-field="remidialaction" style={{ width: "20px" }}>
                          {languageService("Remedial Action")}
                        </th>
                        <th data-field="2139Bneeded" style={{ width: "5px" }}>
                          {languageService("213.9B Needed")}
                        </th>
                        {/* <th data-field="daterepaired" style={{width:"15px"}}>Date Repaired</th> */}
                        <th data-field="daterepaired" style={{ width: "10px" }}>
                          {languageService("Comments")}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {issuesData}
                      {addEmptyColsIfNotEnough(issuesData, this.config.minIssueRows, 8)}
                    </tbody>
                  </table>
                </Col>
              </Row>
              <Row className="no-break">
                <Col md={7}>
                  <div className="comment-box" style={themeService(trackReportStyle.boxStyle)}>
                    <strong>{languageService("Comments")}:</strong>
                  </div>
                </Col>
                <Col md={3}>
                  <div style={themeService(trackReportStyle.lineStyle)}></div>
                  <span style={themeService(trackReportStyle.spanStyle)}>{languageService("Inspector Signature")}</span>
                </Col>
                <Col md={2}>
                  <div style={themeService(trackReportStyle.lineStyle)}></div>
                  <span style={themeService(trackReportStyle.spanStyle)}>{languageService("Date")}</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default TrackReportView;

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
