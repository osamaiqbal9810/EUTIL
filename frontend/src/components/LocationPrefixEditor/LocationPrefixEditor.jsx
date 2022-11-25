import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { LocationPrefixList } from "./LocationPrefixList";
import { CRUDFunction } from "../../reduxCURD/container";
import "./style.css";
import { LocationPrefixHeader, LocationPrefixListHeader } from "./LocationPrefixTopBar";
import { guid } from "../../utils/UUID";
import _ from "lodash";
import { curdActions } from "../../reduxCURD/actions";
import LocationPrefixRanges from "./LocationPrefixRanges";
import { LocPrefixService } from "./LocationPrefixService";
const defaultPrefixList = {
  listName: "LocationPrefix",
  code: "",
  opt1: { locName: "" },
  opt2: [],
};
class LocationPrefixEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedLocation: null, prefixList: null };
    this.handleSelectedLocation = this.handleSelectedLocation.bind(this);
    this.handleSelectpLocation = this.handleSelectpLocation.bind(this);
    this.handleSelectedRange = this.handleSelectedRange.bind(this);
  }

  componentDidMount() {
    this.props.getLocationSetup("railRoad");
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.locationSetupActionType !== prevProps.locationSetupActionType &&
      this.props.locationSetupActionType === "LOCATIONSETUP_READ_SUCCESS"
    ) {
      this.loadLocationList(this.props.locationSetup);
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "LOCATIONPREFIXS_READ_SUCCESS") {
      let prefixList = this.props.locationPrefixs.find((loc) => loc.code === this.state.selectedLocation._id);
      if (!prefixList)
        prefixList = {
          ...defaultPrefixList,
          code: this.state.selectedLocation._id,
          opt1: { locName: this.state.selectedLocation.unitId },
          opt2: [],
        };
      else if (prefixList && prefixList.opt1.locName !== this.state.selectedLocation.unitId)
        prefixList.opt1.locName = this.state.selectedLocation.unitId;
      this.setState({
        prefixList: prefixList,
      });
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "LOCATIONPREFIX_CREATE_SUCCESS") {
      this.props.getLocationPrefixs("LocationPrefix/" + this.state.selectedLocation._id);
      LocPrefixService.getPrefixList();
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "LOCATIONPREFIX_UPDATE_SUCCESS") {
      this.props.getLocationPrefixs("LocationPrefix/" + this.state.selectedLocation._id);
      LocPrefixService.getPrefixList();
    }
  }
  loadLocationList(locations) {
    let inspetableAssetType = locations.assetTypes.find((aType) => aType.plannable == true);
    let inspectableLocations = locations.assets.filter((at) => at.assetType === inspetableAssetType.assetType);
    let parentInspectableAType = locations.assetTypes.find((aType) => aType._id === inspetableAssetType.parentAssetType);
    let pLocations = locations.assets.filter((at) => at.assetType === parentInspectableAType.assetType);
    let groupedLocs = _.groupBy(inspectableLocations, "parentAsset");
    this.setState({ locationGroups: groupedLocs, pLocations: pLocations });
  }

  handleSelectedRange(field, newPrefRange, remove) {
    let prefixList = { ...this.state.prefixList };
    if (newPrefRange) {
      prefixList.opt2.push(field);
    } else if (remove) {
      prefixList.opt2 = prefixList.opt2.filter((r) => r.id !== field.id);
    } else {
      let rIndex = prefixList.opt2.findIndex((r) => r.id === field.id);
      if (rIndex > -1) {
        prefixList.opt2[rIndex] = field;
      }
    }
    if (prefixList._id) {
      this.props.updateLocationPrefix(prefixList);
    } else {
      this.props.createLocationPrefix(prefixList, "applicationlookups");
    }
  }

  handleSelectedLocation(location) {
    this.props.getLocationPrefixs("LocationPrefix/" + location._id);
    this.setState({
      selectedLocation: location,
    });
  }
  handleSelectpLocation(pLocation) {
    let pLocations = [...this.state.pLocations], expandedState;
    let pLocIndex = pLocations.findIndex((pLoc) => pLoc._id === pLocation._id);
    if (pLocIndex > -1) expandedState = !pLocations[pLocIndex].expanded;

    // Initialize all to false
    pLocations.forEach(pL=>pL.expanded=false);

    if (pLocIndex > -1) pLocations[pLocIndex].expanded = expandedState;
    this.setState({ pLocations: pLocations });
  }

  render() {
    return (
      <div className="location-selection-main site" id="mainContent">
        <Row>
          <Col md={2}>
            <LocationPrefixListHeader />
            <LocationPrefixList
              locationGroups={this.state.locationGroups}
              pLocations={this.state.pLocations}
              handleSelectedLocation={this.handleSelectedLocation}
              handleSelectpLocation={this.handleSelectpLocation}
            />
          </Col>
          <Col md={10}>
            <LocationPrefixHeader value={this.state.selectedLocation ? this.state.selectedLocation.unitId : ""} />
            <LocationPrefixRanges
              handleSelectedRange={this.handleSelectedRange}
              list={this.state.prefixList}
              selectedLocation={this.state.selectedLocation}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const getLocationSetup = curdActions.getLocationSetup;
let actionOptions = {
  read: true,
  create: true,
  update: true,
  delete: true,
  others: { getLocationSetup },
};
let variableOptions = {
  locationSetupReducer: {
    locationSetup: null,
  },
};
let cReducers = ["locationSetupReducer"];
const LocationPrefixContainer = CRUDFunction(
  LocationPrefixEditor,
  "locationPrefix",
  actionOptions,
  variableOptions,
  cReducers,
  "applicationlookups",
);
export default LocationPrefixContainer;
