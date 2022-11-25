import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { ic_done } from "react-icons-kit/md/ic_done";
import { Icon } from "react-icons-kit";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../variables";
import { trackReportStyle } from "../style/index";
import "../style/style.css";
import _ from "lodash";

class Crossing extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="table-report Crossing" style={{ ...themeService(trackReportStyle.mainStyle) }}>
          <Row>
            <Col md={2}>
              <img src={themeService(iconToShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
            </Col>
            <Col md={8}>
              <h5 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none" }}>Detailed Crossing Report</h5>
            </Col>
            <Col md={2}></Col>
          </Row>
          <hr />
          <span className="spacer"></span>
          <Row>
            <Col md={12}>
              <table>
                <tr>
                  <td colSpan={2}>
                    <span className="rpt-title">Subdivision</span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">Asset Location </span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">MP</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-value">MP</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">Location</span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">Asset Name</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">Date </span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">2/23/2022</span>
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <span className="rpt-title">Crossing Type</span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">
                      Rail <br />
                      Weight
                    </span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">
                      Asphalt
                      <br />
                      Width
                    </span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title"># Ties</span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <span className="rpt-title">
                      Crossing <br />
                      Protection
                    </span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">
                      Rail <br />
                      Length
                    </span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">
                      Asphalt <br />
                      Length
                    </span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">
                      # Tie <br />
                      Plates
                    </span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <span className="rpt-title">Construction</span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">Rail Offset</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">Inner Poly</span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">Poly</span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <span className="rpt-title">Date</span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">Length</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">Length</span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">Length </span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                </tr>
              </table>
            </Col>
          </Row>
          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              <h5 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none" }}>Inspection Items</h5>
            </Col>
            <Col md={2}></Col>
            <Col md={12}>
              <hr />
            </Col>
          </Row>

          <div>
            <table>
              <tr>
                <td>
                  <span className="lbl-text">Gauge Measurement at Widest Point</span>
                </td>
                <td>
                  <span className="insp-value">&nbsp;</span>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="lbl-text">Track Deflection or Movement?</span>
                </td>
                <td>
                  <span className="insp-value">
                    <span className="lbl-box"></span>
                    <span className="lbl-option">YES</span>

                    <span className="lbl-box"></span>
                    <span className="lbl-option">NO</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <p>
                    <span className="cmm-lbl">Comments:</span>
                  </p>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="lbl-text">Surface Condition</span>
                </td>
                <td>
                  <span className="insp-value">
                    <span className="lbl-box"></span>
                    <span className="lbl-option">GOOD </span>

                    <span className="lbl-box"></span>
                    <span className="lbl-option">POOR </span>

                    <span className="lbl-box"></span>
                    <span className="lbl-option">FAIR </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <p>
                    <span className="cmm-lbl">Comments:</span>
                  </p>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="lbl-text">Sidewalk Condition</span>
                </td>
                <td>
                  <span className="insp-value">
                    <span className="lbl-box"></span>
                    <span className="lbl-option">GOOD </span>

                    <span className="lbl-box"></span>
                    <span className="lbl-option">POOR </span>

                    <span className="lbl-box"></span>
                    <span className="lbl-option">FAIR </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <p>
                    <span className="cmm-lbl">Comments:</span>
                  </p>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="lbl-text">Rail Conditions</span>
                </td>
                <td>
                  <span className="insp-value">
                    <span className="lbl-box"></span>
                    <span className="lbl-option">GOOD </span>

                    <span className="lbl-box"></span>
                    <span className="lbl-option">POOR </span>

                    <span className="lbl-box"></span>
                    <span className="lbl-option">FAIR </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <p>
                    <span className="cmm-lbl">Comments:</span>
                  </p>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="lbl-text">Flangeway Conditions</span>
                </td>
                <td>
                  <span className="insp-value">
                    <span className="lbl-box"></span>
                    <span className="lbl-option">GOOD </span>

                    <span className="lbl-box"></span>
                    <span className="lbl-option">POOR </span>

                    <span className="lbl-box"></span>
                    <span className="lbl-option">FAIR </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <p>
                    <span className="cmm-lbl">Comments:</span>
                  </p>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="lbl-text">Have Flangeways been cleaned?</span>
                </td>
                <td>
                  <span className="insp-value">
                    <span className="lbl-box"></span>
                    <span className="lbl-option">YES </span>

                    <span className="lbl-box"></span>
                    <span className="lbl-option">NO </span>
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Crossing;
