import React, { Component } from "react";
import { containerExistCheck } from "../../../reduxCURD/settings";
import DropDownComp from "../../Common/DropDown/dropDown";
import _ from "lodash";
import { Col, Row } from "reactstrap";
import propTypes from "prop-types";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import CommonModal from "../../Common/CommonModal";
import {
  assetTreeObjMethod,
  filterMethodForAssetsAndLocs,
  fillOrRemoveTestExecsList,
  handleSelectTestHelper,
  validateDateRange,
  getFirstChildOfDropDownLocs,
} from "./helperMethods";
import SelectedAssetWithTests from "./SelectedAssetWithTests";
import AssetCalendarWrapper from "./AssetCalendarWrapper";
import { inspectionTemplate } from "../../../templates/InspectionTemplate";
import ColorsLegend from "../ColorsLegend";
import { Icon } from "react-icons-kit";
import { arrowCircleLeft } from "react-icons-kit/fa/arrowCircleLeft";
import { arrowCircleRight } from "react-icons-kit/fa/arrowCircleRight";
import { languageService } from "../../../Language/language.service";
import AssetTestSelector from "./AssetTestSelector/AssetTestSelector";

class AssetInspections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownFilterAssets: [],
      selectedAsset: {},
      assetTests: [],
      testExecs: [],
      allTestExecs: [],
      range: {},
      multiTestSelection: false,
      assetsRight: -55,
    };

    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleSelectTest = this.handleSelectTest.bind(this);
    this.getRangeDataFromServer = this.getRangeDataFromServer.bind(this);
    this.setModalOpener = this.setModalOpener.bind(this);
    this.handleAssetsSideBarExpand = this.handleAssetsSideBarExpand.bind(this);

    this.openModelMethod = null;
  }

  componentDidMount() {
    this.props.getAssetTree && this.props.getAssetTree("/getAssetTree");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "ASSETTREE_READ_SUCCESS") {
      this.loadAssetOptions(assetTreeObjMethod(this.props.assetTree), this.props.locationFilterStates, true);
    }
    if (prevProps.locationFilterStates !== this.props.locationFilterStates && this.props.locationFilterStates) {
      this.loadAssetOptions(assetTreeObjMethod(this.props.assetTree), this.props.locationFilterStates, true);
    }
    if (this.props.assetTestActionType !== prevProps.assetTestActionType && this.props.assetTestActionType == "ASSETTESTS_READ_SUCCESS") {
      this.loadAssetTests(this.props.assetTests, true);
    }
    if (
      this.props.testScheduleActionType !== prevProps.testScheduleActionType &&
      this.props.testScheduleActionType == "TESTSCHEDULES_READ_SUCCESS"
    ) {
      this.testSchedulesReceveid(this.props.testSchedules);
    }
  }
  handleAssetsSideBarExpand() {
    if (this.state.assetsRight == 0) {
      this.setState({ assetsRight: -590 });
      setTimeout(
        function () {
          //Start the timer
          this.setState({ assetsRight: -55 }); //After 1 second, set render to true
        }.bind(this),
        1000,
      );
    } else {
      this.setState({ assetsRight: -590 });
      setTimeout(
        function () {
          //Start the timer
          this.setState({ assetsRight: 0 }); //After 1 second, set render to true
        }.bind(this),
        1000,
      );
    }
  }
  loadAssetOptions(assetTree, locationsToConsider, firstSelect) {
    let dropDownFilterAssets = filterMethodForAssetsAndLocs(assetTree, locationsToConsider);

    let selectedAsset = {};
    if (firstSelect) {
      selectedAsset = getFirstChildOfDropDownLocs(dropDownFilterAssets);
      selectedAsset && selectedAsset.id && this.props.getAssetTests(selectedAsset.id);
    }
    this.setState({
      dropDownFilterAssets: dropDownFilterAssets,
      selectedAsset: selectedAsset,
    });
  }
  loadAssetTests(PropsAssetTests, firstSelect) {
    let assetTests = [...PropsAssetTests];
    if (firstSelect) {
      this.handleSelectTest(assetTests[0], this.state.multiTestSelection, assetTests);
    }

    this.setState({
      assetTests: assetTests,
    });
  }
  handleSelectItem(item) {
    this.openModelMethod(false);
    if (item) {
      this.setState({
        selectedAsset: item,
      });
      this.props.getAssetTests(item.id);
    }
  }
  handleSelectTest(assetTest, multi, assetTestsRec) {
    if (assetTest) {
      let assetTestsToWorkOn = assetTestsRec ? assetTestsRec : this.state.assetTests;
      let aTestShowState = assetTest.showTestExecs;
      let assetTests = handleSelectTestHelper(assetTestsToWorkOn, assetTest, multi);
      let list = [];
      let testExecsUpdate = {};
      if (multi) {
        list = fillOrRemoveTestExecsList(
          assetTest,
          this.state.testExecs,
          this.state.allTestExecs,
          this.state.selectedAsset,
          this.fetchTestExecs,
        );
        testExecsUpdate = { testExecs: list };
      } else {
        !aTestShowState && this.fetchTestExecs(assetTest, this.state.selectedAsset, this.state.range);
      }
      this.setState({
        assetTests: assetTests,
        selectedAssetTest: assetTest,
        ...testExecsUpdate,
      });
    }
  }

  fetchTestExecs(assetTest, selectedAsset, range) {
    let validRange = validateDateRange(range);
    if (validRange) {
      let additionalQuery = "&testCode=" + assetTest.testCode + "&assetId=" + selectedAsset.id;
      this.props.getRangeDataFromServer(range, additionalQuery, true);
    }
  }

  getRangeDataFromServer(range) {
    this.state.selectedAssetTest &&
      this.state.selectedAsset &&
      this.fetchTestExecs(this.state.selectedAssetTest, this.state.selectedAsset, range);
    this.setState({
      range: range,
    });
  }
  testSchedulesReceveid(testSchedules) {
    let testExecs = [];
    if (this.state.multiTestSelection) {
      testExecs = [...this.state.testExecs, ...testSchedules];
    } else {
      testExecs = testSchedules;
    }
    this.setState({
      testExecs: testExecs,
    });
  }
  setModalOpener(method) {
    this.openModelMethod = method;
  }

  render() {
    return (
      <React.Fragment>
        {/* <CommonModal className="assets-selector" setModalOpener={this.setModalOpener} receiveToggleMethod={this.receiveToggleMethod}> */}
        <CommonModal
          className="assets-selection-modal"
          setModalOpener={this.setModalOpener}
          receiveToggleMethod={this.receiveToggleMethod}
          modalStyle={{ maxWidth: "80vw", height: "92vh" }}
        >
          {/* <DropDownComp items={this.state.dropDownFilterAssets} onSelectItem={this.handleSelectItem} /> */}
          <AssetTestSelector listItems={this.state.dropDownFilterAssets} onSelectItem={this.handleSelectItem} />
        </CommonModal>

        <Col>
          <SelectedAssetWithTests
            openModal={(e) => {
              this.openModelMethod && this.openModelMethod();
            }}
            selectedAsset={this.state.selectedAsset}
            assetTests={this.state.assetTests}
            handleSelectTest={this.handleSelectTest}
            multiTestSelection={this.state.multiTestSelection}
          />
        </Col>
        <br />
        <Row style={{ margin: "0px 0px 30px", position: "relative", width: "100%", overflow: "hidden" }}>
          {/* <div className="gis-nav" style={{ right: this.state.assetsRight + "px", minHeight: "400px" }}>
            <div className="button" onClick={this.handleAssetsSideBarExpand} style={{ textTransform: "uppercase" }}>
              <span>
                <Icon
                  icon={this.state.assetsRight == -55 ? arrowCircleLeft : arrowCircleRight}
                  style={{ verticalAlign: "text-bottom" }}
                  size={24}
                />
              </span>
              {languageService("Completion")}
            </div>
          </div> */}
          <AssetCalendarWrapper
            getDateControls={this.props.getDateControls}
            getRangeDataFromServer={this.getRangeDataFromServer}
            actionType={this.props.testScheduleActionType}
            actionReadSuccess={"TESTSCHEDULES_READ_SUCCESS"}
            lineSelectionActionType={this.props.lineSelectionActionType}
            data={this.state.testExecs}
            history={this.props.history}
            inspectionFilter={this.props.inspectionFilter}
            handleUpdateFilterState={this.props.handleUpdateFilterState}
          />
        </Row>
        {/* <ColorsLegend template={inspectionTemplate}></ColorsLegend> */}
      </React.Fragment>
    );
  }
}

export default AssetInspections;

AssetInspections.propTypes = {
  getAssetTree: propTypes.func.isRequired,
};

const SelectAssetOptions = (props) => {
  return (
    <div style={{ color: retroColors.second }} onClick={props.handleSelectAssetClick}>
      Select Asset
    </div>
  );
};
