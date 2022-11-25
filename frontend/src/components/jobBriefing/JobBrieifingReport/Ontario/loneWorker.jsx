import React, { Component } from "react";
import { trackReportStyle } from "../../../Reports/Timps/style/index";
import "../../../Reports/Timps/style/style.css";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../../Reports/variables";
import _ from "lodash";
import { dataFormatters } from "../../../../utils/dataFormatters";
import { tick_char } from "../special-char";
import moment from "moment";
class LoneWorkerONR extends Component {
  constructor(props) {
    super(props);
    this.config = {
      minRows: 5,
    };

    this.state = {
      data: props.data ? props.data : {},
    };
  }

  render() {
    let { data } = this.state;

    return (
      <React.Fragment>
        <div
          className="table-report job-briefing-ontario safety-watch"
          style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}
        >
          <Row>
            <Col md={2}>
              <img src={themeService(iconToShow)} alt="Logo" style={{ width: "100%" }} />
            </Col>
            <Col md={3}></Col>
            <Col md={7}>
              <h2 style={{ ...themeService(trackReportStyle.headingStyle), textAlign: "right" }}>
                {"RAIL INFRASTRUCTURE"} <br /> {"JOB BRIEFING"}
              </h2>
            </Col>
          </Row>
          <hr />

          <table className="table-bordered lone-worker">
            <thead>
              <tr>
                <td colSpan={30} className="dark-bg"  style={{textAlign: 'center'}}>
                  <span className="main-heading-in-rpt">
                    LONE WORKER <small>(to be completed when applicable)</small>
                  </span>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={1}>1</td>
                <td colSpan={29}>
                  Name: <span style={{ fontWeight: 100 }}>{data.name}</span>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>2</td>
                <td colSpan={29}>
                  Date: <span style={{ fontWeight: 100 }}>{data.date ? moment(data.date).format("MM-DD-YYYY") : ""}</span>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>3</td>
                <td colSpan={29}>
                  Subdivision: <span style={{ fontWeight: 100 }}>{data.sub}</span>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>4</td>
                <td colSpan={29}>
                  Working Limits: <span style={{ fontWeight: 100 }}>{data.work}</span>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>5</td>
                <td colSpan={29}>
                  Time Limits: <span style={{ fontWeight: 100 }}>{data.time}</span>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>6</td>
                <td colSpan={29}>
                  RTC / Foreman / Supervisor Reviewed and Time: <span style={{ fontWeight: 100 }}>{data.rfsrt}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}
export default LoneWorkerONR;
