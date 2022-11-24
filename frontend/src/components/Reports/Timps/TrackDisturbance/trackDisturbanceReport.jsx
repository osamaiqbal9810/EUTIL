import React, { Component } from "react";
import { trackReportStyle } from "../style/index";
import "../style/style.css";
import { getLanguageLocal, languageService } from "Language/language.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import _ from "lodash";
class TrackDisturbanceReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //  journeyPlan: {},
      basicData: {},
      staticMode: false,
    };
    this.calculateTableData = this.calculateTableData.bind(this);
  }
  componentDidMount() {
    this.calculateTableData(this.props.inspec);
  }

  calculateTableData(journeyPlan) {
    let task = journeyPlan && journeyPlan.tasks && journeyPlan.tasks.length > 0 && journeyPlan.tasks[0];
    if (task) {
      let trackDisturbanceForm = _.find(task.appForms, { name: "Track Disturbance Report" });
      if (trackDisturbanceForm) {
        let basicData = {};
        trackDisturbanceForm.form.forEach((item, i) => {
          if (item) {
            basicData = { ...basicData, [item.id]: item.value };
          }
        });
        console.log(basicData);
        this.setState({ basicData, staticMode: true });
      }
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="table-report disturbance-report" style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}>
          <Row>
            <Col md={12}>
              <h2 style={{ ...themeService(trackReportStyle.headingStyle), transform: "translateX(-21px)" }}>
                {"Track Disturbance Report"}
              </h2>
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 10, offset: 1 }}>
              <label>{"Date of Disturbance:"}</label>
              <span style={{ width: "30%" }}>{this.state.basicData.dodisturbance}</span>
              <label>{"Railroad Name:"}</label>
              <span style={{ minWidth: "20%" }}>{this.state.basicData.railname}</span>
            </Col>
            <Col md={{ size: 10, offset: 1 }}>
              <label>{"Track Name:"}</label>
              <span style={{ width: "75%" }}>{this.state.basicData.trackname}</span>
            </Col>
            <Col md={{ size: 10, offset: 1 }}>
              <label>{"Location:from MP"}</label>
              <span style={{ width: "35%" }}>{this.state.basicData.locationrange1}</span>
              <label>{"to MP:"}</label>
              <span style={{ width: "38%" }}>{this.state.basicData.locationrange2}</span>
            </Col>
            <Col md={{ size: 10, offset: 1 }}>
              <label>{"Alignment:(T/C)"}</label>
              <span style={{ width: "35%" }}>{this.state.basicData.alignment1}</span>
              <label>{"Degree of Curve"}</label>
              <span style={{ width: "32%" }}>{this.state.basicData.alignment2}</span>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
              <label>{"Side of Rail(facing ascending milepost)(L,R,B)"}</label>
              <span style={{ minWidth: "40%" }}>{this.state.basicData.alignment3}</span>
            </Col>
            <Col md={{ size: 10, offset: 2 }}>
              <label>{"Temperature:Ambient"}</label>
              <span style={{ width: "15%" }}>{this.state.basicData.temperature1}</span>
              <label>{"Rail"}</label>
              <span style={{ width: "15%" }}>{this.state.basicData.temperature2}</span>
              <label>{"Desired Rail Neutral"}</label>
              <span style={{ width: "20%" }}>{this.state.basicData.temperature3}</span>
            </Col>
            <Col md={{ size: 10, offset: 1 }}>
              <label>{"Type of Disturbance:"}</label>
              <span style={{ width: "10%", borderColor: "transparent" }}></span>
              <label>{"Rail Layed (fill out Rail Laying Report)"}</label>
              <span style={{ minWidth: "20%" }}>{this.state.basicData.todisturbance}</span>
            </Col>
            <Col md={{ size: 9, offset: 3 }}>
              <label>{"Rail plug Installed :(Gap produced by rail pullback)"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.railplug}</span>
            </Col>
            <Col md={{ size: 8, offset: 4 }}>
              <label>{"Reference Mark Length before:"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.refrencemlb1}</span>
            </Col>
            <Col md={{ size: 8, offset: 4 }}>
              <label>{"Reference Mark Length after:"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.refrencemla1}</span>
            </Col>
            <Col md={{ size: 8, offset: 4 }}>
              <label>{"Welds Made (Y/N) (how many)"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.weldsmade}</span>
            </Col>
            <Col md={{ size: 9, offset: 3 }}>
              <label>{"Welds Made (rail separation)(Gap produces by pullback):"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.weldsmade1}</span>
            </Col>
            <Col md={{ size: 8, offset: 4 }}>
              <label>{"Reference Mark Length before:"}</label>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.refrencemlb2}</span>
            </Col>
            <Col md={{ size: 8, offset: 4 }}>
              <label>{"Reference Mark Length after:"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.refrencemla2}</span>
            </Col>
            <Col md={{ size: 8, offset: 3 }}>
              <label>{"Turnout Installed:"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.turnoutinstalled}</span>
            </Col>
            <Col md={{ size: 8, offset: 3 }}>
              <label>{"Track Panel Installed:"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.trackpanelinstalled}</span>
            </Col>
            <Col md={{ size: 8, offset: 3 }}>
              <label>{"Ties Installed:"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.tiesinstalled}</span>
            </Col>
            <Col md={{ size: 8, offset: 3 }}>
              <label>{"Surfacing out-of-face or spot surfacing:"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.surfaceoof}</span>
            </Col>
            <Col md={{ size: 8, offset: 3 }}>
              <label>{"Track cribbed, undercut, washout"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.trackcribbed}</span>
            </Col>
            <Col md={{ size: 8, offset: 3 }}>
              <label>{"Track Buckle:"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.trackbuckle}</span>
            </Col>
            <Col md={{ size: 8, offset: 3 }}>
              <label>{"Pull-apart:"}</label>
              <em></em>
              <span style={{ minWidth: "30%" }}>{this.state.basicData.pullapart}</span>
            </Col>
            <Col md={{ size: 6, offset: 3 }}>
              <label>{"Other:(describe)"}</label>
              <span style={{ minWidth: "55%" }}>{this.state.basicData.otherdescribe}</span>
            </Col>
            <Col md={12}>
              <label>{"Disturbance Corrected:"}</label>
              <span style={{ MinWidth: "20%", borderColor: "transparent" }}>{this.state.basicData.disturbancecorrected}</span>
            </Col>
            <Col md={12}>
              <label>{"Adjusted Rail:Date"}</label>
              <span style={{ width: "20%" }}>{this.state.basicData.adjustedrail}</span>
              <label>{"Rail Temperature"}</label>
              <span style={{ width: "20%" }}>{this.state.basicData.railtemperature}</span>
              <label>{"Adjust RNT"}</label>
              <span style={{ width: "20%" }}>{this.state.basicData.adjustedrnt}</span>
            </Col>
            <Col md={12}>
              <label>{"Reference mark distance:Before"}</label>
              <span style={{ width: "16%" }}>{this.state.basicData.rmdbefore}</span>
              <label>{"After"}</label>
              <span style={{ width: "20%" }}>{this.state.basicData.rmdafter}</span>
              <label>{"Rail Temperature"}</label>
              <span style={{ width: "16%" }}>{this.state.basicData.rmdrailtemorature}</span>
            </Col>
            <Col md={12}>
              <label>{"Ballast Restored:Date"}</label>
              <span style={{ width: "40%" }}>{this.state.basicData.ballastrestored}</span>
            </Col>
            <Col md={12}>
              <label>{"Blast Compacted: Mechanical"}</label>
              <span style={{ width: "25%" }}>{this.state.basicData.ballastcompacted}</span>
              <em></em>
              <label>{"Time and Tonnage"}</label>
              <span style={{ width: "30%" }}>{this.state.basicData.timetonnage}</span>
            </Col>
            <Col md={12}>
              <label>{"Alinement restored: Date"}</label>
              <span style={{ width: "18%" }}>{this.state.basicData.alignmentrestored}</span>
              <label>{"Stakes Monitored:"}</label>
              <span style={{ width: "15%" }}>{this.state.basicData.stakesmonitored}</span>
              <label>{"RNT Adjustment:"}</label>
              <span style={{ width: "15%" }}>{this.state.basicData.rntadjusted}</span>
            </Col>
            <Col md={12}>
              <label>{"Restored Anchor pattern to standard or added to prevent movement:"}</label>
              <span style={{ width: "45%" }}>{this.state.basicData.restoredapm}</span>
            </Col>
            <Col md={12}>
              <label>{"Other:"}</label>
              <span style={{ width: "85%" }}>{this.state.basicData.other}</span>
            </Col>
            <Col md={12}>
              <label>{"Speed Restriction place:(date and speed)"}</label>
              <span style={{ width: "20%" }}>{this.state.basicData.srpdatespeed}</span>
              <label>{"Speed Restriction removed:(date)"}</label>
              <span style={{ width: "20%" }}>{this.state.basicData.srrdate}</span>
            </Col>
            <Col md={12}>
              <label>{"Name:"}</label>
              <span style={{ width: "40%" }}>{this.state.basicData.name}</span>
              <em></em>
              <label>{"Date"}</label>
              <span style={{ width: "35%" }}>{this.state.basicData.date}</span>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
const getJourneyPlan = curdActions.getJourneyPlan;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    getJourneyPlan,
  },
};

let variableList = {
  journeyPlanReducer: { journeyPlan: "" },
};

const TrackDisturbanceReportContainer = CRUDFunction(TrackDisturbanceReport, "TrackDisturbanceReportTask", actionOptions, variableList, [
  "journeyPlanReducer",
]);
export default TrackDisturbanceReportContainer;
