import React, { Component } from "react";
import _ from 'lodash';
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { themeService } from "../../theme/service/activeTheme.service";
import { ModalStyles } from "components/Common/styles.js";
import FormFields from "../../wigets/forms/formFields";
import { languageService } from "../../Language/language.service";
import { readString } from "react-papaparse";
import "./styles.css";
import EditableTable from "components/Common/EditableTable";
import { Tooltip } from "reactstrap";

export default class ATIVImporter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileCols: [],
      fileAttributes: ifileAttributes,
      importData: [],
      pageSize: 10,
      page: 0,
      dataValid: false,
      tooltipOpen: false
    };
    this.columns = _.cloneDeep(importAtivColumns);
    this.importData = [];
    this.updateFormChooseFile = this.updateFormChooseFile.bind(this);
    this.updateFromAttributes = this.updateFromAttributes.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handlePageSave = this.handlePageSave.bind(this);
    this.handleAddAtivData = this.handleAddAtivData.bind(this);
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
    
    this.clearOptions(fileAttributes);

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

        this.setState({ fileCols: cols, fileAttributes: fileAttributes, importData:[] });
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
  validateAtivRecord(ativRecord) {
    
    // verify title exists
    let titleValid = ativRecord && ativRecord.hasOwnProperty('title') && typeof ativRecord.title === 'string' && ativRecord.title !=='';
    let milepostValid = ativRecord.hasOwnProperty('milepost') && !isNaN(parseFloat(ativRecord.milepost));
    let latitudeValid = ativRecord.hasOwnProperty('latitude') && !isNaN(parseFloat(ativRecord.latitude));
    let longitudeValid = ativRecord.hasOwnProperty('longitude') && !isNaN(parseFloat(ativRecord.longitude));

    let message = {};
    if (!titleValid) message.title = `title: [${ativRecord.title}] is not valid.`;
    if (!milepostValid) message.milepost = `milepost:[${ativRecord.milepost}] is not valid.`;
    if (!latitudeValid) message.latitude = `latitude:[${ativRecord.latitude}] is not valid.`;
    if (!longitudeValid) message.longitude = `longitude:[${ativRecord.longitude}] is not valid.`;

    return {
      valid: titleValid && milepostValid && latitudeValid && longitudeValid,
      highlightFlags: { title: !titleValid, milepost: !milepostValid, latitude: !latitudeValid, longitude: !longitudeValid  },
      messages: message,
    };
  }
  handlePreview() {
    let skipfirstrow = this.state.fileAttributes.skipfirstrow.value;
    let ignoreEmptyRows = this.state.fileAttributes.ignoreEmptyRows.value;
    let idata = [];
    let columnData = this.importData[0].map((v) => {
      return v;
    });
    let importData = skipfirstrow ? this.importData.slice(1) : this.importData;
    let fileAttributes = this.state.fileAttributes,
      locationAttributes = this.state.locationFields;
    let notImportedCols = [];
    this.columns = _.cloneDeep(importAtivColumns);

    // console.log(columnData, fileAttributes, importData);
    if (ignoreEmptyRows) {
      importData = importData.filter((d) => {
        let emptyRecord = true;

        for (let i = 0; i < d.length; i++) {
          if (!(d[i] === null || d[i] === undefined)) emptyRecord = emptyRecord && d[i].trim() === "";
        }

        return !emptyRecord;
      });
    }
    
      // get columns not selected for import
      let importedCols = [];
      for (let fileAttributeKey in fileAttributes) {
        let fileAttribute = fileAttributes[fileAttributeKey];
        if (fileAttribute.element === "select" && !notImportedCols.includes(fileAttribute.value)) importedCols.push(fileAttribute.value);
      }
      for (let i = 0; i < columnData.length; i++) if (!importedCols.includes(i + "")) notImportedCols.push(i);
      // console.log('Not imported indexes:', notImportedCols);

    idata = importData.map((d, i) => {
      let latitude = fileAttributes.latitude.touched ? d[fileAttributes.latitude.value] : 0;
      let longitude = fileAttributes.longitude.touched ? d[fileAttributes.longitude.value] : 0;
      let remainingObject = {};

      // store additional columns in a separate object
        for (let nicIndex = 0; nicIndex < notImportedCols.length; nicIndex++) {
          let index = notImportedCols[nicIndex];
          let fieldName = columnData[index],
            fieldLevel = fieldName.split(".");
          
          let fieldValue = d[index];

            remainingObject[fieldName] = fieldValue;
      
          let addColumn = fieldName;

          if (
            !this.columns.find((iac) => {
              return iac.id === addColumn;
            })
          )
            this.columns.push({
              id: addColumn,
              header: addColumn,
              field: `properties.${addColumn}`,
              editable: false,
              type: "text",
              minWidth: 150,
              accessor: (d) => {
                const val = d['properties'][addColumn];
                if (typeof val === "object") return JSON.stringify(val);

                return val;
              },
            });
        }
      

      return {
        timestamp: new Date(),
        title: this.getMappedValue(fileAttributes, d, "title"),
        milepost: this.getMappedValue(fileAttributes, d, "milepost"),
        latitude: latitude,
        longitude: longitude,
        index: i,
        properties: remainingObject,
      };
    });
    let valid = true;
    let index = 0;

    for (let ativRecord of idata) {
      let r = this.validateAtivRecord(ativRecord);

      if (!r.valid) {
        valid = r.valid;
        ativRecord.highlightFlags = r.highlightFlags;
        ativRecord.messages = r.messages;
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
      title: attributes.title,
      milepost: attributes.milepost, 
      latitude: attributes.latitude,
      longitude: attributes.longitude
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
  handleAddAtivData() {
    if (this.props.importCallback) {
      this.props.importCallback(this.state.importData);
      this.props.toggle();
    }
  }

  render() {
    let fileCols = this.state.fileCols;
    let fileAttributes = this.state.fileAttributes;

    return (
      <Modal
        contentClassName={themeService({
          default: this.props.className,
          retro: "retroModal " + this.props.className,
          electric: "electricModal " + this.props.className,
        })}
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        style={{ maxWidth: "80vw" }}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {languageService("Import From ATIV CSV File")}
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
                </Col>
              <Col md="9">
                {this.state.importData && this.state.importData.length > 0 && (
                  <EditableTable
                    columns={this.columns}
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
        <ModalFooter style={{ ...ModalStyles.footerButtonsContainer, backgroundColor: "var(--nine)" }}>
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
            onClick={this.handleAddAtivData}
            disabled={!this.state.dataValid}
          >
            {languageService("Import Ativ Data")}
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
  milepost: {
    element: "select",
    value: 0,
    label: true,
    labelText: "Milepost",
    containerConfig: {},
    config: {
      name: "milepost",
      type: "text",
      placeholder: "Milepost",
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
  title: {
    element: "select",
    value: 0,
    label: true,
    labelText: "Title",
    containerConfig: {},
    config: {
      name: "title",
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
  }
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
    const value = typeof d[field] === 'object' ? d[field] + "" : d[field];

    const displayValue =
      this.props.displayFunction && typeof this.props.displayFunction === "function" ? this.props.displayFunction(d[field]) : value;

    if (d.highlightFlags && d.highlightFlags[field]) {
      let selector = field + d.index;
      return (
        <div id={selector}>
          <span style={{ backgroundColor: "red" }}>{value !== "" ? value : "[invalid or empty] "}</span>
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
let importAtivColumns = [
  {
    id: "timestamp",
    header: "Time",
    field: "timestamp",
    editable: false,
    type: "timestamp",
    minWidth: 170,
    accessor: (d) => {
      return <HighlightedCell data={d} field={"timestamp"} />;
    },
  },
  {
    id: "title",
    header: "Title",
    field: "title",
    editable: false,
    type: "text",
    minWidth: 170,
    accessor: (d) => {
      // if(d.highlightFlags && d.highlightFlags.name)
      //   d.highlightFlags.unitId = d.highlightFlags.name;

      return <HighlightedCell data={d} field={"title"} />;
    },
  },
  {
    id: "milepost",
    header: "Milepost",
    field: "milepost",
    editable: false,
    type: "text",
    minWidth: 80,
     accessor: (d) => {
        return <HighlightedCell data={d} field={"milepost"} />;
    },
  },
  {
    id: "latitude",
    header: "Latitude",
    field: "latitude",
    editable: false,
    type: "text",
    minWidth: 100,
    accessor: (d) => {
      return <HighlightedCell data={d} field={"latitude"} />;
    },
  },
  {
    id: "longitude",
    header: "Longitude",
    field: "longitude",
    editable: false,
    type: "text",
    minWidth: 100,
    accessor: (d) => {
      return <HighlightedCell data={d} field={"longitude"} />;
    },
  },
  // {
  //   id: "coordinates",
  //   header: "[lat, long]",
  //   field: "coordinates",
  //   editable: false,
  //   type: "text",
  //   minWidth: 120,
  //   accessor: (d) => {
  //     const displayFunction = (coordinates) => {
  //       return JSON.stringify(coordinates);
  //     };
  //     return <HighlightedCell data={d} field={"coordinates"} displayFunction={displayFunction} />;
  //   },
  // },
];
