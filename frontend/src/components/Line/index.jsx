import React, { Component } from "react";
import * as types from "./../../reduxRelated/ActionTypes/actionTypes.js";
import { Row, Col } from "reactstrap";
import { CRUDFunction } from "./../../reduxCURD/container";
import { getAppMockupsTypes } from "./../../reduxRelated/actions/diagnosticsActions";
import { savePageNum, clearPageNum } from "./../../reduxRelated/actions/utilActions";
import SpinnerLoader from "./../../components/Common/SpinnerLoader";

import LineList from "./List";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "./../../components/Common/Buttons";
import { Tooltip } from "reactstrap";
import ViewLine from "./Detail";
import { languageService } from "../../Language/language.service";
import { getAssetLines } from "../../reduxRelated/actions/assetHelperAction";
import { FORM_SUBMIT_TYPES, MODAL_TYPES } from "../../utils/globals";
import AddLine from "./Add/AddLine";
import { curdActions } from "reduxCURD/actions";
import ConfirmationDialog from "../Common/ConfirmationDialog";

class LineIndex extends Component {
  state = {
    spinnerLoading: false,
    modals: {
      type: MODAL_TYPES.NONE,
      data: null,
    },
    lines: [],
    lineAsset: null,
    lineDeletionMessage: "",
    tooltipOpen: false,
  };

  componentDidMount() {
    this.props.getAssetLines();
  }

  componentDidUpdate(prevProps, prevState) {
    let lines = [];
    let spinnerLoading = false;
    let updateState = false;

    if (
      this.props.assetHelperActionType === types.GET_LINE_ASSETS_REQUEST &&
      this.props.assetHelperActionType !== prevProps.assetHelperActionType
    ) {
      spinnerLoading = true;
      updateState = true;
    }

    if (
      this.props.assetHelperActionType === types.GET_LINE_ASSETS_FAILURE &&
      this.props.assetHelperActionType !== prevProps.assetHelperActionType
    ) {
      updateState = true;
    }

    if (
      this.props.assetHelperActionType === types.GET_LINE_ASSETS_SUCCESS &&
      this.props.assetHelperActionType !== prevProps.assetHelperActionType
    ) {
      lines = this.props.lineAssets;
      updateState = true;
    }

    if (this.props.assetActionType === "ASSET_CREATE_SUCCESS" && this.props.assetActionType !== prevProps.assetActionType) {
      this.props.getAssetLines();
    }

    if (this.props.assetActionType === "ASSET_UPDATE_SUCCESS" && this.props.assetActionType !== prevProps.assetActionType) {
      this.props.getAssetLines();
    }

    if (this.props.assetActionType === "ASSET_DELETE_SUCCESS" && this.props.assetActionType !== prevProps.assetActionType) {
      this.props.getAssetLines();
    }

    if (updateState) {
      this.setState({
        spinnerLoading,
        lines,
      });
    }
  }

  handleLineModals = (modalType, line = null) => {
    let { modals } = this.state;

    modals.type = modalType;
    modals.data = line;

    this.setState({ modals });
  };

  handleSubmitForm = (asset, formType) => {
    let { modals } = this.state;

    asset = { ...modals.data, ...asset };

    this.setState({ modals: { type: MODAL_TYPES.NONE, data: null } });

    if (formType === FORM_SUBMIT_TYPES.ADD) {
      this.props.createAsset(asset);
    }

    if (formType === FORM_SUBMIT_TYPES.EDIT) {
      this.props.updateAsset(asset);
    }
  };

  handleSelectedClick = (event, rowInfo) => {
    this.setState({
      selectedAsset: rowInfo.original,
    });
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  };

  handleConfirmation = (response) => {
    if (response) {
      this.props.deleteAsset({ _id: this.state.modals.data._id });
    }

    this.setState(() => ({
      modals: { data: null, type: MODAL_TYPES.NONE },
    }));
  };

  render() {
    // const { path } = this.props.match;
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <Col md="12">
        {modelRendered}
        <ConfirmationDialog
          modal={this.state.modals.type === MODAL_TYPES.DELETE}
          toggle={() => this.handleLineModals(MODAL_TYPES.NONE)}
          handleResponse={this.handleConfirmation}
          confirmationMessage={
            <div>
              <div>{languageService("Are you sure you want to delete ?")}</div>
              <div style={{ color: "red" }}>
                <strong>{languageService("Note:")} </strong>
                {languageService("All the children assets of this line will also be deleted")}
              </div>
            </div>
          }
          headerText={languageService("Confirm Deletion")}
        />

        <AddLine
          modal={this.state.modals.type === MODAL_TYPES.ADD || this.state.modals.type === MODAL_TYPES.EDIT}
          modals={this.state.modals}
          toggle={() => this.handleLineModals(MODAL_TYPES.NONE)}
          handleSubmitForm={this.handleSubmitForm}
          selectedAsset={this.state.modals.data}
        />
        <ViewLine
          modal={this.state.modals.type === MODAL_TYPES.VIEW}
          toggle={() => this.handleLineModals(MODAL_TYPES.NONE)}
          selectedAsset={this.state.modals.data}
        />
        <Row
          style={{
            borderBottom: "2px solid #d1d1d1",
            margin: "0px 15px",
            padding: "10px 0px",
          }}
        >
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
              Lines
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={10} />

          <Col md="2">
            {/* <AssetsSummary
                          descriptions={this.state.summaryDesc}
                          values={this.state.summaryValue}
                          handleAddNewClick={this.handleAddEditModalClick}
                          permissionCheckProps={true}
                          permissionCheck={permissionCheck('TRACK', 'create')}
                          AddButton
                          addTootTipText={'Asset'}
                          addToolTipId="Asset"
                          buttonTitleText="Asset"
                          /> */}
            <div>
              <div id={"toolTipAddAsset"}>
                <ButtonCirclePlus
                  iconSize={50}
                  icon={withPlus}
                  handleClick={() => {
                    this.handleLineModals(MODAL_TYPES.ADD);
                  }}
                  backgroundColor="#e3e9ef"
                  margin="5px 0px 0px 0px"
                  borderRadius="50%"
                  hoverBackgroundColor="#e3e2ef"
                  hoverBorder="0px"
                  activeBorder="3px solid #e3e2ef "
                  iconStyle={{
                    color: "#c4d4e4",
                    background: "var(--fifth)",
                    borderRadius: "50%",
                    border: "3px solid ",
                  }}
                  buttonTitleText={languageService("Add Line")}
                />
              </div>

              <Tooltip isOpen={this.state.tooltipOpen} target={"toolTipAddAsset"} toggle={this.toggleTooltip}>
                {languageService("Add Line")}
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <LineList
              assetsData={this.state.lines}
              addAssetHandler={this.addAssetToParent}
              handleExpandClick={this.handleExpandClick}
              handleContractClick={this.handleContractClick}
              handleSelectedClick={this.handleSelectedClick}
              handleLineModals={this.handleLineModals}
              viewAssetDetail={this.viewAssetDetail}
            />
          </Col>
        </Row>
      </Col>
    );
  }
}

let createAsset = curdActions.createAsset;
let updateAsset = curdActions.updateAsset;
let deleteAsset = curdActions.deleteAsset;

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getAppMockupsTypes, savePageNum, clearPageNum, getAssetLines, createAsset, updateAsset, deleteAsset },
};

let variables = {
  diagnosticsReducer: {
    subdivisions: [],
    classLevels: [],
  },
  utilReducer: {
    // trackPageNum: 0,
    // trackPageSize: 10
  },
  assetGroupHelperReducer: {
    noVar: "",
  },
  lineSelectionReducer: {
    selectedLine: {},
  },
  assetHelperReducer: {
    lineAssets: [],
  },
  assetReducer: {
    assets: [],
  },
};

let LineComponent = CRUDFunction(LineIndex, "LineIndex", actionOptions, variables, [
  "diagnosticsReducer",
  "utilReducer",
  "assetGroupHelperReducer",
  "lineSelectionReducer",
  "assetHelperReducer",
  "assetReducer",
]);
export default LineComponent;
