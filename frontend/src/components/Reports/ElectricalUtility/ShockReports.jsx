import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import "./style.css";
import { languageService } from "Language/language.service";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../variables";

class ShockReports extends Component {
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
        <div className="table-report electric-utility shock-reports" id="mainContent">
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
                        <td colspan="4">
                          <h3 style={{ textAlign: "center", borderBottom: "1px solid #ccc", marginBottom: "0", paddingBottom: "5px" }}>
                            {languageService("ATTACHMENT 2")}
                          </h3>
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
                            {languageService("Summary of Shock Reports from the Public")}
                          </h5>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>I. Total shock calls received:</h6>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Unsubstantiated</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Normally Energized Equipment</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Stray Voltage:</span>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Person</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Animal</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td></td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>II. Injuries Sustained/ Medical Attention Received</h6>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Person</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Animal</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td></td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>III. Voltage Source:</h6>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Utility Responsibility</span>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Issue with primary, joint, or transformer</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Secondary Joint (Crab)</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">SL Service Line</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Abandoned SL service line</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Defective service line</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Abandoned service line</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">OH Secondary</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">OH Service</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">OH Service neutral</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Pole</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Riser</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Other</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Customer Responsibility</span>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Contractor Damage</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Customer Equipment/Wiring</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Other Utility/Gov't Agency Responsibility</span>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">SL Base Connection</span>
                        </td>
                        <td>0</td>
                      </tr>

                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Overhead Equipment</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">Other</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td></td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>IV. Voltage Range:</h6>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">1.0V to 4.4V</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">4.5V to 24.9V</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading small">25V and above</span>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td></td>
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

export default ShockReports;
