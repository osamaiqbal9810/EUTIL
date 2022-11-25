import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import "./style.css";
import { languageService } from "Language/language.service";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../variables";
class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.content = {
      headers: {},
    };
  }
  render() {
    let electricData = [];
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
    // });    // let assetsData = this.props.assetsData.map((asset, index) => {
    //   return (
    //     <tr key={asset.unitId}>
    //       <td>
    //         {asset.attributes.primaryTrack && (
    //           <div style={{ width: "20px", marginRight: "10px", display: "inline-block", color: "rgb(58, 179, 74)" }}>
    //             <SvgIcon icon={ruble} />
    //           </div>
    //         )}    //         {<div style={{ display: "inline-block", width: "80%", verticalAlign: "middle" }}>{asset.unitId}</div>}
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
        <div className="table-report electric-utility summary" id="mainContent">
          <Row>
            <Col md={12}>
              <Row>
                {/* <Col md={2}>{/* <img src={themeService(iconToShow)} alt="Logo" /> </Col> */}
                <Col md={12}></Col>
                {/* <Col md={2} style={{ textAlign: "right" }}>
                   <img src={themeService(iconTwoShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
                </Col> */}
              </Row>
              <Row>
                <Col md={12}>
                  <table>
                    <thead>
                      <tr>
                        <td colspan="22">
                          {/* <h3 style={{ textAlign: "center", borderBottom: "1px solid #ccc", marginBottom: "0", paddingBottom: "5px" }}>
                            {languageService("Visual Inspection Program")}
                          </h3> */}
                          <h5
                            style={{
                              textAlign: "center",
                              borderRight: "1px solid #ccc",
                              borderLeft: "1px solid #ccc",
                              borderBottom: "2px solid #000",
                              padding: "5px 0 20px",
                              marginBottom: "0",
                            }}
                          >
                            {languageService("Summary of Deficiencies and Repair Activity Resulting from the Inspection Process")}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <th colSpan="3">Year</th>
                        <th colSpan="4">Priority Level / Repair Expected</th>
                        <th colSpan="3">Deficiencies Found (Total)</th>
                        <th colSpan="3">Repaired In Time Frame</th>
                        <th colSpan="3">Repaired - Overdue</th>
                        <th colSpan="3">Not Repaired - Not Due</th>
                        <th colSpan="3">Not Repaired - Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>2019</h6>
                        </td>
                        <td colSpan="1"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">I</td>
                        <td colSpan="3">Within 1 week</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">II</td>
                        <td colSpan="3">Within 1 Year</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">III</td>
                        <td colSpan="3">Within 3 Years</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">IV</td>
                        <td colSpan="3">N/A</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">I</td>
                        <td colSpan="3">Within 1 week</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>2020</h6>
                        </td>
                        <td colSpan="1"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">I</td>
                        <td colSpan="3">Within 1 week</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">II</td>
                        <td colSpan="3">Within 1 Year</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">III</td>
                        <td colSpan="3">Within 3 Years</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">IV</td>
                        <td colSpan="3">N/A</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">I</td>
                        <td colSpan="3">Within 1 week</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>2021</h6>
                        </td>
                        <td colSpan="1"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">I</td>
                        <td colSpan="3">Within 1 week</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">II</td>
                        <td colSpan="3">Within 1 Year</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">III</td>
                        <td colSpan="3">Within 3 Years</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">IV</td>
                        <td colSpan="3">N/A</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">I</td>
                        <td colSpan="3">Within 1 week</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>2022</h6>
                        </td>
                        <td colSpan="1"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">I</td>
                        <td colSpan="3">Within 1 week</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">II</td>
                        <td colSpan="3">Within 1 Year</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">III</td>
                        <td colSpan="3">Within 3 Years</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">IV</td>
                        <td colSpan="3">N/A</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">I</td>
                        <td colSpan="3">Within 1 week</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>2023</h6>
                        </td>
                        <td colSpan="1"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">I</td>
                        <td colSpan="3">Within 1 week</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">II</td>
                        <td colSpan="3">Within 1 Year</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">III</td>
                        <td colSpan="3">Within 3 Years</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">IV</td>
                        <td colSpan="3">N/A</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="1">I</td>
                        <td colSpan="3">Within 1 week</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
export default Summary;
