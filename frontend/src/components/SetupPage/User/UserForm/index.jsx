import React, { Component } from "react";
import { UserCreateProfileViewAvatar } from "components/SetupPage/User/UserCreate/UserCreateProfileView.jsx";
import { UserProfileViewAvatar, UserProfileViewTitleBar } from "./UserFormViews.jsx";
import { Row, Col, Button, Checkbox, FormGroup, ControlLabel, FormControl, Modal, UncontrolledTooltip } from "reactstrap";
//import { UserProfileHeaderIcon } from '../../../images/imageIcons/index.js'
import { isJSON } from "utils/isJson";
import _ from "lodash";
import * as types from "reduxRelated/ActionTypes/actionTypes.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingOverlay, Loader } from "react-overlay-loader";
import NumberFormat from "react-number-format";
//import permissionCheck from "../../../utils/permissionCheck.js";
import "react-overlay-loader/styles.css";
import UForm from "./UserForm";
import { clock } from "react-icons-kit/iconic/clock";
import SvgIcon from "react-icons-kit";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
//import UserPermissions from "./UserPermissions.jsx";
import { languageService } from "../../../../Language/language.service";
import { CommonFormStyle } from "./style/index";
import { themeService } from "theme/service/activeTheme.service";

import { userStyles } from "../style/userStyles";

const permission = JSON.parse(isJSON(localStorage.getItem("permissions")));

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.hours = {
      userHours: [
        {
          checkboxLabel: "Monday",
          startTime: "",
          endTime: "",
          toggleBreak: false,
          breakTag: "",
          breakStartTime: "",
          breakEndTime: "",
        },
        {
          checkboxLabel: "Tuesday",
          startTime: "",
          endTime: "",
          toggleBreak: false,
          breakTag: "",
          breakStartTime: "",
          breakEndTime: "",
        },
        {
          checkboxLabel: "Wednesday",
          startTime: "",
          endTime: "",
          toggleBreak: false,
          breakTag: "",
          breakStartTime: "",
          breakEndTime: "",
        },
        {
          checkboxLabel: "Thursday",
          startTime: "",
          endTime: "",
          toggleBreak: false,
          breakTag: "",
          breakStartTime: "",
          breakEndTime: "",
        },
        {
          checkboxLabel: "Friday",
          startTime: "",
          endTime: "",
          toggleBreak: false,
          breakTag: "",
          breakStartTime: "",
          breakEndTime: "",
        },
        {
          checkboxLabel: "Saturday",
          startTime: "",
          endTime: "",
          toggleBreak: false,
          breakTag: "",
          breakStartTime: "",
          breakEndTime: "",
        },
        {
          checkboxLabel: "Sunday",
          startTime: "",
          endTime: "",
          toggleBreak: false,
          breakTag: "",
          breakStartTime: "",
          breakEndTime: "",
        },
      ],
    };
    this.state = this.getInitialState();
    this.state["departments"] = [];

    ////console.log(this.state.user);
    this.showPermissionView = this.showPermissionView.bind(this);
    this.hidePermissionView = this.hidePermissionView.bind(this);
    this.updatePermissonsHandle = this.updatePermissonsHandle.bind(this);
    this.userDelete = this.userDelete.bind(this);
    // this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.currentUserPermissionFunction = this.currentUserPermissionFunction.bind(this);
    this.loadUserData = this.loadUserData.bind(this);
    this.setUserData = this.setUserData.bind(this);
    this.getLocalUser = this.getLocalUser.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.onClickUserHours = this.onClickUserHours.bind(this);
    this.onUserHoursUpdate = this.onUserHoursUpdate.bind(this);
    this.onChangeBreakTag = this.onChangeBreakTag.bind(this);
    this.onChangeEndBreakTime = this.onChangeEndBreakTime.bind(this);
    this.onChangeStartBreakTime = this.onChangeStartBreakTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.toggleBreakClick = this.toggleBreakClick.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleConfirmationToggle = this.handleConfirmationToggle.bind(this);
    this.handleUserGeoLocLoggingCheck = this.handleUserGeoLocLoggingCheck.bind(this);
  }
  getLocalUser() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const user = JSON.parse(loggedInUser);
    if (user) {
      this.setState({ userId: user._id, isAddMode: false });
    }
  }
  getInitialState(isAddMode = false) {
    return {
      userId: "",
      user: {
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        // level: { id: 0, desc: "" },
        address: "",
        phone: "",
        mobile: "",
        group_id: "",
        genericEmail: "",
        subdivision: "",
        department: "",
        assignedLocation: "",
        assignedLocationName: "",
        active: false,
        isAdmin: false,
        isCurrentUser: false,
      },
      confirmationDialog: false,
      submitButtonDisabled: true,
      showModal: false,
      currentUserId: "",
      setPasswordButton: true,
      changePasswordButtonDisabled: true,
      totalPermissions: [],
      permisssionsAvailable: [],
      permissionsAssigned: [],
      userPermissions: [],
      showPermissionView: false, // Should be set false by default here

      isDeleteBtnEnable: false,
      isPermissionMngAllowed: false,

      showValidationModal: false,
      showConfirmModal: false,
      modalMsg: "",
      modalTitle: "",

      formVisible: true,
      isAddMode: isAddMode,
      editMode: false,
      isAdminLoggedOn: false,
      levelList: [],
      isUserHours: false,
      userAvailability: { userId: "", userHours: this.hours },
      userHoursTemplate: this.hours.userHours,
      userLoggingValue: false,
      deleteConfirmMessage: 'Are you sure you want to delete ?',
    };
  }
  componentDidMount() {
    //    const { permissionList, levelList } = this.props;
    const { isAddMode } = this.props;

    // if (permissionList.length == 0) {
    //     this.props.getPermissionList();
    // } else {
    //     this.setState({
    //         permisssionsAvailable: permissionList,
    //         userPermissions: permissionList,
    //     });
    // }
    // if (this.state.levelList.length == 0) {
    //     this.props.getLevelList();
    // } else {
    //     this.setState({
    //         levelList: levelList,
    //     });
    // }
    ////console.log(this.props.userIdToFetch);

    this.loadUserData(this.props.userIdToFetch, isAddMode);

    this.props.getApplicationLists(["departments", "mainte"]);

    // this.props.getUserHours(this.props.userIdToFetch);
  }
  setUserData(userData) {
    let deleteBtn = false;
    if (userData) {
      userData = _.cloneDeep(userData);

      let address = "";
      let phone = "";
      let mobile = "";
      let active = false;
      if (userData.address) {
        address = userData.address;
      }
      if (userData.phone) {
        phone = userData.phone;
      }
      if (userData.mobile) {
        mobile = userData.mobile;
      }
      if (userData.active) {
        active = userData.active;
      }
      // let permissionList = this.props.permissionList;
      // let copyPermissionList = [...permissionList];
      // let tempAssignedPermission = userData.permissions;
      // tempAssignedPermission.forEach(function(assignedPerm) {
      //     _.remove(copyPermissionList, function(element) {
      //         return element.value == assignedPerm.value;
      //     });
      // }, this);
      const loggedInUser = localStorage.getItem("loggedInUser");
      const currentUser = JSON.parse(loggedInUser);
      if (currentUser._id == userData._id) {
        deleteBtn = false;
      } else {
        deleteBtn = true;
      }
      this.setState({
        user: {
          name: userData.name,
          _id: userData._id,
          email: userData.email,
          // level: {
          //     id: userData.level,
          //     desc: userData.levels.desc,
          // },
          group_id: userData.group_id,
          genericEmail: userData.genericEmail,
          subdivision: userData.subdivision,
          department: userData.department,
          assignedLocation: userData.assignedLocation,
          assignedLocationName: userData.assignedLocationName,
          userGroups: userData.userGroups,
          address: address,
          phone: phone,
          mobile: mobile,
          active: active,
          isAdmin: userData.isAdmin,
          team: userData.team,
          teamLead: userData.teamLead,
          isCurrentUser: currentUser && currentUser._id === userData._id,
        },
        // userPermissions: userData.permissions,
        // permissionsAssigned: userData.permissions,
        // permisssionsAvailable: copyPermissionList,
        userId: userData._id,
        isDeleteBtnEnable: deleteBtn,
        submitButtonDisabled: true,
        isAdminLoggedOn: currentUser.isAdmin,
        userAvailability: { userId: userData._id, userHours: userData.userHours ? userData.userHours : this.hours },
        userLoggingValue: userData.userHours ? (userData.userHours.userLocLogging ? userData.userHours.userLocLogging : false) : false,
      });
      this.setState({
        setPasswordButton: true,
        changePasswordButtonDisabled: true,
      });
    }
  }
  getCurrentUser() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    let currentUser;
    if (loggedInUser && loggedInUser !== "undefined") {
      currentUser = JSON.parse(loggedInUser);
    }
    return currentUser;
  }
  /*load user data of provided user  or if isAddMode is true will reset the state to empty
    if userIdToFetch isn't provided and isAddMode is false then will load default login user
    */
  loadUserData(userIdToFetch, isAddMode) {
    const userID = userIdToFetch && userIdToFetch != "" ? userIdToFetch : null;
    const loggedInUser = localStorage.getItem("loggedInUser");
    let currentUser;
    if (loggedInUser && loggedInUser !== "undefined") {
      currentUser = JSON.parse(loggedInUser);
    }

    if (userID) {
      // debugger;
      this.props.getUserWithDetail(userIdToFetch);
    } else {
      if (isAddMode) {
        const nextState = this.getInitialState();
        if (currentUser) {
          // nextState.user.level.id = currentUser.level.id;
          // nextState.user.level.desc = currentUser.level.desc;
          nextState.isAdminLoggedOn = currentUser.isAdmin;
        }
        this.setState(nextState);
      } else {

        if (currentUser) {
          this.setState({
            user: {
              name: currentUser.name,
              email: currentUser.email,
              // level: {
              //     id: currentUser.level,
              //     desc: currentUser.levels.desc,
              // },
              address: currentUser.address,
              phone: currentUser.phone,
              mobile: currentUser.mobile,
              active: currentUser.active,
              isAdmin: currentUser.isAdmin,
              userGroups: currentUser.userGroups,
              assignedLocationName: currentUser.assignedLocationName,
              isCurrentUser: true,
            },
            // userPermissions: currentUser.permissions,
            // permissionsAssigned: currentUser.permissions,
            // permissionsAvailable: permissionsAvailable || currentUser.permissions,
            userId: currentUser._id,
            isDeleteBtnEnable: false,
            isAddMode: false,
            isAdminLoggedOn: currentUser.isAdmin,
          });
          if (currentUser.isAdmin) {
            this.setState({ isPermissionMngAllowed: true });
          }
        }
      }
    }
  }
  onChangeStartTime(index, e) {
    //console.log(this,index, e.target.value);
    let copyOfHours = _.clone(this.state.userAvailability);
    copyOfHours.userHours.userHours[index].startTime = e.target.value;
    this.setState({ userAvailability: copyOfHours });
  }
  onChangeEndTime(index, e) {
    //console.log(index, e.target.value);
    let copyOfHours = _.clone(this.state.userAvailability);
    copyOfHours.userHours.userHours[index].endTime = e.target.value;
    this.setState({ userAvailability: copyOfHours });
  }
  onChangeStartBreakTime(index, e) {
    //console.log(index, e.target.value);
    let copyOfHours = _.clone(this.state.userAvailability);
    copyOfHours.userHours.userHours[index].breakStartTime = e.target.value;
    this.setState({ userAvailability: copyOfHours });
  }
  onChangeEndBreakTime(index, e) {
    //console.log(index, e.target.value);
    let copyOfHours = _.clone(this.state.userAvailability);
    copyOfHours.userHours.userHours[index].breakEndTime = e.target.value;
    this.setState({ userAvailability: copyOfHours });
  }
  toggleBreakClick(index, value) {
    let copyOfHours = _.clone(this.state.userAvailability);
    copyOfHours.userHours.userHours[index].toggleBreak = value;
    this.setState({ userAvailability: copyOfHours });
  }
  onChangeBreakTag(index, e) {
    let copyOfHours = _.clone(this.state.userAvailability);
    copyOfHours.userHours.userHours[index].breakTag = e.target.value;
    this.setState({ userAvailability: copyOfHours });
  }
  onClickUserHours(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({ isUserHours: !this.state.isUserHours });
  }
  onUserHoursUpdate(userHours) {
    let userHoursObj = { ...this.state.userAvailability.userHours };
    userHoursObj.userLocLogging = this.state.userLoggingValue;
    this.props.updateUserHours(this.props.userIdToFetch, userHoursObj);
    this.onClickUserHours();
  }

  handleSubmit(e) {
    let { password } = e;
    let userObj = Object.assign({}, this.state.user);
    Object.assign(userObj, e);

    // console.log('userobj', userObj);
    // return 0;
    if (this.state.userId) {
      if (password) {
        this.props.passwordUpdate(password, this.state.userId);
      }
      if (JSON.stringify(userObj) != JSON.stringify(this.state.user)) {
        //only if object is changed
        this.props.updateUser(userObj, this.state.userId);
      }
    } else {
      this.props.createUser(userObj);
      this.setState({ isAddMode: false });
    }
  }
  currentUserPermissionFunction(assignedPermissionList, availablePermissionList) {
    _.forEach(assignedPermissionList, function (permission) {
      _.remove(availablePermissionList, function (element) {
        return element.value == permission.value;
      });
    });

    return availablePermissionList;
  }
  showPermissionView() {
    this.setState({
      showPermissionView: true,
    });
  }
  hidePermissionView() {
    this.setState({
      showPermissionView: false,
    });
  }
  updatePermissonsHandle(userPermissionList) {
    //    //console.log("Update this Permission List");
    //   //console.log(userPermissionList);
    const { user } = this.state;
    const userObj = {
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      mobile: user.mobile,
      active: user.active,
      permissions: userPermissionList,
    };
    const userId = this.state.userId;
    if (userId) {
      this.props.updateUser(userObj, userId);
    }
  }

  showToastInfo(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  showToastError(message, error) {
    toast.error(message + ": " + error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  async userDelete(e) {
    e.preventDefault();

    let deleteConfirmMessage = "Are you sure you want to delete ?";
    if (this.state.user.group_id === 'supervisor' && this.state.user.team && this.state.user.team.length) {
      // TeamLead
      deleteConfirmMessage = `${this.state.user.name} ${languageService('is currently leading a Team. If you delete this user, team will no longer exist and team members will need to be re-assigned to a new team')}`;
    } else if (this.state.user.group_id === "inspector") {
      if (this.state.user.teamLead) {
        deleteConfirmMessage = `${this.state.user.name} ${languageService('is currently assigned to a Team. If you delete this user, this team member will be removed from current team')}.`;
      }
    }

    this.setState({
      confirmationDialog: true,
      deleteConfirmMessage
    });
    // this.setState({
    //     showConfirmModal: true,
    //     modalTitle: "Confirmation",
    //     modalMsg: `Are you sure ! You want to delete user: ${this.state.user.name}`,
    // });
  }

  handleConfirmationToggle() {
    this.setState({
      confirmationDialog: !this.state.confirmationDialog,
    });
  }
  handleConfirmation(response) {
    if (response) {
      const { userId } = this.state;
      this.props.deleteUser(userId);
    }
    this.setState({
      confirmationDialog: false,
    });
  }

  // onConfirmDelete() {
  //     //   //console.log("Delete User");
  //     if (this) {
  //         this.setState({ showConfirmModal: false });
  //         const { userId } = this.state;

  //     }
  // }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.applicationlookupsActionType !== prevProps.applicationlookupsActionType &&
      this.props.applicationlookupsActionType === "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {
      this.setApplicationLists(this.props.applicationlookupss);
    }

    if (prevProps.userDetailActionType !== this.props.userDetailActionType && this.props.userDetailActionType === 'USER_WITH_DETAIL_SUCCESS')  {
      this.setUserData(this.props.userDetail.user);
    }
  }

  componentWillReceiveProps(nextProps) {
    //Handled User Create Responses
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_CREATE_SUCCESS) {
      //   this.showToastInfo("User Successfully Created !");
      let reinit = "";
      const userObj = {
        fullName: reinit,
        email: reinit,
        password: reinit,
        passwordConfirm: reinit,
        address: reinit,
        phone: reinit,
        mobile: reinit,
        active: false,
        level: { id: 0, desc: "" },
      };
      this.setState({
        userId: "",
        user: userObj,
        permissions: reinit,
        isAddMode: true,
      });
      //this.showToastInfo("User Created Successfully !");
    } else if (
      (this.props.actionType !== nextProps.actionType || this.props.userIdToFetch !== nextProps.userIdToFetch) &&
      (nextProps.actionType == types.USER_LIST_SUCCESS || nextProps.actionType == types.USER_GET_SUCCESS)
    ) {
      let userData = nextProps.selectedUser;
      let findUser = nextProps.userList.find((u) => u.email === userData.email);

      if (findUser && findUser.group_id !== userData.group_id) this.setUserData(findUser);

      if (this.props.userIdToFetch !== nextProps.userIdToFetch) {
        this.loadUserData(nextProps.userIdToFetch, false);
        //   this.props.getUserHours(nextProps.userIdToFetch);
      }
    }
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_CREATE_FAILURE) {
      this.showToastError(languageService("Failed to Create User !"), languageService(nextProps.errorMessage));
    }
   /**
    * Logic change on user load ***************
    *
    *
    if (nextProps.selectedUser !== this.props.selectedUser && nextProps.actionType == types.USER_GET_SUCCESS) {
      let userData = nextProps.selectedUser;
      this.setUserData(userData);
    }
    */
    //Handled User Profile Update Responses
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_UPDATE_SUCCESS) {
      this.showToastInfo(languageService("User Successfully Updated !"));
      this.props.getUserList();
    }
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_UPDATE_FAILURE) {
      this.showToastError(languageService("Error"), languageService(nextProps.errorMessage));
    }

    //Handled User Password Update Responses
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.PASSWORD_UPDATE_SUCCESS) {
      //this.showToastInfo(languageService("Password Updated !"));
    }
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.PASSWORD_UPDATE_FAILURE) {
      this.showToastError(languageService("Error"), languageService(nextProps.errorMessage));
    }

    //Handled User Delete Responses
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_DELETE_SUCCESS) {
      this.showToastInfo(languageService("User Deleted !"));
      this.loadUserData(null, false);
      this.props.getUserList();
    }

    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_DELETE_FAILURE) {
      this.showToastError(languageService("Failed to Delete User!"), languageService(nextProps.errorMessage));
    }

    if (this.props.userIdToFetch !== nextProps.userIdToFetch) {
      this.loadUserData(nextProps.userIdToFetch, nextProps.isAddMode);
      //    this.props.getUserHours(nextProps.userIdToFetch);
    }

    if (this.state.isAddMode != nextProps.isAddMode) {
      if (nextProps.isAddMode) {
        const currentUser = this.getCurrentUser();
        const nextState = this.getInitialState(nextProps.isAddMode);
        // nextState.user.level.id = currentUser.level;
        // nextState.user.level.desc = currentUser.levels.desc;
        nextState.isAdminLoggedOn = currentUser.isAdmin;
        //nextState.levelList=new Array(this.state.levelList);
        // nextState.levelList = [].concat(this.state.levelList);
        this.setState(nextState);
      } else {
        this.setState({ isAddMode: nextProps.isAddMode });
      }
    }

    // if(this.props.actionType !== nextProps.actionType &&
    //     nextProps.actionType== types.LEVEL_LIST_SUCCESS){
    //         this.setState({levelList: nextProps.levelList})
    // }

    // if(this.props.actionType !== nextProps.actionType &&
    //     nextProps.actionType== types.LEVEL_LIST_FAILURE){
    //         this.showToastError("Failed to Get User Levels!", nextProps.errorMessage);
    // }

    ////console.log('index.jsx: componentWillReceiveProps');
    ////console.log(nextProps);
    // if (this.props.actionType !== nextProps.actionType && nextProps.actionType === types.GET_USERHOURS_SUCCESS) {
    //   if (!_.isEmpty(nextProps.userHours)) {
    //     this.setState({ userAvailability: nextProps.userHours });
    //   } else {
    //     let availability = _.clone(this.state.userAvailability);
    //     availability.userId = this.props.userIdToFetch;
    //     availability.userHours = _.clone(this.state.userHoursTemplate);
    //     this.setState({ userAvailability: availability });
    //   }
    // }
    // if (this.props.actionType !== nextProps.actionType && nextProps.actionType === types.UPDATE_USERHOURS_SUCCESS) {
    //   this.setState({ isUserHours: !this.state.isUserHours });
    // }
  }

  handleUserGeoLocLoggingCheck(checkVal) {
    this.setState({
      userLoggingValue: checkVal,
    });
  }
  getListType(listName, lists) {
    let list = lists.filter((v) => {
      return v.listName === listName;
    });
    list = list.map((v) => {
      return v.description;
    });

    return list;
  }
  setApplicationLists(lists) {
    if (lists && lists.length) {
      let departments = this.getListType("departments", lists);
      this.setState({ departments: departments });
    }
  }

  render() {
    const { isAddMode, userId, levelList, user, isAdminLoggedOn } = this.state;
    let filteredLevelList;

    if (levelList && user.level && (!isAdminLoggedOn || user.isAdmin)) {
      filteredLevelList = levelList.filter((item) => item.level === user.level.id);
    } else {
      filteredLevelList = levelList;
    }
    let content = null;
    if (this.state.showPermissionView) {
    } else {
      content = (
        <div>
          <Row style={themeService(userStyles.staffTopRowStyle)}>
            <div style={themeService(userStyles.staffListHeadingStyle)}>
              {!isAddMode ? languageService("Staff Profile") : languageService("Add New Staff")}
            </div>
            {/* <div style={{ padding: "15px 15px 0px 15px", fontSize: "large", color: "rgba(64, 118, 179)", fontWeight: "bold" }}>
              <a href="#" onClick={this.onClickUserHours} style={{ color: "rgba(64, 118, 179)" }}>
                <UncontrolledTooltip placement="right" target="hours">
                  {languageService("Adjust Availability Hours")}
                </UncontrolledTooltip>
                <SvgIcon id="hours" size={25} icon={clock} />
              </a>
            </div> */}
          </Row>

          <Row style={themeService(CommonFormStyle.formStyle)}>
            {!isAddMode ? (
              <UserProfileViewAvatar ProfileName={this.state.user.name} email={this.state.user.email} />
            ) : (
              <UserCreateProfileViewAvatar />
            )}
          </Row>

          <Row className="row-eq-height" style={themeService(CommonFormStyle.formStyle)}>
            <Col md={12}>
              <UForm
                userId={userId}
                user={this.state.user}
                handleSubmit={this.handleSubmit}
                userDelete={this.userDelete}
                isDeleteBtnEnable={this.state.isDeleteBtnEnable && !this.state.isAddMode}
                isAddMode={isAddMode}
                levelList={filteredLevelList}
                userGroups={this.props.userGroups}
                subdivisions={this.props.subdivisions}
                showUserHours={this.state.isUserHours}
                onClickUserHours={this.onClickUserHours}
                onUpdateUserHours={this.onUserHoursUpdate}
                userHours={this.state.userAvailability.userHours}
                onChangeStartTime={this.onChangeStartTime}
                onChangeEndTime={this.onChangeEndTime}
                onChangeStartBreakTime={this.onChangeStartBreakTime}
                onChangeEndBreakTime={this.onChangeEndBreakTime}
                onChangeBreakTag={this.onChangeBreakTag}
                toggleBreakClick={this.toggleBreakClick}
                userLoggingValue={this.state.userLoggingValue}
                handleUserGeoLocLoggingCheck={this.handleUserGeoLocLoggingCheck}
                assets={this.props.assets}
                departments={this.state.departments}
                lineAssets={this.props.lineAssets}
                assetHelperActionType={this.props.assetHelperActionType}
                userWorkPlans={this.props.userWorkPlans}
                templateHelperActionType={this.props.templateHelperActionType}
                userGroupActionType={this.props.userGroupActionType}
                getUserInspectionPlan={this.props.getUserInspectionPlan}
                getUserByEmail={this.props.getUserByEmail}
                userList={this.props.userList}
                userDetail={this.props.userDetail}
              />
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <Row
        style={{
          backgroundColor: "#fff",
          boxShadow: " 3px 3px 5px #cfcfcf",
          borderRadius: "5px",
        }}
      >
        {/*<ToastContainer />*/}
        {this.state.showModal && (
          <div className="static-modal">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Validation Error</Modal.Title>
              </Modal.Header>

              <Modal.Body>{this.state.modalMsg}</Modal.Body>

              <Modal.Footer>
                <Button
                  bsStyle="warning"
                  onClick={() => {
                    this.setState({ showModal: false });
                  }}
                >
                  {languageService("Close")}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>
        )}

        {/* {this.state.showConfirmModal && (
                    <ModalDialog
                        modalTitle={this.state.modalTitle}
                        modalMessage={this.state.modalMsg}
                        onClose={() => {
                            this.setState({showConfirmModal: false})
                        }}
                        onConfirm={this.onConfirmDelete}
                    />)} */}

        <Col md={12} className="scrollbar">
          <ConfirmationDialog
            modal={this.state.confirmationDialog}
            toggle={this.handleConfirmationToggle}
            handleResponse={this.handleConfirmation}
            confirmationMessage={<div style={{ color: "red" }}>{languageService(this.state.deleteConfirmMessage)}</div>}
            headerText={languageService("Confirm Deletion")}
          />
          {content}
        </Col>
      </Row>
    );
  }
}

export default UserForm;
