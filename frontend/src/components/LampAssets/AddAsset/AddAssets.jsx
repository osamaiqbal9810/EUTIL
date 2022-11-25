/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { CRUDFunction } from "reduxCURD/container";
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import AssetImageArea from "./AssetImageArea";
import AssetDocumentsArea from "./AssetDocumentsArea";
import ImageGallery from "components/Common/ImageGallery/index";
import DocumentGallery from "components/Common/DocumentGallery/index";
// import AssetTypeFieldsTabs from "./AssetTypeFieldsTabs";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import _, { result } from "lodash";
import "components/Common/commonform.css";
import { curdActions } from "reduxCURD/actions";
import { languageService } from "../../../Language/language.service";
import FormFields from "../../../wigets/forms/formFields";
import { requiredValidationMessage, commonFields, locationMilepostFields, attributesFields, dynamicFields } from "./variables"; // not using locationGPSFields anymore
import { createFieldFromTemplate } from "../../../wigets/forms/common";
import { checkFormIsValid, processFromFields } from "../../../utils/helpers";
import AssetTabs from "components/Common/Tabs/CommonTabs";
import { FORM_SUBMIT_TYPES } from "../../../utils/globals";
// import { recursivelyFindAssetId } from "../index";
import moment from "moment-timezone";
import ImageSlider from "../../Common/ImageSlider";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "../../../theme/service/activeTheme.service";
// import { commonStyles } from "../../../theme/commonStyles";
import * as turf from "@turf/turf";
import { ToastContainer, toast } from "react-toastify";
import ReactMapboxGl, { GeoJSONLayer, Marker, Layer, Feature, Popup } from "react-mapbox-gl";
import { getGeoJsonCoordinates, getGeoJsonStrCoordinates, validateGeoJsonStr } from "../../../utils/GISUtils";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import permissionCheck from "../../../utils/permissionCheck";
import BulkAdd from "./BulkAdd/BulkAdd";
import { createMultipleAssets } from "reduxRelated/actions/assetHelperAction";
import { getServerEndpoint } from "../../../utils/serverEndpoint";
import { primaryTrackAssetTypeChecks, getyTrackMarkerATypeCheck } from "../../../AssetTypeConfig/LampAssets/AddAsset";
import Dialog from "../../../libraries/Dialog";
import AppFormCustomAttrs from "../../AppFormCustomAttrs";
import DrawControl from 'react-mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { containsNumber } from "@turf/turf";
import { findAssetStatus, findLocationTypeStatusColor } from "../../../utils/findInspectionStatus";
import "./addAssets.css"
var Map = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoib3NhbWExNTciLCJhIjoiY2w3OTNsbTB4MGZ4MDNub2xteGNhanNjbSJ9.gET6tPcC1dG6MTRDqk4f8w",
});

const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class AddAssets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commonFields: _.cloneDeep(commonFields),
      //locationGPSFields: _.cloneDeep(locationGPSFields),
      locationMilepostFields: _.cloneDeep(locationMilepostFields),
      systemAttributes: null,
      attributes: _.cloneDeep(attributesFields),
      timpsAttributes: null,
      lampAttributes: null,
      locationType: 0,
      parentAsset: null,

      imgSlider: false,
      selectedImageIndex: 0,
      imageList: [], //['test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg'],

      documentList: [],

      showImgGal: false,
      modalState: "None",
      geoJsonLenMiles: null,
      geoJsonLenKm: null,
      geoJsonMsg: "",
      mapCenter: null,
      mapBound: null,
      zoom: [11],
      showBulkAdd: false,
      mapBound2: null,
      openAppFormAttrsDialog: false,
      assetsLocArray: [],
      assetsLocArrayLength: 0,
      markers: [],
      pointDrawControlStatus: true,
      latitude: null,
      longitude: null,
      submitCoordBtnStatus: true,
      latlngFieldStatus: false,
      popSubmitLatLong: false,
      latitudeErr: false,
      longitudeErr: false,
      inspectionCheckboxes: {},
      location_type: null,
      datesFormStatus: true,
      inspectionsStatus: {},
      newPointOnMapArray: [],
      inspectionDates: {},
      lastInspReq: {},
      locationTypeStatus: null,
      inspectionTypes: [],
      minDate: null,
      maxDate: null,
      maxDate_Next: null,
      assetIsInInspection: {},
      popUpShow: "block",
      validateLineType: true
    };
    this.geoJsonData = null;
    this.updateFrom = this.updateFrom.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.validateGeoJson = this.validateGeoJson.bind(this);
    this.showToastError = this.showToastError.bind(this);

    this.getMinOrMax = this.getMinOrMax.bind(this);
    this.getBounds = this.getBounds.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.onMapZoom = this.onMapZoom.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.reverseGeoJson = this.reverseGeoJson.bind(this);
    this.updatePrimaryTrackValidation = this.updatePrimaryTrackValidation.bind(this);
    this.bulkAddCallback = this.bulkAddCallback.bind(this);
    this.handleExportChildren = this.handleExportChildren.bind(this);
    this.openAppFormAttrsView = this.openAppFormAttrsView.bind(this);
    this.updateAppFormAttrsCallback = this.updateAppFormAttrsCallback.bind(this);

  }
  componentDidMount() {

  }


  componentDidUpdate(prevProps, prevState) {
    //console.log(this.props.plannableLocations[0]);

    if (this.props.modalState !== prevProps.modalState && this.props.modalState == "Add") {
      //this.setState({ popUpShow: "none" })
      let parentAsset = this.props.parentAsset ? this.props.parentAsset : this.props.plannableLocations[0];

      // for dynamicaly rendering inspection dates and checkboxes
      this.filterInspections(this.props.modalState);

      this.setAssetTypeField(parentAsset);
      // let pAsset = this.props.parentAsset ? this.props.parentAsset : this.props.plannableLocations[0];
      // let assetsList = this.props.assetsList ? this.props.assetsList : [];
      this.state.mapBound = null;
      // this.changeMapAccordingToLocation(assetsList, pAsset);

      this.addModalDefaultValues();
      this.limitMinAndMaxDatesOnPicker();
      // this.props.assets && this.props.assets.assetsTypes && this.props.takeAssetTypeFromAddAsset(this.props.assets.assetsTypes);
    }
    if (this.props.modalState !== prevProps.modalState && this.props.modalState == "Edit") {

      this.filterInspections(this.props.modalState);
      this.limitMinAndMaxDatesOnPicker();
      this.geoJsonData = null;
      //this.state.newPointOnMapArray=[];

      this.setState({ newPointOnMapArray: [] });
      //this.setState({ popUpShow: "none" })
      //this.state.lastInspReq.stray = false;
      //this.state.lastInspReq.structure = false;
      this.state.latitudeErr = false;
      this.state.longitudeErr = false;
      let selectedAsset = this.props.selectedAsset;
      if (selectedAsset) {
        this.fillValuesToFormFieldsEdit(selectedAsset);
      }

      this.mapSelectedAssetToFormFields();
      let assetsList = this.props.assetsList ? this.props.assetsList : [];
      let pAsset = this.props.parentAsset ? this.props.parentAsset : this.props.plannableLocations[0];
      this.changeMapAccordingToLocation(assetsList, pAsset);
      /*       if (this.state.lampAttributes && this.state.lampAttributes.geoJsonCord && this.state.lampAttributes.geoJsonCord.value != "") {
        this.validateGeoJson();
      }
 */
      this.state.commonFields.assetType.labelText = !this.props.showMap ? "Location" : this.state.commonFields.assetType.labelText;
    } else if (this.props.modalState == "Edit") {

      //console.log(this.state.commonFields.unitId.value);
      //console.log(prevState.commonFields.unitId.value);
      if (this.state.commonFields.unitId.value != prevState.commonFields.unitId.value) {
        //this.mapSelectedAssetToFormFields();
        // osama Iqbal
        this.validateGeoJson();
        this.limitMinAndMaxDatesOnPicker();
        this.geoJsonData = null;
        //console.log(this.geoJsonData.name);
        let assetsList = this.props.assetsList ? this.props.assetsList : [];
        let pAsset = this.props.parentAsset ? this.props.parentAsset : this.props.plannableLocations[0];
        this.changeMapAccordingToLocation(assetsList, pAsset);
        this.setState({ newPointOnMapArray: [] });
        this.setState({ submitCoordBtnStatus: false });
        this.setState({ latlngFieldStatus: true });
       // this.setState({ popUpShow: "none" })
        // if (this.props.showMap) {
        //   const { commonFields } = this.state;
        //   let updatedCommonFields = _.cloneDeep(commonFields);
        //   updatedCommonFields.assetType.labelText = "Asset Type";
        //   console.log(updatedCommonFields);
        //   this.setState({ commonFields: updatedCommonFields });
        // }

      }
      this.state.commonFields.assetType.labelText = !this.props.showMap ? "Location" : this.state.commonFields.assetType.labelText
    }
    if (!prevState.mapBound) {
      let pAsset = this.props.parentAsset ? this.props.parentAsset : this.props.plannableLocations[0];
      let assetsList = this.props.assetsList ? this.props.assetsList : [];
      this.changeMapAccordingToLocation(assetsList, pAsset);
    }


    // if ((this.state.lampAttributes && !prevState.lampAttributes) || this.state.lampAttributes &&
    //     this.state.lampAttributes.primaryTrack &&
    //     this.state.lampAttributes.primaryTrack.value !== prevState.lampAttributes.primaryTrack.value
    // ) {
    //    this.updatePrimaryTrackValidation();
    // }

    if (
      this.state.commonFields.lineId.value !== prevState.commonFields.lineId.value &&
      _.find(primaryTrackAssetTypeChecks, (t) => {
        return t === this.state.commonFields.assetType.value;
      })
    ) {
      this.updatePrimaryTrackValidation();
    }
    if (this.props.actionType === "ADDASSET_READ_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      let url = getServerEndpoint() + "assetsExports/" + "assetExport.csv";
      window.open(url, "_blank");
    }
    if (this.props.actionType === "ADDASSET_READ_FAILURE" && this.props.actionType !== prevProps.actionType) {
      window.alert("Export failed");
    }
  }

  fillValuesToFormFieldsEdit(selectedAsset) {
    if (selectedAsset.hasOwnProperty('inspectionDates')) {
      this.state.inspectionDates = selectedAsset.inspectionDates;
    }
    if (selectedAsset.hasOwnProperty('inspectionCheckboxes')) {
      this.state.inspectionCheckboxes = selectedAsset.inspectionCheckboxes;
    }
    if (selectedAsset.assetsLocArray.length) {
      this.setState({ latitude: selectedAsset.assetsLocArray[0][0] });
      this.setState({ longitude: selectedAsset.assetsLocArray[0][1] });
    }
    if (selectedAsset.location_type) {
      this.setState({ location_type: selectedAsset.location_type });
      if (selectedAsset.location_type == "Not Located") {
        this.setState({ datesFormStatus: false });
      }
    }
    if (selectedAsset.hasOwnProperty("assetIsInInspection")) {
      this.setState({ assetIsInInspection: selectedAsset.assetIsInInspection });
    }
  }
  addModalDefaultValues() {
    this.setState({ assetsLocArray: [] });
    this.setState({ latitude: null });
    this.setState({ longitude: null });
    this.setState({ location_type: "Located" });
    this.setState({ latitudeErr: false });
    this.setState({ longitudeErr: false });
    this.setState({ inspectionDate: {} });
    this.setState({ submitCoordBtnStatus: true });
    this.setState({ newPointOnMapArray: [] });
    this.setState({ latlngFieldStatus: false });
    this.setState({ inspectionDates: {} });
    this.setState({ datesFormStatus: true });
    this.setState({ lastInspReq: {} });
    this.setState({ assetIsInInspection: {} })

    // last inspection date cant be greater than todays date
    // next inspection date cant be todays or less than today

  }
  limitMinAndMaxDatesOnPicker() {
    var maxformatedDate = moment().format('YYYY-MM-DD');
    this.setState({ maxDate: maxformatedDate });

    var minformatedDate = moment().add(1, 'day').format('YYYY-MM-DD');
    this.setState({ minDate: minformatedDate });
  }
  filterInspections(modalState) {
    this.props.getApplookup().then((lookUps) => {
      if (lookUps && lookUps.response) {
        let lookUpsList = lookUps.response;
        if (lookUpsList && lookUpsList.length > 0) {
          let inspectionType = lookUpsList.filter(({ listName }) => listName == "inspectionTypes");
          this.setState({ inspectionTypes: inspectionType });
          if (modalState == "Add") {
            if (inspectionType) {
              inspectionType.forEach((type) => {
                if (type) {
                  this.setState({
                    ...this.state,
                    inspectionCheckboxes: {
                      ...this.state.inspectionCheckboxes,
                      [type.opt1.checkBoxName]: true
                    }
                  })
                }
              })
            }
          }
        }
      }
    }
    )
  }
  openAppFormAttrsView(open) {
    this.setState({ openAppFormAttrsDialog: open });
  }
  updateAppFormAttrsCallback(attrs) {
    alert("TODO: updated on server required");
  }
  handleExportChildren() {
    let parentAsset = this.props.selectedAsset;
    this.props.getAddAsset("locAssetCSV/" + parentAsset._id);
  }
  updatePrimaryTrackValidation() {
    let lampAttributes = _.cloneDeep(this.state.lampAttributes);
    let isPrimaryTrack = this.checkIfPrimaryTrack(this.state.commonFields.lineId.value, this.props.assets.assetsList);

    if (
      _.find(primaryTrackAssetTypeChecks, (t) => {
        return t === this.state.commonFields.assetType.value;
      }) &&
      lampAttributes &&
      lampAttributes.primaryTrack
    ) {
      if (this.props.modalState === "Add") lampAttributes.primaryTrack.value = false;
      if (lampAttributes.primaryTrack.value) isPrimaryTrack = false;
      lampAttributes.primaryTrack.config.disabled = isPrimaryTrack;
      this.setState({ lampAttributes });
    }
  }
  checkIfPrimaryTrack(selectedLocation, assetList) {
    let filterListBySelectedLocation = assetList.filter(
      (al) =>
        al.lineId === selectedLocation &&
        _.find(primaryTrackAssetTypeChecks, (t) => {
          return t === al.assetType;
        }) &&
        al.attributes &&
        al.attributes.primaryTrack,
    );

    return !!(filterListBySelectedLocation && filterListBySelectedLocation.length > 0);
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
  addLineLimitsToCaptionsAndValidations(parentAsset, locationMilepostFields1, setInitialValues = false) {
    if (
      locationMilepostFields1 &&
      parentAsset &&
      parentAsset.inspectable &&
      parentAsset.hasOwnProperty("start") &&
      parentAsset.hasOwnProperty("end")
    ) {
      let startLimit = parentAsset.start,
        endLimit = parentAsset.end;
      let limitMsg = ": [" + startLimit + " to " + endLimit + "] ";

      if (!locationMilepostFields1.start.labelText.endsWith(limitMsg))
        locationMilepostFields1.start.labelText = `${languageService(locationMilepostFields1.start.labelText)} ${limitMsg}`;

      if (!locationMilepostFields1.end.labelText.endsWith(limitMsg))
        locationMilepostFields1.end.labelText = `${languageService(locationMilepostFields1.end.labelText)} ${limitMsg}`;

      if (setInitialValues) {
        locationMilepostFields1.start.value = parentAsset.start;
        locationMilepostFields1.end.value = parentAsset.end;
      }

      // add validations
      locationMilepostFields1.start.validation.min = parentAsset.start;
      locationMilepostFields1.start.validation.max = parentAsset.end;
      locationMilepostFields1.start.valid =
        locationMilepostFields1.start.value >= locationMilepostFields1.start.validation.min &&
        locationMilepostFields1.start.value <= locationMilepostFields1.start.validation.max;
      locationMilepostFields1.start.touched = !locationMilepostFields1.start.valid;

      locationMilepostFields1.end.validation.min = parentAsset.start;
      locationMilepostFields1.end.validation.max = parentAsset.end;
      locationMilepostFields1.end.valid =
        locationMilepostFields1.end.value >= locationMilepostFields1.end.validation.min &&
        locationMilepostFields1.end.value <= locationMilepostFields1.end.validation.max;
      locationMilepostFields1.end.touched = !locationMilepostFields1.end.valid;
    }
    return locationMilepostFields1;
  }
  setLocationField(updatedCommonFields) {
    updatedCommonFields.lineId.config.options = this.props.plannableLocations.map((pl) => {
      return { val: pl._id, text: pl.unitId };
    });
    if (this.props.modalState == "Add") {
      if (this.props.parentAsset) {
        updatedCommonFields.lineId.value = this.props.parentAsset.locationId;
        updatedCommonFields.lineId.config.disabled = true;
      } else {
        updatedCommonFields.lineId.config.disabled = false;
        updatedCommonFields.lineId.value = updatedCommonFields.lineId.config.options[0].val;
      }
    } else if (this.props.modalState == "Edit") {
      // updatedCommonFields.lineId.value = this.props.selectedAsset.locationId;
      // updatedCommonFields.lineId.config.disabled = true;
      let allowEditLocation = permissionCheck("Asset Edit", "lineid update");
      allowEditLocation =
        allowEditLocation &&
        this.props.plannableLocations.find((l) => {
          return l._id === this.props.selectedAsset._id;
        }) == undefined;
      if (allowEditLocation) {
        if (this.props.parentAsset && !_.find(this.props.plannableLocations, { _id: this.props.parentAsset._id })) {
          updatedCommonFields.lineId.value = this.props.parentAsset.locationId;
          updatedCommonFields.lineId.config.disabled = true;
        } else {
          updatedCommonFields.lineId.config.disabled = false;
          let locationValue = updatedCommonFields.lineId.config.options.find((l) => {
            return l.val === this.props.parentAsset._id;
          });
          updatedCommonFields.lineId.value =
            locationValue && locationValue.val ? locationValue.val : updatedCommonFields.lineId.config.options[0].val;
        }
      } else {
        // use self _id for location assets (that do not have a locationId)
        updatedCommonFields.lineId.value = this.props.selectedAsset.locationId
          ? this.props.selectedAsset.locationId
          : this.props.selectedAsset._id;
        updatedCommonFields.lineId.config.disabled = true;
      }
    }
  }
  setAssetTypeField(parentAsset) {
    if (this.props.assets && this.props.assets.assetsTypes && parentAsset) {
      let updatedCommonFields, parentAssetType, attributesObject;
      updatedCommonFields = _.cloneDeep(commonFields);
      let lmpfs = _.cloneDeep(locationMilepostFields);

      this.setLocationField(updatedCommonFields);
      parentAssetType = _.find(this.props.assets.assetsTypes, { assetType: parentAsset.assetType });
      attributesObject = {};
      if (parentAssetType) {
        updatedCommonFields.assetType.config.options = this.allowedAssetTypesOptions(parentAssetType, this.props.assets.assetsTypes);
        let assetTypeToShowAttributes = "";
        updatedCommonFields.assetType.config.disabled = false;
        if (updatedCommonFields.assetType.config.options.length > 0) {
          updatedCommonFields.assetType.value = updatedCommonFields.assetType.config.options[0].val;
          assetTypeToShowAttributes = updatedCommonFields.assetType.config.options[0].val;
        }
        let attributeAssetType = _.find(this.props.assets.assetsTypes, { assetType: assetTypeToShowAttributes });
        attributeAssetType && (attributesObject = this.updateAssetTypeFieldAndAttributes(attributeAssetType, updatedCommonFields));
      }

      lmpfs = this.addLineLimitsToCaptionsAndValidations(parentAsset, lmpfs);

      this.setState(
        {
          commonFields: updatedCommonFields,
          timpsAttributes: attributesObject.timpsAttributes,
          lampAttributes: attributesObject.lampAttributes,
          systemAttributes: attributesObject.systemAttributes,
          locationMilepostFields: lmpfs,
          imageList: [],
          documentList: [],
          geoJsonLenKm: "",
          geoJsonLenMiles: "",
          geoJsonMsg: "",
        },
        () => {
          if (this.state.lampAttributes && this.state.lampAttributes.primaryTrack) {
            this.updatePrimaryTrackValidation();
          }
        },
      );
      this.geoJsonData = null;
    }
  }
  updateAssetTypeFieldAndAttributes(assetTypeForAttributes) {
    let attributesObject = { systemAttributes: null, timpsAttributes: null, lampAttributes: null };
    assetTypeForAttributes.systemAttributes &&
      assetTypeForAttributes.systemAttributes.length > 0 &&
      (attributesObject.systemAttributes = this.getAttributesField(assetTypeForAttributes.systemAttributes));

    assetTypeForAttributes.timpsAttributes &&
      assetTypeForAttributes.timpsAttributes.length > 0 &&
      (attributesObject.timpsAttributes = this.getAttributesField(assetTypeForAttributes.timpsAttributes));

    assetTypeForAttributes.lampAttributes &&
      assetTypeForAttributes.lampAttributes.length > 0 &&
      (attributesObject.lampAttributes = this.getAttributesField(assetTypeForAttributes.lampAttributes));
    return attributesObject;
  }

  getAttributesField(attributeObject) {
    let assetTypeAttributeFields = null;
    attributeObject.forEach((item) => {
      let newField = createFieldFromTemplate(item.name, "", item.labelText || item.name);

      if (item.name === "geoJsonCordFile") {
        newField.element = "file";
        newField.labelText = "GeoJSON File";
        newField.accept = ".json, .geojson";
        newField.fileData = "";
        newField.validation.required = false;
        //newField.containerConfig.col = 12;
      }
      if (item.name === "geoJsonCord") {
        let newField1 = createFieldFromTemplate(item.name + "File", "", item.name + "File");
        newField1.config.required = false;
        newField1.index = 100;
        newField1.element = "file";
        newField1.labelText = "GeoJSON File";
        newField1.accept = ".json, .geojson";
        newField1.validation.required = false;
        assetTypeAttributeFields = { [item.name + "File"]: _.cloneDeep(newField1), ...assetTypeAttributeFields };
        newField.index = 99;
        newField.labelText = "GeoJSON Cord";
        newField.readonly = true;
        item.required = false;
        //newField.validation.required = false;
      }

      if (item.name === "timezone") {
        newField.element = "select";
        newField.config.options = moment.tz.names().map((v) => {
          return { val: v, text: v };
        });
        newField.config.options.unshift({ val: "", text: "Please select timezone" });
        newField.config.options[0] && (newField.value = newField.config.options[0].val);
      }

      if (item.name === "railOrientation") {
        newField.element = dynamicFields.railOrientation.element;
        newField.label = dynamicFields.railOrientation.label;
        newField.labelText = dynamicFields.railOrientation.labelText;
        newField.config.options = dynamicFields.railOrientation.config.options;
        newField.config.options[0] && (newField.value = newField.config.options[0].val);
      }

      if (item.type === "boolean") {
        newField.element = "checkbox";
        newField.config.type = "checkbox";
      }

      newField.config.required = item.required === false ? false : true; // if required is not specified than it is required by default

      if (newField.config.required) newField.validationMessage = requiredValidationMessage;
      if (!newField.index) {
        newField.index = item.order ? item.order : 0;
      }
      newField.valid = !newField.config.required;
      newField.validation.required = newField.config.required;
      // debugger;
      if (item.type === "array") {
        newField.element = "select";
        newField.config.options =
          item.values && item.values.length
            ? item.values.map((v) => {
              return { val: v, text: v };
            })
            : [];
        newField.config.options[0] && (newField.value = newField.config.options[0]);
      }
      if (item.type === "select") {
        newField.element = item.type;
      }
      if (item.selectList) {
        newField.config.options = this.getList(item.selectList, this.state.commonFields.lineId.value);
        newField.config.options[0] && (newField.value = newField.config.options[0].val);
        //newField.value = "[Select]";
      }

      assetTypeAttributeFields = { [item.name]: _.cloneDeep(newField), ...assetTypeAttributeFields };
    });
    return assetTypeAttributeFields;
  }

  updateAssetTypeOption(newAssetTypeName) {
    const { commonFields } = this.state;
    let updatedCommonFields = _.cloneDeep(commonFields);

    let attributesObject = {};
    let attributeAssetType = _.find(this.props.assets.assetsTypes, { assetType: newAssetTypeName });
    attributeAssetType && (attributesObject = this.updateAssetTypeFieldAndAttributes(attributeAssetType, updatedCommonFields));
    this.setState(
      {
        commonFields: updatedCommonFields,
        timpsAttributes: attributesObject.timpsAttributes,
        lampAttributes: attributesObject.lampAttributes,
        systemAttributes: attributesObject.systemAttributes,
      },
      () => {
        if (this.state.lampAttributes && this.state.lampAttributes.primaryTrack) {
          this.updatePrimaryTrackValidation();
        }
      },
    );
  }

  mapSelectedAssetToFormFields = () => {
    let { commonFields } = this.state; //locationGPSFields
    let updatedCommonFields = _.cloneDeep(commonFields);
    let updatedLocationMilepostFields = _.cloneDeep(locationMilepostFields);
    let lampAttributes = {};
    let systemAttributes = {};
    let data = this.props.selectedAsset;
    // if location form then no need for lineId
    if (this.props.locationForm) {
      updatedCommonFields.lineId.valid = true;
      updatedCommonFields.lineId.validation.isRequred = false;
      updatedCommonFields.lineId.hide = true;
    }
    for (let key in data) {
      let item = data[key];
      if (key in updatedCommonFields) {
        updatedCommonFields[key].value = item;
        updatedCommonFields[key].valid = true;
        if (key == "assetType") {
          let allowEditType = permissionCheck("Asset Edit", "assettype update");
          if (allowEditType) {
            let parentAsset = this.props.parentAsset ? this.props.parentAsset : this.props.plannableLocations[0];
            let assetTypesToCheck = this.props && this.props.assets && this.props.assets.assetsTypes;

            if (assetTypesToCheck) {
              let parentAssetType = _.find(assetTypesToCheck, { assetType: parentAsset.assetType });
              updatedCommonFields[key].config.options = this.allowedAssetTypesOptions(parentAssetType, assetTypesToCheck);
            } else {
              updatedCommonFields[key].config.options = [{ text: item, val: item }];
              updatedCommonFields[key].config.disabled = true;
            }

          } else {
            updatedCommonFields[key].config.disabled = true;
            updatedCommonFields[key].config.options = [{ text: item, val: item }];
          }
        }
      }

      if (key in updatedLocationMilepostFields) {
        updatedLocationMilepostFields[key].value = item;
        updatedLocationMilepostFields[key].valid = true;
      }

      // if (key === "coordinates" && item && item.length > 0) {
      //   locationGPSFields.start_lat.value = item[0][0];
      //   locationGPSFields.start_lat.valid = item[0][0] ? true : false;
      //   locationGPSFields.start_lon.value = item[0][1];
      //   locationGPSFields.start_lon.valid = item[0][1] ? true : false;
      //   locationGPSFields.end_lat.value = item[1][0];
      //   locationGPSFields.end_lat.valid = item[1][0] ? true : false;
      //   locationGPSFields.end_lon.value = item[1][1];
      //   locationGPSFields.end_lon.valid = item[1][1] ? true : false;
      // }
      if (key === "attributes") {
        if (item && item !== "{}") {
          let keys = Object.keys(item);
          let attributeAssetType, attributesObject;
          let assetTypes = this.props.assets && this.props.assets.assetsTypes ? this.props.assets.assetsTypes : this.props.assetTypes;
          if (assetTypes && data.assetType) {
            attributeAssetType = _.find(assetTypes, { assetType: data.assetType });
            attributeAssetType && (attributesObject = this.updateAssetTypeFieldAndAttributes(attributeAssetType, updatedCommonFields));
          }

          let aggregateKeys = []; // collect fields from asset(current value) and from assettype (template)

          // get template from assettype for existing fields in asset(current value)
          keys.map((key) => {
            let template = { config: { required: true }, index: 0, value: "" };
            if (attributesObject.lampAttributes && attributesObject.lampAttributes[key]) {
              template = attributesObject.lampAttributes[key];
              template.value = item[key];
              aggregateKeys.push({ name: key, template: template });
            } else if (attributesObject.timpsAttributes && attributesObject.timpsAttributes && attributesObject.timpsAttributes[key]) {
              template = attributesObject.timpsAttributes[key];
              template.value = item[key];
              aggregateKeys.push({ name: key, template: template });
            }
          });

          for (let lk in attributesObject.lampAttributes) {
            // add fields that currently not exist in asset (current value) but exists in assettype (template)
            if (!keys.includes(lk)) {
              aggregateKeys.push({ name: lk, template: attributesObject.lampAttributes[lk] });
            }
          }

          aggregateKeys.sort((a, b) => {
            return a.template.index - b.template.index;
          });

          aggregateKeys.map((ak, index) => {
            let key = ak.name;
            let template = ak.template;

            let newField = createFieldFromTemplate(key, "", template.labelText || key, template.value, template.order);

            if (key === "timezone") {
              newField.element = "select";
              newField.config.options = moment.tz.names().map((v) => {
                return { val: v, text: v };
              });
              newField.config.options.unshift({ val: "", text: "Please select timezone" });
            } else if (key === "geoJsonCordFile") {
              newField.element = "file";
              newField.labelText = "GeoJSON File";
              newField.accept = ".json, .geojson";
              newField.validation.required = false;
              //newField.containerConfig.col = 12;
            } else if (key === "geoJsonCord") {
              newField.readonly = true;
              newField.labelText = "GeoJSON Cord";
              //item.required = false;
              //newField.validation.required = false;
            } else if (key === "railOrientation") {
              newField.element = dynamicFields.railOrientation.element;
              newField.label = dynamicFields.railOrientation.label;
              newField.labelText = dynamicFields.railOrientation.labelText;
              newField.config.options = dynamicFields.railOrientation.config.options;
              newField.value = item[key];
            } else if (key === "primaryTrack") {
              newField.element = "checkbox";
              newField.config.type = "checkbox";
              newField.value = item[key] || false;
            } else if (key === "Marker Start" || key === "Marker End") {
              newField.element = template.element; //"select";
              newField.config.options = template.config.options; //this.getList("SwitchNames", data.locationId);
            }

            newField.config.required = template.config.required === false ? false : true;

            if (newField.config.required) newField.validationMessage = requiredValidationMessage;
            else newField.validation.required = false;

            newField.valid = !newField.config.required;
            newField.index = template.index ? template.index : 0;

            lampAttributes = { [key]: _.cloneDeep(newField), ...lampAttributes };
          });
        }
      }
      /*
      if (key === "attributes") {
        if (item && item !== "{}") {
          let keys = Object.keys(item);
          keys = keys.sort();
          keys.map((key, index) => {
            let newField = createFieldFromTemplate(key, "", key, item[key], index);

            if (key === "timezone") {
              newField.element = "select";
              newField.config.options = moment.tz.names().map(v => {
                return { val: v, text: v };
              });
            } else if (key === "geoJsonCordFile") {
              newField.element = "file";
              newField.labelText = "Geo JSON File";
              newField.accept = ".json, .geojson";
              newField.validation.required = false;
              //newField.containerConfig.col = 12;
            } else if (key === "geoJsonCord") {
              newField.readonly = true;
              //item.required = false;
              //newField.validation.required = false;
            }
            newField.config.required = item.required;

            if (newField.config.required) newField.validationMessage = requiredValidationMessage;

            newField.valid = !newField.config.required;

            lampAttributes = { [key]: _.cloneDeep(newField), ...lampAttributes };
          });
        }
      }
*/
      if (key === "systemAttributes") {
        if (item) {
          Object.keys(item).map((key) => {
            let newField = createFieldFromTemplate(key, "", key, item[key]);

            newField.config.required = item.required;
            newField.valid = !newField.config.required;

            if (newField.config.required) newField.validationMessage = requiredValidationMessage;

            systemAttributes = { [key]: _.cloneDeep(newField), ...lampAttributes };
          });
        }
      }
    }
    this.validateGeoJson(lampAttributes);
    let imageList = [];
    let documentList = [];
    if (data.images) {
      data.images.forEach((item) => {
        if (item) {
          imageList.push(item.imgName);
        }
      });
    }

    if (data.documents) {
      data.documents.forEach((item) => {
        if (item) {
          documentList.push(item);
        }
      });
    }
    this.setLocationField(updatedCommonFields);
    let parentAsset = this.props.parentAsset;
    updatedLocationMilepostFields = this.addLineLimitsToCaptionsAndValidations(parentAsset, updatedLocationMilepostFields);

    this.setState(
      {
        commonFields: updatedCommonFields,
        // locationGPSFields: locationGPSFields,
        locationMilepostFields: updatedLocationMilepostFields,
        // systemAttributes,
        lampAttributes: lampAttributes,
        imageList,
        documentList,
      },
      () => {
        if (this.state.lampAttributes && this.state.lampAttributes.primaryTrack) {
          this.updatePrimaryTrackValidation();
        }
      },
    );
  };

  allowedAssetTypesOptions(assetType, allAssetTypes) {
    let result = [];
    if (assetType && assetType.allowedAssetTypes) {
      for (let allowedAType of assetType.allowedAssetTypes) {
        let aTypeExist = _.find(this.props.assets.assetsTypes, { assetType: allowedAType });
        if (aTypeExist) {
          result.push({
            val: allowedAType,
            text: allowedAType,
          });
        }
      }
    }

    return result;
  }
  getList(listName, lineId = null, validation) {
    let retVal = [],
      emptyItem = { val: "    ", text: "    " };
    if (listName === "SwitchNames") {
      let assetsList = this.props.assets && this.props.assets.assetsList ? this.props.assets.assetsList : []; //this.props.assetsList;
      retVal = assetsList
        .filter((a) => {
          if (!lineId) return getyTrackMarkerATypeCheck(a.assetType);
          else return getyTrackMarkerATypeCheck(a.assetType) && lineId === a.lineId;
        })
        .map((a) => {
          return { val: a.unitId, text: a.unitId };
        });
    }
    retVal.unshift(emptyItem);
    return retVal;
  }
  showImageGallery = () => {
    this.setState({
      showImgGal: true,
    });
  };

  showImageSlider = (selectedImageIndex) => {
    this.setState({
      imgSlider: true,
      selectedImageIndex,
    });
  };
  handleImageSliderClose = () => {
    this.setState({
      imgSlider: false,
    });
  };

  cancelImageGallery = () => {
    this.setState({
      showImgGal: false,
    });
  };

  addSelectedImage = (imgName) => {
    if (imgName) {
      const { imageList } = this.state;
      let imgList = [...imageList];
      imgList.push(imgName);
      this.setState({
        imageList: imgList,
        showImgGal: false,
      });
    } else {
      this.setState({
        showImgGal: false,
      });
    }
  };

  addSelectedDocument = (docName) => {
    if (docName) {
      this.setState(({ documentList }) => ({ documentList: [...documentList, docName], showDocsGal: false }));
    } else {
      this.setState({
        showDocsGal: false,
      });
    }
  };


  checkInspectionDates = () => {
    //this.state.inspectionTypes
    let required = true;
    this.state.inspectionTypes.forEach((type) => {
      if (this.state.location_type == "Located" && type) {

        if ((this.state.inspectionCheckboxes[type.opt1.checkBoxName] == true) && (this.state.inspectionDates[type.opt1.lastInspFieldName] == undefined || this.state.inspectionDates[type.opt1.lastInspFieldName] == null || this.state.inspectionDates[type.opt1.lastInspFieldName] == '')) {
          this.state.lastInspReq[type.opt1.lastInspFieldName] = true;
          required = false;
        }
        else {
          this.state.lastInspReq[type.opt1.lastInspFieldName] = false;
        }
      }
      else {
        this.state.lastInspReq[type.opt1.lastInspFieldName] = false;
      }
    })
    // summaries result
    return required;
  }

  handleSubmitAsset = (formType) => () => {

    // if (this.state.geoJsonMsg !== "Invalid GeoJson Line Type" || this.state.geoJsonMsg == "" ) {
    let {
      commonFields,
      //    locationGPSFields,
      locationMilepostFields,
      imageList,
      lampAttributes,
      documentList,
      systemAttributes,
      inspectionDates,
      location_type,

    } = this.state;

    //   let coordinates = this.processGPSFields(locationGPSFields);
    let systemAttributesFields = processFromFields(systemAttributes);
    let attributes = processFromFields(lampAttributes);
    let commonFields1 = processFromFields(commonFields);
    let locationMilepostFields1 = processFromFields(locationMilepostFields);

    let formIsValid = checkFormIsValid(commonFields);
    formIsValid = checkFormIsValid(locationMilepostFields) && formIsValid;

    if (systemAttributes) formIsValid = checkFormIsValid(systemAttributes) && formIsValid;
    if (lampAttributes) formIsValid = checkFormIsValid(lampAttributes) && formIsValid;
    let inspectionDatesAreValid = true;
    if (this.props.showMap) {
      console.log(this.state.location_type)
      if ( this.state.location_type == "Located" && this.state.latitude === null || this.state.location_type == "Located" && this.state.latitude == '') {
        this.state.latitudeErr = true;
      }
      else {
        this.state.latitudeErr = false;
      }
      if (this.state.location_type == "Located" && this.state.longitude === null || this.state.location_type == "Located" && this.state.longitude == '') {
        this.state.longitudeErr = true;
      }
      else {
        this.state.longitudeErr = false;
      }
      inspectionDatesAreValid = this.checkInspectionDates();
    }
    if (!this.props.showMap) {
      if (!this.state.validateLineType) {
        this.geoJsonData = null;
        this.showToastError(languageService("Invalid GeoJson Line Type, only Polygon is allowed"));
        return;
      }
      else if (lampAttributes && !this.validateJson(lampAttributes.geoJsonCord.value)) {
        this.geoJsonData = null;
        this.showToastError(languageService("Valid Json is required."));
        return
      }
    }
    let images = imageList.map((image) => ({ imgName: image }));
    let formIsValidLoc = this.props.showMap == true || (!lampAttributes) || (lampAttributes && !lampAttributes.geoJsonCord);
    let formIsValidAsset = !this.props.showMap && lampAttributes && lampAttributes.geoJsonCord && this.validateJson(lampAttributes.geoJsonCord.value) && this.state.geoJsonMsg == "";


    if (formIsValid && this.state.latitudeErr == false && this.state.longitudeErr == false && inspectionDatesAreValid && (formIsValidLoc && !formIsValidAsset || !formIsValidLoc && formIsValidAsset) && this.state.validateLineType == true) {
      let newState = {
        ...commonFields1,
        ...locationMilepostFields1,
        attributes,
        systemAttributes: systemAttributesFields,
        images,
        documents: documentList,
      };

      newState.start = parseFloat(newState.start).toFixed(2);
      newState.end = parseFloat(newState.end).toFixed(2);
      this.state.inspectionsStatus = findAssetStatus(this.state.inspectionCheckboxes, this.state.inspectionDates, this.state.inspectionTypes);

      newState.assetsLocArray = this.state.assetsLocArray ? this.state.assetsLocArray : '';
      newState.location_type = this.state.location_type ? this.state.location_type : '';
      newState.inspectionsStatus = this.state.inspectionsStatus;
      newState.locationTypeStatus = this.state.locationTypeStatus ? this.state.locationTypeStatus : '';
      newState.inspectionCheckboxes = this.state.inspectionCheckboxes ? this.state.inspectionCheckboxes : '',
        newState.inspectionDates = this.state.inspectionDates;
      if (parseFloat(newState.start) <= parseFloat(newState.end)) {
        newState.assetLength = newState.end - newState.start;
      } else {
        this.setState({ milePostValidationError: languageService("Milepost start must be less than or equal to Milepost End") });
        return true;
      }

      this.props.handleSubmitForm(newState, formType);
    } else {
      this.geoJsonData = null;
      this.state.lampAttributes = null;
      this.setFormValidation(commonFields, "commonFields");
      this.setFormValidation(locationMilepostFields, "locationMilepostFields");

      if (systemAttributes) {
        this.setFormValidation(systemAttributes, "systemAttributes");
      }
      if (lampAttributes) {
        this.setFormValidation(lampAttributes, "lampAttributes");
      }
    }

  }

  setFormValidation = (data, stateVarName) => {
    const msg = languageService("Validation failed") + ": ";
    for (let key in data) {
      data[key].touched = true;
      if (!data[key].validationMessage.startsWith(msg)) data[key].validationMessage = msg + data[key].validationMessage;
    }

    this.setState({ [stateVarName]: data });
  };

  // processGPSFields = locationGPSFields => [
  //   [locationGPSFields.start_lat.value, locationGPSFields.start_lon.value],
  //   [locationGPSFields.end_lat.value, locationGPSFields.end_lon.value],
  // ];

  handleClose = () => {
    this.setState({});
    this.props.toggle("None", null);
  };

  bulkAddDisplayToggle = () => {
    this.setState({ showBulkAdd: !this.state.showBulkAdd });
  };

  handleBulkAdd = () => {
    this.bulkAddDisplayToggle();
  };

  addDocumentHandle = () => {
    this.setState(({ showDocsGal }) => ({ showDocsGal: !showDocsGal }));
  };
  handleFileChange(newState, e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    if (!file) return;
    reader.onloadend = () => {
      /*
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
        jsonData: reader.result,
      });*/

      //console.log(reader.result);
      //console.log(this.state.lampAttributes);

      //lampAttributes.geoJsonCord
      //let geoJsonCord = { ...this.state.lampAttributes.geoJsonCord };
      //geoJsonCord.fileData = reader.result;
      if (this.state.lampAttributes && !this.validateGeoJson(this.state.lampAttributes.geoJsonCord.value)) {
        let lampAttributes = _.cloneDeep(this.state.lampAttributes);
        lampAttributes.geoJsonCord.value = "";
        this.geoJsonData = null;
        this.setState({ lampAttributes: lampAttributes });
      }
      try {
        this.geoJsonData = JSON.parse(reader.result);
        let lampAttributes = _.cloneDeep(this.state.lampAttributes);
        lampAttributes.geoJsonCord.value = reader.result;
        this.setState({ lampAttributes: lampAttributes });
        //validate json object
        this.validateGeoJson();
      } catch (e) {
        this.showToastError(languageService("Invalid Json file"));
      }
    };

    //reader.readAsDataURL(file)
    reader.readAsText(file);

    //file.text().then(data){console.log(data)}
  }
  validateJson(data) {
    try {
      JSON.parse(data);
      return true;
    } catch (e) {
      return false;
    }
  }

  validateGeoJson = (la) => {

    try {
      let obj = null;
      let lampAttributes = null;
      if (la) {
        lampAttributes = la;
      } else {
        lampAttributes = this.state.lampAttributes;
      }

      if (lampAttributes && lampAttributes.geoJsonCord && lampAttributes.geoJsonCord.value != "") {
        if (this.validateJson(lampAttributes.geoJsonCord.value)) {
          obj = JSON.parse(lampAttributes.geoJsonCord.value);
          this.geoJsonData = obj;
        } else {
          this.geoJsonData = null;
        }
      } else if (this.geoJsonData) {
        obj = this.geoJsonData;
      } else {
        this.setState({ geoJsonLenMiles: 0.0, geoJsonLenKm: 0.0, geoJsonMsg: "", mapBound: null });
        this.geoJsonData = null;
        return;
      }
      //obj = this.geoJsonData;
      if (obj) {
        if (obj.features && obj.features[0]) {
          if (obj.features[0].geometry.type === "Polygon") {
            this.state.validateLineType = true;
            let lineString = turf.polygon([obj.features[0].geometry.coordinates[0]]);
            let length = parseFloat(turf.length(lineString, { units: "miles" })).toFixed(2);
            let lengthKm = parseFloat(turf.length(lineString, { units: "kilometers" })).toFixed(2);
            let fitBound = this.getBounds(obj.features[0].geometry.coordinates[0]);
            this.setState({ geoJsonLenMiles: 0.0, geoJsonLenKm: 0.0, geoJsonMsg: "", mapBound: fitBound });
          } else {
            this.state.validateLineType = false;
            this.geoJsonData = null;
            this.setState({ geoJsonLenMiles: 0.0, geoJsonLenKm: 0.0, geoJsonMsg: "Invalid GeoJson Line Type, only Polygon is allowed", mapBound: null });
          }
        } else {
          this.setState({ geoJsonLenMiles: 0.0, geoJsonLenKm: 0.0, geoJsonMsg: "Invalid GeoJson Data", mapBound: null });
        }
      }
    } catch (err) {
      this.setState({ geoJsonLenMiles: 0.0, geoJsonLenKm: 0.0, geoJsonMsg: "Error Loading GeoJson Data", mapBound: null });
    }
  };
  updateFrom = (newState, e) => {
    if (newState.commonFields && this.state.commonFields) {
      this.state.commonFields.assetType.value !== newState.commonFields.assetType.value &&
        this.updateAssetTypeOption(newState.commonFields.assetType.value);

      if (this.state.commonFields.lineId.value !== newState.commonFields.lineId.value) {

        this.state.assetsLocArray = [];
        let updatedLocationMilepostFields = _.cloneDeep(locationMilepostFields);
        let assetsList = this.props.assets && this.props.assets.assetsList ? this.props.assets.assetsList : this.props.assetsList;
        let parentAsset = assetsList.find((a) => {
          return a._id === newState.commonFields.lineId.value;
        });
        this.state.commonFields.lineId.value = parentAsset._id;
        this.state.latitude = null;
        this.state.longitude = null;
        //console.log(parentAsset);
        // console.log('parentasset ', parentAsset.start, parentAsset.end);
        updatedLocationMilepostFields = this.addLineLimitsToCaptionsAndValidations(parentAsset, updatedLocationMilepostFields);

        let additionalFields = _.cloneDeep(this.state.lampAttributes);
        let updateMapOnSelect = this.changeMapAccordingToLocation(assetsList, parentAsset);
        // for (let key in additionalFields) {
        //   if (key === "Marker Start" || key === "Marker End") {
        //     let field = additionalFields[key];
        //     field.config.options = this.getList("SwitchNames", newState.commonFields.lineId.value, key === "Marker End" ? false : true);
        //   }
        // }
        this.setState({ locationMilepostFields: updatedLocationMilepostFields, lampAttributes: additionalFields });
      }
    }
    if (e.target.name === "geoJsonCord") {
      this.geoJsonData = null; //this.state.lampAttributes.geoJsonCord.value;
      this.validateGeoJson();
    }
    //console.log(newState);
    this.setState({ ...newState, milePostValidationError: "" });
    if (e.target.name === "geoJsonCordFile") {
      this.handleFileChange(newState, e);
      return;
    }
    if (e.target.name === "Marker Start" || e.target.name === "Marker End") {
      let locationMilepostFields = _.cloneDeep(this.state.locationMilepostFields);
      let targetSwitch = _.find(this.props.assets.assetsList, (asset) => {
        return asset.unitId === e.target.value;
      });
      if (targetSwitch) {
        if (e.target.name === "Marker Start") {
          locationMilepostFields.start.value = targetSwitch.start;
          !_.find(this.props.assets.assetsList, (asset) => {
            return asset.unitId === this.state.lampAttributes["Marker End"].value;
          }) && (locationMilepostFields.end.value = targetSwitch.end);
        } else {
          e.target.name === "Marker End" && (locationMilepostFields.end.value = targetSwitch.end);
        }
        this.setState({ locationMilepostFields: locationMilepostFields });
      }
    }
  };
  getMinOrMax(markersObj, minOrMax, latOrLng) {
    if (minOrMax == "max") {
      return _.maxBy(markersObj, function (value) {
        return value[latOrLng];
      })[latOrLng];
    } else {
      return _.minBy(markersObj, function (value) {
        return value[latOrLng];
      })[latOrLng];
    }
  }
  getBounds(coords) {
    var maxLat = this.getMinOrMax(coords, "max", 1);
    var minLat = this.getMinOrMax(coords, "min", 1);
    var maxLng = this.getMinOrMax(coords, "max", 0);
    var minLng = this.getMinOrMax(coords, "min", 0);

    let latPadding = Math.abs(minLat - maxLat) * 0.05;
    let lngPadding = Math.abs(minLng - maxLng) * 0.05;
    var southWest = [minLng - lngPadding, minLat - latPadding];
    var northEast = [maxLng + lngPadding, maxLat + lngPadding];
    return [southWest, northEast];
  }
  changeMapAccordingToLocation(assetsList, assetInfo) {
    try {
      if (assetInfo) {
        this.state.markers = [];
        if (assetInfo.assetsLocArray && assetsList) {
          let childAssets = assetsList.filter(({ parentAsset }) => parentAsset == assetInfo._id);
          this.state.markers.push(childAssets);
        }
        if (assetInfo && assetInfo.attributes && assetInfo.attributes.geoJsonCord && this.state.validateLineType) {
          let la = JSON.parse(assetInfo.attributes.geoJsonCord);

          try {
            let obj = la;
            this.geoJsonData = obj;
            if (obj) {
              if (obj.hasOwnProperty('features') && obj.features[0]) {
                if (obj.features[0].geometry.type === "Polygon") {
                  let lineString = turf.polygon([obj.features[0].geometry.coordinates[0]]);

                  // let length = parseFloat(turf.length(lineString, { units: "miles" })).toFixed(2);
                  // let lengthKm = parseFloat(turf.length(lineString, { units: "kilometers" })).toFixed(2);
                  let fitBound = this.getBounds(obj.features[0].geometry.coordinates[0]);
                  this.setState({ geoJsonLenMiles: 0.0, geoJsonLenKm: 0.0, geoJsonMsg: "", mapBound: fitBound });
                } else {
                  this.setState({ geoJsonLenMiles: 0.0, geoJsonLenKm: 0.0, geoJsonMsg: "Invalid GeoJson Line Type, only Polygon is allowed", mapBound: null });
                }
              } else {
                this.setState({ geoJsonLenMiles: 0.0, geoJsonLenKm: 0.0, geoJsonMsg: "Invalid GeoJson Data", mapBound: null });
              }
            }
          } catch (err) {
            //console.log(err);
            this.setState({ geoJsonLenMiles: 0.0, geoJsonLenKm: 0.0, geoJsonMsg: "Error Loading GeoJson Data", mapBound: null });
          }
        }
        //console.log(JSON.parse(assetInfo.attributes.geoJsonCord));
      }
    } catch (err) {
      console.log(err);
    }
  }

  reverseGeoJson() {
    if (this.state.lampAttributes && this.state.lampAttributes.geoJsonCord && this.state.lampAttributes.geoJsonCord.value) {
      let lampAttributes = _.cloneDeep(this.state.lampAttributes);
      let geoJsonStr = lampAttributes.geoJsonCord.value;

      if (validateGeoJsonStr(geoJsonStr)) {
        let geoJsonValue = JSON.parse(geoJsonStr);
        let coordinates = getGeoJsonCoordinates(geoJsonValue);
        let newcoords = coordinates.reverse();

        geoJsonValue.features[0].geometry.coordinates = newcoords;
        lampAttributes.geoJsonCord.value = JSON.stringify(geoJsonValue);
        this.geoJsonData = geoJsonValue;
        this.validateGeoJson(lampAttributes.geoJsonCord.value);

        this.setState({ lampAttributes: lampAttributes });
        console.log("added new value");
      }

      //this.setState({ lampAttributes: lampAttributes });
    }
  }

  bulkAddCallback(assetsList) {
    // console.log('Add these assets', assetsList);
    this.props.createMultipleAssets(assetsList);
    this.props.toggle();
  }

  onMapZoom = (map, e) => {
    //this.setState({ mapBound: e.getBounds() });
    if (e && e.originalEvent && e.originalEvent.type === "wheel") {
      const mapCenter = map.getCenter();
      this.setState({ mapCenter: mapCenter });
    }
    this.setState({ zoom: [map.getZoom()] });
    //console.log(e);
  };
  onMapClick = (map, e) => {
    const mapCenter = map.getCenter();
    this.setState({ mapCenter: mapCenter });
    // if (this.props.showMap == true) {
    //   this.setState({ popUpShow: "none" })
    // }
    //console.log(e);
  };

  onMarkerClick = (map, e) => {
    if (this.props.showMap == true) {
      this.setState({ popUpShow: "block" });
    }
    //console.log(e);
  };
  onDragEnd = (map, e) => {
    const mapCenter = map.getCenter();
    this.setState({ mapCenter: mapCenter });
  };
  //osama Iqbal
  findCoordinateValidity = (coordinates) => {
    try {
      let geoJsonDataLength = this.geoJsonData.features[0].geometry.coordinates.length;
      let firstCoordinate = this.geoJsonData.features[0].geometry.coordinates[0];
      // to make first and last point same
      if (firstCoordinate !== this.geoJsonData.features[0].geometry.coordinates[geoJsonDataLength - 1]) {
        this.geoJsonData.features[0].geometry.coordinates.push(firstCoordinate);
      }
      let line = turf.polygon([this.geoJsonData.features[0].geometry.coordinates[0]]);
      var point = turf.point(coordinates);
      let result = turf.booleanPointInPolygon(point, line);

      return result;
    } catch (err) {
      console.log(err);
    }
  }
  onDrawCreate = ({ features }) => {

    if (features && features[0]) {
      let coordinates = features[0].geometry.coordinates;
      let result = this.findCoordinateValidity(coordinates);
      if (result) {
        if (this.state.assetsLocArray.length > 0) {
          this.state.assetsLocArray.pop();
        }
        this.state.assetsLocArray.push(coordinates);
        this.state.latitude = coordinates[0];
        this.state.longitude = coordinates[1];
      }
      else {
        alert("This point is not situated within this location, and will not be considered");
      }
    }
  };
  onDrawUpdate = ({ features }) => {

    if (features && features[0]) {
      let coordinates = features[0].geometry.coordinates;
      let latitude = coordinates[0];
      let longitude = coordinates[1];
      let locArray = [];
      locArray[0] = latitude;
      locArray[1] = longitude;
      let result = this.findCoordinateValidity(locArray);
      if (result) {
        this.state.latitude = latitude;
        this.state.longitude = longitude;
      }
      else {
        alert("This point is not situated within this location, and will not be considered");
        this.state.latitude = '';
        this.state.longitude = '';
      }
    }
  }
  manangeLongLatField = (e) => {

    if (e.target.name == "latitude") {
      this.setState({ latitude: e.target.value });
    } else if (e.target.name == "longitude") {
      this.setState({ longitude: e.target.value });
    }
  }
  submitLatLong = () => {
    // console.log(this.state.submitCoordBtnStatus);
    if (this.state.submitCoordBtnStatus) {
      // console.log(this.state.latitude);
      // console.log(this.state.longitude);
      if (this.state.latitude && this.state.longitude) {
        let locArray = [];
        locArray[0] = this.state.latitude;
        locArray[1] = this.state.longitude;
        let result = this.findCoordinateValidity(locArray);
        if (result) {
          if (this.state.assetsLocArray.length > 0) {
            this.state.assetsLocArray.pop();
          }

          if (this.state.popSubmitLatLong == true) {
            // this.state.markers.pop();
            this.state.assetsLocArray.pop();
          }

          if (this.state.newPointOnMapArray.length > 0) {
            this.state.newPointOnMapArray.pop();
          }
          this.setState({ popSubmitLatLong: true });

          this.state.newPointOnMapArray.push([this.state.latitude, this.state.longitude]);
          this.setState({ submitCoordBtnStatus: !this.state.submitCoordBtnStatus });
          this.setState({ latlngFieldStatus: !this.state.latlngFieldStatus });


          this.state.assetsLocArray.push(locArray);
        } else {
          alert("this point is not situated within this location, and will not be considered");
          this.state.latitude = '';
          this.state.longitude = '';
        }
      }
    }
    else {
      this.setState({ submitCoordBtnStatus: !this.state.submitCoordBtnStatus });
      this.setState({ latlngFieldStatus: !this.state.latlngFieldStatus });
    }
  }
  lastInspectionDatesManager = (e, type) => {
    let { value } = e.target;
    let formatValue = moment(value).format('MM/DD/YYYY');
    let minDate = moment().add(1, 'day').format('YYYY-MM-DD');
    this.state.minDate = minDate;
    if (type && type.opt1 && type.opt1.frequency && type.opt1.unit && type.opt1.binding) {

      let next_date = moment(formatValue).add(type.opt1.frequency, type.opt1.unit).format('MM/DD/YYYY');
      this.state.maxDate_Next = moment(next_date).endOf('year').format('YYYY-MM-DD');
      this.setState({
        ...this.state,
        inspectionDates: {
          ...this.state.inspectionDates,
          [e.target.name]: moment(formatValue).format('MM/DD/YYYY'),
          [type.opt1.binding.nextInspFieldName]: next_date
        }
      })
    }
    else {
      this.setState({ [e.target.name]: formatValue })
    }
  }
  nextInspectionDatesManager = (e, type) => {
    let { value } = e.target;
    let formatValue = moment(value).format('MM/DD/YYYY');
    this.setState({
      ...this.state,
      inspectionDates: {
        ...this.state.inspectionDates,
        [type.opt1.binding.nextInspFieldName]: formatValue
      }
    })

  }
  manageInspectionCheckboxes = (e) => {
    this.setState({
      ...this.state,
      inspectionCheckboxes: {
        ...this.state.inspectionCheckboxes,
        [e.target.name]: e.target.checked
      }
    })
    if (e.target.checked == false) {
      let lookUps = this.state.inspectionTypes.find(({ opt1 }) => opt1.checkBoxName == e.target.name);
      let { description } = lookUps;
      this.setState({
        ...this.state,
        inspectionDates: {
          ...this.state.inspectionDates,
          [e.target.dataset.label]: null,
          [e.target.dataset.next]: null
        },
        assetIsInInspection: {
          ...this.state.assetIsInInspection,
          [description.flag]: false
        }
      })
    }
    this.state.inspectionCheckboxes[e.target.name] = e.target.checked;
  }
  manangeInspectionLocation = (e) => {

    if (e.target.name == "location_type") {
      this.setState({ location_type: e.target.value });
      if (e.target.value == "Not Located") {
        this.setState({ datesFormStatus: false });
      } else {
        this.setState({ datesFormStatus: true });
      }
    }

  }
  render() {
    const { mapBound, mapCenter, zoom } = this.state;
    const center = mapBound ? null : mapCenter;
    let geoJsonDetails = this.state.lampAttributes && this.state.lampAttributes.geoJsonCord && (
      <div style={{ marginTop: "5px", fontSize: "12px", backgroundColor: "white", padding: "10px" }}>
        {/*<div>
          {languageService("Total Length Miles")}: {this.state.geoJsonLenMiles}{" "}
        </div>
        <div>
          {languageService("Total Length Km")} : {this.state.geoJsonLenKm}
        </div>
        */}
        <div style={{ paddingTop: "5px", color: "red" }}> {this.state.geoJsonMsg}</div>

      </div>
    );
    let objData = this.geoJsonData;
    if (this.state.lampAttributes && this.state.lampAttributes.geoJsonCord && this.geoJsonData) {
      let objData = this.geoJsonData;

      let objFeature = objData.features && objData.features[0] ? objData.features[0] : null;
      // let startPoint = objFeature.geometry.coordinates[0][0];
      // let endPoint = objFeature.geometry.coordinates[0][objFeature.geometry.coordinates[0].length - 1];
      //let aryBounds = this.getBounds(objFeature.geometry.coordinates);
      geoJsonDetails = (
        <div style={{ marginTop: "5px", fontSize: "12px", backgroundColor: "white", padding: "10px" }}>
          {/*<div>
            {languageService("Total Length Miles")}: {this.state.geoJsonLenMiles}{" "}
          </div>
          <div>
            {"Total Length Km"} : {this.state.geoJsonLenKm}
          </div>
          <button onClick={this.reverseGeoJson}>{languageService("Reverse")}</button>
          */}
          <div style={{ paddingTop: "5px", color: "red" }}> {this.state.geoJsonMsg}</div>

          <React.Fragment >


            {objFeature && objFeature.geometry.coordinates[0] && (
              <div style={{ display: "inline-block" }}>

                {center && (
                  <Map
                    style="mapbox://styles/mapbox/streets-v9"
                    zoom={zoom}
                    onZoom={this.onMapZoom}
                    onClick={this.onMapClick}
                    onDragEnd={this.onDragEnd}
                    /* center={center}  */
                    center={center}
                    containerStyle={{
                      height: "300px",
                      width: "500px",
                    }}
                    fitBounds={mapBound}
                  >
                    <GeoJSONLayer key="key12" data={objData} linePaint={{ "line-color": "#888", "line-width": 8 }} />
                    {/* <Marker key={"start"} coordinates={startPoint}>
                      Start(0.00)
                    </Marker>
                    <Marker key={"end"} coordinates={endPoint}>
                      End({this.state.geoJsonLenMiles})
                  </Marker>*/}
                    <DrawControl onDrawCreate={this.onDrawCreate} controls={{ line_string: false, point: false, polygon: false, combine_features: false, uncombine_features: false, trash: false }} />
                  </Map>
                )}
                {!center && (

                  <Map
                    style="mapbox://styles/mapbox/streets-v9"
                    onZoom={this.onMapZoom}
                    //onClick={this.onMapClick}
                    onDragEnd={this.onDragEnd}
                    /* center={center}  */

                    containerStyle={{
                      height: "300px",
                      width: "500px",
                    }}
                    fitBounds={mapBound}
                  >
                    <GeoJSONLayer key="key1" data={objData} linePaint={{ "line-color": "#888", "line-width": 8 }} />
                    {/*<Marker key={"start"} coordinates={startPoint}>
                      Start(0.00)
                    </Marker>
                    <Marker key={"end"} coordinates={endPoint}>
                      End({this.state.geoJsonLenMiles})
                  </Marker>*/}
                    <DrawControl onDrawCreate={this.onDrawCreate} controls={{ line_string: false, point: false, polygon: false, combine_features: false, uncombine_features: false, trash: false }} />
                  </Map>
                )}
              </div>
            )}
          </React.Fragment >
        </div >
      );
    }
    
    return (

      <Modal
        contentClassName={themeService({ default: this.props.className, retro: "retroModal", electric: "electricModal" })
        }
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        style={{ maxWidth: "98vw" }}
      >
        {
          this.props.modalState === "Add" && (
            <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
              {languageService("Add New Asset")}
            </ModalHeader>
          )
        }
        {
          this.props.modalState === "Edit" && (
            <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
              {languageService("Edit Asset")}
            </ModalHeader>
          )
        }
        <ModalBody style={themeService(CommonModalStyle.body)}>
          {!(this.state.showImgGal || this.state.showDocsGal) && (
            <Row>
              <Col md={2}>
                <Row style={{ margin: "0px" }}>
                  <AssetImageArea
                    acctionBtn
                    imagesList={this.state.imageList}
                    showImageGallery={this.showImageGallery}
                    showImgaeSlider={this.showImageSlider}
                  />
                </Row>

                <AssetDocumentsArea acctionBtn documentList={this.state.documentList} addDocument={this.addDocumentHandle} />
              </Col>
              <Col md={10}>
                <Row>
                  <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Asset Attributes")} </ModalHeader>
                </Row>
                <Row>
                  <Col md={5}>
                    {this && this.props && this.props.parentAsset && this.props.parentAsset.unitId && this.props.parentAsset.assetType && (
                      <div style={themeService(formFeildStyle.feildStyle)}>
                        <label style={themeService(formFeildStyle.lblStyle)}>{languageService("Parent:")}</label>
                        {this.props.parentAsset.unitId + " (" + languageService(this.props.parentAsset.assetType) + ")"}
                      </div>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <div className={"commonform"}>
                      <FormFields commonFields={this.state.commonFields} fieldTitle={"commonFields"} change={this.updateFrom} />
                      {/*<FormFields
                       locationGPSFields={this.state.locationGPSFields}
                        fieldTitle={"locationGPSFields"}
                    change={this.updateFrom}
                      /> */}
                      {this.props.showMap && (
                        <div>
                          {/* osama */}
                          <div style={{ display: 'flex', marginTop: '5px', marginBottom: '5px' }}>
                            <label className="labelStyle">Location Type</label>
                            <select name="location_type" style={{ color: 'rgb(24, 61, 102)' }} onChange={e => this.manangeInspectionLocation(e)}>
                              <option selected>Select location type</option>
                              <option value="Located" selected={this.state.location_type == "Located" ? true : false}>Located</option>
                              <option value="Not Located" selected={this.state.location_type == "Not Located" ? true : false}>Not Located</option>
                            </select>
                            <br />
                          </div>

                          <div style={{ display: 'flex', marginTop: '10px', marginBottom: '5px' }}>
                            <label className="labelStyle">Longitude:</label>
                            <input type='text' style={{ color: 'rgb(24, 61, 102)' }} name="longitude" disabled={this.state.latlngFieldStatus} placeholder="longitude" value={this.state.longitude ? this.state.longitude : ''} onChange={this.manangeLongLatField} />
                          </div>
                          {this.state.longitudeErr == true && (<span style={{ color: 'red', fontSize: '12px', marginLeft: '30%' }}>Required</span>)}
                          <div style={{ display: 'flex', marginTop: "20px" }}>
                            <label className="labelStyle">Latititude:</label>
                            <input type='text' style={{ color: 'rgb(24, 61, 102)' }} name="latitude" disabled={this.state.latlngFieldStatus} placeholder="Latititude" value={this.state.latitude ? this.state.latitude : ''} onChange={e => this.manangeLongLatField(e)} />
                            <br />
                          </div>
                          {this.state.latitudeErr == true && (<span style={{ color: 'red', fontSize: '12px', marginLeft: '30%' }}>Required</span>)}

                          {this.state.submitCoordBtnStatus && (<div style={{ display: 'flex', marginTop: "15px" }}>
                            <Button type="submit" style={{ marginLeft: '30%' }} onClick={this.submitLatLong}>Submit coordinates</Button>
                          </div>)}
                          {!this.state.submitCoordBtnStatus && (<div style={{ display: 'flex', marginTop: "15px" }}>
                            <Button type="submit" style={{ marginLeft: '30%' }} onClick={this.submitLatLong}>Edit coordinates</Button>
                          </div>)}
                          <div>
                            {this.state.inspectionTypes && (
                              this.state.inspectionTypes.map((type) => {
                                if (type) {
                                  let { inspectionCheckboxes, assetIsInInspection } = this.state;
                                  let disable = this.state.location_type == "Not Located" ? true : this.props.modalState == "Add" && inspectionCheckboxes[type.opt1.checkBoxName] == false ? true : this.props.modalState == "Edit" && assetIsInInspection[type.description] && assetIsInInspection[type.description].flag == true ? true : false
                                  return (
                                    <div style={{ display: 'inline-grid', marginTop: '15px' }}>
                                      <div style={{ display: 'flex' }}>
                                        <div>
                                          <label className="div">{type.description ? type.description : ''} Inspection</label></div>
                                      </div>

                                      <input type="checkbox" disabled={!this.state.datesFormStatus ? true : assetIsInInspection[type.description] && assetIsInInspection[type.description].flag == true ? true : false} name={type.opt1 ? type.opt1.checkBoxName : ''} defaultValue={false} checked={this.state.inspectionCheckboxes[type.opt1.checkBoxName] ? true : false} data-label={type.opt1.lastInspFieldName} data-next={type.opt1.binding.nextInspFieldName} value={this.state.inspectionCheckboxes[type.opt1.checkBoxName]} onChange={e => this.manageInspectionCheckboxes(e)} />
                                      <div style={{ marginLeft: '10%' }}>

                                        <label className="div">Last Inspection Date</label>
                                        <div style={{ display: 'inline-flex' }}>
                                          <div style={{ display: 'inline-flex' }}>
                                            <input type='text' disabled={disable} style={{ color: 'rgb(24, 61, 102)' }} name={type.opt1.lastInspFieldName} placeholder="Last Inspection" value={this.state.inspectionDates[type.opt1.lastInspFieldName] ? moment(this.state.inspectionDates[type.opt1.lastInspFieldName]).format("MM/DD/YYYY") : ''} onChange={e => this.lastInspectionDatesManager(e, type)} />
                                            <input type='date' max={this.state.maxDate ? this.state.maxDate : null} disabled={disable} style={{ width: '43px' }} name={type.opt1.lastInspFieldName} placeholder="Last Inspection" value={this.state.inspectionDates[type.opt1.lastInspFieldName] ? moment(this.state.inspectionDates[type.opt1.lastInspFieldName]).format('YYYY-MM-DD') : ''} onChange={e => this.lastInspectionDatesManager(e, type)} />
                                          </div>
                                          <div>
                                            {assetIsInInspection[type.description] && assetIsInInspection[type.description].flag === true && (
                                              <label className="labelFieldsStyle">This Asset is Part of Inspection: <b>{assetIsInInspection[type.description].inspection_name}</b></label>
                                            )}
                                          </div>
                                        </div>
                                        <div>
                                          {this.state.location_type == "Located" && this.state.lastInspReq[type.opt1.lastInspFieldName] && (<span style={{ color: 'red', fontSize: '12px' }}>Required</span>)}
                                        </div>
                                        <div style={{ display: 'inline-grid' }}>
                                          <label className="div">Next Inspection Date</label>
                                          <div style={{ display: 'inline-flex' }}>
                                            <input type='text' disabled={disable} style={{ color: 'rgb(24, 61, 102)' }} name={type.opt1.nextInspFieldName} placeholder="Next Inspection" value={this.state.inspectionDates[type.opt1.nextInspFieldName] ? moment(this.state.inspectionDates[type.opt1.nextInspFieldName]).format("MM/DD/YYYY") : ''} onChange={e => this.nextInspectionDatesManager(e, type)} />
                                            <input min={this.state.minDate ? this.state.minDate : null} max={this.state.maxDate_Next ? this.state.maxDate_Next : null} type='date' disabled={disable} style={{ width: '43px' }} name={type.opt1.nextInspFieldName} placeholder="Next Inspection" value={this.state.inspectionDates[type.opt1.nextInspFieldName] ? moment(this.state.inspectionDates[type.opt1.nextInspFieldName]).format('YYYY-MM-DD') : ''} onChange={e => this.nextInspectionDatesManager(e, type)} />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>



                  </Col>
                  <Col md={!this.props.showMap ? 7 : 2}>
                    <div className="commonform add-assets">
                      {this.state.systemAttributes && (
                        <React.Fragment>
                          {/* <div style={{ display: "inline-block" }}>
                            <AssetTabs tabValue={"Lamp Attributes"} tabState={true} handleTabClick={() => {}} />
                          </div> */}
                          <FormFields
                            systemAttributes={this.state.systemAttributes}
                            fieldTitle={"systemAttributes"}
                            change={this.updateFrom}
                          />


                        </React.Fragment>
                      )}
                      {/*{this.state.timpsAttributes && (*/}
                      {/*<React.Fragment>*/}
                      {/*<div style={{ display: 'inline-block' }}>*/}
                      {/*<AssetTabs tabValue={"Timps Attributes"} tabState={true} handleTabClick={() => {}} />*/}
                      {/*</div>*/}
                      {/*<FormFields*/}
                      {/*timpsAttributes={this.state.timpsAttributes}*/}
                      {/*fieldTitle={"timpsAttributes"}*/}
                      {/*change={this.updateFrom} />*/}
                      {/*</React.Fragment>*/}
                      {/*)}*/}

                      {this.state.lampAttributes && (
                        <React.Fragment>
                          {/* <div style={{ display: "inline-block" }}>
                            <AssetTabs tabValue={"Lamp Attributes"} tabState={true} handleTabClick={() => {}} />
                          </div> */}
                          <FormFields lampAttributes={this.state.lampAttributes} fieldTitle={"lampAttributes"} change={this.updateFrom} />
                        </React.Fragment>
                      )}
                      {geoJsonDetails}
                    </div>
                  </Col>
                  {this.props.showMap && this.state.mapBound && (
                    <Col md={4}>
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{languageService('Location:')}  {this.props.selectedAsset ? languageService(this.props.selectedAsset.locationName) : ''}</p>
                        <Map
                          style="mapbox://styles/mapbox/streets-v9"
                          onZoom={this.onMapZoom}
                          onClick={this.onMapClick}
                          onDragEnd={this.onDragEnd}

                          containerStyle={{
                            height: "300px",
                            width: "500px"
                          }}
                          fitBounds={this.state.mapBound}
                        >
                          <GeoJSONLayer key="key13" data={objData} linePaint={{ "line-color": "#888", "line-width": 8 }} />
                          <DrawControl onDrawCreate={this.onDrawCreate} onDrawUpdate={this.onDrawUpdate} controls={{ line_string: false, point: true, polygon: false, combine_features: false, uncombine_features: false, trash: false }} />
                          {
                            this.state.markers && this.state.markers.length && (
                              this.state.markers.map((marker) => {
                                return (
                                  marker.map((mark) => {
                                    if (mark.assetsLocArray.length > 0) {
                                      let statusColor = findLocationTypeStatusColor(mark.location_type, mark.inspectionsStatus)
                                      return (
                                        <div>
                                          <Marker coordinates={[mark.assetsLocArray[0][0], mark.assetsLocArray[0][1]]} >
                                            <button
                                              style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusColor, border: "1px solid white" }}
                                              onClick={(e) => {
                                                console.log(e)
                                                this.setState({ popUpShow: "block" })
                                              }}
                                            >
                                            </button>
                                          </Marker>
                                          <Popup
                                            coordinates={[mark.assetsLocArray[0][0], mark.assetsLocArray[0][1]]} style={{ display: this.state.popUpShow }}
                                            offset={-50}
                                          >
                                            {mark ? mark.unitId : ''}
                                          </Popup>
                                        </div>
                                      )
                                    }
                                  })
                                )
                              }))
                          }
                          {

                            this.state.newPointOnMapArray.length > 0 && (
                              this.state.newPointOnMapArray.map((marker) => {
                                if (marker && this.state.location_type) {
                                  return (
                                    <Marker coordinates={[marker[0], marker[1]]} anchor="bottom">
                                      <div >
                                        <div style={{ marginTop: '1px', width: '10px', height: '10px', borderRadius: '50%', background: "#7DF9FF" }}></div>
                                      </div>
                                    </Marker>
                                  )
                                }
                              })
                            )
                          }
                        </Map>
                      </div>
                    </Col>
                  )}
                </Row>

              </Col>

            </Row>
          )}
          {this.state.showImgGal && (
            // <Modal isOpen={this.state.showImgGal}>
            <ImageGallery
              handleSave={this.addSelectedImage}
              handleCancel={this.cancelImageGallery}
              loadImgPath={"showAssetImgs"}
              customFolder={"assetImages"}
              uploadCustomPath={"uploadassetimage"}
              uploadImageAllow
            />
            // </Modal>
          )}

          {this.state.openAppFormAttrsDialog && (
            <AppFormCustomAttrs
              open={this.openEquipmentView}
              appFormAttributeList={[
                {
                  id: "nomenclature",
                  value: ["XB", "B12", "B24"],
                  allowedForms: ["battery"],
                },
                {
                  id: "cities",
                  value: ["Islamabad", "Lahore", "Rawalpindi"],
                  allowedForms: ["cityForm"],
                },
              ]}
              openCallback={this.openAppFormAttrsView}
              updateFormAttributesCallback={this.updateAppFormAttrsCallback}
            />
          )}

          {this.state.showDocsGal && (
            <DocumentGallery
              handleSave={this.addSelectedDocument}
              handleCancel={this.addDocumentHandle}
              loadDocumentPath={"showAssetDocuments"}
              customFolder={"assetDocuments"}
              uploadImageAllow
            />
          )}
          <ImageSlider
            imgSlider={this.state.imgSlider}
            imageDirectory={"assetImages"}
            images={this.state.imageList}
            initialIndex={this.state.selectedImageIndex}
            handleToggle={this.handleImageSliderClose}
          />
          {this.state.showBulkAdd && (
            <BulkAdd
              isOpen={this.state.showBulkAdd}
              toggle={this.bulkAddDisplayToggle}
              parentAsset={this.props.selectedAsset}
              assetTypes={this.props.assets && this.props.assets.assetsTypes ? this.props.assets.assetsTypes : this.props.assetTypes}
              bulkAddCallback={this.bulkAddCallback}
            />
          )}
        </ModalBody>
        {
          !(this.state.showImgGal || this.state.showDocsGal) && (
            <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
              {this.props.modalState === "Add" && (
                <MyButton
                  style={themeService(ButtonStyle.commonButton)}
                  type="submit"
                  onClick={this.handleSubmitAsset(FORM_SUBMIT_TYPES.ADD)}
                >
                  {languageService("Add")}
                </MyButton>
              )}
              {/*this.props.modalState === "Edit" && (
              <MyButton style={themeService(ButtonStyle.commonButton)} onClick={() => this.openAppFormAttrsView(true)}>
                {"App Form Attributes"}{" "}
              </MyButton>
            )*/}
              {this.props.modalState === "Edit" && (
                <MyButton
                  style={themeService(ButtonStyle.commonButton)}
                  type="submit"
                  onClick={this.handleSubmitAsset(FORM_SUBMIT_TYPES.EDIT)}
                >
                  {languageService("Update")}{" "}
                </MyButton>
              )}
              {/*  {this.props.modalState === "Edit" && permissionCheck("Asset Edit", "asset bulkadd") && (
              <MyButton style={themeService(ButtonStyle.commonButton)} type="button" onClick={this.handleBulkAdd}>
                {languageService("Import Children")}
              </MyButton>
            )}
            {this.props.modalState === "Edit" && permissionCheck("Asset Edit", "asset export") && (
              <MyButton style={themeService(ButtonStyle.commonButton)} type="button" onClick={this.handleExportChildren}>
                {languageService("Export Children")}
              </MyButton>
            )}
            */}
              <MyButton style={themeService(ButtonStyle.commonButton)} type="button" onClick={this.handleClose}>
                {languageService("Cancel")}
              </MyButton>
            </ModalFooter>
          )
        }
      </Modal >
    );
  }
}
let getAssetType = curdActions.getAssetType;

let actionOptions = {
  create: false,
  update: false,
  read: true,
  delete: false,
  others: { getAppMockupsTypes, getAssetType, createMultipleAssets },
};

let customAPICrud = [
  {
    name: "applookup",
    apiName: "applicationlookups",
  },
];
let AddAssetsContainer = CRUDFunction(AddAssets, "AddAsset", actionOptions, null, null, "asset", customAPICrud);
export default AddAssetsContainer;

const formFeildStyle = {
  feildStyle: {
    default: { fontSize: "12px" },
    retro: {
      marginBottom: "15px",
      fontSize: "12px",
    },
    electric: {
      marginBottom: "15px",
      fontSize: "12px",
    },
  },
  lblStyle: {
    default: {
      marginBottom: "5px",
      float: "left",
      fontSize: "14px",
      color: basicColors.first,
    },
    retro: {
      marginBottom: "5px",
      fontSize: "14px",
      fontWeight: "bold",
      color: retroColors.second,
      width: "30%",
    },
    electric: {
      marginBottom: "5px",
      fontSize: "14px",
      fontWeight: "bold",
      color: retroColors.second,
      width: "30%",
    },
  },
};
