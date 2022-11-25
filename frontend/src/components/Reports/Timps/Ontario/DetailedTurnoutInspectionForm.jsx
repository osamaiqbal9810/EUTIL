import React from "react";
import _, { size } from "lodash";
import { Col, Row } from "reactstrap";
import "./style.css";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../variables";
import LeftImage from "images/left-detail-turnout.jpg";
import RightImage from "images/right-detail-turnout.jpg";
import { SignatureImage } from "../../utils/SignatureImage";

class DetailedTurnoutInspectionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      basicData: {},
      lh: true,
      signatureImage: null,
    };
    this.config = {
      minRows: 11,
    };
  }
  componentDidMount() {
    let { data } = this.state;
    let { basicData } = this.state;
    let { props } = this;
    if (props.assetData) {
      props.assetData.form &&
        props.assetData.form.forEach((field) => {
          if (field && field.id) data[field.id] = field.value;
        });
    }
    if (props.basicData) {
      basicData = props.basicData;
    }
    // let switchRH = props.assetData && checkRh(props.assetData);
    this.setState({
      data: { ...data },
      basicData: { ...basicData },
      lh: data.post === "Right" ? false : true,
    });
    console.log(props.assetData);
    this.findAndSetSignature(this.props.usersSignatures);
  }
  findAndSetSignature(usersSignatures) {
    let sigImage = usersSignatures && usersSignatures.find((sItem) => sItem.email === this.props.testExec.user.email);
    this.setState({
      signatureImage: sigImage ? sigImage.signature.imgName : null,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.usersSignatures !== prevProps.usersSignatures) {
      this.findAndSetSignature(this.props.usersSignatures);
    }
  }

  render() {
    let { props } = this;
    let { data, basicData, lh } = this.state;
    return (
      <React.Fragment>
        <div id="mainContent" className="table-report turnout-insp-form detailed" style={{ minHeight: "800px", pageBreakAfter: "always" }}>
          <Row>
            <Col md={3}>
              <img src={themeService(iconToShow)} style={{ width: "100%" }} alt="Logo" />
            </Col>
            <Col md={9}>
              <h2 style={{ marginTop: "18px" }}>
                {`DETAILED MAINLINE TURNOUT INSPECTION FORM - ${lh ? "LH" : "RH"}`}{" "}
                <small style={{ fontSize: "22px" }}>(Revised: April 2012)</small>
              </h2>
            </Col>
            <span className="spacer"></span>
            <span className="spacer"></span>

            <Col md={6}>
              <h5>
                <div className="title-rpt">
                  <label>Left/Right: </label>
                  <span> {data && data.post}</span>
                </div>
              </h5>
            </Col>

            <Col md={6}>
              <h5>
                <div className="title-rpt">
                  <label>Inspection Date: </label>
                  <span> {basicData.date}</span>
                </div>
              </h5>
            </Col>
            <Col md={6}>
              <h5>
                <div className="title-rpt">
                  <label>Type of Turnout: </label>
                  <span> {data && data.toti}</span>
                </div>
              </h5>
            </Col>

            <Col md={6}>
              <h5>
                <div className="title-rpt">
                  <label>Inspected By: </label>
                  <span> {basicData.userName}</span>
                </div>
              </h5>
            </Col>
            <Col md={6}>
              <h5>
                <div className="title-rpt">
                  <label>Rail Size: </label>
                  <span> {data && data.rsize}</span>
                </div>
              </h5>
            </Col>
            <Col md={6}>
              <h5>
                <div className="title-rpt">
                  <label>Turnout Name and MLG: </label>
                  <span> {props.assetData && props.assetData.assetName}</span>
                </div>
              </h5>
            </Col>
            <Col md={6}>
              <h5>
                <div className="title-rpt">
                  <label>Samson/Standard: </label>
                  <span> {data && data.samstnd}</span>
                </div>
              </h5>
            </Col>
            <Col md={6}>
              <h5>
                <div className="title-rpt">
                  <label>Signature: </label>
                  <span>
                    <SignatureImage signatureImage={this.state.signatureImage} />
                  </span>
                </div>
              </h5>
            </Col>
          </Row>
          <span className="spacer"></span>
          <Row>
            <Col md={12}>
              <table className="table">
                <tbody>
                  <tr>
                    <td className="tr-no-bordered" colSpan={4} rowSpan={1}>
                      <span className="tr-legend">Please indicate Good, Fair or Poor</span>
                    </td>
                    <td className="tr-no-bordered" colSpan={2} rowSpan={29}>
                      <img src={lh ? LeftImage : RightImage} alt="image" style={{ width: "100%" }} />
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Ballast & Drainage
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      <span> {data && data.ballast}</span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gl1}</span>
                      </label>
                      <span></span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gr1}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Line
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Main:
                      <span> {data && data.main1}</span>
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Siding:
                      <span> {data && data.side1}</span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.lcros1}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.rcros1}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Surface
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Main:
                      <span> {data && data.main2}</span>
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Siding:
                      <span> {data && data.side2}</span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Ties
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      <span> {data && data.ties}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.lcros2}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.rcros2}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Plates
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      <span> {data && data.plate}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gl2}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gr2}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Rails
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      <span> {data && data.rail}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Cotter Pins
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      <span> {data && data.pins}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.lcros3}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.rcros3}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Bolts
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      <span> {data && data.bolt}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Rail Braces
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Type:
                      <span> {data && data.type1}</span>
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Condition:
                      <span> {data && data.cond1}</span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.lcros4}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.rcros4}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Rail Anchors
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      <span> {data && data.ranchor}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gl3}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gr3}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Points (fit)
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Left:
                      <span> {data && data.left1}</span>
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Right:
                      <span> {data && data.right1}</span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Guard Check<span className="tr-dashed">{data && data.gc1}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Guard Check<span className="tr-dashed">{data && data.gc2}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Points (running surface)
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Left:
                      <span> {data && data.left2}</span>
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Right:
                      <span> {data && data.right2}</span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Guard Face<span className="tr-dashed">{data && data.gf1}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Guard Face<span className="tr-dashed">{data && data.gf2}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Heel Block
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Left:
                      <span> {data && data.left3}</span>
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Right:
                      <span> {data && data.right3}</span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Flangeway Depth<span className="tr-dashed">{data && data.fd1}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Flangeway Depth<span className="tr-dashed">{data && data.fd2}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Switch Locks/Keepers
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      <span> {data && data.switchkep}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gl4}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gr4}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Switch Stand
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Type:
                      <span> {data && data.type2}</span>
                    </td>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Cond.:
                      <span> {data && data.cond2}</span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.lcros5}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.rcros5}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Switch Target
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      Type:
                      <span> {data && data.starget}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.lcros6}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.rcros6}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Frog General
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      <span> {data && data.genfrog}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gl5}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gr5}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered" colSpan={1} rowSpan={1}>
                      Lubrication
                    </td>
                    <td className="tr-bordered" colSpan={2} rowSpan={1}>
                      <span> {data && data.lubric}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.lcros7}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.rcros7}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-no-bordered" colSpan={3} rowSpan={1}></td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.lcros8}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.rcros8}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-no-bordered" colSpan={3} rowSpan={1}>
                      <h4>COMMENTS</h4>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.lcros9}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.rcros9}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-bordered comments-box" colSpan={3} rowSpan={6}>
                      <span> {data && data.com}</span>
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                  </tr>
                  <tr>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                  </tr>
                  <tr>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge at heel<span className="tr-dashed">{data && data.gah1}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge at heel<span className="tr-dashed">{data && data.gah2}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Point Elevation<span className="tr-dashed">{data && data.pe1}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Point Elevation<span className="tr-dashed">{data && data.pe2}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                  </tr>
                  <tr>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.lcros10}</span>
                      </label>
                      <span></span>
                    </td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Crosslevel (+/-)<span className="tr-dashed">{data && data.rcros10}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="tr-no-bordered left no-padding"
                      style={{ paddingBottom: "0", verticalAlign: "bottom" }}
                      colSpan={3}
                      rowSpan={1}
                    >
                      NOTE: Crosslevel measurements must be taken at locations 15' 6"
                      <br />
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>
                        Gauge<span className="tr-dashed">{data && data.gl6}</span>
                      </label>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tr-no-bordered left no-padding" colSpan={3} style={{ paddingTop: "0" }} rowSpan={1}>
                      apart on both routes throughout the turnout <br />
                      <br />
                      All Gauge and Crosslevel measurements should be taken starting at the switch point and moving out.
                    </td>

                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}></td>
                    <td className="tr-no-bordered" colSpan={1} rowSpan={1}>
                      <label>(5'-10' ahead of points)</label>
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

export default DetailedTurnoutInspectionForm;

function addEmptyColsIfNotEnough(mapArray, minRows) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;

  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr>{getCols(20)}</tr>;
      emptyRows.push(row);
    }
  }

  return emptyRows;
}
function getCols(num) {
  let cols = [];
  let span = [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 4];
  for (let i = 0; i < num; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
