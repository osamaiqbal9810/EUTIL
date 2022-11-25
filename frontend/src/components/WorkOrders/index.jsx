import React, { Component } from "react";
import { Row, Col, Tooltip } from "reactstrap";
import { CRUDFunction } from "reduxCURD/container";
// import SvgIcon from "react-icons-kit";
import { curdActions } from "reduxCURD/actions";
// import moment from "moment";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
// import { ToastContainer, toast } from "react-toastify";
// import ConfirmationDialog from "components/Common/ConfirmationDialog";
// import permissionCheck from "utils/permissionCheck.js";

// import SpinnerLoader from "components/Common/SpinnerLoader";

import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
// import CustomFilters from "components/Common/Filters/CustomFilters";
// import DateRangeSelector from "components/Common/DateRangeSelector";

import { languageService } from "../../Language/language.service";

// import CommonModal from "components/Common/CommonModal";
// import MultiLineSelection from "components/Common/MultiLineSelection";
import { userListRequest } from "../../reduxRelated/actions/userActions";

// import { getAssetLines } from "../../reduxRelated/actions/assetHelperAction";
import permissionCheck from "utils/permissionCheck.js";
import ViewChangerComponent from "components/Common/ViewChangerComponent/ViewChangerComponent";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "components/Common/Buttons";
import { WOListView } from "./WOListView";
import AddEditWOModal from "./AddEditWO";
import EstimateModal from "./EstimateModal";
import WorkOrderExecute from "./WorkOrderExecute";
import WorkOrderClose from "./WorkOrderClose";
import WOCalendarView from "./WOCalendarView";
import { thList } from "react-icons-kit/fa/thList";
import { calendar } from "react-icons-kit/fa/calendar";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
// import { Icon } from "react-icons-kit";
import ButtonSimple from "../Common/simpleButon";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonStyles } from "../../theme/commonStyles";
import { commonSummaryStyle } from "../Common/Summary/styles/CommonSummaryStyle";
import ConfirmationDialog from "../Common/ConfirmationDialog";
import { basicColors, retroColors, electricColors } from "../../style/basic/basicColors";
import MenuFilter from "components/Common/MenuFilters/index";
import EstimateListEditable from "../Maintenance/AddMaintenance/EstimateListEditable";

import { maintenanceTemplate } from "../../templates/MaintenanceTemplate";
import WorkorderSummary from "components/Common/Summary/CommonSummary";
import WorkorderSmartSummary from "components/Common/SmartSummary/SmartSummary";

import { getStatusColor } from "utils/statusColors";

export const LIST_VIEW_SELECTION_TYPES = {
  LIST: "List",
  Calendar: "Calendar",
};

export const LIST_VIEW_SELECTION = [
  {
    title: LIST_VIEW_SELECTION_TYPES.LIST,
    icon: thList,
    tooltip: {
      show: false,
      text: "List",
    },
  },
  {
    title: LIST_VIEW_SELECTION_TYPES.Calendar,
    icon: calendar,
    tooltip: {
      show: false,
      text: "Calendar",
    },
  },
];

const TEMPLATE_WORKORDER_FILTERS = {
  listViewDataToShow: LIST_VIEW_SELECTION_TYPES.LIST,
  pageSize: 30,
};
class WorkOrder extends Component {
  constructor(props) {
    super(props);
    this.workOrderFilters = { ...TEMPLATE_WORKORDER_FILTERS };
    if (this.props.workOrderFilters) {
      this.workOrderFilters = {
        listViewDataToShow: this.props.workOrderFilters.listViewDataToShow,
        pageSize: this.props.workOrderFilters.pageSize,
      };
    }
    this.state = {
      workOrderList: [],
      addModal: false,
      estimateModal: false,
      modalMode: "add",
      editItem: null,
      removeFilterIcon: null,
      woeModal: false,
      workOrderToExecute: {},
      wocModal: false,
      workOrderToClose: {},
      workOrderToDelete: {},
      deleteModal: false,
      ...this.workOrderFilters,
      summaryShowHide: true,
      summaryValue: { first: 0, second: 0, third: 0, fourth: 0, sixth: 0, seventh: 0 },
      activeSummary: "Total",
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

    this.handleAddModalClick = this.handleAddModalClick.bind(this);
    this.handleAddWOSubmit = this.handleAddWOSubmit.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
    this.handleSubmitWOEModalClick = this.handleSubmitWOEModalClick.bind(this);
    this.getRangeDataFromServer = this.getRangeDataFromServer.bind(this);
    this.cancelAddTWorkorder = this.cancelAddTWorkorder.bind(this);

    this.menuFilterApplied = this.menuFilterApplied.bind(this);
    this.handelMenuClickData = this.handelMenuClickData.bind(this);
    this.handlePageSize = this.handlePageSize.bind(this);
    this.handleSummaryClick = this.handleSummaryClick.bind(this);
    this.handleHideShow = this.handleHideShow.bind(this);
    this.handleEstimateModalClick = this.handleEstimateModalClick.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.showToastSuccess = this.showToastSuccess.bind(this);
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
  handlePageSize(pageSize) {
    this.props.updateFilterState("workOrderFilters", {
      listViewDataToShow: this.state.listViewDataToShow,
      pageSize,
    });
  }
  componentDidMount() {
    this.props.getWorkorders();
    this.props.getMaintenances();
    this.props.getApplicationlookupss(["crewSkills", "equipmentTypes", "materialTypes"]);
    //console.log("::", this.state.listViewDataToShow);
    // console.log(this.props.workOrderFilters, this.props.workOrderFilters.mr);
    //console.log(this.props.workOrderFilters);

    // check my filter state if it is adding an MR to Workorder then change the actions
    //
    const workOrderFilters = this.props.workOrderFilters;
    if (!workOrderFilters) {
      this.setState({ listViewDataToShow: LIST_VIEW_SELECTION_TYPES.LIST });
    } else {
      if (workOrderFilters && workOrderFilters.mr) {
        this.setState({ listViewDataToShow: LIST_VIEW_SELECTION_TYPES.LIST, removeFilterIcon: LIST_VIEW_SELECTION_TYPES.Calendar });
      } else this.setState({ listViewDataToShow: LIST_VIEW_SELECTION_TYPES.LIST });
    }
    //console.log("::", this.props.workOrderFilters.mr);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.actionType !== this.props.actionType && this.props.actionType === "WORKORDERS_READ_SUCCESS") {
      let sumval = this.calculateSummaryDataCollected(this.props.workorders, this.state.assetChildren, this.state.activeSummary);

      this.setState({
        summaryValue: sumval.sumval,
        workOrderList: this.props.workorders,
        filterData: sumval.filterData,
      });
    }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType === "WORKORDER_CREATE_SUCCESS") {
      this.props.getWorkorders();
      this.props.updateFilterState("workOrderFilters", { ...this.props.workOrderFilters, mr: null });
      this.showToastSuccess(languageService("Capital Plan Created Successfully"));
      this.setState({ removeFilterIcon: null });
    }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType === "WORKORDER_UPDATE_SUCCESS") {
      this.props.getWorkorders();
      this.props.getMaintenances();
      this.props.updateFilterState("workOrderFilters", { ...this.props.workOrderFilters, mr: null });
      this.showToastSuccess(languageService("Capital Plan Updated Successfully"));
      this.setState({ removeFilterIcon: null });
    }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType === "WORKORDER_DELETE_SUCCESS") {
      this.props.getWorkorders();
      this.props.getMaintenances();
      this.showToastSuccess(languageService("Capital Plan Removed Successfully"));
    }
  }
  calculateSummaryData(workordersData) {
    let sumVal = {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      sixth: 0,
      seventh: 0,
    };
    sumVal.first = workordersData.length;

    workordersData.forEach((m) => {
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
  calculateSummaryDataCollected(workordersData, assetChildren, activeSummary) {
    let filterData = [];

    let workordersToShow = [];
    if (assetChildren) {
      workordersData.forEach((wo) => {
        let checkMenuFilterAllowed = _.find(assetChildren, { state: true, id: wo.locationId });
        if (checkMenuFilterAllowed) {
          workordersToShow.push(wo);
        }
      });
    } // todo: fix this the right way. if you press F5 on the page the asset children is null so no maintenace is displayed
    else {
      workordersToShow = workordersData;
    }

    this.handleUpdateFilterState({
      assetChildren,
      activeSummary,
    });
    let sumval = this.calculateSummaryData(workordersToShow);
    if (activeSummary !== this.summaryLabels.first) {
      filterData = workordersToShow.filter((el) => el.status == activeSummary);
    } else {
      filterData = [...workordersToShow];
    }
    return { sumval, workorders: workordersToShow, filterData };
  }
  setNotStartedWorkorders(notStartedWorkOrders) {
    this.setState({ notStartedWorkOrders: notStartedWorkOrders });
    //console.log('not started workorders', notStartedWorkOrders);
  }

  handleUpdateFilterState(propertiesToUpdate) {
    let workOrderFilters = this.props.workOrderFilters ? this.props.workOrderFilters : {};

    this.props.updateFilterState("workOrderFilters", {
      ...workOrderFilters,
      ...propertiesToUpdate,
    });
  }

  handleHideShow() {
    this.setState({ summaryShowHide: this.state.summaryShowHide ? false : true });
  }

  menuFilterApplied(assetChildren, options) {
    // this.setState({ lineNames: [...options], assetChildren });
    // this.handleUpdateFilterState({ assetChildren: assetChildren, lineNames: [...options] });
  }
  handelMenuClickData(assetChildren, displayMenuAll, lineNames) {
    let sumval = this.calculateSummaryDataCollected(this.state.workOrderList, assetChildren, this.state.activeSummary);
    this.setState({
      summaryValue: sumval.sumval,
      workOrderList: this.props.workorders,
      filterData: sumval.filterData,
      assetChildren: assetChildren,
    });
  }
  handleListViewSelection = (listViewDataToShow) => {
    this.props.updateFilterState("workOrderFilters", {
      ...this.props.workOrderFilters,
      listViewDataToShow: listViewDataToShow,
    });
    this.setState({ listViewDataToShow });
  };

  getRangeDataFromServer(range) {
    // let filterDateText = "";
    // if (range && range.from != undefined) {
    //   filterDateText = moment(range.from).format("L");

    //   if (range.to != undefined && moment(range.from).format("L") != moment(range.to).format("L")) {
    //     filterDateText += " to " + moment(range.to).format("L");
    //   }
    // }
    // this.setState({
    //   filterDateText: filterDateText,
    // });
    // var jsonArray = encodeURIComponent(JSON.stringify(range));
    // let arg = "?dateRange=" + jsonArray;
    // this.props.getJourneyPlans(arg);
    // this.setState({
    //   rangeState: range,
    // });
    this.props.getWorkorders();
  }

  handleActionClick(action, obj) {
    if (action === "Edit") {
      //console.log('edit', obj);
      this.setState({
        modalMode: "edit",
        editItem: obj,
        addModal: !this.state.addModal,
      });
    } else if (action === "View") {
      this.setState({
        modalMode: "view",
        editItem: obj,
        addModal: !this.state.addModal,
      });
    } else if (action === "Delete") {
      this.deleteWorkOrder(obj);
    } else if (action === "Execute") {
      this.setState({ woeModal: true, workOrderToExecute: obj });
    } else if (action === "Close") {
      this.setState({ wocModal: true, workOrderToClose: obj });
    } else if (action === "GIS") {
      if (obj && obj._id) this.props.history.push("/workorderGISView/" + obj._id);
    } else if (action === "Select") {
      let wo = _.cloneDeep(obj);
      wo.maintenanceRequests = [...wo.maintenanceRequests, this.props.workOrderFilters.mr.mrNumber];
      this.props.updateWorkorder(wo);
    } else if (action === "Estimate") {
      this.setState({
        modalMode: "view",
        editItem: obj,
        estimateModal: !this.state.estimateModal,
      });
    }
  }
  deleteWorkOrder = (workOrder) => {
    this.setState({
      deleteModal: !this.state.deleteModal,
      workOrderToDelete: workOrder,
    });
  };
  handleConfirmation = (response) => {
    if (response) {
      this.props.deleteWorkorder(this.state.workOrderToDelete);
    }

    this.setState(({ deleteModal }) => ({
      workOrderToDelete: null,
      deleteModal: !deleteModal,
    }));
  };
  handleSubmitWOEModalClick = (w1) => {
    w1._id = this.state.workOrderToExecute._id;
    this.setState({ woeModal: false, workOrderToExecute: {} });
    this.props.updateWorkorder(w1);
  };
  handleSubmitWOCModalClick = (w1) => {
    w1._id = this.state.workOrderToClose._id;
    this.setState({ wocModal: false, workOrderToClose: {} });
    this.props.updateWorkorder(w1);
  };
  handleAddModalClick() {
    let autoAddMr = null;
    if (this.props.workOrderFilters && this.props.workOrderFilters.mr) {
      autoAddMr = this.props.workOrderFilters.mr;
    }
    this.setState({
      modalMode: "add",
      addModal: !this.state.addModal,
      mrToAdd: autoAddMr,
    });
  }
  handleEstimateModalClick() {
    this.setState({
      estimateModal: !this.state.estimateModal,
    });
  }
  handleAddWOSubmit(workorder, fromEstimate = false) {
    if (!workorder.mwoNumber) {
      this.props.createWorkorder(workorder);
    } else {
      this.props.updateWorkorder(workorder);
    }

    if (!fromEstimate) this.handleAddModalClick();
    else this.handleEstimateModalClick();
  }
  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  };
  cancelAddTWorkorder() {
    //clear this somehow this.props.workOrderFilters.mr
    this.props.updateFilterState("workOrderFilters", { ...this.props.workOrderFilters, mr: null });
    this.setState({ removeFilterIcon: null });
    let newWOs = _.cloneDeep(this.props.workorders);

    this.setState({
      workOrderList: newWOs, //this.props.workorders,
    });
    // history.push('back to maintenance');
    this.props.history.push("/maintenancebacklog");
  }

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
      let sumval = this.calculateSummaryDataCollected(this.state.workOrderList, this.state.assetChildren, actionCard);
      this.setState({
        summaryValue: sumval.sumval,
        workOrderList: this.props.workorders,
        filterData: sumval.filterData,
      });
    } else {
      let sumval = this.calculateSummaryDataCollected(this.state.workOrderList, this.state.assetChildren, actionCard);
      this.setState({
        summaryValue: sumval.sumval,
        workOrderList: this.props.workorders,
        filterData: sumval.filterData,
      });
    }
  }
  render() {
    return (
      <Col id="mainContent" md={12}>
        <ConfirmationDialog
          modal={this.state.deleteModal}
          toggle={() => this.setState(({ deleteModal }) => ({ deleteModal: !deleteModal }))}
          handleResponse={this.handleConfirmation}
          confirmationMessage={
            <div>
              <div>{languageService("Are you sure you want to delete")} </div>
            </div>
          }
          headerText={languageService("Confirm Deletion")}
        />

        <Row>
          <Col md={10} style={{ paddingLeft: "0px", position: "unset", display: "flex" }}>
            <div style={themeService(commonStyles.pageTitleStyle)}>{languageService("Capital Plan")}</div>
            {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.LIST && (
              <WorkorderSmartSummary
                descriptions={this.summaryDesc}
                values={this.state.summaryValue}
                handleAddNewClick={this.handleAddModalClick}
                permissionCheckProps={true}
                permissionCheck={permissionCheck("WORKORDER", "create")}
                addTootTipText={"Capital Plan"}
                AddButton
                valueRotate={this.state.valueRotate}
                summaryShowHide={!this.state.summaryShowHide}
                handleHideShow={this.handleHideShow}
                summaryLabels={this.summaryLabels}
                handleSummaryClick={this.handleSummaryClick}
              />
            )}
            {this.props.workOrderFilters && this.props.workOrderFilters.mr && (
              <span
                style={themeService({
                  default: {
                    fontFamily: "Myriad Pro",
                    color: basicColors.first,
                    display: "inline-block",
                    margin: "0 auto",
                    width: "150px",
                    fontSize: "1rem",
                    fontWeight: "400",
                    lineHeight: "1.5",
                  },
                  retro: {
                    fontFamily: "Myriad Pro",
                    color: retroColors.second,
                    display: "inline-block",
                    margin: "0 auto",
                    width: "150px",
                    fontSize: "1rem",
                    fontWeight: "400",
                    lineHeight: "1.5",
                  },
                  electric: {
                    fontFamily: "Myriad Pro",
                    color: electricColors.second,
                    display: "inline-block",
                    margin: "0 auto",
                    width: "150px",
                    fontSize: "1rem",
                    fontWeight: "400",
                    lineHeight: "1.5",
                  },
                })}
              >
                {languageService("Need Help")}
                <button
                  style={{
                    fontSize: "1rem",
                    fontWeight: "400",
                    lineHeight: "1.5",
                    background: "none",
                    border: "0",
                    marginTop: "5px",
                    cursor: "pointer",
                  }}
                  id={"toolTipInfo"}
                >
                  ?
                </button>
                <Tooltip isOpen={this.state.tooltipOpen} target={"toolTipInfo"} toggle={this.toggleTooltip}>
                  {languageService(
                    `${languageService(
                      "Add Maintenance Work To add this Maintenance Plan to a new Work Order, click + icon on the right, OR to add this to an existing Work Order for",
                    )} , <Line>${languageService("click on 'Select' link under 'Actions' column below OR press 'Cancel' to go back")}.`,
                  )}
                </Tooltip>
              </span>
            )}

            {this.props.workOrderFilters && this.props.workOrderFilters.mr && (
              <div
                style={themeService({
                  default: { marginTop: "5px", color: "var(--first)", float: "right" },
                  retro: { marginTop: "5px", color: retroColors.second, float: "right" },
                  electric: { marginTop: "5px", color: electricColors.second, float: "right" },
                })}
              >
                {languageService("Add")} {this.props.workOrderFilters.mr.mrNumber} {languageService("to capital plan")}{" "}
                {/* <MyButton onClick={this.cancelAddTWorkorder}>{languageService("Cancel")}</MyButton> */}
                <div onClick={this.cancelAddTWorkorder} style={{ display: "inline-block", cursor: "pointer", verticalAlign: "sub" }}>
                  <ButtonSimple buttonText={languageService("Cancel")} />
                </div>
              </div>
            )}
          </Col>

          <Col md={2} style={{ paddingRight: "30px" }}>
            <ViewChangerComponent
              LIST_VIEW_SELECTION={removeViewChangers(LIST_VIEW_SELECTION, this.state.removeFilterIcon)}
              listViewDataToShow={this.state.listViewDataToShow}
              handleListViewSelection={this.handleListViewSelection}
              placement="TOP_OF_PAGE"
            />
          </Col>
          <Col md={12}>
            <MenuFilter
              menuFilterApplied={this.menuFilterApplied}
              handelMenuClickData={this.handelMenuClickData}
              displayMenuAll={this.state.displayMenuAll}
              assetChildren={this.state.assetChildren}
              lineNames={this.state.lineNames}
            />
          </Col>
        </Row>
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.LIST && (
          <Row
            className="summary-row"
            style={{
              transition: "all .3s ease-in-out",
              opacity: this.state.summaryShowHide ? "1" : "0",
              height: this.state.summaryShowHide ? "95px" : "0",
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
            <Col md="12">
              <WorkorderSummary
                descriptions={this.summaryDesc}
                values={this.state.summaryValue}
                handleAddNewClick={this.handleAddModalClick}
                permissionCheckProps={true}
                permissionCheck={permissionCheck("WORKORDER", "create")}
                addTootTipText={"Capital Plan"}
                AddButton
                summaryShowHide={this.state.summaryShowHide}
                handleHideShow={this.handleHideShow}
                summaryLabels={this.summaryLabels}
                handleSummaryClick={this.handleSummaryClick}
              />
            </Col>
            {/* {this.state.dateSelectionDialog && (<div>
          <DayPicker selectedDays={Date.now()} onDayClick={this.handleDateSelectionClick}/>
           </div>)} */}
          </Row>
        )}
        <Row>
          <br />
        </Row>
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.LIST && (
          <Row>
            <Col md={10}>
              <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
                <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Capital Plan List")}</h4>
              </div>
            </Col>
            {/* <Col md={2}>
              <div>
                {permissionCheck("WORKORDER", "create") && (
                  <div id={"toolTipAddWO"} style={{ height: "60px" }}>
                    <ButtonCirclePlus
                      iconSize={50}
                      icon={withPlus}
                      handleClick={e => {
                        this.handleAddModalClick();
                      }}
                      {...themeService(commonSummaryStyle.addButtonStyle(this.props))}
                      buttonTitleText={languageService("Add Work Order")}
                    />
                  </div>
                )}

                {/* <Tooltip isOpen={this.state.tooltipOpen} target={"toolTipAddWO"} toggle={this.toggleTooltip}>
                  {languageService("Add Maintenance Work Order")}
                </Tooltip> /}
              </div>
            </Col> */}
          </Row>
        )}
        <Row>
          <Col md="12">
            <WorkOrderExecute
              workOrder={this.state.workOrderToExecute}
              modal={this.state.woeModal}
              handleSubmit={this.handleSubmitWOEModalClick}
              toggle={() => this.setState(({ woeModal }) => ({ woeModal: !woeModal }))}
            />
            <WorkOrderClose
              workOrder={this.state.workOrderToClose}
              modal={this.state.wocModal}
              handleSubmit={this.handleSubmitWOCModalClick}
              toggle={() => this.setState(({ wocModal }) => ({ wocModal: !wocModal }))}
            />
          </Col>
        </Row>
        <AddEditWOModal
          modal={this.state.addModal}
          toggle={(ms, wo) => {
            this.setState({ addModal: !this.state.addModal });
          }}
          handleSubmitForm={this.handleAddWOSubmit}
          modalMode={this.state.modalMode}
          editItem={this.state.editItem}
          maintenances={this.state.maintenances}
          autoAddMr={this.state.mrToAdd}
          applicationlookupss={this.props.applicationlookupss}
        />
        <EstimateModal
          modal={this.state.estimateModal}
          toggle={() => {
            this.setState({ estimateModal: !this.state.estimateModal });
          }}
          handleSubmitForm={this.handleAddWOSubmit}
          modalMode={this.state.modalMode}
          editItem={this.state.editItem}
          maintenances={this.props.maintenances}
          autoAddMr={this.state.mrToAdd}
          getApplicationlookupss={this.props.getApplicationlookupss}
          applicationlookupss={this.props.applicationlookupss}
        />
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.Calendar && (
          <React.Fragment>
            <WOCalendarView
              getDateControls={this.getDateControls}
              getRangeDataFromServer={this.getRangeDataFromServer}
              actionType={this.props.actionType}
              lineSelectionActionType={this.props.lineSelectionActionType}
              //multiData={this.props.multiData}
              //userList={this.state.userList}
              //changeUserAndUpdate={this.changeUserAndUpdate}
              //workorders={this.props.workorders}
              workorders={this.state.filterData}
              handleViewClick={this.handleViewClick}
              history={this.props.history}
            />
          </React.Fragment>
        )}
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.LIST && (
          <WOListView
            workOrders={this.state.filterData}
            handleClick={this.handleActionClick}
            addMR={this.props.workOrderFilters && this.props.workOrderFilters.mr}
            handlePageSize={this.handlePageSize}
            pageSize={this.state.pageSize}
            rowStyleMap={this.rowColorMap}
          />
        )}
      </Col>
    );
  }
}
const getMaintenances = curdActions.getMaintenances;
const getApplicationlookupss = curdActions.getApplicationlookupss;

let variables = {
  maintenanceReducer: { maintenances: [] },
  filterStateReducer: {
    workOrderFilters: null,
  },
  applicationlookupsReducer: { applicationlookupss: [] },
};

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: {
    userListRequest,
    getMaintenances,
    updateFilterState,
    getApplicationlookupss,
  },
};
let WorkOrderContainer = CRUDFunction(WorkOrder, "workorder", actionOptions, variables, [
  "maintenanceReducer",
  "filterStateReducer",
  "applicationlookupsReducer",
]);

export default WorkOrderContainer;

function removeViewChangers(list, itemTitle) {
  let filteredList = _.cloneDeep(list);
  if (itemTitle) {
    _.remove(filteredList, { title: itemTitle });
  }
  return filteredList;
}
