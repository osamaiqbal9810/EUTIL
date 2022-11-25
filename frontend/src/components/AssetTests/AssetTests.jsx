import React, { Component } from "react";
import { CRUDFunction } from "../../reduxCURD/container";
import SpinnerLoader from "../Common/SpinnerLoader";
import { languageService } from "../../Language/language.service";
import Icon from "react-icons-kit";
import { checkboxUnchecked } from "react-icons-kit/icomoon/checkboxUnchecked";
import { checkboxChecked } from "react-icons-kit/icomoon/checkboxChecked";
import _ from "lodash";
import { MyButton } from "../Common/Forms/formsMiscItems";
import "./style.css";
import moment from "moment";
class AssetTests extends Component {
  constructor(props) {
    super(props);
    this.state = { loader: false, assetTestList: [], updateList: [], testName: "" };
    this.onTestClick = this.onTestClick.bind(this);
    this.handleSaveUpdates = this.handleSaveUpdates.bind(this);
  }

  componentDidMount() {
    // console.log("assetType", this.props.assetType);
    // console.log("testCode", this.props.testCode);

    let aType = this.props.assetType && this.props.assetType.assetType;
    let testCode = this.props.testCode && this.props.testCode.code;
    let arg = `aTypeFreqTests/?aType=${aType}&testCode=${testCode}`;
    let testDetail = this.props.testCode.opt2.config.find((name) => {
      if (name.assetType === aType) return true;
    });
    this.setState({ testName: testDetail.name });
    this.props.getAssetTests(arg);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "ASSETTESTS_READ_REQUEST") {
      this.setState({
        loader: true,
      });
    }

    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "ASSETTESTS_READ_SUCCESS") {
      // console.log(this.props.assetTests);
      this.setState({
        loader: false,
        assetTestList: this.props.assetTests,
      });
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "ASSETTESTS_READ_FAILURE") {
      this.setState({
        loader: false,
      });
    }
  }

  onTestClick(assetTest) {
    let assetTestList = [...this.state.assetTestList];
    let updateList = [...this.state.updateList];
    let testIndex = _.findIndex(assetTestList, { _id: assetTest._id });
    if (testIndex > -1) {
      assetTestList[testIndex] = { ...assetTestList[testIndex], ...{ disabled: !assetTestList[testIndex].disabled } };
      let changedState = {};
      if (this.props.assetTests[testIndex].disabled !== assetTestList[testIndex].disabled) {
        this.state.listChanged !== true && (changedState.listChanged = true);

        updateList.push({
          _id: assetTestList[testIndex]._id,
          disabled: assetTestList[testIndex].disabled,
        });
      } else {
        _.remove(updateList, { _id: assetTest._id });
      }
      this.setState({
        assetTestList: assetTestList,
        updateList: updateList,
        ...changedState,
      });
    }
  }
  handleSaveUpdates() {
    let updateList = [...this.state.updateList];
    this.setState({ updateList: [], listChanged: false });
    this.props.updateAssetTest(updateList, "disableMulti");
  }
  render() {
    return (
      <div>
        <SpinnerLoader loading={this.state.loader} />{" "}
        <ListHeading listChanged={this.state.listChanged} handleSaveUpdates={this.handleSaveUpdates} name={this.state.testName} />
        <InfoArea
          aType={this.props.assetType && this.props.assetType.assetType}
          testDescription={this.props.testCode && this.props.testCode.description}
        />
        <ul className="list-asset-test scrollbar">
          <AssetsList assetTestList={this.state.assetTestList} onTestClick={this.onTestClick} />
        </ul>
      </div>
    );
  }
}
const AssetTestContainer = CRUDFunction(AssetTests, "assetTest");
export default AssetTestContainer;

export const ListHeading = (props) => {
  return (
    <h5 className="area-update-asset">
      <span className="title-update-asset">{languageService(props.name)}</span>
      {props.listChanged && (
        <span className="btn-update-asset">
          <MyButton
            onClick={(e) => {
              props.handleSaveUpdates();
            }}
          >
            {languageService(props.buttonName ? props.buttonName : "Update Assets Config")}
          </MyButton>
        </span>
      )}
    </h5>
  );
};

export const InfoArea = (props) => {
  return (
    <div className="info-area">
      <label className="asset-title"> {languageService("Asset")}</label>
      <label className="start-sate title"> {languageService("Schedule Start Date")}</label>
      <div className="info-labels">
        <label>{languageService("Asset Type")}</label> : <span>{props.aType}</span>
      </div>
      {props.testDescription && (
        <div className="info-labels-full">
          <label> {languageService("Form Name")}</label> :<span> {props.testDescription}</span>
        </div>
      )}
    </div>
  );
};

export const AssetsList = (props) => {
  let mapList = null;
  if (props.assetTestList && props.assetTestList.length > 0) {
    mapList = props.assetTestList.map((assetTest, index) => {
      return <AssetTestItem key={`ati-${index}`} assetTest={assetTest} onTestClick={props.onTestClick} />;
    });
  }
  return mapList;
};
export const AssetTestItem = (props) => {
  let assetTest = props.assetTest;
  let toRet = null;
  if (assetTest) {
    let assetName = assetTest.assets && assetTest.assets[0] ? assetTest.assets[0].unitId : "";

    toRet = (
      <li key={assetName}>
        <span className="asset-check-box" onClick={(e) => props.onTestClick(assetTest)}>
          <Icon icon={assetTest.disabled ? checkboxUnchecked : checkboxChecked} size={20} />
        </span>
        <span className="asset-test-name">{assetName}</span>
        <span className="asset-test-date">{assetTest.startDate ? moment(assetTest.startDate).format("MM-DD-YYYY") : ""}</span>
      </li>
    );
  }
  return toRet;
};
