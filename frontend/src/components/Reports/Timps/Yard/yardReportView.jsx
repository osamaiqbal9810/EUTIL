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

class YardReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.config = {
      minAssetRows: 4,
      minIssueRows: 10,
    };
  }
  render() {
    let yardData = [];
    // let issuesData = this.props.issuesData.map((issue, index) => {
    //   return (
    //     <tr key={issue.timpeStamp}>
    //       <td>{issue.MP}</td>
    //       <td>{issue.Deficiency && <SvgIcon icon={checkmark} />}</td>
    //       <td>{issue.FRADefect && <SvgIcon icon={checkmark} />}</td>
    //       <td>{issue.Code}</td>
    //       <td>{issue.DefectDescription}</td>
    //       <td>{issue.RemedialAction}</td>
    //       <td>{issue.Needed && <SvgIcon icon={checkmark} />}</td>
    //       <td></td>
    //       <td>{issue.comments}</td>
    //     </tr>
    //   );
    // });

    // let assetsData = this.props.assetsData.map((asset, index) => {
    //   return (
    //     <tr key={asset.unitId}>
    //       <td>
    //         {asset.attributes.primaryTrack && (
    //           <div style={{ width: "20px", marginRight: "10px", display: "inline-block", color: "rgb(58, 179, 74)" }}>
    //             <SvgIcon icon={ruble} />
    //           </div>
    //         )}

    //         {<div style={{ display: "inline-block", width: "80%", verticalAlign: "middle" }}>{asset.unitId}</div>}
    //       </td>
    //       <td>{asset.start}</td>
    //       <td>{asset.end}</td>
    //       <td>{asset.HighRail}</td>
    //       <td>{asset.Walk}</td>
    //       <td>{asset.Observe}</td>
    //     </tr>
    //   );
    // });
    return (
      <React.Fragment>
        <div className="table-report" style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}>
          <Row>
            <Col md={12}>
              <Row style={{ borderTop: "2px solid #000", borderBottom: "2px solid #000", marginBottom: "30px" }}>
                <Col md={2}>
                  <img src={themeService(iconToShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
                </Col>
                <Col md={8}>
                  <h2 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none" }}>
                    {languageService("Rapport d'inspection de la voie - Cour de triage")}
                    <br />
                    {languageService("Yard - Track inspection report")}
                  </h2>
                </Col>
                <Col md={2} style={{ textAlign: "right" }}>
                  <img src={themeService(iconTwoShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
                </Col>
              </Row>
              <Row>
                <Col md={7}>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>
                    Inspecteur/Inspector:<span style={themeService(trackReportStyle.labelSpanStyle)}></span>
                  </div>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>
                    Temps/Weather:<span style={themeService(trackReportStyle.labelSpanStyle)}></span>
                  </div>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>
                    Secteur*:<span style={themeService(trackReportStyle.labelSpanStyle)}></span>{" "}
                  </div>
                </Col>
                <Col md={5}>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>
                    Date d'inspection/ inspection date<span style={themeService(trackReportStyle.labelSpanStyle)}></span>
                  </div>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>
                    Type d'inpsection: <span style={themeService(trackReportStyle.labelSpanStyle)}></span>
                  </div>
                </Col>
                <Col md={12}>
                  <div style={{ ...themeService(trackReportStyle.yardHeadingStyle), textDecoration: "underline" }}>
                    Sommaire de la journée/Daily summary:
                    <span style={{ ...themeService(trackReportStyle.labelSpanStyle), borderBottom: "none" }}></span>
                  </div>
                  <div style={{ ...themeService(trackReportStyle.yardHeadingStyle), textDecoration: "underline" }}>
                    Portion de voie inspectées/Inspected tracks:
                    <span style={{ ...themeService(trackReportStyle.labelSpanStyle), borderBottom: "none" }}></span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div style={themeService(trackReportStyle.textAreaStyle)}></div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div style={{ ...themeService(trackReportStyle.yardHeadingStyle), textDecoration: "underline" }}>
                    Aiguillages inspectés/Inspected switches:
                    <span style={{ ...themeService(trackReportStyle.labelSpanStyle), borderBottom: "none" }}></span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={1}></Col>
                <Col md={11}>
                  <table>
                    <tbody>{addEmptyColsIfNotEnough(yardData, this.config.minIssueRows, 7)}</tbody>
                  </table>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>*Légende des secteur:</div>
                </Col>
                <Col md={3}>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>1- Nord Sept-Iles/ loop</div>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>2- Receiving</div>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>3- Station</div>
                </Col>
                <Col md={3}>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>4- Zone des ateliers</div>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>5- Cour de récupération</div>
                </Col>
              </Row>
              <Row>
                <Col md={9}>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>
                    Signature: <span style={themeService(trackReportStyle.labelSpanStyle)}></span>
                  </div>
                </Col>
                <Col md={3}>
                  <div style={themeService(trackReportStyle.yardHeadingStyle)}>
                    Date: <span style={themeService(trackReportStyle.labelSpanStyle)}></span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default YardReportView;

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
