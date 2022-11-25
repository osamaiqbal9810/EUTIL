/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { journeyPlanStyles } from "./styles/JourneyPlanPageStyle";
import JourneyPlanList from "./JourneyPlanList/index";
import JourneyPlanSummary from "components/Common/Summary/CommonSummary";
import JourneySmartPlanSummary from "components/Common/SmartSummary/SmartSummary";
import { CRUDFunction } from "reduxCURD/container";
import { userListRequest } from "reduxRelated/actions/userActions";
//import JourneyPlanAdd from "./JourneyPlanAddEdit/JourneyPlanAdd";
import JourneyPlanAdd from "../WorkPlanTemplate/JourneyPlanAddEdit/JourneyPlanAdd";
import { getSODs } from "reduxRelated/actions/sodActions.js";
import moment from "moment";
import _ from "lodash";
import { toast } from "react-toastify";
import MenuFilter from "components/Common/MenuFilters/index";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import permissionCheck from "utils/permissionCheck.js";
import { savePageNum, clearPageNum } from "reduxRelated/actions/utilActions";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { languageService } from "../../Language/language.service";
import DateAndLineFilter from "components/Common/Filters/DateAndLineFilter";
import { getMultiLineData } from "reduxRelated/actions/lineSelectionAction";
import { setFutureInspection } from "reduxRelated/actions/inspectionHelperActions";
import { updateWorkPlanFutureInspection } from "reduxRelated/actions/templateHelperActions";
import ViewChangerComponent from "components/Common/ViewChangerComponent/ViewChangerComponent";
import CalendarInspections from "components/JourneyPlan/CalendarView/CalendarInspections";
import { LIST_VIEW_SELECTION_TYPES, TIMPS_LIST_VIEW_SELECTION, SITE_LIST_VIEW_SELECTION } from "./ViewSelection.js";
// import CalendarControls from "components/Common/Calendar/CalendarControls";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
import ColorsLegend from "./ColorsLegend";
import { setActiveStateOfFixedDatesFilter } from "./HelperFunctions/dateRelatedFunctions";
import { getCurrentInspectionStateFilters, TEMPLATE_INSPECTION_FILTERS } from "./HelperFunctions/stateRetentionManagement";
import { inspectionTemplate } from "../../templates/InspectionTemplate";
import { themeService } from "../../theme/service/activeTheme.service";
import { journeyPlanMainStyles } from "./styles/Inspections";
import { commonStyles } from "../../theme/commonStyles";
//import { timpsSignalApp } from "../../config/config";
// import data, { locData } from "./LinearView/sampleData";
import InspectionsLinearView from "./LinearView/InspectionsLinearView";
import { curdActions } from "../../reduxCURD/actions";
import { filterTreeByProperties } from "utils/treeData";
import { findTreeNode, treeToArray } from "../../utils/treeData";
import InspectionAssetStatusView from "./LinearView/InspectionAssetStatusView";
import { versionInfo } from "../MainPage/VersionInfo";
import AssetInspections from "./AssetInspections/AssetInspections";
import Loader from "../Common/GenericSpinnerLoader";
import {filterDateStart, addYears} from "./constants";
class JourneyPlan extends Component {
  constructor(props) {
    super(props);

    this.inspectionFilter = getCurrentInspectionStateFilters(this.props.inspectionFilter);
  
    this.state = {
      workPlans: [],
      filterData: [],
      journeyPlanToShow: [],
      ...this.inspectionFilter,
      sodList: [],
      addModal: false,
      selectedJourneyPlan: null,
      planToDelete: null,
      confirmationDialog: false,
      workPlansUpdated: false,
      modalState: "",
      actionType: "",
      userList: [],
      spinnerLoading: false,
      usersActionType: "",
      summaryShowHide: true,
      summaryValue: { first: 0, second: 0, third: 0, fifth: 0, sixth: 0, fourth: 0 },
      listPage: 0,
      planFilter: "all",
      planPageSize: this.props.planPageSize,

      filterDateText: "",
      locations: [],

      CalendarControlsComp: null,
      displayMenuAll: true,

      daysBeforeSwitchStatusRed: null,
    };

    this.filters = [
      { text: "Week", state: false, logic: 3, propertyValue: null },
      { text: "Month", state: true, logic: 3, propertyValue: null },
      { text: "Date", state: false, logic: 1, propertyValue: null },
      { text: "All", state: false, logic: 3, propertyValue: null },
    ];
    setActiveStateOfFixedDatesFilter(this.filters, this.state.dateFilterName);

    this.FixedDateRanges = {
      Week: { today: moment().endOf("day"), from: moment().startOf("week"), to: moment().endOf("week") },
      Month: { today: moment().endOf("day"), from: moment().startOf("month"), to: moment().endOf("month") },
      Date: this.state.rangeState,
      All: { today: moment().startOf("day"), from: moment(filterDateStart).startOf("years"), to: moment().add(addYears, 'years').endOf("year") }
    };
    this.summaryLabels = {
      first: "Total",
      second: inspectionTemplate.overdue.label,
      third: inspectionTemplate.missed.label,
      fourth: inspectionTemplate.upcoming.secondVal,
      fifth: inspectionTemplate.inProgress.label,
      sixth: inspectionTemplate.completed.label,
    };

    this.summaryDesc = {
      first: languageService("Total Inspections"),
      second: languageService(inspectionTemplate.overdue.label),
      third: languageService(inspectionTemplate.missed.label),
      fourth: languageService(inspectionTemplate.upcoming.label),
      fifth: languageService(inspectionTemplate.inProgress.label),
      sixth: languageService(inspectionTemplate.completed.label),
    };

    this.LIST_VIEW_SELECTION = TIMPS_LIST_VIEW_SELECTION;

    this.handleAddEditModalClick = this.handleAddEditModalClick.bind(this);
    this.handleViewModalClick = this.handleViewModalClick.bind(this);
    this.resetPage = this.resetPage.bind(this);
    this.handleAddJourneyPlan = this.handleAddJourneyPlan.bind(this);
    this.handleEditJourneyPlan = this.handleEditJourneyPlan.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleConfirmationToggle = this.handleConfirmationToggle.bind(this);
    this.handlePageStateSave = this.handlePageStateSave.bind(this);
    this.setUpdateWorkplansFalse = this.setUpdateWorkplansFalse.bind(this);
    this.calculateJourneyPlanData = this.calculateJourneyPlanData.bind(this);
    this.setDefaultObjects = this.setDefaultObjects.bind(this);
    this.changeUserAndUpdate = this.changeUserAndUpdate.bind(this);
    this.handleSummaryClick = this.handleSummaryClick.bind(this);
    this.getRangeAddToday = this.getRangeAddToday.bind(this);
    this.clickedFilter = this.clickedFilter.bind(this);
    this.getDateControls = this.getDateControls.bind(this);
    this.getRangeDataFromServer = this.getRangeDataFromServer.bind(this);
    this.handleHideShow = this.handleHideShow.bind(this);
    this.menuFilterApplied = this.menuFilterApplied.bind(this);
    this.handelMenuClickData = this.handelMenuClickData.bind(this);
    this.handleUpdateFilterState = this.handleUpdateFilterState.bind(this);
    this.handleUpdateIncludeInFRA = this.handleUpdateIncludeInFRA.bind(this);

    this.handleListViewSelection = this.handleListViewSelection.bind(this);
    this.handlePageSize = this.handlePageSize.bind(this);
  }

  componentDidMount() {
    let range = this.FixedDateRanges[this.state.dateFilterName];
    if (
      this.state.listViewDataToShow != LIST_VIEW_SELECTION_TYPES.Calendar
      //&&       this.state.listViewDataToShow != LIST_VIEW_SELECTION_TYPES.AssetCalendar
    ) {
      this.getRangeDataFromServer(range);
      let filterDateText = this.calculateFilterDateText(range);
      // debugger;
      this.setState({
        filterDateText: filterDateText,
      });
    }

    this.props.userListRequest();
    if (!this.props.inspectionFilter) {
      this.handleUpdateFilterState({
        listViewDataToShow: this.state.listViewDataToShow,
        fromDashboard: null,
        rangeState: range,
        dateFilterName: this.state.dateFilterName,
        activeSummary: this.summaryLabels.first,
      });
    } else {
      let normalFields = {};

      this.props.inspectionFilter.fromDashboard &&
        !this.props.inspectionFilter.rangeState &&
        (normalFields = { ...TEMPLATE_INSPECTION_FILTERS });
      this.handleUpdateFilterState({
        fromDashboard: null,
        ...normalFields,
      });
    }
    this.props.getAssets();

    this.props.getApplicationlookupss("config/switchAlertDaysBeforeMonthEnd");
    this.props.getApplookups(["inspectionTypes"])
    if (versionInfo.isSITE()) this.LIST_VIEW_SELECTION = SITE_LIST_VIEW_SELECTION;
   
  }

  getRangeDataFromServer(range, additionalQuery, tests) {
    let utcRange = {
      today: moment.utc(range.today.format().slice(0, 10)).startOf("d"),
      from: moment.utc(range.from.format().slice(0, 10)).startOf("d"),
      to: moment.utc(range.to.format().slice(0, 10)).endOf("d"),
    };
    var jsonArray = encodeURIComponent(JSON.stringify(utcRange));
    let arg = "?dateRange=" + jsonArray + (additionalQuery ? additionalQuery : "");
    if (tests) {
      this.props.getTestSchedules(arg);
    } else {
      this.props.getJourneyPlans(arg);
    }
  }

  calculateFilterDateText(range) {
    // debugger;
    let filterDateText = "";
    if (range && range.from != undefined) {
      filterDateText = moment(range.from).format("L");

      if (range.to != undefined && moment(range.from).format("L") != moment(range.to).format("L")) {
        filterDateText += " to " + moment(range.to).format("L");
      }
    }
    return filterDateText;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.userActionType == "USER_LIST_SUCCESS" && nextProps.usersActionType !== prevState.usersActionType) {
      let inspectors = _.filter(nextProps.userList, { group_id: "inspector" });
      let supervisors = _.filter(nextProps.userList, { group_id: "supervisor" });
      return {
        userList: [...inspectors, ...supervisors],
        usersActionType: nextProps.myActionsType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "JOURNEYPLAN_READ_REQUEST") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "JOURNEYPLAN_READ_SUCCESS") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "JOURNEYPLAN_READ_FAILURE") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "JOURNEYPLAN_CREATE_SUCCESS") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "JOURNEYPLAN_CREATE_FAILURE") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "JOURNEYPLAN_DELETE_SUCCESS") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "JOURNEYPLAN_DELETE_FAILURE") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "JOURNEYPLAN_UPDATE_SUCCESS") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "JOURNEYPLAN_UPDATE_FAILURE") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (
      nextProps.trafficType &&
      nextProps.actionType == "TRAFFICTYPE_LIST_GET_SUCCESS" &&
      prevState.actionType !== nextProps.actionType
    ) {
      return {
        actionType: nextProps.actionType,
        trafficTypes: nextProps.trafficTypes,
      };
    } else {
      return null;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // this.handleSpinnerMethods(prevProps, this.props);
    // if (prevProps.actionType !== this.props.actionType && this.props.actionType == "JOURNEYPLANS_READ_REQUEST") {
    //   this.setState({
    //     spinnerLoading: true,
    //   });
    // }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "JOURNEYPLANS_READ_SUCCESS" && this.props.journeyPlans) {
      this.calculateJourneyPlanToShow(this.props.journeyPlans, this.state.assetChildren, this.state.activeSummary);
      this.props.getWorkPlanTemplates();
  
      //  this.calculateUniqueLocations(this.props.journeyPlans);
      // this.setState({
      //   spinnerLoading: false,
      // });
    }

    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "JOURNEYPLANS_READ_FAILURE") {
      if (this.props.errorMessage !== prevProps.errorMessage && this.props.errorMessage.status == 401) {
        this.props.history.push("/login");
      }
    }
    if (
      this.props.journeyPlan !== prevProps.journeyPlan &&
      this.props.actionType !== prevProps.actionType &&
      this.props.actionType == "JOURNEYPLAN_READ_SUCCESS"
    ) {
      const { journeyPlans } = this.props;
      let jPlans = _.cloneDeep(journeyPlans);
      let indexResult = _.findIndex(journeyPlans, {
        _id: this.props.journeyPlan._id,
      });
      if (indexResult || indexResult == 0) {
        jPlans[indexResult] = this.props.journeyPlan;
      }

      this.calculateJourneyPlanToShow(jPlans, this.state.assetChildren, this.state.activeSummary);
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "JOURNEYPLAN_CREATE_SUCCESS") {
      this.showToastInfo(languageService("Inspection Created Successfully !"));
      this.props.getJourneyPlan();
    }
    if (
      prevState.actionType !== this.state.actionType &&
      (this.state.actionType == "JOURNEYPLAN_CREATE_FAILURE" ||
        this.state.actionType == "JOURNEYPLAN_UPDATE_FAILURE" ||
        this.state.actionType == "JOURNEYPLAN_DELETE_FAILURE")
    ) {
      if (this.props.errorMessage.status) {
        this.showToastError(languageService(this.props.errorMessage.status, this.props.errorMessage.statusText));
      } else {
        this.showToastError(languageService(this.props.errorMessage) + languageService("Work Plan"));
      }
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "JOURNEYPLAN_DELETE_SUCCESS") {
      this.showToastInfo(languageService("Inspection Deleted Successfully !"));
      this.props.getJourneyPlan();
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "JOURNEYPLAN_UPDATE_SUCCESS") {
      this.showToastInfo(languageService("Inspection Updated Successfully !"));
      let range = this.FixedDateRanges[this.state.dateFilterName];
      this.getRangeDataFromServer(range);
    }
    if (
      prevProps.lineSelectionActionType !== this.props.lineSelectionActionType &&
      this.props.lineSelectionActionType == "GET_MULTIPLE_LINES_DATA_SUCCESS"
    ) {
      // this.calculateJourneyPlanData(this.props.multiData);
    }
    if (
      this.props.templateHelperActionType !== prevProps.templateHelperActionType &&
      this.props.templateHelperActionType == "TEMPLATES_UPDATE_TEMP_REQUEST"
    ) {
      this.setState({
        spinnerLoading: true,
      });
    }
    if (
      this.props.templateHelperActionType !== prevProps.templateHelperActionType &&
      this.props.templateHelperActionType == "TEMPLATES_UPDATE_TEMP_SUCCESS"
    ) {
      if (this.state.listViewDataToShow == LIST_VIEW_SELECTION_TYPES.Calendar) {
        this.getRangeDataFromServer(
          this.props.inspectionFilter.calendarRange ? this.props.inspectionFilter.calendarRange : this.props.inspectionFilter.rangeState,
        );
      }
      if (this.state.listViewDataToShow == LIST_VIEW_SELECTION_TYPES.LIST) {
        this.getRangeDataFromServer(this.state.rangeState);
      }

      this.setState({
        spinnerLoading: false,
      });
    }
    if (this.props.assetActionType === "ASSETS_READ_SUCCESS" && this.props.assetActionType !== prevProps.assetActionType) {
      //this.setLocations(this.props.assets);
      let locationsId = [];
      filterTreeByProperties(this.props.assets.assetTree, { location: true, plannable: true }, locationsId);
      let locations = [];
      locationsId.forEach((locId) => {
        let foundAsset = _.find(this.props.assets.assetsList, { _id: locId });
        foundAsset && locations.push(foundAsset);
      });

      this.setState({ locations: locations });
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType == "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {
      let days = null;
      if (this.props.applicationlookupss && this.props.applicationlookupss.length > 0) {
        this.setState({
          daysBeforeSwitchStatusRed: this.props.applicationlookupss[0].opt2,
        });
      }
    }
    if (
      (this.state.listViewDataToShow == LIST_VIEW_SELECTION_TYPES.LinearView ||
        this.state.listViewDataToShow == LIST_VIEW_SELECTION_TYPES.SwitchStatusView) &&
      this.state.listViewDataToShow !== prevState.listViewDataToShow
    ) {
      this.props.getAssets();

    }

  }

  getAssetsByLocations(aTree, assets, locations, assetTypesToGet) {
    let assetsByLocations = {};
    locations.forEach((locId) => {
      assetsByLocations[locId] = {};
      let la = _.find(assets, { _id: locId });
      la && (assetsByLocations[locId].location = la);
      let locTreeNode = findTreeNode(aTree, locId);
      let aIds = treeToArray(locTreeNode);
      aIds.forEach((aId) => {
        let a = _.find(assets, { _id: aId });
        if (a) {
          for (let aType of assetTypesToGet) {
            if (a.assetType == aType) {
              !assetsByLocations[locId][aType] && (assetsByLocations[locId][aType] = []);
              assetsByLocations[locId][aType].push({ _id: a._id, unitId: a.unitId, start: a.start, end: a.end });
              break;
            }
          }
        }
      });
    });
    return assetsByLocations;
  }
  // Redundant as we are getting all the assets now
  calculateUniqueLocations(copyInspections) {
    let locations = [];
    let inspections = _.uniqBy(copyInspections, "lineId");
    inspections.forEach((inspection) => {
      if (inspection.tasks[0] && inspection.tasks[0].units[0]) {
        let location = {
          locStart: inspection.tasks[0].units[0].start,
          locEnd: inspection.tasks[0].units[0].end,
          _id: inspection.lineId,
          locName: inspection.tasks[0].units[0].unitId,
        };
        locations.push(location);
      }
    });
  }

  menuFilterApplied(assetChildren, options) {
    this.setState({ lineNames: [...options], assetChildren });
    this.handleUpdateFilterState({ assetChildren: assetChildren, lineNames: [...options] });
  }

  handleUpdateFilterState(propertiesToUpdate) {
    let inpsectionFilter = this.props.inspectionFilter ? this.props.inspectionFilter : {};

    this.props.updateFilterState("inspectionFilter", {
      ...inpsectionFilter,
      ...propertiesToUpdate,
    });
  }

  handelMenuClickData(assetChildren, displayMenuAll, lineNames) {
    // console.log("lineNames", lineNames);
    //let linesArray = [];
    let filterData = [];
    //let children = [];
    // assetChildren.forEach((child, index) => {
    //   children = [...children, ...child];
    // });
    //console.log("children", children);
    this.state.workPlans.forEach((wp) => {
      let findExist = _.find(assetChildren, { state: true, id: wp.lineId });

      if (findExist) {
        filterData = [...filterData, ...[wp]];
      }
    });
    //console.log("assetChildren", assetChildren);

    this.calculateJourneyPlanToShow(this.props.journeyPlans, assetChildren, this.state.activeSummary);
    this.setState({ assetChildren });

    this.handleUpdateFilterState({ assetChildren: assetChildren, lineNames: lineNames });

    //console.log("this.state.summaryValue", sumValue);
  }
  handlePageSize(pageSize) {
    this.handleUpdateFilterState({
      pageSize,
    });
  }
  showToastInfo(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  showToastError(message, error) {
    let toastMessage = message + ": " + error;
    if (!error) {
      toastMessage = message;
    }

    toast.error(toastMessage, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  handleHideShow() {
    this.setState({ summaryShowHide: this.state.summaryShowHide ? false : true });
  }
  handleAddEditModalClick(modalState, journeyPlan) {
    //console.log(modalState);
    if (modalState.target) {
      //console.log(modalState.target);
    }
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedJourneyPlan: journeyPlan,
    });
  }
  handleViewModalClick(modalState, journeyPlan) {
    // console.log(journeyPlan);
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedJourneyPlan: journeyPlan,
    });
  }

  async handleUpdateIncludeInFRA(journeyPlan) {
    await this.props.updateJourneyPlan(journeyPlan);
    let range = this.FixedDateRanges[this.state.dateFilterName];
    this.getRangeDataFromServer(range);
  }

  handleViewClick(journeyPlan, filterName, pageSize) {
    let exp_inspctn = null;
    if (journeyPlan.status == "Future Inspection" || journeyPlan.status == "Overdue" || journeyPlan.status == "Missed") {
      exp_inspctn = journeyPlan;
    }
    this.props.setFutureInspection(exp_inspctn);
    this.props.savePageNum({
      name: "workPlan",
      number: this.state.listPage,
      filter: filterName,
      pageSize: pageSize,
    });
    // this.props.getJourneyPlan(journeyPlan._id)
  }

  handleAddJourneyPlan(journeyPlan) {
    this.props.createJourneyPlan(journeyPlan);
  }

  handleEditJourneyPlan(journeyPlan, filterName, pageSize) {
    this.props.savePageNum({
      name: "workPlan",
      number: this.state.listPage,
      filter: filterName,
      pageSize: pageSize,
    });
    let copyJourneyPlan = { ...journeyPlan };
    copyJourneyPlan._id = this.state.selectedJourneyPlan._id;
    this.props.updateJourneyPlan(copyJourneyPlan);
  }

  handleDeleteClick(journeyPlan) {
    this.setState({
      confirmationDialog: true,
      planToDelete: journeyPlan,
    });
  }

  handleConfirmationToggle() {
    this.setState({
      confirmationDialog: !this.state.confirmationDialog,
    });
  }
  handleConfirmation(response) {
    if (response) {
      this.props.deleteJourneyPlan(this.state.planToDelete);
    }
    this.setState({
      planToDelete: null,
      confirmationDialog: false,
    });
  }

  calculateJourneyPlanData(allPlans) {
    this.calculateJourneyPlanToShow(allPlans, this.state.assetChildren, this.state.activeSummary);
  }
  calculateJourneyPlanToShow(jPlans, assetChildren, activeSummary) {
    //let allChildren = [];
    let jPlansDataToShow = [];
    // assetChildren &&
    //   assetChildren.forEach(children => {
    //     children.forEach(child => {
    //       allChildren.push(child);
    //     });
    //   });
    let sumVal = {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      fifth: 0,
      sixth: 0,
    };
    jPlans.forEach((jPlan) => {
      let checkMenuFilterAllowed = _.find(assetChildren, { state: true, id: jPlan.lineId });
      if (checkMenuFilterAllowed) {
        if (this.state.listViewDataToShow == LIST_VIEW_SELECTION_TYPES.Calendar) {
          jPlansDataToShow.push(jPlan);
        } else {
          sumVal.first++;
          if (activeSummary !== this.summaryLabels.first) {
            activeSummary == jPlan.status && jPlansDataToShow.push(jPlan);
          } else jPlansDataToShow.push(jPlan);
          this.calculateSummaryValue(jPlan, sumVal);
        }
      }
    });

    this.setState({
      journeyPlanToShow: jPlansDataToShow,
      summaryValue: sumVal,
    });
    this.props.clearPageNum("workPlan");
  }
  calculateSummaryValue(plan, sumVal) {
    // debugger;
    if (plan.status == this.summaryLabels.second) {
      sumVal.second = sumVal.second + 1;
    } else if (plan.status == this.summaryLabels.third) {
      sumVal.third = sumVal.third + 1;
    } else if (plan.status == this.summaryLabels.fifth) {
      sumVal.fifth = sumVal.fifth + 1;
    } else if (plan.status == this.summaryLabels.sixth) {
      sumVal.sixth = sumVal.sixth + 1;
    } else if (plan.status == this.summaryLabels.fourth) {
      sumVal.fourth = sumVal.fourth + 1;
    }
  }

  handlePageStateSave(page, pageSize) {
    this.setState({
      listPage: page,
      planPageSize: pageSize,
    });
  }

  resetPage() {
    this.setState({
      listPage: 0,
    });
  }

  setUpdateWorkplansFalse() {
    this.setState({
      workPlansUpdated: false,
    });
  }

  setDefaultObjects() {
    this.calculateJourneyPlanToShow(this.props.journeyPlans, this.state.assetChildren, this.state.activeSummary);
  }
  changeUserAndUpdate(inspector, inspection) {
    //console.log(inspection);
    //console.log(inspector);
    let result = _.find(this.state.userList, { _id: inspector });
    let tempToUpdate = { workplanTemplateId: inspection.workplanTemplateId, tempChanges: {}, date: null };
    if (result) {
      let dueDate = inspection.dueDate && moment(inspection.dueDate._d ? inspection.dueDate._d : inspection.dueDate);
      tempToUpdate.date = moment.utc(dueDate ? dueDate : inspection.date).format("YYYYMMDD");
      tempToUpdate.tempChanges = {
        user: {
          email: result.email,
          id: inspector,
          name: result.name,
        },
      };
      this.props.updateWorkPlanFutureInspection(tempToUpdate);
    }
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
  clickedFilter(filter) {
    let dateRange = this.FixedDateRanges[filter];
    this.getRangeDataFromServer(dateRange);
    let filterDateText = this.calculateFilterDateText(dateRange);
    this.handleUpdateFilterState({ rangeState: dateRange, dateFilterName: filter });
    this.setState({
      rangeState: dateRange,
      filterDateText: filterDateText,
      dateFilterName: filter,
    });
  }

  handleSummaryClick(card) {
    this.setState(
      {
        activeSummary: this.summaryLabels[card],
      },
      () => {
        this.calculateJourneyPlanToShow(this.props.journeyPlans, this.state.assetChildren, this.state.activeSummary);
        this.handleUpdateFilterState({ activeSummary: this.state.activeSummary });
      },
    );
  }

  handleListViewSelection = (listViewDataToShow) => {
    let filterDateText = this.state.filterDateText;
    if (listViewDataToShow == "List") {
      this.filters.forEach((filter) => {
        if (filter.state == true) {
          let range = this.FixedDateRanges[filter.text];
          this.getRangeDataFromServer(range);
          filterDateText = this.calculateFilterDateText(range);
        }
      });
    }

    this.handleUpdateFilterState({ listViewDataToShow: listViewDataToShow });
    this.setState({ listViewDataToShow, filterDateText: filterDateText });
  };

  getDateControls(CalendarControlsComp) {
    this.setState({
      CalendarControlsComp: CalendarControlsComp,
    });
  }
  handleSpinnerMethods(props, prevProps) {
    if (props.assetTreeActionType !== prevProps.assetTreeActionType) {
      this.setState({
        spinnerLoading: props.assetTreeActionType == "ASSETTREE_READ_REQUEST" ? true : false,
      });
    }
    if (props.assetTestActionType !== prevProps.assetTestActionType) {
      this.setState({
        spinnerLoading: props.assetTestActionType == "ASSETTESTS_READ_REQUEST" ? true : false,
      });
    }
    if (props.testScheduleActionType !== prevProps.testScheduleActionType) {
      this.setState({
        spinnerLoading: props.testScheduleActionType == "TESTSCHEDULES_READ_REQUEST" ? true : false,
      });
    }
  }
  render() {
    const { path } = this.props.match;
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    let timpsSignalApp = versionInfo.isSITE();

    return (
      <Col id="mainContent" md="12">
        <Loader
          assetTreeActionType={this.props.assetTreeActionType}
          assetTestActionType={this.props.assetTestActionType}
          testScheduleActionType={this.props.testScheduleActionType}
          journeyPlanActionType={this.props.actionType}
          actionMethods={["READ"]}
        />
        {modelRendered}
        <ConfirmationDialog
          modal={this.state.confirmationDialog}
          toggle={this.handleConfirmationToggle}
          handleResponse={this.handleConfirmation}
          confirmationMessage={languageService("Are you sure you want to delete")}
          headerText={languageService("Confirm Deletion")}
        />
        <JourneyPlanAdd
        modal={this.state.addModal}
        toggle={this.handleAddEditModalClick}
        modalState={this.state.modalState}
        handleAddSubmit={this.handleAddJourneyPlan}
        handleEditSubmit={this.handleEditJourneyPlan}
        selectedJourneyPlan={this.state.selectedJourneyPlan}
        journeyPlans={this.props.journeyPlans}
        viewWpTemplateFlag={true}
        inspectionTypes = {() => this.props.getApplicationlookupss(["inspectionTypes"])}
        inspectionT = {this.props.applookups}
        workPlanTemplates={this.props.workPlanTemplates}
        userList={this.state.userList}
      />
        {/* <JourneyPlanAdd
          modal={this.state.addModal}
          toggle={this.handleAddEditModalClick}
          modalState={this.state.modalState}
          handleAddSubmit={this.handleAddJourneyPlan}
          handleEditSubmit={this.handleEditJourneyPlan}
          selectedJourneyPlan={this.state.selectedJourneyPlan}
          userList={this.state.userList}
          //viewFlag={true}
          journeyPlans={this.props.journeyPlans}
          workPlanTemplates={this.props.workPlanTemplates}
        />
        */}
        <Row style={themeService(commonStyles.pageBorderRowStyle)}>
          <Col lg="9" md="6" sm="6" style={{ paddingLeft: "0px", position: "unset" }}>
            <div style={themeService(journeyPlanMainStyles.pageTitle)}>{languageService("Inspections")}</div>
            {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.LIST && (
              <JourneySmartPlanSummary
                descriptions={this.summaryDesc}
                values={this.state.summaryValue}
                handleAddNewClick={this.handleAddEditModalClick}
                permissionCheckProps={true}
                permissionCheck={permissionCheck("WORKPLAN", "create")}
                addTootTipText={"Plan"}
                handleSummaryClick={this.handleSummaryClick}
                summaryShowHide={!this.state.summaryShowHide}
                handleHideShow={this.handleHideShow}
                summaryLabels={this.summaryLabels}
              />
            )}
            {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.Calendar && this.state.CalendarControlsComp}
          </Col>

          <Col lg="3" md="6" sm="6">
            <ViewChangerComponent
              LIST_VIEW_SELECTION={this.LIST_VIEW_SELECTION}
              listViewDataToShow={this.state.listViewDataToShow}
              handleListViewSelection={this.handleListViewSelection}
              placement="TOP_OF_PAGE"
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <MenuFilter
              menuFilterApplied={this.menuFilterApplied}
              handelMenuClickData={this.handelMenuClickData}
              displayMenuAll={this.state.displayMenuAll}
              assetChildren={this.state.assetChildren}
              lineNames={this.state.lineNames}
            ></MenuFilter>
          </Col>
        </Row>
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.LinearView && (
          <InspectionsLinearView
            inspections={this.state.journeyPlanToShow}
            locations={this.state.locations}
            locationFilterStates={this.state.assetChildren}
          />
        )}
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.SwitchStatusView && timpsSignalApp == false && (
          <InspectionAssetStatusView
            inspections={this.state.journeyPlanToShow}
            assetsByLocations={this.state.assetsByLocations}
            mode="Switch"
            locationFilterStates={this.state.assetChildren}
            daysBeforeSwitchAlert={this.state.daysBeforeSwitchStatusRed}
          />
        )}
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.SwitchStatusView && timpsSignalApp == true && (
          <div>Inspection fixed assets status view under construction</div>
        )}
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.SignalAppView && (
          <InspectionsLinearView
            inspections={this.state.journeyPlanToShow}
            locations={this.state.locations}
            mode="SignalApp"
            assetTypes={this.props.assets && this.props.assets.assetTypes ? this.props.assets.assetTypes : []}
            locationFilterStates={this.state.assetChildren}
          />
        )}
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.AssetCalendar && (
          <React.Fragment>
            <AssetInspections
              actionType={this.props.assetTreeActionType}
              getAssetTree={this.props.getAssetTree}
              locationFilterStates={this.state.assetChildren}
              locations={this.state.locations}
              assetTree={this.props.assetTree}
              getAssetTests={this.props.getAssetTests}
              assetTests={this.props.assetTests}
              assetTestActionType={this.props.assetTestActionType}
              getRangeDataFromServer={this.getRangeDataFromServer}
              testSchedules={this.props.testSchedules}
              testScheduleActionType={this.props.testScheduleActionType}
            />
          </React.Fragment>
        )}

        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.Calendar && (
          <React.Fragment>
            <CalendarInspections
              getDateControls={this.getDateControls}
              getRangeDataFromServer={this.getRangeDataFromServer}
              actionType={this.props.actionType}
              lineSelectionActionType={this.props.lineSelectionActionType}
              multiData={this.props.multiData}
              userList={this.state.userList}
              changeUserAndUpdate={this.changeUserAndUpdate}
              //journeyPlans={this.props.journeyPlans}
              journeyPlans={this.state.journeyPlanToShow}
              //journeyPlans={this.state.workPlans}
              handleViewClick={this.handleViewClick}
              history={this.props.history}
              assetChildren={this.state.assetChildren}
              inspectionFilter={this.props.inspectionFilter}
              handleUpdateFilterState={this.handleUpdateFilterState}
            />
            <ColorsLegend template={inspectionTemplate}></ColorsLegend>
          </React.Fragment>
        )}
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.LIST && (
          <div>
            <Row
              style={{
                transition: "all .3s ease-in-out",
                opacity: this.state.summaryShowHide ? "1" : "0",
                height: this.state.summaryShowHide ? "60px" : "0",
              }}
            >
              <Col md="12">
                <div style={themeService(journeyPlanStyles.journeyPlanSummaryHeadingContainer)}>
                  <h4 style={themeService(journeyPlanStyles.journeyPlanSummaryHeadingStyle)}>{languageService("Inspections Summary")}</h4>
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
                <JourneyPlanSummary
                  descriptions={this.summaryDesc}
                  values={this.state.summaryValue}
                  handleAddNewClick={this.handleAddEditModalClick}
                  permissionCheckProps={true}
                  permissionCheck={permissionCheck("WORKPLAN", "create")}
                  addTootTipText={"Plan"}
                  handleSummaryClick={this.handleSummaryClick}
                  summaryShowHide={this.state.summaryShowHide}
                  handleHideShow={this.handleHideShow}
                  summaryLabels={this.summaryLabels}
                />
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <div style={themeService(journeyPlanStyles.journeyPlanSummaryHeadingContainer)}>
                  <h4 style={themeService(journeyPlanStyles.journeyPlanSummaryHeadingStyle)}>{languageService("Inspections")}</h4>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <JourneyPlanList
                  path={path}
                  resetPage={this.resetPage}
                  planningTableData={this.state.journeyPlanToShow}
                  setWorkPlansUpdatedFalse={this.setUpdateWorkplansFalse}
                  workPlansUpdated={this.state.workPlansUpdated}
                  handleEditClick={this.handleAddEditModalClick}
                  handleViewModalClick={this.handleViewModalClick}
                  handleDeleteClick={this.handleDeleteClick}
                  handleViewClick={this.handleViewClick}
                  actionType={this.props.actionType}
                  handlePageSave={this.handlePageStateSave}
                  handlePageSize={this.handlePageSize}
                  page={this.state.listPage}
                  planFilter={this.state.planFilter}
                  pageSize={this.state.pageSize}
                  userList={this.state.userList}
                  handleUpdateIncludeInFRA={this.handleUpdateIncludeInFRA}
                  changeUserAndUpdate={this.changeUserAndUpdate}
                  permissionCheckProps={true}
                  permissionCheck={permissionCheck("INSPECTION TEMP WORKER", "view")}
                  customFilterComp={
                    <DateAndLineFilter
                      calculateSummaryData={this.calculateJourneyPlanData}
                      data={this.props.journeyPlans}
                      selectedLine={this.props.selectedLine}
                      setDefaultObjects={this.setDefaultObjects}
                      getMultiLineData={this.props.getMultiLineData}
                      apiCall="journeyPlan"
                      multiData={this.props.multiData}
                      dateFilters={this.filters}
                      getRangeFromServer={this.getRangeAddToday}
                      clickedFilter={this.clickedFilter}
                      dateFilterName={this.state.dateFilterName}
                      fixedDateRanges={this.FixedDateRanges}
                      filterDateText={this.state.filterDateText}
                    />
                  }
                />
              </Col>
            </Row>
          </div>
        )}
      </Col>
    );
  }
}
const getAssets = curdActions.getAssets;
const getAssetType = curdActions.getAssetType;
const getApplicationlookupss = curdActions.getApplicationlookupss;
const getTestSchedules = curdActions.getTestSchedules;
const getAssetTests = curdActions.getAssetTests;
const getAssetTree = curdActions.getAssetTree;
const getWorkPlanTemplates = curdActions.getWorkPlanTemplates;

let variables = {
  userReducer: {
    userList: [],
  },
  sodReducer: {
    sodList: [],
  },
  utilReducer: {
    planPageNum: 0,
    planFilter: "all",
    planPageSize: 10,
  },
  lineSelectionReducer: {
    selectedLine: {},
    multiData: [],
  },
  inspectionHelperReducer: {
    futureInspection: null,
  },
  templateHelperReducer: {
    noVar: "",
  },
  filterStateReducer: {
    inspectionFilter: null,
  },
  assetTypeReducer: {
    assetTypes: null,
  },
  assetReducer: { assets: [] },
  applicationlookupsReducer: {
    applicationlookupss: [],
  },
  testScheduleReducer: {
    testSchedules: [],
  },
  assetTestReducer: {
    assetTests: [],
  },
  assetTreeReducer: {
    assetTree: null,
  },
  workPlanTemplateReducer: {
    workPlanTemplates: [],
  },
};

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: {
    userListRequest,
    getSODs,
    savePageNum,
    clearPageNum,
    getMultiLineData,
    setFutureInspection,
    updateWorkPlanFutureInspection,
    updateFilterState,
    getAssetType,
    getAssets,
    getApplicationlookupss,
    getTestSchedules,
    getAssetTests,
    getAssetTree,
    getWorkPlanTemplates
  },
};
let containerReducers = [
  "userReducer",
  "sodReducer",
  "utilReducer",
  "lineSelectionReducer",
  "inspectionHelperReducer",
  "templateHelperReducer",
  "filterStateReducer",
  "assetTypeReducer",
  "assetReducer",
  "applicationlookupsReducer",
  "testScheduleReducer",
  "assetTestReducer",
  "assetTreeReducer",
  "workPlanTemplateReducer"
];
let customItems = [
  {
    name: "applookup",
    apiName: "applicationlookups",
  },
];
let JourneyPlanContainer = CRUDFunction(JourneyPlan, "journeyPlan", actionOptions, variables, containerReducers, null , customItems);
export default JourneyPlanContainer;


