/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { CRUDFunction } from "reduxCURD/container";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import { curdActions } from "reduxCURD/actions";
import _ from "lodash";
import Switch from "react-switch";
import { languageService } from "../../../../Language/language.service";
import { retroColors } from "../../../../style/basic/basicColors";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

const MyButtonDisabled = (props) => (
  <button className="disabledButton" disabled {...props}>
    {props.children}
  </button>
);
class ResponseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAssetTypeForm: {},
      currentAssetTypeName: "",
      unitOfTask: 0,
      prevButton: true,
      nextButton: true,
      prevFormIndex: 0,
      nextFormIndex: 0,
      useParentForm: false,
    };
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.getAppSettings = this.getAppSettings.bind(this);
    this.checkFormExistsInUnit = this.checkFormExistsInUnit.bind(this);
    this.getUnitsAssetType = this.getUnitsAssetType.bind(this);
  }

  componentDidMount() {
    if (this.props.assetTypes.length > 0) {
      this.handleIndexOfUnit();
    } else {
      this.props.getAssetType();
    }
    if (this.props.appSettings.length == 0) {
      this.props.getAppMockupsTypes("AppSettings");
    } else {
      this.getAppSettings();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.task.taskId !== prevProps.task.taskId) {
      if (this.props.assetTypes.length > 0) {
        this.handleIndexOfUnit();
      }
    }
    if (
      this.props.assetTypeActionType == "ASSETTYPES_READ_SUCCESS" &&
      this.props.assetTypeActionType !== prevProps.assetTypeActionType &&
      this.props.assetTypes
    ) {
      if (this.props.taskId) {
        this.handleIndexOfUnit();
      }
    }
    if (
      prevProps.diagnosticsActionType !== this.props.diagnosticsActionType &&
      this.props.diagnosticsActionType == "GET_APPSETTINS_DATA_SUCCESS"
    ) {
      this.getAppSettings();
    }
  }
  getAppSettings() {
    let result = _.find(this.props.appSettings, { code: "useParentForm" });
    if (result) {
      if (result.description === "1") {
        this.setState({ useParentForm: true });
      }
    }
  }
  getUnitsAssetType(unit) {
    let parentAssetType = undefined;
    let parentFormExists = false;
    if (unit.parent_id && this.state.useParentForm) {
      let parentUnit = _.find(this.props.task.units, { id: unit.parent_id });
      if (parentUnit) {
        parentAssetType = _.find(this.props.assetTypes, { assetType: parentUnit.assetType });
        parentFormExists = this.checkFormExistInAssetType(parentAssetType);
      }
    }
    let _result = _.find(this.props.assetTypes, { assetType: unit.assetType });
    let formExist = this.checkFormExistInAssetType(_result);

    return formExist ? _result : parentFormExists ? parentAssetType : _result;
  }
  checkFormExistsInUnit(unit) {
    let parentFormExists = false;
    if (unit.parent_id && this.state.useParentForm) {
      let parentUnit = _.find(this.props.task.units, { id: unit.parent_id });
      if (parentUnit) {
        let result = _.find(this.props.assetTypes, { assetType: parentUnit.assetType });
        parentFormExists = this.checkFormExistInAssetType(result);
      }
    }
    let _result = _.find(this.props.assetTypes, { assetType: unit.assetType });
    let formExist = this.checkFormExistInAssetType(_result);
    return formExist || parentFormExists;
  }
  handleIndexOfUnit() {
    let check = false;
    if (this.props.task.units) {
      this.props.task.units.forEach((unit, index) => {
        let result = _.find(this.props.assetTypes, { assetType: unit.assetType });
        //let formExist = this.checkFormExistInAssetType(result);
        let formExist = this.checkFormExistsInUnit(unit);
        if (result) {
          if (formExist) {
            if (!check) {
              this.handleFindUnit(index);
              check = true;
            }
          }
        }
      });
    }
    if (!check) {
      this.setState({
        currentAssetTypeName: languageService("No Form Exist"),
        currentAssetTypeForm: {},
        unitOfTask: 0,
        prevButton: false,
        nextButton: false,
        prevFormIndex: 0,
        nextFormIndex: 0,
      });
    }
  }

  handlePrev() {
    let currentUnit = this.state.unitOfTask;
    if (currentUnit > 0) {
      this.handleFindUnit(this.state.prevFormIndex);
    }
  }

  checkPrevUnitFormExist(currentIndex) {
    let prevIndexFinal = currentIndex;
    if (currentIndex > 0) {
      let found = false;
      while (found === false && prevIndexFinal >= 1) {
        prevIndexFinal = prevIndexFinal - 1;
        let result = _.find(this.props.assetTypes, { assetType: this.props.task.units[prevIndexFinal].assetType });

        if (result) {
          let formExist = this.checkFormExistInAssetType(result);
          formExist = this.checkFormExistsInUnit(this.props.task.units[prevIndexFinal]);
          if (formExist) {
            found = true;
            this.setState({
              prevFormIndex: prevIndexFinal,
              prevButton: true,
            });
          }
        }
      }
      if (!found) {
        this.setPrevButtonFalse();
      }
    } else {
      this.setPrevButtonFalse();
    }
  }

  checkFormExistInAssetType(assetType) {
    let check = false;
    if (assetType) {
      if (assetType.inspectionFormsObj) {
        check = true;
      } else if (assetType.inspectionForms) {
        //JSON.parse(assetType.inspectionForms);
        //check = true;
      }
    }
    return check;
  }

  handleNext() {
    let currentUnit = this.state.unitOfTask;
    if (currentUnit < this.props.task.units.length - 1) {
      this.handleFindUnit(this.state.nextFormIndex);
    }
  }
  checkNextUnitFormExist(currentIndex) {
    let nextIndexFinal = currentIndex;
    if (currentIndex < this.props.task.units.length - 1) {
      let found = false;
      while (found === false && nextIndexFinal <= this.props.task.units.length - 2) {
        nextIndexFinal = nextIndexFinal + 1;
        let result = _.find(this.props.assetTypes, { assetType: this.props.task.units[nextIndexFinal].assetType });
        if (result) {
          let formExist = this.checkFormExistInAssetType(result);
          formExist = this.checkFormExistsInUnit(this.props.task.units[nextIndexFinal]);
          if (formExist) {
            found = true;
            this.setState({
              nextFormIndex: nextIndexFinal,
              nextButton: true,
            });
          }
        }
      }
      if (!found) {
        this.setNextButtonFalse();
      }
    } else {
      this.setNextButtonFalse();
    }
  }
  setPrevButtonFalse() {
    this.setState({
      prevButton: false,
    });
  }
  setNextButtonFalse() {
    this.setState({
      nextButton: false,
    });
  }

  handleFindUnit(unitIndex) {
    if (this.props.task.units) {
      //  let result = _.find(this.props.assetTypes, { assetType: this.props.task.units[unitIndex].assetType });
      let result = this.getUnitsAssetType(this.props.task.units[unitIndex]);
      if (result) {
        //if (result.inspectionForms || result.inspectionFormsObj) {
        if (result.inspectionFormsObj) {
          let form_sel = this.props.task.units[unitIndex]["form-sel"];

          let opt1_Orig = result.inspectionFormsObj ? result.inspectionFormsObj : JSON.parse(result.inspectionForms);

          //let opt1_Orig = JSON.parse(result.inspectionForms);
          let opt1 = _.cloneDeep(opt1_Orig);
          if (form_sel) {
            let formKeys = Object.keys(form_sel);
            if (opt1.fields) {
              opt1.fields.forEach((field) => {
                field.data.forEach((row) => {
                  let elements = row.elements;
                  formKeys.forEach((key) => {
                    if (elements.length == 3) {
                      let formKeyString = form_sel[key].toString().toLowerCase();
                      if (elements[2].tag == key && (formKeyString == "true" || formKeyString == "false")) {
                        elements[0].value = true;
                        elements[2].value = formKeyString == "true" ? true : false;
                      }
                    } else {
                      if (elements[0].tag == key) {
                        elements[0].description = form_sel[key];
                      }
                      if (elements[1].tag == key) {
                        elements[1].description = form_sel[key];
                      }
                    }
                  });
                });
              });
            }
          }
          this.setState({
            currentAssetTypeForm: opt1,
            currentAssetTypeName: result.assetType + " - " + this.props.task.units[unitIndex].unitId,
            unitOfTask: unitIndex,
          });
          this.checkPrevUnitFormExist(unitIndex);
          this.checkNextUnitFormExist(unitIndex);
        }
        // if (this.props.task.units.length == 1) {
        //   this.setState({
        //     nextButton: false,
        //     prevButton: false
        //   })
        // } else if (unitIndex == 0) {
        //   this.setPrevButtonFalse()
        // } else if (unitIndex == this.props.task.units.length - 1) {
        //   this.setNextButtonFalse()
        // } else {
        //   // this.setState({
        //   //   nextButton: true,
        //   //   prevButton: true
        //   // })
        // }
      } else {
        this.setState({
          prevButton: false,
          nextButton: false,
        });
      }
    }
  }

  render() {
    let forms = null;

    // if (this.props.assetTypes.length > 0) {
    //   let opt1 = this.props.assetTypes[1].opt1
    //   let json = JSON.parse(opt1)

    // }
    let headingsToshow = false;
    if (this.state.currentAssetTypeForm.headings) {
      headingsToshow = this.state.currentAssetTypeForm.headings.visible ? true : false;
    }
    let nameExist = this.state.currentAssetTypeForm.name ? true : false;
    if (this.state.currentAssetTypeForm.fields) {
      forms = this.state.currentAssetTypeForm.fields.map((field, index) => {
        return (
          <ResponseFormFieldArea key={index} field={field} headings={headingsToshow ? this.state.currentAssetTypeForm.headings : null} />
        );
      });
    }
    let prevButton = this.state.prevButton ? (
      <MyButton onClick={this.handlePrev} style={themeService(ButtonStyle.commonButton)}>
        {languageService("Previous")}{" "}
      </MyButton>
    ) : (
      <MyButtonDisabled onClick={(e) => {}}>{languageService("Previous")} </MyButtonDisabled>
    );
    let nextButton = this.state.nextButton ? (
      <MyButton onClick={this.handleNext} style={themeService(ButtonStyle.commonButton)}>
        {languageService("Next")}{" "}
      </MyButton>
    ) : (
      <MyButtonDisabled onClick={(e) => {}}>{languageService("Next")} </MyButtonDisabled>
    );

    return (
      <Modal
        contentClassName={themeService({ default: this.props.className, retro: "retroModal" })}
        isOpen={this.props.modal}
        toggle={this.props.toggle}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {this.state.currentAssetTypeName}
        </ModalHeader>
        <ModalBody style={themeService(CommonModalStyle.body)}>
          {nameExist && (
            <div
              style={themeService({
                default: {
                  color: "rgba(64, 118, 179)",
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "15px",
                  borderBottom: "1px solid grey",
                  paddingBottom: "10px",
                },
                retro: {
                  color: retroColors.second,
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "15px",
                  borderBottom: "1px solid grey",
                  paddingBottom: "10px",
                },
              })}
            >
              {this.state.currentAssetTypeForm.name}{" "}
            </div>
          )}
          <div className="form-wrapper scrollbarHor">{forms}</div>
        </ModalBody>
        <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          {prevButton}
          <MyButton onClick={this.props.handleClose} style={themeService(ButtonStyle.commonButton)}>
            {languageService("Close")}{" "}
          </MyButton>
          {nextButton}
        </ModalFooter>
      </Modal>
    );
  }
}

let variables = {
  diagnosticsReducer: {
    assetTypes: [],
    appSettings: [],
  },
  assetTypeReducer: {
    assetTypes: [],
  },
};
let getAssetType = curdActions.getAssetType;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getAppMockupsTypes, getAssetType },
};
let ResponseFormContainer = CRUDFunction(ResponseForm, "ResponseFormObj", actionOptions, variables, [
  "diagnosticsReducer",
  "assetTypeReducer",
]);
export default ResponseFormContainer;

class ResponseFormFieldArea extends Component {
  render() {
    let row = null;
    if (this.props.field.data) {
      row = this.props.field.data.map((row, index) => {
        return <FieldRowData key={row.id} data={row} headings={this.props.headings} />;
      });
    }
    return (
      <div
        style={themeService({ default: { fontSize: "12px", color: "rgba(64, 118, 179)" }, retro: { fontSize: "12px", color: retroColors.second } })}
      >
        <div style={{ fontWeight: "700", fontSize: "14px", paddingLeft: "5px" }}> {languageService(this.props.field.title)}</div>
        {row}
      </div>
    );
  }
}

class FieldRowData extends Component {
  render() {
    let colmns = [1, 9, 2];
    if (this.props.data.elements.length < 3) {
      colmns = [3, 9];
    }

    return (
      <Row
        style={{
          border: "1px solid ##e7e7e7",
          boxShadow: " rgba(0, 0, 0, 0.15) 1px 1px 5px",
          borderRadius: "4px",
          padding: "0px",
          margin: "10px 5px",
        }}
      >
        <Col md={colmns[0]} style={this.props.data.elements.length == 3 ? {} : { padding: "0px" }}>
          <SingleView
            element={this.props.data.elements[0]}
            heading={this.props.headings ? languageService(this.props.headings.field1) : null}
          />
        </Col>
        <Col md={colmns[1]} style={{ margin: "auto" }} style={this.props.data.elements.length == 3 ? {} : { padding: "0px" }}>
          <SingleView
            element={this.props.data.elements[1]}
            heading={this.props.headings ? languageService(this.props.headings.field2) : null}
          />
        </Col>
        {this.props.data.elements.length == 3 && (
          <Col md={colmns[2]}>
            <SingleView element={this.props.data.elements[2]} />
          </Col>
        )}
      </Row>
    );
  }
}

class SingleView extends Component {
  render() {
    let colon = this.props.element.description !== " " && this.props.element.description ? ":" : "";
    return (
      <div>
        {this.props.element.type == "BOOLEAN_CHECKBOX" && (
          <div style={{ marginLeft: "15px" }}>
            <Input
              type="checkbox"
              disabled
              checked={this.props.element.value ? this.props.element.value : this.props.element.defaultValue}
            />
          </div>
        )}
        {this.props.element.type == "STRING" && <div> {this.props.element.description} </div>}
        {this.props.element.type == "BOOLEAN_SWITCH" && (
          <SwitchButton checked={this.props.element.value ? this.props.element.value : this.props.element.defaultValue} />
        )}
        {this.props.element.type == "TEXT" && (
          <div style={{ textAlign: "center", padding: "15px 0px" }}>
            {this.props.element.description} {colon}
          </div>
        )}
        {(this.props.element.type == "EDITBOX-ID" || this.props.element.type == "EDITBOX") && (
          <div>
            {this.props.heading && <div style={{ padding: "0px 5px ", background: "#e3e9ef", fontWeight: 600 }}>{this.props.heading}</div>}
            <div
              style={{
                padding: "0px 5px ",
                minHeight: "10px",
                borderBottom: "1px solid grey",
                lineHeight: "20px",
                margin: "0px 5px 10px 5px",
              }}
            >
              &nbsp; {this.props.element.description}
            </div>
          </div>
        )}
      </div>
    );
  }
}

class SwitchButton extends Component {
  render() {
    return (
      <div>
        <Switch
          checked={this.props.checked}
          onColor="#63b3b3"
          onChange={(e) => {}}
          onHandleColor="rgba(64, 118, 179)"
          handleDiameter={22}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={15}
          width={32}
          disabled
          className="react-switch"
          id="material-switch"
        />
      </div>
    );
  }
}
