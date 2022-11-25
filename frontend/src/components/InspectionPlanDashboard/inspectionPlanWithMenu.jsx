import React, { Component } from "react";
import { CRUDFunction } from "../../reduxCURD/container";
import { LocationPrefixList } from "../LocationPrefixEditor/LocationPrefixList";
import { curdActions } from "../../reduxCURD/actions";
import { Row, Col } from "reactstrap";
import _ from "lodash";
import { TestCard } from "./TestCard";
class InspectionPlanMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedLocation: null, pLocations: null, locationGroups: null };

    this.onListClick = this.onListClick.bind(this);
    this.handleSelectpLocation = this.handleSelectpLocation.bind(this);
    this.locationEntity = this.locationEntity.bind(this);
    this.inspectionPlanEntity = this.inspectionPlanEntity.bind(this);
    this.assetEntity = this.assetEntity.bind(this);
    this.assetTestsEntity = this.assetTestsEntity.bind(this);
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
    if (
      this.props.workPlanTemplateActionType !== prevProps.workPlanTemplateActionType &&
      this.props.workPlanTemplateActionType === "WORKPLANTEMPLATESS_READ_SUCCESS"
    ) {
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
  loadInspectionPlans(plans) {
    this.setState({ plans: plans });
  }
  onListClick(item, entity) {
    let entMethod = {
      location: this.locationEntity,
      inspectionPlan: this.inspectionPlanEntity,
      assets: this.assetEntity,
      assetTests: this.assetTestEntity,
    };
    entMethod[entity] && entMethod[entity](item);
  }
  locationEntity(item) {
    this.props.getWorkPlanTemplates("?lineId=" + item._id);
    this.setState({
      selectedLocation: item,
      selectedAsset: null,
      selectedPlan: null,
      assets: null,
      tests: null,
    });
  }
  inspectionPlanEntity(item) {
    let assets = item && item.tasks && item.tasks[0] && item.tasks[0].units;
    this.setState({
      assets: assets ? assets : null,
      selectedPlan: item,
    });
  }
  assetEntity(item) {
    this.setState({
      selectedAsset: item,
      tests: item.testForm,
    });
  }
  assetTestsEntity() {}
  handleSelectpLocation(pLocation) {
    let pLocations = [...this.state.pLocations];
    let pLocIndex = pLocations.findIndex((pLoc) => pLoc._id === pLocation._id);
    if (pLocIndex > -1) pLocations[pLocIndex].expanded = !pLocations[pLocIndex].expanded;
    this.setState({ pLocations: pLocations });
  }

  render() {
    return (
      <div className="location-selection-main location-menu" id="mainContent">
        <Row>
          <Col md={12}>
            <ColumnHeader value={"Locations"} />
            <LocationPrefixList
              locationGroups={this.state.locationGroups}
              pLocations={this.state.pLocations}
              handleSelectedLocation={(location) => {
                this.onListClick(location, "location");
              }}
              handleSelectpLocation={this.handleSelectpLocation}
            />
          </Col>
          <Col md={4}>
            <ColumnHeader value={"Inspection Plans"} />
            <ItemList
              list={this.props.workPlanTemplates}
              valueId="_id"
              valueKey="title"
              handleClick={this.onListClick}
              entity={"inspectionPlan"}
            />
          </Col>
          <Col md={4}>
            <ColumnHeader value={"Assets"} />
            <ItemList list={this.state.assets} valueId="id" valueKey="unitId" handleClick={this.onListClick} entity="assets" />
          </Col>
          <Col md={4}>
            <ColumnHeader value={"Inspection Tests"} />
            <ItemList
              list={this.state.tests}
              valueId="testCode"
              valueKey="title"
              handleClick={this.onListClick}
              entity="assetTests"
              cMethod={"testCard"}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const ItemList = (props) => {
  let list = null;
  if (props.list) {
    list = props.list.map((li) => {
      return (
        <div
          onClick={(e) => {
            props.handleClick && props.handleClick(li, props.entity);
          }}
          key={li[props.valueId]}
          className="option-lists"
        >
          {customListItem(li, props.valueKey, props.cMethod)}
        </div>
      );
    });
  }
  return list;
};
function customListItem(item, keyVal, cMethod) {
  const methods = {
    testCard: <TestCard test={item} />,
  };
  return methods[cMethod] ? methods[cMethod] : item[keyVal];
}
const ColumnHeader = (props) => {
  return (
    <div className="location-prefix-header">
      <h5>{props.value ? props.value : "No Selected Location"}</h5>
    </div>
  );
};
const getLocationSetup = curdActions.getLocationSetup;
const getWorkPlanTemplates = curdActions.getWorkPlanTemplates;
let actionOptions = {
  read: false,
  create: false,
  update: false,
  delete: false,
  others: { getLocationSetup, getWorkPlanTemplates },
};
let variableOptions = {
  locationSetupReducer: {
    locationSetup: null,
  },
  workPlanTemplateReducer: {
    workPlanTemplates: [],
  },
};
let cReducers = ["locationSetupReducer", "workPlanTemplateReducer"];
const InspectionPlanMenuContainer = CRUDFunction(InspectionPlanMenu, "inspectionPlanMenu", actionOptions, variableOptions, cReducers);
export default InspectionPlanMenuContainer;
