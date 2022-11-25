import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import SubTopBarHeading from "components/Common/SubTopBar/commonSubTopBar";
import SvgIcon from "react-icons-kit";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import AddRunNumber from "./AddRunNumber/AddRunNumber";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { getRuns } from "reduxRelated/actions/runHelperActions";
import RunNumbersList from "./RunNumbersList/RunNumbersList";
import { languageService } from "../../Language/language.service";
import { FORM_SUBMIT_TYPES, MODAL_TYPES } from "../../utils/globals";
import ConfirmationDialog from "../Common/ConfirmationDialog";
import WarningDialog from "../Common/WarningDialog";
import { ButtonCirclePlus } from "../Common/Buttons";
import { Tooltip } from "reactstrap";
import { getAssetLines } from "../../reduxRelated/actions/assetHelperAction";
import { toast } from "react-toastify";
import { commonSummaryStyle } from "../Common/Summary/styles/CommonSummaryStyle";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonPageStyle } from "../Common/Summary/styles/CommonPageStyle";
import permissionCheck from "utils/permissionCheck.js";
class RunNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addEditModal: false,
      modalState: "",
      runNumber: null,
      locations: [],
      modals: {
        type: MODAL_TYPES.NONE,
        data: null,
      },
    };

    this.handleAddRunClick = this.handleAddRunClick.bind(this);
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

  handleAddRunClick(modalState, runNumber = null) {
    this.setState({
      addEditModal: !this.state.addEditModal,
      modalState: modalState,
      runNumber,
    });
  }

  handleRunNumberModals = (modalType, runNumber = null) => {
    let { modals } = this.state;

    modals.type = modalType;
    modals.data = runNumber;

    /*         if (modalType === MODAL_TYPES.DELETE && runNumber.runRange && runNumber.runRange.length > 0) {
            modals.type = MODAL_TYPES.WARNING;
        } else {
            modals.type = modalType;
            modals.data = runNumber;
        }
 */
    this.setState({ modals });
  };

  handleConfirmation = (response) => {
    if (response) {
      console.log(this.state.modals.data._id);
      this.props.deleteRunNumber({ _id: this.state.modals.data._id });
    }

    this.setState(() => ({
      modals: { data: null, type: MODAL_TYPES.NONE },
    }));
  };

  submitRun = (submitType, run) => {
    let runObj = { ...run };
    const { lineAssets } = this.props;

    if (submitType === FORM_SUBMIT_TYPES.ADD) {
      this.props.createRunNumber(runObj);
    } else if (submitType === FORM_SUBMIT_TYPES.EDIT) {
      runObj = { ...this.state.runNumber, ...runObj };
      this.props.updateRunNumber(runObj);
    }

    this.handleAddRunClick("None", null);
  };
  componentDidMount() {
    this.props.getRunNumber();
    this.props.getAssetLines();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType === "RUNNUMBER_CREATE_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      this.showToastSuccess(`${languageService("Run Created Successfully")}`);
      this.props.getRunNumber();
    }

    if (this.props.actionType === "RUNNUMBER_CREATE_FAILURE" && this.props.actionType !== prevProps.actionType) {
      this.showToastError(languageService("Error Occurred"), `${languageService("Unable to Create Run")}`);
      this.props.getRunNumber();
    }

    if (this.props.actionType === "RUNNUMBER_DELETE_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      this.showToastSuccess(`${languageService("Run Deleted Successfully")}`);
      this.props.getRunNumber();
    }

    if (this.props.actionType === "RUNNUMBER_DELETE_FAILURE" && this.props.actionType !== prevProps.actionType) {
      this.showToastError(languageService("Error Occurred"), `${languageService("Unable to Delete Run")}`);
      this.props.getRunNumber();
    }

    if (
      this.props.assetHelperActionType === "GET_LINE_ASSETS_SUCCESS" &&
      prevProps.assetHelperActionType != this.props.assetHelperActionType
    ) {
      this.setState({
        locations: this.props.lineAssets,
      });
    }
  }

  render() {
    return (
      <div>
        <AddRunNumber {...this.state} toggle={this.handleAddRunClick} locations={this.state.locations} submitRun={this.submitRun} />

        <ConfirmationDialog
          modal={this.state.modals.type === MODAL_TYPES.DELETE}
          toggle={() => this.handleLineModals(MODAL_TYPES.NONE)}
          handleResponse={this.handleConfirmation}
          confirmationMessage={`${languageService("Are you sure you want to delete")}, ${languageService(
            "All ranges in this run will also be deleted",
          )} ?`}
          headerText={languageService("Confirm Deletion")}
        />

        <WarningDialog
          modal={this.state.modals.type === MODAL_TYPES.WARNING}
          toggle={() => this.handleRunNumberModals(MODAL_TYPES.NONE)}
          handleResponse={this.handleConfirmation}
          warningMessage={"You cannot delete this Run"}
          headerText={languageService("Warning")}
        />

        <Col md={12}>
          <SubTopBarHeading headingVal={languageService("Run")} />

          <Row>
            <Col md={11}></Col>
            <Col md={1}>
              {permissionCheck("RUN", "create") && (
                <React.Fragment>
                  <div id={"toolTipAddRun"}>
                    <ButtonCirclePlus
                      iconSize={50}
                      icon={withPlus}
                      handleClick={(e) => {
                        this.handleAddRunClick("Add");
                      }}
                      {...themeService(commonSummaryStyle.addButtonStyle(this.props))}
                      buttonTitleText={languageService("Add Run")}
                    />
                  </div>
                  <Tooltip isOpen={this.state.tooltipOpen} target={"toolTipAddRun"} toggle={this.toggleTooltip}>
                    {languageService("Add Run")}
                  </Tooltip>
                </React.Fragment>
              )}

              {/*<div style={{ float: "right", padding: "15px 0px" }}>*/}
              {/*<div style={{ color: "var(--first)" }}>{languageService("Add Run")}</div>*/}
              {/*<div*/}
              {/*style={{*/}
              {/*cursor: "pointer",*/}
              {/*padding: "5px 0px",*/}
              {/*margin: "auto",*/}
              {/*width: "50%",*/}
              {/*color: "var(--first)",*/}
              {/*}}*/}
              {/*>*/}
              {/*<SvgIcon*/}
              {/*icon={plus}*/}
              {/*size={20}*/}
              {/*onClick={e => {*/}
              {/*this.handleAddRunClick("Add");*/}
              {/*}}*/}
              {/*/>*/}
              {/*</div>*/}
              {/*</div>*/}
            </Col>
          </Row>
          <Row>
            <Col md={11}>
              <div style={themeService(commonPageStyle.commonSummarySetupHeadingContainer)}>
                <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Run List")}</h4>
              </div>
            </Col>
          </Row>
          <Col md={12}>
            <RunNumbersList
              handleRunNumberModals={this.handleRunNumberModals}
              runs={this.props.runNumbers}
              path={this.props.location.pathname}
              handleAddRunClick={this.handleAddRunClick}
            />
          </Col>
        </Col>
      </div>
    );
  }
}

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getRuns, getAssetLines },
};

let variables = {
  assetHelperReducer: {
    lineAssets: [],
  },
  runHelperReducer: {
    lineRunNumbers: [],
  },
  lineSelectionReducer: {
    selectedLine: {},
  },
};

let reducers = ["assetHelperReducer", "runHelperReducer", "lineSelectionReducer"];
let RunNumberConstructor = CRUDFunction(RunNumber, "runNumber", actionOptions, variables, reducers);
export default RunNumberConstructor;
