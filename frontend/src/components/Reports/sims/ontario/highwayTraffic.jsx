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
import { getFieldsReport } from "../appFormReportsUtility";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import { SignatureImage } from "../../utils/SignatureImage";
import { versionInfo } from "../../../MainPage/VersionInfo";

class HighwayTraffic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportData: {},
      signatureImage: null,
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
  findAndSetSignature(usersSignatures) {
    let sigImage = usersSignatures.find((sItem) => sItem.email === this.props.testExec.user.email);
    this.setState({
      signatureImage: sigImage ? sigImage.signature.imgName : null,
    });
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
  render() {
    let selectedAsset = this.props.assetData ? this.props.assetData : {};
    return (
      <React.Fragment>
        <div id="mainContent" className="table-report highway-traffic" style={{ minHeight: "800px", pageBreakAfter: "always" }}>
          <Row>
            <Col md={6}>
              <img src={themeService(iconToShow)} style={{ width: "28vw" }} alt="Logo" />
            </Col>
            <Col md={6}>
              <h2 style={{ textAlign: "right" }}>
                {languageService("SSIT-F-004")}
                <br />
                {languageService("Highway Traffic Interconnection Signoff")}
              </h2>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <table className="table">
                <thead>
                  <tr>
                    <th colSpan={2}>
                      <span className="th-text">
                        Subdivision: <span className="th-value">{this.props.testExec ? this.props.testExec.lineName : ""}</span>
                      </span>{" "}
                    </th>
                    <th colSpan={2}>
                      <span className="th-text">
                        Mileage:<span className="th-value"> {this.props.testExec ? this.props.testExec.assetMP : ""} </span>
                      </span>
                    </th>
                    <th colSpan={2}>
                      <span className="th-text">
                        Location: <span className="th-value">{this.props.testExec ? this.props.testExec.assetName : ""} </span>
                      </span>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={2}>
                      <span className="th-text">
                        Date:{" "}
                        <span className="th-value">{this.props.testExec ? moment(this.props.testExec.date).format("MM-DD-YYYY") : ""}</span>
                      </span>
                    </th>
                    <th colSpan={2}>
                      <span className="th-text">
                        Time:{" "}
                        <span className="th-value">{this.props.testExec ? moment(this.props.testExec.date).format("HH:MM") : ""}</span>
                      </span>
                    </th>
                    <th colSpan={2}>
                      <span className="th-text"></span>
                    </th>
                  </tr>

                  <tr className="min-heading">
                    <th colspan={2}>
                      <span>
                        {" "}
                        Interconnection type(s):<pre className="th-value" style={{ display: "inline-block" }}></pre>{" "}
                      </span>
                    </th>
                    <th colspan={2}>
                      <span>&nbsp;</span>
                    </th>
                    <th colspan={2}>
                      <span>&nbsp;</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <span className="check-box">{checkMarkOnTrue(this.state.reportData.ivts) && <Icon icon={checkmark} />} </span>{" "}
                      <span className="th-check-box">Interconnection of Vehicle Traffic Signal</span>{" "}
                    </td>
                    <td colSpan={2}>
                      <span className="check-box">{checkMarkOnTrue(this.state.reportData.ipts) && <Icon icon={checkmark} />} </span>{" "}
                      <span className="th-check-box">Interconnection of Pedestrian Traffic Signal </span>{" "}
                    </td>
                    <td colSpan={2}>
                      <span className="check-box"> {checkMarkOnTrue(this.state.reportData.psrcs) && <Icon icon={checkmark} />}</span>{" "}
                      <span className="th-check-box">Prepare to Stop at Railway Crossing Signal </span>{" "}
                    </td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <th colSpan={6}>
                      <span className="th-text">Perform the following checks:</span>{" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="test-with-checkbox">
                    <td colSpan={6}>
                      <span className="arrow-Icon">
                        <Icon size="32px" icon={arrowRight2} />
                      </span>
                      <span className="option-text">Interconnection signal sent from crossing warning system. </span>{" "}
                      <span className="td-check-box">{checkMarkOnTrue(this.state.reportData.cb1) && <Icon icon={checkmark} />}</span>
                    </td>
                  </tr>
                  <tr className="test-with-checkbox">
                    <td colSpan={6}>
                      <span className="arrow-Icon">
                        <Icon size="32px" icon={arrowRight2} />
                      </span>
                      <span className="option-text">Interconnection signal received at interconnection device.</span>{" "}
                      <span className="td-check-box">{checkMarkOnTrue(this.state.reportData.cb2) && <Icon icon={checkmark} />}</span>
                    </td>
                  </tr>
                  <tr className="test-with-checkbox">
                    <td colSpan={6}>
                      <span className="arrow-Icon">
                        <Icon size="32px" icon={arrowRight2} />
                      </span>
                      <span className="option-text">Interconnection advance activation time sufficient for clearing crossing. </span>{" "}
                      <span className="td-check-box">{checkMarkOnTrue(this.state.reportData.cb3) && <Icon icon={checkmark} />}</span>
                    </td>
                  </tr>
                  <tr className="test-with-checkbox">
                    <td colSpan={6}>
                      <span className="arrow-Icon">
                        <Icon size="32px" icon={arrowRight2} />
                      </span>
                      <span className="option-text">Interconnection stays active for duration of crossing warning system.</span>{" "}
                      <span className="td-check-box">{checkMarkOnTrue(this.state.reportData.cb4) && <Icon icon={checkmark} />}</span>
                    </td>
                  </tr>
                  <tr className="test-with-checkbox">
                    <td colSpan={6}>
                      <span className="arrow-Icon">
                        <Icon size="32px" icon={arrowRight2} />
                      </span>
                      <span className="option-text">
                        Interconnection remains active for time sufficient for traffic to return to regular operating speeds.
                      </span>{" "}
                      <span className="td-check-box">{checkMarkOnTrue(this.state.reportData.cb5) && <Icon icon={checkmark} />}</span>
                    </td>
                  </tr>
                  <tr className="test-with-checkbox">
                    <td colSpan={6}>
                      <span className="arrow-Icon">
                        <Icon size="32px" icon={arrowRight2} />
                      </span>
                      <span className="option-text">4 hours continuous battery backup provided at interconnected device. </span>{" "}
                      <span className="td-check-box">{checkMarkOnTrue(this.state.reportData.cb6) && <Icon icon={checkmark} />}</span>
                    </td>
                  </tr>
                  <tr className="test-with-checkbox">
                    <td colSpan={6}>
                      <span className="arrow-Icon">
                        <Icon size="32px" icon={arrowRight2} />
                      </span>
                      <span className="option-text">Any additional tests as required for specific applications. </span>{" "}
                      <span className="td-check-box">{checkMarkOnTrue(this.state.reportData.cb7) && <Icon icon={checkmark} />}</span>
                    </td>
                  </tr>
                </tbody>
                <thead>
                  <tr className="input-values min-heading">
                    <th colspan={3}>
                      <span className="" style={{ textAlign: "center" }}>
                        Railway Company Information{" "}
                      </span>
                    </th>
                    <th colspan={3}>
                      <span className="" style={{ textAlign: "center" }}>
                        {" "}
                        Road Authority Information
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="input-values">
                    <th colspan={3}>
                      <span className="lbl-with-value">
                        Railway Company Name:<span className="lbl-txt-value">{versionInfo && versionInfo.getCustomer()}</span>
                      </span>
                    </th>
                    <th colspan={3}>
                      <span className="lbl-with-value">
                        Road Authority Name:<span className="lbl-txt-value">{this.state.reportData.rauthname}</span>
                      </span>
                    </th>
                  </tr>
                  <tr className="input-values">
                    <th colspan={3}>
                      <span className="lbl-with-value">
                        Railway Company Contact Information:<span className="lbl-txt-value"></span>
                      </span>
                    </th>
                    <th colspan={3}>
                      <span className="lbl-with-value">
                        Road Authority Contact Information:
                        <span className="lbl-txt-value">
                          {" "}
                          {`${this.state.reportData.rauthphone ? this.state.reportData.rauthphone : ""}  ${
                            this.state.reportData.email ? this.state.reportData.email : ""
                          }`}
                        </span>
                      </span>
                    </th>
                  </tr>
                  <tr className="input-values">
                    <th colspan={3}>
                      <span className="lbl-with-value">
                        Railway Company Tester Name:{" "}
                        <span className="lbl-txt-value">
                          {this.props.testExec && this.props.testExec.user && this.props.testExec.user.name}
                        </span>
                      </span>
                    </th>
                    <th colspan={3}>
                      <span className="lbl-with-value">
                        Road Authority Tester Name:<span className="lbl-txt-value"> {this.state.reportData.rauthTester}</span>
                      </span>
                    </th>
                  </tr>
                  <tr className="input-values">
                    <th colspan={3}>
                      <span className="lbl-with-value" style={{ position: "relative", display: " inline-block", width: "100%" }}>
                        Signature: <SignatureImage signatureImage={this.state.signatureImage} />
                      </span>
                    </th>
                    <th colspan={3}>
                      <span className="lbl-with-value" style={{ position: "relative", display: " inline-block", width: "100%" }}>
                        Signature:
                      </span>
                    </th>
                  </tr>
                  <tr className="input-values">
                    <th colspan={6}>
                      <span className="lbl-with-value">
                        Comments:
                        <span className="lbl-txt-value">{this.state.reportData.com1}</span>
                      </span>
                    </th>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col md={12}>
              <p>
                <i>
                  Original test form to remain in case at warning system until subsequent test form is created. Once superseded, old test
                  forms to be provided to ONR S&C Supervisor for archiving.{" "}
                  <strong> Latest test form shall always remain available at crossing location.</strong>
                </i>
              </p>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default HighwayTraffic;

function checkMarkOnTrue(value) {
  return value === "true" || value === true ? true : "";
}
