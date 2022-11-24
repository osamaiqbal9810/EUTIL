import React, { Component } from "react";
import { isEmpty, isEmail } from "validator";
import { UserHours } from "../../../Common/UserHours";
import "./userform.css";
import _ from "lodash";
import permissionCheck from "utils/permissionCheck.js";
//fa-angle-right
import { isJSON } from "utils/isJson";
import { languageService } from "../../../../Language/language.service";
import UserHoursWrapper from "./UserHoursWrapper";
import InputCheckBoxField from "components/Common/Forms/InputCheckBoxField";
import FormFields from "../../../../wigets/forms/formFields";
import { additionalFields, basicFields, passwordFields, userGroupsTemplate } from "./variables";
import { checkFormIsValid, groupByKey, processFromFields } from "../../../../utils/helpers";
import { ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { CommonFormStyle } from "./style/UserForm";
import { retroColors } from "../../../../style/basic/basicColors";
import {
  GET_LINE_ASSETS_WITH_SELF_SUCCESS,
  GET_PLAN_USERS_SUCCESS,
  USER_GROUP_GET_SUCCESS,
} from "../../../../reduxRelated/ActionTypes/actionTypes";
import ConfirmationDialog from "../../../Common/ConfirmationDialog";
import { mapDynamicUserGroupsName } from "../../../../utils/globals";

// const MyTextInput = props => <input className="my-input" {...props} />;

// const Label = props => <label>{props.children}</label>;
const Field = props => <div className="field">{props.children}</div>;
const Button = props => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);
// const Required = () => (
//     <span className="required-fld" style={themeService({ default: {}, retro: { color: retroColors.second } })}>
//     *
//   </span>
// );
const getValue = val => (val === undefined ? "" : val);

Array.prototype.inArray = function(comparer) {
  for (let i = 0; i < this.length; i++) {
    if (comparer(this[i])) return true;
  }
  return false;
};

Array.prototype.pushIfNotExist = function(element, comparer) {
  if (!this.inArray(comparer)) {
    this.push(element);
  }
};

class UForm extends Component {
  constructor(params) {
    super(params);

    this.errorComponent = "li";
    this.errorShow = { touched: true, focus: false };

    // const required = val => !isEmpty(val);
    // const user  = this.props.userDetail ? this.props.userDetail.user : {};
    // this.initialState = {
    //   name: getValue(user.name),
    //   email: getValue(user.email),
    //   password: getValue(user.password),
    //   passwordConfirm: getValue(user.passwordConfirm),
    //   address: getValue(user.address),
    //   group_id: getValue(user.group_id),
    //   genericEmail: getValue(user.genericEmail),
    //   subdivision: getValue(user.subdivision),
    //   department: getValue(user.department),
    //   phone: getValue(user.phone),
    //   mobile: getValue(user.mobile),
    //   active: getValue(user.active),
    //   group_name: this.getUserGroupName(getValue(user.group_id)),
    // };

    this.errorWrapper = props => (
      <div className="errors">
        <ul>{props.children}</ul>
      </div>
    );

    // this.handleSubmit.bind(this);
    this.handleReset.bind(this);
    this.toggleSetPassword.bind(this);
    this.setGlobalGeoLocOpt = this.setGlobalGeoLocOpt.bind(this);
    this.processDynamicGroups = this.processDynamicGroups.bind(this);

    this.state = {
      basicFields: _.cloneDeep(basicFields),
      passwordFields: _.cloneDeep(passwordFields),
      additionalFields: _.cloneDeep(additionalFields),
      dynamicUserGroups: null,
      // initialState: this.initialState,
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
        // let additionalFields = _.cloneDeep(this.state.additionalFields);
        // const user = JSON.parse(localStorage.getItem("loggedInUser"));

        // Handle 3 cases: 1. Self user edit, 2. Add new and 3. Edit other user
        if (this.props.isAddMode !== prevProps.isAddMode || this.props.user.email !== prevProps.user.email) {
            if (this.props.isAddMode) {
                this.handleReset();
            } else {
                let newState = this.updateUserInfoToForm(this.props);

                // newState.additionalFields.group_id = this.fillUserGroupOptions(additionalFields.group_id, this.props.userGroups);
                // newState.additionalFields.assignedLocation = this.fillAssignedLocationOptions(additionalFields.assignedLocation, this.props.lineAssets);

                // if (this.props.user.email === user.email) {
                //   // self user edit
                //   newState.basicFields.genericEmail.config.disabled = false; // allow user to edit his or her alert email
                //   // newState.additionalFields.group_id.config.disabled = true;
                //   newState.additionalFields.assignedLocation.config.disabled = true;
                //   if (newState.dynamicUserGroups && newState.dynamicUserGroups.group_id) {
                //     newState.dynamicUserGroups.group_id.config.disabled = true;
                //   }
                //   if (newState.dynamicUserGroups && newState.dynamicUserGroups.department) {
                //     let selfUser = this.selfUserCheck(this.props.user.email);
                //     if (selfUser) newState.dynamicUserGroups.department.config.disabled = true;
                //   }
                //   // newState.additionalFields.department.config.disabled = true;
                // }

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

        // if (prevState.basicFields.email.value !== this.state.basicFields.email.value) {
        //   this.setState((state, props) => {
        //     let additionalFields = { ...state.additionalFields };
        //     // additionalFields.group_id = this.fillUserGroupOptions(additionalFields.group_id, props.userDetail);
        //     additionalFields.assignedLocation = this.fillAssignedLocationOptions(additionalFields.assignedLocation, props.userDetail);
        //     additionalFields.assignedLocation.value = props.userDetail.user.assignedLocation;
        //     return { additionalFields: additionalFields };
        //   });
        // }

        // if (this.props.userGroupActionType !== prevProps.userGroupActionType && this.props.userGroupActionType === USER_GROUP_GET_SUCCESS) {
        //   this.setState((state, props) => {
        //     let additionalFields = { ...state.additionalFields };
        //     let dynamicUserGroups = { ...state.dynamicUserGroups };
        //     dynamicUserGroups = this.processDynamicGroups(dynamicUserGroups, props.userGroups, false, props.user);
        //
        //     // additionalFields.group_id = this.fillUserGroupOptions(additionalFields.group_id, props.userGroups);
        //     // additionalFields.userGroups = this.fillMultiUserGroupOptions(additionalFields.userGroups, props.userGroups);
        //     return { additionalFields: additionalFields, dynamicUserGroups: dynamicUserGroups };
        //   });
        // }

        // if (
        //   this.props.assetHelperActionType !== prevProps.assetHelperActionType &&
        //   this.props.assetHelperActionType === GET_LINE_ASSETS_WITH_SELF_SUCCESS
        // ) {
        //   this.setState((state, props) => {
        //     let additionalFields = { ...state.additionalFields };
        //     additionalFields.assignedLocation = this.fillAssignedLocationOptions(additionalFields.assignedLocation, props.userDetail, true);
        //     return { additionalFields: additionalFields };
        //   });
        // }
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
    let {user} = userDetail;
    let basicFields1 = _.cloneDeep(this.state.basicFields),
      additionalFields1 = _.cloneDeep(this.state.additionalFields),
      passwordFields1 = _.cloneDeep(this.state.passwordFields),
      dynamicUserGroups = _.cloneDeep(this.state.dynamicUserGroups);


    let userData = user;

    if (userDetail)
      dynamicUserGroups = this.processDynamicGroups(dynamicUserGroups, userDetail, false);

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

  // userGroupsValueProcess(value, userGroups) {
  //   let result = value;
  //   if (value && value.length && Array.isArray(value) && userGroups && userGroups.length) {
  //     result = value.reduce((arr, u) => {
  //       let uGroup = userGroups.find(ug => {
  //         if (typeof u === "string") {
  //           if ([ug.group_id, ug.name].includes(u)) return true;
  //
  //           if (ug.name.includes(u)) return true;
  //         }
  //
  //         return false;
  //       });
  //
  //       if (uGroup) arr.push({ label: uGroup.name, value: typeof u === "string" ? u : u.value });
  //
  //       return arr;
  //     }, []);
  //   }
  //
  //   return result;
  // }

  processDynamicGroups(dynamicUserGroups, userDetail, setInitialValue = false) {
      const {user} = userDetail;
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
          dynamicUserGroups = { [name]:  copyUserGroupsTemplate};

        } else if (!(name in dynamicUserGroups)) {
          dynamicUserGroups = { ...dynamicUserGroups, [name]: userGroupsTemplate[name] };
        }

        dynamicUserGroups[name] = this.fillUserGroupOptions(dynamicUserGroups[name], grouped[key], setInitialValue);

        if (!this.props.isAddMode && user && name === "department") {
            dynamicUserGroups[name].value = user[name];
            let selfUser = this.selfUserCheck();
            dynamicUserGroups[name].config.disabled = selfUser;
            if (user[name] && typeof user[name] !== "string") {
              dynamicUserGroups[name].value = user[name].reduce((arr,g) => {
                let findObject = userGroups.find(ug => ug.group_id === g);
                if (findObject) arr.push({ label: findObject.name, value: g });

                return arr;
              }, []);
            }
        }

          if (!this.props.isAddMode && user && name === "group_id") {
              if (user.userGroup && typeof user.userGroup === 'string'){
                let uGroup = userDetail.userGroups.find(ug => ug._id === user.userGroup);
                if (uGroup)
                  dynamicUserGroups[name].value = uGroup.group_id;
              } else if (user.userGroup && user.userGroup.group_id)
                  dynamicUserGroups[name].value = user.userGroup.group_id;
              else dynamicUserGroups[name].value = user[name];
          }

      });
    }

    return dynamicUserGroups;
  }

  handlePreSubmitValidationCheck = async () => {
    if (!this.props.isAddMode && this.props.user.group_id !== this.state.dynamicUserGroups.group_id.value) {
        let { preValidation } = this.state;

        if (this.props.user.group_id === 'supervisor' && this.props.user.team && this.props.user.team.length) {
          preValidation.show = true;
          preValidation.isTeamLead = true;

        } else if (this.props.user.group_id === "inspector" && this.state.dynamicUserGroups.group_id.value !== "inspector") {
            const response = await this.props.getUserInspectionPlan([this.props.user._id]);

            if (response.type === GET_PLAN_USERS_SUCCESS) {
                if (this.props.userWorkPlans && this.props.userWorkPlans.length > 0) {
                  preValidation.show = true;
                  preValidation.inspectorSwitch = true;
                }
            }

            if (this.props.user.teamLead) {
                preValidation.show = true;
                preValidation.isAssignedToTeam = true;
            }

        }

        if (preValidation.show) {
          this.setState({preValidation});
          return false;
        }
    }

    this.handleSubmitForm();

    // if (this.props.isAddMode) {
    //   this.handleSubmitForm();
    // } else {
    //
    //   if (this.props.user.group_id === "inspector" && this.state.dynamicUserGroups.group_id.value !== "inspector") {
    //     const response = await this.props.getUserInspectionPlan([this.props.user._id]);
    //
    //     if (response.type === GET_PLAN_USERS_SUCCESS) {
    //       if (this.props.userWorkPlans && this.props.userWorkPlans.length > 0) {
    //         this.setState(({ preValidation }) => ({
    //           preValidation: {
    //             ...preValidation,
    //             show: true,
    //             inspectorSwitch: true,
    //           },
    //         }));
    //       } else {
    //         this.handleSubmitForm();
    //       }
    //     }
    //   } else {
    //     this.handleSubmitForm();
    //   }
    // }
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
      const {response} = await this.props.getUserByEmail(basicFields.email.value);

      if (response) {
        basicFields.email.valid = false;
        basicFields.email.validationMessage = languageService('Email already exist, please use another email');
        formIsValid = false;
      }
    }


    let processDynamicGroupsFields = this.processDynamicUserGroupForSubmitForm(dataToSubmit, this.props.userGroups);
    dataToSubmit = { ...dataToSubmit, ...processDynamicGroupsFields };

    if (formIsValid) {
      let asset =
        this.props.assets && this.props.assets.assetsList
          ? this.props.assets.assetsList.find(asset => asset._id === dataToSubmit.assignedLocation)
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

  processDynamicUserGroupForSubmitForm(formData, userGroups) {
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

    stateToUpdate.dynamicUserGroups = this.processDynamicGroups(
        stateToUpdate.dynamicUserGroups,
        this.props.userDetail,
        true
    );

    // stateToUpdate.additionalFields.assignedLocation.value = this.state.additionalFields.assignedLocation.config.options[0]
    //   ? this.state.additionalFields.assignedLocation.config.options[0].val
    //   : "";
    // stateToUpdate.additionalFields.assignedLocation.config.options = this.state.additionalFields.assignedLocation.config.options;
    // stateToUpdate.additionalFields.assignedLocation.valid = stateToUpdate.additionalFields.assignedLocation.value !== "";



      /**
       * update
       */
    // stateToUpdate.dynamicUserGroups = this.processDynamicGroups(stateToUpdate.dynamicUserGroups, this.props.userGroups, true);
    // stateToUpdate.dynamicUserGroups.group_id.config.disabled = false;
    // stateToUpdate.dynamicUserGroups.department.config.disabled = false;

    // stateToUpdate.additionalFields.assignedLocation = this.fillAssignedLocationOptions(
    //   stateToUpdate.additionalFields.assignedLocation,
    //   this.props.userDetail,
    //   true,
    // );

    // stateToUpdate.additionalFields.group_id.valid = true;

    // stateToUpdate.additionalFields.department = this.fillDepartmentOptions(
    //   stateToUpdate.additionalFields.department,
    //   this.props.departments,
    //   true,
    // );

    this.setState(stateToUpdate);
  }

  toggleSetPassword() {
    this.setState({
      passwordToggle: !this.state.passwordToggle,
    });
  }

  filterAssetAndGroups(userDetail, isAddMode){
      const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
      let {assets, userGroups, user} = _.cloneDeep(userDetail);

      if (!this.selfUserCheck({value: user.email}) || isAddMode) {
        assets = assets.filter(item => item._id !== currentUser.assignedLocation);
        userGroups = userGroups.filter(g => {
          if (currentUser.userGroup && currentUser.userGroup._id)
            return g._id !==  currentUser.userGroup._id;

          return g._id !== currentUser.group_id
        });
      }

    return {assets, userGroups};
  }

  fillAssignedLocationOptions(assignedLocationField, useDetail, setInitialValue = false) {
    if (useDetail) {
      let {assets} = this.filterAssetAndGroups(useDetail, this.props.isAddMode);

      assignedLocationField.config.options = assets.map(asset => ({ val: asset._id, text: asset.unitId }));

      if (setInitialValue) {
        assignedLocationField.value = assignedLocationField.config.options[0] ? assignedLocationField.config.options[0].val : "";
        assignedLocationField.config.disabled = false;
      }
    }

    return assignedLocationField;
  }

  // fillDepartmentOptions(departmentField, departmentsList, setInitialValue = false) {
  //
  //   departmentField.config.options = departmentsList.map(d => {
  //     return { val: d, text: d };
  //   });
  //   if (setInitialValue) departmentField.value = departmentField.config.options.length ? departmentField.config.options[0].val : "";
  //
  //   return departmentField;
  // }
  fillUserGroupOptions(groupField, userGroups, setInitialValue = false) {
    // const user = JSON.parse(localStorage.getItem("loggedInUser"));

    // Filter user group by category = role
    // userGroups = userGroups.filter(ug => ug.category === 'Role');

    // if (this.selfUserCheck()) {
    //   if (!this.props.isAddMode) {
    //     Array.prototype.inArray = function(comparer) {
    //       for (let i = 0; i < this.length; i++) {
    //         if (comparer(this[i])) return true;
    //       }
    //       return false;
    //     };
    //
    //     Array.prototype.pushIfNotExist = function(element, comparer) {
    //       if (!this.inArray(comparer)) {
    //         this.push(element);
    //       }
    //     };
    //
    //     let element = { group_id: user.userGroup.group_id, name: user.userGroup.name };
    //
    //     if (groupField.config.name === "role") {
    //       userGroups.pushIfNotExist(element, function(e) {
    //         return e.group_id === element.group_id;
    //       });
    //     }
    //   }
    // } else {
    //   userGroups = userGroups.filter(item => item.group_id !== user.userGroup.group_id);
      if (this.props.isAddMode && userGroups && userGroups.length) {
        groupField.value = userGroups[0].group_id;
      // }
    }

    groupField.config.options = userGroups.map(userGroup => ({
      val: userGroup.group_id,
      text: userGroup.name,
    }));

    if (setInitialValue) groupField.value = groupField.config.options.length ? groupField.config.options[0].val : "";

    return groupField;
  }

  // fillMultiUserGroupOptions(groupField, userGroups, setInitialValue = false) {
  //   const user = JSON.parse(localStorage.getItem("loggedInUser"));
  //
  //   if (this.selfUserCheck()) {
  //     if (!this.props.isAddMode) {
  //       Array.prototype.inArray = function(comparer) {
  //         for (let i = 0; i < this.length; i++) {
  //           if (comparer(this[i])) return true;
  //         }
  //         return false;
  //       };
  //
  //       Array.prototype.pushIfNotExist = function(element, comparer) {
  //         if (!this.inArray(comparer)) {
  //           this.push(element);
  //         }
  //       };
  //
  //       let element = {
  //         group_id: user.userGroup.group_id,
  //         name: user.userGroup.name,
  //         _id: user.userGroup._id,
  //       };
  //
  //       userGroups.pushIfNotExist(element, function(e) {
  //         return e.group_id === element.group_id;
  //       });
  //     }
  //   } else {
  //     userGroups = userGroups.filter(item => item.group_id !== user.userGroup.group_id);
  //     if (this.props.isAddMode && userGroups && userGroups.length) {
  //       groupField.value = userGroups[0].group_id;
  //     }
  //   }
  //
  //   groupField.config.options = userGroups.reduce((arr, userGroup) => {
  //     let findIndex = arr.findIndex(a => a.label === userGroup.category);
  //
  //     if (findIndex !== -1) {
  //       arr[findIndex].options.push({
  //         val: userGroup._id,
  //         text: userGroup.name,
  //       });
  //     } else {
  //       arr.push({
  //         label: userGroup.category,
  //         options: [
  //           {
  //             val: userGroup._id,
  //             text: userGroup.name,
  //           },
  //         ],
  //       });
  //     }
  //     return arr;
  //   }, []);
  //
  //   if (setInitialValue) groupField.value = groupField.config.options.length ? [groupField.config.options[0].val] : [];
  //
  //   if (groupField.value) {
  //     groupField.value = this.userGroupsValueProcess(groupField.value, userGroups);
  //   }
  //
  //   return groupField;
  // }
  //
  // updateForm(user, isAddMode = true) {
  //   const userObj = {
  //     name: getValue(user.name),
  //     // firstName: getValue(user.firstName),
  //     // lastName: getValue(user.lastName),
  //     email: getValue(user.email),
  //     password: isAddMode ? getValue(user.password) : "**********",
  //     passwordConfirm: isAddMode ? getValue(user.passwordConfirm) : "**********",
  //     group_id: getValue(user.group_id),
  //     genericEmail: getValue(user.genericEmail),
  //     // subdivision: isAddMode ? this.setSubDiv() : getValue(user.subdivision),
  //     department: getValue(user.department),
  //     address: getValue(user.address),
  //     phone: getValue(user.phone),
  //     mobile: getValue(user.mobile),
  //     active: getValue(user.active),
  //     group_name: this.getUserGroupName(getValue(user.group_id)),
  //   };
  //   // console.log(userObj);
  //   //this.setState({initialState:userObj});
  //   this.initialState = userObj;
  //   // this.formDispatch(actions.reset("user"));
  //   // this.formDispatch(actions.change("user", userObj));
  //   this.setState({ initialState: userObj });
  // }

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

  updateFormState = newState => this.setState({
      ...newState,
      preValidation: {
          show: false,
          inspectorSwitch: false,
          inspectorToAssign: null,
          isTeamLead: false,
          isAssignedToTeam: false,
      }
  });

  render() {
    const passwordToggle = this.state.passwordToggle;
    const { isAddMode, levelList } = this.props;
    //console.log(levelList);
    // let options = null;
    // const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // if (levelList) {
    //   options = this.props.userGroups.map((group, i) => {
    //     let spaces = Array(i).fill("---");
    //     return (
    //       <option key={group.group_id} value={group.group_id}>
    //         {group.name}
    //       </option>
    //     );
    //   });
    // }

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
                                if (user.group_id === "inspector" && user._id !== this.props.user._id) {
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
                            {`${this.props.user.name} ${languageService('is currently leading a Team. If you change the role, team will no longer exist and team members will need to be re-assigned to a new team')}.`}
                            <div>{languageService('Do you want to proceed')}?</div>
                        </div>

                    </React.Fragment>
                )}

                {this.state.preValidation.isAssignedToTeam && (
                    <React.Fragment>
                        <div style={{ color: "red" }}>
                            <strong>{languageService("Note")}: </strong>
                            {`${this.props.user.name} ${languageService('is currently assigned to a Team. If you change the role, this team member will be removed from current team and will need to be re-assigned to a new team')}.`}
                            <div>{languageService('Do you want to proceed')}?</div>
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

        <UserHoursWrapper setGlobalGeoLocOpt={this.setGlobalGeoLocOpt}>
          <UserHours
            toggle={this.props.showUserHours}
            modal={this.props.showUserHours}
            userHours={this.props.userHours.userHours}
            update={this.props.onUpdateUserHours}
            onCancel={this.props.onClickUserHours}
            onClickBreak={this.props.toggleBreakClick}
            onChangeStart={this.props.onChangeStartTime}
            onChangeEnd={this.props.onChangeEndTime}
            onChangeStartBreak={this.props.onChangeStartBreakTime}
            onChangeEndBreak={this.props.onChangeEndBreakTime}
            onChangeBreakTag={this.props.onChangeBreakTag}
          >
            {this.state.globalUserLoggingAllow && (
              <div style={{ padding: "20px" }}>
                <InputCheckBoxField
                  label="Record GPS Location of User"
                  labelPos={0}
                  ClickHandler={this.props.handleUserGeoLocLoggingCheck}
                  checked={this.props.userLoggingValue}
                />
              </div>
            )}
          </UserHours>
        </UserHoursWrapper>
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
