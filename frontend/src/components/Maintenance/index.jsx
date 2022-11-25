/* eslint eqeqeq: 0 */

import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { CRUDFunction } from "reduxCURD/container";
import SvgIcon from "react-icons-kit";
// import { withPlus } from "react-icons-kit/entypo/withPlus";
import { curdActions } from "reduxCURD/actions";
import MaintenanceList from "./MaintenanceList/index";
import moment from "moment";
import _ from "lodash";
import { toast } from "react-toastify";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import permissionCheck from "utils/permissionCheck.js";
// import { savePageNum, clearPageNum } from "reduxRelated/actions/utilActions";
import SpinnerLoader from "components/Common/SpinnerLoader";
// import { fontStyleHeadings2, CommonSummaryStyles } from "components/Common/styles.js";
import MaintenanceSummary from "components/Common/Summary/CommonSummary";
import MaintenanceSmartSummary from "components/Common/SmartSummary/SmartSummary";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import CustomFilters from "components/Common/Filters/CustomFilters";
import DateRangeSelector from "components/Common/DateRangeSelector";
// import { substractObjects } from "utils/utils";
import { languageService } from "../../Language/language.service";
import AddMaintenance from "./AddMaintenance/AddMaintenance";
// import { server } from "react-icons-kit/fa/server";
// import { thList } from "react-icons-kit/fa/thList";
// import { globe } from "react-icons-kit/fa/globe";
import { Tooltip } from "reactstrap";
import CommonModal from "components/Common/CommonModal";
import MultiLineSelection from "components/Common/MultiLineSelection";
import { userListByGroupRequest, userListRequest } from "../../reduxRelated/actions/userActions";
import { LineView } from "./LineView";
import { getMultiLineData } from "reduxRelated/actions/lineSelectionAction";
import { MaintenanceGISView } from "./MaintenanceGISView";
// import PlanMaintenanceForm from "./Plan";
// import MaintenanceExecuteForm from "./MaintenanceExecute";
// import MaintenanceCloseForm from "./MaintenanceClose";
import AddToWorkOrderForm from "./AddToWorkOrderForm";
import { getAssetLinesWithSelf, getInspectableAssets } from "../../reduxRelated/actions/assetHelperAction";
import { getWorkOrders } from "../../reduxRelated/actions/workorderActions";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
import { maintenanceTemplate } from "../../templates/MaintenanceTemplate";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonStyles } from "../../theme/commonStyles";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";

import { getCurrentMaintenanceStateFilters, TEMPLATE_MAINTENANCE_FILTERS } from "./HelperFunctions/stateRetentionManagement";
import { LIST_VIEW_SELECTION_TYPES, LIST_VIEW_SELECTION } from "./ViewSelection.js";
import MenuFilter from "components/Common/MenuFilters/index";

import { getStatusColor } from "utils/statusColors";
import ViewChangerComponent from "components/Common/ViewChangerComponent/ViewChangerComponent";

// const LIST_VIEW_SELECTION_TYPES = {
//   LIST: "List",
//   MAP: "Map",
//   GIS: "GIS",
// };

// const LIST_VIEW_SELECTION = [
//   {
//     title: LIST_VIEW_SELECTION_TYPES.GIS,
//     icon: globe,
//     tooltip: {
//       show: false,
//       text: "GIS",
//     },
//   },
//   {
//     title: LIST_VIEW_SELECTION_TYPES.MAP,
//     icon: server,
//     tooltip: {
//       show: false,
//       text: "Track Chart",
//     },
//   },
//   {
//     title: LIST_VIEW_SELECTION_TYPES.LIST,
//     icon: thList,
//     tooltip: {
//       show: false,
//       text: "List",
//     },
//   },
// ];

class Maintenance extends Component {
  constructor(props) {
    super(props);
    this.maintenanceFilter = getCurrentMaintenanceStateFilters(this.props.maintenanceFilter);
    this.state = {
      maintenanceList: [],
      filterData: [],
      addModal: false,
      selectedMaintenance: null,
      confirmationDialog: false,
      modalState: "",
      actionType: "",
      spinnerLoading: false,
      summaryShowHide: true,
      ...this.maintenanceFilter,
      usersActionType: "",

      summaryValue: { first: 0, second: 0, third: 0, fourth: 0, sixth: 0, seventh: 0 },

      listFilter: this.props.planFilter,

      tooltip: null,
      // listViewDataToShow: this.maintenanceFilter ? this.maintenanceFilter.listViewDataToShow : LIST_VIEW_SELECTION_TYPES.LIST,

      dateSelectionDialog: false,
      dateSelectionAction: "",
      filters: [
        { text: "Plan Date", state: false, logic: 1 },
        { text: "Created", state: false, logic: 1 },
      ],
      lineFilters: [{ text: "Line's", state: false, logic: 2 }],
      filterDateText: "",
      lineSelectionDialog: false,
      linearDataSort: "",
      pmModal: false,
      // meModal: false,
      // mcModal: false,
      maintenanceToPlan: {},
      // maintenanceToExecute: {},
      // maintenanceToClose: {},
      notStartedWorkOrders: [],

      maintenanceTypes: [],
      displayMenuAll: true,
    };

    this.summaryLabels = {
      first: "Total",
      second: maintenanceTemplate.notPlanned.label,
      third: maintenanceTemplate.inProgress.label,
      fourth: maintenanceTemplate.planned.label,
      sixth: maintenanceTemplate.closed.label,
      seventh: maintenanceTemplate.planning.label,
    };

    this.summaryDesc = {
      ...this.summaryLabels,
      second: languageService(maintenanceTemplate.notPlanned.detailLabel),
      third: languageService(maintenanceTemplate.inProgress.label),
      fourth: languageService(maintenanceTemplate.planned.label),
      sixth: languageService(maintenanceTemplate.closed.label),
      seventh: languageService(maintenanceTemplate.planning.label),
    };

    this.rowColorMap = [
      { fieldName: "status", value: maintenanceTemplate.notPlanned.label, textColor: getStatusColor(maintenanceTemplate.notPlanned.label) },
      { fieldName: "status", value: maintenanceTemplate.inProgress.label, textColor: getStatusColor(maintenanceTemplate.inProgress.label) },
      { fieldName: "status", value: maintenanceTemplate.planned.label, textColor: getStatusColor(maintenanceTemplate.planned.label) },
      { fieldName: "status", value: maintenanceTemplate.closed.label, textColor: getStatusColor(maintenanceTemplate.closed.label) },
      { fieldName: "status", value: maintenanceTemplate.planning.label, textColor: getStatusColor(maintenanceTemplate.planning.label) },
    ];

    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleDateSelectionClick = this.handleDateSelectionClick.bind(this);
    this.handleDateSelectionCancel = this.handleDateSelectionCancel.bind(this);
    this.handleAddEditMaintenanceModalClick = this.handleAddEditMaintenanceModalClick.bind(this);
    this.editMaintenance = this.editMaintenance.bind(this);
    this.handleAddEditMaintaineceToServer = this.handleAddEditMaintaineceToServer.bind(this);
    this.handleSubmitLineModalClick = this.handleSubmitLineModalClick.bind(this);
    this.handleLinesCancelClick = this.handleLinesCancelClick.bind(this);
    this.setFilterLines = this.setFilterLines.bind(this);
    this.handleLinearMaintenanceSortSelect = this.handleLinearMaintenanceSortSelect.bind(this);
    this.handleLineMaintenanceClick = this.handleLineMaintenanceClick.bind(this);
    this.handlePlanClick = this.handlePlanClick.bind(this);
    this.handleSubmitPMModalClick = this.handleSubmitPMModalClick.bind(this);
    this.handlePMCancelClick = this.handlePMCancelClick.bind(this);
    // this.handleExecuteClick = this.handleExecuteClick.bind(this);
    // this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleSummaryClick = this.handleSummaryClick.bind(this);
    this.handleHideShow = this.handleHideShow.bind(this);
    this.menuFilterApplied = this.menuFilterApplied.bind(this);
    this.handelMenuClickData = this.handelMenuClickData.bind(this);
    this.handleUpdateFilterState = this.handleUpdateFilterState.bind(this);
    this.calculateSummaryDataCalculated = this.calculateSummaryDataCalculated.bind(this);
    this.handlePageSize = this.handlePageSize.bind(this);
    this.handleUpdateMaintenance = this.handleUpdateMaintenance.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.showToastSuccess = this.showToastSuccess.bind(this);
  }

  componentDidMount() {
    this.props.userListRequest();
    this.props.getInspectableAssets();
    //if(this.props.lineAssets.length===0)
    this.props.getAssetLinesWithSelf();
    this.props.getMaintenances();
    this.props.getWorkOrders();
    this.props.getApplicationlookupss(["maintenanceTypes", "crewSkills", "equipmentTypes", "materialTypes"]); //, "crewSkills", "equipmentTypes", "materialTypes"]);
    //this.props.updateFilterState("workOrderFilters", {}); // other filter to maintain here
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('maintenance actiontype:', this.props.actionType,this.props.lineSelectionActionType, this.props);
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "MAINTENANCES_READ_SUCCESS") {
      // if (this.maintenanceFilter.assetChildren) {
      //   this.handelMenuClickData(this.state.assetChildren, "", this.state.lineNames);
      // } else {
      //let sumval = this.calculateSummaryData(this.props.maintenances);
      let sumval = this.calculateSummaryDataCalculated(this.props.maintenances, this.state.assetChildren, this.state.activeSummary);
      this.setState({
        summaryValue: sumval.sumval,
        maintenanceList: this.props.maintenances,
        filterData: sumval.filterData,
      });
      // }
    }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "MAINTENANCE_CREATE_SUCCESS") {
      this.props.getMaintenance();
      this.showToastSuccess(languageService("Work Order Created Successfully"));
      //this.props.selectedLine._id);
    }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "MAINTENANCE_UPDATE_SUCCESS") {
      this.props.getMaintenance(); //this.props.selectedLine._id);
      this.showToastSuccess(languageService("Work Order Updated Successfully"));
    }
    // if (
    //   prevProps.lineSelectionActionType !== this.props.lineSelectionActionType &&
    //   this.props.lineSelectionActionType == "GET_MULTIPLE_LINES_DATA_SUCCESS"
    // ) {
    //   let sumval = this.calculateSummaryData(this.props.multiData);
    //   this.setState({
    //     summaryValue: sumval,
    //     maintenanceList: this.props.multiData,
    //     filterData: this.props.multiData,
    //   });
    // }
    if (prevProps.workorderActionType !== this.props.workorderActionType && this.props.workorderActionType === "WORKORDERS_READ_SUCCESS") {
      this.setNotStartedWorkorders(this.props.workorders);
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType === "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {
      this.setApplicationLists(this.props.applicationlookupss);
    }
    // if(prevProps.assetHelperActionType !== this.props.assetHelperActionType &&
    // this.props.assetHelperActionType == "GET_LINE_ASSETS_SUCCESS")
    // {
    //   //this.props.lineAssets[]
    // }
  }
  showToastSuccess(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  showToastError(message, error) {
    toast.error(message + ": " + error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  handleUpdateFilterState(propertiesToUpdate) {
    let maintenanceFilter = this.props.maintenanceFilter ? this.props.maintenanceFilter : {};

    this.props.updateFilterState("maintenanceFilter", {
      ...maintenanceFilter,
      ...propertiesToUpdate,
    });
  }
  menuFilterApplied(assetChildren, options) {
    this.setState({ lineNames: [...options], assetChildren });
    this.handleUpdateFilterState({ assetChildren: assetChildren, lineNames: [...options] });
  }
  handelMenuClickData(assetChildren, displayMenuAll, lineNames) {
    //console.log("maintenanceList", this.state.maintenanceList);
    // let linesArray = [];
    // let filterData = [];
    // let children = [];

    // assetChildren.forEach((child, index) => {
    //   children = [...children, ...child];
    // });

    //console.log("children", children);
    // this.state.workPlans.forEach(wp => {
    //   let findExist = _.find(children, { state: true, id: wp.lineId });
    //   if (findExist) {
    //     filterData = [...filterData, ...[wp]];
    //   }
    // });

    let maintenanceToShow = [];
    this.state.maintenanceList.forEach((maintenance) => {
      let checkMenuFilterAllowed = _.find(assetChildren, { state: true, id: maintenance.lineId });
      if (checkMenuFilterAllowed) {
        maintenanceToShow.push(maintenance);
      }
    });
    //console.log("maintenanceToShow", maintenanceToShow);
    this.handleUpdateFilterState({
      assetChildren,
      lineNames,
    });
    let sumval = this.calculateSummaryData(maintenanceToShow);
    this.setState({
      summaryValue: sumval,
      filterData: maintenanceToShow,
    });
    // //console.log("assetChildren", assetChildren);
    // this.calculateJourneyPlanToShow(this.props.journeyPlans, assetChildren, this.state.activeSummary);
    // this.setState({ assetChildren });
    // this.handleUpdateFilterState({ assetChildren: assetChildren, lineNames: lineNames });
    // //console.log("this.state.summaryValue", sumValue);
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
  calculateSummaryData(maintenancesData) {
    let sumVal = {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      sixth: 0,
      seventh: 0,
    };
    sumVal.first = maintenancesData.length;

    maintenancesData.forEach((m) => {
      if (m.status == "New") {
        sumVal.second++;
      } else if (m.status == "In Progress") {
        sumVal.third++;
      } else if (m.status == "Planned") {
        sumVal.fourth++;
      } else if (m.status == "Closed") {
        sumVal.sixth++;
      } else if (m.status == "Planning") {
        sumVal.seventh++;
      }
    });
    return sumVal;
  }
  calculateSummaryDataCalculated(maintenancesData, assetChildren, activeSummary) {
    //let children = [];
    let filterData = [];
    // assetChildren.forEach((child, index) => {
    //   children = [...children, ...child];
    // });

    let maintenanceToShow = [];
    if (assetChildren) {
      maintenancesData.forEach((maintenance) => {
        let checkMenuFilterAllowed = _.find(assetChildren, { state: true, id: maintenance.lineId });
        if (checkMenuFilterAllowed) {
          maintenanceToShow.push(maintenance);
        }
      });
    } // todo: fix this the right way. if you press F5 on the page the asset children is null so no maintenace is displayed
    else {
      maintenanceToShow = maintenancesData;
    }

    this.handleUpdateFilterState({
      assetChildren,
      activeSummary,
    });
    let sumval = this.calculateSummaryData(maintenanceToShow);
    if (activeSummary !== this.summaryLabels.first) {
      filterData = maintenanceToShow.filter((el) => el.status == activeSummary);
    } else {
      filterData = [...maintenanceToShow];
    }
    return { sumval, maintenances: maintenanceToShow, filterData };
  }
  setNotStartedWorkorders(notStartedWorkOrders) {
    this.setState({ notStartedWorkOrders: notStartedWorkOrders });
    //console.log('not started workorders', notStartedWorkOrders);
  }

  handleViewClick(maintenance, filterName, pageSize) {
    //this.props.savePageNum({ name: 'maintenance', number: this.state.listPage, filter: filterName, pageSize: pageSize });
    //this.props.getMaintenance(maintenance._id);
    //console.log(pageSize);
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
      // let crewSkills = this.getListType("crewSkills", lists);
      // let equipmentTypes = this.getListType("equipmentTypes", lists);
      // let materialTypes = this.getListType("materialTypes", lists);

      this.setState({ maintenanceTypes: maintenanceTypes }); //, crewSkills: crewSkills, equipmentTypes: equipmentTypes, materialTypes: materialTypes});
    }
  }
  handleFilterClick(filter) {
    if (filter.logic == 1) {
      if (filter.state) {
        this.setState({
          dateSelectionDialog: true,
          dateSelectionAction: filter.text,
        });
      } else {
        this.clearAllDateFilters();
      }
    } else if (filter.state && filter.logic == 2) {
      this.setState({
        lineSelectionDialog: true,
      });
      this.openModelMethod();
    } else {
      this.clearLineFilter();
    }
  }
  filterData(dataCollection, key, from, to, isEqual = null, isGreater = null, isLess = null) {
    if (!isGreater)
      isGreater = (a, b) => {
        return a > b;
      };
    if (!isLess)
      isLess = (a, b) => {
        return a < b;
      };
    if (!isEqual)
      isEqual = (a, b) => {
        return a === b;
      };

    if (to == undefined) to = from;

    let filteredData = dataCollection.filter((d) => {
      let grt = isGreater(d[key], from);
      let eqf = isEqual(d[key], from);
      let lst = isLess(d[key], to);
      let eqt = isEqual(d[key], to);

      return d && d.hasOwnProperty(key) && (grt || eqf) && (lst || eqt);
      //(d[key]>=from && d[key]<=to));
    });

    return filteredData;
  }
  handleDateSelectionClick(range) {
    let action = this.state.dateSelectionAction;
    let allData = this.props.maintenances;
    if (this.state.lineFilters[0].state) {
      allData = this.props.multiData;
    }
    let cols = [];
    cols["Plan Date"] = "dueDate";
    cols["Created"] = "createdAt";
    if (cols[action] == undefined) {
      return;
    }
    //console.log(cols);
    allData = this.filterData(
      allData,
      cols[action],
      range.from,
      range.to,
      (a, b) => {
        return moment(a).isSame(b, "day");
      },
      (a, b) => {
        return moment(a).isAfter(b, "day");
      },
      (a, b) => {
        return moment(a).isBefore(b, "day");
      },
    );

    let filterDateText = "";
    if (range && range.from != undefined) {
      filterDateText = range.from.toLocaleDateString("en-US");

      if (range.to != undefined && range.from.getTime() != range.to.getTime()) {
        filterDateText += " to " + range.to.toLocaleDateString("en-US");
      }
    }

    let sumval = this.calculateSummaryData(allData);
    this.handleUpdateFilterState({
      summaryValue: sumval,
    });
    this.setState({
      summaryValue: sumval,
      dateSelectionDialog: !this.state.dateSelectionDialog,
      filterDateText: filterDateText,
      maintenanceList: allData,
      dateRange: range,
      filterData: allData,
    });
  }
  clearAllDateFilters(additionalState = null) {
    let allData = this.props.maintenances;
    if (this.state.lineFilters[0].state) {
      allData = this.props.multiData;
    }
    let sumval = this.calculateSummaryData(allData);

    let st = {
      filterDateText: "",
      summaryValue: sumval,
      maintenanceList: allData,
      filterData: allData,
    };

    if (additionalState) {
      st = Object.assign(st, additionalState);
    }
    this.setState(st);
  }

  clearLineFilter() {
    if (this.state.filterDateText) {
      let lineFilters = _.cloneDeep(this.state.lineFilters);
      for (let lineFilter of lineFilters) {
        lineFilter.state = false;
      }
      let newobj = [...this.state.maintenanceList];
      _.remove(newobj, (mntnce) => {
        return mntnce.lineId !== this.props.selectedLine._id;
      });
      let sumval = this.calculateSummaryData(newobj);
      this.handleUpdateFilterState({
        summaryValue: sumval,
      });
      this.setState({
        maintenanceList: newobj,
        filterData: newobj,
        summaryValue: sumval,
      });
    }
    //else {
    //   //if (this.props.selectedLine._id) {
    //     //  this.props.getRunOfLines(this.props.selectedLine._id)
    //     this.props.getMaintenances();//this.props.selectedLine._id);
    //   //} else {
    //    // this.props.history.push("/line/maintenancebacklog");
    //   //}
    // }
  }
  handleDateSelectionCancel() {
    //clear all filters
    let filters = _.cloneDeep(this.state.filters);
    for (let filter of filters) {
      filter.state = false;
    }
    this.clearAllDateFilters({ filters: filters, dateSelectionDialog: false });

    //this.setState({filters: filters, dateSelectionDialog: !this.state.dateSelectionDialog, filterDateText:'', maintenanceList: this.props.maintenances});
  }

  handleAddEditMaintaineceToServer(mntnce, modalState) {
    // let assignedUserObj = _.find(this.props.userList, { _id: mntnce.assignedTo });
    // if (assignedUserObj) {
    //   mntnce.assignedTo = { id: assignedUserObj._id, email: assignedUserObj.email, name: assignedUserObj.name };
    if (modalState == "Add") {
      // // //mntnce.lineId = //this.props.selectedLine._id;
      // // //mntnce.lineName = //this.props.selectedLine.unitId;
      this.props.createMaintenance(mntnce);
    } else if (modalState == "Edit") {
      mntnce._id = this.state.selectedMaintenance._id;

      this.props.updateMaintenance(mntnce);
    }
    // } else {
    //   console.log("Cant Find the Assigned User in Users : ", mntnce.assignedTo);
    // }
    this.setState({
      addModal: !this.state.addModal,
      modalState: "None",
      selectedMaintenance: null,
    });
  }

  handleAddEditMaintenanceModalClick(modalState, maintenance) {
    let selectedMaintenance = this.state.selectedMaintenance;
    if (maintenance) {
      selectedMaintenance = maintenance;
    }
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedMaintenance: selectedMaintenance,
    });
  }

  editMaintenance(modalState, maintenance) {
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedMaintenance: maintenance,
    });
  }

  handlePlanClick(m1) {
    //this.setState({ pmModal: true, maintenanceToPlan: m1 });
    // set filter state to this m1
    // history dot push to workorders

    this.props.updateFilterState("workOrderFilters", { ...this.props.workOrderFilters, mr: m1 });
    this.props.history.push("/workorders");
  }

  handleSubmitPMModalClick = (planMaintenance) => {
    //let assignedTo = this.props.userList.find(user => user._id === planMaintenance.assignedTo);
    // planMaintenance = { ...this.state.maintenanceToPlan, ...planMaintenance, assignedTo };

    this.setState({ pmModal: false, maintenanceToPlan: {} });

    // this.props.updateMaintenance(planMaintenance);
  };

  // handleExecuteClick(m1) {
  //   this.setState({ meModal: true, maintenanceToExecute: m1 });
  // }
  // handleCloseClick(m1) {
  //   this.setState({ mcModal: true, maintenanceToClose: m1 });
  // }

  // handleSubmitPMModalClick = planMaintenance => {
  //   let assignedTo = this.props.userList.find(user => user._id === planMaintenance.assignedTo);
  //   planMaintenance = { ...this.state.maintenanceToPlan, ...planMaintenance, assignedTo };

  //   this.setState({ pmModal: false, maintenanceToPlan: {} });

  //   this.props.updateMaintenance(planMaintenance);
  // };
  // handleSubmitmeModalClick = m1 => {
  //   m1._id = this.state.maintenanceToExecute._id;
  //   this.setState({ meModal: false, maintenanceToExecute: {} });
  //   this.props.updateMaintenance(m1);
  // };
  // handleSubmitmcModalClick = m1 => {
  //   m1._id = this.state.maintenanceToClose._id;
  //   this.setState({ mcModal: false, maintenanceToClose: {} });
  //   this.props.updateMaintenance(m1);
  // };

  handlePMCancelClick = () => {
    ///console.log('here in cancel');
  };

  handleSubmitLineModalClick() {
    let filters = _.cloneDeep(this.state.filters);
    filters.forEach((fil) => {
      fil.state = false;
    });
    this.setState({
      filters: filters,
    });
    this.getLineFilterMethod();
  }
  handleLinesCancelClick() {
    let lineFilters = _.cloneDeep(this.state.lineFilters);
    for (let lineFilter of lineFilters) {
      lineFilter.state = false;
    }
    this.setState({
      lineFilters: lineFilters,
    });
  }

  setFilterLines(linestoGet) {
    let linesArray = [];
    linestoGet.forEach((element) => {
      if (element.showDataOf) {
        linesArray.push(element._id);
      }
    });
    if (linesArray.length > 0) {
      this.props.getMultiLineData(linesArray, "maintenance");
      //this.props.getMultiLineData(linesArray, "asset");
      //console.log('Multiline array:',linesArray);
    }
  }
  getMPLocation(Locs) {
    let l =
      !Locs || Locs.length == 0
        ? { start: 0, end: 0 }
        : Locs[0].type === "Milepost"
        ? Locs[0]
        : Locs.length > 1 && Locs[1].type === "Milepost"
        ? Locs[1]
        : { start: 0, end: 0 }; //null;
    return l;
  }

  handleLineMaintenanceClick(cm, opt = "item") {
    if (opt === "title") {
      let m1 = this.state.maintenanceList.find((m1) => {
        return m1.mrNumber === cm;
      });
      if (m1) {
        this.props.history.push("/maintenancebacklogs/" + m1._id);
      }
      return;
    }
    this.props.history.push("/maintenancebacklogs/" + cm);
  }
  handleLinearMaintenanceSortSelect(sort) {
    if (sort.state) {
      let maintenances = _.cloneDeep(this.state.maintenanceList);
      maintenances = _.sortBy(maintenances, [
        (o) => {
          return this.getMPLocation(o.location).start;
        },
      ]);
      this.setState({ maintenanceList: maintenances, linearDataSort: sort.text, filterData: maintenances });
    } else {
      let maintenances = _.cloneDeep(this.state.maintenanceList);
      maintenances = _.sortBy(maintenances, [
        (o) => {
          return o.createdAt;
        },
      ]);
      this.setState({ maintenanceList: maintenances, linearDataSort: "", filterData: maintenances });
    }
  }
  toggleTooltip = (tooltip) => {
    if (this.state.tooltip) {
      this.setState({ tooltip: null });
    } else {
      this.setState({ tooltip });
    }
  };

  handleListViewSelection = (listViewDataToShow) => {
    this.setState({ listViewDataToShow });
    this.handleUpdateFilterState({
      listViewDataToShow,
    });
  };

  handleSummaryClick(card) {
    // console.log("hit", card, this.state.maintenanceList);
    let actionCard = this.summaryLabels.first;
    switch (card) {
      case "first":
        actionCard = this.summaryLabels.first;
        break;
      case "second":
        actionCard = this.summaryLabels.second;
        break;
      case "third":
        actionCard = this.summaryLabels.third;
        break;
      case "fourth":
        actionCard = this.summaryLabels.fourth;
        break;
      case "sixth":
        actionCard = this.summaryLabels.sixth;
        break;
      case "seventh":
        actionCard = this.summaryLabels.seventh;
        break;
      default:
        actionCard = this.summaryLabels.first;
    }
    if (actionCard == this.summaryLabels.first) {
      this.setState({ filterData: this.state.maintenanceList });
    } else {
      // let filterData = this.state.maintenanceList.filter(el => el.status == actionCard);
      // this.setState({ filterData: filterData });
      let sumval = this.calculateSummaryDataCalculated(this.state.maintenanceList, this.state.assetChildren, actionCard);
      this.setState({
        summaryValue: sumval.sumval,
        maintenanceList: this.props.maintenances,
        filterData: sumval.filterData,
      });
    }

    this.handleUpdateFilterState({
      activeSummary: actionCard,
    });
  }

  async handleUpdateMaintenance(mId, field, action) {
    let { filterData } = this.state;
    const index = _.findIndex(filterData, { _id: mId });
    if (index > -1) {
      if (action === "saveMaintenanceRole") {
        if (filterData[index].maintenanceRole === "CapitalPlan" && !filterData[index].workOrderNumber) {
          // this.props.updateMaintenance(filterData[index]);
          this.handlePlanClick(filterData[index]);
        } else {
          const response = await this.props.updateMaintenance(filterData[index]);
          if (response.type === "MAINTENANCE_UPDATE_SUCCESS") {
            filterData[index].maintenanceAction = "";
            this.setState({ filterData: _.cloneDeep(filterData) });
          }
        }
      } else if (action === "updateMaintenanceRole") {
        filterData[index].maintenanceAction = "maintenanceMode";
        filterData[index].maintenanceRole = field.value;
        this.setState({ filterData: _.cloneDeep(filterData) });
      }
    }
  }

  render() {
    const { path } = this.props.match;
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <Col id="mainContent" md="12">
        {modelRendered}
        <AddMaintenance
          modal={this.state.addModal}
          modalState={this.state.modalState}
          toggle={this.handleAddEditMaintenanceModalClick}
          selectedMaintenance={this.state.selectedMaintenance}
          userList={this.props.userList}
          addMaintenanceHandler={this.handleAddEditMaintaineceToServer}
          maintenanceTypes={this.state.maintenanceTypes}
          updateMaintenance={this.props.updateMaintenance}
          getMaintenance={this.props.getMaintenance}
          maintenanceActionType={this.props.actionType}
          maintenance={this.props.maintenance}
          // handleEditSubmit={this.hanldleEditTrack}
        />

        <ConfirmationDialog
          modal={this.state.confirmationDialog}
          toggle={this.handleConfirmationToggle}
          handleResponse={this.handleConfirmation}
          confirmationMessage={languageService("Are you sure you want to delete ?")}
          headerText={languageService("Confirm Deletion")}
        />
        <Col md="6">
          <DateRangeSelector
            modal={this.state.dateSelectionDialog}
            toggle={this.handleDateSelectionCancel}
            handleOkClick={this.handleDateSelectionClick}
          />
        </Col>
        <CommonModal
          handleSubmitClick={this.handleSubmitLineModalClick}
          headerText="Select Line's"
          handleCancelClick={this.handleLinesCancelClick}
          setModalOpener={(method) => {
            this.openModelMethod = method;
          }}
        >
          <MultiLineSelection
            handleLineClick={this.handleLineFilterChange}
            setAllLineGetMethod={(method) => {
              this.getLineFilterMethod = method;
            }}
            setFilterLines={this.setFilterLines}
          />
        </CommonModal>
        <Row>
          <Col md="12">
            <AddToWorkOrderForm
              maintenance={this.state.maintenanceToPlan}
              modal={this.state.pmModal}
              handleSubmitPlan={this.handleSubmitPMModalClick}
              toggle={() => {
                this.setState({ pmModal: !this.state.pmModal });
              }}
              notStartedWorkOrders={this.state.notStartedWorkOrders}
            />
          </Col>
        </Row>

        {/* <Row>
          <Col md="12">
            <PlanMaintenanceForm
              maintenance={this.state.maintenanceToPlan}
              modal={this.state.pmModal}
              userList={this.props.userList}
              handleSubmitPlan={this.handleSubmitPMModalClick}
              toggle={() => this.setState(({ pmModal }) => ({ pmModal: !pmModal }))}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <MaintenanceExecuteForm
              maintenance={this.state.maintenanceToExecute}
              modal={this.state.meModal}
              handleSubmit={this.handleSubmitmeModalClick}
              toggle={() => this.setState(({ meModal }) => ({ meModal: !meModal }))}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <MaintenanceCloseForm
              maintenance={this.state.maintenanceToClose}
              modal={this.state.mcModal}
              handleSubmit={this.handleSubmitmcModalClick}
              toggle={() => this.setState(({ mcModal }) => ({ mcModal: !mcModal }))}
            />
          </Col>
        </Row> */}

        <Row style={themeService(commonStyles.pageBorderRowStyle)}>
          <Col md="10" style={{ paddingLeft: "0px", position: "unset" }}>
            <div style={themeService(commonStyles.pageTitleStyle)}>{languageService("Work Order")}</div>
            <MaintenanceSmartSummary
              descriptions={this.summaryDesc}
              values={this.state.summaryValue}
              handleAddNewClick={this.handleAddEditMaintenanceModalClick}
              permissionCheckProps={true}
              permissionCheck={permissionCheck("MAINTENANCE", "create")}
              addTootTipText={"Work Order"}
              AddButton
              handleSummaryClick={this.handleSummaryClick}
              valueRotate={this.state.valueRotate}
              summaryShowHide={!this.state.summaryShowHide}
              handleHideShow={this.handleHideShow}
              summaryLabels={this.summaryLabels}
            />
          </Col>

          <Col md={"2"}>
            <ViewChangerComponent
              LIST_VIEW_SELECTION={removeViewChangers(LIST_VIEW_SELECTION, this.state.removeFilterIcon)}
              listViewDataToShow={this.state.listViewDataToShow}
              handleListViewSelection={this.handleListViewSelection}
              placement="TOP_OF_PAGE"
            />
            {/* <div style={{ paddingRight: "15px" }}>
              {LIST_VIEW_SELECTION.map((item, index) => {
                let color = "var(--fifth)";
                let backgroundColor = "rgb(196, 212, 228)";
                let boxShadow = "0 0 0 2px rgb(196, 212, 228)";
                if (item.title === this.state.listViewDataToShow) {
                  color = "var(--first)";
                  backgroundColor = "var(--fifth)";
                  boxShadow = "0 0 0 2px rgb(255, 255, 255)";
                }

                return (
                  <div
                    style={{ display: "inline-block", float: "right", padding: "0px 0px 0px 10px", cursor: "pointer" }}
                    key={index}
                    onClick={() => this.handleListViewSelection(item.title)}
                  >
                    <div id={item.title}>
                      <div
                        style={themeService({
                          default: {
                            color: color,
                            //color: "var(--fifth)",
                            border: "2px solid ",
                            padding: "3px 6px",
                            backgroundColor: backgroundColor,
                            borderRadius: "50%",
                            boxShadow: boxShadow,
                            transform: "all .2s ease-in-out",
                          },
                          retro: {
                            color: retroColors.fouth,
                            //color: "var(--fifth)",
                            border: "0px solid ",
                            padding: "3px 6px",
                            backgroundColor: "transparent",
                            borderRadius: "0",

                            transform: "all .2s ease-in-out",
                          },
                        })}
                      >
                        <SvgIcon icon={item.icon} size={themeService({ default: "18px", retro: "30px" })} style={{ display: "block" }} />
                      </div>
                    </div>

                    <Tooltip
                      isOpen={this.state.tooltip && this.state.tooltip.title === item.title}
                      target={item.title}
                      toggle={() => this.toggleTooltip(item)}
                    >
                      {languageService(item.tooltip.text)}
                    </Tooltip>
                  </div>
                );
              })}
            </div> */}
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
        {/* {this.state.summaryShowHide && ( */}
        <Row
          style={{
            transition: "all .3s ease-in-out",
            opacity: this.state.summaryShowHide ? "1" : "0",
            height: this.state.summaryShowHide ? "60px" : "0",
          }}
        >
          <Col md="12">
            <div
              // style={{
              //   float: "left",
              //   fontFamily: "Myriad Pro",
              //   fontSize: "16px",
              //   letterSpacing: "0.5px",
              //   color: "var(--first)",
              //   paddingLeft: "15px",
              // }}
              style={themeService(commonPageStyle.commonSummaryHeadingContainer)}
            >
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Summary")}</h4>
            </div>
          </Col>
        </Row>
        {/* )} */}

        <Row
          className="summary-row"
          style={{
            transition: "all .3s ease-in-out",
            opacity: this.state.summaryShowHide ? "1" : "0",
            height: this.state.summaryShowHide ? "95px" : "0",
          }}
        >
          <Col md="12">
            <MaintenanceSummary
              descriptions={this.summaryDesc}
              values={this.state.summaryValue}
              handleAddNewClick={this.handleAddEditMaintenanceModalClick}
              permissionCheckProps={true}
              permissionCheck={permissionCheck("MAINTENANCE", "create")}
              addTootTipText={"Work Order"}
              AddButton
              handleSummaryClick={this.handleSummaryClick}
              summaryShowHide={this.state.summaryShowHide}
              handleHideShow={this.handleHideShow}
              summaryLabels={this.summaryLabels}
            />
          </Col>
          {/* {this.state.dateSelectionDialog && (<div>
          <DayPicker selectedDays={Date.now()} onDayClick={this.handleDateSelectionClick}/>
           </div>)} */}
        </Row>
        <Row>
          <Col md="10">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Work Order List")}</h4>
            </div>
          </Col>
          {/*</Row>*/}
          {/*<Row>*/}
          {/*<Col md="12">*/}
          {/*{this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.GIS && (*/}
          {/*<div style={{ padding: "15px", maxHeight: "50vh", position: "relative", overflowX: "hidden" }}>*/}
          {/*<MaintenanceGISView list={this.state.maintenanceList} line={this.props.selectedLine} linesList={this.props.lineAssets} />*/}
          {/*</div>*/}
          {/*)}*/}
          {/*</Col>*/}
          <hr style={{ borderBottom: "1px solid rgb(209, 209, 209)", width: "96.5%" }}></hr>
        </Row>
        <Row>
          <Col md="12">
            <div style={{ padding: "0px 15px 15px", width: "-webkit-fill-available" }}>
              {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.GIS && (
                // <div style={{ padding: "15px", maxHeight: "50vh", position: "relative", overflowX: "hidden" }} className="scrollbar">
                <div>
                  <MaintenanceGISView list={this.state.filterData} line={this.props.selectedLine} linesList={this.props.lineAssets} />
                </div>
              )}
              {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.MAP && (
                <TrackChartWrapper
                  sort={this.state.linearDataSort}
                  list={this.state.filterData}
                  range={{ start: this.props.selectedLine.start, end: this.props.selectedLine.end }}
                  handleClick={this.handleLinearMaintenanceSortSelect}
                  linesList={this.props.lineAssets}
                  onClick={this.handleLineMaintenanceClick}
                  allowTitleClick
                />
              )}

              {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.LIST && (
                <MaintenanceList
                  path={path}
                  resetPage={this.resetPage}
                  maintenanceData={this.state.filterData}
                  handleEditClick={this.handleAddEditModalClick}
                  pageSize={this.state.pageSize}
                  handlePageSize={this.handlePageSize}
                  //   handleDeleteClick={this.handleDeleteClick}
                  customFilterComp={
                    <div>
                      <CustomFilters
                        handleClick={this.handleFilterClick}
                        filters={this.state.filters}
                        exclusive
                        displayText={this.state.filterDateText}
                        showDisplayText
                      />

                      {/* <CustomFilters handleClick={this.handleFilterClick} filters={this.state.lineFilters} exclusive displayText={""} /> */}
                    </div>
                  }
                  handleViewClick={this.handleViewClick}
                  actionType={this.props.actionType}
                  editMaintenance={this.editMaintenance}
                  listFilter={this.state.listFilter}
                  selectedLine={this.props.selectedLine}
                  handlePlanClick={this.handlePlanClick}
                  // handleExecuteClick={this.handleExecuteClick}
                  // handleCloseClick={this.handleCloseClick}
                  rowStyleMap={this.rowColorMap}
                  handleUpdateMaintenance={this.handleUpdateMaintenance}
                />
              )}
            </div>
          </Col>
        </Row>
      </Col>
    );
  }
}

let variables = {
  userReducer: {
    userList: [],
    userListByGroup: [],
  },
  utilReducer: {
    planFilter: "today",
  },
  lineSelectionReducer: {
    selectedLine: {},
    multiData: [],
  },
  assetHelperReducer: {
    lineAssets: [],
    inspectableUserAssets: [],
  },
  workorderReducer: { workorders: [] },
  filterStateReducer: {
    workOrderFilters: null,
    maintenanceFilter: null,
  },

  applicationlookupsReducer: { applicationlookupss: [] },
};
const getApplicationlookupss = curdActions.getApplicationlookupss;
let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: false,
  others: {
    userListRequest,
    userListByGroupRequest,
    getMultiLineData,
    getAssetLinesWithSelf,
    getInspectableAssets,
    getWorkOrders,
    updateFilterState,
    getApplicationlookupss,
  },
};
let MaintenanceContainer = CRUDFunction(Maintenance, "maintenance", actionOptions, variables, [
  "utilReducer",
  "lineSelectionReducer",
  "userReducer",
  "assetHelperReducer",
  "workorderReducer",
  "filterStateReducer",
  "applicationlookupsReducer",
]);
export default MaintenanceContainer;
function removeViewChangers(list, itemTitle) {
  let filteredList = _.cloneDeep(list);
  if (itemTitle) {
    _.remove(filteredList, { title: itemTitle });
  }
  return filteredList;
}

const TrackChartWrapper = (props) => {
  let data = [];
  if (props.list && props.list.length) {
    props.list.forEach((dat) => {
      dat.status !== "Closed" && data.push(dat);
    });
  }
  return (
    <LineView
      sort={props.sort}
      list={data}
      range={props.range}
      handleClick={props.handleClick}
      linesList={props.linesList}
      onClick={props.onClick}
      allowTitleClick={props.allowTitleClick}
    />
  );
};
