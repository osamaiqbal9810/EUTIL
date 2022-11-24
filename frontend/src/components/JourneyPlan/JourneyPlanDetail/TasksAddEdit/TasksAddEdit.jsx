/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import { Modal, ModalHeader, ModalBody, ModalFooter, CustomInput } from "reactstrap";
import { Control, LocalForm, Errors, actions } from "react-redux-form";
import "./taskform.css";
import { checkSize } from "utils/checkSize";
import _ from "lodash";
import ImageGallery from "components/Common/ImageGallery/index";
import LocationSelection from "components/Common/LocationSelection/index";
import { languageService } from "../../../../Language/language.service";
import { Label, Field, MyButton, Required } from "../../../Common/Forms/formsMiscItems";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { formFeildStyle } from "../../../../wigets/forms/style/formFields";
import { retroColors } from "../../../../style/basic/basicColors";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";

class TasksAddEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addTasksRender: true,
      addUnitsRender: true,
      addImgsRender: false,
      addLocationRender: false,
      validLocSelected: true,
      showEither: "none",
      allowedSize: 20000000,
      modalState: "None",
      locationValue: languageService("Select Location"),
      task: {
        title: "",
        desc: "",
        notes: "",
        imgs: null,
        locationSpecial: {},
      },
      fileUploadPath: languageService("Upload New File"),
      file: "",
      fileToUpload: true,
      fileSizeLimitWarn: "",
      selectedUnits: [],
      showNoUnitSelectedWarn: false,
      selectedTask: {},
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeMultiSelect = this.handleChangeMultiSelect.bind(this);
    this.handleUnitsAddView = this.handleUnitsAddView.bind(this);
    this.handleImgSelectView = this.handleImgSelectView.bind(this);
    this.handleCancelUnitsImgsView = this.handleCancelUnitsImgsView.bind(this);
    this.handleSaveUnits = this.handleSaveUnits.bind(this);
    this.handleImgUpload = this.handleImgUpload.bind(this);
    this.handleSaveImage = this.handleSaveImage.bind(this);
    this.handleLocationAddView = this.handleLocationAddView.bind(this);
    this.handleLocationSave = this.handleLocationSave.bind(this);
    this.handleCloseLocationSelection = this.handleCloseLocationSelection.bind(this);

    this.errorWrapper = (props) => <div style={{ marginTop: "5px", fontSize: "12px", color: "#9d0707" }}>{props.children}</div>;
    this.errorShow = { touched: true, focus: false };

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
      dropdown: {
        float: "right",
      },
      fileInputStyleWrap: {
        display: "inline-block",
      },
      fileUploadFormIconStyle: {
        padding: "0px",
      },
      fileUploadPathInputStyle: {
        height: "40px",
        borderRadius: "0px 5px 5px 0px",
        zIndex: "0",
      },
      fileUploadButtonStyle: {
        marginBottom: "20px",
      },
      fileInputWrapper: {
        height: "40px",
        overflow: "hidden",
        position: "relative",
      },
      fileInput: {
        fontSize: "200px",
        position: "absolute",
        top: 0,
        right: 0,
        opacity: 100,
      },
    };
    this.multiSelectStyle = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        height: "15px",
      }),
      option: (base, state) => ({
        ...base,
        color: "rgba(64, 118, 179)",
        fontSize: "12px",
      }),
      placeholder: (styles) => ({
        ...styles,
        fontSize: "12px",
      }),
    };
  }

  handleClose() {
    this.setState({
      addTasksRender: true,
      addUnitsRender: false,
      addImgsRender: false,
      addLocationRender: false,
      modalState: "None",
      showEither: "none",
      fileUploadPath: languageService("Upload New File"),
      file: "",
      fileToUpload: true,
      fileSizeLimitWarn: "",
      selectedUnits: [],
      selectedTask: {},
      task: {
        title: "",
        desc: "",
        notes: "",
        units: [],
        imgs: null,
      },
    });
    this.props.toggle("None", null);
  }

  handleChange(task) {
    let currentTask = this.state.task;
    let copyTask = { ...currentTask };
    copyTask.title = task.title;
    copyTask.desc = task.desc;
    copyTask.notes = task.notes;
    this.setState({
      task: copyTask,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modalState == "Add" && nextProps.modalState !== prevState.modalState) {
      return {
        task: {
          title: "",
          desc: "",
          notes: "",
          units: [],
          imgs: null,
        },
        fileUploadPath: languageService("Upload New File"),
        file: "",
        selectedUnits: [],
        fileSizeLimitWarn: "",
        showNoUnitSelectedWarn: false,
        showEither: "locationField",
        locationValue: languageService("Select Location"),
        selectedTask: {},
        fileToUpload: true,
        validLocSelected: true,
        addTasksRender: true,
        addUnitsRender: false,
        addLocationRender: false,
        addImgsRender: false,
        modalState: nextProps.modalState,
      };
    } else if (nextProps.modalState == "Edit" && nextProps.selectedTask.taskId !== prevState.selectedTask.taskId) {
      let units = nextProps.selectedTask.units;
      let selectedUnitsObj = [];
      // let trackIds = Object.keys(units)
      let tracks = nextProps.tracks;
      // trackIds.forEach(trackId => {
      //   let track = _.find(tracks, { _id: trackId })
      //   units[trackId].forEach(unit => {
      //     let unitOption = { value: unit.id, label: unit.unitId, track_Id: track._id }
      //     selectedUnitsObj.push(unitOption)
      //   })
      // })
      units.forEach((unit) => {
        let unitOption = {
          value: unit.id,
          label: unit.unitId,
          track_Id: unit.track_Id,
        };
        selectedUnitsObj.push(unitOption);
      });
      let showEither = "units";
      let locaFieldValue = languageService("Select Location");
      let copyTask = _.cloneDeep(nextProps.selectedTask);
      if (nextProps.selectedTask.type == "special") {
        showEither = "locationField";
        if (nextProps.selectedTask.units.length > 0) {
          let unit = nextProps.selectedTask.units[0];

          let lat = "";
          let lon = "";
          if (unit.coordinates) {
            lat = unit.coordinates[0][0];
            lon = unit.coordinates[0][1];
          }
          let loc = { start: unit.startM, end: unit.endM, lat: lat, lon: lon };
          let res = validLocationChecker(loc);
          locaFieldValue = res.locationValue;
          copyTask.locationSpecial = loc;
        }
      }
      return {
        addTasksRender: true,
        addUnitsRender: false,
        addImgsRender: false,
        showEither: showEither,
        locationValue: locaFieldValue,
        addLocationRender: false,
        task: copyTask,
        modalState: nextProps.modalState,
        selectedUnits: selectedUnitsObj,
        showNoUnitSelectedWarn: false,
        selectedTask: nextProps.selectedTask,
        fileUploadPath: nextProps.selectedTask.imgs,
        fileToUpload: false,
      };
    } else {
      return null;
    }
  }
  handleUnitsAddView() {
    this.setState({
      addTasksRender: false,
      addUnitsRender: true,
      addImgsRender: false,
      addLocationRender: false,
      showNoUnitSelectedWarn: false,
    });
  }
  handleLocationAddView() {
    this.setState({
      addTasksRender: false,
      addUnitsRender: false,
      addLocationRender: true,
      addImgsRender: false,
      showNoUnitSelectedWarn: false,
    });
  }
  handleCancelUnitsImgsView() {
    this.setState({
      addTasksRender: true,
      addUnitsRender: false,
      addImgsRender: false,
      addLocationRender: false,
    });
  }
  handleImgSelectView() {
    this.setState({
      addTasksRender: false,
      addUnitsRender: false,
      addImgsRender: true,
      addLocationRender: false,
    });
  }
  handleSaveUnits(units) {
    //   //console.log(units)
    let selectedUnitsObj = [];

    units.forEach((unit) => {
      let unitOption = {
        value: unit.id,
        label: unit.unitId,
        track_Id: unit.track_id,
      };
      selectedUnitsObj.push(unitOption);
    });
    let task = this.state.task;
    let copyTask = { ...task };
    copyTask.units = units;
    this.setState({
      addTasksRender: true,
      addUnitsRender: false,
      addImgsRender: false,
      task: copyTask,
      selectedUnits: selectedUnitsObj,
    });
  }

  handleUpdate(form) {}
  handleSubmit(task) {
    //  //console.log(task)
    //  //console.log('state task : ')
    ////console.log(this.state.task)
    // if (this.state.selectedUnits.length > 0) {
    let validLocCheck = validLocationChecker(task.locationSpecial);
    if (validLocCheck.validLocSelected) {
      if (this.state.modalState == "Add") {
        this.props.handleAddSubmit(this.state.task);
        if (this.state.fileToUpload) {
          this.props.uploadImg(this.state.file);
        }
      }
      if (this.state.modalState == "Edit") {
        if (this.state.fileToUpload) {
          this.props.uploadImg(this.state.file);
        }
        this.props.handleEditSubmit(this.state.task);
      }
      this.setState({
        modalState: "None",
        addTasksRender: true,
        addUnitsRender: false,
        addImgsRender: false,
        task: {
          title: "",
          desc: "",
          notes: "",
          units: [],
          imgs: null,
        },
        fileUploadPath: languageService("Upload New File"),
        file: "",
        fileToUpload: true,
        fileSizeLimitWarn: "",
        selectedUnits: [],
        selectedTask: {},
      });
      this.props.toggle("None", null);
    }
    // } else {
    //   this.setState({
    //     showNoUnitSelectedWarn: true
    //   })
    // }
  }

  /* Not in Use */
  handleChangeMultiSelect(selectedUnits) {
    this.setState({
      task: {
        title: this.state.task.title,
        desc: this.state.task.desc,
        notes: this.state.task.notes,
        units: selectedUnits,
        imgs: this.state.task.imgs,
      },
    });
  }

  handleImgUpload(e) {
    //console.log(e.target.value)
    //console.log(e.target.files[0])
    let pathName = this.state.fileUploadPath;
    let cPathName = pathName;
    if (pathName) {
      cPathName = pathName.slice();
    }
    let file = e.target.files[0];
    let fileSizeLimitWarn = "";
    let fileToUpload = false;
    let taskState = this.state.task;
    let copyTask = { ...taskState };
    //console.log(cPathName)
    if (e.target.files[0]) {
      cPathName = e.target.files[0].name;

      if (e.target.files[0].size > this.state.allowedSize) {
        let sizeInUnit = checkSize(this.state.allowedSize);
        cPathName = "Upload a file";
        file = "";
        fileSizeLimitWarn = "The File is too large , please select file under " + sizeInUnit;
      } else {
        fileToUpload = true;
        copyTask.imgs = file.name;
      }
    }

    this.setState({
      fileUploadPath: cPathName,
      file: file,
      fileSizeLimitWarn: fileSizeLimitWarn,
      task: copyTask,
      fileToUpload: fileToUpload,
    });
  }

  handleSaveImage(img) {
    let taskState = this.state.task;
    let copyTask = { ...taskState };
    copyTask.imgs = img;
    this.setState({
      fileUploadPath: img,
      fileToUpload: false,
      task: copyTask,
      addTasksRender: true,
      addUnitsRender: false,
      addImgsRender: false,
    });
  }

  handleCloseLocationSelection() {
    this.setState({
      addTasksRender: true,
      addUnitsRender: false,
      addImgsRender: false,
      addLocationRender: false,
    });
  }
  handleLocationSave(loc) {
    const { task } = this.state;
    let copyTask = { ...task };
    copyTask.locationSpecial = loc;
    // let specialUnit = {
    //   id: "0",
    //   unitId: "Special Unit",
    //   track_id: "0",
    //   assetType: "Special",
    //   startM: loc.start,
    //   endM: loc.end,
    //   coordinates: [[loc.lat, loc.lon]],
    // };
    // copyTask.units = [specialUnit];

    let validLocCheck = validLocationChecker(loc);
    this.setState({
      task: copyTask,
      addTasksRender: true,
      addUnitsRender: false,
      addImgsRender: false,
      addLocationRender: false,
      locationValue: validLocCheck.locationValue,
      validLocSelected: validLocCheck.validLocSelected,
    });
  }

  render() {
    let taskAddEdit,
      unitAddEdit,
      selectedUnits,
      locationSelect,
      imgAddEdit = null;

    selectedUnits = this.state.selectedUnits.map((unitOp, index) => {
      let selectedUnitsLength = this.state.selectedUnits.length;
      let comma = ",";
      if (index == this.state.selectedUnits.length - 1) {
        comma = ".";
      }
      return (
        <div style={{ display: "inline-block", marginRight: "3px" }} key={unitOp.value}>
          {unitOp.label}
          {comma}{" "}
        </div>
      );
    });
    if (selectedUnits.length == 0) {
      selectedUnits = "Select Assets ";
    }

    if (this.state.addTasksRender && !this.state.addImgsRender && !this.state.addUnitsRender) {
      taskAddEdit = (
        <LocalForm
          className={"commonForm"}
          model="task"
          onUpdate={(form) => this.handleUpdate(form)}
          validators={this.trackValidator}
          onChange={(values) => this.handleChange(values)}
          onSubmit={(values) => this.handleSubmit(values)}
          initialState={this.state.task}
        >
          {this.state.modalState == "Add" && (
            <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
              {languageService("Add Special Task")}
            </ModalHeader>
          )}
          {this.state.modalState == "Edit" && (
            <ModalHeader style={themeService(ModalStyles.modalTitleStyle)}>{languageService("Edit Task")}</ModalHeader>
          )}
          <ModalBody style={themeService(CommonModalStyle.body)}>
            <Field>
              <Label>
                {languageService("Title")} :<Required />
              </Label>
              <Control.text
                model="task.title"
                placeholder={languageService("Title")}
                disabled={this.state.modalState == "Edit" ? true : false}
                validators={{
                  required: (val) => val && val.length,
                }}
                style={{ ...themeService(formFeildStyle.inputStyle), float: "none" }}
              />
              <Errors
                model="task.title"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: `${languageService("Please provide Title")}.`,
                }}
              />
            </Field>
            <Field>
              <Label>
                {languageService("Description")} :<Required />
              </Label>
              <Control.text
                model="task.desc"
                placeholder={languageService("Description")}
                validators={{
                  required: (val) => val && val.length,
                }}
                style={{ ...themeService(formFeildStyle.inputStyle), float: "none" }}
              />
              <Errors
                model="task.desc"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: `${languageService("Please provide Description")}.`,
                }}
              />
            </Field>
            <Field>
              <Label>
                {languageService("Notes")} :<Required />
              </Label>
              <Control.text
                model="task.notes"
                placeholder={languageService("Notes")}
                validators={{
                  required: (val) => val && val.length,
                }}
                style={{ ...themeService(formFeildStyle.inputStyle), float: "none" }}
              />
              <Errors
                model="task.notes"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: `${languageService("Please provide Notes")}.`,
                }}
              />
            </Field>
            <Field>
              <Label for="fileImg">{languageService("Image")}</Label>
              <CustomInput
                type="file"
                id="imgUpload"
                name="imgFile"
                label={this.state.fileUploadPath}
                onChange={this.handleImgUpload}
                accept="image/*"
                style={{ ...themeService(formFeildStyle.inputStyle), float: "none" }}
              />
              {this.state.fileSizeLimitWarn && this.state.fileSizeLimitWarn !== "" && (
                <div
                  style={{
                    marginTop: "5px",
                    fontSize: "12px",
                    color: "rgba(64, 118, 179)",
                  }}
                >
                  {this.state.fileSizeLimitWarn}{" "}
                </div>
              )}
            </Field>
            <MyButton
              type="button"
              onClick={this.handleImgSelectView}
              style={(ModalStyles.footerButtonsContainer, themeService(ButtonStyle.commonButton))}
            >
              {languageService("Select Existing Images")}
            </MyButton>
            {this.state.showEither == "locationField" && (
              <Field>
                <Label>
                  {languageService("Location")} :<Required />
                </Label>
                <div style={themeService(this.styles.row)} onClick={this.handleLocationAddView}>
                  {this.state.locationValue}
                </div>
                {/* <div style={{ display: 'inline-block', float: 'right' }}>
                <MyButton type="button" onClick={this.handleUnitsAddView} style={{ width: '60px' }}>
                  {' '}
                  Select
                </MyButton>
              </div> */}
              </Field>
            )}{" "}
            {!this.state.validLocSelected && this.state.showEither == "locationField" && (
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "12px",
                  color: "#9d0707",
                }}
              >
                {languageService("Please Select Valid Location")}
              </div>
            )}
            {this.state.showEither == "units" && (
              <Field>
                <label
                  className="fullWidth"
                  style={themeService({
                    default: {},
                    retro: { display: "inline-block", width: "30%", color: retroColors.second, fontWeight: "bold" },
                  })}
                >
                  {languageService("Assets")} :<Required />
                </label>
                <div style={themeService(this.styles.row)}>{selectedUnits}</div>
                {/* <div style={{ display: 'inline-block', float: 'right' }}>
                  <MyButton type="button" onClick={this.handleUnitsAddView} style={{ width: '60px' }}>
                    {' '}
                    Select
                  </MyButton>
                </div> */}
              </Field>
            )}
            {this.state.showNoUnitSelectedWarn && this.state.showEither == "units" && (
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "12px",
                  color: "#9d0707",
                }}
              >
                {`${languageService("Please Select at least one Asset")}`}
              </div>
            )}
          </ModalBody>
          <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
            {this.state.modalState == "Add" && (
              <MyButton type="submit" style={(ModalStyles.footerButtonsContainer, themeService(ButtonStyle.commonButton))}>
                {languageService("Add")}{" "}
              </MyButton>
            )}
            {this.state.modalState == "Edit" && (
              <MyButton type="submit" style={(ModalStyles.footerButtonsContainer, themeService(ButtonStyle.commonButton))}>
                {languageService("Update")}{" "}
              </MyButton>
            )}
            <MyButton
              style={(ModalStyles.footerButtonsContainer, themeService(ButtonStyle.commonButton))}
              type="button"
              onClick={this.handleClose}
            >
              {languageService("Close")}
            </MyButton>
          </ModalFooter>
        </LocalForm>
      );
    }
    // if (!this.state.addTasksRender && !this.state.addImgsRender && this.state.addUnitsRender) {
    //   unitAddEdit = (
    //     <TasksUnits
    //       handleCancel={this.handleCancelUnitsImgsView}
    //       handleSave={this.handleSaveUnits}
    //       tracks={this.props.tracks}
    //       task={this.state.task}
    //     />
    //   )
    // }
    if (!this.state.addTasksRender && this.state.addImgsRender && !this.state.addUnitsRender) {
      imgAddEdit = <ImageGallery handleCancel={this.handleCancelUnitsImgsView} handleSave={this.handleSaveImage} />;
    }
    if (!this.state.addTasksRender && !this.state.addImgsRender && !this.state.addUnitsRender && this.state.addLocationRender) {
      locationSelect = (
        <LocationSelection
          saveLocation={this.handleLocationSave}
          handleCloseLocationSelection={this.handleCloseLocationSelection}
          locationSpecial={this.state.task.locationSpecial}
        />
      );
    }
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
        {taskAddEdit}
        {unitAddEdit}
        {imgAddEdit}
        {locationSelect}
      </Modal>
    );
  }
}

export default TasksAddEdit;

const validLocationChecker = (loc) => {
  let result = {
    validLocSelected: true,
    locationValue: "",
  };
  if (loc) {
    let latLonCheck = loc.lat && loc.lon ? true : false;
    let startEndCheck = loc.start && loc.end ? true : false;
    result = {
      validLocSelected: latLonCheck || startEndCheck ? true : false,
      locationValue: languageService("Select Location"),
    };
    if (latLonCheck && startEndCheck) {
      result.locationValue = "Lat/Lon : " + loc.lat + ", " + loc.lon + ". " + "MilePost Start/End : " + loc.start + ", " + loc.end;
    } else {
      if (latLonCheck) {
        result.locationValue = "Lat/Lon : " + loc.lat + ", " + loc.lon;
      } else if (startEndCheck) {
        result.locationValue = "MilePost Start/End : " + loc.start + ", " + loc.end;
      }
    }
  }
  return result;
};
