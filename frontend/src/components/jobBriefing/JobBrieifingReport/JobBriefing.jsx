import React, { Component } from "react";
import { trackReportStyle } from "../../Reports/Timps/style/index";
import "../../Reports/Timps/style/style.css";
import { getLanguageLocal, languageService } from "../../../Language/language.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { iconToShow, iconTwoShow } from "../../Reports/variables";
import _ from "lodash";
import { dataFormatters } from "../../../utils/dataFormatters";
import { tick_char } from "./special-char";

class JobBriefing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data ? props.data : {},
    };
  }

  render() {
    let { data } = this.state;
    return (
      <React.Fragment>
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: "@media print { @page {size: portrait !important}}",
          }}
        />
        <div
          className="table-report disturbance-report job-briefing"
          style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}
        >
          <Row>
            <Col md={2}>
              <img src={themeService(iconToShow)} alt="Logo" style={{ width: "100%" }} />
            </Col>
            <Col md={8}>
              <h2 style={{ ...themeService(trackReportStyle.headingStyle), transform: "translateX(-21px)" }}>{"Job Briefing Log"}</h2>
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 5, offset: 1 }}>
              <label>{"Date:"}</label>
              <span style={{ width: "40%", minWidth: "fit-content" }}>{dataFormatters.dateTimeFormatterWithoutSecs(data.date)}</span>
            </Col>
            <Col md={{ size: 6 }}></Col>
            <span className="spacer"></span>
            <Col md={{ size: 5, offset: 1 }}>
              <label>{"Work Location:"}</label>
              <span style={{ minWidth: "80%" }}>{data.loc}</span>
            </Col>

            <Col md={{ size: 5 }}>
              <label>{"RWIC/EIC:"}</label>
              <span style={{ width: "82%" }}>{data.rwic}</span>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 5, offset: 1 }}>
              <label>{"RWIC/EIC Phone No.:"}</label>
              <span style={{ width: "70%" }}>{data["p-rwic"]}</span>
            </Col>
            <Col md={{ size: 5 }}>
              <label style={{ marginRight: "15%" }}>{"Type of Track:"}</label>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data.tot === "Controlled" ? tick_char : ""}`}</span>
              <label>{"Controlled"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${
                data.tot === "Non-Controlled" ? tick_char : ""
              }`}</span>
              <label>{"Non-Controlled"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 5, offset: 1 }}>
              <label>{"Track Speed:"}</label>
              <span style={{ width: "80%" }}>{data.tr_speed}</span>
            </Col>
            <Col md={{ size: 5 }}>
              <label>{"Type of Protection:"}</label>
              <span style={{ width: "70%" }}>{data["tp-pro"]}</span>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <h6 style={{ fontWeight: "600" }} className="mini-title">
                {"Working Limits"}
              </h6>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Inaccessible Track:"}</label>
              <span style={{ width: "25%" }}>{data.inacc_tr}</span>
              <label>{"To"}</label>
              <span style={{ width: "25%" }}>{data.to}</span>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Authority Number:"}</label>
              <span style={{ width: "53%" }}>{data.au_no}</span>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Track Number(s):"}</label>
              <span style={{ width: "53.5%" }}>{data.tr_no}</span>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Track Limits:"}</label>
              <span style={{ width: "27%" }}>{data.tr_limit}</span>
              <label>{"To"}</label>
              <span style={{ width: "27%" }}>{data.to1}</span>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Time Limits:"}</label>
              <span style={{ width: "27%" }}>{data.time_limit}</span>
              <label>{"To"}</label>
              <span style={{ width: "27%" }}>{data.to2}</span>
            </Col>

            <Col md={{ size: 8, offset: 2 }}>
              <br />
              <label style={{ marginRight: "15%" }}>{"Adjacent Track Protection "}</label>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data["adj-prot"] === "Y" ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial" }}>{"Y"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${
                data["adj-prot"] === "N" ? tick_char : ""
              }`}</span>
              <label style={{ verticalAlign: "initial" }}>{"N"}</label>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Track Limits:"}</label>
              <span style={{ width: "27%" }}>{data.tr_limit1}</span>
              <label>{"To"}</label>
              <span style={{ width: "27%" }}>{data.to3}</span>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Time Limits:"}</label>
              <span style={{ width: "27%" }}>{data.time_limit1}</span>
              <label>{"To"}</label>
              <span style={{ width: "27%" }}>{data.to4}</span>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <h6 style={{ fontWeight: "600" }} className="mini-title">
                {"Train Approach Warning"}
              </h6>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Clearing Time:"}</label>
              <span style={{ width: "55%" }}>{data["t-time"]}</span>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Sight Distance:"}</label>
              <span style={{ width: "55%" }}>{data["t-dist"]}</span>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <h6 style={{ fontWeight: "600" }} className="mini-title">
                {"Individual Train Detection"}
              </h6>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Clearing Time:"}</label>
              <span style={{ width: "55%" }}>{data["i-time"]}</span>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Sight Distance:"}</label>
              <span style={{ width: "55%" }}>{data["i-dist"]}</span>
            </Col>
            <Col md={{ size: 10, offset: 1 }}>
              <h6 style={{ fontWeight: "600", margin: "20px 0" }} className="mini-title">
                {"Job/Task"}
              </h6>
            </Col>
            <Col md={{ size: 10, offset: 1 }} style={{ breakInside: "avoid" }}>
              <label style={{ verticalAlign: "top" }}>{"Explain:"}</label>
              <span style={{ width: "89.5%", minHeight: "50px", border: "2px solid #000", padding: "15px", display: "inline-block" }}>
                {data.explain}
              </span>
            </Col>
          </Row>
          <span className="spacer"></span>
          <Row className="page-break">
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }} style={{ breakInside: "avoid" }}>
              <label style={{ verticalAlign: "top", fontWeight: "600" }}>{"Notes:"}</label>
              <span style={{ width: "90%", minHeight: "50px", border: "2px solid #000", padding: "15px", display: "inline-block" }}>
                {data.note}
              </span>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }} style={{ breakInside: "avoid" }}>
              <label style={{ verticalAlign: "top", fontWeight: "600" }}>{"Rule of the Day:"}</label>
              <span
                className="page-break"
                style={{ width: "85%", minHeight: "50px", border: "2px solid #000", padding: "15px", display: "inline-block" }}
              >
                {data.rotd}
              </span>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
export default JobBriefing;
