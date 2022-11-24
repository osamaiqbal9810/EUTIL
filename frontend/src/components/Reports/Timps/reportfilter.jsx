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
// import TrackReport from "./index";
// import DefectReport from "./DefectReport";
import { getCurrentReportStateFilters, TEMPLATE_REPORT_FILTERS } from "./HelperFunctions/stateRetentionManagement";
import ReportFilterMenu from "./reportFilterMenu";
// import SwitchReport from "../Switch/switchReport";
// import TrackDisturbanceReport from "./trackDisturbanceReport";
// import AssetTypesSelection from "../sims/AssetTypesSelection";
// import MultiReportPrint from "components/Reports/Track/multiReportPrint.jsx";
import { multiBorders } from "react-icons-kit/metrize/multiBorders";
//import DetailedSwitchInspection from "../Switch/DetailedSwitchInspectionSelection";
import MultiReport from "./MultiReport";
// const InputObj = {
//   location: "",
//   user: "",
// };
import { getUserSignature } from "../../../reduxRelated/actions/userActions";
const singatureReports = ["Line Inspection Report", "Detailed Switch Inspection"];

let defaultReportTypes = [
  // { name: "Track Report", title: "Track Inspection & Repair Report", active: true },

  { name: "Line Inspection Report", title: "Line Inspection & Repair Report", active: false, reportId: "1" },
  { name: "Switch Report", title: "Switch Inspection & Repair Report", active: false, reportId: "2" },
  { name: "Track Disturbance Report", title: "Track Disturbance Report", active: false, reportId: "4" },
  { name: "Detailed Switch Inspection", title: "Detailed Switch Inspection", active: false, reportId: "3" },
  { name: "Inspection of Utility Facilities", title: "Inspection of Utility Facilities", active: true, reportId: "5" },
];

class ReportFilter extends Component {
  constructor(props) {
    super(props);
    this.reportSRFilter = getCurrentReportStateFilters(this.props.reportSRFilter);

    this.state = {
      //dateRange: { from: new Date(moment().startOf("day")), today: new Date(moment().startOf("day")), to: new Date(moment().endOf("day")) },
      //InputObj: { ...InputObj },
      locationOptions: [],
      userOptions: [],
      //showReport: false,
      reportId: null,
      reports: [],
      allowPrint: true,
      multiReport: false,
      isMulti: false,
      // reportName: "Line Inspection Report",
      // reportTitle: "Line Inspection & Repair Report",
      selectedInspections: [],
      inspectionsReport: [],
      ...this.reportSRFilter,
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
  }
  handleUpdateFilterState(propertiesToUpdate) {
    let reportSRFilter = this.props.reportSRFilter ? this.props.reportSRFilter : {};

    this.props.updateFilterState("reportSRFilter", {
      ...reportSRFilter,
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
    // let report = _.filter(this.reportTypes, {
    //   name: tabName,
    // });
    // let allowPrint = false;
    // tabName === "Detailed Switch Inspection" ? (allowPrint = false) : (allowPrint = true);
    let reportTitle = "";
    this.state.reportTypes.map((type, i) => {
      if (type.name == tabName) return (this.state.reportTypes[i].active = true), (reportTitle = this.state.reportTypes[i].title);
      else this.state.reportTypes[i].active = false;
    });

    this.setState({
      reportTitle,
      reportName: tabName,
      reports: [],
      locationOptions: [],
      userOptions: [],
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
    let inspections = [...this.state.reports];
    if (e.target.name == "user") {
      inspections = this.filterByVals(e.target.value, this.state.InputObj.location);
    }
    if (e.target.name == "location") {
      inspections = this.filterByVals(this.state.InputObj.user, e.target.value);
    }

    this.setState({
      InputObj: InputObj,
      reports: inspections,
      selectedInspections: inspections,
    });
    this.handleUpdateFilterState({
      InputObj: InputObj,
    });
  }

  filterByVals(user, location) {
    let inspections = this.state.allReports;
    inspections = _.filter(inspections, (inspec) => {
      let userCheck = user == "All" ? true : false;
      let locationCheck = location == "All" ? true : false;
      !userCheck && (userCheck = inspec.user.id == user);
      !locationCheck && (locationCheck = inspec.lineId == location);
      return userCheck && locationCheck;
    });
    return inspections;
  }
  updateDateRange(dateRange) {
    this.setState({
      dateRange: dateRange,
    });
    this.handleUpdateFilterState({
      dateRange: dateRange,
    });
    this.getRangeDataFromServer(dateRange);
  }

  componentDidMount() {
    this.getRangeDataFromServer(this.state.dateRange);
    //this.updateReportFilter();
    this.updateReportTypes();
    this.handleUpdateFilterState({
      dateRange: this.state.dateRange,
      reportName: this.state.reportName,
      reportTitle: this.state.reportTitle,
      InputObj: { ...this.state.InputObj },
    });
    if (this.state.showReport === true) {
      this.getInspectionsFromServer([this.state.inspec]);
    }
  }
  updateReportTypes() {
    let rList = this.props.list;
    let reportTypes = defaultReportTypes.filter((rt) => {
      return !!rList.find((r) => {
        return r === rt.name;
      });
    });
    this.setState({ reportTypes: reportTypes });
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
      //console.log(this.props.reportFilter.length);
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

      this.loadReportsData(this.props.reportFilter);
      let multi = this.props.reportFilter && (multiOption ? true : false);
      this.setState({ multiReport: multi, allReports: this.props.reportFilter });
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
  handleClick(inspec) {
    this.getInspectionsFromServer([inspec]);
    this.handleUpdateFilterState({
      inspec: inspec,
    });
  }
  loadReportsData(inspections) {
    let locationOptions = [];
    let userOptions = [];

    if (_.isArray(inspections)) {
      locationOptions.push({ val: "All", text: "All" });
      userOptions.push({ val: "All", text: "All" });
      inspections.forEach((inspec) => {
        let locFilled = _.find(locationOptions, { val: inspec.lineId });
        if (!locFilled) {
          locationOptions.push({ val: inspec.lineId, text: inspec.lineName });
        }

        let userFilled = _.find(userOptions, { val: inspec.user.id });
        if (!userFilled) {
          userOptions.push({ val: inspec.user.id, text: inspec.user.name });
        }
      });

      inspections = inspections.sort((a, b) => {
        const a1 = new Date(a.date).getTime();
        const b1 = new Date(b.date).getTime();
        if (a1 < b1) return 1;
        else if (a1 > b1) return -1;
        else return 0;
      });
      this.setState({
        locationOptions,
        userOptions,
        reports: inspections,
        InputObj: {
          location: locationOptions[0].val,
          user: userOptions[0].val,
        },
        selectedInspections: inspections,
      });
      this.handleUpdateFilterState({
        InputObj: {
          location: locationOptions[0].val,
          user: userOptions[0].val,
        },
      });
    }
  }

  getRangeDataFromServer(range) {
    var jsonArray = encodeURIComponent(JSON.stringify(range));
    let activeReport = _.find(this.state.reportTypes, { active: true });
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
        if (inspec.status == "Finished") {
          inspecs.push(inspec._id);
        }
      });
      this.props.createReportFilter(inspecs);
    }
  }
  getUserSignaturesForInspections(inspections) {
    if (_.find(singatureReports, (sigRep) => sigRep == this.state.reportName)) {
      let users = [];
      inspections.forEach((inspec) => {
        let existCheck = _.find(users, (email) => email == inspec.user.email);
        if (!existCheck) users.push(inspec.user.email);
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
  }
  fillSignatureImageWithUserObj(userSigs) {
    let inspections = [...this.state.inspectionsReport];
    inspections.forEach((inspec) => {
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
          <div id="mainContent" style={{ textAlign: "center" }}>
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
                      this.getInspectionsFromServer(this.state.selectedInspections);
                      this.setState({ isMulti: true });
                    }}
                  >
                    <span style={{ verticalAlign: "super", marginRight: "5px", fontSize: "12px", display: "block" }}>
                      {languageService("Bulk Print")}
                    </span>
                    <SvgIcon size={32} icon={multiBorders} />
                  </span>
                )}
              </Col>
            </Row>

            <Col md={12}>
              <div className={"commonform"} style={{ ...themeService(trackReportStyle.mainStyle), background: "transparent" }}>
                {
                  <React.Fragment>
                    <h2 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none", fontSize: "22px" }}>
                      {languageService(this.state.reportTitle)}
                    </h2>

                    <label style={themeService(trackReportStyle.labelStyle)}>{languageService("Select a Date Range")}</label>
                    <span style={themeService(trackReportStyle.dateStyle)}>
                      <InputDateField updateDateRange={this.updateDateRange} defaultDate={this.state.dateRange} />
                    </span>
                    {this.state.locationOptions && this.state.locationOptions.length > 0 && (
                      <SelectField
                        inputFieldProps={{ name: "location", label: "Location" }}
                        options={this.state.locationOptions}
                        changeHandler={this.changeHandler}
                        value={this.state.InputObj.location}
                      />
                    )}
                    {this.state.userOptions && this.state.userOptions.length > 0 && (
                      <SelectField
                        inputFieldProps={{ name: "user", label: "User" }}
                        options={this.state.userOptions}
                        changeHandler={this.changeHandler}
                        value={this.state.InputObj.user}
                      />
                    )}
                  </React.Fragment>
                }
              </div>
            </Col>

            <ReportSelection reportFilter={this.state.reports} handleClick={this.handleClick} />
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
              {this.state.allowPrint && (
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

            <div id="mainContent">
              <MultiReport
                reportName={this.state.reportName}
                handleBack={this.handleBack}
                reportInspections={this.state.inspectionsReport}
                printbuttonhandler={{ show: this.handleReportPrint, hide: this.handleReportPrintOff }}
                isMulti={this.state.isMulti}
              />
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
  },
  userReducer: {
    usersSignatures: [],
  },
};
let actionOptions = {
  create: true,
  update: false,
  read: true,
  delete: false,
  others: { updateFilterState, getUserSignature },
};
let ReportFilterCRUD = CRUDFunction(
  ReportFilter,
  "reportFilter",
  actionOptions,
  variables,
  ["filterStateReducer", "userReducer"],
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
        style={{ ...themeService(formFeildStyle.inputStyle), width: "inherit" }}
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
