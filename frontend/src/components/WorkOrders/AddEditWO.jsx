import React, { Component } from "react";
import { CRUDFunction } from "reduxCURD/container";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Label } from "components/Common/Forms/formsMiscItems";
import { ModalStyles } from "components/Common/styles.js";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import _ from "lodash";
import "components/Common/commonform.css";
import { curdActions } from "reduxCURD/actions";
import { languageService } from "../../Language/language.service";
import FormFields from "../../wigets/forms/formFields";
import EditableTable from "components/Common/EditableTable";
import SelectMRs from "./SelectMRs";
import { workorderFields } from "./variables";
import { userListRequest } from "reduxRelated/actions/userActions";
import { getUserGroups } from "../../reduxRelated/actions/userActions";
import moment from "moment";

import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { getAssetLinesWithSelf } from "../../reduxRelated/actions/assetHelperAction";
import { Link } from "react-router-dom";
import { formFeildStyle } from "../../wigets/forms/style/formFields";
import { commonFields } from "../IssuesReports/CreateMR/variables";
import { checkFormIsValid, processFromFields } from "../../utils/helpers";

function format2Digits(num) {
  return num && !isNaN(parseFloat(num)) ? parseFloat(num).toFixed(2) : num ? num : "0.00";
}

const MRTableCols = [
  { id: "Select", header: languageService("Select"), type: "bool", field: "selected", editable: false, minWidth: 35 },
  {
    id: "MRNO",
    header: languageService("MR No"),
    field: "mrNumber",
    editable: false,
    accessor: (d) => {
      return <Link to={`/maintenancebacklogs/${d._id}`}>{d.mrNumber}</Link>;
    },
  },
  { id: "Start", header: languageService("Start"), field: "start", editable: false, minWidth: 50, formatter: format2Digits },
  { id: "End", header: languageService("End"), field: "end", editable: false, minWidth: 50, formatter: format2Digits },
  { id: "Type", header: languageService("Type"), field: "maintenanceType", editable: false, minWidth: 50 },
];

const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class AddEditWOModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workorderFields: _.cloneDeep(workorderFields),
      maintenanceRequests: [], //[{mrNumber:"MR#001", start:"1", end: "2", maintenanceType:"TIES"}],
      addableMRs: [],
      // [{selected: false, mrNumber:"MR#001", start:"1", end: "2", maintenanceType:"TIES"},
      // {selected: false, mrNumber:"MR#002", start:"2", end: "3", maintenanceType:"ADJ TEMP"},
      // {selected: false, mrNumber:"MR#003", start:"4", end: "5", maintenanceType:"RAIL"},
      // {selected: false, mrNumber:"MR#004", start:"6", end: "7", maintenanceType:"SURFACING"}],
      addMRModal: false,
      selectedCount: 0,
      MRFields: _.cloneDeep(commonFields),
      titleMsg: "",
      limitMsg: "",
    };
    this.selectedLineName = "";
    //this.handleMRTableChange = this.handleMRTableChange.bind(this);
    this.addMRButton = this.addMRButton.bind(this);
    this.submitAddMRForm = this.submitAddMRForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.deleteSelectedMRs = this.deleteSelectedMRs.bind(this);
  }

  updateFrom = (newState) => this.setState({ ...newState });

  async componentDidMount() {
    this.props.getAssets();
    this.props.getAssetLinesWithSelf();
    await this.props.getUserGroups();
    this.props.userListRequest();
    // this.props.getMaintenances();
  }

  filterUserByGroup = (users, userGroups) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const currentUser = JSON.parse(loggedInUser);
    if (currentUser) {
      let currentUserLevel = this.getUserLevelByGroup(currentUser, userGroups);

      users = users.reduce((usersTemp, user) => {
        let level = this.getUserLevelByGroup(user, userGroups);

        if (currentUserLevel < level) usersTemp.push(user);

        return usersTemp;
      }, []);
    }

    return users;
  };

  getUserLevelByGroup = (user, userGroups) => {
    let userGroup = userGroups.find((ug) => ug.group_id === user.group_id);

    return userGroup ? userGroup.level : null;
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.assetHelperActionType !== this.props.assetHelperActionType &&
      this.props.assetHelperActionType === "GET_LINE_ASSETS_WITH_SELF_SUCCESS"
    ) {
      this.setLocations(this.state.workorderFields);
    }

    if (prevProps.userActionType !== this.props.userActionType && this.props.userActionType === "USER_LIST_SUCCESS") {
      let users = this.filterUserByGroup(this.props.userList, this.props.userGroups);

      this.fillAssignedTo(users, this.state.workorderFields);
    }

    //if (prevProps.maintenanceActionType !== this.props.maintenanceActionType && this.props.maintenanceActionType === 'MAINTENANCES_READ_SUCCESS') {
    //    this.addableMaintenanceList(this.props.maintenances);
    //}

    if (this.props.modal !== prevProps.modal && this.props.modal && this.props.maintenances) {
      this.addableMaintenanceList(this.props.maintenances);
    }

    if (this.props.modal !== prevProps.modal && this.props.modal && this.props.modalMode === "edit" && this.props.editItem) {
      //console.log('edit', this.props.editItem);
      let wofs = _.cloneDeep(this.state.workorderFields);

      this.enableAllFields(wofs);

      let wo = this.props.editItem;
      wofs.title.value = wo.title ? wo.title : "";
      wofs.workOrderNumber.value = wo.mwoNumber;
      wofs.status.value = wo.status;
      wofs.lineId.value = wo.locationId;
      wofs.lineId.config.disabled = true;
      wofs.priority.value = wo.priority;
      wofs.description.value = wo.description;

      wofs.dueDate.value = wo.dueDate ? moment(wo.dueDate).format("YYYY-MM-DD") : "";
      // wofs.dueDate.value ? (wofs.dueDate.valid = true) : (wofs.dueDate.valid = false);
      wofs.title.value ? (wofs.title.valid = true) : (wofs.title.valid = false);
      if (wo.assignedTo && wo.assignedTo.id) wofs.assignedTo.value = wo.assignedTo.id;

      wofs.dueDate.config.dayPickerProps = { modifiers: { disabled: { before: new Date() } } }; // disable the days before today from selection

      let mrs = this.getMaintenanceRequestsForIds(wo.maintenanceRequests, this.props.maintenances);
      this.setState({ workorderFields: wofs, maintenanceRequests: mrs });
    }

    if (this.props.modal !== prevProps.modal && this.props.modal && this.props.modalMode === "add") {
      //console.log('edit', this.props.editItem);
      let defaultMRs = [],
        defaultLineId = this.state.workorderFields.lineId.config.options[0] ? this.state.workorderFields.lineId.config.options[0].val : "";
      if (this.props.autoAddMr) {
        defaultMRs = this.getMaintenanceRequestsForIds([this.props.autoAddMr.mrNumber], this.props.maintenances);
        if (defaultMRs && defaultMRs.length > 0) {
          defaultLineId = defaultMRs[0].locationId;
        }
      }
      let wofs = _.cloneDeep(this.state.workorderFields);
      this.enableAllFields(wofs);
      wofs.title.value = "";
      wofs.workOrderNumber.value = "";
      wofs.status.value = "";
      wofs.description.value = "";
      wofs.lineId.value = defaultLineId;
      wofs.priority.value = wofs.priority.config.options[0].val;
      wofs.dueDate.value = "";
      wofs.title.touched = false;
      wofs.title.valid = false;
      wofs.title.validationMessage = "";
      wofs.lineId.config.disabled = defaultMRs.length !== 0;

      if (this.props.fromIssue) {
        wofs.lineId.valid = true;
        wofs.lineId.config.disabled = true;
        wofs.lineId.value = this.props.issue.lineId;
      }

      wofs.dueDate.config.dayPickerProps = { modifiers: { disabled: { before: new Date() } } }; // disable the days before today from selection

      this.setState({ workorderFields: wofs, maintenanceRequests: defaultMRs });
    }

    if (this.props.modal !== prevProps.modal && this.props.modal && this.props.modalMode === "view") {
      let wofs1 = _.cloneDeep(this.state.workorderFields);

      this.disableAllFields(wofs1);

      let wo1 = this.props.editItem;
      wofs1.workOrderNumber.value = wo1.mwoNumber;
      wofs1.status.value = wo1.status;
      wofs1.lineId.value = wo1.locationId;
      wofs1.lineId.config.disabled = true;
      wofs1.priority.value = wo1.priority;
      wofs1.description.value = wo1.description;
      wofs1.dueDate.value = moment(wo1.dueDate).format("YYYY-MM-DD");
      wofs1.assignedTo.value = wo1.assignedTo && wo1.assignedTo.id ? wo1.assignedTo.id : "";
      let mrs = this.getMaintenanceRequestsForIds(wo1.maintenanceRequests, this.props.maintenances);

      this.setState({ workorderFields: wofs1, maintenanceRequests: mrs });
    }

    if (this.props.fromIssue && this.state.MRFields.maintenanceType.config.options.length <= 0 && this.props.maintenanceTypes.length > 0) {
      let MRFields = _.cloneDeep(this.state.MRFields);
      MRFields.maintenanceType.config.options = [
        { val: "", text: "Select Type" },
        ...this.props.maintenanceTypes.map((mt) => ({ val: mt, text: mt })),
      ];
      MRFields.maintenanceType.value = MRFields.maintenanceType.config.options[0].val;
      MRFields.maintenanceType.valid = false;

      this.updateFrom({ MRFields });
    }
  }
  enableAllFields(wofs) {
    wofs.lineId.config.disabled = false;
    wofs.description.config.disabled = false;
    wofs.priority.config.disabled = false;
    wofs.dueDate.config.disabled = false;
    wofs.assignedTo.config.disabled = false;
  }
  disableAllFields(wofs) {
    wofs.lineId.config.disabled = true;
    wofs.description.config.disabled = true;
    wofs.priority.config.disabled = true;
    wofs.dueDate.config.disabled = true;
    wofs.assignedTo.config.disabled = true;
  }
  getMaintenanceRequestsForIds(mrIds, maintenances) {
    let mrs = [];
    for (let mrid of mrIds) {
      if (mrid) {
        let mr = maintenances.find((m) => {
          return m.mrNumber === mrid;
        });
        if (mr) {
          let l = this.getMPLocation(mr.location);
          let start = l.start;
          let end = l.end;
          if (this.props.modalMode === "view")
            mrs.push({
              _id: mr._id,
              mrNumber: mr.mrNumber,
              start: start,
              end: end,
              maintenanceType: mr.maintenanceType,
              locationId: mr.lineId,
            });
          else
            mrs.push({
              selected: false,
              _id: mr._id,
              mrNumber: mr.mrNumber,
              start: start,
              end: end,
              maintenanceType: mr.maintenanceType,
              locationId: mr.lineId,
              estimate: mr.estimate,
            });
        }
      }
    }
    return mrs;
  }
  setLocations = (workorderFields) => {
    let filteredAssets = this.props.lineAssets;

    workorderFields.lineId.config.options = filteredAssets ? filteredAssets.map((asset) => ({ val: asset._id, text: asset.unitId })) : [];
    workorderFields.lineId.value = workorderFields.lineId.config.options[0] ? workorderFields.lineId.config.options[0].val : "";
    workorderFields.lineId.valid = true;
    this.setState({ workorderFields: workorderFields });
  };

  fillAssignedTo = (users, workorderFields) => {
    workorderFields.assignedTo.config.options = users ? users.map((asset) => ({ val: asset._id, text: asset.name })) : [];
    workorderFields.assignedTo.value = workorderFields.assignedTo.config.options[0] ? workorderFields.assignedTo.config.options[0].val : "";
    workorderFields.assignedTo.valid = true;

    this.setState({ workorderFields: workorderFields });
  };

  addableMaintenanceList = (maintenances) => {
    let addableMrs = [];
    for (let m of maintenances) {
      if (
        m.lineId === this.state.workorderFields.lineId.value &&
        (!m.workOrderNumber || m.workOrderNumber === "") &&
        !this.state.maintenanceRequests.find((mr1) => {
          return mr1.mrNumber === m.mrNumber;
        })
      ) {
        let l = this.getMPLocation(m.location);
        let start = l.start;
        let end = l.end;

        addableMrs.push({
          _id: m._id,
          selected: false,
          mrNumber: m.mrNumber,
          start: start,
          end: end,
          maintenanceType: m.maintenanceType,
          estimate: m.estimate,
        });
      }
    }
    this.setState({ addableMRs: addableMrs });
  };

  getMPLocation(Locs) {
    let l1 = { start: 0, end: 0 };
    let markerFound = _.find(Locs, { type: "Marker" });
    if (!markerFound) {
      let mpFound = _.find(Locs, { type: "Milepost" });
      mpFound && (l1 = mpFound);
    } else {
      l1 = markerFound;
    }
    // let l =
    //     !Locs || Locs.length == 0
    //         ? { start: 0, end: 0 }
    //         : Locs[0].type === "Milepost"
    //         ? Locs[0]
    //         : Locs.length > 1 && Locs[1].type === "Milepost"
    //             ? Locs[1]
    //             : { start: 0, end: 0 }; //null;
    return l1;
  }

  addMRButton() {
    let l = this.state.workorderFields.lineId.config.options.find((v) => {
      return v.val === this.state.workorderFields.lineId.value;
    });
    if (l && l.text) {
      this.selectedLineName = l.text;
    }

    this.addableMaintenanceList(this.props.maintenances);

    this.setState({
      addMRModal: !this.state.addMRModal,
    });
  }
  submitAddMRForm(mrsToAdd) {
    // console.log('submit Add MR', a);
    for (let m of mrsToAdd) m.selected = false;

    let mrs = _.cloneDeep(this.state.maintenanceRequests);
    let wofs = _.cloneDeep(this.state.workorderFields);

    wofs.lineId.config.disabled = mrs.length + mrsToAdd.length !== 0;

    this.setState({ maintenanceRequests: [...mrs, ...mrsToAdd], workorderFields: wofs });
  }

  submitForm() {
    let mwoNumber = null,
      title,
      locationId,
      locationName,
      priority,
      description,
      dueDate,
      assignedTo,
      maintenanceRequests;
    locationId = this.state.workorderFields.lineId.value;
    let l = this.state.workorderFields.lineId.config.options.find((v) => {
      return v.val == locationId;
    });
    if (l && l.text) {
      locationName = l.text;
    }
    if (this.props.modalMode === "edit") mwoNumber = this.state.workorderFields.workOrderNumber.value;

    priority = this.state.workorderFields.priority.value;
    description = this.state.workorderFields.description.value;
    dueDate = this.state.workorderFields.dueDate.value;
    assignedTo = { id: this.state.workorderFields.assignedTo.value };
    title = this.state.workorderFields.title.value;

    maintenanceRequests = this.state.maintenanceRequests.map((mr) => {
      return mr.mrNumber;
    });

    const woToSubmit = {
      mwoNumber: mwoNumber,
      locationId: locationId,
      locationName,
      priority: priority,
      description: description,
      dueDate: dueDate,
      assignedTo: assignedTo,
      maintenanceRequests: maintenanceRequests,
      title: title,
    };

    // Process MR fields if wo creates from issue
    if (checkFormIsValid(this.state.workorderFields)) {
      if (this.props.fromIssue) {
        let { MRFields } = this.state;
        let formIsValid = checkFormIsValid(MRFields);

        let mrToSubmit = { ...processFromFields(MRFields) };
        if (formIsValid) {
          mrToSubmit.startMP = this.props.issue.startMp;
          mrToSubmit.endMP = this.props.issue.endMp;

          this.setState({
            MRFields: _.cloneDeep(commonFields),
          });

          this.props.handleSubmitForm(woToSubmit, mrToSubmit);
        } else {
          this.setFormValidation(MRFields, "MRFields");
        }
      } else {
        this.props.handleSubmitForm(woToSubmit);
      }
    } else {
      this.setFormValidation(this.state.workorderFields, "workorderFields");
    }
  }

  setFormValidation = (data, stateVarName) => {
    const validationMsg = languageService("Validation failed") + ": ";
    for (let key in data) {
      data[key].touched = true;
      if (!data[key].validationMessage.startsWith(validationMsg)) data[key].validationMessage = validationMsg + data[key].validationMessage;
    }

    this.setState({ [stateVarName]: data });
  };

  updateFormState = (newState) => this.setState({ ...newState }); // calculate change in fields here
  onChange(name, value, obj) {
    if (this.props.modalMode === "view") return;

    let mrs = _.cloneDeep(this.state.maintenanceRequests);
    let selectedCount = this.state.selectedCount;

    for (let mr of mrs) {
      if (mr.mrNumber === obj.mrNumber) {
        if (mr.hasOwnProperty(name)) {
          mr[name] = !mr[name];

          if (mr[name]) selectedCount++;
          else selectedCount--;
        }

        this.setState({ maintenanceRequests: mrs, selectedCount: selectedCount });
        return;
      }
    }
  }
  deleteSelectedMRs() {
    let mrs = [];
    for (let mr of this.state.maintenanceRequests) {
      if (!mr.selected) {
        mrs.push(mr);
      }
    }
    let wofs = _.cloneDeep(this.state.workorderFields);
    wofs.lineId.config.disabled = mrs.length !== 0;

    this.setState({ maintenanceRequests: mrs, selectedCount: 0, workorderFields: wofs });
  }
  render() {
    return (
      <Modal
        contentClassName={themeService({ default: this.props.className, retro: "retro" })}
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        styles={{ maxWidth: "98vw" }}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {this.props.modalMode === "add" ? languageService("Add Capital Plan") : languageService("Edit Capital Plan")}
        </ModalHeader>

        <ModalBody style={themeService(CommonModalStyle.body)}>
          <SelectMRs
            modal={this.state.addMRModal}
            toggle={this.addMRButton}
            maintenanceRequests={this.state.addableMRs}
            submitForm={this.submitAddMRForm}
            title={this.selectedLineName}
          />

          <div className={"commonform"} style={{ position: "relative", zIndex: "3" }}>
            <FormFields workorderFields={this.state.workorderFields} fieldTitle={"workorderFields"} change={this.updateFormState} />
          </div>

          {!this.props.fromIssue && (
            <React.Fragment>
              <EditableTable
                columns={MRTableCols}
                data={this.state.maintenanceRequests}
                handleActionClick={(a) => {}}
                onChange={this.onChange}
                options={{}}
              />

              <Row>
                <Col>
                  <MyButton
                    type="button"
                    onClick={this.deleteSelectedMRs}
                    disabled={this.state.selectedCount === 0}
                    style={themeService(ButtonStyle.commonButton)}
                  >
                    {languageService("Remove")}{" "}
                  </MyButton>
                </Col>
                <Col>
                  <MyButton
                    type="button"
                    onClick={this.addMRButton}
                    disabled={this.props.modalMode === "view"}
                    style={themeService(ButtonStyle.commonButton)}
                  >
                    {languageService("Add")} WO
                  </MyButton>{" "}
                </Col>
              </Row>
            </React.Fragment>
          )}

          {this.props.fromIssue && (
            <React.Fragment>
              {/* <h4 style={{ marginTop: "10px" }}>Maintenance Request</h4> */}
              <div className={"commonform"}>
                <FormFields MRFields={this.state.MRFields} fieldTitle={"MRFields"} change={this.updateFrom} />
                <label style={themeService(formFeildStyle.lblStyle)}>{" Start:"}</label>{" "}
                <div style={{ ...themeService(formFeildStyle.feildStyle), fontSize: "12px" }}>
                  {this.props.issue.startMarker ? this.props.issue.startMarker : this.props.issue.startMp}
                </div>
                <label style={themeService(formFeildStyle.lblStyle)}>{" End:"}</label>
                <div style={{ ...themeService(formFeildStyle.feildStyle), fontSize: "12px" }}>
                  {this.props.issue.endMarker ? this.props.issue.endMarker : this.props.issue.endMp}
                </div>
              </div>
            </React.Fragment>
          )}
        </ModalBody>

        <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          <MyButton
            type="submit"
            onClick={this.submitForm}
            disabled={this.props.modalMode === "view"}
            style={themeService(ButtonStyle.commonButton)}
          >
            {this.props.modalMode === "add" ? languageService("Add") : languageService("Update")}
          </MyButton>

          <MyButton type="button" onClick={this.props.toggle} style={themeService(ButtonStyle.commonButton)}>
            {languageService("Cancel")}
          </MyButton>
        </ModalFooter>
      </Modal>
    );
  }
}

const getAssets = curdActions.getAssets;
//const getMaintenances = curdActions.getMaintenances;

let actionOptions = {
  create: false,
  update: false,
  read: true,
  delete: false,
  others: {
    getAssets,
    userListRequest,
    getAssetLinesWithSelf,
    getUserGroups,
    //   getMaintenances
  },
};
let variables = {
  assetHelperReducer: { lineAssets: [] },
  assetReducer: {
    assets: [],
  },
  userReducer: {
    userList: [],
    userGroups: [],
  },
  maintenanceReducer: {
    maintenances: [],
  },
};

let AddWOModalContainer = CRUDFunction(AddEditWOModal, "addWorkOrder", actionOptions, variables, [
  "assetHelperReducer",
  "assetReducer",
  "userReducer",
  "maintenanceReducer",
]);

export default AddWOModalContainer;
