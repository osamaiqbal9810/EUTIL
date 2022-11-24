import React from "react";
import { languageService } from "../../../Language/language.service";
import { themeService } from "../../../theme/service/activeTheme.service";
import { GITestStyle } from "./style/GITestStyle";
import { Container, Row, Col } from "reactstrap";
import AssetTypes from "./assetsTypes";
import AssetTasks from "./assetTasks";
import { CRUDFunction } from "../../../reduxCURD/container";
import { curdActions } from "../../../reduxCURD/actions";
import _ from "lodash";
import { getTestsAppForm, updateTestsAppForm } from "reduxRelated/actions/diagnosticsActions";
import AssetTypesList from "./assetTypeList";
import AssetTaskList from "./assetTaskList";
import AddTestsForm from "./AddTestsForm";
import ConfirmationDialog from "../../Common/ConfirmationDialog";
import { guid } from "../../../utils/UUID";
import { versionInfo } from "../../MainPage/VersionInfo";
import { func } from "prop-types";
const testTypes = ["GI 303", "GI 305", "GI 307", "GI 309", "GI 311", "GI 314", "GI 316", "GI 319"];

class GITestAssetTypes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetTypes: [],
      selectedAssetType: null,
      selectedTest: null,
      selectedTestToDelete: null,
      confirmationDialog: false,
      appFormsTests: [],
      formMode: null,
      selectedAssetTests: [],
      allAppFormsTests: [],
    };
    this.onAddTestClick = this.onAddTestClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleAddEditTest = this.handleAddEditTest.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleConfirmationToggle = this.handleConfirmationToggle.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleAssetTypeSelected = this.handleAssetTypeSelected.bind(this);
  }

  componentDidMount() {
    this.props.getAssetTypes();
    this.props.getTestsAppForm("assetTypeTests/noForm");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.assetTypeActionType == "ASSETTYPES_READ_SUCCESS" && this.props.assetTypeActionType !== prevProps.assetTypeActionType) {
      let assetTypeCriteria = versionInfo.isSITE() ? { inspectable: true, assetTypeClassify: "point" } : { inspectable: true };

      let aTypes = _.filter(this.props.assetTypes, assetTypeCriteria);
      this.setAssetTypesAndTests(aTypes, aTypes[0], this.props.assetTypeTests);

      // let aType = aTypes && aTypes.length > 0 ? aTypes[0] : null;
      // let selectedAssetTests = this.checkSelectedAssetTypeForms(aType, this.props.assetTypeTests);
      // let allowedAppFormsTests = this.filterAllowedTestsForms(aType, this.props.assetTypeTests);
      // this.setState({
      //   assetTypes: aTypes,
      //   selectedAssetType: this.state.selectedAssetType ? this.state.selectedAssetType : aTypes && aTypes.length > 0 ? aTypes[0] : null,
      //   selectedAssetTests: selectedAssetTests,
      //   allowedAppFormsTests: allowedAppFormsTests,
      // });
    }
    if (
      this.props.diagnosticsActionType == "GET_TESTS_APPFORMS_SUCCESS" &&
      this.props.diagnosticsActionType !== prevProps.diagnosticsActionType
    ) {
      this.setAssetTypesAndTests(null, this.state.selectedAssetType, this.props.assetTypeTests);
      // let selectedAssetTests = this.checkSelectedAssetTypeForms(this.state.selectedAssetType, this.props.assetTypeTests);
      // this.setState({
      //   appFormsTests: this.props.assetTypeTests,
      //   selectedAssetTests: selectedAssetTests,
      //   allAppFormsTests: this.props.assetTypeTests,
      // });
    }
    if (
      this.props.diagnosticsActionType == "UPDATE_TESTS_APPFORM_SUCCESS" &&
      this.props.diagnosticsActionType !== prevProps.diagnosticsActionType
    ) {
      this.updateAppFormsTestState();
      // this.props.getTestsAppForm("assetTypeTests/noForm");
      // TOASTY MSG
    }
    if (
      this.props.diagnosticsActionType == "DELETE_TESTS_APPFORM_SUCCESS" &&
      this.props.diagnosticsActionType !== prevProps.diagnosticsActionType
    ) {
      this.updateAppFormsTestState();
      // this.props.getTestsAppForm("assetTypeTests/noForm");
      // TOASTY MSG
    }
  }
  setAssetTypesAndTests(aTypes, aType, assetTypeTests) {
    let allaTypes = aTypes ? aTypes : [...this.state.assetTypes];
    let allAppFormsTests = assetTypeTests ? assetTypeTests : [...this.state.allAppFormsTests];
    let selectedAssetTests = this.checkSelectedAssetTypeForms(aType, allAppFormsTests);
    let allowedAppFormsTests = this.filterAllowedTestsForms(aType, allAppFormsTests);

    this.setState({
      assetTypes: allaTypes,
      selectedAssetType: aType ? aType : null,
      allowedAppFormsTests: allowedAppFormsTests,
      appFormsTests: allowedAppFormsTests,
      selectedAssetTests: selectedAssetTests,
      allAppFormsTests: allAppFormsTests,
    });
  }
  updateAppFormsTestState() {
    let appFormsTests = [...this.state.appFormsTests];
    let updatedTestIndex = _.findIndex(appFormsTests, { code: this.props.assetTypeTest.code });
    if (updatedTestIndex > -1) {
      appFormsTests[updatedTestIndex] = this.props.assetTypeTest;
    }
    let allAppFormsTests = [...this.state.allAppFormsTests];
    let updatedAllFormTestIndex = _.findIndex(allAppFormsTests, { code: this.props.assetTypeTest.code });
    if (updatedAllFormTestIndex > -1) {
      allAppFormsTests[updatedAllFormTestIndex] = this.props.assetTypeTest;
    }
    let selectedAssetTests = this.checkSelectedAssetTypeForms(this.state.selectedAssetType, appFormsTests);
    this.setState({
      appFormsTests: appFormsTests,
      allAppFormsTests: allAppFormsTests,
      selectedAssetTests: selectedAssetTests,
    });
  }
  checkSelectedAssetTypeForms(assetType, appForms) {
    let selectedAssetTests = [];
    if (assetType && appForms && appForms.length > 0) {
      appForms.forEach((form) => {
        if (form.opt2 && form.opt2.config) {
          let findAssetType = _.find(form.opt2.config, (aTypeConfig) => {
            return aTypeConfig.assetType == assetType.assetType;
          });
          if (findAssetType) selectedAssetTests.push(form);
        }
      });
    }
    return selectedAssetTests;
  }
  onAddTestClick() {
    this.setState({
      formMode: "Add",
      selectedTest: null,
    });
  }
  handleEditClick(item) {
    this.setState({
      selectedTest: item,
      formMode: "Edit",
    });
  }
  handleDeleteClick(item) {
    this.setState({
      selectedTestToDelete: item,
      confirmationDialog: true,
    });
  }
  handleConfirmation(response) {
    let formMode = this.state.formMode;
    if (response) {
      if (this.state.selectedAssetType) {
        let findform = _.find(this.state.appFormsTests, { code: this.state.selectedTestToDelete.code });
        if (findform) {
          let form = _.cloneDeep(findform);
          _.remove(form.opt2.config, { assetType: this.state.selectedAssetType && this.state.selectedAssetType.assetType });
          this.props.updateTestsAppForm(form, true);
          formMode = null;
        }
      } else {
        console.log("No Asset Type selected, can not add  the test");
      }
    }

    this.setState(({ confirmationDialog }) => ({
      selectedTestToDelete: null,
      confirmationDialog: !confirmationDialog,
      formMode: formMode,
    }));
  }
  handleConfirmationToggle() {
    this.setState(({ confirmationDialog }) => ({
      confirmationDialog: !confirmationDialog,
    }));
  }
  handleAddEditTest(formField) {
    if (this.state.selectedAssetType) {
      let configObj = _.cloneDeep(formField);
      let linearFields =
        this.state.selectedAssetType.assetTypeClassify === "linear"
          ? {
              inspectionType: configObj.inspectionType,
            }
          : {};
      let findform = _.find(this.state.appFormsTests, { code: configObj.test });
      if (findform) {
        let form = _.cloneDeep(findform);
        if (this.state.formMode == "Add") {
          form.opt2.config.push({
            id: guid(),
            name: configObj.name,
            assetType: this.state.selectedAssetType.assetType,
            inspectionFreq: configObj.inspectionFreq,
            instructionFile: configObj.instructionFile,
            ...linearFields,
          });
        } else {
          let configIndex = _.findIndex(form.opt2.config, {
            assetType: this.state.selectedAssetType && this.state.selectedAssetType.assetType,
          });
          if (configIndex > -1) {
            form.opt2.config[configIndex] = {
              ...form.opt2.config[configIndex],
              ...{
                name: configObj.name,
                id: form.opt2.config[configIndex].id ? form.opt2.config[configIndex].id : guid(),
                inspectionFreq: configObj.inspectionFreq,
                instructionFile: configObj.instructionFile,
                ...linearFields,
              },
            };
          }
        }
        this.props.updateTestsAppForm(form);
        this.setState({
          formMode: null,
        });
      }
    } else {
      console.log("No Asset Type selected, can not add  the test");
    }
  }
  handleAssetTypeSelected(aType) {
    let selectedAssetTests = this.checkSelectedAssetTypeForms(aType, this.state.allAppFormsTests);
    let allowedAppFormsTests = this.filterAllowedTestsForms(aType, this.state.allAppFormsTests);
    this.setState({
      selectedAssetTests: selectedAssetTests,
      selectedAssetType: aType,
      selectedTest: null,
      formMode: null,
      appFormsTests: allowedAppFormsTests,
    });
  }
  filterAllowedTestsForms(aType, appFormsTests) {
    let allowedAppFormsTests = [];
    for (let appFormListItem of appFormsTests) {
      let appForm = appFormListItem.opt2;
      let push = this.checkToPush(aType, appForm);
      if (push) {
        allowedAppFormsTests.push({ ...appFormListItem });
      }
    }
    return allowedAppFormsTests;
  }
  checkToPush(aType, appForm) {
    let push = false;
    let restricted = true;
    let notAllowed = true;
    let classifyNotAllowed = true;
    if (aType) {
      classifyNotAllowed = checkClassifcationAllowed(aType, appForm);
      if (!classifyNotAllowed) restricted = checkRestricitedTest(aType, appForm);
      if (!restricted) notAllowed = checkNotAllowed(aType, appForm);
      if (!notAllowed) push = true;
    }
    return push;
  }
  render() {
    //console.log(this.props.assetTypeTests);
    return (
      <React.Fragment>
        <ConfirmationDialog
          modal={this.state.confirmationDialog}
          toggle={this.handleConfirmationToggle}
          handleResponse={this.handleConfirmation}
          confirmationMessage={languageService("Are you sure you want to delete ?")}
          headerText={languageService("Confirm Deletion")}
        />

        <Row style={{ margin: "0px" }}>
          <Col md={12}>
            <div style={{ background: "#fff", borderRadius: "5px", paddingBottom: "30px" }}>
              <Row style={{ ...{ margin: "0px" }, ...themeService(GITestStyle.TopRowStyle) }}>
                <Col md={8} style={themeService(GITestStyle.ListHeadingStyle)}>
                  {languageService("Asset Types Tests")}
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <AssetTypes>
                    <AssetTypesList
                      assetsTypes={this.state.assetTypes}
                      selectedAssetType={this.state.selectedAssetType}
                      handleAssetTypeSelected={this.handleAssetTypeSelected}
                    />
                  </AssetTypes>
                  <AssetTasks onAddTestClick={this.onAddTestClick} selectedAssetType={this.state.selectedAssetType}>
                    <AssetTaskList
                      testTypes={this.state.selectedAssetTests}
                      formMode={this.state.formMode}
                      selectedAssetType={this.state.selectedAssetType}
                      handleEditClick={this.handleEditClick}
                      handleDeleteClick={this.handleDeleteClick}
                    />
                  </AssetTasks>
                </Col>
                <Col md={6}>
                  {this.state.formMode && (
                    <AddTestsForm
                      formMode={this.state.formMode}
                      selectedAssetType={this.state.selectedAssetType}
                      appFormsTests={this.state.appFormsTests}
                      selectedTest={this.state.selectedTest}
                      handleAddEditTest={this.handleAddEditTest}
                    />
                  )}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
const getAssetTypes = curdActions.getAssetTypes;

let variables = {
  assetTypeReducer: {
    assetTypes: [],
  },
  diagnosticsReducer: { assetTypeTests: [], assetTypeTest: {} },
  applicationlookupsReducer: { applicationlookupsReducer: null },
};

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: false,
  others: { getAssetTypes, getTestsAppForm, updateTestsAppForm },
};
let reducers = ["assetTypeReducer", "diagnosticsReducer"];
const GITestAssetTypesContainer = CRUDFunction(GITestAssetTypes, "GITestAssetTypes", actionOptions, variables, reducers);
export default GITestAssetTypesContainer;

function checkClassifcationAllowed(aType, appForm) {
  let notAllowed = false;
  if (appForm.classify && aType.assetTypeClassify != appForm.classify) {
    notAllowed = true;
  }
  return notAllowed;
}
function checkRestricitedTest(aType, appForm) {
  let notAllowed = false;
  if (appForm.restrictAssetTypes && appForm.restrictAssetTypes.length > 0) {
    let findRestricted = _.find(appForm.restrictAssetTypes, (rAtype) => {
      return rAtype === aType.assetType;
    });
    if (findRestricted) {
      notAllowed = true;
    }
  }
  return notAllowed;
}
function checkNotAllowed(aType, appForm) {
  let notAllowed = false;
  if (appForm.allowedAssetTypes && appForm.allowedAssetTypes.length > 0) {
    let findAllowed = _.find(appForm.allowedAssetTypes, (AllowedAtype) => {
      return AllowedAtype === aType.assetType;
    });
    if (!findAllowed) {
      notAllowed = true;
    }
  }
  return notAllowed;
}
