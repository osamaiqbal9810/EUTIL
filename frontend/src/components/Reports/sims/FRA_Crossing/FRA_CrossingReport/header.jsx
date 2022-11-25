import React from "react";
import { Col, Row } from "reactstrap";
import { themeService } from "../../../../../theme/service/activeTheme.service";
import { iconToShow } from "../../../variables";
import { LocPrefixService } from "../../../../LocationPrefixEditor/LocationPrefixService";
import { CRUDFunction } from "../../../../../reduxCURD/container";
class CrossingHeading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subDiv: null,
      location: null,
      assetObj: null,
    };
  }
  componentDidMount() {
    this.getAssetWithParent();
  }

  getAssetWithParent() {
    if (this.props.selectedAssetId) this.props.getAssetReportHeader("getAssetWithParents/" + this.props.selectedAssetId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType === "ASSETREPORTHEADER_READ_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      this.setHeaderData(this.props.assetReportHeader);
    }
  }
  setHeaderData(container) {
    let subDiv = null;
    let subLocation = null;
    let railroad = null;

    let asset = container && container.asset;
    if (container && asset && container.parents) {
      subLocation = container.parents.find((pAsset) => asset.parentAsset === pAsset._id);
      if (subLocation) subDiv = container.parents.find((pAsset) => subLocation.parentAsset === pAsset._id);
      railroad = container.parents[container.parents.length-1] ? container.parents[container.parents.length-1].unitId : '';
    }
    this.setState({
      subDiv: subDiv,
      location: subLocation,
      assetObj: asset,
      railroadName: railroad,
    });
  }
  render() {
    return (
      <React.Fragment>
        <Row>
          <Col md={4}>
            <img src={themeService(iconToShow)} style={{ maxWidth: "28vw" }} alt="Logo" />
          </Col>
          <Col md={8}>
            <h2 style={{ fontWeight: "900" }}>{this.props.mainTitle}</h2>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="border border-dark heading">
              <Row>
                <Col md={6}>
                  {/* <div className="heading-info">
                    <strong>Division:</strong>
                    <span>{this.state.subDiv && this.state.subDiv.unitId}</span>
                  </div> */}
                  <div className="heading-info">
                    <strong>Railroad:</strong>
                    <span>{this.state.railroadName && this.state.railroadName}</span>
                  </div>
                  <div className="heading-info">
                    <strong>Subdivision:</strong>
                    <span>{this.props.data && this.props.data.lineName}</span>
                  </div>
                  <div className="heading-info">
                    <strong>Milepost (with Prefix):</strong>
                    <span>
                      {this.props.data &&
                        LocPrefixService.getPrefixMp(this.props.data.mp, this.props.data.lineId) + " " + this.props.data.mp}
                    </span>
                  </div>
                  <div className="heading-info">
                    <strong>Location:</strong>
                    <span>{this.state.assetObj && this.state.assetObj.unitId}</span>
                  </div>
                  {/* <div className="heading-info">
                    <strong>County:</strong>
                    <span>{this.props.data && this.props.data.county}</span>
                  </div> */}
                  <div className="heading-info">
                    <strong>Employee’s Name:</strong>
                    <span>{this.props.data && this.props.data.userName}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="heading-info">
                    <strong>Asset ID: </strong>
                    <span>{this.props.data && (this.state && this.state.assetObj && this.state.assetObj.attributes && this.state.assetObj.attributes["Asset ID"])
                       ? this.state.assetObj.attributes["Asset ID"] : this.props.data.assetUnitId}</span>
                  </div>
                  <div className="heading-info">
                    <strong>Test Date:</strong>
                    <span>{this.props.data && this.props.data.date}</span>
                  </div>
                  {/* <div className="heading-info">
                    <strong>State:</strong>
                    <span></span>
                  </div> */}
                  <span className="spacer"></span>
                  <span className="spacer"></span>
                  {/* <div className="heading-info">
                    <strong>Position Number:</strong>
                    <span></span>
                  </div> */}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="info-heading">
              <strong>Conditions Master Key</strong>
            </div>
            <div className="info-section">
              {this.props.testType === "Crossing" && (
                <React.Fragment>
                  <br />C = Tests completed on all applicable components, no exceptions found, and condition left in compliance.
                </React.Fragment>
              )}
              {this.props.testType === "Insulation" && (
                <React.Fragment>
                  <br />C = Test completed, condition left in compliance. Indicates that all wires in trunking and cable measured 500K Ohms
                  and above.
                </React.Fragment>
              )}
              {this.props.testType === "relay" && (
                <React.Fragment>
                  <br />C = Test completed, condition left in compliance
                </React.Fragment>
              )}

              {this.props.testType === "Crossing" && (
                <React.Fragment>
                  <br /> A = Adjustments made (identified in associated comments), test completed, and condition left in compliance.
                </React.Fragment>
              )}
              {this.props.testType === "Insulation" && (
                <React.Fragment>
                  <br /> A = Annual test required; insulation resistance between 500K and 200K Ohms. Prompt action shall be taken to remedy
                  condition
                </React.Fragment>
              )}

              {this.props.testType === "Crossing" && (
                <React.Fragment>
                  <br />R = Repairs and/or Replacements made (identified in associated comments), test completed, and condition left in
                  compliance.
                </React.Fragment>
              )}
              {this.props.testType === "Insulation" && (
                <React.Fragment>
                  <br />R = Repairs and/or Replacements made (identifed in associated comments), test completed, and condition left in
                  compliance. compliance.
                </React.Fragment>
              )}
              {this.props.testType === "relay" && (
                <React.Fragment>
                  <br />R = Replacements made (identified in associated comments), test completed, and condition left in compliance.
                </React.Fragment>
              )}

              {this.props.testType === "relay" && (
                <React.Fragment>
                  <br /> V = Visual inspection completed, condition left in compliance.
                </React.Fragment>
              )}

              {this.props.testType === "Crossing" && (
                <React.Fragment>
                  <br />G = Governed by Special Instruction
                </React.Fragment>
              )}

              {this.props.testType === "Crossing" && (
                <React.Fragment>
                  <br />
                  NT = The equipment was not tested in this inspection.
                  <br />N = Test Not Applicable.
                </React.Fragment>
              )}
              {this.props.testType === "Insulation" && (
                <React.Fragment>
                  <br />
                  NT = The equipment was not tested in this inspection.
                </React.Fragment>
              )}
              {this.props.testType === "relay" && (
                <React.Fragment>
                  <br />
                  NT = The equipment was not tested in this inspection.
                </React.Fragment>
              )}

              {this.props.testType === "Insulation" && (
                <React.Fragment>
                  <br />N = No inspection required. This is an annual re-inspection of a different conductor.
                </React.Fragment>
              )}
              {this.props.testType === "relay" && (
                <React.Fragment>
                  <br />N = No inspection required. The given relay does not require inspection at this time.
                </React.Fragment>
              )}
              <br />
              <br />
              <br />
            </div>

            {this.props.notes && (
              <div className="info-note">
                <strong>
                  NOTE: For Stand By Power (FRA 234.251), an indication of "C" denotes that all battery buses, as listed under Grounds (FRA
                  234.249), were tested. If any battery bus fails the Stand By Power test, that bus will be named in the notes associated
                  with the Stand By Power test.
                </strong>
              </div>
            )}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
const CrossingHeadingContainer = CRUDFunction(CrossingHeading, "assetReportHeader", null, null, null, "asset");
export default CrossingHeadingContainer;
