import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import "./style.css";
import { languageService } from "Language/language.service";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../variables";

class ElectricUtility extends Component {
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
        <div className="table-report electric-utility">
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
                        <td colspan="18">
                          <h3 style={{ textAlign: "center", borderBottom: "1px solid #ccc", marginBottom: "0", paddingBottom: "5px" }}>
                            {languageService("Visual Inspection Program")}
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
                            {languageService(
                              "Summary of Deficiencies and Repair Activity Resulting from the Inspection Process - Streetlights",
                            )}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <th colSpan="3">Overhead Facilities</th>
                        <th colSpan="3">2019</th>
                        <th colSpan="3">2020</th>
                        <th colSpan="3">2021</th>
                        <th colSpan="3">2022</th>
                        <th colSpan="3">2023</th>
                      </tr>
                      <tr>
                        <th colSpan="3">
                          {" "}
                          <span className="sub-heading">Priority Level</span>
                        </th>
                        <th>I</th>
                        <th>II</th>
                        <th>III</th>
                        <th>I</th>
                        <th>II</th>
                        <th>III</th>
                        <th>I</th>
                        <th>II</th>
                        <th>III</th>
                        <th>I</th>
                        <th>II</th>
                        <th>III</th>
                        <th>I</th>
                        <th>II</th>
                        <th>III</th>
                      </tr>
                      <tr>
                        <th colSpan="3">
                          {" "}
                          <span className="sub-heading">Repair Expected</span>
                        </th>
                        <th>
                          Within <br /> 1 week
                        </th>
                        <th>
                          Within <br /> 1 Year
                        </th>
                        <th>
                          Within <br /> 3 years
                        </th>
                        <th>
                          Within <br /> 1 week
                        </th>
                        <th>
                          Within <br /> 1 Year
                        </th>
                        <th>
                          Within <br /> 3 years
                        </th>
                        <th>
                          Within <br /> 1 week
                        </th>
                        <th>
                          Within <br /> 1 Year
                        </th>
                        <th>
                          Within <br /> 3 years
                        </th>
                        <th>
                          Within <br /> 1 week
                        </th>
                        <th>
                          Within <br /> 1 Year
                        </th>
                        <th>
                          Within <br /> 3 years
                        </th>
                        <th>
                          Within <br /> 1 week
                        </th>
                        <th>
                          Within <br /> 1 Year
                        </th>
                        <th>
                          Within <br /> 3 years
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="blank" colspan="18">
                          Streetlight
                        </td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>Base/Standard/Light</h6>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Number of Deficiencies</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired in Time Frame</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Not Due</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>Handhole/Service Box</h6>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Number of Deficiencies</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired in Time Frame</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Not Due</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>Service/Internal Wiring</h6>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Number of Deficiencies</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired in Time Frame</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Not Due</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>Access Cover</h6>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Number of Deficiencies</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired in Time Frame</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Not Due</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>

                      <tr>
                        <td className="blank" colspan="18">
                          Miscellaneous
                        </td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>Other</h6>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Number of Deficiencies</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired in Time Frame</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Not Due</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>

                      <tr>
                        <td className="blank" colspan="18">
                          Streetlight Total
                        </td>
                      </tr>
                      <tr className="new-block">
                        <td colSpan="3">
                          <h6>Total</h6>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Number of Deficiencies</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired in Time Frame</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Not Due</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span className="sub-heading">Not Repaired - Overdue</span>
                        </td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
              <Row>
                <Col md={10}></Col>
                <Col md={2}>
                  <div>
                    <span></span>
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

export default ElectricUtility;
