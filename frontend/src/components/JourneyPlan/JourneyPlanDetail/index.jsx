/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import Gravatar from "react-gravatar";
import moment from "moment";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "components/Common/Buttons";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import permissionCheck from "utils/permissionCheck.js";
import { guid } from "utils/UUID";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { circle } from "react-icons-kit/fa/circle";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import { Link, Route } from "react-router-dom";
import TasksTableInspection from "./TasksTableList/TasksTable";
import TasksAddEdit from "./../../WorkPlanTemplate/JourneyPlanDetail/TasksAddEdit/TasksAddEdit";
import { uploadImgs } from "reduxRelated/actions/imgsUpload.js";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { toast } from "react-toastify";
import { Tooltip } from "reactstrap";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { languageService } from "../../../Language/language.service";
// import DefectCodes from "../../IssuesReports/DefectCodes/DefectCodes";
import CommonModal from "../../Common/CommonModal";
import Briefing from "./Briefing";
import { MyButton } from "../../Common/Forms/formsMiscItems";
import { themeService } from "../../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { journeyPlanMainStyles } from "../styles/Inspections";
import { commonSummaryStyle } from "../../Common/Summary/styles/CommonSummaryStyle";
import { updateWorkPlanFutureInspection } from "reduxRelated/actions/templateHelperActions";
class JourneyPlanComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTask: {},
      showSelectedDate: true,
      modalState: "None",
      addModal: false,
      taskToDelete: null,
      confirmationDialog: false,
      journeyPlan: {},
      actionType: "",
      tooltipOpen: false,
      // summaryDesc: { first: 'Total Units', second: 'Units Length', third: 'Turnarounds', fourth: 'Switches' },
      // summaryValue: { first: 0, second: 0, third: 0, fourth: 0 },
      tracks: [],
      spinnerLoading: false,
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
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedTask: task,
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.journeyPlan &&
      nextProps.journeyPlanActionType !== prevState.actionType &&
      nextProps.journeyPlanActionType == "JOURNEYPLAN_READ_SUCCESS"
    ) {
      // let jPlan = _.cloneDeep(nextProps.journeyPlan)
      // if (jPlan.sod) {
      //   if (jPlan.sod.end) {
      //     jPlan.status = 'Finished'
      //   } else {
      //     jPlan.status = 'In Progress'
      //   }
      // } else {
      //   jPlan.status = 'Not Started'
      // }
      if (nextProps.journeyPlan && nextProps.journeyPlan.lineId) nextProps.getAssets(nextProps.journeyPlan.lineId);
      return {
        journeyPlan: nextProps.journeyPlan,
        actionType: nextProps.journeyPlanActionType,
        spinnerLoading: false,
      };
    } else if (prevState.actionType !== nextProps.journeyPlanActionType && nextProps.journeyPlanActionType == "JOURNEYPLAN_READ_REQUEST") {
      return {
        actionType: nextProps.journeyPlanActionType,
        spinnerLoading: true,
      };
    } else if (prevState.actionType !== nextProps.journeyPlanActionType && nextProps.journeyPlanActionType == "JOURNEYPLAN_READ_FAILURE") {
      return {
        actionType: nextProps.journeyPlanActionType,
        spinnerLoading: false,
      };
    } else if (
      nextProps.journeyPlanActionType !== prevState.actionType &&
      (nextProps.journeyPlanActionType == "JOURNEYPLAN_UPDATE_REQUEST" ||
        nextProps.journeyPlanActionType == "JOURNEYPLAN_UPDATE_SUCCESS" ||
        nextProps.journeyPlanActionType == "JOURNEYPLAN_UPDATE_FAILURE")
    ) {
      return {
        actionType: nextProps.journeyPlanActionType,
      };
    } else if (nextProps.tracks !== prevState.tracks && nextProps.tracks && nextProps.trackActionType == "TRACKS_READ_SUCCESS") {
      return {
        tracks: nextProps.tracks,
      };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.workPlanTemplateActionType !== this.props.workPlanTemplateActionType &&
      this.props.workPlanTemplateActionType == "WORKPLANTEMPLATE_READ_SUCCESS"
    ) {
      console.log("wplanTemplate", this.props.workPlanTemplate);
      let mergedPlan = this.checkModifiedTasksOfPlan(this.props.futureInspection, this.props.workPlanTemplate);
      this.setState({
        journeyPlan: mergedPlan,
      });

      if (this.props.workPlanTemplate && this.props.workPlanTemplate.lineId) this.props.getAssets(this.props.workPlanTemplate.lineId);
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "JOURNEYPLAN_UPDATE_SUCCESS") {
      this.showToastInfo(languageService("Inspection Updated Successfully !"));
      this.props.getJourneyPlan(this.props.match.params.id);
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "JOURNEYPLAN_UPDATE_FAILURE") {
      if (this.props.journeyPlanErrorMessage.status) {
        this.showToastError(
          languageService(this.props.journeyPlanErrorMessage.status),
          languageService(this.props.journeyPlanErrorMessage.statusText),
        );
      } else {
        this.showToastError(languageService(this.props.journeyPlanErrorMessage) + languageService("Tasks"));
      }
    }
    // TEMPLATE TASK ACTIONS HANDLING
    if (this.props.actionType !== prevProps.actionType && this.props.actionType == "JOURNEYPLANTASK_UPDATE_SUCCESS") {
      this.showToastInfo(languageService("Task Updated Successfully!"));
      let tempInspectionPlan = _.cloneDeep(this.props.journeyPlanTask);
      this.setState({
        journeyPlan: tempInspectionPlan,
      });
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType == "JOURNEYPLANTASK_CREATE_SUCCESS") {
      this.showToastInfo(languageService("Task Created Successfully!"));
      this.setState({
        journeyPlan: this.props.journeyPlanTask,
      });
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType == "JOURNEYPLANTASK_DELETE_SUCCESS") {
      this.showToastInfo(languageService("Task Deleted Successfully"));
      this.props.getJourneyPlan(this.props.match.params.id);
    }
    if (
      this.props.templateHelperActionType !== prevProps.templateHelperActionType &&
      this.props.templateHelperActionType == "TEMPLATES_UPDATE_TEMP_SUCCESS"
    ) {
      console.log(" this.props.updatedPlan)", this.props.updatedPlan);
      let updatedPlan = this.checkModifiedTasksOfPlan(this.props.futureInspection, this.props.updatedPlan);
      console.log(updatedPlan);
      this.setState({
        journeyPlan: updatedPlan,
      });
    }
  }
  checkModifiedTasksOfPlan(fInspection, template) {
    let inspection = _.cloneDeep(fInspection);
    let tempModForDate = template && template.modifications ? template.modifications[moment(fInspection.date).format("YYYYMMDD")] : null;
    if (tempModForDate && tempModForDate.tasks) {
      tempModForDate.tasks.forEach((tModified) => {
        let taskExistIndex = _.findIndex(inspection.tasks, { taskId: tModified.taskId });
        if (taskExistIndex > 0) {
          inspection.tasks[taskExistIndex] = tModified;
        } else {
          inspection.tasks.push(tModified);
        }
      });
    }
    return inspection;
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
    // if (!this.props.selectedLine._id) {
    //   let backurl = "/line/inspections/" + this.props.match.params.id;
    //   this.props.history.push(backurl);
    // } else {
    //   this.props.getJourneyPlan("line/" + this.props.match.params.id);
    //   this.props.getTrack();
    //   this.props.getAppMockupsTypes("assetType");
    // }
    if (this.props.location.pathname == "/inspections/futureInspection") {
      if (this.props.futureInspection) {
        console.log("Future inspection", this.props.futureInspection);
        this.props.getWorkPlanTemplate(this.props.futureInspection.workplanTemplateId);
        this.props.getAssets(this.props.futureInspection.lineId);
        // this.setState({
        //   journeyPlan: this.props.futureInspection,
        // });
      } else {
        this.props.history.push("/inspection");
      }
    } else {
      this.props.getJourneyPlan(this.props.match.params.id);
    }
  }

  uploadImgs(img) {
    this.props.uploadImgs(img);
  }

  handleAddJourneyPlanTask(task) {
    let newTask = { ...task };
    //delete newTask.locationSpecial;
    const { journeyPlan } = this.state;
    newTask.taskId = guid();
    newTask.type = "special";
    newTask.createdAt = new Date();
    newTask.updatedAt = new Date();

    if (journeyPlan._id) {
      this.props.createJourneyPlanTask({
        templateId: journeyPlan._id,
        task: newTask,
        type: "JourneyPlan",
      });
    } else {
      let tempToUpdate = { workplanTemplateId: journeyPlan.workplanTemplateId, tempChanges: {}, date: null };
      tempToUpdate.date = moment.utc(journeyPlan.date).format("YYYYMMDD");
      tempToUpdate.taskToUpdate = newTask;
      this.props.updateWorkPlanFutureInspection(tempToUpdate);
    }
  }

  hanldleEditJourneyPlanTasks(task) {
    let newTask = { ...task };
    const { journeyPlan } = this.state;
    delete newTask.locationSpecial;

    newTask.updatedAt = new Date();
    this.props.updateJourneyPlanTask({ task: newTask, type: "JourneyPlan" }, journeyPlan._id);
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
      this.props.deleteJourneyPlanTask({ task: this.state.taskToDelete, type: "JourneyPlan" }, this.state.journeyPlan._id);
    }
    this.setState({
      taskToDelete: null,
      confirmationDialog: false,
    });
  }

  handleBriefingModal = () => {
    this.openModelMethod();
  };

  render() {
    let mainTitle = this.state.journeyPlan ? this.state.journeyPlan.title : "JourneyPlan Title";
    let user = this.state.journeyPlan.temp_user ? this.state.journeyPlan.temp_user : this.state.journeyPlan.user;
    let userName = user ? user.name : "";
    let journeyDate = this.state.journeyPlan.date ? moment(this.state.journeyPlan.date).format("MM-DD-YYYY") : "";
    let showAddButton = null;
    if (this.state.journeyPlan.status !== "Finished") {
      showAddButton = (
        <div id="toolTipAddTask">
          <ButtonCirclePlus
            iconSize={60}
            icon={withPlus}
            permissionCheckProps={true}
            permissionCheck={permissionCheck("INSPECTION TASK", "create")}
            handleClick={(e) => {
              this.handleAddEditNewClick("Add");
            }}
            // backgroundColor="#e3e9ef"
            // margin="0px 0px 0px 0px"
            // borderRadius="50%"
            // hoverBackgroundColor="#e3e2ef"
            // hoverBorder="0px"
            // activeBorder="1px solid #e3e2ef "
            // iconStyle={{
            //   color: "#c4d4e4",
            //   background: "var(--fifth)",
            //   borderRadius: "50%",
            //   border: "3px solid ",
            // }}
            {...themeService(commonSummaryStyle.addButtonStyle(this.props))}
            buttonTitleText={languageService("Add Task")}
          />
          <Tooltip isOpen={this.state.tooltipOpen} target="toolTipAddTask" toggle={this.toggleTooltip}>
            {languageService("Add Special Task")}
          </Tooltip>
        </div>
      );
    }
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <div id="mainContent">
        <CommonModal
          headerText={languageService("Briefings")}
          setModalOpener={(method) => {
            this.openModelMethod = method;
          }}
          footerCancelText={languageService("Close")}
        >
          <Briefing journeyPlan={this.state.journeyPlan} />
        </CommonModal>

        <ConfirmationDialog
          modal={this.state.confirmationDialog}
          toggle={this.handleConfirmationToggle}
          handleResponse={this.handleConfirmation}
          confirmationMessage={languageService("Are you sure you want to delete ?")}
          headerText={languageService("Confirm Deletion")}
        />
        <TasksAddEdit
          modal={this.state.addModal}
          modalState={this.state.modalState}
          toggle={this.handleAddEditNewClick}
          handleAddSubmit={this.handleAddJourneyPlanTask}
          handleEditSubmit={this.hanldleEditJourneyPlanTasks}
          selectedTask={this.state.selectedTask}
          journeyPlan={this.state.journeyPlan}
          tracks={this.props.tracks}
          uploadImg={this.uploadImgs}
          asset={this.props.assets}
        />
        {modelRendered}
        <Row
          style={{
            borderBottom: "2px solid #d1d1d1",
            margin: "0px 30px",
            padding: "10px 0px",
          }}
        >
          <Col md="6" style={{ paddingLeft: "0px" }}>
            <div style={themeService(journeyPlanMainStyles.pageTitleDetail)}>
              <Link to="/inspection" className="linkStyleTable">
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
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Inspection Detail")}</h4>
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
                      {this.state.journeyPlan && this.state.journeyPlan.lineName && (
                        <React.Fragment>
                          <div style={themeService(this.styles.fieldHeading)}>{languageService("Location")}</div>
                          <div>
                            <div style={themeService(this.styles.fieldText)}> {this.state.journeyPlan.lineName} </div>
                          </div>
                        </React.Fragment>
                      )}
                    </Col>
                    <Col md={3}>
                      {this.state.showSelectedDate && (
                        <React.Fragment>
                          <div style={themeService(this.styles.fieldHeading)}>{languageService("Date")}</div>
                          <div>
                            <div style={themeService(this.styles.fieldText)}> {journeyDate} </div>
                          </div>
                        </React.Fragment>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col md="1">{showAddButton}</Col>
              </Row>

              <Row>
                <Col md={"11"}>
                  <div style={{ marginTop: "15px" }}>
                    {this.state.journeyPlan.safetyBriefing && (
                      <MyButton onClick={this.handleBriefingModal}>{languageService("Safety Briefing")}</MyButton>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md="12">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Tasks List")}</h4>
            </div>
          </Col>
          <Col md="12">
            <TasksTableInspection
              journeyPlan={this.state.journeyPlan}
              handleEditClick={this.handleAddEditNewClick}
              handleDeleteClick={this.handleDeleteClick}
              tasksActionType={this.props.actionType}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const getJourneyPlan = curdActions.getJourneyPlan;
const getWorkPlanTemplate = curdActions.getWorkPlanTemplate;
const updateJourneyPlan = curdActions.updateJourneyPlan;
const getAssets = curdActions.getAssets;
const getTrack = curdActions.getTrack;
let actionOptions = {
  create: true,
  update: true,
  read: false,
  delete: true,
  others: {
    getJourneyPlan,
    updateJourneyPlan,
    getTrack,
    uploadImgs,
    getAppMockupsTypes,
    updateWorkPlanFutureInspection,
    getWorkPlanTemplate,
    getAssets,
  },
};

let variableList = {
  journeyPlanReducer: { journeyPlan: "" },
  trackReducer: { tracks: "" },
  assetReducer: { assets: null },
  diagnosticsReducer: { assetTypes: "" },
  lineSelectionReducer: {
    selectedLine: {},
  },
  inspectionHelperReducer: {
    futureInspection: null,
  },
  templateHelperReducer: { updatedPlan: null },
  workPlanTemplateReducer: { workPlanTemplate: "" },
};

const JourneyPlanDetailContainer = CRUDFunction(JourneyPlanComponent, "journeyPlanTask", actionOptions, variableList, [
  "journeyPlanReducer",
  "trackReducer",
  "diagnosticsReducer",
  "lineSelectionReducer",
  "inspectionHelperReducer",
  "workPlanTemplateReducer",
  "templateHelperReducer",
  "assetReducer",
]);

export default JourneyPlanDetailContainer;

let planStyle = {
  JourneyPlanInfoContainer: {
    default: {
      background: "var(--fifth)",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "0px 30px  0px 30px",
      padding: "15px",
      textAlign: "left",
      color: basicColors.first,
      fontSize: "12px",
    },
    retro: {
      background: "var(--fifth)",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "0px 30px  0px 30px",
      padding: "15px",
      textAlign: "left",
      color: retroColors.second,
      fontSize: "12px",
    },
    electric: {
      background: "var(--fifth)",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "0px 30px  0px 30px",
      padding: "15px",
      textAlign: "left",
      color: electricColors.second,
      fontSize: "12px",
    },
  },
  fieldHeading: {
    default: {
      color: "rgb(94, 141, 143)",
      fontWeight: "600",
      fontSize: "14px",
      paddingBottom: "1em",
    },
    retro: { color: retroColors.second, fontWeight: "600", fontSize: "14px", paddingBottom: "1em" },
    electric: { color: electricColors.second, fontWeight: "600", fontSize: "14px", paddingBottom: "1em" },
  },
  fieldText: {
    default: {
      width: "fit-content",
      minWidth: "100px",
      border: "1px solid #f1f1f1",
      boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
      padding: "10px",
      borderRadius: "5px",
    },
    retro: {
      width: "fit-content",
      minWidth: "100px",
      border: "1px solid #f1f1f1",
      boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
      padding: "10px",
      borderRadius: "5px",
    },
    electric: {
      width: "fit-content",
      minWidth: "100px",
      border: "1px solid #f1f1f1",
      boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
      padding: "10px",
      borderRadius: "5px",
    },
  },
};
