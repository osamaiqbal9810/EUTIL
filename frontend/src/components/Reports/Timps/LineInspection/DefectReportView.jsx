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
import { MyButton } from "../../../Common/Forms/formsMiscItems";
import { ButtonStyle } from "../../../../style/basic/commonControls";
import { iconToShow, iconTwoShow } from "../../variables";

import { SignatureImage } from "../../utils/SignatureImage";
import { NoExceptionsFound } from "./NoExceptionsFound";
import { getServerEndpoint } from "../../../../utils/serverEndpoint";

class DefectReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayModified: this.props.InspectionReportType === "All" ? true : false,

      loadedImages: [],
    };
    this.config = {
      minAssetRows: 4,
      minIssueRows: 8,
    };
    // this.handleClick = this.handleClick.bind(this);
    // this.onImageLoad = this.onImageLoad.bind(this);
    this.checkFRACompliance = this.checkFRACompliance.bind(this);
  }
  // handleClick() {
  //   this.setState({ displayModified: !this.state.displayModified });
  // }
  checkFRACompliance(repairDate, RemedialAction) {
    if (this.state.displayModified) {
      return repairDate;
    } else {
      if (RemedialAction === "Repaired") return repairDate;
      else return "";
    }
  }

  render() {
    let issuesData = [];
    this.props.issuesData &&
      (issuesData = this.props.issuesData.map((issue, index) => {
        let comments = issue.RemedialAction && issue.RemedialAction;
        comments = issue.comments ? comments + " / " + issue.comments : comments;
        let selfRepair = issue.RemedialAction === "Repaired";
        let img = selfRepair ? this.props.signatureImage : issue.repairBySignature ? issue.repairBySignature : null;
        let repairByName = selfRepair ? this.props.userName : issue.repairByName ? issue.repairByName : null;
        return (
          <tr key={issue.issueId}>
            <td>{issue.assetName}</td>
            <td>{issue.MP}</td>
            <td>{issue.Deficiency && <SvgIcon icon={checkmark} />}</td>
            <td>{issue.FRADefect && <SvgIcon icon={checkmark} />}</td>
            <td>{issue.Code}</td>
            <td>{issue.DefectDescription}</td>
            {/* <td>{issue.RemedialAction}</td> */}
            <td>{comments}</td>
            {!this.props.disableRule213Config && <td>{issue.rule213Applied && <SvgIcon icon={checkmark} />}</td>}
            {this.state.displayModified && (
              <React.Fragment>
                <td>{img && <SignatureImage signatureImage={img} placement={"tableCell"} userName={repairByName} />}</td>
                <td>{this.checkFRACompliance(issue.repairDate, issue.RemedialAction)}</td>
              </React.Fragment>
            )}
          </tr>
        );
      }));
    let assetsData = [];
    this.props.assetsData &&
      (assetsData = this.props.assetsData.map((asset, index) => {
        return (
          <tr key={asset.unitId + index}>
            <td>
              {asset.attributes.primaryTrack && (
                <div style={{ marginRight: "10px", display: "inline-block" }}>
                  <span className="primary-track-logo" style={{ padding: "0" }}>
                    P
                  </span>
                </div>
              )}

              {<div style={{ display: "inline-block", width: "80%", verticalAlign: "middle", textAlign: "left" }}>{asset.unitId}</div>}
            </td>
            <td>{asset.start}</td>
            <td>{asset.end}</td>
            <td>{asset.HighRail}</td>
            <td>{asset.Walk}</td>
            <td>{asset.Train}</td>
            <td>{asset.Observe}</td>
          </tr>
        );
      }));
    return (
      <React.Fragment>
        <div className="table-report" style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={2}>
                  <img src={themeService(iconToShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
                </Col>
                <Col md={8} style={{ textAlign: "center" }}>
                  <h2 style={{ ...themeService(trackReportStyle.headingStyle), transform: "initial" }}>{this.props.header}</h2>
                  {/*   <MyButton
                    className="d-print-none"
                    onClick={this.handleClick}
                    type="submit"
                    style={{
                      ...themeService(ButtonStyle.commonButton),
                      backgroundColor: "var(--first)",
                      boxShadow: "2px 2px 5px 0px rgb(0 0 0 / 75%)",
                      borderColor: "var(--first)",
                      whiteSpace: "pre-line",
                      height: "60px",
                    }}
                  >
                     {this.state.displayModified ? "FRA Report \n (Original)" : "Copy of Report \n (with Comments)"}
                  </MyButton>*/}
                </Col>
                <Col md={2}>
                  <img
                    src={themeService(iconTwoShow)}
                    alt="Logo"
                    style={{ ...themeService(trackReportStyle.logoStyle), maxHeight: "125px" }}
                  />
                </Col>
                <span className="spacer"></span>
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
                        <th data-field="train" style={{ width: "10px" }}>
                          {"Train"}
                        </th>
                        <th data-field="observe" style={{ width: "10px" }}>
                          {"Observe"}
                        </th>
                      </tr>
                    </thead>
                    <tbody key={"assetBody"}>
                      {assetsData}
                      {addEmptyColsIfNotEnough(assetsData, this.config.minAssetRows, 7)}
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
                        <th data-field="name" style={{ width: "10px" }}>
                          {"Asset"}
                        </th>
                        <th data-field="mp" style={{ width: "10px" }}>
                          {"MP"}
                        </th>
                        <th data-field="deficiency" style={{ width: "5px" }}>
                          {"Def"}
                        </th>
                        <th data-field="fradefect" style={{ width: "5px" }}>
                          {"Defect"}
                        </th>
                        <th data-field="code" style={{ width: "10px" }}>
                          {"Code"}
                        </th>
                        <th data-field="defectdescription" style={{ width: "20px" }}>
                          {"Defect / Deficiency Description"}
                        </th>
                        {/* <th data-field="remidialaction" style={{ width: "20px" }}>
                          {"Remedial Action"}
                        </th> */}

                        <th data-field="comments" style={{ width: "28px" }}>
                          {"Remedial Action / Comments"}
                        </th>
                        {!this.props.disableRule213Config && (
                          <th data-field="2139Bneeded" style={{ width: "5px" }}>
                            {"213.9B Needed"}
                          </th>
                        )}
                        {this.state.displayModified && (
                          <React.Fragment>
                            <th data-field="signature" style={{ width: "15px" }}>
                              {"Maintainer \n Signature"}
                            </th>
                            <th data-field="daterepaired" style={{ width: "10px" }}>
                              {"Date \n Repaired"}
                            </th>
                          </React.Fragment>
                        )}
                      </tr>
                    </thead>

                    <tbody key={"issueBody"}>
                      {issuesData}
                      {addEmptyColsIfNotEnough(
                        issuesData,
                        this.config.minIssueRows,
                        colCalculator(this.state.displayModified, this.props.disableRule213Config),
                      )}
                      <NoExceptionsFound issuesData={issuesData} />
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
                  <div style={{ ...themeService(trackReportStyle.lineStyle), textAlign: "center", position: "relative" }}>
                    <span style={{ position: "absolute", bottom: "0", right: "0", left: "0" }}>{this.props.basicData.Date}</span>
                  </div>
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
DefectReportView.defaultProps = {
  basicData: {},
  assetsData: [],
};

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
function colCalculator(displayRepaired, disableRule213) {
  let col = 10;
  col = displayRepaired ? col : 8;
  col = disableRule213 ? col - 1 : col;
  return col;
}
