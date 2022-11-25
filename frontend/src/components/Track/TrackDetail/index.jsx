import React, { Component } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import Gravatar from "react-gravatar";
import DayPicker, { DateUtils } from "react-day-picker";
import moment from "moment";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "components/Common/Buttons";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import { guid } from "utils/UUID";
import { trackStyles } from "../styles/TrackPageStyle";
import { circle } from "react-icons-kit/fa/circle";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import { Link, Route } from "react-router-dom";
import TrackUnitsTable from "./UnitsList/UnitsList";
import UnitsAddEdit from "./UnitsAddEdit/UnitsAddEdit";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import TrackSummary from "components/Track/TrackSummary/TrackSummary";

import { CRUDFunction } from "reduxCURD/container";
import { commonReducers } from "reduxCURD/reducer";
import { curdActions } from "reduxCURD/actions";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { languageService } from "../../../Language/language.service";
class TrackComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUnit: null,
      modalState: "",
      addModal: false,
      assetToDelete: null,
      confirmationDialog: false,
      track: {},
      summaryDesc: { first: "Total Assets", second: "Assets Length", third: "", fourth: "", fifth: "", sixth: "" },
      summaryValue: { first: 0, second: 0, third: 0, fourth: 0, fifth: 0, sixth: 0 },
      spinnerLoading: false,
    };
    this.styles = {
      TrackInfoContainer: {
        background: "var(--fifth)",
        //     boxShadow: '3px 3px 5px #cfcfcf',
        margin: "0px 30px  0px 30px",
        padding: "15px",
        textAlign: "left",
        color: "var(--first)",
        fontSize: "12px",
      },
      fieldHeading: {
        color: "rgb(94, 141, 143)",
        fontWeight: "600",
        fontSize: "14px",
        paddingBottom: "0.5em",
      },
      fieldText: {
        color: "var(--first)",
        fontSize: "14px",
        paddingBottom: "1em",
      },
    };
    this.handleAddEditNewClick = this.handleAddEditNewClick.bind(this);
    this.hanldleEditTrackUnits = this.hanldleEditTrackUnits.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleAddTrackUnit = this.handleAddTrackUnit.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleConfirmationToggle = this.handleConfirmationToggle.bind(this);
  }

  handleAddEditNewClick(modalState, unit) {
    //console.log(modalState)
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedUnit: unit,
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.track !== prevState.track && nextProps.track && nextProps.trackActionType == "TRACK_READ_SUCCESS") {
      return {
        track: nextProps.track,
        spinnerLoading: false,
        actionType: nextProps.trackActionType,
      };
    } else if (nextProps.trackActionType == "TRACK_READ_REQUEST" && prevState.actionType !== nextProps.trackActionType) {
      return {
        spinnerLoading: true,
        actionType: nextProps.trackActionType,
      };
    } else if (nextProps.trackActionType == "TRACK_READ_FAILURE" && prevState.actionType !== nextProps.trackActionType) {
      return {
        spinnerLoading: false,
        actionType: nextProps.trackActionType,
      };
    } else if (
      nextProps.assetTypes &&
      nextProps.diagnosticsActionType == "ASSETTYPE_LIST_GET_SUCCESS" &&
      prevState.actionType !== nextProps.diagnosticsActionType
    ) {
      return {
        actionType: nextProps.diagnosticsActionType,
      };
    } else if (
      nextProps.trackActionType !== prevState.actionType &&
      (nextProps.trackActionType == "TRACK_UPDATE_REQUEST" ||
        nextProps.trackActionType == "TRACK_UPDATE_SUCCESS" ||
        nextProps.trackActionType == "TRACK_UPDATE_FAILURE")
    ) {
      return {
        actionType: nextProps.trackActionType,
      };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.trackActionType == "TRACK_READ_SUCCESS" && this.state.track !== prevState.track) {
      this.calculateSummary(this.state.track);
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "ASSETTYPE_LIST_GET_SUCCESS") {
      this.calculateSummary(this.state.track);
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "TRACK_UPDATE_SUCCESS") {
      this.showToastInfo(languageService("Track Assets Updated Successfully!"));
      this.props.getTrack(this.props.match.params.id);
      this.props.getTrack();
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "TRACK_UPDATE_FAILURE") {
      if (this.props.trackErrorMessage.status) {
        this.showToastError(languageService(this.props.trackErrorMessage.status), languageService(this.props.trackErrorMessage.statusText));
      } else {
        this.showToastError(languageService(this.props.trackErrorMessage) + languageService("Track Assets"));
      }
    }
  }

  componentDidMount() {
    this.props.getTrack(this.props.match.params.id);
    this.props.getAppMockupsTypes("assetType");
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

  handleAddTrackUnit(unit) {
    //console.log(unit)
    let newUnit = { ...unit };
    const { track } = this.state;
    newUnit.id = guid();
    newUnit.createdAt = new Date();
    newUnit.updatedAt = new Date();
    let copyTrack = { ...track };
    copyTrack.units = [...track.units];
    copyTrack.units.push(newUnit);
    // this.setState({
    //   track: copyTrack
    // })
    // this.calculateSummary(copyTrack)
    this.props.updateTrack(copyTrack);
  }

  hanldleEditTrackUnits(unit) {
    let newUnit = { ...unit };
    const { track } = this.state;

    newUnit.updatedAt = new Date();
    let copyTrack = { ...track };
    copyTrack.units = [...track.units];
    let resultIndex = _.findIndex(copyTrack.units, { id: newUnit.id });

    if (resultIndex || resultIndex == 0) {
      copyTrack.units[resultIndex] = unit;
    }
    // this.setState({
    //   track: copyTrack
    // })
    // this.calculateSummary(copyTrack)
    this.props.updateTrack(copyTrack);
  }

  handleDeleteClick(unit) {
    let newUnit = { ...unit };
    const { track } = this.state;
    let copyTrack = { ...track };
    copyTrack.units = [...track.units];
    _.remove(copyTrack.units, { id: newUnit.id });
    // this.setState({
    //   track: copyTrack
    // })
    // this.calculateSummary(copyTrack)
    this.setState({
      confirmationDialog: true,
      assetToDelete: copyTrack,
    });
  }

  calculateSummary(track) {
    let trackToUpdate = { units: [] };
    if (track) {
      trackToUpdate = track;
    } else {
      trackToUpdate = this.state.track;
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
    if (trackToUpdate.units) {
      sumVal.first = trackToUpdate.units.length;
      let sorted = _.orderBy(this.props.assetTypes, ["code"], ["asc"]);
      let sortedLength = sorted.length;
      let sumDescKeys = Object.keys(sumDesc);
      if (sortedLength > 0) {
        for (let i = 0; i < sortedLength && i < 4; i++) {
          sumDesc[sumDescKeys[i + 2]] = sorted[i].description;
        }
      }
      trackToUpdate.units.forEach((unit) => {
        let unitLength = Number.isInteger(unit.length) ? unit.length : parseFloat(unit.length);
        if (!isNaN(unitLength)) {
          sumVal.second = sumVal.second + unitLength;
        }
        if (sortedLength > 0) {
          for (let i = 0; i < sortedLength && i < 4; i++) {
            sumVal[sumDescKeys[i + 2]] =
              unit.assetType == sorted[i].description ? sumVal[sumDescKeys[i + 2]] + 1 : sumVal[sumDescKeys[i + 2]];
          }
        }
      });
    }

    this.setState({
      summaryValue: sumVal,
      summaryDesc: sumDesc,
    });
  }

  handleConfirmationToggle() {
    this.setState({
      confirmationDialog: !this.state.confirmationDialog,
    });
  }
  handleConfirmation(response) {
    if (response) {
      this.props.updateTrack(this.state.assetToDelete);
    }
    this.setState({
      assetToDelete: null,
      confirmationDialog: false,
    });
  }

  render() {
    let mainTitle = this.state.track ? this.state.track.trackId : "N/A";
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <div>
        <ConfirmationDialog
          modal={this.state.confirmationDialog}
          toggle={this.handleConfirmationToggle}
          handleResponse={this.handleConfirmation}
          confirmationMessage={languageService("Are you sure you want to delete ?")}
          headerText={languageService("Confirm Deletion")}
        />
        <UnitsAddEdit
          modal={this.state.addModal}
          modalState={this.state.modalState}
          toggle={this.handleAddEditNewClick}
          handleAddSubmit={this.handleAddTrackUnit}
          handleEditSubmit={this.hanldleEditTrackUnits}
          selectedUnit={this.state.selectedUnit}
          assetTypes={this.props.assetTypes}
          track={this.state.track}
        />
        {modelRendered}
        <Row style={{ borderBottom: "2px solid #d1d1d1", margin: "0px 30px", padding: "10px 0px" }}>
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
              <Link to="/track" className="linkStyleTable">
                <SvgIcon
                  size={25}
                  icon={ic_arrow_back}
                  style={{ marginRight: "5px", marginLeft: "5px", verticalAlign: "middle", cursor: "pointer" }}
                />
              </Link>
              <SvgIcon size={12} icon={circle} style={{ marginRight: "10px", marginLeft: "5px" }} />
              {mainTitle}
            </div>
          </Col>
        </Row>
        <Row style={{ margin: "0px" }}>
          <Col md="12">
            <div style={trackStyles.trackSummaryHeadingContainer}>
              <h4 style={trackStyles.trackSummaryHeadingStyle}>Assets Summary</h4>
            </div>
          </Col>
          <Col md="12">
            <TrackSummary
              handleAddNewClick={this.handleAddEditNewClick}
              descriptions={this.state.summaryDesc}
              values={this.state.summaryValue}
              addTootTipText={"Asset"}
              addButtonText={"Add Asset"}
            />
          </Col>
          <Col md="12">
            <div style={trackStyles.trackSummaryHeadingContainer}>
              <h4 style={trackStyles.trackSummaryHeadingStyle}>Asset Group Detail</h4>
            </div>
          </Col>
          <Col md="12" style={{ padding: "0px" }}>
            <div style={this.styles.TrackInfoContainer}>
              <Row>
                <Col md={"2"}>
                  <div style={this.styles.fieldHeading}>Subivision </div>
                  <div style={this.styles.fieldText}>{this.state.track.subdivision}</div>
                </Col>
                <Col md={"2"}>
                  <div style={this.styles.fieldHeading}>Segment ID</div>
                  <div style={this.styles.fieldText}>{this.state.track.trackId}</div>
                </Col>
                <Col md={"2"}>
                  <div style={this.styles.fieldHeading}>Track Type</div>
                  <div style={this.styles.fieldText}>{this.state.track.trackType}</div>
                </Col>
                <Col md={"2"}>
                  <div style={this.styles.fieldHeading}>Traffic Type</div>
                  <div style={this.styles.fieldText}>{this.state.track.trafficType}</div>
                </Col>
                <Col md={"2"}>
                  <div style={this.styles.fieldHeading}>Allowed Weight</div>
                  <div style={this.styles.fieldText}>{this.state.track.weight}</div>
                </Col>
                <Col md={"2"}>
                  <div style={this.styles.fieldHeading}>Class</div>
                  <div style={this.styles.fieldText}>{this.state.track.class}</div>
                </Col>
              </Row>
            </div>
            <Col md="12">
              <TrackUnitsTable
                track={this.state.track}
                handleEditClick={this.handleAddEditNewClick}
                handleDeleteClick={this.handleDeleteClick}
              />
            </Col>
          </Col>
        </Row>
      </div>
    );
  }
}

const getTrack = curdActions.getTrack;
const updateTrack = curdActions.updateTrack;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getTrack, updateTrack, getAppMockupsTypes },
};

let variableList = { trackReducer: { track: "" }, diagnosticsReducer: { assetTypes: [] } };

const TrackDetailContainer = CRUDFunction(TrackComponent, "trackdetail", actionOptions, variableList, [
  "trackReducer",
  "diagnosticsReducer",
]);

export default TrackDetailContainer;
