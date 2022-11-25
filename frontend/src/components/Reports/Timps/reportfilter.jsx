import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Container, Col, Row, Label, Button, FormGroup, Modal } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import { trackReportStyle } from "./style/index";
import "./style/style.css";
import InputDateField from "./inputdateField";
import FormFields from "../../../wigets/forms/formFields";
import { formFeildStyle } from "../../../wigets/forms/style/formFields";
//import DayPickerInput from "react-day-picker/DayPickerInput";
import { getLanguageLocal, languageService } from "Language/language.service";
//import MomentLocaleUtils from "react-day-picker/moment";
import ReportSelection from "./reportSelection.jsx";
import { CRUDFunction } from "../../../reduxCURD/container";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
import moment from "moment";
import _ from "lodash";
import SvgIcon from "react-icons-kit";
import { arrowLeft } from "react-icons-kit/icomoon/arrowLeft";
import { printer } from "react-icons-kit/icomoon/printer";

import { getCurrentReportStateFilters, TEMPLATE_REPORT_FILTERS } from "./HelperFunctions/stateRetentionManagement";
import ReportFilterMenu from "./reportFilterMenu";
// import SwitchReport from "../Switch/switchReport";
// import TrackDisturbanceReport from "./trackDisturbanceReport";
// import AssetTypesSelection from "../sims/AssetTypesSelection";
// import MultiReportPrint from "components/Reports/Track/multiReportPrint.jsx";
import { multiBorders } from "react-icons-kit/metrize/multiBorders";
//import DetailedSwitchInspection from "../Switch/DetailedSwitchInspectionSelection";
import MultiReport from "./MultiReport";
import FormRenderer from "./FormRenderer";
// const InputObj = {
//   location: "",
//   user: "",
// };
import { getUserSignature } from "../../../reduxRelated/actions/userActions";
import { filterInspecDefectCode, filterInspecAssetType, filterInspeDefectType } from "./HelperFunctions/reportFilterHelper";
import { assetTypesForIssues } from "../../../AssetTypeConfig/Reports/DefectReportConfig";
import { curdActions } from "../../../reduxCURD/actions";
const singatureReports = ["Asset Inspection Reports", "Detailed Switch Inspection"];

let defaultReportTypes = [
  // { name: "Track Report", title: "Track Inspection & Repair Report", active: true },
  { name: "Asset Inspection Reports", title: "Asset Inspection Reports", active: true, reportId: "1" }
];
class ReportFilter extends Component {
  constructor(props) {
    super(props);
    this.stateRetentionObj = getCurrentReportStateFilters(
      this.props[this.props.stateRetentionObjName] ? this.props[this.props.stateRetentionObjName] : this.props.reportSRFilter,
    );
    this.state = {
      //dateRange: { from: new Date(moment().startOf("day")), today: new Date(moment().startOf("day")), to: new Date(moment().endOf("day")) },
      //InputObj: { ...InputObj },
      priority_level: [{ val: 'All', text: "All" }, { val: '1', text: "Priority Level - I" }, { val: '2', text: "Priority Level - II" }, { val: '3', text: "Priority Level - III" }, { val: '4', text: "Priority Level - IV" }],
      locationOptions: [],
      userOptions: [],
      issueAssetTypeOptions: [],
      assetTypeOptions: [],
      defectCodeOptions: [],
      defectStatusOptions: [],
      assetStatus: [{ val: "All", text: "All" }, { val: "Missed", text: "Missed" }, { val: "Finished", text: "Finished" }],
      selectedAsset: null,
      //showReport: false,
      reportId: null,
      assets: [],
      allowPrint: true,
      multiReport: false,
      isMulti: false,
      correspondingWp:null,
      //InspectionReportType: "Original",
      //reportName: "Asset Inspection Reports",
      // reportTitle: "Line Inspection & Repair Report",
      selectedInspections: [],
      inspectionsReport: [],
      ...this.stateRetentionObj,
      reportTypes: _.cloneDeep(defaultReportTypes),
    };
    //this.reportTypes = _.cloneDeep(defaultReportTypes);
    this.changeHandler = this.changeHandler.bind(this);
    this.updateDateRange = this.updateDateRange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.printReport = this.printReport.bind(this);
    this.handelTabsClick = this.handelTabsClick.bind(this);
    this.getInspectionsFromServer = this.getInspectionsFromServer.bind(this);
    this.handleReportPrint = this.handleReportPrint.bind(this);
    this.handleReportPrintOff = this.handleReportPrintOff.bind(this);
    this.handleUpdateFilterState = this.handleUpdateFilterState.bind(this);
    this.getMultiReport = this.getMultiReport.bind(this);
  }
  handleUpdateFilterState(propertiesToUpdate) {
    let stateRetentionObj = this.props.stateRetentionObjName
      ? this.props[this.props.stateRetentionObjName]
      : this.props.reportSRFilter
        ? this.props.reportSRFilter
        : {};

    this.props.updateFilterState(this.props.stateRetentionObjName ? this.props.stateRetentionObjName : "reportSRFilter", {
      ...stateRetentionObj,
      ...propertiesToUpdate,
    });
  }
  handleReportPrint() {
    this.setState({ allowPrint: true });
  }
  handleReportPrintOff() {
    this.setState({ allowPrint: false });
  }
  handelTabsClick(tabName) {
    let reportTitle = "";
    this.state.reportTypes.map((type, i) => {
      if (type.name == tabName) return (this.state.reportTypes[i].active = true), (reportTitle = this.state.reportTypes[i].title);
      else this.state.reportTypes[i].active = false;
    });

    this.setState({
      reportTitle,
      reportName: tabName,
      assets: [],
      locationOptions: [],
      userOptions: [],
      defectCodeOptions: [],
      defectStatusOptions: [],
      issueAssetTypeOptions: [],
      assetTypeOptions: [],
      assetStatus: [],
      InputObj: { ...this.state.InputObj },
    });
    this.handleUpdateFilterState({
      reportName: tabName,
      InputObj: { ...this.state.InputObj },
    });
    this.getRangeDataFromServer(this.state.dateRange);
  }
  changeHandler(e, blur) {
    let InputObj = { ...this.state.InputObj };
    InputObj[e.target.name] = e.target.value;
    let assets = [...this.state.assets];
    assets = this.filterByVals(InputObj);
    this.setState({
      InputObj: InputObj,
      assets: assets,
      selectedInspections: assets,
    });
    this.handleUpdateFilterState({
      InputObj: InputObj,
    });
  }

  filterByVals(InputObj) {
    let user = InputObj.user;
    let location = InputObj.location;
    let assetName = InputObj.asset_name;
    // let type = InputObj.assetType;
    let assetStatus = InputObj.assetStatus;

    let inspections = this.state.allReports;

    inspections = _.filter(inspections, (inspec) => {
      let userCheck = user == "All" ? true : false;
      let locationCheck = location == "All" ? true : false;
      //let assetTypeCheck = type == "All" ? true : false;
      // let assetNameCheck = assetName == "" || !assetName ? true : false;
      let statusCheck = assetStatus == "All" || !assetStatus ? true : false;

      !statusCheck && (statusCheck = inspec.status == assetStatus)
      //  !assetTypeCheck && (assetTypeCheck = this.assetTypeBaseDataFiltering(inspec, type));
      //  !assetNameCheck && (assetNameCheck = this.assetNameBaseDataFiltering(inspec, assetName));
      !userCheck && (userCheck = inspec.user.id == user);
      !locationCheck && (locationCheck = inspec.lineId == location);

      return userCheck && locationCheck && statusCheck;
    });
    return inspections;
  }


  assetNameBaseDataFiltering(inspec, assetName) {
    if (inspec && assetName) {
      return (inspec.tasks.length >= 0 ?
        inspec.tasks[0].units && inspec.tasks[0].units.length >= 0 ?
          inspec.tasks[0].units.find(({ unitId }) => unitId == assetName)
          : ""
        : "")
    }
  }
  // filterByVals(InputObj) {

  //   let user = InputObj.user;
  //   let location = InputObj.location;
  //   let assetName = InputObj.assetName;
  //   let defectCode = InputObj.defectCode;
  //   let assetType = InputObj.assetType;
  //   let defectStatus = InputObj.defectStatus;

  //   let inspections = this.state.allReports;
  //   console.log(inspections);
  //   inspections = _.filter(inspections, (inspec) => {
  //     let userCheck = user == "All" ? true : false;
  //     let locationCheck = location == "All" ? true : false;
  //     let checkForAdditionalFilter = true;
  //     !userCheck && (userCheck = inspec.user.id == user);
  //     !locationCheck && (locationCheck = inspec.lineId == location);
  //     if (checkIfAdditionalFilter(this.state.reportName)) {
  //       let defectCodeCheck = defectCode == "All" ? true : false;
  //       let assetTypeCheck = assetType == "All" ? true : false;
  //       let defectStatusCheck = defectStatus == "All" ? true : false;
  //       !defectCodeCheck && (defectCodeCheck = filterInspecDefectCode(inspec, defectCode));
  //       !assetTypeCheck && (assetTypeCheck = filterInspecAssetType(inspec, assetType));
  //       !defectStatusCheck && (defectStatusCheck = filterInspeDefectType(inspec, defectStatus));
  //       checkForAdditionalFilter = assetTypeCheck && defectCodeCheck && defectStatusCheck;
  //     }

  //     return userCheck && locationCheck && checkForAdditionalFilter;
  //     //&& defectCodeCheck, assetTypeCheck;
  //   });
  //   return inspections;
  // }
  updateDateRange(dateRange) {
    this.setState({
      dateRange: dateRange,
    });
    this.handleUpdateFilterState({
      dateRange: dateRange,
    });
    this.getRangeDataFromServer(dateRange);
  }
  setValuesForAssetType() {
    let assetTypes = this.props.assets ? this.props.assets.assetsTypes.filter(({ location }) => location == false) : [];
    let values = [];
    if (assetTypes) {
      assetTypes.forEach((type) => {
        let option = { val: type.assetType, text: type.assetType };
        values.push(option);
      })
    }
    values.unshift({ val: "All", text: "All" });
    return values;
  }
  componentDidMount() {
    let activeReport = this.updateReportTypes();
    this.getRangeDataFromServer(this.state.dateRange, activeReport);
    //this.updateReportFilter();
    let assetTypes = this.setValuesForAssetType();
    this.state.showReport = false
    this.setState({ assetTypeOptions: assetTypes, reportTitle: "Asset Inspection Reports" });
    this.handleUpdateFilterState({
      dateRange: this.state.dateRange,
      ...activeReport,
      InputObj: { ...this.state.InputObj },
    });

    if (this.state.showReport === true) {
      this.getInspectionsFromServer([this.state.inspec]);
    }
    this.props.getApplicationlookups("config/reportStartRange");
  }
  updateReportTypes() {
    let defaultActiveReportState = {};
    let aList = this.props.assets;
    let reportTypes = defaultReportTypes.filter((rt) => {
      return !!aList.assetsList.find((r) => {
        if (this.props.defaultActive) {
          if (this.props.defaultActive === rt.name) {
            rt.active = true;
            defaultActiveReportState = {
              assetName: rt.name,
              assetTitle: rt.title,
              assetId: rt.reportId,
            };
          } else rt.active = false;
        }

        return r === rt.name;
      });
    });
    this.setState({ reportTypes: reportTypes, ...defaultActiveReportState });
    return defaultActiveReportState;
  }
  getMultiReport(type) {
    this.getInspectionsFromServer(this.state.selectedInspections);
    this.handleUpdateFilterState({
      InspectionReportType: type,
    });
    this.setState({ isMulti: true, InspectionReportType: type });
  }
  printReport() {
    if (this.state.isMulti) {
      document.title = languageService(this.state.reportTitle) + " Combined";
      window.print();
    } else {
      document.title = languageService(this.state.reportTitle);
      window.print();
    }
    // if (
    //   document.title === languageService(this.state.reportTitle)
    // )
    // window.print();
    document.title = "TIMPS";
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType == "REPORTFILTER_READ_SUCCESS" && this.props.actionType !== prevProps.actionType && this.props.reportFilter) {
      let multiOption = false;
      if (this.props.reportFilter.length > 0) {
        let check = this.props.reportFilter.filter((item) => {
          return item.status == "Finished";
        });
        if (check.length > 0) {
          multiOption = true;
        } else {
          multiOption = false;
        }
      }
      this.loadReportsData(this.props.list);
      let multi = this.props.reportFilter && (multiOption ? true : false);
      this.setState({ multiReport: multi, allReports: this.props.list });
    }
    if (
      this.props.actionType == "REPORTFILTER_CREATE_SUCCESS" &&
      this.props.actionType !== prevProps.actionType &&
      this.props.reportFilter
    ) {
      this.getUserSignaturesForInspections(this.props.reportFilter);
      this.setState({ inspectionsReport: this.props.reportFilter, showReport: true });
      this.handleUpdateFilterState({
        showReport: true,
      });
    }
    if (this.props.userActionType !== prevProps.userActionType && this.props.userActionType === "GET_USERS_SIGNATURE_SUCCESS") {
      this.fillSignatureImageWithUserObj(this.props.usersSignatures);
    }
    if (this.props.list.length !== prevProps.list.length) {
      this.updateReportTypes();
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType === "APPLICATIONLOOKUPS_READ_SUCCESS"
    ) {
      if (!this.state.reportMinStartDate) {
        this.setState({
          reportMinStartDate: this.props.applicationlookups && this.props.applicationlookups[0] && this.props.applicationlookups[0].opt2,
        });
      }
    }
  }
  handleBack() {
    this.setState({
      reportId: null,
      showReport: false,
      isMulti: false,
      allowPrint: true,
    });
    this.handleUpdateFilterState({
      showReport: false,
    });
  }
  handleClick(inspec, wPlan, type) {
    this.getInspectionsFromServer([inspec]);
    this.handleUpdateFilterState({
      inspec: inspec,
      InspectionReportType: type,
    });
    this.setState({ selectedAsset: inspec, correspondingWp:wPlan, InspectionReportType: type });
  }
  getLocationName(assetsList, line) {
    if (assetsList && assetsList.length > 0) {
      let region = assetsList.find(({ _id }) => _id === line);
      if (region) {
        return region.unitId;
      }
    }
  }
   loadReportsData(assets) {
    let locationOptions = [];
    let userOptions = [];
    let defectCodeOptions = [];
    let issueAssetTypeOptions = [];
    let assetTypeOptions = [];
    let defectStatusOptions = [];
    let addtionalCheck = checkIfAdditionalFilter(this.state.reportName);
    if (_.isArray(assets)) {
      locationOptions.push({ val: "All", text: "All" });
      userOptions.push({ val: "All", text: "All" });
      assetTypeOptions.push({ val: "All", text: "All" });
      if (addtionalCheck) {
        defectCodeOptions.push({ val: "All", text: "All" });
        issueAssetTypeOptions.push({ val: "All", text: "All" });
        assets.length > 0
          ? (defectStatusOptions = [
            { val: "All", text: "All" },
            { val: "Open", text: "Open" },
            { val: "Closed", text: "Closed" },
          ])
          : (defectStatusOptions = [{ val: "All", text: "All" }]);
      }
      assets.forEach((asset) => {
        let locFilled = _.find(locationOptions, { val: asset.lineId });
        let userFilled = _.find(userOptions, { val: asset.user.id });
        if (!locFilled) locationOptions.push({ val: asset.lineId, text: this.getLocationName(this.props.assets.assetsList, asset.lineId) });
        if (!userFilled) userOptions.push({ val: asset.user.id, text: asset.user.name });
      });
      defectCodeOptions.length > 0 &&
        (defectCodeOptions = _.uniqBy(defectCodeOptions, (item) => {
          return item.val;
        }));
      issueAssetTypeOptions.length > 0 &&
        (issueAssetTypeOptions = _.uniqBy(issueAssetTypeOptions, (item) => {
          return item.val;
        }));
      assets = assets.sort((a, b) => {
        const a1 = new Date(a.date).getTime();
        const b1 = new Date(b.date).getTime();
        if (a1 < b1) return 1;
        else if (a1 > b1) return -1;
        else return 0;
      });
      let addtional = {};
      if (addtionalCheck) {
        addtional = {
          defectCode: defectCodeOptions[0].val,
          assetType: issueAssetTypeOptions[0].val,
          defectStatus: defectStatusOptions[0].val,
        };
      }
      this.setState({
        locationOptions,
        userOptions,
        defectCodeOptions,
        issueAssetTypeOptions,
        defectStatusOptions,
        assets: assets,
        InputObj: {
          location: locationOptions[0].val,
          user: userOptions[0].val,
          assetType: assetTypeOptions[0].val,
          ...addtional,
        },
        selectedInspections: assets,
      });
      this.handleUpdateFilterState({
        InputObj: {
          location: locationOptions[0].val,
          user: userOptions[0].val,
          ...addtional,
        },
      });
    }
  }

  getRangeDataFromServer(range, activeReportPre) {
    var jsonArray = encodeURIComponent(JSON.stringify(range));
    let activeReport = activeReportPre ? activeReportPre : _.find(this.state.reportTypes, { active: true });
    let arg = "inspection/?dateRange=" + jsonArray;
    if (activeReport) {
      arg = arg + "&rId=" + activeReport.reportId;
    }
    this.props.getReportFilter(arg);
  }
  getInspectionsFromServer(inspections) {
    if (inspections.length > 0) {
      let inspecs = [];
      inspections.forEach((inspec, index) => {
        if (inspec && inspec.status == "Finished") {
          inspecs.push(inspec._id);
        }
      });
      this.props.createReportFilter(inspecs);
    }
  }
  getUserSignaturesForInspections(inspections) {
    let users = [];
    inspections.forEach((inspec) => {
      let existCheck = _.find(users, (email) => email == inspec.user.email);
      if (!existCheck) users.push(inspec.user.email);
      let issues = inspec.tasks && inspec.tasks[0] && inspec.tasks[0].issues;
      issues &&
        issues.forEach((issue) => {
          if (issue && issue.serverObject && issue.serverObject.repairedBy) {
            let mUserExist = _.find(users, (email) => email == issue.serverObject.repairedBy.email);
            !mUserExist && users.push(issue.serverObject.repairedBy.email);
          }
        });
    });

    let ulength = users.length;
    if (ulength) {
      let query = "?";
      users.forEach((email, index) => {
        let andToAdd = index == ulength - 1 ? "" : "&";
        query = query + "emails[]=" + email + andToAdd;
      });
      this.props.getUserSignature(query);
    }
  }
  fillSignatureImageWithUserObj(userSigs) {
    let inspections = [...this.state.inspectionsReport];
    inspections.forEach((inspec) => {
      inspec.sigs = userSigs;
      let foundUser = _.find(userSigs, { email: inspec.user.email });
      if (foundUser && foundUser.signature) {
        inspec.user = { ...inspec.user };
        inspec.user.signature = foundUser.signature.imgName;
      }
    });
    this.setState({
      inspectionsReport: inspections,
    });
  }

  render() {
    const { from, to } = this.state.dateRange;
    const modifiers = { start: from, end: to };

    return (
      <React.Fragment>
        {!this.state.showReport && (
          <div id="mainContent" style={{ marginLeft: "20px" }}>
            <Row style={{ marginRight: "0" }}>
              <Col md={10}>
                <ReportFilterMenu reports={this.state.reportTypes} handelTabsClick={this.handelTabsClick} />
              </Col>
              <Col md={2}>
                {this.state.multiReport && (
                  //       for Multi report
                  <span
                    style={{
                      cursor: "pointer",
                      textAlign: "right",
                      display: "block",
                      textAlign: "center",
                      margin: "10px 15px 0 0",
                      width: "fit-content",
                      float: "right",
                    }}
                    onClick={(e) => {
                      this.getMultiReport("All");
                    }}
                  >
                    <span
                      style={{ verticalAlign: "super", marginRight: "5px", fontSize: "12px", display: "block", whiteSpace: "break-spaces" }}
                    >
                      {languageService("Bulk Print \n All")}
                    </span>
                    <SvgIcon size={32} icon={multiBorders} />
                  </span>
                )}
                {this.state.multiReport && this.state.reportName === "Asset Inspection Reports" && (
                  //       for Multi report
                  <span
                    style={{
                      cursor: "pointer",
                      textAlign: "right",
                      display: "block",
                      textAlign: "center",
                      margin: "10px 15px 0 0",
                      width: "fit-content",
                      float: "right",
                    }}
                    onClick={(e) => {
                      this.getMultiReport("Original");
                    }}
                  >
                    <span
                      style={{ verticalAlign: "super", marginRight: "5px", fontSize: "12px", display: "block", whiteSpace: "break-spaces" }}
                    >
                      {languageService("Bulk Print \n Original")}
                    </span>
                    <SvgIcon size={32} icon={multiBorders} />
                  </span>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <h2 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none", fontSize: "22px", textAlign: "left", color: '#183D66' }}>
                  {languageService(this.state.reportTitle)}
                </h2>
                <hr />
              </Col>
            </Row>
            <div style={{ margin: '20px', background: 'white', padding: '10px' }}>
              <Row>
                <Col sm={4}>
                  <div style={{ display: 'grid' }}>
                    <label style={themeService(trackReportStyle.labelStyle)}>{languageService("Asset Name")}</label>
                    <span>
                      <InputField inputFieldProps={{ name: "asset_name", label: "Asset Name" }} changeHandler={this.changeHandler} value={this.state.InputObj.asset_name} />
                    </span>
                  </div>
                </Col>
                <Col sm={4}>
                  <div style={{ display: 'grid' }}>
                    <label style={themeService(trackReportStyle.labelStyle)}>{languageService("Select a Date Range")}</label>
                    <span style={themeService(trackReportStyle.dateStyle)}>
                      <InputDateField
                        disabledDays={this.state.reportMinStartDate ? { before: new Date(this.state.reportMinStartDate) } : null}
                        minReportDate={this.state.reportMinStartDate}
                        updateDateRange={this.updateDateRange}
                        defaultDate={this.state.dateRange}
                      />
                    </span>
                  </div>
                </Col>
                <Col sm={4}>
                  <div style={{ display: 'grid' }}>
                    <label style={themeService(trackReportStyle.labelStyle)}>{languageService("Priority Level")}</label>
                    <SelectField
                      inputFieldProps={{ name: "priority_level", label: "" }}
                      options={this.state.priority_level}
                      changeHandler={this.changeHandler}
                      value={this.state.InputObj.priority_level}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  {this.state.locationOptions && this.state.locationOptions.length > 0 && (
                    <div style={{ display: 'grid' }}>
                      <label style={themeService(trackReportStyle.labelStyle)}>{languageService("Location")}</label>
                      <SelectField
                        inputFieldProps={{ name: "location", label: "" }}
                        options={this.state.locationOptions}
                        changeHandler={this.changeHandler}
                        value={this.state.InputObj.location}
                      />
                    </div>
                  )}
                </Col>
                <Col sm={4}>
                  {this.state.assetStatus && this.state.assetStatus.length > 0 && (
                    <div style={{ display: 'grid' }}>
                      <label style={themeService(trackReportStyle.labelStyle)}>{languageService("Asset Status")}</label>
                      <SelectField
                        inputFieldProps={{ name: "assetStatus", label: "" }}
                        options={this.state.assetStatus}
                        changeHandler={this.changeHandler}
                        value={this.state.InputObj.assetStatus}
                      />
                    </div>
                  )}
                </Col>
                <Col sm={4}>
                  {this.state.userOptions && this.state.userOptions.length > 0 && (
                    <div style={{ display: 'grid' }}>
                      <label style={themeService(trackReportStyle.labelStyle)}>{languageService("User")}</label>
                      <SelectField
                        inputFieldProps={{ name: "user", label: "" }}
                        options={this.state.userOptions}
                        changeHandler={this.changeHandler}
                        value={this.state.InputObj.user}
                      />
                    </div>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  {
                    <React.Fragment>
                      {this.state.assetTypeOptions.length > 0 && (
                        <div style={{ display: 'grid' }}>
                          <label style={themeService(trackReportStyle.labelStyle)}>{languageService("Asset Type")}</label>
                          <SelectField
                            inputFieldProps={{ name: "assetType", label: "" }}
                            options={this.state.assetTypeOptions}
                            changeHandler={this.changeHandler}
                            value={this.state.InputObj.assetType}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  }
                </Col>
              </Row>
            </div>
            <ReportSelection
              InputObj={this.state.InputObj}
              wpPlanFilter={this.state.assets}
              assets={this.props.assets}
              handleClick={this.handleClick}
              reportName={this.state.reportName}
            />
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
              {/*this.state.allowPrint && (
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
                )*/}
            </div>
            <div id="mainContent">
              {
                <FormRenderer selectedAsset={this.state.selectedAsset} correspondingWp={this.state.correspondingWp} list={this.props.list} appLookUps={this.props.lookUps} />
              }
              {/*<MultiReport
                reportName={this.state.reportName}
                handleBack={this.handleBack}
                reportInspections={this.state.inspectionsReport}
                printbuttonhandler={{ show: this.handleReportPrint, hide: this.handleReportPrintOff }}
                isMulti={this.state.isMulti}
                InspectionReportType={this.state.InspectionReportType}
                usersSignatures={this.props.usersSignatures}
                nonFraCode={this.props.nonFraCode}
              />*/}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
let variables = {
  filterStateReducer: {
    reportSRFilter: null,
    safetyBriefingRetention: null,
  },
  userReducer: {
    usersSignatures: [],
  },
  applicationlookupsReducer: { applicationlookups: [] },
};
const getApplicationlookups = curdActions.getApplicationlookups;
let actionOptions = {
  create: true,
  update: false,
  read: true,
  delete: false,
  others: { updateFilterState, getUserSignature, getApplicationlookups },
};
let ReportFilterCRUD = CRUDFunction(
  ReportFilter,
  "reportFilter",
  actionOptions,
  variables,
  ["filterStateReducer", "userReducer", "applicationlookupsReducer"],
  "journeyPlan/report",
);
export default ReportFilterCRUD;
export const SelectField = (props) => {
  return (
    <div style={{ ...themeService(formFeildStyle.feildStyle), display: "inline-block", margin: "0" }}>
      {props.inputFieldProps.label && (
        <label style={{ ...themeService(formFeildStyle.lblStyle), width: "inherit", margin: "5px 5px 5px" }}>
          {languageService(props.inputFieldProps.label) + ":"}
        </label>
      )}
      <select
        style={{ ...themeService(formFeildStyle.inputStyle), width: "100%", border: '1px solid lightgrey' }}
        onChange={(e) => props.changeHandler(e, false, "select")}
        onBlur={(e) => props.changeHandler(e, true, "select")}
        {...props.inputFieldProps}
        value={props.value}
      >
        {props.options &&
          props.options.map((item, index) => (
            <option key={index} value={item.val}>
              {languageService(item.text)}
            </option>
          ))}
      </select>
    </div>
  );
};

export const InputField = (props) => {
  return (
    <div style={{ ...themeService(formFeildStyle.feildStyle), display: "block", margin: "0" }}>
      <input style={{ border: '1px solid lightgrey', borderRadius: '5px', width: "100%" }} type="text" onChange={(e) => props.changeHandler(e, false, "input")} value={props.value} name={props.inputFieldProps.name} />
    </div>
  );
};

function checkIfAdditionalFilter(reportName) {
  return reportName === "Asset Inspection Reports";
}
