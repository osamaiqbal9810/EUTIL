import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import "./style.css";
import { languageService } from "Language/language.service";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../variables";

class FacilityInspForm extends Component {
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
        <div className="table-report electric-utility facility-insp-form" id="mainContent">
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
                    <thead style={{ borderTop: "none", borderRight: "none", borderLeft: "none" }}>
                      <tr>
                        <td colspan="30" style={{ borderRight: "none" }}>
                          <div style={{ textAlign: "right", marginBottom: "5px" }}>Inspector__________________________ Date___________</div>
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
                            {languageService("If a deficiency is found, indicate with Priority Level under that category and comment.")}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <th colSpan="2" rowSpan="2">
                          Line
                        </th>
                        <th colSpan="2" rowSpan="2" className="no-borders">
                          Pole/Device
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title border-top">Pole</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Guy</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Guy Guard</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Ground</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Gnd. Mould</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Riser</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Conductor(s)</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Neutral</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Transformer</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Switch/GOAB</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Cutout(s)</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Insulators</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Cross Arm</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Bracket</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Vegetation</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Other</span>
                        </th>
                        <th colSpan="4" rowSpan="1" className="no-borders border-bottom-none">
                          <span className="misplaced-title">Stray Voltage?</span>
                        </th>
                        <th colSpan="6" rowSpan="2">
                          <span className="tilted-title">Comment</span>
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="2" rowSpan="1" className="no-borders">
                          <span className="misplaced-title">yes</span>
                        </th>
                        <th colSpan="2" rowSpan="1" className="no-borders">
                          <span className="misplaced-title">No</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="6"></td>
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

export default FacilityInspForm;
