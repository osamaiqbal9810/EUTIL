/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// import { isEmpty, isEmail } from "validator";
import "./taskform.css";
// import { checkSize } from "utils/checkSize";
import _ from "lodash";
// import { upload } from "react-icons-kit/fa/upload";
import ImageGallery from "components/Common/ImageGallery/index";
import ImageArea from "components/Common/ImageArea";
import { languageService } from "../../../../Language/language.service";
// import { CommonFormStyle } from "components/SetupPage/User/UserForm/style";
import { retroColors } from "style/basic/basicColors";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { MyButton } from "../../../Common/Forms/formsMiscItems";
import { basicFields, locationMilepostFields } from "./variables";
import FormFields from "../../../../wigets/forms/formFields";
import { formFeildStyle } from "../../../../wigets/forms/style/formFields";
import { checkFormIsValid } from "../../../../utils/helpers";
import { keyValueProperties } from "./variables";
import { updateFormFieldsWithValues } from "../../../../wigets/forms/common";

class TasksAddEdit extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      row: {
        default: {
          fontSize: "12px",
          minHeight: "30px",
          color: "rgba(64, 118, 179)",
          padding: "12px 10px 6px 12px",
          borderLeft: "1px solid #e3e9ef",
          borderRight: "1px solid #e3e9ef",
          borderBottom: "1px solid #e3e9ef",
          boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
          transitionDuration: "2s",
        },
        retro: {
          width: "70%",
          height: "34px",
          padding: "6px 12px",
          fontSize: "12px",
          lineHeight: "1.42857143",
          color: retroColors.second,
          backgroundColor: "#fff",
          backgroundImage: "none",
          border: "1px solid #e3e9ef",
          borderRadius: "2px",
          WebkitBoxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
          boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
          WebkitTransition: "border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
          OTransition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s",
          transition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
          display: "inline-block",
        },
      },
    };

    this.defaultTaskFields = {
      title: "",
      desc: "",
      notes: "",
      units: [],
      locationSpecial: {},
      locationValue: {},
      imgs: null,
    };

    this.state = {
      addTasksRender: true,
      showImgGal: false,
      taskFields: _.cloneDeep(this.defaultTaskFields),
    };

    this.basicFields = _.cloneDeep(basicFields);
    this.locationMilepostFields = _.cloneDeep(locationMilepostFields);

    this.updateBasicFields = this.updateBasicFields.bind(this);
    this.updateFieldsToState = this.updateFieldsToState.bind(this);
    this.updateLocationFields = this.updateLocationFields.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.addLineLimitsToCaptionsAndValidations = this.addLineLimitsToCaptionsAndValidations.bind(this);
  }

  updateBasicFields(newFields) {
    let newBasicFields = this.updateFieldsToState(newFields.basicFields, this.state.taskFields);
    this.setState(({ taskFields }) => ({
      taskFields: { ...taskFields, ...newBasicFields },
    }));
    this.basicFields = newFields.basicFields;
  }

  updateLocationFields(newFields) {
    let newBasicFields = this.updateFieldsToState(newFields.locationMilepostFields, this.state.taskFields);
    this.setState(({ taskFields }) => ({
      taskFields: {
        ...taskFields,
        locationSpecial: { ...taskFields.locationSpecial, ...newBasicFields },
        locationValue: { ...taskFields.locationValue, ...newBasicFields },
      },
    }));
    this.locationMilepostFields = newFields.locationMilepostFields;
  }

  updateFieldsToState(newFields) {
    let stateFields = {};
    let fieldKeys = Object.keys(newFields);
    fieldKeys.forEach((fKey) => {
      stateFields[fKey] = newFields[fKey].value;
    });
    return stateFields;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.modalState !== prevProps.modalState) {
      if (this.props.modalState === "Add") {
        this.locationMilepostFields = this.addLineLimitsToCaptionsAndValidations(this.props.asset, this.locationMilepostFields);
        // this.resetFields();
      } else if (this.props.modalState === "Edit") {
        const selectedTask = this.props.selectedTask;
        let taskFields = _.cloneDeep(this.state.taskFields);

        for (let key in selectedTask) {
          if (key in taskFields) taskFields[key] = selectedTask[key];

          if (key in this.basicFields) this.basicFields[key].value = selectedTask[key];

          if (key === "locationSpecial" && selectedTask.type === "special") {
            this.locationMilepostFields.start.value = selectedTask.locationSpecial.start;
            this.locationMilepostFields.end.value = selectedTask.locationSpecial.end;
            this.locationMilepostFields = this.addLineLimitsToCaptionsAndValidations(this.props.asset, this.locationMilepostFields);
          }
        }

        updateFormFieldsWithValues(this.basicFields, keyValueProperties, taskFields);

        taskFields.type = selectedTask.type;
        this.setState({
          taskFields,
        });
      }
    }
  }

  addLineLimitsToCaptionsAndValidations(parentAsset, locationMilepostFields1, setInitialValues = false) {
    if (locationMilepostFields1 && parentAsset && parentAsset.hasOwnProperty("start") && parentAsset.hasOwnProperty("end")) {
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

      // debugger;
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

  addSelectedImage = (imgName) => {
    if (imgName) {
      this.setState(({ taskFields }) => ({
        taskFields: { ...taskFields, imgs: imgName },
        showImgGal: false,
      }));
    } else {
      this.setState({
        showImgGal: false,
      });
    }
  };

  handleSubmit() {
    let isValid = checkFormIsValid(this.basicFields);
    let taskFields = _.cloneDeep(this.state.taskFields);

    if (this.props.modalState === "Add" || this.state.taskFields.type === "special") {
      isValid = checkFormIsValid(this.locationMilepostFields) && isValid;
    }

    // debugger;
    if (this.props.modalState === "Edit" && this.state.taskFields.type !== "special") {
      taskFields.locationSpecial = undefined;
      taskFields.locationValue = undefined;
    }

    if (isValid) {
      if (this.props.modalState === "Add") {
        this.props.handleAddSubmit(taskFields);
      }
      if (this.props.modalState === "Edit") {
        this.props.handleEditSubmit({ ...this.props.selectedTask, ...taskFields });
      }

      this.resetFields();
      this.props.toggle("None", null);
    } else {
      if (this.props.modalState === "Add" || this.state.taskFields.type === "special") {
        this.setFormValidation(this.locationMilepostFields);
      }
      this.setFormValidation(this.basicFields);
      this.setState({});
    }
  }

  setFormValidation = (data) => {
    const msg = languageService("Validation failed") + ": ";
    for (let key in data) {
      data[key].touched = true;
      if (!data[key].validationMessage.startsWith(msg)) data[key].validationMessage = msg + data[key].validationMessage;
    }
  };

  resetFields() {
    this.setState(
      {
        addTasksRender: true,
        showImgGal: false,
        taskFields: _.cloneDeep(this.defaultTaskFields),
      },
      () => {
        this.basicFields = _.cloneDeep(basicFields);
        this.locationMilepostFields = _.cloneDeep(locationMilepostFields);
        // debugger;
      },
    );
  }

  toggle() {
    this.resetFields();
    this.props.toggle("None", null);
    this.setState({});
  }

  renderUnits(selectedTask) {
    if (selectedTask && selectedTask.units && selectedTask.units.length)
      return selectedTask.units.map((unitOp, index) => {
        let comma = ",";
        if (index === selectedTask.units.length - 1) {
          comma = ".";
        }
        // debugger;
        return (
          <div style={{ display: "inline-block", marginRight: "3px" }} key={index}>
            {unitOp.unitId}
            {comma}{" "}
          </div>
        );
      });
  }

  render() {
    return (
      <Modal
        contentClassName={themeService({ default: this.props.className, retro: "retroModal" })}
        isOpen={this.props.modal}
        toggle={this.toggle}
        className={this.props.className}
      >
        {!this.state.showImgGal && (
          <React.Fragment>
            {this.props.modalState === "Add" && (
              <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
                {languageService("Add Special Task")}
              </ModalHeader>
            )}

            {this.props.modalState === "Edit" && (
              <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
                {languageService("Edit Task")} {this.state.taskFields.type && `(${languageService(this.state.taskFields.type)})`}
              </ModalHeader>
            )}

            <ModalBody style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
              <div className={"commonform"}>
                <FormFields basicFields={this.basicFields} fieldTitle={"basicFields"} change={this.updateBasicFields} />

                <div style={themeService(formFeildStyle.feildStyle)}>
                  <label style={themeService(formFeildStyle.lblStyle)}>
                    <button onClick={() => this.setState({ showImgGal: true })}>{languageService("Select Image")}</button>
                  </label>

                  {this.state.taskFields.imgs ? (
                    <ImageArea
                      path="assetImages"
                      imagesList={this.state.taskFields.imgs ? [{ imgName: this.state.taskFields.imgs }] : []}
                    />
                  ) : (
                    <div>
                      No Image selected
                      <br />
                    </div>
                  )}
                </div>
                <span className="spacer"></span>
                {/*</Col>*/}

                {this.props.modalState === "Add" || this.state.taskFields.type === "special" ? (
                  <FormFields
                    locationMilepostFields={this.locationMilepostFields}
                    fieldTitle={"locationMilepostFields"}
                    change={this.updateLocationFields}
                  />
                ) : (
                  <React.Fragment>
                    <label style={themeService(formFeildStyle.lblStyle)}>{languageService("Assets")} :*</label>
                    <div className="scrollbar" style={{ ...themeService(this.styles.row), height: "500px", overflow: "auto" }}>
                      {this.renderUnits(this.props.selectedTask)}
                    </div>
                  </React.Fragment>
                )}
              </div>
            </ModalBody>

            <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
              <MyButton
                onClick={this.handleSubmit}
                type="submit"
                style={(ModalStyles.footerButtonsContainer, themeService(ButtonStyle.commonButton))}
              >
                {this.props.modalState === "Edit" ? languageService("Update") : languageService("Add")}
              </MyButton>

              <MyButton
                style={(ModalStyles.footerButtonsContainer, themeService(ButtonStyle.commonButton))}
                type="button"
                onClick={this.toggle}
              >
                {languageService("Cancel")}
              </MyButton>
            </ModalFooter>
          </React.Fragment>
        )}

        {this.state.showImgGal && (
          // <Modal isOpen={this.state.showImgGal}>
          <ImageGallery
            handleSave={this.addSelectedImage}
            handleCancel={() => this.setState({ showImgGal: false })}
            loadImgPath={"showAssetImgs"}
            customFolder={"assetImages"}
            uploadCustomPath={"uploadassetimage"}
            uploadImageAllow
          />
          // </Modal>
        )}
      </Modal>
    );
  }
}

export default TasksAddEdit;
