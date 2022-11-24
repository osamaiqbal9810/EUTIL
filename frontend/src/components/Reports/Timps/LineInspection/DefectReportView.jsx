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

import { SignatureImage } from "../../utils/SignatureImage";

class DefectReportView extends Component {
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
        <tr key={issue.issueId}>
          <td>{issue.MP}</td>
          <td>{issue.Deficiency && <SvgIcon icon={checkmark} />}</td>
          <td>{issue.FRADefect && <SvgIcon icon={checkmark} />}</td>
          <td>{issue.Code}</td>
          <td>{issue.DefectDescription}</td>
          <td>{issue.RemedialAction}</td>
          <td>{issue.Needed && <SvgIcon icon={checkmark} />}</td>
          <td>{issue.comments}</td>
          <td>{issue.repairDate}</td>
        </tr>
      );
    });

    let assetsData = this.props.assetsData.map((asset, index) => {
      return (
        <tr key={asset.unitId + index}>
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
                  <h2 style={themeService(trackReportStyle.headingStyle)}>{"Line Inspection and Repair Report"}</h2>
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
                          {"Inspection Type"}
                        </th>
                        <th style={{ width: "20px" }}></th>
                      </tr>
                      <tr>
                        <th data-field="date" style={{ width: "20px" }}>
                          {"Date"}
                        </th>
                        <th data-field="line" style={{ width: "20px" }}>
                          {"Line"}
                        </th>
                        <th data-field="weather" style={{ width: "30px" }}>
                          {"Weather"}
                        </th>
                        <th data-field="weekly" style={{ width: "10px", border: "1px solid black" }}>
                          {"Required"}
                        </th>
                        <th data-field="Weather" style={{ width: "10px", border: "1px solid black" }}>
                          {"Weather"}
                        </th>
                        <th data-field="special" style={{ width: "10px", border: "1px solid black" }}>
                          {"Special"}
                        </th>
                        <th data-field="inspector" style={{ width: "20px" }}>
                          {"Inspector"}
                        </th>
                      </tr>
                    </thead>
                    <tbody key={"mainBody"}>
                      <tr>
                        <td>{this.props.basicData.Date}</td>
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
                          {"Track"}
                        </th>
                        <th data-field="from" style={{ width: "20px" }}>
                          {"From"}
                        </th>
                        <th data-field="to" style={{ width: "20px" }}>
                          {"To"}
                        </th>
                        <th data-field="hirail" style={{ width: "10px" }}>
                          {"Hi-rail"}
                        </th>
                        <th data-field="walk" style={{ width: "10px" }}>
                          {"Walk"}
                        </th>
                        <th data-field="observe" style={{ width: "10px" }}>
                          {"Observe"}
                        </th>
                      </tr>
                    </thead>
                    <tbody key={"assetBody"}>
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
                        <th data-field="mp" style={{ width: "10px" }}>
                          {"MP"}
                        </th>
                        <th data-field="deficiency" style={{ width: "9px" }}>
                          {"Deficiency"}
                        </th>
                        <th data-field="fradefect" style={{ width: "5px" }}>
                          {"FRA Defect"}
                        </th>
                        <th data-field="code" style={{ width: "10px" }}>
                          {"Code"}
                        </th>
                        <th data-field="defectdescription" style={{ width: "20px" }}>
                          {"Defect / Deficiency Description"}
                        </th>
                        <th data-field="remidialaction" style={{ width: "20px" }}>
                          {"Remedial Action"}
                        </th>
                        <th data-field="2139Bneeded" style={{ width: "5px" }}>
                          {"213.9B Needed"}
                        </th>
                        <th data-field="comments" style={{ width: "18px" }}>
                          {"Comments"}
                        </th>
                        <th data-field="daterepaired" style={{ width: "10px" }}>
                          {"Date Repaired"}
                        </th>
                      </tr>
                    </thead>

                    <tbody key={"issueBody"}>
                      {issuesData}
                      {addEmptyColsIfNotEnough(issuesData, this.config.minIssueRows, 9)}
                    </tbody>
                  </table>
                </Col>
              </Row>
              <Row className="no-break">
                <Col md={7}>
                  <div className="comment-box" style={themeService(trackReportStyle.boxStyle)}>
                    <strong>{"Comments"}:</strong>
                    <span style={{ display: "block", padding: "0px 15px 10px", whiteSpace: "break-spaces" }}>
                      {this.props.basicData.commentsDetail}
                    </span>
                  </div>
                </Col>
                <Col md={3}>
                  <div style={{ ...themeService(trackReportStyle.lineStyle), position: "relative", overflow: "hidden" }}>
                    {" "}
                    <SignatureImage signatureImage={this.props.signatureImage} />
                  </div>

                  <span style={themeService(trackReportStyle.spanStyle)}>{"Inspector Signature"}</span>
                </Col>
                <Col md={2}>
                  <div style={{ ...themeService(trackReportStyle.lineStyle) }}></div>
                  <span style={themeService(trackReportStyle.spanStyle)}>{"Date"}</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default DefectReportView;

function addEmptyColsIfNotEnough(mapArray, minRows, cols) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;
  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr key={i + "emptyRow"}>{getCols(cols)}</tr>;
      emptyRows.push(row);
    }
  }
  return emptyRows;
}

function getCols(num) {
  let cols = [];
  for (let i = 0; i < num; i++) {
    cols.push(<td key={i + "emptyCol"}></td>);
  }
  return cols;
}
