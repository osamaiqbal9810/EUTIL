import React, { Component } from "react";
import { themeService } from "../../../theme/service/activeTheme.service";
import { Col } from "reactstrap";
import { CRUDFunction } from "reduxCURD/container";
// import { curdActions } from "reduxCURD/actions";
// import { switchReportStyle } from "./style/index";
// import { formFeildStyle } from "../../../wigets/forms/style/formFields";
import { languageService } from "Language/language.service";
import { getAssetTree } from "../../../reduxRelated/actions/assetHelperAction";
import moment from "moment";
import SvgIcon from "react-icons-kit";
import { arrowLeft } from "react-icons-kit/icomoon/arrowLeft";

import { printer } from "react-icons-kit/icomoon/printer";
import _ from "lodash";
import { SelectField } from "../Timps/reportfilter";
import { trackReportStyle } from "../Timps/style";
import InputDateField from "../Timps/inputdateField";
import ReportSelection from "./reportSelection";
import SpinnerLoader from "../../Common/SpinnerLoader";
import GI303Report from "./maintenance-303";
import GI305Report from "./maintenance-305a";
import GI303BatteryMaintenance from "./batteryMaintenance";
import GI303B12B24BatteryTestReports from "./batteryTestReportsB12&B24.jsx";
import SudNicmanReport from "./sudNicman";
import DefaultReport from "./Default/fRADefaultReport";
import { versionInfo } from "../../MainPage/VersionInfo";
import RelayTest from "./relayTest";
import InsulationResistance from "./insulationResistance";

import HighWayCrossing from "./highWayCrossingCombined/highWayCrossing";
import CrossingWarning from "./ontario/crossingWarning";
import DateRangeControl from "../../Common/DateRange/DateRangeControl";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
import { getCurrentReportStateFilters, TEMPLATE_REPORT_FILTERS } from "./HelperFunctions/stateRetentionManagement";
import FRACrossingReport from "./FRA_Crossing/FRA_CrossingReport";
import { calculateCombineSets } from "./CombineMethods/CombineMethods";
import SFRTA_MonthlySwitchTestsAndInspectionsReport from "../SFRTA/MonthlySwitchTestsAndInspectionsReport";
import SFRTA_QuarterlySwitchTestsAndInspectionsReport from "../SFRTA/QuarterlySwitchTestsAndInspectionsReport";
import SFRTA_LockingTestsAndInspectionsReport from "../SFRTA/LockingTestsAndInspectionsReport";
import SFRTA_BridgeTestsAndInspectionReport from "../SFRTA/BridgeTestsAndInspectionReport";

const defaultReportNames = {
  gi329f: "GI329",
  gi334f: "GI334",
  scp901f: "SCP901",
  scp902f: "SCP902",
  scp907f: "SCP907",
  gi329fa: "GI329a",
  gi329fb: "GI329b",
  gi329fc: "GI329c",
  gi329fd: "GI329d",
  gi313f: "GI313",
};
const InputObj = {
  location: "",
  assetType: "",
  test: "",
};
class testReportFilter extends Component {
  constructor(props) {
    super(props);
    this.reportSRFilter = getCurrentReportStateFilters(this.props.reportSRFilter);
    this.state = {
      assetTypeOptions: [],
      locationOptions: [],
      testsOptions: [],
      selectedAsset: "",
      selectedAssetId: null,
      assetTestEntries: [],
      showReport: false,
      dateRange: {
        from: new Date(moment().startOf("month")),
        today: new Date(moment().startOf("day")),
        to: new Date(moment().endOf("month")),
      },
      InputObj: { ...InputObj },
      reports: [],
      reportDetailData: [],
      reportCode: "",
      spinnerLoading: false,
      testSchedules: [],

      ...this.reportSRFilter,
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.updateDateRange = this.updateDateRange.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.printReport = this.printReport.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.isApp = this.isApp.bind(this);
    this.renderReportDisplay = this.renderReportDisplay.bind(this);
    this.handleUpdateFilterState = this.handleUpdateFilterState.bind(this);
  }
  handleUpdateFilterState(propertiesToUpdate) {
    let reportSRFilter = this.props.reportSRFilter ? this.props.reportSRFilter : {};

    this.props.updateFilterState("reportSRFilter", {
      ...reportSRFilter,
      ...propertiesToUpdate,
    });
  }
  isApp = () => localStorage.getItem("source");
  getRangeDataFromServer(range, additionalQuery) {
    var jsonArray = encodeURIComponent(JSON.stringify(range));
    let arg = "?dateRange=" + jsonArray + (additionalQuery ? additionalQuery : "");
    this.props.getTestSchedules("/getReportFilter" + arg);
  }
  changeHandler(e, blur) {
    let InputObj = { ...this.state.InputObj };
    InputObj[e.target.name] = e.target.value;
    let assetReports = [];
    if (e.target.name == "assetType") {
      assetReports = this.filterByVals(e.target.value, this.state.InputObj.location, this.state.InputObj.test);
    }
    if (e.target.name == "location") {
      assetReports = this.filterByVals(this.state.InputObj.assetType, e.target.value, this.state.InputObj.test);
    }
    if (e.target.name == "test") {
      assetReports = this.filterByVals(this.state.InputObj.assetType, this.state.InputObj.location, e.target.value);
    }

    this.setState({
      InputObj: InputObj,
      reports: assetReports,
    });
  }

  filterByVals(assetType, location, test) {
    let assetReports = [...this.state.testSchedules];
    assetReports = _.filter(assetReports, (testSch) => {
      // default to true if all
      let aTypeCheck = assetType == "All" ? true : false;
      let locationCheck = location == "All" ? true : false;
      let testCheck = test == "All" ? true : false;
      // check if not true by default then calculate its validity
      !aTypeCheck && (aTypeCheck = testSch.assetType == assetType);
      !locationCheck && (locationCheck = testSch.lineId == location);
      !testCheck && (testCheck = testSch.testCode == test);
      return aTypeCheck && locationCheck && testCheck;
    });
    return assetReports;
  }
  updateDateRange(dateRange, stateRange) {
    this.setState({
      dateRange: dateRange,
      ...stateRange,
    });
    this.handleUpdateFilterState({
      dateRange: dateRange,
    });
    this.getRangeDataFromServer(dateRange);
  }

  componentDidMount() {
    this.state.pRange && this.state.submit && this.getRangeDataFromServer(this.state.dateRange);
  }
  handleBack() {
    this.setState({
      showReport: false,
      selectedAsset: "",
      selectedAsset: null,
      reportDetailData: [],
    });
    // this.handleUpdateFilterState({
    //   showReport: false,
    //   selectedAsset: "",
    //   //reportDetailData: [],
    // });
  }
  printReport() {
    document.title = this.state.reportCode.toUpperCase();
    window.print();
    let timpsSignalApp = versionInfo.isSITE();
    //window.onafterprint = function (event) {
    document.title = timpsSignalApp ? "SITE" : "TIMPS";
    //};
  }

  checkCombinedStoredSet(combinedStoredSets, item) {
    let found = null;
    for (let sets of combinedStoredSets) {
      if (!found) found = _.find(sets, { id: item.id });
    }
    return found;
  }
  handleClick(item) {
    let additionalQuery = "&assetId=" + item.assetId + "&status=exec";
    let combineItemFound = this.checkCombinedStoredSet(this.state.combinedSets, item);
    let dateRange = this.state.dateRange;
    if (combineItemFound) {
      for (let code of combineItemFound.testCodes) {
        additionalQuery = additionalQuery + "&testCodes=" + code;
      }
    } else {
      additionalQuery = additionalQuery + "&testCode=" + item.testCode;
    }

    this.getRangeDataFromServer(dateRange, additionalQuery);
    this.setState({
      showReport: true,
      reportCode: item.testCode,
      selectedAsset: item.assetName,
      selectedAssetId: item.assetId,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType == "TESTSCHEDULES_READ_REQUEST" && this.props.actionType !== prevProps.actionType) {
      this.setState({
        spinnerLoading: true,
      });
    }
    if (this.props.actionType == "TESTSCHEDULES_READ_SUCCESS" && this.props.actionType !== prevProps.actionType && !this.state.showReport) {
      this.calculateFilterData(this.props.testSchedules);
    } else if (
      this.props.actionType == "TESTSCHEDULES_READ_SUCCESS" &&
      this.props.actionType !== prevProps.actionType &&
      this.state.showReport
    ) {
      this.setState({
        reportDetailData: _.cloneDeep(this.props.testSchedules),
        spinnerLoading: false,
      });
    }
    if (this.props.actionType == "TESTSCHEDULES_READ_FAILURE" && this.props.actionType !== prevProps.actionType) {
      this.setState({
        spinnerLoading: false,
      });
    }
  }
  calculateFilterData(testSchedulesData) {
    let locationOptions = [];
    let assetTypeOptions = [];
    let testsOptions = [];
    let combinedSets = calculateCombineSets(testSchedulesData);

    let testSchedules = combinedSets.remainingTestScheds;
    if (testSchedules && _.isArray(testSchedules)) {
      locationOptions.push({ val: "All", text: "All" });
      assetTypeOptions.push({ val: "All", text: "All" });
      testsOptions.push({ val: "All", text: "All" });
      testSchedules.forEach((test) => {
        checkFilledPush(test.lineId, locationOptions, test.lineName);
        checkFilledPush(test.assetType, assetTypeOptions);
        checkFilledPush(test.testCode, testsOptions, test.testDescription);
      });
      this.setState({
        locationOptions,
        assetTypeOptions,
        testsOptions,
        reports: _.cloneDeep(testSchedules),
        InputObj: {
          location: locationOptions[0].val,
          assetType: assetTypeOptions[0].val,
          test: testsOptions[0].val,
        },
        testSchedules: _.cloneDeep(testSchedules),
        spinnerLoading: false,
        combinedSets: combinedSets.combinedSet,
      });
    } else {
      this.setState({
        spinnerLoading: false,
      });
    }
  }
  renderReportDisplay(param) {
    return siteReportSelctor(param, this.state.reportDetailData, this.state.selectedAsset, this.state.selectedAssetId);
  }
  render() {
    //console.log(this.state.reportDetailData);
    const { from, to } = this.state.dateRange;
    const modifiers = { start: from, end: to };
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;

    return (
      <React.Fragment>
        {modelRendered}
        {!this.state.showReport && (
          <div id="mainContent" style={{ textAlign: "center" }}>
            <Col md={12}>
              <div
                id="mainContent"
                className={"commonform"}
                style={{ ...themeService(trackReportStyle.mainStyle), background: "transparent" }}
              >
                {
                  <React.Fragment>
                    <h2 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none", fontSize: "22px" }}>
                      {languageService("Fixed Assets Tests Reports")}
                    </h2>
                    <span>
                      <DateRangeControl
                        dateRangeChanged={this.updateDateRange}
                        handleUpdateFilterState={this.handleUpdateFilterState}
                        iPeriod={this.state.iPeriod}
                        year={this.state.year}
                        pRange={this.state.pRange}
                        submit={this.state.submit}
                      />
                    </span>
                    {/* <label style={themeService(trackReportStyle.labelStyle)}>{languageService("Select a Date Range")}</label>
                    <span style={themeService(trackReportStyle.dateStyle)}>
                      <InputDateField updateDateRange={this.updateDateRange} defaultDate={this.state.dateRange} />
                    </span> */}
                    {this.state.locationOptions && this.state.locationOptions.length > 0 && (
                      <SelectField
                        inputFieldProps={{ name: "location", label: "Location" }}
                        options={this.state.locationOptions}
                        changeHandler={this.changeHandler}
                        value={this.state.InputObj.location}
                      />
                    )}

                    {this.state.assetTypeOptions && this.state.assetTypeOptions.length > 0 && (
                      <SelectField
                        inputFieldProps={{ name: "assetType", label: "AssetType" }}
                        options={this.state.assetTypeOptions}
                        changeHandler={this.changeHandler}
                        value={this.state.InputObj.assetType}
                      />
                    )}
                    {this.state.testsOptions && this.state.testsOptions.length > 0 && (
                      <SelectField
                        inputFieldProps={{ name: "test", label: "Tests" }}
                        options={this.state.testsOptions}
                        changeHandler={this.changeHandler}
                        value={this.state.InputObj.test}
                      />
                    )}
                  </React.Fragment>
                }
              </div>
            </Col>
            <ReportSelection reports={this.state.reports} handleClick={this.handleClick} />
          </div>
        )}

        {this.state.showReport && (
          <React.Fragment>
            <div className="report-controls" style={{ width: "100%", marginBottom: "60px", padding: "15px" }}>
              <div
                className="report-arrow"
                style={{ margin: "15px 15px 10px 0", cursor: "pointer", float: "left", textAlign: "center" }}
                onClick={(e) => {
                  this.handleBack();
                }}
              >
                <span style={{ verticalAlign: "super", marginLeft: "5px", fontSize: "12px", display: "block" }}>
                  {languageService("Reports Menu")}
                </span>
                <SvgIcon icon={arrowLeft} size={24} />
              </div>

              {!this.isApp() && (
                <div
                  className="report-print"
                  style={{ margin: "15px 0 0 15px", cursor: "pointer", float: "right", textAlign: "center" }}
                  onClick={(e) => {
                    this.printReport();
                  }}
                >
                  <span style={{ verticalAlign: "super", marginRight: "5px", fontSize: "12px", display: "block" }}>
                    {languageService("Print Report")}
                  </span>
                  <SvgIcon icon={printer} size={24} />
                </div>
              )}
            </div>
            {this.state.reportCode && this.renderReportDisplay(this.state.reportCode)}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

let variables = {
  filterStateReducer: {
    reportSRFilter: null,
  },
};

let actionOptions = {
  create: false,
  update: false,
  read: true,
  delete: false,
  others: { updateFilterState },
};
const testReportFilterContainer = CRUDFunction(testReportFilter, "testSchedule", actionOptions, variables, ["filterStateReducer"]);

export default testReportFilterContainer;

function checkFilledPush(field, existingArray, text, val) {
  let fieldFilled = _.find(existingArray, { val: field });
  if (!fieldFilled) {
    existingArray.push({ val: val ? val : field, text: text ? text : field });
  }
}

function siteReportSelctor(param, reportDetailData, selectedAsset, selectedAssetId) {
  const obj = {
    formFicheB12B24: <GI303B12B24BatteryTestReports reportData={reportDetailData} selectedAsset={selectedAsset} />,
    formGI303: <GI303BatteryMaintenance reportData={reportDetailData} selectedAsset={selectedAsset} />,
    formFicheB12: <GI303Report reportData={reportDetailData} selectedAsset={selectedAsset} />,
    formFicheB24: <GI305Report reportData={reportDetailData} selectedAsset={selectedAsset} />,
    suivimargingi335: <SudNicmanReport reportData={reportDetailData} selectedAsset={selectedAsset} />,
    relayTestForm: <RelayTest reportData={reportDetailData} selectedAsset={selectedAsset} />,
    insulationResistance: <InsulationResistance reportData={reportDetailData} selectedAsset={selectedAsset} />,
    CrossingHighwayReport: (
      <HighWayCrossing reportData={reportDetailData} selectedAsset={selectedAsset} selectedAssetId={selectedAssetId} />
    ),
    GradeCrossingWarningReport: (
      <CrossingWarning reportData={reportDetailData} selectedAsset={selectedAsset} selectedAssetId={selectedAssetId} />
    ),
    HighwayGradeCrossing: (
      <FRACrossingReport reportData={reportDetailData} selectedAsset={selectedAsset} selectedAssetId={selectedAssetId} />
    ),
    sfrtaSwitchMTests: <SFRTA_MonthlySwitchTestsAndInspectionsReport reportData={reportDetailData} selectedAsset={selectedAsset} selectedAssetId={selectedAssetId} />,
    sfrtaSwitchQTests: <SFRTA_QuarterlySwitchTestsAndInspectionsReport reportData={reportDetailData} selectedAsset={selectedAsset} selectedAssetId={selectedAssetId} />,
    sfrtaInterLockingTests: <SFRTA_LockingTestsAndInspectionsReport reportData={reportDetailData} selectedAsset={selectedAsset} selectedAssetId={selectedAssetId} />,
    sfrtaHotBoxDefectDetectorTests: "Hot Box Defect Detector Report",
    sfrtaBridgeLockingForm: <SFRTA_BridgeTestsAndInspectionReport />,
  };

  return obj[param] ? obj[param] : null;
}
