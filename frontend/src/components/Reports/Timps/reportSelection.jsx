import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { ButtonActionsTable } from "components/Common/Buttons";
import { themeService } from "../../../theme/service/activeTheme.service";
import { trackReportStyle } from "./style/index";
import "./style/style.css";
import { languageService } from "Language/language.service";
import moment from "moment";
import { weather_star } from "react-icons-kit/linea/weather_star";
import { weather_mistyrain_fullmoon } from "react-icons-kit/linea/weather_mistyrain_fullmoon";
import Icon from "react-icons-kit";
class ReportSelection extends Component {
  render() {
    let rows =
      this.props.reportFilter &&
      this.props.reportFilter.length > 0 &&
      this.props.reportFilter.map((inspec) => {
        let icon = checkIcon(inspec);
        return (
          <tr key={inspec._id}>
            <td>
              <span style={{ verticalAlign: "inherit", marginRight: "5px", color: "rgb(27, 20, 100)" }}>{icon}</span>
              {inspec.title}
            </td>
            <td>{inspec.lineName}</td>
            <td>{languageService(inspec.status)}</td>
            <td>{moment(inspec.date).format("MM/DD/YYYY")}</td>
            <td>{inspec.user.name}</td>

            <td>
              {inspec.status !== "In Progress" && (
                <ButtonActionsTable
                  handleClick={(e) => {
                    this.props.handleClick(inspec);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("View")}
                />
              )}
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
        <div className="row">
          <Col md={1}></Col>
          <Col md={10}>
            <table className="table-selection">
              <thead>
                <tr>
                  <th data-field="title" style={{ width: "20px" }}>
                    {languageService("Inspection Name")}
                  </th>
                  <th data-field="location" style={{ width: "20px" }}>
                    {languageService("Location")}
                  </th>
                  <th data-field="action" style={{ width: "10px" }}>
                    {languageService("Status")}
                  </th>
                  <th data-field="date" style={{ width: "20px" }}>
                    {languageService("Date")}
                  </th>
                  <th data-field="user" style={{ width: "10px" }}>
                    {languageService("User")}
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
        </div>
      </div>
    );
  }
}

export default ReportSelection;

function checkIcon(inspec) {
  let icon = null;
  if (inspec && inspec.inspectionTypeTag == "weather") {
    icon = <Icon size={18} icon={weather_mistyrain_fullmoon} />;
  } else if (inspec && inspec.inspectionTypeTag == "special") {
    icon = <Icon size={18} icon={weather_star} />;
  }
  // else {
  //   icon = <Icon size={18} icon={weather_star} />;
  // }
  return icon;
}
