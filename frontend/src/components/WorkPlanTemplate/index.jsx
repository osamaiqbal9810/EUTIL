import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { journeyPlanStyles } from "./styles/JourneyPlanPageStyle";

import JourneyPlanList from "./JourneyPlanList/index";
import JourneyPlanSummary from "components/Common/Summary/CommonSummary";
import { planningTableData } from "./JourneyPlanData";
import { CRUDFunction } from "reduxCURD/container";
import { userListRequest } from "reduxRelated/actions/userActions";
import JourneyPlanAdd from "./JourneyPlanAddEdit/JourneyPlanAdd";
import { getSODs } from "reduxRelated/actions/sodActions.js";
import moment from "moment";
import _ from "lodash";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import permissionCheck from "utils/permissionCheck.js";
import { savePageNum, clearPageNum } from "reduxRelated/actions/utilActions";
import { ButtonMain } from "components/Common/Buttons";
import { updateTemplateSort } from "reduxRelated/actions/templateHelperActions";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { getRunOfLines } from "reduxRelated/actions/runHelperActions";
import { compNames } from "./componentNames";
import { languageService } from "../../Language/language.service";
import WarningDialog from "../Common/WarningDialog";
import { commonStyles } from "../../theme/commonStyles";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonPageStyle } from "../Common/Summary/styles/CommonPageStyle";
import { filterRunRanges } from "./JourneyPlanAddEdit/methods";
import { getCurrentIssuesStateFilters, TEMPLATE_ISSUES_FILTERS } from "./HelperFunctions/stateRetentionManagement";
class JourneyPlan extends Component {
  constructor(props) {
    super(props);
    this.issuesFilter = getCurrentIssuesStateFilters(this.props.issuesFilter);
    this.state = {
      workPlanTemplates: [],
      workPlans: [],
      workPlansView: [],
      sodList: [],
      addModal: false,
      selectedJourneyPlan: null,
      spinnerLoading: false,
      planToDelete: null,
      confirmationDialog: false,
      warningDialog: false,
      modalState: "",
      actionType: "",
      userList: [],
      supervisors: [],
      sortedChanges: {},
      sortedChangesSaveButton: false,
      sortDirectionChange: false,
      summaryShowHide: true,
      usersActionType: "",
      ...this.issuesFilter,
      summaryValue: {
        first: 0,
      },
      runRanges: [],
      //listPage: 0,
      planFilter: this.props.planFilter,
      //planPageSize: this.props.planPageSize,
      planCalculated: true,
      sortMode: "default",
      lineRunNumbers: [],
        formType: 'inspectionForm'
    };

    this.summaryLabels = {
      first: "Total",
    };

    this.summaryDesc = {
      ...this.summaryLabels,
      first: languageService("Total plans"),
    };

    this.handleAddEditModalClick = this.handleAddEditModalClick.bind(this);
    this.resetPage = this.resetPage.bind(this);
    this.handleAddJourneyPlan = this.handleAddJourneyPlan.bind(this);
    this.handleEditJourneyPlan = this.handleEditJourneyPlan.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleAlertClick = this.handleAlertClick.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleConfirmationToggle = this.handleConfirmationToggle.bind(this);
    this.handlePageStateSave = this.handlePageStateSave.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.saveSort = this.saveSort.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.setSortCustomMode = this.setSortCustomMode.bind(this);
    this.handleSummaryClick = this.handleSummaryClick.bind(this);
    this.updateLineRunNumbers = this.updateLineRunNumbers.bind(this);
    this.handleUpdateFilterState = this.handleUpdateFilterState.bind(this);
  }

  updateLineRunNumbers(lineRun) {
    let __lineRunNumbers = [...this.state.lineRunNumbers];
    let findIndex = _.findIndex(__lineRunNumbers, { _id: lineRun._id });
    if (findIndex > -1) {
      __lineRunNumbers[findIndex] = lineRun;
    }
    let filtered = filterRunRanges(__lineRunNumbers);
    this.setState({
      lineRunNumbers: __lineRunNumbers,
      runRanges: filtered,
    });
  }
  componentDidMount() {
    this.props.getWorkPlanTemplates();
    this.props.getRunOfLines();
    this.props.userListRequest();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.userActionType == "USER_LIST_SUCCESS" && nextProps.userList !== prevState.userList) {
      let supervisorList = [];
      let inspectorList = [];
      nextProps.userList.forEach((user) => {
        if (user.group_id == "supervisor") {
          supervisorList.push(user);
        } else if (user.group_id == "inspector") {
          inspectorList.push(user);
        }
      });
      return {
        userList: nextProps.userList,
        supervisors: supervisorList,
        inspectors: inspectorList,
        usersActionType: nextProps.myActionsType,
      };
    } else if (
      nextProps.workPlanTemplates &&
      nextProps.workPlanTemplates !== prevState.workPlanTemplates &&
      nextProps.actionType == "WORKPLANTEMPLATES_READ_SUCCESS" &&
      prevState.actionType !== nextProps.actionType
    ) {
      return {
        actionType: nextProps.actionType,
        workPlanTemplates: nextProps.workPlanTemplates,
        spinnerLoading: false,
      };
    } else if (nextProps.actionType == "WORKPLANTEMPLATES_READ_REQUEST" && prevState.actionType !== nextProps.actionType) {
      return {
        actionType: nextProps.actionType,
        spinnerLoading: true,
      };
    } else if (nextProps.actionType == "WORKPLANTEMPLATES_READ_FAILURE" && prevState.actionType !== nextProps.actionType) {
      return {
        actionType: nextProps.actionType,
        spinnerLoading: false,
      };
    }
    // else if (
    //   nextProps.sodList &&
    //   nextProps.sodList !== prevState.sodList &&
    //   nextProps.sodActionType == 'SOD_LIST_GET_SUCCESS' &&
    //   prevState.actionType !== nextProps.sodActionType
    // ) {
    //   return {
    //     actionType: nextProps.sodActionType,
    //     sodList: nextProps.sodList
    //   }
    // }
    else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "WORKPLANTEMPLATE_CREATE_SUCCESS") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "WORKPLANTEMPLATE_CREATE_FAILURE") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "WORKPLANTEMPLATE_DELETE_REQUEST") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "WORKPLANTEMPLATE_DELETE_SUCCESS") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "WORKPLANTEMPLATE_DELETE_FAILURE") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "WORKPLANTEMPLATE_UPDATE_SUCCESS") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "WORKPLANTEMPLATE_UPDATE_FAILURE") {
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
    } else if (
      nextProps.templateHelperActionType !== prevState.actionType &&
      nextProps.templateHelperActionType == "TEMPLATES_SORT_UPDATE_FAILURE"
    ) {
      return {
        actionType: nextProps.templateHelperActionType,
      };
    } else {
      return null;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "WORKPLANTEMPLATES_READ_SUCCESS") {
      this.calculateJourneyPlanData(this.state.workPlanTemplates, this.state.sodList);
      this.setState({
        planCalculated: false,
      });
    }
    // if (prevState.actionType !== this.state.actionType && this.state.actionType == 'SOD_LIST_GET_SUCCESS') {
    //   if (!this.state.planCalculated) {
    //     this.calculateJourneyPlanData(this.state.journeyPlans, this.state.sodList)

    //     this.setState({
    //       planCalculated: true
    //     })
    //   }

    //   //      this.calculatejourneyPlanSummary(this.state.journeyPlans)
    // }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "WORKPLANTEMPLATES_READ_FAILURE") {
      if (this.props.errorMessage !== prevProps.errorMessage && this.props.errorMessage.status == 401) {
        this.props.history.push("/login");
      }
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "WORKPLANTEMPLATE_CREATE_SUCCESS") {
      this.showToastInfo(`${languageService("Inspection Created Successfully")}`);
      this.props.getWorkPlanTemplates(this.props.selectedLine._id);
      this.props.getRunOfLines();
    }
    if (
      prevState.actionType !== this.state.actionType &&
      (this.state.actionType == "WORKPLANTEMPLATE_CREATE_FAILURE" ||
        this.state.actionType == "WORKPLANTEMPLATE_UPDATE_FAILURE" ||
        this.state.actionType == "WORKPLANTEMPLATE_DELETE_FAILURE")
    ) {
      if (this.props.errorMessage.status) {
        this.showToastError(languageService(this.props.errorMessage.status), languageService(this.props.errorMessage.statusText));
      } else {
        this.showToastError(languageService(this.props.errorMessage) + languageService("Work Plan"));
      }
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "WORKPLANTEMPLATE_DELETE_SUCCESS") {
      this.showToastInfo(languageService("Inspection Deleted Successfully"));
      this.props.getWorkPlanTemplates(this.props.selectedLine._id);
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "WORKPLANTEMPLATE_UPDATE_SUCCESS") {
      this.showToastInfo(languageService("Inspection Updated Successfully"));
      this.props.getWorkPlanTemplates(this.props.selectedLine._id);
    }
    if (
      prevProps.templateHelperActionType !== this.props.templateHelperActionType &&
      this.props.templateHelperActionType == "TEMPLATES_SORT_UPDATE_FAILURE"
    ) {
      this.setState({
        sortedChangesSaveButton: true,
        sortDirectionChange: true,
      });
    }
    if (
      prevProps.templateHelperActionType !== this.props.templateHelperActionType &&
      this.props.templateHelperActionType == "TEMPLATES_SORT_UPDATE_SUCCESS"
    ) {
      this.props.getWorkPlanTemplates(this.props.selectedLine._id);
      this.setState({
        sortedChanges: {},
      });
    }
    if (
      this.props.templateHelperActionType !== prevProps.templateHelperActionType &&
      this.props.templateHelperActionType == "TEMPLATES_SORT_DEFAULT_SUCCESS"
    ) {
      this.props.getWorkPlanTemplates(this.props.selectedLine._id);
    }

    if (
      this.props.lineRunNumbers &&
      this.props.runHelperActionType !== prevProps.runHelperActionType &&
      this.props.runHelperActionType == "GET_LINE_RUN_SUCCESS"
    ) {
      let filtered = filterRunRanges(this.props.lineRunNumbers);
      this.setState({
        runRanges: filtered,
        lineRunNumbers: this.props.lineRunNumbers,
      });
    }
  }
  handleSummaryClick(card) {
    console.log("Summery Clicked for", card);
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

  handleAddEditModalClick(modalState, journeyPlan) {
    //    console.log(modalState)
    if (modalState.target) {
      //    console.log(modalState.target)
    }

    this.setState({
      addModal: !this.state.addModal,
      modalState: typeof modalState === "string" ? modalState : "None",
        formType: 'inspectionForm',
      selectedJourneyPlan: journeyPlan,
    });
  }

    handleAlertClick(journeyPlan) {
        this.setState({
            addModal: !this.state.addModal,
            modalState: 'Edit',
            formType: 'alertSetupFormViewOnlyMode',
            selectedJourneyPlan: journeyPlan,
        });
    }

  handleViewClick(journeyPlan, filterName, pageSize) {
    this.props.savePageNum({
      name: "workPlanTemplate",
      number: this.state.listPage,
      filter: filterName,
      pageSize: pageSize,
    });
    //  this.props.getWorkPlanTemplate('line/' + journeyPlan._id)
  }

  handleAddJourneyPlan(journeyPlanObj) {
    let journeyPlan = { ...journeyPlanObj };
    // journeyPlan.lineId = this.props.selectedLine._id;
    // journeyPlan.lineName = this.props.selectedLine.unitId;
    // journeyPlan.subdivision = this.props.selectedLine.subdivision;
    delete journeyPlan.runId;
    this.props.createWorkPlanTemplate(journeyPlan);
  }

  handleEditJourneyPlan(journeyPlan, filterName, pageSize) {
    this.props.savePageNum({
      name: "workPlanTemplate",
      number: this.state.listPage,
      filter: filterName,
      pageSize: pageSize,
    });
    let copyJourneyPlan = { ...journeyPlan };
    copyJourneyPlan._id = this.state.selectedJourneyPlan._id;
    this.props.updateWorkPlanTemplate(copyJourneyPlan);
  }


  handleDeleteClick(journeyPlan) {
    if (!journeyPlan.isDeleteable) {
      this.setState({
        confirmationDialog: true,
        planToDelete: journeyPlan,
      });
    } else {
      this.setState({
        warningDialog: true,
        planToDelete: journeyPlan,
      });
    }
  }



  handleConfirmationToggle() {
    this.setState({
      confirmationDialog: !this.state.confirmationDialog,
    });
  }
  handleConfirmation(response) {
    if (response) {
      this.props.deleteWorkPlanTemplate(this.state.planToDelete);
    }
    this.setState({
      planToDelete: null,
      confirmationDialog: false,
    });
  }

  calculateJourneyPlanData(jPlansOrg, sods) {
    let sumVal = {
      first: 0,
    };
    sumVal.first = jPlansOrg.length;
    sumVal.second = jPlansOrg.length;
    let sortMode = "Default";
    jPlansOrg.forEach((plan) => {
      if (plan.sort_id !== 0) {
        sortMode = "Custom";
      }
    });
    this.setState({
      summaryValue: sumVal,
      workPlans: jPlansOrg,
      workPlansView: jPlansOrg,
      listPage: this.props.planPageNum,
      planFilter: this.props.planFilter,
      sortMode: sortMode,
      planPageSize: this.props.planPageSize,
    });
    //this.props.clearPageNum("workPlan");
    //this.checkStateExistenceAfterMount();
  }
  // checkStateExistenceAfterMount() {
  //     this.handleUpdateFilterState({
  //       ...TEMPLATE_ISSUES_FILTERS,
        
  //     });
    
  // }
  handlePageStateSave(page, planPageSize) {
     this.setState({
      planPageSize,
      listPage: page,
     });
    this.handleUpdateFilterState({
      planPageSize,
      listPage: page,
    });
  }
  handlePageSize(planPageSize) {
    this.handleUpdateFilterState({
      planPageSize,
      
    });
  }
  handleUpdateFilterState(propertiesToUpdate) {
    let issuesFilter = this.props.issuesFilter ? this.props.issuesFilter : {};

    this.props.updateFilterState("issuesFilter", {
      ...issuesFilter,
      ...propertiesToUpdate,
    });
  }
  resetPage() {
    this.setState({
      listPage:  0 ,
    });
  }

  handleSort(plan, direction) {
    if (direction == "moveUp") {
      this.handleSortUp(plan);
    } else if (direction == "moveDown") {
      this.handleSortDown(plan);
    } else if (direction == "moveTop") {
      this.handleSortToTop(plan);
    } else {
      this.handleSortToDown(plan);
    }
  }

  saveSort() {
    this.props.updateTemplateSort(this.state.sortedChanges);
    this.setState({
      sortedChangesSaveButton: false,
      sortDirectionChange: false,
    });
  }
  handleSortDown(plan) {
    const { workPlansView } = this.state;
    let workPlansViewCopy = _.cloneDeep(workPlansView);
    const { sortedChanges } = this.state;
    let sortedButtonState = this.state.sortedChangesSaveButton;
    let sortDirectionChange = this.state.sortDirectionChange;
    let copyChangedSort = _.cloneDeep(sortedChanges);
    let currentSortIdIndex = _.findIndex(workPlansViewCopy, { _id: plan._id });
    if (currentSortIdIndex !== workPlansView.length - 1) {
      if (currentSortIdIndex == 0 || currentSortIdIndex) {
        workPlansViewCopy[currentSortIdIndex].sort_id = plan.sort_id - 1;
        workPlansViewCopy[currentSortIdIndex + 1].sort_id = plan.sort_id;
      }

      copyChangedSort[workPlansViewCopy[currentSortIdIndex]._id] = workPlansViewCopy[currentSortIdIndex];
      copyChangedSort[workPlansViewCopy[currentSortIdIndex + 1]._id] = workPlansViewCopy[currentSortIdIndex + 1];
      sortedButtonState = true;
      sortDirectionChange = true;
      // console.log('Plan to Move')
      // console.log(workPlansViewCopy[currentSortIdIndex])
      // console.log('Plan Moved in Response')
      // console.log(workPlansViewCopy[currentSortIdIndex + 1])
    }
    let newSortedTemplates = _.orderBy(workPlansViewCopy, "sort_id", "desc");
    // console.log('Sorted Change map')
    // console.log(copyChangedSort)
    this.setState({
      workPlansView: newSortedTemplates,
      sortedChanges: copyChangedSort,
      sortedChangesSaveButton: sortedButtonState,
      sortDirectionChange: sortDirectionChange,
    });
  }
  handleSortUp(plan) {
    const { workPlansView } = this.state;
    let workPlansViewCopy = _.cloneDeep(workPlansView);
    const { sortedChanges } = this.state;
    let sortedButtonState = this.state.sortedChangesSaveButton;
    let sortDirectionChange = this.state.sortDirectionChange;
    let copyChangedSort = _.cloneDeep(sortedChanges);
    let currentSortIdIndex = _.findIndex(workPlansViewCopy, { _id: plan._id });

    if (currentSortIdIndex) {
      workPlansViewCopy[currentSortIdIndex].sort_id = plan.sort_id + 1;
      workPlansViewCopy[currentSortIdIndex - 1].sort_id = plan.sort_id;
      copyChangedSort[workPlansViewCopy[currentSortIdIndex]._id] = workPlansViewCopy[currentSortIdIndex];
      copyChangedSort[workPlansViewCopy[currentSortIdIndex - 1]._id] = workPlansViewCopy[currentSortIdIndex - 1];
      sortedButtonState = true;
      sortDirectionChange = true;
    }

    //console.log('Plan to Move')
    //console.log(workPlansViewCopy[currentSortIdIndex])
    //console.log('Plan Moved in Response')
    //console.log(workPlansViewCopy[currentSortIdIndex + 1])

    let newSortedTemplates = _.orderBy(workPlansViewCopy, "sort_id", "desc");
    //console.log('Sorted Change map')
    //console.log(copyChangedSort)
    this.setState({
      workPlansView: newSortedTemplates,
      sortedChanges: copyChangedSort,
      sortedChangesSaveButton: sortedButtonState,
      sortDirectionChange: sortDirectionChange,
    });
  }
  handleSortToDown(plan) {
    const { workPlansView } = this.state;
    let workPlansViewCopy = _.cloneDeep(workPlansView);
    const { sortedChanges } = this.state;
    let sortedButtonState = this.state.sortedChangesSaveButton;
    let sortDirectionChange = this.state.sortDirectionChange;
    let copyChangedSort = _.cloneDeep(sortedChanges);
    let currentSortIdIndex = _.findIndex(workPlansViewCopy, { _id: plan._id });
    // console.log('Plan To Move')
    // console.log(workPlansViewCopy[currentSortIdIndex])
    if (currentSortIdIndex || currentSortIdIndex == 0) {
      workPlansViewCopy.forEach((template, index) => {
        if (index > currentSortIdIndex) {
          template.sort_id = template.sort_id + 1;
          copyChangedSort[template._id] = template;
        }
      });
      workPlansViewCopy[currentSortIdIndex].sort_id = 1;
      copyChangedSort[workPlansViewCopy[currentSortIdIndex]._id] = workPlansViewCopy[currentSortIdIndex];
      if (plan.sort_id !== 1) {
        sortedButtonState = true;
        sortDirectionChange = true;
      }
    }
    // console.log('Plan Moved')
    // console.log(workPlansViewCopy[currentSortIdIndex])

    let newSortedTemplates = _.orderBy(workPlansViewCopy, "sort_id", "desc");
    // console.log('Sorted Change map')
    // console.log(copyChangedSort)
    this.setState({
      workPlansView: newSortedTemplates,
      sortedChanges: copyChangedSort,
      sortedChangesSaveButton: sortedButtonState,
      sortDirectionChange: sortDirectionChange,
    });
  }
  handleSortToTop(plan) {
    const { workPlansView } = this.state;
    let workPlansViewCopy = _.cloneDeep(workPlansView);
    const { sortedChanges } = this.state;
    let copyChangedSort = _.cloneDeep(sortedChanges);
    let sortedButtonState = this.state.sortedChangesSaveButton;
    let sortDirectionChange = this.state.sortDirectionChange;
    let currentSortIdIndex = _.findIndex(workPlansViewCopy, { _id: plan._id });
    //console.log('Plan To Move')
    //console.log(workPlansViewCopy[currentSortIdIndex])
    if (currentSortIdIndex) {
      workPlansViewCopy.forEach((template, index) => {
        if (index < currentSortIdIndex) {
          template.sort_id = template.sort_id - 1;
          copyChangedSort[template._id] = template;
        }
      });
      workPlansViewCopy[currentSortIdIndex].sort_id = workPlansViewCopy.length;
      copyChangedSort[workPlansViewCopy[currentSortIdIndex]._id] = workPlansViewCopy[currentSortIdIndex];
      sortedButtonState = true;
      sortDirectionChange = true;
    }
    //console.log('Plan Moved')
    //console.log(workPlansViewCopy[currentSortIdIndex])

    let newSortedTemplates = _.orderBy(workPlansViewCopy, "sort_id", "desc");
    //console.log('Sorted Change map')
    //console.log(copyChangedSort)
    this.setState({
      workPlansView: newSortedTemplates,
      sortedChanges: copyChangedSort,
      sortedChangesSaveButton: sortedButtonState,
      sortDirectionChange: sortDirectionChange,
    });
  }
  handleCancelEdit(mode) {
    if (mode == "Reset") {
      let workPlanToCustomSort = _.cloneDeep(this.state.workPlans);
      const { sortedChanges } = this.state;
      let copyChangedSort = _.cloneDeep(sortedChanges);
      if (workPlanToCustomSort.length > 0) {
        workPlanToCustomSort.forEach((plan, index) => {
          plan.sort_id = 0;
          copyChangedSort[plan._id] = plan;
        });
        let newSortedTemplates = _.orderBy(workPlanToCustomSort, "nextInspectionDate", "asc");
        this.setState({
          workPlansView: newSortedTemplates,
          sortedChanges: copyChangedSort,
          sortedChangesSaveButton: true,
        });
      }
    } else {
      this.setState({
        workPlansView: this.state.workPlans,
        sortedButtonState: false,
      });
    }
  }

  setSortCustomMode() {
    let workPlanToCustomSort = _.cloneDeep(this.state.workPlans);
    const { sortedChanges } = this.state;
    let copyChangedSort = _.cloneDeep(sortedChanges);
    if (workPlanToCustomSort.length > 0) {
      workPlanToCustomSort.forEach((plan, index) => {
        plan.sort_id = workPlanToCustomSort.length - index;
        copyChangedSort[plan._id] = plan;
      });
      let newSortedTemplates = _.orderBy(workPlanToCustomSort, "sort_id", "desc");
      this.setState({
        workPlansView: newSortedTemplates,
        sortedChanges: copyChangedSort,
        sortedChangesSaveButton: true,
      });
    }
  }

  render() {
    const { path } = this.props.match;
    let WorkplanTableHeadingPadding = { padding: "30px 0px 30px 0px" };
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    //console.log(this.props.lineRunNumbers)
    return (
      <Col md="12">
        {modelRendered}
        <ConfirmationDialog
          modal={this.state.confirmationDialog}
          toggle={this.handleConfirmationToggle}
          handleResponse={this.handleConfirmation}
          confirmationMessage={languageService("Are you sure you want to delete")}
          headerText={languageService("Confirm Deletion")}
        />

        <WarningDialog
          modal={this.state.warningDialog}
          toggle={() => this.setState(({ warningDialog }) => ({ warningDialog: !warningDialog }))}
          handleResponse={() => this.setState({ warningDialog: false })}
          warningMessage={"You cannot delete this line."}
          headerText={"Warning"}
        />

        <JourneyPlanAdd
          modal={this.state.addModal}
          formType={this.state.formType}
          toggle={this.handleAddEditModalClick}
          modalState={this.state.modalState}
          handleAddSubmit={this.handleAddJourneyPlan}
          handleEditSubmit={this.handleEditJourneyPlan}
          selectedJourneyPlan={this.state.selectedJourneyPlan}
          userList={this.state.userList}
          supervisors={this.state.supervisors}
          inspectors={this.state.inspectors}
          journeyPlans={this.state.workPlanTemplates}
          lineRunNumbers={this.state.lineRunNumbers}
          runRanges={this.state.runRanges}
          updateLineRunNumbers={this.updateLineRunNumbers}
        />
        <Row style={themeService(commonStyles.pageBorderRowStyle)}>
          <Col md="6" style={{ paddingLeft: "0px" }}>
            <div style={themeService(commonStyles.pageTitleStyle)}>{languageService(compNames.mainHeadingName)}</div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService(compNames.subHeadingSummaryName)}</h4>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <JourneyPlanSummary
              descriptions={this.summaryDesc}
              values={this.state.summaryValue}
              handleAddNewClick={this.handleAddEditModalClick}
              permissionCheckProps={true}
              permissionCheck={permissionCheck("WORKPLAN", "create")}
              AddButton
              addTootTipText={languageService(compNames.addButtonToolTipName)}
              addToolTipId="plan"
              buttonTitleText={languageService(compNames.addButtonHeadingName)}
              handleSummaryClick={this.handleSummaryClick}
              summaryShowHide={this.state.summaryShowHide}
              noHideSummary
              summaryLabels={this.summaryLabels}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div style={{ borderBottom: "1px solid #d1d1d1", margin: "0px" }}>
              <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
                <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService(compNames.subHeadingTableName)}</h4>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <JourneyPlanList
              path={path}
              resetPage={this.resetPage}
              planningTableData={this.state.workPlansView}
              handleEditClick={this.handleAddEditModalClick}
              handleDeleteClick={this.handleDeleteClick}
              handleViewClick={this.handleViewClick}
              actionType={this.state.actionType}
              handlePageSave={this.handlePageStateSave}
              handlePageSize={this.handlePageSize}
              page={this.state.listPage}
              planFilter={this.state.planFilter}
              handleAlertClick={this.handleAlertClick}
              handleSort={this.handleSort}
              pageSize={this.state.planPageSize}
              handleCancelEdit={this.handleCancelEdit}
              handleSaveEditClick={this.saveSort}
              setSortCustomMode={this.setSortCustomMode}
              sortedChangesSaveButton={this.state.sortedChangesSaveButton}
              sortMode={this.state.sortMode}
            />
          </Col>
        </Row>
      </Col>
    );
  }
}

let variables = {
  userReducer: {
    userList: [],
  },
  utilReducer: {
    planPageNum: 0,
    planFilter: "today",
    planPageSize: 20,
  },
  templateHelperReducer: {
    noVar: "",
  },
  lineSelectionReducer: {
    selectedLine: {},
  },
  runNumberReducer: {
    runNumber: {},
  },
  runHelperReducer: {
    lineRunNumbers: [],
  },
  filterStateReducer: {
    issuesFilter: null,
  },
};

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: {
    userListRequest,
    savePageNum,
    clearPageNum,
    updateTemplateSort,
    getRunOfLines,
    updateFilterState,
  },
};
let JourneyPlanContainer = CRUDFunction(JourneyPlan, "workPlanTemplate", actionOptions, variables, [
  "userReducer",
  "utilReducer",
  "templateHelperReducer",
  "lineSelectionReducer",
  "runNumberReducer",
  "runHelperReducer",
  "filterStateReducer",
]);
export default JourneyPlanContainer;
