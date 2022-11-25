import React, { Component } from "react";
import { CRUDFunction } from "../../../reduxCURD/container";
import { filterTreeByProperties, findTreeNode } from "../../../utils/treeData";
import SpinnerLoader from "../../Common/SpinnerLoader";
import { ListHeading, InfoArea } from "../../AssetTests/AssetTests";
import Icon from "react-icons-kit";
import { checkboxUnchecked } from "react-icons-kit/icomoon/checkboxUnchecked";
import { checkboxChecked } from "react-icons-kit/icomoon/checkboxChecked";
import { DateField } from "./AddTestsForm";
import { formFeildStyle } from "../../../wigets/forms/style/formFields";
import { themeService } from "../../../theme/service/activeTheme.service";

class AssetTestCreateConfig extends Component {
  constructor(props) {
    super(props);

    this.state = { assetsList: this.props.assetsList, listChanged: false, locations: this.props.locations, assetsListHide: {} };
    this.onTestClick = this.onTestClick.bind(this);
    this.handleSaveUpdates = this.handleSaveUpdates.bind(this);
    this.LocationSelect = this.LocationSelect.bind(this);
  }

  componentDidMount() {
    !this.props.assetsList && this.props.getAssetTestCreateConfig("/getAssetTree");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "ASSETTESTCREATECONFIG_READ_SUCCESS") {
      let assetTree = this.props.assetTestCreateConfig;
      if (assetTree) this.loadAssets(assetTree.assetsTreeObj);
    }
  }
  loadAssets(assetTree) {
    let assetsByProperties = [];
    let assetsList = [];
    let locations = [];
    filterTreeByProperties(assetTree, { assetType: this.props.assetType && this.props.assetType.assetType }, assetsByProperties, true);
    filterTreeByProperties(assetTree, { location: true, plannable: true }, locations, true);

    assetsByProperties.forEach((assetWithId) => {
      let obj = {
        id: assetWithId.id,
        unitId: assetWithId.properties.unitId,
        assetType: assetWithId.properties.assetType,
        disabled: false,
        firstDate: this.props.startDate,
      };
      assetsList.push(obj);
    });
    this.setState({
      assetsList: assetsList,
      locations: locations,
      listChanged: false,
    });
    this.props.setLocationOptions && this.props.setLocationOptions(locations);
  }

  onTestClick(assetTest, field, value) {
    let assetsList = [...this.state.assetsList];
    let aTestIndex = assetsList.findIndex((asset) => asset.id === assetTest.id);
    if (aTestIndex > -1) {
      assetsList[aTestIndex] = { ...assetsList[aTestIndex], [field]: value };
    }
    this.setState({
      assetsList: assetsList,
      listChanged: true,
    });
  }
  handleSaveUpdates() {
    let assetsList = [...this.state.assetsList];
    this.setState({ listChanged: false });
    this.props.setAssetsConfigLIst(assetsList);
  }
  LocationSelect(loc) {
    let assetsListHide = {};
    let assetsList = [...this.state.assetsList];
    let assetsTree = this.props.assetTestCreateConfig;
    if (assetsTree && assetsTree.assetsTreeObj) {
      let locTreeBranch = findTreeNode(assetsTree.assetsTreeObj, loc);
      assetsList.forEach((asset) => {
        let found = findTreeNode(locTreeBranch, asset.id);
        if (found) assetsListHide[asset.id] && delete assetsListHide[asset.id];
        else assetsListHide[asset.id] = true;
      });
      this.setState({
        location: loc,
        assetsList: assetsList,
        assetsListHide: assetsListHide,
      });
    }
  }
  render() {
    return (
      <div>
        <SpinnerLoader loading={this.state.loader} />

        <ListHeading
          listChanged={this.state.listChanged}
          handleSaveUpdates={this.handleSaveUpdates}
          name={this.state.testName}
          buttonName={"Set Assets Config"}
        />
        <div className="dropdown-assets">
          <label className="location-title" style={{ marginRight: "10px" }}>
            {" "}
            Location :{" "}
          </label>
          <LocationFilter locations={this.state.locations} selectedLocation={this.state.location} LocationSelect={this.LocationSelect} />
        </div>

        <InfoArea
          aType={this.props.assetType && this.props.assetType.assetType}
          testDescription={this.props.testCode && this.props.testCode.description}
        />

        <ul className="list-asset-test scrollbar">
          <AssetsListWithDate
            assetTestList={this.state.assetsList}
            onTestClick={this.onTestClick}
            assetsListHide={this.state.assetsListHide}
          />
        </ul>
      </div>
    );
  }
}

const AssetTestCreateConfigContainer = CRUDFunction(AssetTestCreateConfig, "assetTestCreateConfig", null, null, null, "asset");
export default AssetTestCreateConfigContainer;

const AssetsListWithDate = (props) => {
  let mapList = null;
  if (props.assetTestList && props.assetTestList.length > 0) {
    mapList = props.assetTestList.map((assetTest) => {
      return !props.assetsListHide[assetTest.id] ? (
        <AssetTestListItem key={assetTest.id} assetTest={assetTest} onTestClick={props.onTestClick} />
      ) : null;
    });
  }
  return mapList;
};
const AssetTestListItem = (props) => {
  let assetTest = props.assetTest;
  let toRet = null;
  if (assetTest) {
    let assetName = assetTest.unitId;
    toRet = (
      <li>
        <span className="asset-check-box" onClick={(e) => props.onTestClick(assetTest, "disabled", !assetTest.disabled)}>
          <Icon icon={assetTest.disabled ? checkboxUnchecked : checkboxChecked} size={20} />
        </span>
        <label className="asset-test-name">{assetName}</label>
        <DateField
          inputFieldProps={{ name: "firstDate" }}
          changeHandler={(e) => props.onTestClick(assetTest, "firstDate", e.target.value)}
          value={assetTest.firstDate}
        />
      </li>
    );
  }
  return toRet;
};
const LocationFilter = (props) => {
  let locOpts =
    props.locations &&
    props.locations.map((location) => {
      return <option value={location.id}>{location.properties.unitId}</option>;
    });
  return (
    <select
      style={{ ...themeService(formFeildStyle.inputStyle), minWidth: "250px", borderWidth: "2px" }}
      onChange={(e) => props.LocationSelect(e.target.value)}
      value={props.location}
    >
      {locOpts}
    </select>
  );
};
