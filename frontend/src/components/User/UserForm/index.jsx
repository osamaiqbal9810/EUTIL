import React, { Component } from "react";
import { UserCreateProfileViewAvatar } from "components/SetupPage/User/UserCreate/UserCreateProfileView.jsx";
import { UserProfileViewAvatar } from "./UserFormViews.jsx";
import { Row, Col, Button, Checkbox, ControlLabel, FormControl, Modal } from "reactstrap";
import { isJSON } from "utils/isJson";
import _ from "lodash";
import "react-overlay-loader/styles.css";
import UForm from "./UserForm";
import { clock } from "react-icons-kit/iconic/clock";
import ConfirmationDialog from "components/Common/ConfirmationDialog";

import { languageService } from "../../../Language/language.service";
import { CommonFormStyle } from "./style/index";
import { themeService } from "theme/service/activeTheme.service";

import { userStyles } from "../style/userStyles";


class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
    this.showPermissionView = this.showPermissionView.bind(this);
    this.hidePermissionView = this.hidePermissionView.bind(this);
    this.updatePermissonsHandle = this.updatePermissonsHandle.bind(this);
    this.userDelete = this.userDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.currentUserPermissionFunction = this.currentUserPermissionFunction.bind(this);
    this.loadUserData = this.loadUserData.bind(this);
    this.setUserData = this.setUserData.bind(this);
    this.getLocalUser = this.getLocalUser.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleConfirmationToggle = this.handleConfirmationToggle.bind(this);
    this.handleUserGeoLocLoggingCheck = this.handleUserGeoLocLoggingCheck.bind(this);
  }

  componentDidMount() {
    const { isAddMode } = this.props;
    this.loadUserData(this.props.userIdToFetch, isAddMode);
  }
  componentDidUpdate(prevProps, prevState) {

      if (prevProps.userDetailActionType !== this.props.userDetailActionType && this.props.userDetailActionType === 'USER_WITH_DETAIL_SUCCESS')  {
        this.setUserData(this.props.userDetail.user);
      }

      if (prevProps.userActionType !== this.props.userActionType && this.props.userActionType === 'USER_CREATE_SUCCESS')  {
          this.setState({isAddMode: false});
      }
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
      userLoggingValue: false,
      deleteConfirmMessage: 'Are you sure you want to delete ?',
    };
  }
  setUserData(userData) {
    let deleteBtn = false;
    if (userData) {
      userData = _.cloneDeep(userData);

      const loggedInUser = localStorage.getItem("loggedInUser");
      const currentUser = JSON.parse(loggedInUser);
      deleteBtn = !this.props.isAddMode && currentUser._id !== userData._id;
      this.setState({
        user: {
            ...userData
        },
        userId: userData._id,
        isDeleteBtnEnable: deleteBtn,
        submitButtonDisabled: true,
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
  loadUserData(userIdToFetch, isAddMode) {
    const userID = userIdToFetch && userIdToFetch != "" ? userIdToFetch : null;

    if (userID) {
      this.props.getUserWithDetail(userIdToFetch);
    }
  }
  handleSubmit(e) {
    let { password } = e;
    if (!this.state.isAddMode) {
        let userObj = Object.assign({}, this.state.user);
        Object.assign(userObj, e);
      if (password) {
        this.props.passwordUpdate(password, this.state.userId);
      }
      if (JSON.stringify(userObj) != JSON.stringify(this.state.user)) {
        //only if object is changed
        this.props.updateUser(userObj, this.state.userId);
      }
    } else {
      if ('_id' in e) {
          delete e._id;
      }

      this.props.createUser(e);
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

  componentWillReceiveProps(nextProps) {
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

  }

  handleUserGeoLocLoggingCheck(checkVal) {
    this.setState({
      userLoggingValue: checkVal,
    });
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
                selfUser={this.props.selfUser}
                userDelete={this.userDelete}
                isDeleteBtnEnable={this.state.isDeleteBtnEnable && !this.state.isAddMode}
                isAddMode={isAddMode}
                levelList={filteredLevelList}
                userLoggingValue={this.state.userLoggingValue}
                handleUserGeoLocLoggingCheck={this.handleUserGeoLocLoggingCheck}
                assetHelperActionType={this.props.assetHelperActionType}
                userWorkPlans={this.props.userWorkPlans}
                templateHelperActionType={this.props.templateHelperActionType}
                userGroupActionType={this.props.userGroupActionType}
                getUserInspectionPlan={this.props.getUserInspectionPlan}
                getUserByEmail={this.props.getUserByEmail}
                userList={this.props.userList}
                userDetail={this.props.userDetail}
                userDetailActionType={this.props.userDetailActionType}
                userActionType={this.props.userActionType}
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
