import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import "./style.css";
import { languageService } from "Language/language.service";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../variables";
class InspectionSummary extends Component {
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
        <div className="table-report electric-utility inspection summary" id="mainContent">
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
                        <td colspan="21">
                          {/* <h3 style={{ textAlign: "center", borderBottom: "1px solid #ccc", marginBottom: "0", paddingBottom: "5px" }}>
                            {languageService("Visual Inspection Program")}
                          </h3> */}
                          {/* <h5
                            style={{
                              textAlign: "center",
                              borderRight: "1px solid #ccc",
                              borderLeft: "1px solid #ccc",
                              borderBottom: "2px solid #000",
                              padding: "5px 0 20px",
                              marginBottom: "0",
                            }}
                          >
                            {languageService("InspectionSummary of Deficiencies and Repair Activity Resulting from the Inspection Process")}
                          </h5> */}
                        </td>
                      </tr>
                      <tr>
                        <th colSpan="4">Village of Sherburne</th>
                        <th colSpan="2"></th>
                        <th colSpan="2">2019</th>
                        <th colSpan="2">2020</th>
                        <th colSpan="2">2021</th>
                        <th colSpan="2">2022</th>
                        <th colSpan="2">2023</th>
                        <th colSpan="2"></th>
                        <th colSpan="3"></th>
                      </tr>
                      <tr>
                        <th colSpan="4"> 2019- 2023 /n Inspection Summary</th>
                        <th colSpan="2">Total /n System Units</th>
                        <th colSpan="2">Units /n Completed</th>
                        <th colSpan="2">Units /n Completed</th>
                        <th colSpan="2">Units /n Completed</th>
                        <th colSpan="2">Units /n Completed</th>
                        <th colSpan="2">Units /n Completed</th>
                        <th colSpan="2">2019-2023 /n Units Completed</th>
                        <th colSpan="3">2019-2023 /n Percent Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="4">
                          <h6></h6>
                        </td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6>Distribution Poles</h6>
                        </td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6></h6>
                        </td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6>Underground Facilities</h6>
                        </td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6></h6>
                        </td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6>URD</h6>
                        </td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6></h6>
                        </td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6>Street Light / Traffic Signals</h6>
                        </td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6></h6>
                        </td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6>Substation Fences</h6>
                        </td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6></h6>
                        </td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6>Transmission</h6>
                        </td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="3">0</td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6></h6>
                        </td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="2"></td>
                        <td colSpan="3"></td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <h6>Total</h6>
                        </td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
                        <td colSpan="2">0</td>
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
export default InspectionSummary;
