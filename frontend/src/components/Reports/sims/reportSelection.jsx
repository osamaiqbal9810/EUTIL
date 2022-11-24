import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import { ButtonActionsTable } from "components/Common/Buttons";
import { themeService } from "../../../theme/service/activeTheme.service";
import { trackReportStyle } from "../Timps/style/index";
import "../Timps/style/style.css";
import { languageService } from "Language/language.service";
import moment from "moment";
import { weather_star } from "react-icons-kit/linea/weather_star";
import { weather_mistyrain_fullmoon } from "react-icons-kit/linea/weather_mistyrain_fullmoon";
import Icon from "react-icons-kit";
class ReportSelection extends Component {
  render() {
    let rows =
      this.props.reports &&
      this.props.reports.length > 0 &&
      this.props.reports.map(report => {
        return (
          <tr key={report.id}>
            <td>{report.assetName}</td>
            <td>{report.testDescription}</td>
            <td>{report.title ? report.title.title : ""}</td>
            <td>{report.assetMP}</td>
            <td>
              <ButtonActionsTable
                handleClick={e => {
                  this.props.handleClick(report);
                }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("View")}
              />
            </td>
          </tr>
        );
      });
    return (
      <div
        id="mainContent"
        className="table-report switch-side-track report-selection"
        style={{ ...themeService(trackReportStyle.mainStyle), background: "transparent" }}
      >
        <Row>
          <Col md={1}></Col>
          <Col md={10}>
            <table className="table-selection">
              <thead>
                <tr>
                  <th data-field="assetName" style={{ width: "20px" }}>
                    {languageService("Asset")}
                  </th>
                  <th data-field="test" style={{ width: "20px" }}>
                    {languageService("Test")}
                  </th>
                  <th data-field="test" style={{ width: "20px" }}>
                    {languageService("Title")}
                  </th>
                  <th data-field="assetMP" style={{ width: "10px" }}>
                    {languageService("Location (milepost)")}
                  </th>
                  <th data-field="action" style={{ width: "10px" }}>
                    {languageService("Action")}
                  </th>
                </tr>
              </thead>
              <tbody style={{ background: "#fff", fontSize: "12px" }}>{rows}</tbody>
            </table>
          </Col>
          <Col md={1}></Col>
        </Row>
      </div>
    );
  }
}

export default ReportSelection;

function checkIcon(report) {
  let icon = null;
  if (report && report.reporttionTypeTag == "weather") {
    icon = <Icon size={18} icon={weather_mistyrain_fullmoon} />;
  } else if (report && report.reporttionTypeTag == "special") {
    icon = <Icon size={18} icon={weather_star} />;
  }
  // else {
  //   icon = <Icon size={18} icon={weather_star} />;
  // }
  return icon;
}
