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
//import moment from "moment";
import { iconToShow, iconTwoShow } from "../../variables";
import { SignatureImage } from "../../utils/SignatureImage";
function statusCal(value) {
  let obj = { Good: "G", Satisfactory: "S", Defect: "D" };
  let toRet = obj[value] ? obj[value] : "";
  return toRet;
}
class MonthlyBridgeInspectionView extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.config = {
      minCommentRows: 4,
      minIssueRows: 4,
    };
  }
  render() {
    let bridgeData = [];
    let commentsData = [];
    let rowToFil = null;
    let commentRowToFill = null;
    if (this.props.assetData && this.props.assetData.form) {
      let data = {};
      this.props.assetData.form.forEach((field) => {
        if (field && field.id) data[field.id] = field.value;
      });
      let roadMaster = { first: "", second: "", third: "" };
      let inspectorWork = {
        corrected: data["li-act"] == "Inspector Corrected" ? "Yes" : "",
        slowOrder: data["li-act"] == "Slow Order" ? "Yes" : "",
        tos: data["li-act"] == "Out of Service" ? "Yes" : "",
      };

      rowToFil = (
        <tr>
          <td colSpan={3}></td>
          <td>{statusCal(data["li-bolt"])}</td>
          <td>{statusCal(data["li-bar"])}</td>
          <td>{statusCal(data["li-rail"])}</td>
          <td>{statusCal(data["li-appro"])}</td>
          <td>{statusCal(data["li-timb"])}</td>
          <td>{statusCal(data["li-plat"])}</td>
          <td>{statusCal(data["li-apar"])}</td>
          <td>{statusCal(data["li-anch"])}</td>
          <td>{statusCal(data["li-rust"])}</td>
          <td>{statusCal(data["li-gaug"])}</td>
          <td>{statusCal(data["li-vege"])}</td>
          <td>{statusCal(data["li-hook"])}</td>
          <td>{statusCal(data["li-rivet"])}</td>
          <td>{statusCal(data["li-not"])}</td>
          <td colSpan={4}>{statusCal(data["li-span"])}</td>
          <td>{inspectorWork.corrected}</td>
          <td>{inspectorWork.slowOrder}</td>
          <td>{inspectorWork.tos}</td>
          <td></td>
          <td>{roadMaster.first}</td>
          <td>{roadMaster.second}</td>
          <td>{roadMaster.third}</td>
        </tr>
      );
      commentRowToFill = (
        <tr>
          <td colSpan={3}></td>
          <td colSpan={18}>{data["tx-comm"]}</td>
          <td colSpan={7}></td>
        </tr>
      );
      bridgeData.push(rowToFil);
    }

    return (
      <React.Fragment>
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: "@media print { @page {size: landscape !important;size: auto !important;zoom: 70%}}",
          }}
        />
        <div className="table-report bridge" style={{ ...themeService(trackReportStyle.mainStyle) }}>
          <Row>
            <Col md={12}>
              <Row style={{ marginBottom: "30px" }}>
                <Col md={2}>
                  <img src={themeService(iconToShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
                </Col>
                <Col md={8}>
                  <h2 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none" }}>
                    <br />
                    <span style={{ borderBottom: "1px solid #000" }}>{languageService("MONTHLY BRIDGE INSPECTION REPORT")}</span>
                  </h2>
                </Col>
                <Col md={2} style={{ textAlign: "right" }}></Col>
              </Row>
              <Row>
                <Col md={6} style={{ display: "block", textAlign: "center" }}>
                  <label>Location:</label>
                  <span style={themeService(trackReportStyle.labelSpanStyle)}>{this.props.basicData && this.props.basicData.lineName}</span>
                </Col>
                <Col md={6} style={{ display: "block", textAlign: "center" }}>
                  <label>FOR:</label>
                  <span style={themeService(trackReportStyle.labelSpanStyle)}>
                    {this.props.assetData && this.props.assetData.assetName}
                  </span>
                </Col>
                <Col md={6} style={{ display: "block", textAlign: "center" }}>
                  <label>MILEAGE:</label>
                  <span style={themeService(trackReportStyle.labelSpanStyle)}> {this.props.assetData && this.props.assetData.assetMP}</span>
                </Col>
                <Col md={6} style={{ display: "block", textAlign: "center" }}>
                  <label>DATE:</label>
                  <span style={themeService(trackReportStyle.labelSpanStyle)}> {this.props.basicData && this.props.basicData.date}</span>
                </Col>
              </Row>
              <span className="spacer"></span>
              <Row>
                <Col md={12}>
                  <table>
                    <thead>
                      <tr>
                        <th rowSpan="1" colSpan="3"></th>
                        <th rowSpan="1" colSpan="18">
                          DEFECT: ( NOTE: "G" - GOOD / "D" - DEFECT / "S" - SATISFACTORY )
                        </th>
                        <th rowSpan="1" colSpan="3">
                          ACTION TAKEN BY INSPECTOR
                        </th>
                        <th rowSpan="2" colSpan="1" className="table-heading">
                          <span>DATE CORRECTED</span>
                        </th>
                        <th rowSpan="1" colSpan="3">
                          ACTION TAKEN BY ROADMASTER
                        </th>
                      </tr>
                      <tr>
                        <th rowSpan="1" colSpan="3" className="main-table-heading">
                          LOCATION OF DEFECT
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>BOLT MISSING / BROKEN</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>BROKEN JOINT BARS</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>BROKEN RAIL</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>APPROACHES</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>BRIDGE TIMBERS</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>TIE PLATES</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>PULL APART</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>RAIL ANCHORS</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>RUST / DEBRIS</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>WIDE GAUGE</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>VEGETATION</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>HOOK BOLTS</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>RIVETS OR BOLTS</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>NOT LISTED</span>
                        </th>
                        <th rowSpan="1" colSpan="4" className="sub-table-heading">
                          <span>OVERALL CONDITION OF BRIDGE INCLUDING; BOTTOM BRACINGS; BENTS; SPANS &amp; STIFFENERS</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>INSPECTOR CORRECTED</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>SLOW ORDER</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>OUT OF SERVICE</span>
                        </th>

                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>REPORT NOTED</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>INSPECTED DEFECT</span>
                        </th>
                        <th rowSpan="1" colSpan="1" className="table-heading">
                          <span>INSPECTED CORRECTIVE A</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowToFil}
                      {addEmptyColsIfNotEnough(bridgeData, this.config.minIssueRows, 23, "one")}
                    </tbody>
                    <thead>
                      <th colSpan="3">COMMENTS</th>
                      <th colSpan="18"></th>
                      <th colSpan="7"></th>
                    </thead>
                    <tbody>
                      {commentRowToFill}
                      {addEmptyColsIfNotEnough(bridgeData, this.config.minIssueRows, 3, "two")}
                    </tbody>
                  </table>
                </Col>

                <Col md={8}>
                  <div style={{ ...themeService(trackReportStyle.yardHeadingStyle), textAlign: "right" }}>
                    INSPECTOR:{" "}
                    <span style={themeService(trackReportStyle.labelSpanStyle)}>
                      {this.props.basicData && this.props.basicData.userName}{" "}
                    </span>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{ ...themeService(trackReportStyle.yardHeadingStyle), textAlign: "right" }}>
                    SIGNATURE:
                    <span style={themeService(trackReportStyle.labelSpanStyle)}>
                      <SignatureImage signatureImage={this.props.signatureImage} />
                    </span>
                  </div>
                </Col>
                <Col md={8}>
                  <div style={{ ...themeService(trackReportStyle.yardHeadingStyle), textAlign: "right" }}>
                    Reviewed by Superintendent: <span style={themeService(trackReportStyle.labelSpanStyle)}></span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div style={{ pageBreakAfter: "always" }}></div>
      </React.Fragment>
    );
  }
}

export default MonthlyBridgeInspectionView;

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
  if (type === "two") span = [3, 18, 7];
  else span = [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1];
  for (let i = 0; i < num; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
