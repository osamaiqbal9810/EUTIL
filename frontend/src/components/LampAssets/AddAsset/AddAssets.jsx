/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { CRUDFunction } from "reduxCURD/container";
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import AssetImageArea from "./AssetImageArea";
import AssetDocumentsArea from "./AssetDocumentsArea";
import ImageGallery from "components/Common/ImageGallery/index";
import DocumentGallery from "components/Common/DocumentGallery/index";
// import AssetTypeFieldsTabs from "./AssetTypeFieldsTabs";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import _ from "lodash";
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
import ReactMapboxGl, { GeoJSONLayer, Marker } from "react-mapbox-gl";
import { getGeoJsonCoordinates, getGeoJsonStrCoordinates, validateGeoJsonStr } from "../../../utils/GISUtils";
import { basicColors, retroColors } from "style/basic/basicColors";
import permissionCheck from "../../../utils/permissionCheck";
import BulkAdd from "./BulkAdd/BulkAdd";
import { createMultipleAssets } from "reduxRelated/actions/assetHelperAction";

var Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidXNtYW5xdXJlc2hpIiwiYSI6ImNqdzlmNG0yazBpcHA0OHBkYmgyZHdyZjAifQ.2O9HKhWB6EG-OZk3g4zdOg",
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
      showBulkAdd: false
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
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.modalState !== prevProps.modalState && this.props.modalState == "Add") {
      let parentAsset = this.props.parentAsset ? this.props.parentAsset : this.props.plannableLocations[0];

      this.setAssetTypeField(parentAsset);

      // this.props.assets && this.props.assets.assetsTypes && this.props.takeAssetTypeFromAddAsset(this.props.assets.assetsTypes);
    }
    if (this.props.modalState !== prevProps.modalState && this.props.modalState == "Edit") {
      //this.geoJsonData = null;

      this.mapSelectedAssetToFormFields();
      /*       if (this.state.lampAttributes && this.state.lampAttributes.geoJsonCord && this.state.lampAttributes.geoJsonCord.value != "") {
        this.validateGeoJson();
      }
 */
    } else if (this.props.modalState == "Edit") {
      //console.log(this.state.commonFields.unitId.value);
      //console.log(prevState.commonFields.unitId.value);
      if (this.state.commonFields.unitId.value != prevState.commonFields.unitId.value) {
        //this.mapSelectedAssetToFormFields();
        this.validateGeoJson();
        //console.log(this.geoJsonData.name);
      }
    }

    // if ((this.state.lampAttributes && !prevState.lampAttributes) || this.state.lampAttributes &&
    //     this.state.lampAttributes.primaryTrack &&
    //     this.state.lampAttributes.primaryTrack.value !== prevState.lampAttributes.primaryTrack.value
    // ) {
    //    this.updatePrimaryTrackValidation();
    // }

    if (
      this.state.commonFields.lineId.value !== prevState.commonFields.lineId.value &&
      this.state.commonFields.assetType.value === "track"
    ) {
      this.updatePrimaryTrackValidation();
    }
  }
  updatePrimaryTrackValidation() {
    let lampAttributes = _.cloneDeep(this.state.lampAttributes);
    let isPrimaryTrack = this.checkIfPrimaryTrack(this.state.commonFields.lineId.value, this.props.assets.assetsList);

    if (this.state.commonFields.assetType.value === "track" && lampAttributes && lampAttributes.primaryTrack) {
      if (this.props.modalState === "Add") lampAttributes.primaryTrack.value = false;
      if (lampAttributes.primaryTrack.value) isPrimaryTrack = false;
      lampAttributes.primaryTrack.config.disabled = isPrimaryTrack;
      this.setState({ lampAttributes });
    }
  }
  checkIfPrimaryTrack(selectedLocation, assetList) {
    let filterListBySelectedLocation = assetList.filter(
      (al) => al.lineId === selectedLocation && al.assetType === "track" && al.attributes.primaryTrack,
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
      updatedCommonFields.lineId.value = this.props.selectedAsset.locationId;
      updatedCommonFields.lineId.config.disabled = true;
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
      let newField = createFieldFromTemplate(item.name, "", item.name);

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

            let newField = createFieldFromTemplate(key, "", key, template.value, template.order);

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
              newField.element = "select";
              newField.config.options = this.getList("SwitchNames", this.state.commonFields.lineId.value);
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
  getList(listName, lineId = null) {
    let retVal = [],
      emptyItem = { val: "    ", text: "    " };
    if (listName === "SwitchNames") {
      let assetsList = this.props.assets && this.props.assets.assetsList ? this.props.assets.assetsList : []; //this.props.assetsList;
      retVal = assetsList
        .filter((a) => {
          if (!lineId) return a.assetType == "Switch";
          else return a.assetType == "Switch" && lineId === a.lineId;
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

  handleSubmitAsset = (formType) => () => {
    let {
      commonFields,
      //    locationGPSFields,
      locationMilepostFields,
      imageList,
      lampAttributes,

      documentList,
      systemAttributes,
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

    let images = imageList.map((image) => ({ imgName: image }));
    if (formIsValid) {
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

      if (parseFloat(newState.start) <= parseFloat(newState.end)) {
        newState.assetLength = newState.end - newState.start;
      } else {
        this.setState({ milePostValidationError: languageService("Milepost start must be less than or equal to Milepost End") });
        return true;
      }

      this.props.handleSubmitForm(newState, formType);
    } else {
      this.setFormValidation(commonFields, "commonFields");
      this.setFormValidation(locationMilepostFields, "locationMilepostFields");

      if (systemAttributes) {
        this.setFormValidation(systemAttributes, "systemAttributes");
      }
      if (lampAttributes) {
        this.setFormValidation(lampAttributes, "lampAttributes");
      }
    }
  };

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
    this.setState({showBulkAdd: !this.state.showBulkAdd});
  }

  handleBulkAdd = () => {
    this.bulkAddDisplayToggle();
  }

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
        obj = JSON.parse(lampAttributes.geoJsonCord.value);
        this.geoJsonData = obj;
      } else if (this.geoJsonData) {
        obj = this.geoJsonData;
      } else {
        this.setState({ geoJsonLenMiles: "0.0", geoJsonLenKm: "0.0", geoJsonMsg: "", mapBound: null });
        this.geoJsonData = null;
        return;
      }
      //obj = this.geoJsonData;
      if (obj) {
        if (obj.features && obj.features[0]) {
          if (obj.features[0].geometry.type === "LineString") {
            let lineString = turf.lineString(obj.features[0].geometry.coordinates, { name: "l1" });
            let length = parseFloat(turf.length(lineString, { units: "miles" })).toFixed(2);
            let lengthKm = parseFloat(turf.length(lineString, { units: "kilometers" })).toFixed(2);
            let fitBound = this.getBounds(obj.features[0].geometry.coordinates);
            this.setState({ geoJsonLenMiles: length, geoJsonLenKm: lengthKm, geoJsonMsg: "", mapBound: fitBound });
          } else {
            this.setState({ geoJsonLenMiles: "0.0", geoJsonLenKm: "0.0", geoJsonMsg: "Invalid GeoJson Line Type", mapBound: null });
          }
        } else {
          this.setState({ geoJsonLenMiles: "0.0", geoJsonLenKm: "0.0", geoJsonMsg: "Invalid GeoJson Data", mapBound: null });
        }
      }
    } catch (err) {
      this.setState({ geoJsonLenMiles: "0.0", geoJsonLenKm: "0.0", geoJsonMsg: "Error Loading GeoJson Data", mapBound: null });
    }
  };
  updateFrom = (newState, e) => {
    if (newState.commonFields && this.state.commonFields) {
      this.state.commonFields.assetType.value !== newState.commonFields.assetType.value &&
        this.updateAssetTypeOption(newState.commonFields.assetType.value);

      if (this.state.commonFields.lineId.value !== newState.commonFields.lineId.value) {
        let updatedLocationMilepostFields = _.cloneDeep(locationMilepostFields);
        let assetsList = this.props.assets && this.props.assets.assetsList ? this.props.assets.assetsList : this.props.assetsList;
        let parentAsset = assetsList.find((a) => {
          return a._id === newState.commonFields.lineId.value;
        });
        // console.log('parentasset ', parentAsset.start, parentAsset.end);
        updatedLocationMilepostFields = this.addLineLimitsToCaptionsAndValidations(parentAsset, updatedLocationMilepostFields);

        let additionalFields = _.cloneDeep(this.state.lampAttributes);
        for (let key in additionalFields) {
          if (key === "Marker Start" || key === "Marker End") {
            let field = additionalFields[key];
            field.config.options = this.getList("SwitchNames", newState.commonFields.lineId.value);
          }
        }

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
      this.setState({ mapBound: null, mapCenter: mapCenter });
    }
    this.setState({ zoom: [map.getZoom()] });
    //console.log(e);
  };
  onMapClick = (map, e) => {
    const mapCenter = map.getCenter();
    this.setState({ mapBound: null, mapCenter: mapCenter });
    //console.log(e);
  };
  onDragEnd = (map, e) => {
    const mapCenter = map.getCenter();
    this.setState({ mapBound: null, mapCenter: mapCenter });
  };
  render() {
    //console.log(this.props.assetTypes);
    const { mapBound, mapCenter, zoom } = this.state;
    const center = mapBound ? null : mapCenter;
    let geoJsonDetails = this.state.lampAttributes && this.state.lampAttributes.geoJsonCord && (
      <div style={{ marginTop: "5px", fontSize: "12px", backgroundColor: "white", padding: "10px" }}>
        <div>
          {languageService("Total Length Miles")}: {this.state.geoJsonLenMiles}{" "}
        </div>
        <div>
          {languageService("Total Length Km")} : {this.state.geoJsonLenKm}
        </div>
        <div style={{ paddingTop: "5px", color: "red" }}> {this.state.geoJsonMsg}</div>
      </div>
    );

    if (this.state.lampAttributes && this.state.lampAttributes.geoJsonCord && this.state.geoJsonLenMiles && this.geoJsonData) {
      let objData = this.geoJsonData;
      let objFeature = objData.features && objData.features[0] ? objData.features[0] : null;
      let startPoint = objFeature.geometry.coordinates[0];
      let endPoint = objFeature.geometry.coordinates[objFeature.geometry.coordinates.length - 1];
      //let aryBounds = this.getBounds(objFeature.geometry.coordinates);
      geoJsonDetails = (
        <div style={{ marginTop: "5px", fontSize: "12px", backgroundColor: "white", padding: "10px" }}>
          <div>
            {languageService("Total Length Miles")}: {this.state.geoJsonLenMiles}{" "}
          </div>
          <div>
            {"Total Length Km"} : {this.state.geoJsonLenKm}
          </div>
          <div style={{ paddingTop: "5px", color: "red" }}> {this.state.geoJsonMsg}</div>
          <button onClick={this.reverseGeoJson}>{languageService("Reverse")}</button>
          <React.Fragment>
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
                    <GeoJSONLayer key="key1" data={objData} linePaint={{ "line-color": "#888", "line-width": 8 }} />
                    <Marker key={"start"} coordinates={startPoint}>
                      Start(0.00)
                    </Marker>
                    <Marker key={"end"} coordinates={endPoint}>
                      End({this.state.geoJsonLenMiles})
                    </Marker>
                  </Map>
                )}
                {!center && (
                  <Map
                    style="mapbox://styles/mapbox/streets-v9"
                    onZoom={this.onMapZoom}
                    onClick={this.onMapClick}
                    onDragEnd={this.onDragEnd}
                    /* center={center}  */

                    containerStyle={{
                      height: "300px",
                      width: "500px",
                    }}
                    fitBounds={mapBound}
                  >
                    <GeoJSONLayer key="key1" data={objData} linePaint={{ "line-color": "#888", "line-width": 8 }} />
                    <Marker key={"start"} coordinates={startPoint}>
                      Start(0.00)
                    </Marker>
                    <Marker key={"end"} coordinates={endPoint}>
                      End({this.state.geoJsonLenMiles})
                    </Marker>
                  </Map>
                )}
              </div>
            )}
          </React.Fragment>
        </div>
      );
    }

    return (
      <Modal
        contentClassName={themeService({ default: this.props.className, retro: "retroModal" })}
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        style={{ maxWidth: "98vw" }}
      >
        {this.props.modalState === "Add" && (
          <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
            {languageService("Add New Asset")}
          </ModalHeader>
        )}
        {this.props.modalState === "Edit" && (
          <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
            {languageService("Edit Asset")}
          </ModalHeader>
        )}
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
                        {this.props.parentAsset.unitId + " (" + this.props.parentAsset.assetType + ")"}
                      </div>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={5}>
                    <div className={"commonform"}>
                      <FormFields commonFields={this.state.commonFields} fieldTitle={"commonFields"} change={this.updateFrom} />

                      {/* <FormFields
                        locationGPSFields={this.state.locationGPSFields}
                        fieldTitle={"locationGPSFields"}
                        change={this.updateFrom}
                      /> */}

                      <FormFields
                        locationMilepostFields={this.state.locationMilepostFields}
                        fieldTitle={"locationMilepostFields"}
                        change={this.updateFrom}
                      />
                    </div>

                    {this.state.milePostValidationError && (
                      <div style={{ marginTop: "5px", fontSize: "12px", color: "rgb(157, 7, 7)" }}>
                        <span>{this.state.milePostValidationError}</span>
                      </div>
                    )}
                  </Col>
                  <Col md={5}>
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
            <BulkAdd isOpen={this.state.showBulkAdd} 
              toggle={this.bulkAddDisplayToggle} 
              parentAsset={this.props.selectedAsset}  
              assetTypes={ this.props.assets && this.props.assets.assetsTypes ? this.props.assets.assetsTypes : this.props.assetTypes}
              bulkAddCallback={this.bulkAddCallback} />
          )}
        </ModalBody>
        {!(this.state.showImgGal || this.state.showDocsGal) && (
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
            {this.props.modalState === "Edit" && (
              <MyButton
                style={themeService(ButtonStyle.commonButton)}
                type="submit"
                onClick={this.handleSubmitAsset(FORM_SUBMIT_TYPES.EDIT)}
              >
                {languageService("Update")}{" "}
              </MyButton>
            )}
            {this.props.modalState === "Edit" && permissionCheck("Asset Edit", "asset bulkadd") && (
              <MyButton style={themeService(ButtonStyle.commonButton)} type="button" onClick={this.handleBulkAdd}>Import Children...</MyButton>
            )}
            <MyButton style={themeService(ButtonStyle.commonButton)} type="button" onClick={this.handleClose}>
              {languageService("Cancel")}
            </MyButton>
          </ModalFooter>
        )}
      </Modal>
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

let AddAssetsContainer = CRUDFunction(AddAssets, "AddAsset", actionOptions);
export default AddAssetsContainer;

const formFeildStyle = {
  feildStyle: {
    default: { fontSize: "12px" },
    retro: {
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
  },
};
