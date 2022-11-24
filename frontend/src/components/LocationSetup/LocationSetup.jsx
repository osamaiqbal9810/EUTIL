/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { CRUDFunction } from "../../reduxCURD/container";
import CompanyField from "./CompanyField";
import { Col, Row } from "reactstrap";
import _ from "lodash";
import LocationList from "./LocationList";
import { curdActions } from "../../reduxCURD/actions";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { getUnAssignedAsset } from "../../reduxRelated/actions/assetHelperAction";
import UnAssignedAssetsModal from "./UnAssignedAssetsModal";
import ConfirmationDialog from "../Common/ConfirmationDialog";
import { languageService } from "../../Language/language.service";
import { toast } from "react-toastify";
import AddAssets from "components/LampAssets/AddAsset/AddAssets";
class LocationSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyAsset: {},
      majorGeoType: {},
      minorGeoType: {},
      locationIdentifier: {},
      majorLocationAssets: [],
      minorLocationAssets: [],
      locationIdentifierAssets: [],
      showMinorAdd: false,
      showLocIdentifierAdd: false,
      minorGeoAllowed: false,
      locIdentifierAllowed: false,
      disableLocIdentifierAllowed: true,
      spinnerLoading: false,
      showAssignAssetModal: false,
      newlyCreatedAsset: null,
      deleteModal: false,
      locationSettingModal: false,
      modalState: "",
    };
    this.addNewLocation = this.addNewLocation.bind(this);
    this.handleCompanyUpdate = this.handleCompanyUpdate.bind(this);
    this.handleLocationClick = this.handleLocationClick.bind(this);
    this.handleLocationTypeCheckBox = this.handleLocationTypeCheckBox.bind(this);
    this.handleUpdateLocationTypeName = this.handleUpdateLocationTypeName.bind(this);
    this.handleUpdateLocation = this.handleUpdateLocation.bind(this);
    this.handleDeleteLocation = this.handleDeleteLocation.bind(this);
    this.handleToggleModal = this.handleToggleModal.bind(this);
    this.handleConfirmationDelete = this.handleConfirmationDelete.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.handleToggleLocationSettingModal = this.handleToggleLocationSettingModal.bind(this);
    this.handleLocationSettingsSubmitForm = this.handleLocationSettingsSubmitForm.bind(this);
  }
  componentDidMount() {
    this.props.getLocationSetup("railRoad");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "LOCATIONSETUP_READ_REQUEST") {
      this.setState({ spinnerLoading: true });
    }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "LOCATIONSETUP_READ_SUCCESS") {
      this.loadFunction(this.props.locationSetup);
    }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "LOCATIONSETUP_READ_FAILURE") {
      if (this.props.errorMessage.status) {
        this.showToastError(languageService(this.props.errorMessage.status), languageService(this.props.errorMessage.statusText));
      } else {
        this.showToastError(languageService(this.props.errorMessage) + languageService("Location"));
      }
      this.setState({ spinnerLoading: false });
    }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "LOCATIONSETUP_UPDATE_SUCCESS") {
      this.showToastInfo(`${languageService("Location Updated Successfully")}`);
      this.loadFunction(this.props.locationSetup);
    }
    if (
      prevProps.assetActionType !== this.props.assetActionType &&
      (this.props.assetActionType == "ASSET_CREATE_REQUEST" || this.props.assetActionType == "ASSET_UPDATE_REQUEST")
    ) {
      this.setState({ spinnerLoading: true });
    }

    if (prevProps.assetActionType !== this.props.assetActionType && this.props.assetActionType == "ASSET_DELETE_SUCCESS") {
      this.props.getLocationSetup("railRoad");
    }
    if (prevProps.assetActionType !== this.props.assetActionType && this.props.assetActionType == "ASSET_CREATE_SUCCESS") {
      this.showToastInfo(`${languageService("Location Created Successfully")}`);
      let locationSetup = { ...this.state.locationSetupData, assets: [...this.state.locationSetupData.assets, ...[this.props.asset]] };
      this.setState({
        locationSetupData: locationSetup,
        minorLocationAssets: this.state.minorGeoAllowed
          ? _.filter(locationSetup.assets, {
              assetType: this.state.minorGeoType.assetType,
              parentAsset: this.state.selectedMajorGeoAsset && this.state.selectedMajorGeoAsset._id,
            })
          : [],
        majorLocationAssets: _.filter(locationSetup.assets, { assetType: this.state.majorGeoType.assetType }),
        locationIdentifierAssets: this.state.locIdentifierAllowed
          ? _.filter(locationSetup.assets, {
              assetType: this.state.locationIdentifier.assetType,
              parentAsset: this.state.selectedMinorGeoAsset && this.state.selectedMinorGeoAsset._id,
            })
          : [],
        spinnerLoading: false,
        newlyCreatedAsset: this.props.asset,
      });
      let checkForUnAssignedAssets = this.checkForGettingUnAssignedAssets(this.props.asset);

      if (checkForUnAssignedAssets) {
        this.props.getUnAssignedAsset();
      }
    }
    if (
      prevProps.assetActionType !== this.props.assetActionType &&
      (this.props.assetActionType == "ASSET_CREATE_FAILURE" || this.props.assetActionType == "ASSET_UPDATE_FAILIURE")
    ) {
      this.setState({ spinnerLoading: false });
      if (this.props.errorMessage.status) {
        this.showToastError(languageService(this.props.errorMessage.status), languageService(this.props.errorMessage.statusText));
      } else {
        this.showToastError(languageService(this.props.errorMessage) + languageService("Asset"));
      }
    }

    if (prevProps.assetActionType !== this.props.assetActionType && this.props.assetActionType == "ASSET_UPDATE_SUCCESS") {
      this.showToastInfo(`${languageService("Location Updated Successfully")}`);
      if (this.props.asset._id !== this.state.companyAsset._id) {
        let assets = [...this.state.locationSetupData.assets];
        let findIndex = _.findIndex(assets, { _id: this.props.asset._id });
        if (findIndex > -1) {
          assets[findIndex] = { ...this.props.asset };
        }
        let locationSetup = { ...this.state.locationSetupData, assets: assets };
        this.setState({
          locationSetupData: locationSetup,
          minorLocationAssets:
            this.state.minorGeoAllowed && this.state.selectedMajorGeoAsset
              ? _.filter(locationSetup.assets, {
                  assetType: this.state.minorGeoType.assetType,
                  parentAsset: this.state.selectedMajorGeoAsset._id,
                })
              : [],
          majorLocationAssets: _.filter(locationSetup.assets, { assetType: this.state.majorGeoType.assetType }),
          locationIdentifierAssets:
            this.state.locIdentifierAllowed && this.state.selectedMinorGeoAsset
              ? _.filter(locationSetup.assets, {
                  assetType: this.state.locationIdentifier.assetType,
                  parentAsset: this.state.selectedMinorGeoAsset._id,
                })
              : [],
          spinnerLoading: false,
        });
      } else if (this.props.asset._id == this.state.companyAsset._id) {
        this.setState({
          companyAsset: { ...this.props.asset },
          spinnerLoading: false,
        });
      } else {
        this.setState({
          spinnerLoading: false,
        });
      }
    }
    if (
      prevProps.assetHelperActionType !== this.props.assetHelperActionType &&
      this.props.assetHelperActionType == "GET_UNASSIGNED_ASSETS_REQUEST"
    ) {
      this.setState({
        spinnerLoading: true,
      });
    }
    if (
      prevProps.assetHelperActionType !== this.props.assetHelperActionType &&
      this.props.assetHelperActionType == "GET_UNASSIGNED_ASSETS_FAILURE"
    ) {
      if (this.props.errorMessage.status) {
        this.showToastError(languageService(this.props.errorMessage.status), languageService(this.props.errorMessage.statusText));
      } else {
        this.showToastError(languageService(this.props.errorMessage) + languageService("Asset"));
      }
      this.setState({
        spinnerLoading: false,
      });
    }
    if (
      prevProps.assetHelperActionType !== this.props.assetHelperActionType &&
      this.props.assetHelperActionType == "GET_UNASSIGNED_ASSETS_SUCCESS"
    ) {
      console.log("unassignedAssets", this.props.unassignedAssets);

      this.setState({
        showAssignAssetModal: this.props.unassignedAssets && this.props.unassignedAssets.length > 0 ? true : false,
        unassignedAssets: this.props.unassignedAssets,
        spinnerLoading: false,
      });
    }
  }

  checkForGettingUnAssignedAssets(asset) {
    let check = false;
    let notMajorGeo = asset.assetType !== this.state.majorGeoType.assetType;
    let matchPlannable = false;
    if (asset.assetType == this.state.minorGeoType.assetType) {
      this.state.minorGeoType.plannable && (matchPlannable = true);
    }
    if (asset.assetType == this.state.locationIdentifier.assetType) {
      this.state.locationIdentifier.plannable && (matchPlannable = true);
    }
    check = notMajorGeo && matchPlannable;
    return check;
  }

  addNewLocation(assetVal, locationType) {
    let parentAssetId = this.parentAssetIdMethod(locationType);
    let newAsset = {
      unitId: assetVal,
      description: assetVal,
      name: assetVal,
      start: 0,
      end: 0,
      parentAsset: parentAssetId,
      assetType: locationType.assetType,
      attributes: this.addAssetTypeAttributes(locationType.assetType),
    };
    //   console.log(newAsset);
    this.props.createAsset(newAsset);
  }
  addAssetTypeAttributes(aType) {
    let foundAType = _.find(this.state.assetTypes, { assetType: aType });
    let atr = {};
    let iterateOver = ["timpsAttributes", "lampAttributes", "systemAttributes"];
    if (foundAType) {
      iterateOver.forEach(attributeType => {
        if (foundAType[attributeType]) {
          let aTypeItrKeys = Object.keys(foundAType[attributeType]);
          aTypeItrKeys.forEach(key => {
            atr[key] = "";
          });
        }
      });
    }
    return atr;
  }
  parentAssetIdMethod(locationType) {
    let parentAssetId = null;
    if (locationType._id == this.state.majorGeoType._id) parentAssetId = this.state.companyAsset._id;
    if (locationType._id == this.state.minorGeoType._id) parentAssetId = this.state.selectedMajorGeoAsset._id;
    if (locationType._id == this.state.locationIdentifier._id) parentAssetId = this.state.selectedMinorGeoAsset._id;
    return parentAssetId;
  }

  loadFunction(locationSetup) {
    // this function will sort  and save asset type for each level and company asset
    let company = _.find(locationSetup.assetTypes, { parentAssetType: null });
    let companyAsset,
      majorGeoType,
      minorGeoType,
      locationIdentifier = {};
    let majorLocationAssets = [];
    let addAndCheck = {
      showLocIdentifierAdd: false,
      showMinorAdd: false,
      minorGeoAllowed: false,
      locIdentifierAllowed: false,
      disableLocIdentifierAllowed: true,
    };
    if (company) {
      companyAsset = _.find(locationSetup.assets, { assetType: company.assetType });
      majorGeoType = _.find(locationSetup.assetTypes, { parentAssetType: company._id });
      minorGeoType = _.find(locationSetup.assetTypes, { parentAssetType: majorGeoType._id });
      locationIdentifier = _.find(locationSetup.assetTypes, { parentAssetType: minorGeoType._id });
      majorLocationAssets = _.filter(locationSetup.assets, { assetType: majorGeoType.assetType });

      if (locationIdentifier.plannable || minorGeoType.plannable) {
        addAndCheck.disableLocIdentifierAllowed = false;
        addAndCheck.minorGeoAllowed = true;
        locationIdentifier.plannable && (addAndCheck.locIdentifierAllowed = true);
      }
    }
    //  console.log(locationSetup);
    // set Major , minor and location identifier
    this.setState({
      companyAsset: companyAsset,
      majorGeoType: majorGeoType,
      minorGeoType: minorGeoType,
      locationIdentifier: locationIdentifier,
      majorLocationAssets: majorLocationAssets,
      minorLocationAssets: [],
      locationIdentifierAssets: [],
      ...addAndCheck,
      locationSetupData: locationSetup,
      spinnerLoading: false,
      assetTypes: locationSetup.assetTypes,
    });
  }
  handleCompanyUpdate(comVal) {
    let comAsset = { ...this.state.companyAsset };
    comAsset.unitId = comVal;
    this.props.updateAsset(comAsset);
  }
  handleLocationClick(locationAsset, locationType) {
    if (locationType._id == this.state.majorGeoType._id) {
      let majorGeoLocationAssets = checkSelected(this.state.majorLocationAssets, locationAsset);
      this.setState({
        majorGeoLocationAssets: majorGeoLocationAssets,

        selectedMajorGeoAsset: locationAsset,
        selectedMinorGeoAsset: null,
        minorLocationAssets: this.state.minorGeoAllowed
          ? checkSelected(
              _.filter(this.state.locationSetupData.assets, {
                assetType: this.state.minorGeoType.assetType,
                parentAsset: locationAsset._id,
              }),
              locationAsset,
            )
          : [],
        locationIdentifierAssets: [],
        showMinorAdd: this.state.minorGeoAllowed ? true : false,
        showLocIdentifierAdd: false,
      });
    }
    if (locationType._id == this.state.minorGeoType._id) {
      let minorLocationAssets = checkSelected(this.state.minorLocationAssets, locationAsset);
      this.setState({
        minorLocationAssets: minorLocationAssets,
        selectedMinorGeoAsset: locationAsset,
        showLocIdentifierAdd: this.state.locIdentifierAllowed ? true : false,
        locationIdentifierAssets: this.state.locIdentifierAllowed
          ? _.filter(this.state.locationSetupData.assets, {
              assetType: this.state.locationIdentifier.assetType,
              parentAsset: locationAsset._id,
            })
          : [],
      });
    }
  }
  handleLocationTypeCheckBox(checkValue, locationType) {
    let assetTypesToUpdate = {
      _id: this.state.majorGeoType.parentAssetType,
      assetTypes: {
        majorGeoType: { ...this.state.majorGeoType },
        minorGeoType: { ...this.state.minorGeoType },
        locationIdentifier: { ...this.state.locationIdentifier },
      },
      checkBoxChange: true,
    };

    if (locationType._id == this.state.minorGeoType._id) {
      if (checkValue) {
        assetTypesToUpdate.assetTypes.majorGeoType.plannable = false;
        assetTypesToUpdate.assetTypes.minorGeoType.plannable = true;
        assetTypesToUpdate.assetTypes.locationIdentifier.plannable = false;
        assetTypesToUpdate.assetTypes.majorGeoType.menuFilter = true;
        assetTypesToUpdate.assetTypes.minorGeoType.menuFilter = false;
        assetTypesToUpdate.assetTypes.locationIdentifier.menuFilter = false;
        this.setState({
          minorGeoAllowed: true,
          showMinorAdd: this.state.selectedMajorGeoAsset ? true : false,
          minorLocationAssets: this.state.selectedMajorGeoAsset
            ? checkSelected(
                _.filter(this.state.locationSetupData.assets, {
                  assetType: this.state.minorGeoType.assetType,
                  parentAsset: this.state.selectedMajorGeoAsset._id,
                }),
                {},
              )
            : [],
          locationIdentifierAssets: [],
          selectedMinorGeoAsset: null,
          disableLocIdentifierAllowed: false,
          ...assetTypesToUpdate.assetTypes,
        });
      } else {
        assetTypesToUpdate.assetTypes.majorGeoType.plannable = true;
        assetTypesToUpdate.assetTypes.minorGeoType.plannable = false;
        assetTypesToUpdate.assetTypes.locationIdentifier.plannable = false;
        assetTypesToUpdate.assetTypes.majorGeoType.menuFilter = false;
        assetTypesToUpdate.assetTypes.minorGeoType.menuFilter = false;
        assetTypesToUpdate.assetTypes.locationIdentifier.menuFilter = false;
        this.setState({
          minorGeoAllowed: false,
          showMinorAdd: false,
          minorLocationAssets: [],
          selectedMinorGeoAsset: null,
          locIdentifierAllowed: false,
          showLocIdentifierAdd: false,
          locationIdentifierAssets: [],
          disableLocIdentifierAllowed: true,
          ...assetTypesToUpdate.assetTypes,
        });
      }
    }
    if (locationType._id == this.state.locationIdentifier._id) {
      if (checkValue) {
        assetTypesToUpdate.assetTypes.majorGeoType.plannable = false;
        assetTypesToUpdate.assetTypes.minorGeoType.plannable = false;
        assetTypesToUpdate.assetTypes.locationIdentifier.plannable = true;
        assetTypesToUpdate.assetTypes.majorGeoType.menuFilter = false;
        assetTypesToUpdate.assetTypes.minorGeoType.menuFilter = true;
        assetTypesToUpdate.assetTypes.locationIdentifier.menuFilter = false;
        this.setState({
          locIdentifierAllowed: true,
          showLocIdentifierAdd: this.state.selectedMinorGeoAsset ? true : false,
          locationIdentifierAssets: this.state.selectedMinorGeoAsset
            ? _.filter(this.state.locationSetupData.assets, {
                assetType: this.state.locationIdentifier.assetType,
                parentAsset: this.state.selectedMinorGeoAsset._id,
              })
            : [],
          ...assetTypesToUpdate.assetTypes,
        });
      } else {
        assetTypesToUpdate.assetTypes.majorGeoType.plannable = false;
        assetTypesToUpdate.assetTypes.minorGeoType.plannable = true;
        assetTypesToUpdate.assetTypes.locationIdentifier.plannable = false;
        assetTypesToUpdate.assetTypes.majorGeoType.menuFilter = true;
        assetTypesToUpdate.assetTypes.minorGeoType.menuFilter = false;
        assetTypesToUpdate.assetTypes.locationIdentifier.menuFilter = false;
        this.setState({
          locIdentifierAllowed: false,
          showLocIdentifierAdd: false,
          locationIdentifierAssets: [],
          ...assetTypesToUpdate.assetTypes,
        });
      }
    }
    this.props.updateLocationSetup(assetTypesToUpdate);
  }

  handleUpdateLocationTypeName(value, locationType) {
    let assetTypeToUpdate = { _id: locationType._id, assetType: value };
    this.props.updateLocationSetup(assetTypeToUpdate);
    if (locationType._id == this.state.majorGeoType._id) {
      this.setState({
        majorGeoType: { ...this.state.majorGeoType, assetType: value },
      });
    }
    if (locationType._id == this.state.minorGeoType._id) {
      this.setState({
        minorGeoType: { ...this.state.minorGeoType, assetType: value },
      });
    }
    if (locationType._id == this.state.locationIdentifier._id) {
      this.setState({
        locationIdentifier: { ...this.state.locationIdentifier, assetType: value },
      });
    }
  }
  handleUpdateLocation(value, locationAsset) {
    let assetToUpdate = { ...locationAsset };
    assetToUpdate.unitId = value;
    this.props.updateAsset(assetToUpdate);
  }
  handleDeleteLocation(locAsset) {
    this.setState({
      selectedLocationToDeleteConfirmation: locAsset,
      deleteModal: true,
    });
  }
  handleToggleModal(logic, selectedAssetsToAdd) {
    if (logic && selectedAssetsToAdd && selectedAssetsToAdd.length > 0) {
      let propsToUpdate = {
        parentAsset: this.state.newlyCreatedAsset._id,
        levels: {
          1: selectedAssetsToAdd[0].levels["1"],
          2: null,
          3: null,
          currentLevel: 1,
        },
      };
      if (this.state.newlyCreatedAsset.assetType == this.state.minorGeoType.assetType) {
        propsToUpdate.levels["2"] = this.state.newlyCreatedAsset._id;
        propsToUpdate.levels.currentLevel = 2;
      }
      if (this.state.newlyCreatedAsset.assetType == this.state.locationIdentifier.assetType) {
        propsToUpdate.levels["2"] = this.state.newlyCreatedAsset.parentAsset;
        propsToUpdate.levels["3"] = this.state.newlyCreatedAsset._id;
        propsToUpdate.levels.currentLevel = 3;
      }
      let aIds = selectedAssetsToAdd.map(a => {
        return a._id;
      });
      this.props.updateAsset({ _id: "multi", assets: aIds, propsToUpdate: propsToUpdate });
    }

    this.setState({
      showAssignAssetModal: !this.state.showAssignAssetModal,
      newlyCreatedAsset: this.state.showAssignAssetModal ? null : this.state.newlyCreatedAsset,
    });
  }

  handleConfirmationDelete = response => {
    if (response) {
      this.props.deleteAsset({ _id: this.state.selectedLocationToDeleteConfirmation._id });
    }

    this.setState({
      selectedLocationToDeleteConfirmation: null,
      deleteModal: !this.state.deleteModal,
    });
  };

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

  handleToggleLocationSettingModal(modalState, selectedLocation) {
    let selecLocation = selectedLocation ? selectedLocation : this.state.selectedLocation;
    this.setState({
      modalState: modalState,
      locationSettingModal: !this.state.locationSettingModal,
      selectedLocation: selecLocation,
    });
  }
  handleLocationSettingsSubmitForm(location) {
    location = { ...this.state.selectedLocation, ...location };

    this.props.updateAsset(location);
    this.setState({
      locationSettingModal: false,
      modalState: null,
    });
  }

  render() {
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <React.Fragment>
        {modelRendered}
        <AddAssets
          modal={this.state.locationSettingModal}
          modalState={this.state.modalState}
          toggle={this.handleToggleLocationSettingModal}
          handleSubmitForm={this.handleLocationSettingsSubmitForm}
          selectedAsset={this.state.selectedLocation}
          assetTypes={this.state.assetTypes}
          assetsList={this.state.locationSetupData ? this.state.locationSetupData.assets : []}
          parentAsset={this.state.parentAssetSelected}
          plannableLocations={[this.state.selectedLocation]}
          locationForm
        />
        <ConfirmationDialog
          modal={this.state.deleteModal}
          toggle={() => this.setState({ deleteModal: !this.state.deleteModal })}
          handleResponse={this.handleConfirmationDelete}
          confirmationMessage={
            <div>
              <div>{languageService("Are you sure you want to delete")} </div>
              <div style={{ color: "red" }}>
                <strong>{languageService("Note")}: </strong>
                {languageService("All the locations and assets in the selected location will also be deleted")}
              </div>
            </div>
          }
          headerText={languageService("Confirm Deletion")}
        />

        <UnAssignedAssetsModal
          unassignedAssets={this.props.unassignedAssets}
          handleToggleModal={this.handleToggleModal}
          modal={this.state.showAssignAssetModal}
          newlyCreatedAsset={this.state.newlyCreatedAsset}
          locationSetupData={this.state.locationSetupData}
        />
        <Col md={12} style={{ padding: "15px 15px 15px 30px" }}>
          <CompanyField companyAsset={this.state.companyAsset} handleSaveField={this.handleCompanyUpdate} />
        </Col>

        <Row style={{ margin: "0px", padding: "0px 15px" }}>
          <Col md={4}>
            <LocationList
              locationType={this.state.majorGeoType}
              handleSaveField={this.addNewLocation}
              locationAssets={this.state.majorLocationAssets}
              handleLocationClick={this.handleLocationClick}
              addNewFieldAllowed={true}
              handleLocationTypeCheckBox={this.handleLocationTypeCheckBox}
              locationTypeAllowedVal={true}
              disableCheckbox
              handleUpdateLocationTypeName={this.handleUpdateLocationTypeName}
              handleUpdateLocation={this.handleUpdateLocation}
              handleDeleteLocation={this.handleDeleteLocation}
              handleToggleLocationSettingModal={this.handleToggleLocationSettingModal}
            />
          </Col>
          <Col md={4}>
            <LocationList
              locationType={this.state.minorGeoType}
              handleSaveField={this.addNewLocation}
              locationAssets={this.state.minorLocationAssets}
              handleLocationClick={this.handleLocationClick}
              addNewFieldAllowed={this.state.showMinorAdd}
              handleLocationTypeCheckBox={this.handleLocationTypeCheckBox}
              locationTypeAllowedVal={this.state.minorGeoAllowed}
              handleUpdateLocationTypeName={this.handleUpdateLocationTypeName}
              handleUpdateLocation={this.handleUpdateLocation}
              handleDeleteLocation={this.handleDeleteLocation}
              handleToggleLocationSettingModal={this.handleToggleLocationSettingModal}
            />
          </Col>
          <Col md={4}>
            <LocationList
              locationType={this.state.locationIdentifier}
              handleSaveField={this.addNewLocation}
              locationAssets={this.state.locationIdentifierAssets}
              handleLocationClick={this.handleLocationClick}
              addNewFieldAllowed={this.state.showLocIdentifierAdd}
              handleLocationTypeCheckBox={this.handleLocationTypeCheckBox}
              locationTypeAllowedVal={this.state.locIdentifierAllowed}
              disableCheckbox={this.state.disableLocIdentifierAllowed}
              handleUpdateLocationTypeName={this.handleUpdateLocationTypeName}
              handleUpdateLocation={this.handleUpdateLocation}
              handleDeleteLocation={this.handleDeleteLocation}
              handleToggleLocationSettingModal={this.handleToggleLocationSettingModal}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

let variables = { assetReducer: { asset: null }, assetHelperReducer: { unassignedAssets: [] } };
let createAsset = curdActions.createAsset;
let updateAsset = curdActions.updateAsset;
let deleteAsset = curdActions.deleteAsset;
let actionOptions = {
  create: false,
  update: true,
  read: true,
  delete: false,
  others: { createAsset, updateAsset, deleteAsset, getUnAssignedAsset },
};
let reducers = ["assetReducer", "assetHelperReducer"];
let LocationSetupContainer = CRUDFunction(LocationSetup, "locationSetup", actionOptions, variables, reducers, "asset/location");
export default LocationSetupContainer;

function checkSelected(arrayOfAssets, assetToCheck) {
  let updatedArray = [...arrayOfAssets];
  updatedArray.forEach(element => {
    element.selected = element._id == assetToCheck._id ? true : false;
  });
  return updatedArray;
}
