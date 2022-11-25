import React, { Component } from "react";
import TIMPSReports from "./Timps/reportfilter";
import SCIMReports from "./sims/reportFilter";
import { CRUDFunction } from "../../reduxCURD/container";
//import { timpsSignalApp } from "../../config/config";
import { versionInfo } from "../MainPage/VersionInfo";
import eventBus from "../../utils/eventBus";
import _ from "lodash";
import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import { curdActions } from "../../reduxCURD/actions";
import "./Timps/report.css"
class ReportModule extends Component {
  constructor() {
    super();
    this.loadVersion(versionInfo, true);
    this.versionLoaded = this.versionLoaded.bind(this);
    this.vInfo = null;
    this.toggle = this.toggle.bind(this);
    this.state.activeTab = '1';
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  loadVersion(vInfo, initial = false) {
    let timpsSignalApp = vInfo.isSITE();
    let treportsFeature = vInfo.getFeatureset("timpsReports");
    let treprotsList = treportsFeature && treportsFeature.subset ? treportsFeature.subset : [];

    let sreportsFeature = vInfo.getFeatureset("siteReports");
    let sreprotsList = sreportsFeature && sreportsFeature.subset ? sreportsFeature.subset : [];
    let fraFeatureList = vInfo.getFeatureset("nonFRACodes");
    let nonFraCode = fraFeatureList && fraFeatureList.value ? true : false;

    if (initial) {
      this.state = {
        timpsSignalApp: timpsSignalApp,
        timpsReports: treprotsList,
        siteReports: sreprotsList,
        nonFraCode: nonFraCode,
      };
    } else {
      this.setState({
        timpsSignalApp: timpsSignalApp,
        timpsReports: treprotsList,
        siteReports: sreprotsList,
        nonFraCode: nonFraCode,
      });
    }
  }
  componentDidMount() {
    this.props.getWorkPlanTemplates();
    this.props.getAssets();
    this.props.getJourneyPlans();
   // this.props.assetsreports();
    this.props.getApplicationlookupss(["appForms"]);
    // let assetsList = assets ? assets.assetsList : null;
    // console.log(assets);
    eventBus.on("versionLoaded", this.versionLoaded);
  }
  componentDidUpdate() {
  }
  componentWillUnMount() {
    eventBus.remove("versionLoaded", this.versionLoaded);
  }
  versionLoaded(vInfo) {
    this.loadVersion(vInfo);
  }

  render() {
    let timpsSignalApp = this.state.timpsSignalApp;

    return (
      <React.Fragment>
        <Nav tabs style={{ margin: "40px 40px 0px" }}>
          <NavItem style={{ background: 'white', margin: '0px 2px' }}>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' }), this.state.activeTab == 1 ? 'navStyle1' : 'navStyle2'}
              onClick={() => { this.toggle('1'); }}
            >
              Asset Inspection Reports
            </NavLink>
          </NavItem>
          <NavItem style={{ background: 'white' }}>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' }), this.state.activeTab == 2 ? 'navStyle1' : 'navStyle2'}
              onClick={() => { this.toggle('2'); }}
            // style={{borderBottom: this.state.activeTab == '2' ? '3px solid #17a2b8': '1px solid white', color:"#183D66", fontSize:'13px',fontWeight:'bold' }}
            >
              Maintenance Reports
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                {!timpsSignalApp && this.props.workPlanTemplates && this.props.assets && this.props.assets.assetsTypes && this.props.journeyPlans.length >= 0 && (
                  <TIMPSReports list={this.props.journeyPlans} assets={this.props.assets} lookUps={this.props.applicationlookupss} defaultActive="Asset Inspection Reports" nonFraCode={this.state.nonFraCode} />
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">

              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </React.Fragment>
    );
  }
}
const getJourneyPlans = curdActions.getJourneyPlans;
const getWorkPlanTemplates = curdActions.getWorkPlanTemplates;
const getAssets = curdActions.getAssets;
const getApplicationlookupss = curdActions.getApplicationlookupss;
let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getJourneyPlans, getWorkPlanTemplates, getAssets, getApplicationlookupss},
};

let variableList = {
  journeyPlanReducer: { journeyPlans: "", journeyPlan: {} },
  workPlanTemplateReducer: { workPlanTemplates: [] },
  assetReducer: { assets: [] },
  applicationlookupsReducer: {
    applicationlookupss: [],
  }
};

let reducers = ["journeyPlanReducer", "workPlanTemplateReducer", "assetReducer", "applicationlookupsReducer"];

const template = CRUDFunction(ReportModule, "reports", actionOptions, variableList, reducers);
export default template;


