import React from "react";
import _ from "lodash";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { languageService } from "Language/language.service";
import "./style.css";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../variables";
import moment from "moment";
import { arrowRight2 } from "react-icons-kit/icomoon/arrowRight2";
import Icon from "react-icons-kit";
import imgDiagram from "../../../../images/alignment.jpg";
import { getFieldsReport } from "../appFormReportsUtility";
import { SignatureImage } from "../../utils/SignatureImage";

class LightUnitAlignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportData: {},
    };
  }
  componentDidMount() {
    this.calculateData([this.props.testExec]);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.testExec !== prevProps.testExec) this.calculateData([this.props.testExec]);
    if (this.props.usersSignatures !== prevProps.usersSignatures) {
      this.findAndSetSignature(this.props.usersSignatures);
    }
  }
  calculateData(reportData) {
    let assetsData = [];
    if (reportData && reportData.length > 0) {
      assetsData = getFieldsReport(reportData);
    }
    this.findAndSetSignature(this.props.usersSignatures);
    this.setState({
      reportData: assetsData[0],
    });
  }
  findAndSetSignature(usersSignatures) {
    let sigImage = usersSignatures.find((sItem) => sItem.email === this.props.testExec.user.email);
    this.setState({
      signatureImage: sigImage ? sigImage.signature.imgName : null,
    });
  }
  render() {
    return (
      <React.Fragment>
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html:
              "@media print { .table-report.highway-traffic table.table thead tr.min-heading th,.table-report.light-unit-alignment table.table thead tr.min-heading th {background-color: #27457f;border: 2px solid #000;-webkit-print-color-adjust: exact !important;} }",
          }}
          //@page{size: auto; margin: 0mm;}
          //@page{size: A3 landscape; margin: 0mm;}
        />
        <div id="mainContent" className="table-report light-unit-alignment " style={{ minHeight: "800px", pageBreakAfter: "always" }}>
          <Row>
            <Col md={6}>
              <img src={themeService(iconToShow)} style={{ width: "28vw" }} alt="Logo" />
            </Col>
            <Col md={6}>
              <h2 style={{ textAlign: "right" }}>
                {languageService("SSIT-F-003")}
                <br />
                {languageService("Light Unit Alignment Form")}
              </h2>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <table className="table">
                <thead>
                  <tr className="min-heading">
                    <th colspan={2}>
                      <span>Alignment Information: </span>
                    </th>
                    <th colspan={3}>
                      <span>Signal Diagram: </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan={2}>
                      <span>
                        <strong>Subdivision:</strong> {this.props.testExec && this.props.testExec.lineName}{" "}
                      </span>
                    </td>
                    <td colspan={3} rowSpan={7}>
                      <div className="media">
                        <img src={imgDiagram} class="img-fluid" alt="Responsive image"></img>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan={2}>
                      <span>
                        <strong>Mileage:</strong> {this.props.testExec && this.props.testExec.assetMP}{" "}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan={2}>
                      <span>
                        <strong>Location:</strong> {this.props.testExec && this.props.testExec.assetName}{" "}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan={2}>
                      <span>
                        <strong>Date of Alignment:</strong> {this.props.testExec && moment(this.props.testExec.date).format("MM-DD-YYYY")}{" "}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan={2}>
                      <span>
                        <strong>Name:</strong> {this.props.testExec && this.props.testExec.user && this.props.testExec.user.name}{" "}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan={2}>
                      <div className="light-signature-wrapper">
                        <strong style={{ textAlign: "left", display: "block", fontSize: "16px" }}>Signature:</strong>{" "}
                        <SignatureImage signatureImage={this.state.signatureImage} />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan={2}>
                      <p>
                        Signal number should correspond with board plan. If naming convention differs from board plan, signal numbering on
                        Alignment Form should be updated to reflect the naming shown on the board plan
                      </p>
                    </td>
                  </tr>
                </tbody>
                <thead>
                  <tr className="min-heading">
                    <th colspan={5}>
                      <span>Mast Signals </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan={2}>
                      <span>
                        <strong>Signal Unit Type:</strong> {this.state.reportData.msst}{" "}
                      </span>
                    </td>
                    <td colspan={3}>
                      <span>
                        <strong>Signal Size (mm):</strong> {this.state.reportData.msss}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>
                        <strong>Light Unit Set</strong>{" "}
                      </span>
                    </td>
                    <td>
                      <span>
                        <strong>
                          Signal #1 <br></br> Alignment (m)
                        </strong>
                      </span>
                    </td>
                    <td>
                      <span>
                        <strong>
                          Signal #2 <br></br> Alignment (m)
                        </strong>
                      </span>
                    </td>
                    <td>
                      <span>
                        <strong>
                          Signal #3 <br></br> Alignment (m)
                        </strong>
                      </span>
                    </td>
                    <td>
                      <span>
                        <strong>
                          Signal #4 <br></br> Alignment (m)
                        </strong>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Front “A”</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfa1}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfa2}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfa3}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfa4}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Front “B”</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfb1}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfb2}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfb3}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfb4}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Front “C”</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfc1}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.msfc2}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfc3}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msfc4}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Back “A”</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msba1}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.msba2}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msba3}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msba4}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Back “B”</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msbb1}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.msbb2}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msbb3}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msbb4}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Back “C”</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msbc1}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.msbc2}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msbc3}</span>
                    </td>
                    <td>
                      <span> {this.state.reportData.msbc4}</span>
                    </td>
                  </tr>
                </tbody>

                <thead>
                  <tr className="min-heading">
                    <th colspan={5}>
                      <span>Cantilever Signals </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td colspan={2}>
                      <span>
                        <strong>Signal Unit Type:</strong> {this.state.reportData.cssu}{" "}
                      </span>
                    </td>
                    <td colspan={3}>
                      <span>
                        <strong>Signal Size (mm):</strong> {this.state.reportData.csss}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>
                        <strong>Light Unit Set</strong>{" "}
                      </span>
                    </td>
                    <td>
                      <span>
                        <strong>
                          Signal #1 <br></br> Alignment (m)
                        </strong>
                      </span>
                    </td>
                    <td>
                      <span>
                        <strong>
                          Signal #2 <br></br> Alignment (m)
                        </strong>
                      </span>
                    </td>
                    <td>
                      <span>
                        <strong>
                          Signal #3 <br></br> Alignment (m)
                        </strong>
                      </span>
                    </td>
                    <td>
                      <span>
                        <strong>
                          Signal #4 <br></br> Alignment (m)
                        </strong>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Front “A”</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfa1}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfa2}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfa3}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfa4}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Front “B”</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfb1}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfb2}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfb3}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfb4}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Front “C”</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfc1}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfc2}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfc3}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csfc4}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Back “A”</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csba1}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csba2}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csba3}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csba4}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Back “B”</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csbb1}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csbb2}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csbb3}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csbb4}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Back “C”</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csbc1}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csbc2}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csbc3}</span>
                    </td>
                    <td>
                      <span>{this.state.reportData.csbc4}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default LightUnitAlignment;
