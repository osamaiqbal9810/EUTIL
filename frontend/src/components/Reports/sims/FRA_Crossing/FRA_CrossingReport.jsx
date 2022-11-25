import React from "react";
import _ from "lodash";
import moment from "moment";
import RelayTestInspection from "./FRA_CrossingReport/relayTestInspection";
import InsulationTestInspection from "./FRA_CrossingReport/insulationTestsInspections";
import CrossingTestsInspections from "./FRA_CrossingReport/crossingTestsInspections";

export default class FRACrossingReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = { relayReports: [], insulationReports: [], gradeCrossingReports: [] };
  }
  componentDidMount() {
    this.calculateData(this.props.reportData);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.reportData !== prevProps.reportData && this.props.reportData) {
      this.calculateData(this.props.reportData);
    }
  }
  calculateData(reportData) {
    let relayReports = [];
    let insulationReports = [];
    let gradeCrossingReports = [];
    for (let testSched of reportData) {
      if (testSched.testCode === "FRA234_263And236_106") {
        this.ReportSet(testSched, relayReports);
      } else if (testSched.testCode === "FRA234_267And236_108") {
        this.ReportSet(testSched, insulationReports);
      } else {
        this.ReportSet(testSched, gradeCrossingReports);
      }
    }

    this.setState({
      relayReports,
      insulationReports,
      gradeCrossingReports,
    });
  }
  dateDayCompare(source, target) {
    return moment(source).isSame(target, "day");
  }
  ReportSet(testSched, reports) {
    let reportSet = reports.find(
      (rep) => testSched.user && rep.email === testSched.user.email && this.dateDayCompare(testSched.date, rep.date),
    );
    if (reportSet) {
      !reportSet.reports && (reportSet.reports = []);
      this.basicDataSet(testSched, reportSet.basicData);
      reportSet.reports.push(testSched);
    } else {
      let newReportSet = {
        date: testSched.date,
        email: testSched.user && testSched.user.email,
        reports: [testSched],
        basicData: {},
      };
      this.basicDataSet(testSched, newReportSet.basicData);
      reports.push(newReportSet);
    }
  }
  basicDataSet(testSched, basicDataObj) {
    !basicDataObj && (basicDataObj = {});
    !basicDataObj.location && (basicDataObj.lineName = testSched.lineName);
    !basicDataObj.mp && (basicDataObj.mp = testSched.assetMP);
    !basicDataObj.assetUnitId && (basicDataObj.assetUnitId = testSched.assetName);
    !basicDataObj.lineId && (basicDataObj.lineId = testSched.lineId);
    !basicDataObj.lineName && (basicDataObj.lineId = testSched.Name);
    !basicDataObj.date && (basicDataObj.date = testSched.date && moment(testSched.date).format("MM-DD-YYYY"));
    !basicDataObj.userName && (basicDataObj.userName = testSched.user && testSched.user.name);
    !basicDataObj.email && (basicDataObj.email = testSched.user && testSched.user.email);
  }
  render() {
    let relayReports =
      this.state.relayReports &&
      this.state.relayReports.map((reportSet) => {
        return (
          <RelayTestInspection
            key={reportSet.date + reportSet.email + "relay"}
            relaysData={reportSet.reports}
            basicData={reportSet.basicData}
            selectedAssetId={this.props.selectedAssetId}
          />
        );
      });
    let insulationReports =
      this.state.insulationReports &&
      this.state.insulationReports.map((reportSet) => {
        return (
          <InsulationTestInspection
            key={reportSet.date + reportSet.email + "insulation"}
            insulationData={reportSet.reports}
            basicData={reportSet.basicData}
            selectedAssetId={this.props.selectedAssetId}
          />
        );
      });
    let gradeCrossingReports =
      this.state.gradeCrossingReports &&
      this.state.gradeCrossingReports.map((reportSet) => {
        return (
          <CrossingTestsInspections
            key={reportSet.date + reportSet.email + "gradeCrossing"}
            gradeCrossingData={reportSet.reports}
            basicData={reportSet.basicData}
            selectedAssetId={this.props.selectedAssetId}
          />
        );
      });
    return (
      <React.Fragment>
        {gradeCrossingReports}
        {insulationReports}
        {relayReports}
      </React.Fragment>
    );
  }
}
