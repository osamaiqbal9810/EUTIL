import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { ic_done } from "react-icons-kit/md/ic_done";
import { Icon } from "react-icons-kit";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../variables";
import { trackReportStyle } from "../style/index";
import "../style/style.css";
import _ from "lodash";

class Culvert extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="table-report Culvert" style={{ ...themeService(trackReportStyle.mainStyle) }}>
          <Row>
            <Col md={2}>
              <img src={themeService(iconToShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
            </Col>
            <Col md={8}>
              <h5 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none" }}>Monthly Culvert Report</h5>
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
                    <span className="rpt-title">Dimension</span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">
                      # of <br />
                      Tracks
                    </span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">
                      Drain
                      <br />
                      Name
                    </span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">Asset Name</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title"></span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value"></span>
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <span className="rpt-title">
                      Culvert <br />
                      Type
                    </span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">
                      Cover <br />
                      Depth
                    </span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title"></span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value"></span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title"></span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value"></span>
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <span className="rpt-title">
                      Installation <br />
                      Date
                    </span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title">
                      Culvert <br />
                      Length
                    </span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-value">&nbsp;</span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title"></span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value"></span>
                  </td>
                  <td colSpan={1}>
                    <span className="rpt-title"></span>
                  </td>
                  <td colSpan={2}>
                    <span className="rpt-value"></span>
                  </td>
                </tr>
              </table>
            </Col>
          </Row>
          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              <h5 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none" }}>Culvert Inlet</h5>
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
                  <span className="lbl-text">Inlet Damaged</span>
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
                <td>
                  <span className="lbl-text">Headwall Undermining?</span>
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
                <td>
                  <span className="lbl-text">Inlet constrictions or obstructions?</span>
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
                <td>
                  <span className="lbl-text">Are there erosion control measures at inlet?</span>
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
                <td>
                  <span className="lbl-text">Consition of erosion control measures?</span>
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
                <td>
                  <span className="lbl-text">Vegetation growth condition surrounding inlet?</span>
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
                <td>
                  <span className="lbl-text">Evidence of high water above culvert top?</span>
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

          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              <h5 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none" }}>Culvert Liner</h5>
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
                  <span className="lbl-text">Condition inside of the culvert?</span>
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
                <td>
                  <span className="small-title-culvert">Any signs of:</span>
                </td>
                <td></td>
              </tr>

              <tr>
                <td>
                  <span className="lbl-text">Cracking?</span>
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
                <td>
                  <span className="lbl-text">Spalling?</span>
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
                <td>
                  <span className="lbl-text">Abrasion?</span>
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
                <td>
                  <span className="lbl-text">Corrosion?</span>
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
                <td>
                  <span className="lbl-text">Are there joint gaps or open seams?</span>
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
              <tr>
                <td>
                  <span className="lbl-text">Water seeping along outside of culvert pipe?</span>
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
              <tr>
                <td>
                  <span className="lbl-text">Percentage of culvert filled with sediment?</span>
                </td>
                <td>
                  <span className="insp-value">
                    <span className="lbl-box" style={{ width: "75px" }}></span>
                    <span className="lbl-option">% </span>
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              <h5 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none" }}>Culvert Outlet</h5>
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
                  <span className="lbl-text">Outlet damaged?</span>
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
                <td>
                  <span className="lbl-text">Headwall undermining?</span>
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
                <td>
                  <span className="lbl-text">Inlet constrictions or obstructions?</span>
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
                <td>
                  <span className="lbl-text">Are there erosion control measures at inlet?</span>
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
                <td>
                  <span className="lbl-text">Consition of erosion control measures?</span>
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
                <td>
                  <span className="lbl-text">Vegetation growth condition surrounding inlet?</span>
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
                <td>
                  <span className="lbl-text">Evidence of high water above culvert top?</span>
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
          <div>
            <p className="main-comm">
              <span>NOTES/COMMENTS:</span>
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Culvert;
