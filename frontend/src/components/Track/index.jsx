import React, { Component } from "react";
import { Row, Col, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { trackStyles } from "./styles/TrackPageStyle";
import TrackList from "./TrackList/index";
import TrackSummary from "./TrackSummary/TrackSummary";
import TrackAdd from "./TrackAddEdit/TrackAdd";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import permissionCheck from "utils/permissionCheck.js";
import { savePageNum, clearPageNum } from "reduxRelated/actions/utilActions";
import { createAssetGroupWorkPlan } from "reduxRelated/actions/assetGroupHelperActions";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { languageService } from "Language/language.service";

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackData: [],
      addModal: false,
      selectedTrack: null,
      trackToDelete: null,
      confirmationDialog: false,
      modalState: "",
      actionType: "",
      diagnosticsActionType: "",
      assetGroupHelperActionType: "",
      summaryDesc: { first: "Total Asset Groups", second: "Asset Groups Length", third: "", fourth: "", fifth: "", sixth: "" },
      summaryValue: { first: 0, second: 0, third: 0, fourth: 0, fifth: 0, sixth: 0 },
      listPage: 0,
      trackPageSize: this.props.trackPageSize,
      spinnerLoading: false,
    };

    this.handleAddEditModalClick = this.handleAddEditModalClick.bind(this);
    this.handleAddTrack = this.handleAddTrack.bind(this);
    this.hanldleEditTrack = this.hanldleEditTrack.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleConfirmationToggle = this.handleConfirmationToggle.bind(this);
    this.handlePageStateSave = this.handlePageStateSave.bind(this);
    this.handleCreateWorkPlan = this.handleCreateWorkPlan.bind(this);
    this.handleGetTemplatePlan = this.handleGetTemplatePlan.bind(this);
  }

  componentDidMount() {
    // if (this.props.tracks.length > 0) {
    //   let trackData = this.props.tracks
    //   if (this.props.trafficTypes.length > 0) {
    //     this.calculateTrackSummary(this.props.tracks)
    //   } else {
    //     this.props.getAppMockupsTypes('TrafficType')
    //   }

    //   if (this.props.trackTypes.length < 1) {
    //     this.props.getAppMockupsTypes('TrackType')
    //   }
    //   if (this.props.subdivisions.length < 1) {
    //     this.props.getAppMockupsTypes('Subdivision')
    //   }
    //   if (this.props.classLevels.length < 1) {
    //     this.props.getAppMockupsTypes('Class')
    //   }
    //   this.setTrackCreatePlanStatesForUI(trackData)
    //   this.setState({
    //     trackData: trackData,
    //     listPage: this.props.trackPageNum,
    //     trackPageSize: this.props.trackPageSize
    //   })
    //   this.props.clearPageNum('track')
    // } else {
    //   this.props.getTrack()
    //   this.props.getAppMockupsTypes('TrafficType')
    //   this.props.getAppMockupsTypes('TrackType')
    //   this.props.getAppMockupsTypes('Subdivision')
    //   this.props.getAppMockupsTypes('Class')
    // }

    if (this.props.trafficTypes.length < 1) {
      this.props.getAppMockupsTypes("TrafficType");
    }
    if (this.props.trackTypes.length < 1) {
      this.props.getAppMockupsTypes("TrackType");
    }
    if (this.props.subdivisions.length < 1) {
      this.props.getAppMockupsTypes("Subdivision");
    }
    if (this.props.classLevels.length < 1) {
      this.props.getAppMockupsTypes("Class");
    }
    this.props.getTrack();
    //  this.props.getTrack('5be984d9f5e21448040d7e23')
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.tracks !== prevState.trackData &&
      nextProps.actionType !== prevState.actionType &&
      nextProps.actionType == "TRACKS_READ_SUCCESS"
    ) {
      return {
        spinnerLoading: false,
        trackData: nextProps.tracks,
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType == "TRACKS_READ_REQUEST" && prevState.actionType !== nextProps.actionType) {
      return {
        spinnerLoading: true,
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType == "TRACKS_READ_FAILURE" && prevState.actionType !== nextProps.actionType) {
      return {
        spinnerLoading: false,
        actionType: nextProps.actionType,
      };
    } else if (
      nextProps.actionType !== prevState.actionType &&
      (nextProps.actionType == "TRACK_CREATE_SUCCESS" ||
        nextProps.actionType == "TRACK_CREATE_FAILURE" ||
        nextProps.actionType == "TRACK_UPDATE_SUCCESS" ||
        nextProps.actionType == "TRACK_UPDATE_FAILURE" ||
        nextProps.actionType == "TRACK_DELETE_SUCCESS" ||
        nextProps.actionType == "TRACK_DELETE_FAILURE")
    ) {
      return {
        actionType: nextProps.actionType,
      };
    } else if (
      nextProps.trafficTypes &&
      nextProps.diagnosticsActionType == "TRAFFICTYPE_LIST_GET_SUCCESS" &&
      prevState.diagnosticsActionType !== nextProps.diagnosticsActionType
    ) {
      return {
        diagnosticsActionType: nextProps.diagnosticsActionType,
      };
    } else if (
      nextProps.trackTypes &&
      nextProps.diagnosticsActionType == "TRACKTYPE_LIST_GET_SUCCESS" &&
      prevState.diagnosticsActionType !== nextProps.diagnosticsActionType
    ) {
      return {
        diagnosticsActionType: nextProps.diagnosticsActionType,
      };
    } else if (
      nextProps.subdivisions &&
      nextProps.diagnosticsActionType == "SUBDIVISION_LIST_GET_SUCCESS" &&
      prevState.diagnosticsActionType !== nextProps.diagnosticsActionType
    ) {
      return {
        diagnosticsActionType: nextProps.diagnosticsActionType,
      };
    } else if (
      nextProps.classLevels &&
      nextProps.diagnosticsActionType == "CLASS_LIST_GET_SUCCESS" &&
      prevState.diagnosticsActionType !== nextProps.diagnosticsActionType
    ) {
      return {
        diagnosticsActionType: nextProps.diagnosticsActionType,
      };
    } else if (
      nextProps.assetGroupHelperActionType == "WORKPLAN_FROM_ASSETGROUP_REQUEST" &&
      nextProps.assetGroupHelperActionType !== prevState.assetGroupHelperActionType
    ) {
      return {
        assetGroupHelperActionType: nextProps.assetGroupHelperActionType,
      };
    } else if (
      nextProps.assetGroupHelperActionType == "WORKPLAN_FROM_ASSETGROUP_SUCCESS" &&
      nextProps.assetGroupHelperActionType !== prevState.assetGroupHelperActionType
    ) {
      return {
        assetGroupHelperActionType: nextProps.assetGroupHelperActionType,
      };
    } else if (
      nextProps.assetGroupHelperActionType == "WORKPLAN_FROM_ASSETGROUP_FAILURE" &&
      nextProps.assetGroupHelperActionType !== prevState.assetGroupHelperActionType
    ) {
      return {
        assetGroupHelperActionType: nextProps.assetGroupHelperActionType,
      };
    } else {
      return null;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "TRACKS_READ_SUCCESS") {
      this.calculateTrackSummary(this.state.trackData);
      this.setTrackCreatePlanStatesForUI(this.state.trackData);
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "TRACKS_READ_FAILURE") {
      if (this.props.errorMessage !== prevProps.errorMessage && this.props.errorMessage.status == 401) {
        this.props.history.push("/login");
      }
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "TRACK_CREATE_SUCCESS") {
      this.showToastInfo(languageService("Track Added Successfully !"));
      this.props.getTrack();
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "TRACK_DELETE_SUCCESS") {
      this.showToastInfo(languageService("Track Deleted Successfully !"));
      this.props.getTrack();
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "TRACK_UPDATE_SUCCESS") {
      this.showToastInfo(languageService("Track Updated Successfully !"));
      this.props.getTrack();
    }
    if (
      prevState.actionType !== this.state.actionType &&
      (this.state.actionType == "TRACK_UPDATE_FAILURE" ||
        this.state.actionType == "TRACK_CREATE_FAILURE" ||
        this.state.actionType == "TRACK_DELETE_FAILURE")
    ) {
      if (this.props.errorMessage.status) {
        this.showToastError(languageService(this.props.errorMessage.status), languageService(this.props.errorMessage.statusText));
      } else {
        this.showToastError(languageService(this.props.errorMessage) + languageService("Track"));
      }
    }

    if (
      prevState.assetGroupHelperActionType !== this.state.assetGroupHelperActionType &&
      this.state.assetGroupHelperActionType == "WORKPLAN_FROM_ASSETGROUP_SUCCESS"
    ) {
      this.props.getTrack();
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

  calculateTrackSummary(track) {
    let existingTracks = [];
    if (track) {
      existingTracks = track;
    } else {
      existingTracks = this.state.trackData;
    }
    let sumVal = {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      fifth: 0,
      sixth: 0,
    };
    let copySumDesc = this.state.summaryDesc;
    let sumDesc = { ...copySumDesc };

    sumVal.first = existingTracks.length;
    let sorted = _.orderBy(this.props.trafficTypes, ["code"], ["asc"]);
    let sortedLength = sorted.length;
    let sumDescKeys = Object.keys(sumDesc);
    if (sortedLength > 0) {
      for (let i = 0; i < sortedLength && i < 4; i++) {
        sumDesc[sumDescKeys[i + 2]] = sorted[i].description;
      }
    }
    existingTracks.forEach((track) => {
      let unitLength = Number.isInteger(track.length) ? track.length : parseFloat(track.length);
      if (!isNaN(unitLength)) {
        sumVal.second = sumVal.second + unitLength;
      }
      if (sortedLength > 0) {
        for (let i = 0; i < sortedLength && i < 4; i++) {
          sumVal[sumDescKeys[i + 2]] =
            track.trafficType == sorted[i].description ? sumVal[sumDescKeys[i + 2]] + 1 : sumVal[sumDescKeys[i + 2]];
        }
      }
    });

    this.setState({
      summaryValue: sumVal,
      summaryDesc: sumDesc,
    });
  }

  handleAddEditModalClick(modalState, track) {
    //console.log(modalState)
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedTrack: track,
    });
  }

  handleViewClick(track, pageSize) {
    this.props.savePageNum({ name: "track", number: this.state.listPage, pageSize: pageSize });
    this.props.getTrack(track._id);
  }

  handleAddTrack(track) {
    this.props.createTrack(track);
  }

  hanldleEditTrack(track) {
    let copyTrack = { ...track };
    copyTrack._id = this.state.selectedTrack._id;
    this.props.updateTrack(copyTrack);
  }

  handleDeleteClick(track) {
    this.setState({
      confirmationDialog: true,
      trackToDelete: track,
    });
  }

  handleConfirmationToggle() {
    this.setState({
      confirmationDialog: !this.state.confirmationDialog,
    });
  }
  handleConfirmation(response) {
    if (response) {
      this.props.deleteTrack(this.state.trackToDelete);
    }
    this.setState({
      trackToDelete: null,
      confirmationDialog: false,
    });
  }

  handlePageStateSave(page, pageSize) {
    this.setState({
      listPage: page,
      trackPageSize: pageSize,
    });
  }
  handleCreateWorkPlan(assetGroup) {
    this.props.createAssetGroupWorkPlan(assetGroup);
    let assetGroupId = assetGroup._id;
    let trackCopy = _.cloneDeep(this.state.trackData);
    let findResult = _.find(trackCopy, { _id: assetGroupId });
    if (findResult) {
      findResult.showSpinner = true;
    }
    this.setState({
      trackData: trackCopy,
    });
  }

  handleGetTemplatePlan(tempId) {
    this.props.getWorkPlanTemplate(tempId);
  }

  setTrackCreatePlanStatesForUI(tracksReceived) {
    let tracks = this.state.trackData;
    if (tracksReceived) {
      tracks = tracksReceived;
    }
    let tracksCopy = _.cloneDeep(tracks);
    tracksCopy.forEach((track) => {
      track.showSpinner = false;
    });
    this.setState({
      trackData: tracksCopy,
    });
  }

  render() {
    const { path } = this.props.match;
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <Col md="12">
        {modelRendered}
        <ConfirmationDialog
          modal={this.state.confirmationDialog}
          toggle={this.handleConfirmationToggle}
          handleResponse={this.handleConfirmation}
          confirmationMessage={languageService("Are you sure you want to delete ?")}
          headerText={"Confirm Deletion"}
        />
        <TrackAdd
          modal={this.state.addModal}
          modalState={this.state.modalState}
          toggle={this.handleAddEditModalClick}
          handleAddSubmit={this.handleAddTrack}
          handleEditSubmit={this.hanldleEditTrack}
          trafficTypes={this.props.trafficTypes}
          subdivisions={this.props.subdivisions}
          selectedTrack={this.state.selectedTrack}
          classLevels={this.props.classLevels}
          trackTypes={this.props.trackTypes}
        />
        <Row style={{ borderBottom: "2px solid #d1d1d1", margin: "0px 15px", padding: "10px 0px" }}>
          <Col md="6" style={{ paddingLeft: "0px" }}>
            <div
              style={{
                float: "left",
                fontFamily: "Myriad Pro",
                fontSize: "24px",
                letterSpacing: "0.5px",
                color: "var(--first)",
              }}
            >
              Asset Groups
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div style={trackStyles.trackSummaryHeadingContainer}>
              <h4 style={trackStyles.trackSummaryHeadingStyle}>Asset Groups Summary</h4>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <TrackSummary
              handleAddNewClick={this.handleAddEditModalClick}
              descriptions={this.state.summaryDesc}
              values={this.state.summaryValue}
              addTootTipText={"Asset Group"}
              addButtonText={"Asset Group"}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div style={trackStyles.trackSummaryHeadingContainer}>
              <h4 style={trackStyles.trackSummaryHeadingStyle}>Asset Groups</h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <TrackList
              path={path}
              planningTableData={this.state.trackData}
              handleEditClick={this.handleAddEditModalClick}
              handleDeleteClick={this.handleDeleteClick}
              handleViewClick={this.handleViewClick}
              handlePageSave={this.handlePageStateSave}
              page={this.state.listPage}
              pageSize={this.state.trackPageSize}
              handleCreateWorkPlan={this.handleCreateWorkPlan}
              handleGetTemplatePlan={this.handleGetTemplatePlan}
            />
          </Col>
        </Row>
      </Col>
    );
  }
}

let variables = {
  diagnosticsReducer: {
    trafficTypes: [],
    subdivisions: [],
    classLevels: [],
    trackTypes: [],
  },
  utilReducer: {
    trackPageNum: 0,
    trackPageSize: 10,
  },
  assetGroupHelperReducer: {
    noVar: "",
  },
};

const getWorkPlanTemplate = curdActions.getWorkPlanTemplate;
let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getAppMockupsTypes, savePageNum, clearPageNum, createAssetGroupWorkPlan, getWorkPlanTemplate },
};
let TrackContainer = CRUDFunction(Track, "track", actionOptions, variables, [
  "diagnosticsReducer",
  "utilReducer",
  "assetGroupHelperReducer",
]);

export default TrackContainer;
