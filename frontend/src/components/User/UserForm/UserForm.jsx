import React, { Component } from "react";
import { isEmpty, isEmail } from "validator";
import "./userform.css";
import _ from "lodash";
import permissionCheck from "utils/permissionCheck.js";
import { isJSON } from "utils/isJson";
import { languageService } from "../../../Language/language.service";
import FormFields from "../../../wigets/forms/formFields";
import { additionalFields, basicFields, passwordFields, userGroupsTemplate } from "./variables";
import { checkFormIsValid, groupByKey, processFromFields } from "../../../utils/helpers";
import { ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { CommonFormStyle } from "./style/UserForm";
import { GET_PLAN_USERS_SUCCESS } from "../../../reduxRelated/ActionTypes/actionTypes";
import ConfirmationDialog from "../../Common/ConfirmationDialog";
import { mapDynamicUserGroupsName } from "../../../utils/globals";

const Field = props => <div className="field">{props.children}</div>;
const Button = props => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

const getValue = val => (val === undefined ? "" : val);

const INPECTABLE_ROLE_GROUPS = ["supervisor", "inspector"];

Array.prototype.inArray = function(comparer) {
  for (let i = 0; i < this.length; i++) {
    if (comparer(this[i])) return true;
  }
  return false;
};

class UForm extends Component {
  constructor(params) {
    super(params);

    this.errorComponent = "li";
    this.errorShow = { touched: true, focus: false };

    this.errorWrapper = props => (
      <div className="errors">
        <ul>{props.children}</ul>
      </div>
    );

    this.handleReset.bind(this);
    this.toggleSetPassword.bind(this);
    this.setGlobalGeoLocOpt = this.setGlobalGeoLocOpt.bind(this);
    this.processDynamicGroups = this.processDynamicGroups.bind(this);

    this.state = {
      basicFields: _.cloneDeep(basicFields),
      passwordFields: _.cloneDeep(passwordFields),
      additionalFields: _.cloneDeep(additionalFields),
      dynamicUserGroups: null,
      passwordToggle: false,
      globalUserLoggingAllow: false,
      preValidation: {
        show: false,
        inspectorSwitch: false,
        inspectorToAssign: null,
        isTeamLead: false,
        isAssignedToTeam: false,
      },
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isAddMode !== prevProps.isAddMode || this.props.user.email !== prevProps.user.email) {
      if (this.props.isAddMode) {
        this.handleReset();
      } else {
        let newState = this.updateUserInfoToForm(this.props);

        newState.preValidation = {
          show: false,
          inspectorSwitch: false,
          inspectorToAssign: null,
          isTeamLead: false,
          isAssignedToTeam: false,
        };

        this.setState(newState);
      }
    }

    if (this.props.userActionType === "USER_CREATE_SUCCESS") {
      this.handleReset();
    }
  }
  getUserGroupName(groupId) {
    let groupName = "";
    let userLocalStorage = localStorage.getItem("loggedInUser");
    const currentUser = JSON.parse(userLocalStorage);
    if (this.props.userDetail && this.props.userDetail.userGroups) {
      let result = _.find(this.props.userDetail.userGroups, { group_id: groupId });
      if (result) {
        groupName = result.name;
      } else {
        groupName = currentUser.userGroup.name;
      }
    } else {
      groupName = currentUser.userGroup.name;
    }
    return groupName;
  }
  updateUserInfoToForm = ({ userList, userDetail }) => {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let { user } = userDetail;
    let basicFields1 = _.cloneDeep(this.state.basicFields),
      additionalFields1 = _.cloneDeep(this.state.additionalFields),
      passwordFields1 = _.cloneDeep(this.state.passwordFields),
      dynamicUserGroups = _.cloneDeep(this.state.dynamicUserGroups);

    let userData = user;

    if (userDetail) dynamicUserGroups = this.processDynamicGroups(dynamicUserGroups, userDetail, false);

    additionalFields1.assignedLocation = this.fillAssignedLocationOptions(additionalFields.assignedLocation, userDetail);

    for (let key in userData) {
      if (key in basicFields) {
        basicFields1[key].value = userData[key] || "";
        basicFields1[key].valid = basicFields1[key].value ? true : false;

        basicFields1[key].config.disabled = key === "email";
      }

      if (key in additionalFields) {
        additionalFields1[key].value = userData[key] || "";
        additionalFields1[key].valid = additionalFields1[key].value ? true : false;
        additionalFields1[key].config.disabled = currentUser._id === user._id;
      }
    }

    return {
      basicFields: basicFields1,
      additionalFields: additionalFields1,
      passwordFields: passwordFields1,
      passwordToggle: false,
      dynamicUserGroups,
    };
  };
  processDynamicGroups(dynamicUserGroups, userDetail, setInitialValue = false) {
    const { user } = userDetail;
    let userGroups = [];
    if (userDetail) {
      userGroups = this.filterAssetAndGroups(userDetail, this.props.isAddMode).userGroups;
    }

    let grouped = groupByKey(userGroups, "category");
    if (grouped) {
      Object.keys(grouped).forEach(key => {
        let name = mapDynamicUserGroupsName(key);
        if (!dynamicUserGroups) {
          let copyUserGroupsTemplate = _.cloneDeep(userGroupsTemplate[name]);
          dynamicUserGroups = { [name]: copyUserGroupsTemplate };
        } else if (!(name in dynamicUserGroups)) {
          dynamicUserGroups = { ...dynamicUserGroups, [name]: userGroupsTemplate[name] };
        }

        dynamicUserGroups[name] = this.fillUserGroupOptions(dynamicUserGroups[name], grouped[key], setInitialValue);

        if (!this.props.isAddMode && user && name === "department") {
          dynamicUserGroups[name].value = user[name];
          let selfUser = this.selfUserCheck();
          if (user[name] && typeof user[name] !== "string") {
            dynamicUserGroups[name].value = user[name].reduce((arr, g) => {
              let findObject = userGroups.find(ug => ug.group_id === g);
              if (findObject) arr.push({ label: findObject.name, value: g });

              return arr;
            }, []);
          }
        }

        if (!this.props.isAddMode && user && name === "group_id") {
          if (user.userGroup && typeof user.userGroup === "string") {
            let uGroup = userDetail.userGroups.find(ug => ug._id === user.userGroup);
            if (uGroup) dynamicUserGroups[name].value = uGroup.group_id;
          } else if (user.userGroup && user.userGroup.group_id) dynamicUserGroups[name].value = user.userGroup.group_id;
          else dynamicUserGroups[name].value = user[name];
        }

        dynamicUserGroups[name].config.disabled = this.props.selfUser;
      });
    }

    return dynamicUserGroups;
  }
  handlePreSubmitValidationCheck = async () => {
    if (!this.props.isAddMode && this.props.user.group_id !== this.state.dynamicUserGroups.group_id.value) {
      let { preValidation } = this.state;

      if (this.props.user.group_id === "supervisor" && this.props.user.team && this.props.user.team.length) {
        preValidation.show = true;
        preValidation.isTeamLead = true;
      } else if (this.props.user.group_id === "inspector") {
        if (this.props.user.teamLead) {
          preValidation.show = true;
          preValidation.isAssignedToTeam = true;
        }
      }

      if (
        INPECTABLE_ROLE_GROUPS.includes(this.props.user.group_id) &&
        !INPECTABLE_ROLE_GROUPS.includes(this.state.dynamicUserGroups.group_id.value)
      ) {
        const response = await this.props.getUserInspectionPlan([this.props.user._id]);

        if (response.type === GET_PLAN_USERS_SUCCESS) {
          if (this.props.userWorkPlans && this.props.userWorkPlans.length > 0) {
            preValidation.show = true;
            preValidation.inspectorSwitch = true;
          }
        }
      }

      if (preValidation.show) {
        this.setState({ preValidation });
        return false;
      }
    }

    this.handleSubmitForm();
  };
  handleConfirmation = response => {
    if (response) {
      this.handleSubmitForm(true);
    }

    this.setState(({ preValidation }) => ({
      preValidation: {
        ...preValidation,
        show: false,
        inspectorSwitch: false,
      },
    }));
  };
  handleInspectorSwitch = e => {
    const { name, value } = e.target;
    this.setState(({ preValidation }) => ({
      preValidation: {
        ...preValidation,
        [name]: value,
      },
    }));
  };
  handleSubmitForm = async (switchUserInWorkPlanTemplates = false) => {
    let { basicFields, passwordFields, additionalFields, dynamicUserGroups } = this.state;
    let result = _.find(this.props.userDetail.userGroups, { group_id: dynamicUserGroups.group_id.value });

    // let AuthUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let dataToSubmit = processFromFields(basicFields);

    if (this.state.passwordToggle) {
      if (passwordFields.password.value) {
        dataToSubmit = {
          ...dataToSubmit,
          ...processFromFields(passwordFields),
        };
      }
    }

    dataToSubmit = {
      ...dataToSubmit,
      ...processFromFields(additionalFields),
      ...processFromFields(dynamicUserGroups),
    };

    if (result) {
      dataToSubmit.userGroup = result._id;
      dataToSubmit.group_name = this.getUserGroupName(getValue(result.group_id));
    }

    let formIsValid = checkFormIsValid(basicFields);

    if (!additionalFields.phone.value) {
      additionalFields.phone.valid = true;
    }

    formIsValid = checkFormIsValid(additionalFields) && formIsValid;

    if (this.state.passwordToggle) {
      formIsValid = checkFormIsValid(passwordFields) && formIsValid;
    }

    // Email existence validation check logic
    if (this.props.isAddMode && basicFields.email.value) {
      const { response } = await this.props.getUserByEmail(basicFields.email.value);

      if (response) {
        basicFields.email.valid = false;
        basicFields.email.validationMessage = languageService("Email already exist, please use another email");
        formIsValid = false;
      }
    }

    let processDynamicGroupsFields = this.processDynamicUserGroupForSubmitForm(dataToSubmit, this.props.userDetail);
    dataToSubmit = { ...dataToSubmit, ...processDynamicGroupsFields };

    if (formIsValid) {
      let asset =
        this.props.userDetail && this.props.userDetail.assets
          ? this.props.userDetail.assets.find(asset => asset._id === dataToSubmit.assignedLocation)
          : null;

      if (asset) {
        dataToSubmit.assignedLocationName = asset.unitId;
      } else {
        let op = additionalFields.assignedLocation.config.options.find(op => op.val === dataToSubmit.assignedLocation);
        dataToSubmit.assignedLocationName = op.text;
      }

      if (switchUserInWorkPlanTemplates) {
        let inspectorUser = this.state.preValidation.inspectorToAssign
          ? this.props.userList.find(u => u._id === this.state.preValidation.inspectorToAssign)
          : this.props.userList.find(u => u.group_id === "inspector");
        dataToSubmit.userWorkPlans = this.props.userWorkPlans.map(uwp => uwp._id);
        const { _id, name, email } = inspectorUser;
        dataToSubmit.assignUserToWorkPlan = { _id, name, email };
      }

      this.props.handleSubmit(dataToSubmit);
    } else {
      this.setFormValidation(basicFields, "basicFields");
      this.setFormValidation(additionalFields, "additionalFields");
      if (this.state.passwordToggle) {
        this.setFormValidation(passwordFields, "passwordFields");
      }
    }
  };
  processDynamicUserGroupForSubmitForm(formData, { userGroups }) {
    let result = {
      userGroups: [],
    };

    let grouped = groupByKey(userGroups, "category");

    Object.keys(grouped).forEach(key => {
      let name = mapDynamicUserGroupsName(key);
      if (name in formData) {
        if (name === "department") {
          let departmentIds = Array.isArray(formData.department)
            ? formData.department.reduce((arr, ug) => {
                let findObject = grouped[key].find(g => {
                  if (typeof ug === "string") return g.group_id === ug;
                  return g.group_id === ug.value;
                });

                if (findObject) arr.push(findObject._id);
                return arr;
              }, [])
            : [];
          result.userGroups = [...result.userGroups, ...departmentIds];
        } else {
          let findObject = grouped[key].find(g => g.group_id === formData[name]);
          result.userGroups.push(findObject ? findObject._id : formData[name]);
        }
      }
    });

    return result;
  }
  setFormValidation = (data, stateVarName) => {
    const msg = languageService("Validation failed") + ": ";
    for (let key in data) {
      data[key].touched = true;
      //data[key].validationMessage = "Validation failed";
      if (!data[key].validationMessage.startsWith(msg)) data[key].validationMessage = msg + data[key].validationMessage;
    }

    this.setState({ [stateVarName]: data });
  };
  handleReset() {
    let stateToUpdate = {
      basicFields: _.cloneDeep(basicFields),
      passwordFields: _.cloneDeep(passwordFields),
      additionalFields: _.cloneDeep(additionalFields),
      dynamicUserGroups: null,
      passwordToggle: true,
      globalUserLoggingAllow: false,
    };

    stateToUpdate.additionalFields.assignedLocation = this.fillAssignedLocationOptions(
      stateToUpdate.additionalFields.assignedLocation,
      this.props.userDetail,
      true,
    );

    stateToUpdate.dynamicUserGroups = this.processDynamicGroups(stateToUpdate.dynamicUserGroups, this.props.userDetail, true);

    this.setState(stateToUpdate);
  }
  toggleSetPassword() {
    this.setState({
      passwordToggle: !this.state.passwordToggle,
    });
  }
  filterAssetAndGroups(userDetail, isAddMode) {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let { assets, userGroups, user } = _.cloneDeep(userDetail);

    if (!this.selfUserCheck({ value: user.email }) || isAddMode) {
      // assets = assets.filter(item => item._id !== currentUser.assignedLocation);
      userGroups = userGroups.filter(g => {
        if (currentUser.userGroup && currentUser.userGroup._id) return g._id !== currentUser.userGroup._id;

        return g._id !== currentUser.group_id;
      });
    }

    return { assets, userGroups };
  }
  fillAssignedLocationOptions(assignedLocationField, useDetail, setInitialValue = false) {
    if (useDetail) {
      let { assets } = this.filterAssetAndGroups(useDetail, this.props.isAddMode);

      assignedLocationField.config.options = assets.map(asset => ({ val: asset._id, text: asset.unitId }));

      if (setInitialValue) {
        assignedLocationField.value = assignedLocationField.config.options[0] ? assignedLocationField.config.options[0].val : "";
        assignedLocationField.config.disabled = false;
      }
    }

    return assignedLocationField;
  }
  fillUserGroupOptions(groupField, userGroups, setInitialValue = false) {
    if (this.props.isAddMode && userGroups && userGroups.length) {
      groupField.value = userGroups[0].group_id;
    }

    groupField.config.options = userGroups.map(userGroup => ({
      val: userGroup.group_id,
      text: userGroup.name,
    }));

    if (setInitialValue) groupField.value = groupField.config.options.length ? groupField.config.options[0].val : "";

    return groupField;
  }
  selfUserCheck(userField) {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let selfCheck = false;
    let emailToCheckAgainst = userField ? userField.value : this.state.basicFields.email.value;
    if (currentUser.email == emailToCheckAgainst) {
      selfCheck = true;
    }
    return selfCheck;
  }
  setGlobalGeoLocOpt(globalLoggingOpt) {
    this.setState({
      globalUserLoggingAllow: globalLoggingOpt,
    });
  }
  updateFormState = newState =>
    this.setState({
      ...newState,
      preValidation: {
        show: false,
        inspectorSwitch: false,
        inspectorToAssign: null,
        isTeamLead: false,
        isAssignedToTeam: false,
      },
    });
  render() {
    const passwordToggle = this.state.passwordToggle;
    const { isAddMode } = this.props;

    return (
      <div className={"commonform"} style={themeService(CommonFormStyle.formStyle)}>
        <ConfirmationDialog
          modal={this.state.preValidation.show}
          toggle={() => this.setState(({ deleteModal }) => ({ deleteModal: !deleteModal }))}
          handleResponse={this.handleConfirmation}
          confirmationMessage={
            <div>
              {this.state.preValidation.inspectorSwitch && (
                <React.Fragment>
                  <div style={{ color: "red" }}>
                    <strong>{languageService("Note")}: </strong>
                    {languageService("Before you change the group, assign following inspection to other inspector")}
                  </div>

                  <ul>
                    {this.props.userWorkPlans.map(uwp => (
                      <li key={uwp._id}>{uwp.title}</li>
                    ))}
                  </ul>

                  <select value={this.state.inspectorToAssign} name={"inspectorToAssign"} onChange={this.handleInspectorSwitch}>
                    {this.props.userList &&
                      this.props.userList.length &&
                      this.props.userList.reduce((userOptions, user) => {
                        if (INPECTABLE_ROLE_GROUPS.includes(user.group_id) && user._id !== this.props.user._id) {
                          userOptions.push(
                            <option key={user._id} value={user._id}>
                              {user.name}
                            </option>,
                          );
                        }

                        return userOptions;
                      }, [])}
                  </select>
                </React.Fragment>
              )}

              {this.state.preValidation.isTeamLead && (
                <React.Fragment>
                  <div style={{ color: "red" }}>
                    <strong>{languageService("Note")}: </strong>
                    {`${this.props.user.name} ${languageService(
                      "is currently leading a Team. If you change the role, team will no longer exist and team members will need to be re-assigned to a new team",
                    )}.`}
                    <div>{languageService("Do you want to proceed")}?</div>
                  </div>
                </React.Fragment>
              )}

              {this.state.preValidation.isAssignedToTeam && (
                <React.Fragment>
                  <div style={{ color: "red" }}>
                    <strong>{languageService("Note")}: </strong>
                    {`${this.props.user.name} ${languageService(
                      "is currently assigned to a Team. If you change the role, this team member will be removed from current team and will need to be re-assigned to a new team",
                    )}.`}
                    <div>{languageService("Do you want to proceed")}?</div>
                  </div>
                </React.Fragment>
              )}
            </div>
          }
          headerText={languageService("Confirm Role Change")}
        />

        <FormFields basicFields={this.state.basicFields} change={this.updateFormState} fieldTitle={"basicFields"} />
        {!isAddMode && ((permissionCheck("USER", "update") && this.props.user.email !== "") || this.selfUserCheck()) && (
          <Field>
            <Button type="button" size="sm" onClick={this.toggleSetPassword.bind(this)} style={themeService(ButtonStyle.commonButton)}>
              {passwordToggle ? languageService("Hide Password") : languageService("Set Password")}
            </Button>
          </Field>
        )}

        {passwordToggle && (
          <FormFields passwordFields={this.state.passwordFields} change={this.updateFormState} fieldTitle={"passwordFields"} />
        )}

        {this.state.dynamicUserGroups && (
          <FormFields dynamicUserGroups={this.state.dynamicUserGroups} change={this.updateFormState} fieldTitle={"dynamicUserGroups"} />
        )}
        <FormFields additionalFields={this.state.additionalFields} change={this.updateFormState} fieldTitle={"additionalFields"} />
        <br></br>
        {permissionCheck("USER", "update") && (
          <Button onClick={this.handlePreSubmitValidationCheck} type="submit" style={themeService(ButtonStyle.commonButton)}>
            {languageService("Submit")}{" "}
          </Button>
        )}
        {this.props.isDeleteBtnEnable && permissionCheck("USER", "delete") && (
          <span style={{ marginLeft: "3px" }}>
            <Button type="button" onClick={this.props.userDelete} style={themeService(ButtonStyle.commonButton)}>
              {languageService("Delete")}
            </Button>
          </span>
        )}
      </div>
    );
  }
}
export default UForm;
