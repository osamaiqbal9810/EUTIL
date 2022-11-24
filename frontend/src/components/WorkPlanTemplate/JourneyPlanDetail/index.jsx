import React, { Component } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import Gravatar from "react-gravatar";
import DayPicker, { DateUtils } from "react-day-picker";
import moment from "moment";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "components/Common/Buttons";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import "./calanderStyle.css";
import { guid } from "utils/UUID";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { circle } from "react-icons-kit/fa/circle";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import { Link, Route } from "react-router-dom";
import TasksTable from "./TasksTableList/TasksTable";
import TasksAddEdit from "./TasksAddEdit/TasksAddEdit";
import { uploadImgs } from "reduxRelated/actions/imgsUpload.js";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import { CRUDFunction } from "reduxCURD/container";
import { commonReducers } from "reduxCURD/reducer";
import { curdActions } from "reduxCURD/actions";
import { ButtonMain } from "components/Common/Buttons";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip } from "reactstrap";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { compDetailNames } from "../componentNames.js";
import { languageService } from "../../../Language/language.service";
import { themeService } from "../../../theme/service/activeTheme.service";
import { commonSummaryStyle } from "../../Common/Summary/styles/CommonSummaryStyle";
import { commonStyles } from "../../../theme/commonStyles";
import { retroColors, basicColors } from "../../../style/basic/basicColors";
import permissionCheck from "../../../utils/permissionCheck";

class WorkPlanDetailComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTask: {},
      showSelectedDate: true,
      modalState: "None",
      addModal: false,
      taskToDelete: null,
      confirmationDialog: false,
      workPlanTemplate: {},
      actionType: "",
      tooltipOpen: false,
      spinnerLoading: false,
      // summaryDesc: { first: 'Total Units', second: 'Units Length', third: 'Turnarounds', fourth: 'Switches' },
      // summaryValue: { first: 0, second: 0, third: 0, fourth: 0 },
    };
    this.styles = planStyle;
    this.handleAddEditNewClick = this.handleAddEditNewClick.bind(this);
    this.hanldleEditJourneyPlanTasks = this.hanldleEditJourneyPlanTasks.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleAddJourneyPlanTask = this.handleAddJourneyPlanTask.bind(this);
    this.uploadImgs = this.uploadImgs.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleConfirmationToggle = this.handleConfirmationToggle.bind(this);
  }

  toggleTooltip() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }

  handleAddEditNewClick(modalState, task) {
    //console.log(modalState)
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedTask: task,
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.workPlanTemplate !== prevState.workPlanTemplates &&
      nextProps.workPlanTemplate &&
      nextProps.workPlanTemplateActionType !== prevState.actionType &&
      nextProps.workPlanTemplateActionType == "WORKPLANTEMPLATE_READ_SUCCESS"
    ) {
      return {
        spinnerLoading: false,
        workPlanTemplate: nextProps.workPlanTemplate,
        actionType: nextProps.workPlanTemplateActionType,
      };
    } else if (
      prevState.actionType !== nextProps.workPlanTemplateActionType &&
      nextProps.workPlanTemplateActionType == "WORKPLANTEMPLATE_READ_REQUEST"
    ) {
      return {
        actionType: nextProps.workPlanTemplateActionType,
        spinnerLoading: true,
      };
    } else if (
      prevState.actionType !== nextProps.workPlanTemplateActionType &&
      nextProps.workPlanTemplateActionType == "WORKPLANTEMPLATE_READ_FAILURE"
    ) {
      return {
        actionType: nextProps.workPlanTemplateActionType,
        spinnerLoading: false,
      };
    } else if (
      nextProps.workPlanTemplateActionType !== prevState.actionType &&
      (nextProps.workPlanTemplateActionType == "WORKPLANTEMPLATE_UPDATE_REQUEST" ||
        nextProps.workPlanTemplateActionType == "WORKPLANTEMPLATE_UPDATE_SUCCESS" ||
        nextProps.workPlanTemplateActionType == "WORKPLANTEMPLATE_UPDATE_FAILURE")
    ) {
      return {
        actionType: nextProps.workPlanTemplateActionType,
      };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "WORKPLANTEMPLATE_READ_SUCCESS") {
      //  this.props.getTrack()
      this.props.getAppMockupsTypes("assetType");
      this.props.getAssets(this.props.workPlanTemplate.lineId);
    }
    // WORKPLAN TEMPLATE UPDATE REDUNDANT
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "WORKPLANTEMPLATE_UPDATE_SUCCESS") {
      this.showToastInfo(languageService("Inspection Updated Successfully !"));
      this.props.getWorkPlanTemplate(this.props.match.params.id);
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "WORKPLANTEMPLATE_UPDATE_FAILURE") {
      if (this.props.workPlanTemplateErrorMessage.status) {
        this.showToastError(
          languageService(this.props.workPlanTemplateErrorMessage.status),
          languageService(this.props.workPlanTemplateErrorMessage.statusText),
        );
      } else {
        this.showToastError(languageService(this.props.workPlanTemplateErrorMessage) + languageService("Task"));
      }
    }
    // TEMPLATE TASK ACTIONS HANDLING
    if (this.props.actionType !== prevProps.actionType && this.props.actionType == "WORKPLANTEMPLATETASK_UPDATE_SUCCESS") {
      this.showToastInfo(languageService("Task Updated Successfully!"));
      this.setState({
        workPlanTemplate: this.props.workPlanTemplateTask,
      });
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType == "WORKPLANTEMPLATETASK_CREATE_SUCCESS") {
      this.showToastInfo(languageService("Task Created Successfully!"));
      this.setState({
        workPlanTemplate: this.props.workPlanTemplateTask,
      });
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType == "WORKPLANTEMPLATETASK_DELETE_SUCCESS") {
      this.showToastInfo(`${languageService("Task Deleted Successfully")}`);
      this.props.getWorkPlanTemplate(this.props.match.params.id);
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType == "WORKPLANTEMPLATETASK_CREATE_FAILURE") {
      this.showToastError(languageService("Task Creation Failed!"));
    }
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

  componentDidMount() {
    this.props.getWorkPlanTemplate("/" + this.props.match.params.id);
  }

  uploadImgs(img) {
    this.props.uploadImgs(img);
  }

  handleAddJourneyPlanTask(task) {
    console.log(task);
    let newTask = { ...task };
    //  delete newTask.locationSpecial;
    const { workPlanTemplate } = this.state;
    newTask.taskId = guid();
    newTask.type = "special";
    newTask.active = true;
    newTask.createdAt = new Date();
    newTask.updatedAt = new Date();

    this.props.createWorkPlanTemplateTask({
      templateId: workPlanTemplate._id,
      task: newTask,
      type: "WorkPlan",
    });
  }

  hanldleEditJourneyPlanTasks(task) {
    let newTask = { ...task };
    const { workPlanTemplate } = this.state;
    // delete newTask.locationSpecial;
    newTask.updatedAt = new Date();
    // let copyJourneyPlan = { ...workPlanTemplate }
    // copyJourneyPlan.tasks = [...workPlanTemplate.tasks]
    // let resultIndex = _.findIndex(copyJourneyPlan.tasks, { taskId: newTask.taskId })

    // if (resultIndex || resultIndex == 0) {
    //   copyJourneyPlan.tasks[resultIndex] = task
    // }
    this.props.updateWorkPlanTemplateTask({ task: newTask, type: "WorkPlan" }, workPlanTemplate._id);
  }

  handleDeleteClick(task) {
    this.setState({
      confirmationDialog: true,
      taskToDelete: task,
    });
  }

  handleConfirmationToggle() {
    this.setState({
      confirmationDialog: !this.state.confirmationDialog,
    });
  }
  handleConfirmation(response) {
    if (response) {
      this.props.deleteWorkPlanTemplateTask({ task: this.state.taskToDelete, type: "WorkPlan" }, this.state.workPlanTemplate._id);
    }
    this.setState({
      taskToDelete: null,
      confirmationDialog: false,
    });
  }

  render() {
    let mainTitle = this.state.workPlanTemplate ? this.state.workPlanTemplate.title : languageService(compDetailNames.mainHeadingName);
    let userName = this.state.workPlanTemplate.user ? this.state.workPlanTemplate.user.name : "";
    let showAddButton = true;
    !permissionCheck("INSPECTION TASK", "create") && (showAddButton = false);
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <div>
        <ConfirmationDialog
          modal={this.state.confirmationDialog}
          toggle={this.handleConfirmationToggle}
          handleResponse={this.handleConfirmation}
          confirmationMessage={languageService("Are you sure you want to delete")}
          headerText={languageService("Confirm Deletion")}
        />
        <TasksAddEdit
          modal={this.state.addModal}
          modalState={this.state.modalState}
          toggle={this.handleAddEditNewClick}
          handleAddSubmit={this.handleAddJourneyPlanTask}
          handleEditSubmit={this.hanldleEditJourneyPlanTasks}
          selectedTask={this.state.selectedTask}
          journeyPlan={this.state.workPlanTemplate}
          tracks={this.props.tracks}
          uploadImg={this.uploadImgs}
          asset={this.props.assets}
          type={"special"}
        />
        {modelRendered}
        <Row style={themeService(commonStyles.pageBorderRowStyle)}>
          <Col md="6" style={{ paddingLeft: "0px" }}>
            <div style={themeService(commonStyles.pageTitleDetailStyle)}>
              <Link to="/setup/inspectionplan" className="linkStyleTable">
                <SvgIcon
                  size={25}
                  icon={ic_arrow_back}
                  style={{
                    marginRight: "5px",
                    marginLeft: "5px",
                    verticalAlign: "middle",
                    cursor: "pointer",
                  }}
                />
              </Link>
              <SvgIcon size={12} icon={circle} style={{ marginRight: "10px", marginLeft: "5px" }} />
              {mainTitle}
            </div>
          </Col>
        </Row>
        <Row style={{ margin: "0px" }}>
          <Col md="12">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>
                {languageService(compDetailNames.subHeadingSummaryName)}
              </h4>
            </div>
          </Col>
          <Col md="12" style={{ padding: "0px" }}>
            <div style={themeService(this.styles.JourneyPlanInfoContainer)}>
              <Row>
                <Col md={"11"}>
                  <Row>
                    <Col md={3}>
                      <div style={themeService(this.styles.fieldHeading)}>{languageService("User")}</div>
                      <div style={themeService(this.styles.fieldText)}>
                        <Gravatar style={{ borderRadius: "30px", marginRight: "15px" }} email={"abc@abc.com"} size={20} />
                        {userName}
                      </div>
                    </Col>
                    <Col md={3}>
                      {this.state.workPlanTemplate && this.state.workPlanTemplate.lineName && (
                        <React.Fragment>
                          <div style={themeService(this.styles.fieldHeading)}>{languageService("Location")}</div>
                          <div>
                            <div style={themeService(this.styles.fieldText)}> {this.state.workPlanTemplate.lineName} </div>
                          </div>
                        </React.Fragment>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col md="1">
                  {showAddButton && (
                    <div id="toolTipAddTask">
                      <ButtonCirclePlus
                        iconSize={60}
                        icon={withPlus}
                        handleClick={(e) => {
                          this.handleAddEditNewClick("Add");
                        }}
                        {...themeService(commonSummaryStyle.addButtonStyle(this.props))}
                        buttonTitleText={languageService(compDetailNames.addButtonHeadingName)}
                      />
                      <Tooltip isOpen={this.state.tooltipOpen} target="toolTipAddTask" toggle={this.toggleTooltip}>
                        {languageService(compDetailNames.addButtonToolTipName)}
                      </Tooltip>
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          </Col>
          <Col md="12">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>
                {languageService(compDetailNames.subHeadingTableName)}
              </h4>
            </div>
          </Col>
          <Col md="12">
            <TasksTable
              journeyPlan={this.state.workPlanTemplate}
              handleEditClick={this.handleAddEditNewClick}
              handleDeleteClick={this.handleDeleteClick}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const getWorkPlanTemplate = curdActions.getWorkPlanTemplate;
const updateWorkPlanTemplate = curdActions.updateWorkPlanTemplate;
const getAssets = curdActions.getAssets;
const getTrack = curdActions.getTrack;
let actionOptions = {
  create: true,
  update: true,
  read: false,
  delete: true,
  others: {
    getWorkPlanTemplate,
    updateWorkPlanTemplate,
    uploadImgs,
    getAppMockupsTypes,
    getAssets,
  },
};

let variableList = {
  workPlanTemplateReducer: { workPlanTemplate: "" },
  assetReducer: { assets: null },
  trackReducer: { tracks: "" },
  diagnosticsReducer: { assetTypes: "" },
  lineSelectionReducer: {
    selectedLine: {},
  },
};

const JourneyPlanDetailContainer = CRUDFunction(WorkPlanDetailComponent, "workPlanTemplateTask", actionOptions, variableList, [
  "workPlanTemplateReducer",
  "trackReducer",
  "diagnosticsReducer",
  "lineSelectionReducer",
  "assetReducer",
]);

export default JourneyPlanDetailContainer;

let planStyle = {
  JourneyPlanInfoContainer: {
    default: {
      background: "#fff",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "0px 30px  0px 30px",
      padding: "15px",
      textAlign: "left",
      color: " rgba(64, 118, 179)",
      fontSize: "12px",
      minHeight: "150px",
    },
    retro: {
      background: "#fff",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "0px 30px  0px 30px",
      padding: "15px",
      textAlign: "left",
      color: " rgba(64, 118, 179)",
      fontSize: "12px",
      minHeight: "150px",
    },
  },
  fieldHeading: {
    default: {
      color: "rgba(64, 118, 179)",
      fontWeight: "600",
      fontSize: "14px",
      paddingBottom: "1em",
    },
    retro: { color: retroColors.second, fontWeight: "600", fontSize: "14px", paddingBottom: "1em" },
  },
  fieldText: {
    default: {
      color: basicColors.first,
      width: "fit-content",
      minWidth: "100px",
      border: "1px solid #f1f1f1",
      boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
      padding: "10px",
      borderRadius: "5px",
    },
    retro: {
      color: retroColors.second,
      width: "fit-content",
      minWidth: "100px",
      border: "1px solid #f1f1f1",
      boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
      padding: "10px",
      borderRadius: "5px",
    },
  },
};
