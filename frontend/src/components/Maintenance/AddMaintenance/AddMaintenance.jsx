import React, { Component } from "react";
import { CRUDFunction } from "./../../../reduxCURD/container";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
// import { Label } from './../../Common/Forms/formsMiscItems';
import _ from "lodash";
import { ModalStyles } from "./../../Common/styles.js";
import MaintenanceImageArea from "./MaintenanceImageArea";
import { getAppMockupsTypes } from "./../../../reduxRelated/actions/diagnosticsActions";
import "components/Common/commonform.css";
import { checkFormIsValid, processFromFields } from "../../../utils/helpers";
import FormFields from "../../../wigets/forms/formFields";
import ImageGallery from "./../../Common/ImageGallery";
import { languageService } from "../../../Language/language.service";
import DocumentGallery from "components/Common/DocumentGallery/index";
import {
  FormModels,
  historyFields,
  LOCATION_TYPES,
  locationGPSFields,
  locationMarkerFields,
  locationMilepostFields,
  maintenanceAddFields,
  maintenanceEditFields,
} from "./variables";
import SvgIcon from "react-icons-kit";
import { plus } from "react-icons-kit/icomoon/plus";
import { minus } from "react-icons-kit/icomoon/minus";
import { getAssetLines, getAssetLinesWithSelf } from "../../../reduxRelated/actions/assetHelperAction";
import MaintenanceDocumentsArea from "./MaintenanceDocumentsArea";
import { FORM_MODES } from "../../../utils/globals";
import ImageSlider from "../../Common/ImageSlider";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { retroColors } from "../../../style/basic/basicColors";
import EstimateListEditable from "./EstimateListEditable";
import { commonPageStyle } from "../../Common/Summary/styles/CommonPageStyle";
import permissionCheck from "../../../utils/permissionCheck";
import { curdActions } from "reduxCURD/actions";
import moment from "moment";
import ConfirmationDialog from "../../Common/ConfirmationDialog";

const MyButton = props => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

//console.log(FormModels.getFormModel("maintenanceFields"));

class AddMaintenance extends Component {
  state = {
    maintenanceFields: _.cloneDeep(maintenanceAddFields),
    locationGPSFields: null,
    locationMilepostFields: _.cloneDeep(locationMilepostFields),
    locationMarkerFields: null,
    historyFields: null,

    locationType: 0,

    selectedMaintenanceType: "",
    selectedMaintenanceTypeAttributes: {},
    imageList: [], //['test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg'],
    imgSlider: false,
    selectedImageIndex: 0,
    documentList: [],
    assetTypeList: [],
    // modalState: "None",
    formModes: FORM_MODES.BASE,
    isHistoryData: false,
    estimateHistoryRecord: [],
    estimate: [],
    confirmCloseMR: {
      status: false,
      dataToSubmit: null,
    },
    isHistoryField: false,
  };
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.updateFrom = this.updateFrom.bind(this);
    this.handleImageSliderClose = this.handleImageSliderClose.bind(this);
    this.updateEstimate = this.updateEstimate.bind(this);
    this.toggleConfirmMRChange = this.toggleConfirmMRChange.bind(this);
    this.handleConfirmationChangeMRResponse = this.handleConfirmationChangeMRResponse.bind(this);
  }
  componentDidMount() {
    this.props.getAssetLinesWithSelf();
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.maintenanceTypes &&
      this.props.maintenanceTypes.length > 0 &&
      this.state.maintenanceFields.maintenanceType.config.options.length <= 0
    ) {
      let maintenanceFields = _.cloneDeep(this.state.maintenanceFields);

      maintenanceFields.maintenanceType.config.options = this.props.maintenanceTypes.map(mt => {
        return { val: mt, text: mt };
      });
      maintenanceFields.maintenanceType.value = maintenanceFields.maintenanceType.config.options[0].val;
      maintenanceFields.maintenanceType.valid = true;

      this.updateFrom({ maintenanceFields });
    }

    if (prevProps.modal !== this.props.modal) {
      if (this.props.modal) {
        let mafs = _.cloneDeep(maintenanceAddFields);
        let locationMPFields = _.cloneDeep(locationMilepostFields);

        if (this.props.lineAssets && this.props.lineAssets.length) {
          mafs.lineId.config.options = this.props.lineAssets.map(ln => {
            return { val: ln._id.toString(), text: ln.unitId };
          });
          mafs.lineId.value = this.props.lineAssets && this.props.lineAssets[0] ? this.props.lineAssets[0]._id : "";
        }

        if (mafs.lineId.value && mafs.lineId.value !== "")
          locationMPFields = this.addLineLimitsToCaptionsAndValidations(mafs.lineId.value, locationMPFields, true);

        if (this.props.modalState === "Edit") {
          this.mapSelectedMaintenanceToFields();
        } else {
          this.setState({
            maintenanceFields: mafs,
            locationGPSFields: null,
            historyFields: null,
            locationMarkerFields: null,
            locationMilepostFields: _.cloneDeep(locationMPFields),
            imageList: [],
            documentList: [],
            showImgGal: false,
            showDocsGal: false,
            message: "",
            assetTypeList: [],
            estimate: [],
            estimateHistoryRecord: [],
          });
        }
      }
    }

    if (
      this.state.maintenanceFields.lineId.config &&
      this.state.maintenanceFields.lineId.config.options &&
      this.state.maintenanceFields.lineId.config.options.length === 0 &&
      this.props.lineAssets.length > 0
    ) {
      this.setState((state, props) => {
        let mfs = _.cloneDeep(state.maintenanceFields);
        let lmpfs = _.cloneDeep(state.locationMilepostFields);

        mfs.lineId.config.options = props.lineAssets.map(ln => {
          return { val: ln._id.toString(), text: ln.unitId };
        });

        if (mfs.lineId.value && mfs.lineId.value !== "") lmpfs = this.addLineLimitsToCaptionsAndValidations(mfs.lineId.value, lmpfs, true);

        return { maintenanceFields: mfs, locationMilepostFields: lmpfs };
      });
    }

    // if (
    //   this.props.assetHelperActionType === "GET_LINE_ASSETS_SUCCESS" &&
    //   prevProps.assetHelperActionType != this.props.assetHelperActionType &&
    //   this.state.maintenanceFields.lineId.config.options.length <= 0
    // ) {
    //   let mfs = _.cloneDeep(this.state.maintenanceFields);

    //   mfs.lineId.config.options = this.props.lineAssets.map(ln => {
    //     return { val: ln._id.toString(), text: ln.description };
    //   });
    //   mfs.lineId.value = this.props.lineAssets && this.props.lineAssets[0] ? this.props.lineAssets[0]._id : "";
    //   mfs.lineId.valid = true;
    //   this.updateFrom({ mfs });
    // }
  }

  mapSelectedMaintenanceToFields = () => {
    let { maintenanceFields } = this.state;
    let { selectedMaintenance } = this.props;
    let disableFields = selectedMaintenance.status === "In Progress" || selectedMaintenance.status === "Closed"; // Do not allow editing maintenance that are in progress or complete. Allow Estimate addition for In progress
    maintenanceFields = {
      ..._.cloneDeep(maintenanceEditFields),

      ...maintenanceFields,
    };
    let historyFieldsTemplate = _.cloneDeep(historyFields);

    for (let key in selectedMaintenance) {
      if (key in maintenanceFields) {
        if (key === "assignedTo") {
          maintenanceFields[key].value = selectedMaintenance[key].id;
          maintenanceFields[key].valid = true;
        } else {
          maintenanceFields[key].value = selectedMaintenance[key];
          maintenanceFields[key].valid = true;
        }

        maintenanceFields[key].config["disabled"] |= disableFields; // disable only. Do not enable if already disabled.
      }

      if (key in historyFieldsTemplate) {
        historyFieldsTemplate[key].value = selectedMaintenance[key];
        historyFieldsTemplate[key].valid = true;
      }
    }

    let isHistoryFields = false;
    for (let key2 in historyFieldsTemplate) {
      if (selectedMaintenance.status !== "New") {
        historyFieldsTemplate[key2].config["disabled"] = true;
        historyFieldsTemplate[key2].valid = true;

        if (!(key2 in selectedMaintenance)) {
          delete historyFieldsTemplate[key2];
        }
      } else {
        if (key2 in selectedMaintenance) isHistoryFields = true;
      }
    }

    if (selectedMaintenance.status === "New" && !isHistoryFields) {
      historyFieldsTemplate = null;
    }

    let locationFields = this.mapLocationFieldsToState(selectedMaintenance.location);
    locationFields.locationMilepostFields = this.addLineLimitsToCaptionsAndValidations(
      selectedMaintenance.lineId,
      locationFields.locationMilepostFields,
    );

    if (disableFields) {
      for (let k3 in locationFields.locationMilepostFields) {
        locationFields.locationMilepostFields[k3].config["disabled"] = disableFields;
      }
    }
    maintenanceFields.lineId.config.disabled = true;

    let imageList = selectedMaintenance.images.map(item => item.imgName);
    let documentList = selectedMaintenance.documents.map(item => item);

    this.updateFrom({
      maintenanceFields,
      imageList,
      documentList,
      ...locationFields,
      historyFields: historyFieldsTemplate,
      estimate: selectedMaintenance.estimate,
      estimateHistoryRecord: selectedMaintenance.estimateHistoryRecord,
    });
  };

  mapLocationFieldsToState = location => {
    let gps,
      milepost,
      marker = false;
    let lmpfs = _.cloneDeep(locationMilepostFields);
    let lgpsfs = _.cloneDeep(locationGPSFields);
    let disabled = this.props.selectedMaintenance.sourceType === "app-issue"; // do not allow change in location if the source is app

    if (location.length > 0) {
      location.map(item => {
        if (item.type === "GPS") {
          gps = true;
          lgpsfs.start_lat.value = item.start.lat;
          lgpsfs.start_lat.valid = true;
          lgpsfs.start_lat.config.disabled = disabled;
          lgpsfs.end_lat.value = item.end.lat;
          lgpsfs.end_lat.valid = true;
          lgpsfs.end_lat.config.disabled = disabled;
          lgpsfs.start_lon.value = item.start.lon;
          lgpsfs.start_lon.valid = true;
          lgpsfs.start_lon.config.disabled = disabled;
          lgpsfs.end_lon.value = item.end.lon;
          lgpsfs.end_lon.valid = true;
          lgpsfs.end_lon.config.disabled = disabled;
        }

        if (item.type === "Milepost") {
          milepost = true;
          lmpfs.start.value = item.start;
          lmpfs.start.valid = true;
          lmpfs.start.touched = false;
          lmpfs.start.config.disabled = disabled;
          lmpfs.end.value = item.end;
          lmpfs.end.valid = true;
          lmpfs.end.touched = false;
          lmpfs.end.config.disabled = disabled;
        }

        if (item.type === "Marker") {
          marker = true;
          locationMarkerFields.start.value = item.start;
          locationMarkerFields.start.valid = true;
          locationMarkerFields.start.touched = false;
          locationMarkerFields.start.config.disabled = disabled;
          locationMarkerFields.end.value = item.end;
          locationMarkerFields.end.valid = true;
          locationMarkerFields.end.touched = false;
          locationMarkerFields.end.config.disabled = disabled;
        }
      });
    }

    let finalObjectToReturn = {};

    if (gps) finalObjectToReturn = { ...finalObjectToReturn, locationGPSFields: lgpsfs };

    if (milepost) finalObjectToReturn = { ...finalObjectToReturn, locationMilepostFields: lmpfs };

    if (marker) finalObjectToReturn = { ...finalObjectToReturn, locationMarkerFields };
    else finalObjectToReturn = { ...finalObjectToReturn, locationMarkerFields: null };

    // if (gps && !milepost) {
    //   return { locationGPSFields };
    // }
    //
    // if (!gps && milepost) {
    //   return { locationMilepostFields: lmpfs };
    // }
    //
    // if (gps && milepost) {
    //   return { locationGPSFields: locationGPSFields, locationMilepostFields: lmpfs };
    // }

    return finalObjectToReturn;
  };

  addLineLimitsToCaptionsAndValidations(lineId, locationMilepostFields1, setInitialValues = false) {
    if (locationMilepostFields1 && lineId && this.props.lineAssets) {
      let line = this.props.lineAssets.find(l => {
        return l._id === lineId;
      });
      if (line) {
        let startLimit = line.start,
          endLimit = line.end;
        let limitMsg = ": [" + startLimit + " to " + endLimit + "] ";

        if (!locationMilepostFields1.start.labelText.endsWith(limitMsg))
          locationMilepostFields1.start.labelText = `${languageService(locationMilepostFields1.start.labelText)} ${limitMsg}`;

        if (!locationMilepostFields1.end.labelText.endsWith(limitMsg))
          locationMilepostFields1.end.labelText = `${languageService(locationMilepostFields1.end.labelText)} ${limitMsg}`;

        if (setInitialValues) {
          locationMilepostFields1.start.value = line.start;
          locationMilepostFields1.end.value = line.end;
        }

        // add validations
        locationMilepostFields1.start.validation.min = line.start;
        locationMilepostFields1.start.validation.max = line.end;

        locationMilepostFields1.end.validation.min = line.start;
        locationMilepostFields1.end.validation.max = line.end;
      }
    }
    return locationMilepostFields1;
  }

  updateFrom = newState => {
    if (
      newState &&
      newState.maintenanceFields &&
      newState.maintenanceFields.lineId &&
      this.state.maintenanceFields.lineId.value !== newState.maintenanceFields.lineId.value
    ) {
      let locationMPfields = _.cloneDeep(locationMilepostFields);
      for (let key in locationMPfields) {
        if (
          this.state.locationMilepostFields[key] &&
          this.state.locationMilepostFields[key].value &&
          this.state.locationMilepostFields[key].touched
        ) {
          locationMPfields[key].value = this.state.locationMilepostFields[key].value;
          locationMPfields[key].touched = true;
        }
      }
      locationMPfields = this.addLineLimitsToCaptionsAndValidations(newState.maintenanceFields.lineId.value, locationMPfields);
      newState.locationMilepostFields = locationMPfields;
    }

    this.setState({ ...newState, message: "" });
  };

  updateEstimate(updatedState) {
    this.setState(updatedState);
  }

  submitForm = e => {
    e.preventDefault();
    let location = [];
    let { maintenanceFields, message, historyFields } = this.state;
    let dataToSubmit = processFromFields(maintenanceFields);
    let formIsValid = checkFormIsValid(maintenanceFields);

    let item = {
      name: "Milepost",
      disabled: false,
      model: locationMilepostFields,
      modelName: "locationMilepostFields",
    };

    if (this.props.modalState === "Add" || this.props.selectedMaintenance.location.findIndex(ol => ol.type === "Milepost") !== -1) {
      location = this.mapLocationStateToSubmitData(location, item);
      processFromFields(this.state["locationMilepostFields"]);
      formIsValid = checkFormIsValid(this.state["locationMilepostFields"]) && formIsValid;
    }

    if (this.state.locationGPSFields) {
      item = { ...item, name: "GPS", model: this.state["locationGPSFields"], modelName: "locationGPSFields" };

      formIsValid = checkFormIsValid(this.state["locationGPSFields"]) && formIsValid;
      location = this.mapLocationStateToSubmitData(location, item);
    }

    if (this.state.locationMarkerFields) {
      item = { ...item, name: "Marker", model: this.state["locationMarkerFields"], modelName: "locationMarkerFields" };

      formIsValid = checkFormIsValid(this.state["locationMarkerFields"]) && formIsValid;
      location = this.mapLocationStateToSubmitData(location, item);
    }

    if (!location) return false;

    this.setFormValidation(this.state["locationMilepostFields"], "locationMilepostFields");

    let line = this.props.lineAssets.find(ln => {
      return ln._id === dataToSubmit.lineId;
    });
    dataToSubmit.lineName = line.unitId;

    let { imageList, documentList } = this.state;
    let images = imageList.map(image => ({ imgName: image }));
    let estimate = this.state.estimate || [];
    estimate = estimate.map(est => {
      delete est.editMode;

      return est;
    });
    let estimateHistoryRecord = this.state.estimateHistoryRecord;
    if (formIsValid) {
      if (this.state.historyFields && Object.keys(this.state.historyFields).length > 0 && this.state.isHistoryField) {
        this.setState({
          confirmCloseMR: {
            status: true,
            dataToSubmit: {
              maintenanceRole: this.props.selectedMaintenance ? this.props.selectedMaintenance.maintenanceRole : "",
              ...dataToSubmit,
              location,
              images,
              documents: documentList,
              estimate,
              estimateHistoryRecord,
              ...processFromFields(this.state.historyFields),
            },
            locationMarkerFields: null,
          },
        });
      } else {
        this.props.addMaintenanceHandler(
          { ...dataToSubmit, location, images, documents: documentList, estimate, estimateHistoryRecord },
          this.props.modalState,
        );
      }
    } else {
      this.setFormValidation(maintenanceFields, "maintenanceFields");
    }
  };

  setFormValidation = (data, stateVarName) => {
    for (let key in data) {
      data[key].touched = true;
      const msg = languageService("Validation failed") + ": ";
      if (!data[key].validationMessage.startsWith(msg)) data[key].validationMessage = msg + data[key].validationMessage;
    }

    this.setState({ [stateVarName]: data });
  };

  mapLocationStateToSubmitData = (location, selectedLocationType, oldLocationObject) => {
    let { message } = this.state;
    if (selectedLocationType.name === "GPS") {
      let gpsObj = {
        type: "GPS",
        start: {},
        end: {},
      };

      for (let key in this.state[selectedLocationType.modelName]) {
        let keys = key.split("_");
        gpsObj[keys[0]][keys[1]] = this.state[selectedLocationType.modelName][key].value;
      }
      location.unshift(gpsObj);
    }
    if (selectedLocationType.name === "Milepost") {
      let milepostObj = {
        type: "Milepost",
      };

      for (let key in this.state[selectedLocationType.modelName]) {
        milepostObj[key] = parseFloat(this.state[selectedLocationType.modelName][key].value).toFixed(2);
      }

      if (parseFloat(milepostObj.start) > parseFloat(milepostObj.end)) {
        this.setState({ message: languageService("Milepost start must be less than or equal to Milepost End") });
        return null;
      }

      location.push(milepostObj);
    }
    if (selectedLocationType.name === "Marker") {
      let markerObj = {
        type: "Marker",
      };

      for (let key in this.state[selectedLocationType.modelName]) {
        markerObj[key] = this.state[selectedLocationType.modelName][key].value;
      }

      location.push(markerObj);
    }

    return location;
  };

  addMaintenanceStateHandler = newState => this.setState({ ...newState });

  addSelectedImage = imgName => {
    if (imgName) {
      const { imageList } = this.state;
      this.setState({
        imageList: [...imageList, imgName],
        formModes: FORM_MODES.BASE,
      });
    } else {
      this.setState({
        formModes: FORM_MODES.BASE,
      });
    }
  };

  locationTypeSelectionHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  locationAddHandler = () => {
    const { locationType } = this.state;

    if (!this.state[LOCATION_TYPES[locationType].modelName]) {
      this.setState({ [LOCATION_TYPES[locationType].modelName]: Object.assign({}, LOCATION_TYPES[locationType].model) });
    }
  };

  historyDataHandler = () => {
    this.setState({ historyFields: _.cloneDeep(historyFields), isHistoryField: true });
  };

  handleGPSFieldClose = () => {
    this.setState({ locationGPSFields: null });
  };

  handleHistoryFieldClose = () => {
    this.setState({ historyFields: null, isHistoryField: false });
  };

  addDocumentHandle = () => {
    this.setState(({ formModes }) => ({
      formModes: formModes === FORM_MODES.DOCUMENT_SELECTION ? FORM_MODES.BASE : FORM_MODES.DOCUMENT_SELECTION,
    }));
  };

  addSelectedDocument = docName => {
    if (docName) {
      this.setState(({ documentList }) => ({ documentList: [...documentList, docName], formModes: FORM_MODES.BASE }));
    } else {
      this.setState({
        formModes: FORM_MODES.BASE,
      });
    }
  };

  handleImageSliderClose() {
    this.setState({
      formModes: FORM_MODES.BASE,
    });
  }

  toggleConfirmMRChange() {
    let confirmCloseMR = this.state.confirmCloseMR;
    if (confirmCloseMR.status) {
      this.setState({
        confirmCloseMR: {
          status: false,
          dataToSubmit: null,
        },
      });
    } else {
      confirmCloseMR.status = !confirmCloseMR.status;
      this.setState({ confirmCloseMR });
    }
  }

  handleConfirmationChangeMRResponse = response => {
    if (response) {
      let dataToSubmit = this.state.confirmCloseMR.dataToSubmit;
      let workOrderNumber = "";
      let closedDate = "";
      dataToSubmit.executionDate = dataToSubmit.executionDate ? dataToSubmit.executionDate : moment();

      if (this.props.modalState === "Add") {
        workOrderNumber = moment(dataToSubmit.executionDate).year();
        closedDate = dataToSubmit.executionDate;
      } else if (this.props.modalState === "Edit") {
        workOrderNumber = this.props.selectedMaintenance.workOrderNumber
          ? this.props.selectedMaintenance.workOrderNumber
          : moment(dataToSubmit.executionDate).year();
        closedDate = this.props.selectedMaintenance.closedDate ? this.props.selectedMaintenance.closedDate : dataToSubmit.executionDate;
      }

      dataToSubmit.workOrderNumber = workOrderNumber;
      dataToSubmit.closedDate = closedDate;

      this.props.addMaintenanceHandler(dataToSubmit, this.props.modalState);
    }

    this.setState({
      confirmCloseMR: {
        status: false,
        dataToSubmit: null,
      },
    });
  };

  render() {
    return (
      <Modal
        contentClassName={themeService({ default: this.props.className, retro: "retroModal" })}
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        style={{ maxWidth: "98vw" }}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {this.props.modalState === "Add" ? languageService("Add New Work Order") : languageService("Edit Work Order")}
        </ModalHeader>
        <ModalBody style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          <ConfirmationDialog
            modal={this.state.confirmCloseMR.status}
            toggle={this.toggleConfirmMRChange}
            handleResponse={this.handleConfirmationChangeMRResponse}
            confirmationMessage={
              <div>
                <div>
                  <strong>{languageService("Note")}: </strong>
                  {languageService("This MR has been marked as historical. Saving now will close this MR and cannot be changed later")}.
                  <div>{languageService("Do you want to proceed")} ?</div>
                </div>
              </div>
            }
            headerText={languageService("Confirm MR To Historical")}
          />

          {(this.state.formModes === FORM_MODES.BASE || this.state.formModes === FORM_MODES.IMAGE_GALLERY) && (
            <Row>
              <Col md={2}>
                <MaintenanceImageArea imagesList={this.state.imageList} addMaintenanceStateHandler={this.addMaintenanceStateHandler} />
                <MaintenanceDocumentsArea documentList={this.state.documentList} addDocument={this.addDocumentHandle} />
              </Col>
              <Col md={5}>
                <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Work Order Attributes")} </ModalHeader>
                <div className={"commonform"}>
                  <FormFields maintenanceFields={this.state.maintenanceFields} fieldTitle={"maintenanceFields"} change={this.updateFrom} />
                </div>
              </Col>
              <Col md={5}>
                <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Location Attributes")} </ModalHeader>
                <div className={"commonform"}>
                  <div>
                    <FormFields
                      locationMilepostFields={this.state.locationMilepostFields}
                      fieldTitle={"locationMilepostFields"}
                      change={this.updateFrom}
                    />
                    {this.state.message && (
                      <div style={{ marginTop: "5px", marginBottom: "5px", fontSize: "12px", color: "rgb(157, 7, 7)" }}>
                        <span>{this.state.message}</span>
                      </div>
                    )}
                  </div>

                  {this.state.locationGPSFields && (
                    <div style={{ position: "relative" }}>
                      <SvgIcon
                        style={{ position: "absolute", right: 0, zIndex: 999 }}
                        icon={minus}
                        size={20}
                        onClick={this.handleGPSFieldClose}
                      />
                      <br></br>
                      <FormFields
                        locationGPSFields={this.state.locationGPSFields}
                        fieldTitle={"locationGPSFields"}
                        change={this.updateFrom}
                      />
                    </div>
                  )}

                  {this.state.locationMarkerFields && (
                    <div style={{ position: "relative" }}>
                      {/*<SvgIcon*/}
                      {/*style={{ position: "absolute", right: 0, zIndex: 999 }}*/}
                      {/*icon={minus}*/}
                      {/*size={20}*/}
                      {/*onClick={this.handleGPSFieldClose}*/}
                      {/*/>*/}
                      <br></br>
                      <FormFields
                        locationMarkerFields={this.state.locationMarkerFields}
                        fieldTitle={"locationMarkerFields"}
                        change={this.updateFrom}
                      />
                    </div>
                  )}

                  {this.state.historyFields && (
                    <div style={{ position: "relative" }}>
                      {(this.props.modalState === "Add" || this.state.isHistoryField) && (
                        <SvgIcon
                          style={{ position: "absolute", right: 0, zIndex: 999 }}
                          icon={minus}
                          size={20}
                          onClick={this.handleHistoryFieldClose}
                        />
                      )}

                      <br></br>
                      <FormFields historyFields={this.state.historyFields} fieldTitle={"historyFields"} change={this.updateFrom} />
                    </div>
                  )}
                </div>

                <Row>
                  <Col md={12}>
                    {!this.state.locationGPSFields && (
                      <Row>
                        <Col md={12}>
                          <div
                            style={themeService({
                              default: { padding: "15px 0px", margin: "auto", width: "50%", color: "rgba(64, 118, 179)", cursor: "pointer" },
                              retro: {
                                padding: "15px 0px",
                                margin: "auto",
                                width: "50%",
                                color: retroColors.second,
                                cursor: "pointer",
                                float: "right",
                                textAlign: "right",
                              },
                            })}
                          >
                            <span
                              style={{
                                verticalAlign: "top",
                                display: "inline-block",
                                marginRight: "10px",
                              }}
                            >
                              {languageService("Add")} GPS
                            </span>
                            <SvgIcon icon={plus} size={20} onClick={this.locationAddHandler} />
                          </div>
                        </Col>

                        {/*<Col md={12}>*/}
                        {/*<div>*/}
                        {/*<select*/}
                        {/*style={themeService(formFeildStyle.inputStyle)}*/}
                        {/*value={this.state.locationType}*/}
                        {/*name={"locationType"}*/}
                        {/*onChange={this.locationTypeSelectionHandler}*/}
                        {/*>*/}
                        {/*{LOCATION_TYPES.map((item, index) => (*/}
                        {/*<option key={index} value={index} disabled={item.disabled}>*/}
                        {/*{item.name}*/}
                        {/*</option>*/}
                        {/*))}*/}
                        {/*</select>*/}
                        {/*</div>*/}
                        {/*</Col>*/}
                      </Row>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    {!this.state.historyFields && (
                      <Row>
                        <Col md={12}>
                          <div
                            style={themeService({
                              default: { padding: "15px 0px", margin: "auto", width: "50%", color: "rgba(64, 118, 179)", cursor: "pointer" },
                              retro: {
                                padding: "15px 0px",
                                margin: "auto",
                                width: "50%",
                                color: retroColors.second,
                                cursor: "pointer",
                                float: "right",
                                textAlign: "right",
                              },
                            })}
                          >
                            {((this.props.selectedMaintenance &&
                              this.props.selectedMaintenance.status === "New" &&
                              this.props.selectedMaintenance.sourceType !== "app-issue") ||
                              this.props.modalState === "Add") && (
                              <React.Fragment>
                                <span
                                  style={{
                                    verticalAlign: "top",
                                    display: "inline-block",
                                    marginRight: "10px",
                                    marginTop: "9px",
                                  }}
                                >
                                  {languageService("Is this Historical Data")}?
                                </span>
                                <span
                                  style={{ background: "rgb(64, 118, 179)",textDecoration:"capitalize" }}
                                  onClick={this.historyDataHandler}
                                  className={"btn btn-primary"}
                                >
                                  {languageService("Yes")}
                                </span>
                              </React.Fragment>
                            )}
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </Col>
              {/*{this.props.modalState === "Edit" && (*/}

              <EstimateListEditable
                ml={this.props.selectedMaintenance}
                estimate={this.state.estimate}
                estimateHistoryRecord={this.state.estimateHistoryRecord}
                updateEstimate={this.updateEstimate}
                updateMaintenance={this.props.updateMaintenance}
                getMaintenance={this.props.getMaintenance}
                maintenanceActionType={this.props.maintenanceActionType}
                maintenance={this.props.maintenance}
                getApplicationlookupss={this.props.getApplicationlookupss}
                applicationlookupss={this.props.applicationlookupss}
                applicationlookupsActionType={this.props.applicationlookupsActionType}
              />
              {/*)}*/}
            </Row>
          )}
          {this.state.formModes === FORM_MODES.IMAGE_SELECTION && (
            <ImageGallery
              handleSave={this.addSelectedImage}
              handleCancel={() => this.addMaintenanceStateHandler({ formModes: FORM_MODES.BASE })}
              loadImgPath={""}
              customFolder={"applicationresources"}
              uploadImageAllow
            />
          )}

          {/*{this.state.formModes === FORM_MODES.IMAGE_GALLERY && (*/}
          <ImageSlider
            imgSlider={this.state.formModes === FORM_MODES.IMAGE_GALLERY}
            imageDirectory={"applicationresources"}
            images={this.state.imageList}
            initialIndex={this.state.selectedImageIndex}
            handleToggle={this.handleImageSliderClose}
          />
          {/*)}*/}

          {this.state.formModes === FORM_MODES.DOCUMENT_SELECTION && (
            <DocumentGallery
              handleSave={this.addSelectedDocument}
              handleCancel={this.addDocumentHandle}
              loadDocumentPath={"showAssetDocuments"}
              customFolder={""}
              uploadImageAllow
            />
          )}
        </ModalBody>

        {this.state.formModes === FORM_MODES.BASE && (
          <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
            {this.props.modalState === "Add" && (
              <MyButton style={themeService(ButtonStyle.commonButton)} type="submit" onClick={this.submitForm}>
                {languageService("Add")}
              </MyButton>
            )}
            {this.props.modalState === "Edit" && (
              <MyButton style={themeService(ButtonStyle.commonButton)} onClick={this.submitForm} type="submit">
                {languageService("Update")}
              </MyButton>
            )}
            <MyButton style={themeService(ButtonStyle.commonButton)} type="button" onClick={this.props.toggle}>
              {languageService("Cancel")}
            </MyButton>
          </ModalFooter>
        )}
      </Modal>
    );
  }
}

const getApplicationlookupss = curdActions.getApplicationlookupss;

let actionOptions = {
  create: false,
  update: false,
  read: true,
  delete: false,
  others: { getAppMockupsTypes, getAssetLinesWithSelf, getApplicationlookupss },
};

let variables = {
  diagnosticsReducer: {
    subdivisions: [],
  },
  assetHelperReducer: {
    lineAssets: [],
  },
  applicationlookupsReducer: { applicationlookupss: [] },
};

let AddMaintenanceContainer = CRUDFunction(AddMaintenance, "addMaintenance", actionOptions, variables, [
  "diagnosticsReducer",
  "assetHelperReducer",
  "applicationlookupsReducer",
  // 'utilReducer',
]);
export default AddMaintenanceContainer;
