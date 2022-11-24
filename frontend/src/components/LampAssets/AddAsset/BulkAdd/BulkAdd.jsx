import React, { Component } from "react";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { ModalStyles } from "components/Common/styles.js";
import FormFields from "../../../../wigets/forms/formFields";
import { languageService } from "../../../../Language/language.service";
import { readString } from "react-papaparse";
import "./styles.css";
import EditableTable from "components/Common/EditableTable";
import { Tooltip } from "reactstrap";

export default class BulkAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileCols: [],
      fileAttributes: ifileAttributes,
      importData: [],
      pageSize: 10,
      page: 0,
      importGPS: true,
      locationFields: locationFields,
      dataValid: false,
      tooltipOpen: false,
    };

    this.importData = [];
    this.updateFormChooseFile = this.updateFormChooseFile.bind(this);
    this.updateFromAttributes = this.updateFromAttributes.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handlePageSave = this.handlePageSave.bind(this);
    this.handleAddAssets = this.handleAddAssets.bind(this);
  }
  clearOptions(fields) {
    // clear all options
    for (let k in fields) {
      if (fields[k].element === "select") {
        fields[k].config.options = [];
      }
    }
  }
  handlePageSave(page, pageSize) {
    this.setState({
      page: page,
      pageSize: pageSize,
    });
  }
  updateFormChooseFile(newState, e) {
    // console.log('updateForm Callback:', newState, e);

    let fileAttributes = this.state.fileAttributes;
    let gpsAttributes = this.state.locationFields;

    this.clearOptions(fileAttributes);
    this.clearOptions(gpsAttributes);

    let reader = new FileReader();
    let file = e.target.files[0];
    if (!file) return;
    reader.onload = () => {
      try {
        let csvData = reader.result;
        //console.log('CSV data:', csvData);
        const results = readString(csvData);
        const cols = results.data[0];
        // console.log('cols:', cols);
        // console.log('Parse Results:', results);
        this.importData = results.data;

        this.setOptions(fileAttributes, cols);
        this.setOptions(locationFields, cols);

        this.setState({ fileCols: cols, fileAttributes: fileAttributes, locationFields: gpsAttributes });
      } catch (e) {
        console.log("Error reading file:", e);
      }
    };
    reader.readAsText(file);
  }
  setOptions(fields, options) {
    for (let k in fields) {
      if (fields[k].element === "select" && !fields[k].config.options.length) {
        fields[k].config.options = options.map((v, i) => {
          return { val: i, text: v };
        });
        if (!fields[k].value && fields[k].config.options.length) {
          fields[k].value = fields[k].config.options[0].val;
        }
      }
    }
  }

  updateFromAttributes(newState, e) {
    // console.log('form: new state:', newState);
    this.setState(newState);
  }
  validateAssetRecord(asset) {
    let parentAsset = this.props.parentAsset;
    let assetTypesList = this.props.assetTypes;
    let parentAssetType = assetTypesList.find((at) => {
      return at.assetType === parentAsset.assetType;
    });
    let validAssetTypesList =
      parentAssetType && parentAssetType.allowedAssetTypes && parentAssetType.allowedAssetTypes.length > 0
        ? parentAssetType.allowedAssetTypes
        : [];

    // verify asset type is valid (exists in list of asset types)
    let assetTypeValid =
      validAssetTypesList.find((at) => {
        return at === asset.assetType;
      }) !== undefined;
    // name must exist
    let nameExist = asset.hasOwnProperty("unitId") && typeof asset.unitId === "string" && asset.unitId !== "";
    // start, end are valid numbers representing milepost
    let startValid = asset.hasOwnProperty("start") && !isNaN(parseFloat(asset.start));
    let endValid = asset.hasOwnProperty("end") && !isNaN(parseFloat(asset.end));
    let message = {};
    if (!assetTypeValid) message.assetType = `AssetType: [${asset.assetType}] is invalid`;
    if (!nameExist) message.unitId = `name: [${asset.name}] is invalid`;
    if (!startValid) message.start = `start milepost [${asset.start}] is invalid`;
    if (!endValid) message.end = `end milepost [${asset.end}] is invalid`;

    return {
      valid: assetTypeValid && nameExist && startValid && endValid,
      highlightFlags: { assetType: !assetTypeValid, unitId: !nameExist, start: !startValid, end: !endValid },
      messages: message,
    };
  }
  handlePreview() {
    let skipfirstrow = this.state.fileAttributes.skipfirstrow.value;
    let ignoreEmptyRows = this.state.fileAttributes.ignoreEmptyRows.value;
    let idata = [];
    let importData = skipfirstrow ? this.importData.slice(1) : this.importData;
    let fileAttributes = this.state.fileAttributes,
      locationAttributes = this.state.locationFields;

    if (ignoreEmptyRows) {
      importData = importData.filter((d) => {
        let emptyRecord = true;

        for (let i = 0; i < d.length; i++) {
          if (!(d[i] === null || d[i] === undefined)) emptyRecord = emptyRecord && d[i].trim() === "";
        }

        return !emptyRecord;
      });
    }

    idata = importData.map((d, i) => {
      let latitude = this.state.importGPS && locationAttributes.latitude.touched ? d[locationAttributes.latitude.value] : 0;
      let longitude = this.state.importGPS && locationAttributes.longitude.touched ? d[locationAttributes.longitude.value] : 0;

      return {
        assetType: this.getMappedValue(fileAttributes, d, "assettype"),
        unitId: this.getMappedValue(fileAttributes, d, "name"),
        description: this.getMappedValue(fileAttributes, d, "description"),
        start: this.getMappedValue(fileAttributes, d, "mpstart"),
        end: this.getMappedValue(fileAttributes, d, "mpend"),
        parentAsset: this.props.parentAsset._id,
        lineId: this.props.parentAsset.lineId ? this.props.parentAsset.lineId : this.props.parentAsset._id,
        coordinates: this.state.importGPS ? [latitude, longitude] : [],
        index: i,
      };
    });
    let valid = true;
    let index = 0;

    for (let asset of idata) {
      let r = this.validateAssetRecord(asset);

      if (!r.valid) {
        valid = r.valid;
        asset.highlightFlags = r.highlightFlags;
        asset.messages = r.messages;
      }

      index++;
    }

    // if(!valid)
    // {
    //   console.log('Data not valid:', errorMessages);
    // }

    this.setState({ importData: idata, dataValid: valid, page: 0 });
  }

  getMappedValue(attributes, data, fieldName) {
    // let attributes = this.state.fileAttributes;
    let attributeMap = {
      assettype: attributes.assetType,
      name: attributes.name,
      description: attributes.description,
      mpstart: attributes.mpStart,
      mpend: attributes.mpEnd,
    };
    if (!attributeMap.hasOwnProperty(fieldName)) {
      console.log("getMappedValue: Invalid field name");
      return "N/A";
    }
    let field = attributeMap[fieldName];
    return data[field.value];
  }

  handleBack() {
    this && this.props && this.props.toggle && this.props.toggle();
  }
  handleAddAssets() {
    // console.log('Adding assets');
    if (this.props.bulkAddCallback) {
      // console.log('Calling bulkAddCallback');
      this.props.bulkAddCallback(this.state.importData);
      this.props.toggle();
    }
  }

  render() {
    let fileCols = this.state.fileCols;
    let fileAttributes = this.state.fileAttributes;

    return (
      <Modal
        contentClassName={themeService({ default: this.props.className, retro: "retroModal " + this.props.className })}
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        style={{ maxWidth: "80vw" }}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {languageService("Bulk Import Assets")}
        </ModalHeader>
        <ModalBody style={{ ...themeService(CommonModalStyle.body), minHeight: "500px" }}>
          <FormFields fileSelectAttributes={fileSelectAttributes} fieldTitle={"fileSelectAttributes"} change={this.updateFormChooseFile} />
          {fileCols && fileCols.length > 0 && (
            <Row>
              <Col md={3}>
                <h5>Select Columns:</h5>
                <Row>
                  <Col md={12}>
                    <FormFields fileAttributes={fileAttributes} fieldTitle={"fileAttributes"} change={this.updateFromAttributes} />
                  </Col>
                </Row>
                <label>GPS</label>
                <input
                  type="checkbox"
                  checked={this.state.importGPS}
                  onChange={(e) => {
                    this.setState({ importGPS: e.target.checked });
                  }}
                  style={{ marginLeft: "10px" }}
                  id="chkGPS"
                />
                {this.state.importGPS && (
                  <FormFields locationFields={this.state.locationFields} fieldTitle={"locationFields"} change={this.updateFromAttributes} />
                )}
              </Col>

              <Col md="9">
                {this.state.importData && this.state.importData.length > 0 && (
                  <EditableTable
                    columns={importAssetsColumns}
                    data={this.state.importData}
                    pageSize={this.state.pageSize}
                    pagination={true}
                    handlePageSave={this.handlePageSave}
                    page={this.state.page}
                  />
                )}
              </Col>
            </Row>
          )}
        </ModalBody>
        <ModalFooter style={{ ...ModalStyles.footerButtonsContainer, backgroundColor: "rgba(40, 61, 104, 0.3)" }}>
          <MyButton
            style={themeService(ButtonStyle.commonButton)}
            type="submit"
            onClick={this.handlePreview}
            disabled={this.state.fileCols.length === 0}
          >
            {languageService("Preview")}
          </MyButton>
          <MyButton
            style={themeService(ButtonStyle.commonButton)}
            type="submit"
            onClick={this.handleAddAssets}
            disabled={!this.state.dataValid}
          >
            {languageService("Import Assets")}
          </MyButton>
          <MyButton style={themeService(ButtonStyle.commonButton)} type="submit" onClick={this.handleBack}>
            {languageService("Cancel")}
          </MyButton>
        </ModalFooter>
      </Modal>
    );
  }
}

const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

const fileSelectAttributes = {
  csvFile: {
    element: "file",
    value: "",
    label: true,
    labelText: "CSV File",
    containerConfig: {
      col: 12,
    },
    config: {
      name: "csvFile",
      type: "file",
      placeholder: "",
    },
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
};
const ifileAttributes = {
  skipfirstrow: {
    element: "checkbox",
    value: true,
    label: true,
    labelText: "Skip first row",
    containerConfig: {},
    config: {
      name: "skipfirstrow",
      type: "checkbox",
      disabled: false,
    },
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  ignoreEmptyRows: {
    element: "checkbox",
    value: true,
    label: true,
    labelText: "Ignore Empty Rows",
    containerConfig: {},
    config: {
      name: "ignoreEmptyRows",
      type: "checkbox",
      disabled: false,
    },
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  assetType: {
    element: "select",
    value: 0,
    label: true,
    labelText: "Asset Type",
    containerConfig: {},
    config: {
      name: "assetType",
      type: "text",
      placeholder: "Asset Type",
      disabled: false,
      options: [],
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  name: {
    element: "select",
    value: 0,
    label: true,
    labelText: "Name",
    containerConfig: {},
    config: {
      name: "name",
      type: "text",
      placeholder: "",
      disabled: false,
      options: [],
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  description: {
    element: "select",
    value: 0,
    label: true,
    labelText: "Description",
    containerConfig: {},
    config: {
      name: "description",
      type: "text",
      placeholder: "Description",
      disabled: false,
      options: [],
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  mpStart: {
    element: "select",
    value: 0,
    label: true,
    labelText: "MP Start",
    containerConfig: {},
    config: {
      name: "mpStart",
      type: "text",
      placeholder: "",
      disabled: false,
      options: [],
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  mpEnd: {
    element: "select",
    value: 0,
    label: true,
    labelText: "MP End",
    containerConfig: {},
    config: {
      name: "mpEnd",
      type: "text",
      placeholder: "",
      disabled: false,
      options: [],
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
};
let locationFields = {
  latitude: {
    element: "select",
    value: 0,
    label: true,
    labelText: "Latitude",
    containerConfig: {},
    config: {
      name: "latitude",
      type: "text",
      placeholder: "",
      disabled: false,
      options: [],
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
  longitude: {
    element: "select",
    value: 0,
    label: true,
    labelText: "Longitude",
    containerConfig: {},
    config: {
      name: "longitude",
      type: "text",
      placeholder: "",
      disabled: false,
      options: [],
    },
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    validationMessage: "",
  },
};
class HighlightedCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
    };
  }
  render() {
    const d = this.props.data;
    const field = this.props.field;
    const displayValue =
      this.props.displayFunction && typeof this.props.displayFunction === "function" ? this.props.displayFunction(d[field]) : d[field];

    if (d.highlightFlags && d.highlightFlags[field]) {
      let selector = field + d.index;
      return (
        <div id={selector}>
          <span style={{ backgroundColor: "red" }}>{d[field] !== "" ? d[field] : "[invalid or empty] "}</span>
          <Tooltip
            target={selector}
            isOpen={this.state.tooltipOpen}
            toggle={() => {
              this.setState({ tooltipOpen: !this.state.tooltipOpen });
            }}
          >
            {d.messages[field]}
          </Tooltip>
        </div>
      );
    }

    return displayValue;
  }
}
let importAssetsColumns = [
  {
    id: "assetType",
    header: "Asset Type",
    field: "assetType",
    editable: false,
    type: "text",
    minWidth: 70,
    accessor: (d) => {
      return <HighlightedCell data={d} field={"assetType"} />;
    },
  },
  {
    id: "name",
    header: "Name",
    field: "unitId",
    editable: false,
    type: "text",
    minWidth: 100,
    accessor: (d) => {
      // if(d.highlightFlags && d.highlightFlags.name)
      //   d.highlightFlags.unitId = d.highlightFlags.name;

      return <HighlightedCell data={d} field={"unitId"} />;
    },
  },
  {
    id: "description",
    header: "Description",
    field: "description",
    editable: false,
    type: "text",
    minWidth: 150,
  },
  {
    id: "mpstart",
    header: "MP Start",
    field: "start",
    editable: false,
    type: "text",
    minWidth: 40,
    accessor: (d) => {
      return <HighlightedCell data={d} field={"start"} />;
    },
  },
  {
    id: "mpend",
    header: "MP End",
    field: "end",
    editable: false,
    type: "text",
    minWidth: 40,
    accessor: (d) => {
      return <HighlightedCell data={d} field={"end"} />;
    },
  },
  {
    id: "coordinates",
    header: "[lat, long]",
    field: "coordinates",
    editable: false,
    type: "text",
    minWidth: 120,
    accessor: (d) => {
      const displayFunction = (coordinates) => {
        return JSON.stringify(coordinates);
      };
      return <HighlightedCell data={d} field={"coordinates"} displayFunction={displayFunction} />;
    },
  },
];
