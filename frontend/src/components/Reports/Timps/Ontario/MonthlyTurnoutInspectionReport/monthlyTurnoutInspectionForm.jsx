import React, { Fragment } from "react";
import _ from "lodash";
import { Col, Row } from "reactstrap";
import { languageService } from "Language/language.service";
import "../style.css";
import { themeService } from "../../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../../variables";
import moment from "moment";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import { cross } from "react-icons-kit/icomoon/cross";
import Icon from "react-icons-kit";
import { SignatureImage } from "../../../utils/SignatureImage";
import { dataFormatters } from "../../../../../utils/dataFormatters";
const Conditions = {
  WithinStandards: "Within standards",
  Defective: "Defective",
};

const RenderCondition = (val) => {
  return val === Conditions.Defective ? (
    <Icon size={15} icon={cross} />
  ) : val === Conditions.WithinStandards ? (
    <Icon style={{ color: "red" }} size={15} icon={checkmark} />
  ) : (
    ""
  );
};

class MonthlyTurnoutInspectionForm extends React.Component {
  constructor(props) {
    super(props);
    this.config = {
      minRows: 6,
    };
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {}

  render() {
    console.log(this.props.reportData);
    let { reportData } = this.props;

    let Data =
      reportData &&
      reportData.assets &&
      reportData.assets.map((data) => {
        return (
          <tr>
            <td colspan={2}>
              <span>{data.milepost}</span>
            </td>
            <td colspan={2}>
              <span style={{ fontSize: "12px" }}>{data.turnutName}</span>
            </td>
            <td colspan={1}>
              <span>{data.summary ? data.summary.mmax : ""}</span>
            </td>
            <td colspan={1}>
              <span>{data.summary ? data.summary.mmin : ""}</span>
            </td>
            <td colspan={1}>
              <span>{data.summary ? data.summary.smax : ""}</span>
            </td>
            <td colspan={1}>
              <span>{data.summary ? data.summary.smin : ""}</span>
            </td>
            <td colspan={1}>
              <span>{data.summary ? data.summary.mline : ""}</span>
            </td>
            <td colspan={1}>
              <span>{data.summary ? data.summary.cside : ""}</span>
            </td>
            <td colspan={1}>
              <span>{data.summary ? data.summary.fline : ""}</span>
            </td>
            <td colspan={1}>
              <span>{data.summary ? data.summary.fside : ""}</span>
            </td>
            <td colspan={1}>
              <span className="icons-detail">{data.summary ? RenderCondition(data.summary.stand) : ""}</span>
            </td>
            <td colspan={1}>
              <span className="icons-detail">{data.summary ? RenderCondition(data.summary.point) : ""}</span>
            </td>
            <td colspan={1}>
              <span className="icons-detail">{data.summary ? RenderCondition(data.summary.srail) : ""}</span>
            </td>
            <td colspan={1}>
              <span className="icons-detail">{data.summary ? RenderCondition(data.summary.rrail) : ""}</span>
            </td>
            <td colspan={1}>
              <span className="icons-detail">{data.summary ? RenderCondition(data.summary.frog) : ""}</span>
            </td>
            <td colspan={1}>
              <span className="icons-detail">{data.summary ? RenderCondition(data.summary.surf) : ""}</span>
            </td>
            <td colspan={1}>
              <span className="icons-detail">{data.summary ? RenderCondition(data.summary.alig) : ""}</span>
            </td>
            <td colspan={1}>
              <span className="icons-detail">{data.summary ? RenderCondition(data.summary.ocond) : ""}</span>
            </td>

            {/* Defect code - comments - Date Repaired  */}

            <td colspan={16} className="with-inline-table">
              <table className="table inline-table">
                {data.issues && data.issues.length > 0 ? (
                  <tbody>
                    {data.issues.map((issue) => (
                      <tr>
                        <td colSpan={2}>{`${issue.detectCodes}  ${issue.detectDescription ? "-" + issue.detectDescription : ""}  ${
                          issue.userComments ? "/" + issue.userComments : ""
                        }`}</td>
                        <td colSpan={1}>
                          {issue.selfRepair ? (
                            <span>{reportData.user.name} </span>
                          ) : issue.defectRepaired.name ? (
                            <span> {issue.defectRepaired.name}</span>
                          ) : null}

                          {issue.selfRepair ? (
                            <span>{dataFormatters.dateFormatter(reportData.date)}</span>
                          ) : issue.defectRepaired.date ? (
                            <span> {issue.defectRepaired.date} </span>
                          ) : null}
                        </td>
                        <td colSpan={1}>
                          <SignatureImage
                            signatureImage={
                              issue.selfRepair
                                ? reportData.user && reportData.user.signature && reportData.user.signature.imgName
                                : issue.defectRepaired.signature
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={2}></td>
                      <td colSpan={1}></td>
                      <td colSpan={1}></td>
                    </tr>
                  </tbody>
                )}
              </table>
            </td>
            {/* <td colspan={4}>
              <span>
                {data.issues && data.issues.length > 0 ? (
                  <div>
                    {data.issues.map((issue) => (
                      <Fragment>
                        {issue.defectRepaired.signature ? (
                          <div>
                            Signature: <SignatureImage signatureImage={issue.defectRepaired.signature.imgName} />
                          </div>
                        ) : null}
                        {issue.defectRepaired.name ? <div> {issue.defectRepaired.name} </div> : null}
                        {issue.defectRepaired.date ? <div> {issue.defectRepaired.date} </div> : null}
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </span>
            </td> */}
            {/**/}
          </tr>
        );
      });
    return (
      <React.Fragment>
        <div id="mainContent" className="table-report turnout-insp-form " style={{ minHeight: "800px", pageBreakAfter: "always" }}>
          <Row>
            <Col md={3}>
              <img src={themeService(iconToShow)} style={{ width: "100%" }} alt="Logo" />
            </Col>

            <Col md={9}>
              <h2 style={{ marginTop: "15px", marginLeft: "15%" }}>{languageService("Monthly Mainline Turnout Inspection Form")}</h2>
            </Col>
            <span className="spacer"></span>
            <Col md={6}>
              <h5>
                <label>Subdivision :</label>
                <div className="title-rpt">{reportData.location}</div>
              </h5>
            </Col>

            <Col md={6}>
              <h5>
                <label>Date :</label>
                <div className="title-rpt">{dataFormatters.dateFormatter(reportData.date)}</div>
              </h5>
            </Col>
            <Col md={6}>
              <h5>
                <label>Track Inspector : </label>
                <div className="title-rpt">{reportData.user.name}</div>
              </h5>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <table className="table">
                <thead>
                  <tr className="main-heading">
                    <th colspan={4}>
                      <span>Turnout Location</span>
                    </th>
                    <th colspan={8}>
                      <span>Measurements </span>
                    </th>
                    <th colspan={8}>
                      <span>Conditions</span>
                    </th>
                  </tr>
                  <tr>
                    <th colspan={2} rowSpan={2}>
                      <span className="tilted-th main">Milepost</span>
                    </th>
                    <th colspan={2} rowSpan={2}>
                      <span className="tilted-th main">Turnout Name</span>
                    </th>
                    <th colspan={4} rowSpan={1}>
                      <span className="sub-title">Gauge</span>
                    </th>
                    <th colspan={2} rowSpan={1}>
                      <span className="sub-title">Guard Check</span>
                    </th>
                    <th colspan={2} rowSpan={1}>
                      <span className="sub-title">Guard Face</span>
                    </th>
                    <th colspan={8} rowSpan={1}>
                      <span className="sub-title" style={{ marginRight: "25px" }}>
                        <Icon style={{ color: "red" }} size={20} icon={checkmark} /> - within standards
                      </span>
                      <span className="sub-title">
                        <Icon size={20} icon={cross} /> - defective{" "}
                      </span>
                    </th>
                  </tr>
                  <tr>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Main Line Gauge Max.</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Main Line Gauge Min.</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Siding Gauge Max.</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Siding Gauge Min.</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Main Line</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Siding</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Mainline</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Siding</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Switch Stand </span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Switch Points</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Stock Rails</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Running Rails</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Frog</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Surface</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Alignment</span>
                    </th>
                    <th colspan={1} rowSpan={1}>
                      <span className="tilted-th">Other conditions</span>
                    </th>
                    <th colspan={8} rowSpan={1}>
                      <span className="title-small">Defect/Comments</span>
                    </th>
                    <th colspan={4} rowSpan={1}>
                      <span className="title-small">Date Repaired</span>
                    </th>
                    <th colspan={4} rowSpan={1}>
                      <span className="title-small">Maintainer Signature</span>
                    </th>
                  </tr>
                </thead>
                {Data}
                <tbody>{addEmptyColsIfNotEnough(Data, this.config.minRows)}</tbody>
              </table>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default MonthlyTurnoutInspectionForm;

function addEmptyColsIfNotEnough(mapArray, minRows) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;

  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr>{getCols(21)}</tr>;
      emptyRows.push(row);
    }
  }

  return emptyRows;
}
function getCols(num) {
  let cols = [];
  let span = [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 4, 4];
  for (let i = 0; i < num; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
