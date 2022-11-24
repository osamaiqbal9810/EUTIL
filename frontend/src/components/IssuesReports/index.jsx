/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import IssuesList from "./IssuesList/IssuesList";
import { Col, Row } from "reactstrap";
import { issuesReportedStyles } from "./styles/IssuesReportedPageStyle";
import IssuesReportedSummary from "components/Common/Summary/CommonSummary";
import IssuesSmartReportedSummary from "components/Common/SmartSummary/SmartSummary";
// import { guid } from "utils/UUID";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { updateInspectionPlanFromSocket } from "utils/planUpdateSocketObj";
import _ from "lodash";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { languageService } from "../../Language/language.service";
import CreateMRForm from "./CreateMR";
import CommonModal from "components/Common/CommonModal";
import DefectCodes from "./DefectCodes/DefectCodes";
import { CloseIssueModal, FixedOnSiteDetailModal } from "./Modals/IssueModals";
import MenuFilter from "components/Common/MenuFilters/index";
import { getCurrentIssuesStateFilters, TEMPLATE_ISSUES_FILTERS } from "./HelperFunctions/stateRetentionManagement";
import { issueTemplate } from "../../templates/IssueTemplate";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonStyles } from "../../theme/commonStyles";
import { ButtonStyle } from "style/basic/commonControls";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
import moment from "moment";
import { setActiveStateOfFixedDatesFilter } from "./HelperFunctions/dateRelatedFunctions";
// import DateAndLineFilter from "../Common/Filters/DateAndLineFilter";
import AddEditWOModal from "../WorkOrders/AddEditWO";
import { createIssuesWorkorder } from "../../reduxRelated/actions/journeyPlanHelperActions";
import { getStatusColor } from "utils/statusColors";
import CapitalPlanAssignment from "./IssuesList/CapitalPlanAssignment";

class IssuesReports extends Component {
  constructor(props) {
    super(props);
    this.issuesFilter = getCurrentIssuesStateFilters(this.props.issuesFilter);

    this.state = {
      journeyPlans: [],

      issuesData: [],
      filterData: [],
      summaryShowHide: true,
      classToShow: "d-none",
      displayTitle: languageService("Show Inactive"),
      page: 0,
      summaryValue: {
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        fifth: 0,
        sixth: 0,
        seventh: 0,
      },

      spinnerLoading: false,
      issueToCreateMR: {},
      createMRModal: false,
      maintenanceTypes: [],
      displayMenuAll: true,
      selectedIssue: null,
      ...this.issuesFilter,
      createWorkOrderModal: false,
      modalMode: "add",
    };

    this.stateRetentionApplied = false;

    this.filters = [
      { text: "Today", state: false, logic: 3 },
      { text: "30 Days", state: true, logic: 3 },
      { text: "All", state: false, logic: 3 },
      { text: "Date", state: false, logic: 1 },
    ];
    setActiveStateOfFixedDatesFilter(this.filters, this.state.dateFilterName);

    this.summaryLabels = {
      first: "Total",
      second: issueTemplate.high.label,
      third: issueTemplate.medium.label,
      fourth: issueTemplate.low.label,
      fifth: issueTemplate.info.label,
      sixth: issueTemplate.pending.label,
    };

    this.summaryDesc = {
      ...this.summaryLabels,
      first: languageService("Total Issues"),
      second: languageService(issueTemplate.high.detailLabel),
      third: languageService(issueTemplate.medium.detailLabel),
      fourth: languageService(issueTemplate.low.detailLabel),
      fifth: languageService(issueTemplate.info.label),
      sixth: languageService(issueTemplate.pending.detailLabel),
    };

    this.rowColorMap = [
      { fieldName: "priority", value: issueTemplate.high.label, textColor: getStatusColor(issueTemplate.high.label) },
      { fieldName: "priority", value: issueTemplate.medium.label, textColor: getStatusColor(issueTemplate.medium.label) },
      { fieldName: "priority", value: issueTemplate.low.label, textColor: getStatusColor(issueTemplate.low.label) },
      { fieldName: "priority", value: issueTemplate.info.label, textColor: getStatusColor(issueTemplate.info.label) },
      { fieldName: "priority", value: issueTemplate.pending.label, textColor: getStatusColor(issueTemplate.pending.label) },
    ];

    this.FixedDateRanges = {
      Today: { from: moment().startOf("day"), to: moment().endOf("day") },
      "30 Days": {
        today: moment().startOf("day"),
        from: moment().subtract(30, "d").startOf("day"),
        to: moment().endOf("day"),
      },
      Date: this.state.rangeState,
    };

    this.handleMRClick = this.handleMRClick.bind(this);
    this.handleSubmitMRModalClick = this.handleSubmitMRModalClick.bind(this);
    this.handleSummaryClick = this.handleSummaryClick.bind(this);
    this.handleHideShow = this.handleHideShow.bind(this);
    this.issueDefectListClick = this.issueDefectListClick.bind(this);
    this.handleDefectCode = this.handleDefectCode.bind(this);
    this.handleCloseSubmitClick = this.handleCloseSubmitClick.bind(this);
    this.openFixedOnSiteModalHandler = this.openFixedOnSiteModalHandler.bind(this);
    this.recalculateSummary = this.recalculateSummary.bind(this);
    this.menuFilterApplied = this.menuFilterApplied.bind(this);
    this.handelMenuClickData = this.handelMenuClickData.bind(this);
    this.handlePageSave = this.handlePageSave.bind(this);
    this.handleUpdateFilterState = this.handleUpdateFilterState.bind(this);
    this.calculateSummaryValue = this.calculateSummaryValue.bind(this);
    this.getRangeDataFromServer = this.getRangeDataFromServer.bind(this);
    this.clickedFilter = this.clickedFilter.bind(this);
    this.filterIssueState = this.filterIssueState.bind(this);
    this.handlePageSize = this.handlePageSize.bind(this);
    this.handleAddWOSubmit = this.handleAddWOSubmit.bind(this);
    this.fetchIssueReports = this.fetchIssueReports.bind(this);
    this.calculateJourneyPlanData = this.calculateJourneyPlanData.bind(this);
    this.getRangeAddToday = this.getRangeAddToday.bind(this);
    this.handleUpdateIssue = this.handleUpdateIssue.bind(this);
    this.addIssueToCapitalPlan = this.addIssueToCapitalPlan.bind(this);
  }
  async handleUpdateIssue(issueId, field, action) {
    let { issuesData } = this.state;
    const findIndex = this.state.issuesData.findIndex((i) => i.uniqueGuid === issueId);

    if (findIndex !== -1) {
      if (action === "savePriority") {
        let issueObj = {
          _id: issueId,
          issuesReport: {
            issue: _.cloneDeep(issuesData[findIndex]),
            action: "serverChanges",
          },
        };
        const response = await this.props.updateIssuesReport(issueObj);

        if (response.type === "ISSUESREPORT_UPDATE_SUCCESS") {
          issuesData[findIndex].action = "";
          this.setState({ issuesData: _.cloneDeep(issuesData) });
        }

        this.fetchIssueReports();
      } else if (action === "updatePriority") {
        issuesData[findIndex].action = "serverChanges";

        if (issuesData[findIndex].serverObject) issuesData[findIndex].serverObject[field.name] = field.value;
        else issuesData[findIndex].serverObject = { [field.name]: field.value };
        this.setState({ issuesData: _.cloneDeep(issuesData) });
      } else if (action === "saveMaintenanceRole") {
        issuesData[findIndex].maintenanceAction = "maintenanceMode";
        if (issuesData[findIndex].serverObject.maintenanceRole === "CapitalPlan") {
          //  this.handleWorkorderModel(true, issuesData[findIndex]);
          this.props.getWorkorders("location/" + issuesData[findIndex].lineId);
          this.openCapitalPlanModelMethod && this.openCapitalPlanModelMethod();
          this.setState({ issueForCapitalPlan: issuesData[findIndex] });
        } else {
          let issueObj = {
            _id: issueId,
            issuesReport: { _id: issueId, issue: _.cloneDeep(issuesData[findIndex]), action: "serverChanges", maintenanceAssign: true },
          };

          const response = await this.props.updateIssuesReport(issueObj);
          if (response.type === "ISSUESREPORT_UPDATE_SUCCESS") {
            issuesData[findIndex].maintenanceAction = "";
            let dateRange = this.FixedDateRanges[this.state.dateFilterName];
            this.getRangeDataFromServer(dateRange);
          }
        }
      } else if (action === "updateMaintenanceRole") {
        issuesData[findIndex].maintenanceAction = "maintenanceMode";
        if (issuesData[findIndex].serverObject) issuesData[findIndex].serverObject[field.name] = field.value;
        else issuesData[findIndex].serverObject = { [field.name]: field.value };
        this.setState({ issuesData: _.cloneDeep(issuesData) });
      }
    }
  }
  handlePageSave(page) {
    this.setState({
      page: page,
    });
  }
  handlePageSize(pageSize) {
    this.handleUpdateFilterState({
      pageSize,
    });
  }
  componentDidMount() {
    this.fetchIssueReports();
    this.props.getAssetType();
    this.props.getApplicationlookupss(["maintenanceTypes"]);
  }

  fetchIssueReports() {
    let range = this.FixedDateRanges[this.state.dateFilterName];
    this.checkStateExistenceAfterMount(range);
    let filterDateText = this.calculateFilterDateText(this.state.rangeState ? this.state.rangeState : range);
    this.getRangeDataFromServer(this.state.rangeState ? this.state.rangeState : range);
    this.setState({
      filterDateText: filterDateText,
    });
  }
  checkStateExistenceAfterMount(range) {
    if (!this.props.issuesFilter) {
      this.handleUpdateFilterState({
        ...TEMPLATE_ISSUES_FILTERS,
        rangeState: range,
      });
    } else {
      this.stateRetentionApplied = true;
      let normalFields = {};
      this.props.issuesFilter.fromDashboard && !this.props.issuesFilter.rangeState && (normalFields = { ...TEMPLATE_ISSUES_FILTERS });
      this.handleUpdateFilterState({
        fromDashboard: null,
        ...normalFields,
      });
    }
  }
  getRangeDataFromServer(range) {
    var jsonArray = encodeURIComponent(JSON.stringify(range));

    let arg = "?dateRange=" + jsonArray;
    if (range) {
      this.props.getIssuesReports(arg);
    } else {
      this.props.getIssuesReports();
    }
  }
  handleUpdateFilterState(propertiesToUpdate) {
    let issuesFilter = this.props.issuesFilter ? this.props.issuesFilter : {};

    this.props.updateFilterState("issuesFilter", {
      ...issuesFilter,
      ...propertiesToUpdate,
    });
  }
  handleHideShow() {
    this.setState({ summaryShowHide: this.state.summaryShowHide ? false : true });
  }
  handleSummaryClick(card) {
    if (this.state.activeSummary !== this.summaryLabels[card]) {
      let resultCal = this.calculateIssuesData(
        this.props.issuesReports,
        this.state.assetChildren,
        this.summaryLabels[card],
        this.state.statusFilter,
      );
      this.setState({ issuesData: resultCal.listData, summaryValue: resultCal.sumVal, activeSummary: this.summaryLabels[card] });
      this.handleUpdateFilterState({ activeSummary: this.summaryLabels[card] });
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.workorderActionType == "WORKORDERS_READ_REQUEST" && prevProps.workorderActionType !== this.props.workorderActionType) {
      this.setState({
        spinnerLoading: true,
      });
    }
    if (this.props.workorderActionType == "WORKORDERS_READ_SUCCESS" && prevProps.workorderActionType !== this.props.workorderActionType) {
      this.setState({
        spinnerLoading: false,
      });
    }
    if (this.props.workorderActionType == "WORKORDERS_READ_FAILURE" && prevProps.workorderActionType !== this.props.workorderActionType) {
      this.setState({
        spinnerLoading: false,
      });
    }
    if (this.props.actionType == "ISSUESREPORTS_READ_REQUEST" && prevProps.actionType !== this.props.actionType) {
      this.setState({
        spinnerLoading: true,
      });
    }
    if (this.props.actionType == "ISSUESREPORTS_READ_SUCCESS" && prevProps.actionType !== this.props.actionType) {
      if (this.state.assetChildren) {
        let resultCal = this.calculateIssuesData(
          this.props.issuesReports,
          this.state.assetChildren,
          this.state.activeSummary,
          this.state.statusFilter,
        );
        this.setState({ issuesData: resultCal.listData, summaryValue: resultCal.sumVal, spinnerLoading: false });
      } else {
        this.setState({ spinnerLoading: false });
      }
    }
    if (this.props.actionType == "ISSUESREPORTS_READ_FAILURE" && prevProps.actionType !== this.props.actionType) {
      if (this.props.journeyPlanErrorMessage !== prevProps.journeyPlanErrorMessage && this.props.journeyPlanErrorMessage.status == 401) {
        this.props.history.push("/login");
      }
      this.setState({
        spinnerLoading: false,
      });
    }
    if (this.props.journeyPlanActionType == "JOURNEYPLAN_UPDATE_SUCCESS" && prevProps.actionType !== this.props.actionType) {
      this.getRangeDataFromServer(this.state.rangeState);
    }
    if (this.props.actionType == "ISSUESREPORT_CREATE_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      this.getRangeDataFromServer(this.state.rangeState);
    }
    if (
      this.props.journeyPlanActionType !== prevProps.journeyPlanActionType &&
      this.props.journeyPlanActionType == "JOURNEYPLAN_READ_SUCCESS" &&
      this.props.journeyPlan
    ) {
      //let jPlans = updateInspectionPlanFromSocket(this.props.issuesReports, this.props.journeyPlan);
      //let resultCal = this.calculateIssuesData(updatedIssues, this.state.assetChildren, this.state.activeSummary, this.state.statusFilter);
      //this.setState({ issuesData: resultCal.listData, summaryValue: resultCal.sumVal });
      this.fetchIssueReports(); // fetch updated issues as a jp is updated
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType === "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {
      this.setApplicationLists(this.props.applicationlookupss);
    }
  }
  calculateIssuesData(issueFromServer, assetChildren, activeSummary, statusFilter) {
    /* What happens here ?
         - Calculate Issues to show in list and calculate summary values to show
         - summary values are not reCalculated only when active summary is changed
         - when state retention is applied and u come back to the view with some activeSummary such as "High Priority" the summary value is calculated based on the total issues instead of the issues to be shown in issues list
        */

    /*
        hierarchy :
        -Date Filter Apply From Server ( not applicable in this function)
        -Menu filter applied
        -Status Applied
        -Summary Apply
        -State Retention Apply Check for Summary Calculation
        */

    let selectedChildren = [];

    assetChildren &&
      assetChildren.forEach((loc, index) => {
        loc.state == true && selectedChildren.push(loc);
      });

    let sumVal = {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      fifth: 0,
      sixth: 0,
    };
    let issueDataTable = [];
    let reCalTotalIssues = true;
    this.state.activeSummary && this.state.activeSummary !== activeSummary && (reCalTotalIssues = false);
    issueFromServer.forEach((issue) => {
      let checkMenuFilterAllowed = _.find(selectedChildren, { state: true, id: issue.lineId });
      if (checkMenuFilterAllowed) {
        if (issue.fixType !== "") issue.status = "Resolved";
        let OPEN_ISSUE = issue.status !== "Resolved" ? true : false;
        let SHOW_ALL_STATUS = statusFilter == "All" ? true : false;
        let CHECK_ON_FIXED = activeSummary == "Fixed" ? true : false;
        issue.priority = issue.serverObject && issue.serverObject.issuePriority ? issue.serverObject.issuePriority : "Pending";

        let PRIORITY_MATCHED =
          (issue.priority && activeSummary && issue.priority.toUpperCase() == activeSummary.toUpperCase()) ||
          activeSummary == this.summaryLabels.first ||
          activeSummary == "Fixed"
            ? true
            : false;

        let STATUS_MATCHED =
          SHOW_ALL_STATUS ||
          (statusFilter == "Resolved" && !OPEN_ISSUE ? true : false) ||
          (statusFilter !== "Resolved" && OPEN_ISSUE ? true : false);

        // push issue in list
        if (STATUS_MATCHED && PRIORITY_MATCHED && (CHECK_ON_FIXED ? issue.fixType !== "" : true)) {
          issueDataTable.push({ ...issue, lineName: checkMenuFilterAllowed.title });
        }
        if (STATUS_MATCHED) {
          reCalTotalIssues && (sumVal = this.calculateSummaryValue(issue, sumVal));
          sumVal.first++;
        }

        // if (STATUS_MATCHED && this.stateRetentionApplied) {
        //   sumVal = this.calculateSummaryValue(issue, sumVal);
        //   sumVal.first++;
        // }
        // if (STATUS_MATCHED && PRIORITY_MATCHED && (CHECK_ON_FIXED ? issue.fixType !== "" : true)) {
        //   reCalTotalIssues && (sumVal = this.calculateSummaryValue(issue, sumVal));
        //   issueDataTable.push(issue);
        //   sumVal.first++;
        // } else if (STATUS_MATCHED && this.stateRetentionApplied) {
        //   sumVal = this.calculateSummaryValue(issue, sumVal);
        //   sumVal.first++;
        // }
      }
    });

    issueDataTable.sort(function compare(a, b) {
      var dateA = new Date(a.timeStamp);
      var dateB = new Date(b.timeStamp);
      return dateB - dateA;
    });

    !this.stateRetentionApplied && (sumVal.first = issueDataTable.length);
    !reCalTotalIssues && (sumVal = this.state.summaryValue);

    return { sumVal: sumVal, listData: issueDataTable };
  }
  calculateSummaryValue(issue, sumVal) {
    const { serverObject } = issue;

    if (!serverObject || !serverObject.issuePriority) {
      sumVal.sixth = sumVal.sixth + 1;
      return sumVal;
    }

    if (serverObject.issuePriority.toUpperCase() == this.summaryLabels.second.toUpperCase()) {
      sumVal.second = sumVal.second + 1;
    }
    if (serverObject.issuePriority.toUpperCase() == this.summaryLabels.fifth.toUpperCase()) {
      sumVal.fifth = sumVal.fifth + 1;
    }
    if (serverObject.issuePriority.toUpperCase() == this.summaryLabels.fourth.toUpperCase()) {
      sumVal.fourth = sumVal.fourth + 1;
    }
    if (serverObject.issuePriority.toUpperCase() == this.summaryLabels.third.toUpperCase()) {
      sumVal.third = sumVal.third + 1;
    }

    return sumVal;
  }
  recalculateSummary(issuesList, filterName) {
    // let sumVal = {
    //   first: this.state.summaryValue.first,
    //   second: 0,
    //   third: 0,
    //   fourth: 0,
    //   fifth: 0,
    //   sixth: 0,
    // };
    // if (issuesList) {
    //   issuesList.forEach((issue, iIndex) => {
    //     sumVal = this.calculateSummaryValue(issue, sumVal);
    //   });
    // }
    // if (filterName !== "all") {
    //   this.setState({
    //     summaryValue: sumVal,
    //   });
    // }
  }
  handleSubmitMRModalClick(issueForMR) {
    issueForMR = { ...this.state.issueToCreateMR, ...issueForMR };
    this.setState({ createMRModal: false, issueToCreateMR: {} });

    // pass maintenanceType and MP Location data from Modal dialog
    this.props.createIssuesReport({ issue: issueForMR, action: "CreateMR" });
  }
  menuFilterApplied(assetChildren, options) {
    if (!this.state.assetChildren) {
      // let children = [];
      // assetChildren.forEach((child, index) => {
      //   children = [...children, ...child];
      // });
      let res = {};
      res = this.calculateIssuesData(this.props.issuesReports, assetChildren, this.state.activeSummary, this.state.statusFilter);
      this.setState({ assetChildren: assetChildren, issuesData: res.listData, summaryValue: res.sumVal });
      this.handleUpdateFilterState({ assetChildren: assetChildren, lineNames: [...options] });
    }
  }
  handelMenuClickData(assetChildren, displayMenuAll, lineNames) {
    //let children = [];
    // assetChildren.forEach((child, index) => {
    //   children = [...children, ...child];
    // });
    let res = this.calculateIssuesData(this.props.issuesReports, assetChildren, this.state.activeSummary, this.state.statusFilter);

    this.setState({ assetChildren: assetChildren, issuesData: res.listData, summaryValue: res.sumVal });

    this.handleUpdateFilterState({ assetChildren: assetChildren, lineNames: lineNames, displayMenuAll: displayMenuAll });
  }
  handleMRClick(issueForMR, action) {
    if (action === "createMR") {
      // Add maintenanceType and MP Location data from Modal dialog to 'issueForMR' and send to server as done in handleSubmitMRModalClick
      this.setState({ issueToCreateMR: issueForMR, createMRModal: true });
    } else if (action === "close" || action === "reason") {
      this.openIssueCloseModal && this.openIssueCloseModal(true);
      this.setState({ selectedIssue: issueForMR });
    }
  }
  getListType(listName, lists) {
    let list = lists.filter((v) => {
      return v.listName === listName;
    });
    list = list.map((v) => {
      return v.description;
    });

    return list;
  }
  setApplicationLists(lists) {
    if (lists && lists.length) {
      let maintenanceTypes = this.getListType("maintenanceTypes", lists);
      this.setState({ maintenanceTypes: maintenanceTypes }); //, crewSkills: crewSkills, equipmentTypes: equipmentTypes, materialTypes: materialTypes});
    }
  }
  issueDefectListClick(issue) {
    this.openModelMethod();
    this.setState({
      selectedIssue: issue,
    });
  }
  handleDefectCode() {
    this.setState({
      classToShow: this.state.classToShow == "d-none" ? "show" : "d-none",
      displayTitle:
        this.state.displayTitle == languageService("Hide Inactive")
          ? languageService("Show Inactive")
          : languageService(languageService("Hide Inactive")),
    });
  }
  handleCloseSubmitClick(closeReason) {
    // update issue with reason and save the plan
    //console.log(this.state.selectedIssue);
    const { selectedIssue } = this.state;
    let issue = { ...selectedIssue };
    issue.closeReason = closeReason;
    this.props.createIssuesReport({ issue: issue, action: "Close" });
  }
  openFixedOnSiteModalHandler(issue) {
    this.setState({ selectedIssue: issue });
    this.openFixedOnSiteModal(true);
  }
  clickedFilter(filter) {
    let stateToUpdate = {};
    if (filter !== "All") {
      let dateRange = this.FixedDateRanges[filter];
      dateRange = this.FixedDateRanges[filter];
      this.getRangeDataFromServer(dateRange);
      let filterDateText = this.calculateFilterDateText(dateRange);
      this.handleUpdateFilterState({ rangeState: dateRange, dateFilterName: filter });
      stateToUpdate = {
        rangeState: dateRange,
        filterDateText: filterDateText,
        dateFilterName: filter,
      };
    } else {
      this.props.getIssuesReports();
      stateToUpdate = {
        rangeState: null,
        filterDateText: "",
        dateFilterName: "All",
      };
      this.handleUpdateFilterState({ rangeState: null, dateFilterName: "All" });
    }
    this.setState({ ...stateToUpdate });
  }
  calculateFilterDateText(range) {
    let filterDateText = "";
    if (range && range.from != undefined) {
      filterDateText = moment(range.from).format("L");

      if (range.to != undefined && moment(range.from).format("L") != moment(range.to).format("L")) {
        filterDateText += " to " + moment(range.to).format("L");
      }
    }
    return filterDateText;
  }
  filterIssueState(statusFilter) {
    if (statusFilter === "Resolved") this.summaryDesc.sixth = "Priority N/A";
    else this.summaryDesc.sixth = issueTemplate.pending.detailLabel;

    let resultCal = this.calculateIssuesData(this.props.issuesReports, this.state.assetChildren, this.state.activeSummary, statusFilter);
    this.setState({ issuesData: resultCal.listData, summaryValue: resultCal.sumVal, statusFilter: statusFilter });
    this.handleUpdateFilterState({ statusFilter: statusFilter });
  }
  handleWorkorderModel = (createWorkOrderModal, issueToCreateMR, fromModel) => {
    if (fromModel) {
      this.openCapitalPlanModelMethod(false);
    }
    this.setState({ createWorkOrderModal, issueToCreateMR });
  };

  async handleAddWOSubmit(workorder, issueForMR) {
    issueForMR = { ...this.state.issueToCreateMR, ...issueForMR };
    this.setState({ createMRModal: false, issueToCreateMR: {} });

    //pass maintenanceType and MP Location data from Modal dialog
    await this.props.createIssuesWorkorder({
      issuesReport: { issue: issueForMR, action: "CreateMR" },
      workorder,
    });

    this.fetchIssueReports();

    this.setState({ createWorkOrderModal: false });
  }

  calculateJourneyPlanData(allPlans) {
    console.log("allplans", allPlans);
    // this.calculateJourneyPlanToShow(allPlans, this.state.assetChildren, this.state.activeSummary);
  }

  getRangeAddToday(range) {
    //console.log("range:", range);
    if (range.to == undefined) range.to = range.from;
    let dateRange = { today: moment().startOf("day"), from: moment(range.from), to: moment(range.to) };
    this.getRangeDataFromServer(dateRange);
    let filterDateText = this.calculateFilterDateText(dateRange);
    this.handleUpdateFilterState({ rangeState: dateRange, dateFilterName: "Date" });
    this.setState({
      rangeState: dateRange,
      filterDateText: filterDateText,
      dateFilterName: "Date",
    });
  }

  async addIssueToCapitalPlan(capitalPlan, issue) {
    let { issuesData } = this.state;
    const findIndex = this.state.issuesData.findIndex((i) => i.uniqueGuid === issue.uniqueGuid);
    let issueObj = {
      _id: issue.uniqueGuid,
      issuesReport: {
        _id: issue.uniqueGuid,
        issue: issuesData[findIndex],
        action: "serverChanges",
        maintenanceAssign: true,
        capitalPlanAssign: true,
        capitalPlan: capitalPlan._id,
      },
    };

    const response = await this.props.updateIssuesReport(issueObj);
    if (response.type === "ISSUESREPORT_UPDATE_SUCCESS") {
      issuesData[findIndex].maintenanceAction = "";
      let dateRange = this.FixedDateRanges[this.state.dateFilterName];
      this.getRangeDataFromServer(dateRange);
    }
    this.openCapitalPlanModelMethod(false);
    this.setState({ issuesData: _.cloneDeep(issuesData), issueForCapitalPlan: null });
  }

  render() {
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <Col id="mainContent" md={12}>
        <CommonModal
          headerText={languageService("Choose Capital Plan")}
          setModalOpener={(method) => {
            this.openCapitalPlanModelMethod = method;
          }}
          footerCancelText={languageService("Cancel")}
          receiveToggleMethod={this.handleCancelOrToggleModal}
        >
          <CapitalPlanAssignment
            handleWorkorderModel={this.handleWorkorderModel}
            issue={this.state.issueForCapitalPlan}
            capitalPlans={this.props.workorders}
            addIssueToCapitalPlan={this.addIssueToCapitalPlan}
          />
        </CommonModal>
        <AddEditWOModal
          fromIssue
          maintenanceTypes={this.state.maintenanceTypes}
          modal={this.state.createWorkOrderModal}
          issue={this.state.issueToCreateMR}
          toggle={(ms, wo) => {
            this.setState({ createWorkOrderModal: !this.state.createWorkOrderModal });
          }}
          handleSubmitForm={this.handleAddWOSubmit}
          modalMode={this.state.modalMode}
        />

        <CommonModal
          headerText={languageService("Defect Codes")}
          setModalOpener={(method) => {
            this.openModelMethod = method;
          }}
          footerCancelText={languageService("Close")}
        >
          <button
            className="setPasswordButton"
            onClick={this.handleDefectCode}
            style={{ position: "absolute", top: "-45px", right: "20px", ...themeService(ButtonStyle.commonButton) }}
          >
            {this.state.displayTitle}
          </button>
          <DefectCodes classToShow={this.state.classToShow} selectedIssue={this.state.selectedIssue} assetTypes={this.props.assetTypes} />
        </CommonModal>
        <CloseIssueModal
          openCloseModal={(method) => {
            this.openIssueCloseModal = method;
          }}
          handleCloseSubmitClick={this.handleCloseSubmitClick}
          selectedIssue={this.state.selectedIssue}
        />
        <FixedOnSiteDetailModal
          openCloseModal={(method) => {
            this.openFixedOnSiteModal = method;
          }}
          selectedIssue={this.state.selectedIssue}
        />
        {modelRendered}
        <Row style={themeService(commonStyles.pageBorderRowStyle)}>
          <Col md="10" style={{ paddingLeft: "0px", position: "unset" }}>
            <div style={themeService(commonStyles.pageTitleStyle)}>{languageService("Issues Reported")}</div>

            <IssuesSmartReportedSummary
              descriptions={this.summaryDesc}
              values={this.state.summaryValue}
              handleSummaryClick={this.handleSummaryClick}
              summaryShowHide={this.state.summaryShowHide}
              handleHideShow={this.handleHideShow}
              summaryShowHide={!this.state.summaryShowHide}
              handleHideShow={this.handleHideShow}
              summaryLabels={this.summaryLabels}
            />
          </Col>
        </Row>

        <MenuFilter
          menuFilterApplied={this.menuFilterApplied}
          handelMenuClickData={this.handelMenuClickData}
          displayMenuAll={this.state.displayMenuAll}
          assetChildren={this.state.assetChildren}
          lineNames={this.state.lineNames}
        ></MenuFilter>

        <Row
          style={{
            transition: "all .3s ease-in-out",
            opacity: this.state.summaryShowHide ? "1" : "0",
            height: this.state.summaryShowHide ? "60px" : "0",
          }}
        >
          <Col md="12">
            <div style={themeService(issuesReportedStyles.issuesReportedSummaryHeadingContainer)}>
              <h4 style={themeService(issuesReportedStyles.issuesReportedSummaryHeadingStyle)}>{languageService("Issues Summary")}</h4>
            </div>
          </Col>
        </Row>
        <Row
          className="summary-row"
          style={{
            transition: "all .3s ease-in-out",
            opacity: this.state.summaryShowHide ? "1" : "0",
            height: this.state.summaryShowHide ? "95px" : "0",
          }}
        >
          <Col md="12">
            <IssuesReportedSummary
              descriptions={this.summaryDesc}
              values={this.state.summaryValue}
              handleSummaryClick={this.handleSummaryClick}
              summaryShowHide={this.state.summaryShowHide}
              handleHideShow={this.handleHideShow}
              summaryLabels={this.summaryLabels}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <CreateMRForm
              issue={this.state.issueToCreateMR}
              modal={this.state.createMRModal}
              maintenanceTypes={this.state.maintenanceTypes}
              handleSubmitClick={this.handleSubmitMRModalClick}
              toggle={() => this.setState(({ createMRModal }) => ({ createMRModal: !createMRModal }))}
            />
          </Col>
        </Row>
        <div style={{ margin: "0 15px" }}>
          <IssuesList
            //tableData={this.state.filterData}
            handleWorkorderModel={this.handleWorkorderModel}
            tableData={this.state.issuesData}
            handleMRClick={this.handleMRClick}
            showDefectModal={this.issueDefectListClick}
            openFixedOnSiteModal={this.openFixedOnSiteModalHandler}
            recalculateSummary={this.recalculateSummary}
            handlePageSave={this.handlePageSave}
            page={this.state.page}
            calculateSummaryData={this.calculateJourneyPlanData}
            data={this.props.issuesReports}
            handlePageSize={this.handlePageSize}
            pageSize={this.state.pageSize}
            setDefaultObjects={this.setDefaultObjects}
            apiCall="journeyPlan"
            multiData={this.props.multiData}
            dateFilters={this.filters}
            getRangeFromServer={this.getRangeAddToday}
            clickedFilter={this.clickedFilter}
            dateFilterName={this.state.dateFilterName}
            fixedDateRanges={this.FixedDateRanges}
            filterDateText={this.state.filterDateText}
            filterIssueState={this.filterIssueState}
            statusFilter={this.state.statusFilter}
            rowStyleMap={this.rowColorMap}
            handleUpdateIssue={this.handleUpdateIssue}
            history={this.props.history}
          />
        </div>
      </Col>
    );
  }
}

const getJourneyPlans = curdActions.getJourneyPlans;
const updateJourneyPlan = curdActions.updateJourneyPlan;
const getAssetType = curdActions.getAssetType;
const getApplicationlookupss = curdActions.getApplicationlookupss;
const getWorkorders = curdActions.getWorkorders;
let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: false,
  others: {
    createIssuesWorkorder,
    getJourneyPlans,
    updateJourneyPlan,
    getAssetType,
    getApplicationlookupss,
    updateFilterState,
    getWorkorders,
  },
};

let variableList = {
  journeyPlanReducer: { journeyPlans: "", journeyPlan: {} },
  lineSelectionReducer: {
    selectedLine: {},
  },
  workorderReducer: {
    workorders: [],
    workorder: {},
  },
  assetTypeReducer: {
    assetTypes: [],
  },
  applicationlookupsReducer: { applicationlookupss: [] },
  filterStateReducer: {
    issuesFilter: null,
  },
};

let reducers = [
  "workorderReducer",
  "journeyPlanReducer",
  "lineSelectionReducer",
  "assetTypeReducer",
  "applicationlookupsReducer",
  "filterStateReducer",
];

const IssuesReportsContainer = CRUDFunction(IssuesReports, "issuesReport", actionOptions, variableList, reducers, "journeyPlan/issue");

export default IssuesReportsContainer;

function getIssueMrFromJPlanResponse(jPlan, issueId) {
  let newIsuse = null;
  if (jPlan && jPlan.tasks && jPlan.tasks[0] && jPlan.tasks[0].issues) {
    newIsuse = _.find(jPlan.tasks[0].issues, (upIssue) => {
      return upIssue.issueId == issueId;
    });
  }
  return newIsuse;
}
