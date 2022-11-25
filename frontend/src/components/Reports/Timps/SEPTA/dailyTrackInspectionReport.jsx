import React from "react";
import _, { size } from "lodash";
import { Col, Row } from "reactstrap";
import "../style/style.css";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../variables";
import LeftImage from "images/left-detail-turnout.jpg";
import RightImage from "images/right-detail-turnout.jpg";
import { SignatureImage } from "../../utils/SignatureImage";

class DailyTrackInspection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //basicData: {},
      //   lh: true,
      signatureImage: null,
    };
    this.config = {
      minRows: 12,
    };
  }
  //   componentDidMount() {
  //     let { data } = this.state;
  //     let { basicData } = this.state;
  //     let { props } = this;
  //     if (props.assetData) {
  //       props.assetData.form &&
  //         props.assetData.form.forEach((field) => {
  //           if (field && field.id) data[field.id] = field.value;
  //         });
  //     }
  //     if (props.basicData) {
  //       basicData = props.basicData;
  //     }
  //     // let switchRH = props.assetData && checkRh(props.assetData);
  //     this.setState({
  //       data: { ...data },
  //       basicData: { ...basicData },
  //       lh: data.post === "Right" ? false : true,
  //     });
  //     console.log(props.assetData);
  //     this.findAndSetSignature(this.props.usersSignatures);
  //   }
  //   findAndSetSignature(usersSignatures) {
  //     let sigImage = usersSignatures && usersSignatures.find((sItem) => sItem.email === this.props.testExec.user.email);
  //     this.setState({
  //       signatureImage: sigImage ? sigImage.signature.imgName : null,
  //     });
  //   }
  //   componentDidUpdate(prevProps, prevState) {
  //     if (this.props.usersSignatures !== prevProps.usersSignatures) {
  //       this.findAndSetSignature(this.props.usersSignatures);
  //     }
  //   }

  render() {
    //let { props } = this;
    let { data } = this.state;
    return (
      <React.Fragment>
        <div id="mainContent" className="table-report daily-tract-inspection" style={{ minHeight: "800px", pageBreakAfter: "always" }}>
          <Row>
            <Col md={3}>
              <img src={themeService(iconToShow)} style={{ width: "100%" }} alt="Logo" />
            </Col>
            <Col md={9}>
              <h2 style={{ marginTop: "18px" }}>{`Southeastern Pennsylvania Transportation Authority`} </h2>
            </Col>
            <span className="spacer"></span>
          </Row>
          <Row>
            <Col md={12}>
              <table className="table">
                <thead>
                  <tr>
                    <td colSpan={27}>
                      <h2>
                        SUBWAY / LIGHT RAIL TRACK DIVISION <br />
                        DAILY TRACK INSPECTION REPORT
                      </h2>
                    </td>
                  </tr>
                  <tr className="bg-dark">
                    <th colSpan={9}>LINES INSPECTED</th>
                    <th colSpan={2}>TRACK</th>
                    <th colSpan={4}>FROM</th>
                    <th colSpan={4}>TO</th>
                    <th colSpan={4}>DAY OF THE WEEK</th>
                    <th colSpan={4}>DATE</th>
                  </tr>

                  <tr>
                    <td colSpan={9}></td>
                    <td colSpan={2}></td>
                    <td colSpan={4}></td>
                    <td colSpan={4}></td>
                    <td colSpan={4}></td>
                    <td colSpan={4}></td>
                  </tr>

                  <tr className="bg-dark">
                    <td colSpan={9}></td>
                    <td colSpan={2}></td>
                    <td colSpan={4}></td>
                    <td colSpan={4}></td>
                    <th colSpan={8}>INSPECTOR</th>
                  </tr>

                  <tr>
                    <td colSpan={9}></td>
                    <td colSpan={2}></td>
                    <td colSpan={4}></td>
                    <td colSpan={4}></td>
                    <td colSpan={8}></td>
                  </tr>

                  <tr className="bg-dark">
                    <td colSpan={9}></td>
                    <td colSpan={2}></td>
                    <td colSpan={4}></td>
                    <td colSpan={4}></td>
                    <th colSpan={2}>RUN</th>
                    <th colSpan={6}>NUMBER OF PAGES</th>
                  </tr>

                  <tr>
                    <td colSpan={9}></td>
                    <td colSpan={2}></td>
                    <td colSpan={4}></td>
                    <td colSpan={4}></td>
                    <td colSpan={2}></td>
                    <td colSpan={2}></td>
                    <td colSpan={2} className="bg-dark">
                      <i>of</i>
                    </td>
                    <td colSpan={2}></td>
                  </tr>

                  <tr className="bg-dark">
                    <td colSpan={19} rowSpan={2}></td>
                    <th colSpan={8} rowSpan={1}>
                      MAINTENANCE MANAGER
                    </th>
                  </tr>

                  <tr>
                    <td colSpan={8} rowSpan={1}></td>
                  </tr>

                  <tr className="bg-dark">
                    <th colSpan={1} rowSpan={2}>
                      No.
                    </th>
                    <th colSpan={6} rowSpan={2}>
                      Station
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      Track
                    </th>
                    <th colSpan={4} rowSpan={1}>
                      COLUMN
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      GEO.
                    </th>
                    <th colSpan={4} rowSpan={2}>
                      FIXATION RAIL SECTION
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      TYPE TRACK
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      DEFECT CODE
                    </th>
                    <th colSpan={6} rowSpan={2}>
                      DESCRIPTION
                    </th>
                    <th colSpan={2} rowSpan={2}>
                      TYPE ACTION
                    </th>
                  </tr>
                  <tr className="bg-dark">
                    <th colSpan={2} rowSpan={1}>
                      FROM
                    </th>
                    <th colSpan={2} rowSpan={1}>
                      TO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data}
                  {addEmptyColsIfNotEnough(data, this.config.minRows)}
                </tbody>
                <span className="spacer"></span>
                <tbody>
                  <tr>
                    <td colSpan={27}>1. Geomentry: T=Tangent track, C=Curve, G=Guarded curve, V=Vertical curve, S=Special work</td>
                  </tr>
                  <tr>
                    <td colSpan={27}>
                      <p>
                        2. Fixation and Rail Section:(100-ASCE canted)(100-ARA-B Canted)(100-ARA-B Pandol)(115-RE Double shoulder)(115-RE
                        ZLR Pandol)(LLord Pandol)(lord low restraint)Lord high restraint) C and D clips) (RL-59)(128)(149)(134)(152)
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={27}>
                      <p>
                        3. Type of Track: A=Channel, B = B Type, MB = Modified B, C= Ballast track, OD= open deck, DF= Direct fixation,
                        p=Paved
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={27}>
                      <p>
                        Type of action: R3=Restricted to class #3, R2 =Restricted to class #2, R1=Restricted to class #1, OOS = Out of
                        services, IM=Immediate repairs, SR=Scheduled repair
                      </p>
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

export default DailyTrackInspection;

function addEmptyColsIfNotEnough(mapArray, minRows) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;

  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr>{getCols()}</tr>;
      emptyRows.push(row);
    }
  }

  return emptyRows;
}
function getCols() {
  let cols = [];
  let span = [1, 6, 1, 2, 2, 1, 4, 1, 1, 6, 2];
  for (let i = 0; i < span.length; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
