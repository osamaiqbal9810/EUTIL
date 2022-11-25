import React, { Component } from "react";
import { trackReportStyle } from "../../Reports/Timps/style/index";
import "../../Reports/Timps/style/style.css";
import { getLanguageLocal, languageService } from "../../../Language/language.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { tick_char } from "./special-char";
import { dataFormatters } from "../../../utils/dataFormatters";

import _ from "lodash";
class SafetyReminder extends Component {
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
        <div
          className="table-report disturbance-report job-briefing safety-reminders"
          style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}
        >
          <Row>
            <Col md={12}>
              <h2 style={{ ...themeService(trackReportStyle.headingStyle), transform: "translateX(-21px)", marginBottom: "40px" }}>
                {"Safety Reminders Checklist"}
              </h2>
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 10, offset: 1 }}>
              <label style={{ marginRight: "15%", minWidth: "250px" }}>{"Working near OTE:"}</label>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data["wneat"] === "Y" ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial" }}>{"Y"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${
                data["wneat"] === "N" ? tick_char : ""
              }`}</span>
              <label style={{ verticalAlign: "initial" }}>{"N"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <label style={{ marginRight: "15%", minWidth: "250px" }}>{"Adjacent Track Protection:"}</label>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data["atp"] === "Y" ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial" }}>{"Y"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${
                data["atp"] === "N" ? tick_char : ""
              }`}</span>
              <label style={{ verticalAlign: "initial" }}>{"N"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <label style={{ marginRight: "15%", minWidth: "250px" }}>{"Additional PPE:"}</label>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data["appe"] === "Y" ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial" }}>{"Y"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${
                data["appe"] === "N" ? tick_char : ""
              }`}</span>
              <label style={{ verticalAlign: "initial" }}>{"N"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <label style={{ marginRight: "15%", minWidth: "250px" }}>{"Tools & Equipment Inspected:"}</label>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data["tequip"] === "Y" ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial" }}>{"Y"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${
                data["tequip"] === "N" ? tick_char : ""
              }`}</span>
              <label style={{ verticalAlign: "initial" }}>{"N"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <label style={{ marginRight: "15%", minWidth: "250px" }}>{"Overhead Electrical Cables:"}</label>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data["overcab"] === "Y" ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial" }}>{"Y"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${
                data["overcab"] === "N" ? tick_char : ""
              }`}</span>
              <label style={{ verticalAlign: "initial" }}>{"N"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <label style={{ marginRight: "15%", minWidth: "250px" }}>{"Locates for Underground Utilities:"}</label>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data["locutil"] === "Y" ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial" }}>{"Y"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${
                data["locutil"] === "N" ? tick_char : ""
              }`}</span>
              <label style={{ verticalAlign: "initial" }}>{"N"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <label style={{ marginRight: "15%", minWidth: "250px" }}>{"First Aid Kit:"}</label>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data["aid"] === "Y" ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial" }}>{"Y"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${
                data["aid"] === "N" ? tick_char : ""
              }`}</span>
              <label style={{ verticalAlign: "initial" }}>{"N"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Location:"}</label>
              <span style={{ minWidth: "80%" }}>{data.loc1}</span>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <label style={{ marginRight: "15%", minWidth: "250px" }}>{"Emergency Action Plan:"}</label>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data["eplan"] === "Y" ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial" }}>{"Y"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${
                data["eplan"] === "N" ? tick_char : ""
              }`}</span>
              <label style={{ verticalAlign: "initial" }}>{"N"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Location:"}</label>
              <span style={{ minWidth: "80%" }}>{data.loc2}</span>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <label style={{ verticalAlign: "top", fontWeight: "600" }}>{"Hazards:"}</label>
              <span style={{ width: "73.5%", minHeight: "150px", border: "2px solid #000", padding: "15px" }}>{data.hazard}</span>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <h6 style={{ fontWeight: "600" }}>{"Fall Protection:"}</h6>
            </Col>
            <Col md={{ size: 10, offset: 1 }}>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data.arr ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial", minWidth: "10%" }}>{"Fall Arrest"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${data.rest ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial", minWidth: "10%" }}>{"Fall Restraint"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <span style={{ width: "50px", border: "2px solid #000" }}>{`${data.rplan ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial", minWidth: "10%" }}>{"Rescue Plan"}</label>
              <span style={{ width: "50px", border: "2px solid #000", marginLeft: "10%" }}>{`${data.loct ? tick_char : ""}`}</span>
              <label style={{ verticalAlign: "initial", minWidth: "10%" }}>{"Location"}</label>
            </Col>
            <span className="spacer"></span>
            <Col md={{ size: 10, offset: 1 }}>
              <label style={{ verticalAlign: "top", fontWeight: "600" }}>{"Notes:"}</label>
              <span style={{ width: "75%", minHeight: "200px", border: "2px solid #000", padding: "15px" }}>{data.note1}</span>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
export default SafetyReminder;
