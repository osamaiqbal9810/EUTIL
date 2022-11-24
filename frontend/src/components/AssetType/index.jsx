import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { CRUDFunction } from "./../../reduxCURD/container";
import SpinnerLoader from "./../../components/Common/SpinnerLoader";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "./../../components/Common/Buttons";
import { Tooltip } from "reactstrap";
import { languageService } from "../../Language/language.service";
import { FORM_SUBMIT_TYPES, MODAL_TYPES } from "../../utils/globals";

import AssetTypeList from "./List";
import AddAssetType from "./Add";

class AssetType extends Component {
  state = {
    assetTypes: [],
    spinnerLoading: false,
    modals: {
      type: MODAL_TYPES.NONE,
      data: null,
    },
    tooltipOpen: false,
  };

  componentDidMount() {
    this.props.getAssetType();
  }

  componentDidUpdate(prevProps, prevState) {
    let assetTypes = [];
    let spinnerLoading = false;
    let updateState = false;

    if (this.props.actionType === "ASSETTYPES_READ_REQUEST" && this.props.actionType !== prevProps.actionType) {
      spinnerLoading = true;
      updateState = true;
    }

    if (this.props.actionType === "ASSETTYPES_READ_FAILURE" && this.props.actionType !== prevProps.actionType) {
      updateState = true;
    }

    if (this.props.actionType === "ASSETTYPES_READ_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      assetTypes = this.props.assetTypes;
      updateState = true;
    }

    if (this.props.actionType === "ASSETTYPE_CREATE_REQUEST" && this.props.actionType !== prevProps.actionType) {
      spinnerLoading = true;
      updateState = true;
    }

    if (this.props.actionType === "ASSETTYPE_CREATE_FAILURE" && this.props.actionType !== prevProps.actionType) {
      updateState = true;
    }

    if (prevProps.actionType !== this.props.actionType && this.props.actionType === "ASSETTYPE_CREATE_SUCCESS") {
      this.props.getAssetType();
    }

    if (this.props.actionType === "ASSETTYPE_UPDATE_REQUEST" && this.props.actionType !== prevProps.actionType) {
      spinnerLoading = true;
      updateState = true;
    }

    if (this.props.actionType === "ASSETTYPE_UPDATE_FAILURE" && this.props.actionType !== prevProps.actionType) {
      updateState = true;
    }

    if (prevProps.actionType !== this.props.actionType && this.props.actionType === "ASSETTYPE_UPDATE_SUCCESS") {
      this.props.getAssetType();
    }

    if (updateState) {
      this.setState({
        spinnerLoading,
        assetTypes,
      });
    }
  }

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  };

  handleAssetTypeModals = (modalType, assetType = null) => {
    let { modals } = this.state;
    modals.type = modalType;

    if (modals.type === MODAL_TYPES.VIEW) {
      this.props.history.push({
        pathname: `/setup/assetType/${assetType.assetType.replace(/\s+/g, "-").toLowerCase()}`,
        state: { assetType },
      });

      return true;
    }

    modals.data = assetType;
    this.setState({ modals });
  };

  handleSubmitForm = (asset, formType) => {
    let { modals } = this.state;

    this.setState({ modals });

    if (formType === FORM_SUBMIT_TYPES.ADD) {
      this.props.createAssetType(asset);
    }

    if (formType === FORM_SUBMIT_TYPES.EDIT) {
      asset = { ...modals.data, ...asset };
      this.props.updateAssetType(asset);
    }

    modals = {
      type: MODAL_TYPES.NONE,
      data: null,
    };

    this.setState({ modals });
  };

  handleSelectedClick = () => {};

  render() {
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <Col md="12">
        {modelRendered}
        <AddAssetType
          assetTypes={this.props.assetTypes}
          modal={this.state.modals.type === MODAL_TYPES.ADD || this.state.modals.type === MODAL_TYPES.EDIT}
          modals={this.state.modals}
          toggle={() => this.handleAssetTypeModals(MODAL_TYPES.NONE)}
          handleSubmitForm={this.handleSubmitForm}
        />
        {/*<ViewLine*/}
        {/*modal={this.state.modals.type === MODAL_TYPES.VIEW}*/}
        {/*toggle={() => this.handleAssetTypeModals(MODAL_TYPES.NONE)}*/}
        {/*selectedAsset={this.state.modals.data}*/}
        {/*/>*/}
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
                color: " rgba(64, 118, 179)",
              }}
            >
              Asset Types
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={10} />

          <Col md="2">
            <div>
              <div id={"toolTipAddAssetType"} style={{ minHeight: "200px" }}>
                <ButtonCirclePlus
                  iconSize={50}
                  icon={withPlus}
                  handleClick={() => {
                    this.handleAssetTypeModals(MODAL_TYPES.ADD);
                  }}
                  backgroundColor="#e3e9ef"
                  margin="5px 0px 0px 0px"
                  borderRadius="50%"
                  hoverBackgroundColor="#e3e2ef"
                  hoverBorder="0px"
                  activeBorder="3px solid #e3e2ef "
                  iconStyle={{
                    color: "#c4d4e4",
                    background: "#fff",
                    borderRadius: "50%",
                    border: "3px solid ",
                  }}
                  buttonTitleText={languageService("Add AssetType")}
                />
              </div>

              <Tooltip isOpen={this.state.tooltipOpen} target={"toolTipAddAssetType"} toggle={this.toggleTooltip}>
                {languageService("Add Asset Type")}
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <AssetTypeList
              assetsData={this.state.assetTypes}
              handleSelectedClick={this.handleSelectedClick}
              handleAssetTypeModals={this.handleAssetTypeModals}
              viewAssetDetail={this.viewAssetDetail}
            />
          </Col>
        </Row>
      </Col>
    );
  }
}

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: false,
  others: {},
};

let AddAssetsContainer = CRUDFunction(AssetType, "assetType", actionOptions);

export default AddAssetsContainer;
