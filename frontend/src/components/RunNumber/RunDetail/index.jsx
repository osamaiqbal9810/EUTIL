import React, { Component } from "react";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { Row, Col } from "reactstrap";
import SubTopBarHeading from "components/Common/SubTopBar/commonSubTopBar";
import ViewFieldSimple from "components/Common/ViewFields/ViewField";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "components/Common/Buttons";

import { Tooltip } from "reactstrap";
import RunRangeList from "./RunRangeList/RunRangeList";
import AddRunRange from "./AddRunRange/AddRunRange";
import { getAssetTypesAsset } from "reduxRelated/actions/assetHelperAction";
import { guid } from "utils/UUID";
import _ from "lodash";
import { languageService } from "../../../Language/language.service";
import { themeService } from "../../../theme/service/activeTheme.service";
import { commonPageStyle } from "../../Common/Summary/styles/CommonPageStyle";
import { retroColors, basicColors } from "../../../style/basic/basicColors";
import { commonSummaryStyle } from "../../Common/Summary/styles/CommonSummaryStyle";
import permissionCheck from "../../../utils/permissionCheck";

class RunDetail extends Component {
  constructor(props) {
    super(props);
    this.styles = runDetailStyle;
    // this.initialState = {
    //     assetStartId: "",
    //     assetEndId: "",
    //     lineId: "",
    //     lineName: "",
    //     runId: "",
    //     mpStart: "", // THIS PROPERTIES TO BE ADDED DYNAMICALLY
    //     mpEnd: "", // THIS PROPERTIES TO BE ADDED DYNAMICALLY
    //     assetStartName: "", // THIS PROPERTIES TO BE ADDED DYNAMICALLY
    //     assetEndName: "", // THIS PROPERTIES TO BE ADDED DYNAMICALLY
    //     runDescription: "", // THIS PROPERTIES TO BE ADDED DYNAMICALLY,
    //     selectedRunRange: null
    // };

    this.state = {
      tooltipOpen: false,
      addRangeModal: false,
      // rangeLine: { mpStart: '', mpEnd: '', lineId: '', lineName: '', runDescription: '', runCommonName: '', runName: '' }
      rangeLine: null,
      assetTypeAssets: [],
      tracks: [],
      selectedTracks: [],
      parentAsset: null,
      runRanges: [],
    };

    this.addEditRunRange = this.addEditRunRange.bind(this);
    this.handleAddEditNewClick = this.handleAddEditNewClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeMultiSelect = this.handleChangeMultiSelect.bind(this);
  }
  componentDidMount() {
    // this.props.getRunNumber(this.props.match.params.id);
    // if (this.props.selectedLine._id) {
    this.props.getRunNumber(this.props.match.params.id);
    this.props.getAssets();
    // } else {
    //     this.props.history.push("/line/runs/" + this.props.match.params.id);
    // }
  }

  handleAddEditNewClick(modalState, rangeLine = this.initialState) {
    this.setState({
      addRangeModal: !this.state.addRangeModal,
      modalState: modalState,
      rangeLine,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.runNumberActionType === "RUNNUMBER_READ_SUCCESS" && this.props.runNumberActionType !== prevProps.runNumberActionType) {
      // this.props.getAssetTypesAsset({
      //   assetType: "Station",
      //   lineId: this.props.runNumber ? this.props.runNumber.runLineID : null,
      // });
      this.props.getAssetTypesAsset({
        assetType: "track",
        lineId: this.props.runNumber ? this.props.runNumber.runLineID : null,
      });
      this.setState({ runRanges: this.props.runNumber.runRange });
    }
    if (
      this.props.assetHelperActionType === "GET_ASSETTYPES_ASSETS_SUCCESS" &&
      this.props.assetHelperActionType !== prevProps.assetHelperActionType
    ) {
      // const { assetTypeAssets } = this.props;
      /*     if (assetTypeAssets.length > 0 && assetTypeAssets[0].assetType == "track") {
        this.setState({
          tracks: assetTypeAssets,
        });
      }*/
      // else {
      //   this.props.getAssetTypesAsset({
      //     assetType: "track",
      //     lineId: this.props.runNumber ? this.props.runNumber.runLineID : null,
      //   });
      // }
      // let newRangeLine = { ...this.state.rangeLine };
      // if (assetTypeAssets.length > 0) {
      //     if (assetTypeAssets[0].assetType == "track") {
      //         this.setState({
      //             tracks: assetTypeAssets,
      //         });
      //     } else {
      //         newRangeLine.mpStart = assetTypeAssets[0].start;
      //         newRangeLine.assetStartName = assetTypeAssets[0].unitId;
      //         newRangeLine.mpEnd = assetTypeAssets[0].start;
      //         newRangeLine.assetEndName = assetTypeAssets[0].unitId;
      //         this.setState({
      //             rangeLine: newRangeLine,
      //             assetTypeAssets: assetTypeAssets,
      //         });
      //         this.props.getAssetTypesAsset({
      //             assetType: "track",
      //             lineId: this.props.runNumber ? this.props.runNumber.runLineID : null,
      //         });
      //     }
      // }
    }

    if (
      this.props.runNumber &&
      this.props.assetActionType === "ASSETS_READ_SUCCESS" &&
      this.props.assetActionType !== prevProps.assetActionType
    ) {
      let parentAsset = _.find(this.props.assets.assetsList, { _id: this.props.runNumber.runLineID });
      let runRanges = this.state.runRanges;
      if (runRanges.length > 0) runRanges = runRanges.map(rr => ({ ...rr, lineName: parentAsset.unitId }));
      this.setState({ parentAsset, runRanges });
    }

    if (this.props.actionType === "RUNDETAIL_UPDATE_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      this.props.getRunNumber(this.props.match.params.id);
    }

    if (this.props.actionType === "RUNDETAIL_CREATE_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      this.props.getRunNumber(this.props.match.params.id);
    }
  }

  addEditRunRange(rangeLine, AddEdit) {
    let newRangeLine = { ...rangeLine };
    // let startAsset = _.find(this.state.assetTypeAssets, {
    //   _id: rangeLine.assetStartId,
    // });
    // if (startAsset) {
    //     newRangeLine.mpStart = startAsset.start;
    //     newRangeLine.assetStartName = startAsset.unitId;
    // } else {
    //     this.setFirstStartEnd(newRangeLine, "start");
    // }
    // let endAsset = _.find(this.state.assetTypeAssets, {
    //     _id: rangeLine.assetEndId,
    // });
    // if (endAsset) {
    //     newRangeLine.mpEnd = endAsset.start;
    //     newRangeLine.assetEndName = endAsset.unitId;
    // } else {
    //     this.setFirstStartEnd(newRangeLine, "end");
    // }
    // newRangeLine.runDescription = newRangeLine.assetStartName + " to " + newRangeLine.assetEndName;
    const { runNumber } = this.props;
    newRangeLine.lineId = runNumber.runLineID;
    newRangeLine.lineName = runNumber.runLineName;

    if (AddEdit === "Add") {
      newRangeLine.id = guid();
      this.props.createRunDetail({
        run_id: this.props.match.params.id,
        range: newRangeLine,
      });
    } else if (AddEdit === "Edit") {
      newRangeLine.id = this.state.rangeLine.id;

      this.props.updateRunDetail({
        _id: newRangeLine.id,

        runDetail: {
          run_id: this.props.match.params.id,
          range: newRangeLine,
        },
      });
    }

    this.handleClose();
  }

  setFirstStartEnd(newRangeLine, startOrEnd) {
    if (this.state.assetTypeAssets.length > 0) {
      if (startOrEnd === "start") {
        newRangeLine.mpStart = this.state.assetTypeAssets[0].start;
        newRangeLine.assetStartName = this.state.assetTypeAssets[0].unitId;
        newRangeLine.assetStartId = this.state.assetTypeAssets[0]._id;
      } else if (startOrEnd === "end") {
        newRangeLine.mpEnd = this.state.assetTypeAssets[0].start;
        newRangeLine.assetEndName = this.state.assetTypeAssets[0].unitId;
        newRangeLine.assetEndId = this.state.assetTypeAssets[0]._id;
      }
    }
  }

  handleClose() {
    this.setState({
      rangeLine: {
        ...this.initialState,
      },
      addRangeModal: !this.state.addRangeModal,
      modalState: "None",
      selectedRange: null,
    });
  }

  handleChangeMultiSelect(selectedTracks) {
    this.setState({
      selectedTracks: selectedTracks,
    });
  }

  render() {
    const headingVal = this.props.runNumber ? this.props.runNumber.runId : languageService("Run Detail");
    return (
      <div>
        <AddRunRange
          runNumber={this.props.runNumber}
          modal={this.state.addRangeModal}
          modalState={this.state.modalState}
          toggle={this.handleAddEditNewClick}
          addRun={this.addEditRunRange}
          editRun={this.addEditRunRange}
          assetTypeAssets={this.state.assetTypeAssets}
          tracks={this.state.tracks}
          parentAsset={this.state.parentAsset}
          handleClose={this.handleClose}
          rangeLine={this.state.rangeLine}
          handleChangeMultiSelect={this.handleChangeMultiSelect}
        />
        <Col md={12}>
          <SubTopBarHeading headingVal={headingVal} backButton backPathName="/setup/Run" detailHeading />
          <Row>
            <Col md={12} style={themeService(this.styles.subDetailHeading)}>
              <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
                <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Run Detail")}</h4>
              </div>
            </Col>
            <Col md="12">
              <div style={themeService(this.styles.runDetailInfo)}>
                <Row>
                  <Col md={"10"}>
                    <Row style={{ margin: "0px" }}>
                      <Col md={"4"}>
                        <ViewFieldSimple label={languageService("Run ID")}>
                          <div> {this.props.runNumber ? this.props.runNumber.runId : ""}</div>
                        </ViewFieldSimple>
                      </Col>
                      <Col md={"4"}>
                        <ViewFieldSimple label={languageService("Run Name")}>
                          <div> {this.props.runNumber ? this.props.runNumber.runName : ""}</div>
                        </ViewFieldSimple>
                      </Col>
                      <Col md={"4"}>
                        <ViewFieldSimple label={languageService("Run Location")}>
                          <div> {this.state.parentAsset ? this.state.parentAsset.unitId : ""}</div>
                        </ViewFieldSimple>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2">
                    {permissionCheck("RUN RANGE", "create") && (
                      <div id="toolTipAddRunDetailRange" style={{ float: "right" }}>
                        <ButtonCirclePlus
                          iconSize={60}
                          icon={withPlus}
                          handleClick={e => {
                            this.handleAddEditNewClick("Add");
                          }}
                          {...themeService(commonSummaryStyle.addButtonStyle(this.props))}
                          buttonTitleText={languageService("Add Range")}
                        />
                        <Tooltip isOpen={this.state.tooltipOpen} target="toolTipAddRunDetailRange" toggle={this.toggleTooltip}>
                          {languageService("Add Range")}
                        </Tooltip>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <RunRangeList handleAddEditNewClick={this.handleAddEditNewClick} runRange={this.state.runRanges} />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}

const getRunNumber = curdActions.getRunNumber;
const getAssets = curdActions.getAssets;

let actionOptions = {
  create: true,
  update: true,
  read: false,
  delete: true,
  others: { getRunNumber, getAssetTypesAsset, getAssets },
};

let variableList = {
  runNumberReducer: {
    runNumber: {},
  },
  assetHelperReducer: {
    lineAssets: [],
    assetTypeAssets: [],
  },
  lineSelectionReducer: {
    selectedLine: {},
  },
  assetReducer: { assets: "" },
};

let otherReducers = ["runNumberReducer", "assetHelperReducer", "lineSelectionReducer", "assetReducer"];

const RunDetailContainer = CRUDFunction(RunDetail, "runDetail", actionOptions, variableList, otherReducers);

export default RunDetailContainer;

let runDetailStyle = {
  runDetailInfo: {
    default: {
      background: "#fff",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "30px 15px  0px 15px",
      padding: "15px",
      minHeight: "150px",
      textAlign: "left",
      color: basicColors.first,
      fontSize: "12px",
    },
    retro: {
      background: "#fff",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "10px 15px  0px 15px",
      padding: "15px",
      minHeight: "150px",
      textAlign: "left",
      color: retroColors.second,
      fontSize: "12px",
    },
  },
  subDetailHeading: {
    default: { display: "none" },
    retro: {},
  },
};
