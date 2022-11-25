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

class SupplementInspectionReport extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.config = {
      minIssueRows: 8,
    };
  }

  render() {
    let issuesData = [];
    // this.props.issuesData.map((issue, index) => {
    //   return (
    //     <tr key={issue.issueId}>
    //       <td>{issue.MP}</td>
    //       <td>{issue.Deficiency && <SvgIcon icon={checkmark} />}</td>
    //       <td>{issue.FRADefect && <SvgIcon icon={checkmark} />}</td>
    //       <td>{issue.Code}</td>
    //       <td>{issue.DefectDescription}</td>
    //       <td>{issue.RemedialAction}</td>
    //       <td>{issue.Needed && <SvgIcon icon={checkmark} />}</td>
    //       <td>{issue.comments}</td>
    //       <td>{this.checkFRACompliance(issue.repairDate, issue.RemedialAction)}</td>
    //     </tr>
    //   );
    // });

    return (
      <React.Fragment>
        <div className="table-report txn" style={{ ...themeService(trackReportStyle.mainStyle) }}>
          <Row>
            <Col md={2} style={{ borderTop: "1px solid #000" }}>
              <span style={{ paddingTop: "20px", display: "inline-block", textAlign: "right" }}>
                RAILROAD: _______________
                <br />
                SUBDIVISION; _______________
              </span>
            </Col>
            <Col md={8} style={{ borderTop: "1px solid #000" }}>
              <h5 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none" }}>
                SUPPLEMENT INSPECTION REPORT
                <hr style={{ borderTop: "1px solid #000", marginTop: "0" }} />
                INSPECTION OF SWITCHES, TURNOUTS AND CROSSING FROG
                <hr style={{ borderTop: "1px solid #000", marginTop: "0" }} />
              </h5>
            </Col>
            <Col
              md={2}
              style={{ textAlign: "left", borderTop: "1px solid #000", borderLeft: "1px solid #000", borderRight: "1px solid #000" }}
            >
              <span style={{ paddingTop: "30px", display: "inline-block" }}>Report Number:</span>
            </Col>
          </Row>

          <Row>
            <table>
              <thead>
                <tr>
                  <th colSpan="1" rowSpan="3">
                    M / L
                  </th>
                  <th colSpan="1" rowSpan="3">
                    YARD
                  </th>
                  <th colSpan="3" rowSpan="3">
                    LOCATION
                  </th>
                  <th colSpan="1" rowSpan="3">
                    BEG MP
                  </th>
                  <th colSpan="1" rowSpan="3">
                    END MP
                  </th>
                  <th colSpan="1" rowSpan="3">
                    DATE
                  </th>
                  <th colSpan="12" rowSpan="1">
                    INDICATE CONDITIONS FOUND AT TIME OF INSPECTION
                  </th>
                  <th colSpan="6" rowSpan="3">
                    REMARKS
                  </th>
                </tr>
                <tr>
                  <th colSpan="1" rowSpan="2">
                    RAIL ENDS
                  </th>
                  <th colSpan="1" rowSpan="2">
                    JOINT BARS
                  </th>
                  <th colSpan="1" rowSpan="2">
                    BOLTS
                  </th>
                  <th colSpan="1" rowSpan="2">
                    TIES
                  </th>
                  <th colSpan="1" rowSpan="2">
                    X-ING FROG
                  </th>
                  <th colSpan="1" rowSpan="2">
                    GUARD RAILS
                  </th>
                  <th colSpan="1" rowSpan="2">
                    FROG
                  </th>
                  <th colSpan="2" rowSpan="1">
                    SWITCH POINTS
                  </th>
                  <th colSpan="1" rowSpan="2">
                    HEEL BLOCKS
                  </th>
                  <th colSpan="1" rowSpan="2">
                    TRANSIT CLIPS
                  </th>
                  <th colSpan="1" rowSpan="2">
                    STOCK RAILS
                  </th>
                </tr>
                <tr>
                  <th colSpan="1" rowSpan="1">
                    HEEL
                  </th>
                  <th colSpan="1" rowSpan="1">
                    TRANSIT CLIPS
                  </th>
                </tr>
              </thead>

              <tbody key={"issueBody"}>
                {issuesData}
                {addEmptyColsIfNotEnough(issuesData, this.config.minIssueRows, 19)}
              </tbody>
            </table>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default SupplementInspectionReport;

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
  else span = [1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6];
  for (let i = 0; i < num; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
