/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Col } from "reactstrap";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { getMultiLineData } from "reduxRelated/actions/lineSelectionAction";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
import { retroColors } from "style/basic/basicColors";
import { getStatusColor } from "utils/statusColors";
import {Row, Tooltip} from "reactstrap";
import {themeService} from "../../theme/service/activeTheme.service";
import {userStyles} from "../SetupPage/User/style/userStyles";
import {languageService} from "../../Language/language.service";
import permissionCheck from "../../utils/permissionCheck";
import {ButtonMain} from "../Common/Buttons";
import UserList from "./UserList/UserList";
import { personAdd } from "react-icons-kit/ionicons/personAdd";
import {
    userListRequest,
    getUserWithDetail,
    getUserByEmail,
    userCreate,
    userUpdate,
    userDelete,
    updatePassword
} from "../../reduxRelated/actions/userActions";
import { inspectorsPlan } from "../../reduxRelated/actions/templateHelperActions";

import UserForm from "./UserForm";
import {
    getWarningMessage,
    USER_LIST_TO_UPDATE,
    USER_LOADING_START_ACTIONS,
    USER_LOADING_STOP_ACTIONS, USER_TOAST_MESSAGES_ACTIONS
} from "./userUtils";
import {toast} from "react-toastify";


class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUserId: "",
            addUser: false,
            currentUser: null,
            tooltipOpen: false,
            userGroups: [],
            departments: [],
            spinnerLoading: false,
            selfUser: true
        };
        this.handleClickUserList = this.handleClickUserList.bind(this);
        this.handleAddUserClick = this.handleAddUserClick.bind(this);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.showToastInfo = this.showToastInfo.bind(this);
    }
    handleAddUserClick(e) {
        this.setState({
            selectedUserId: "",
            addUser: true,
        });
    }
    handleClickUserList(e, rowInfo) {
        let idUser = rowInfo.original._id;
        this.setState({
            selectedUserId: idUser,
            addUser: false,
        });
    }
    toggleTooltip() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen,
        });
    }
    componentWillMount() {
        const loggedInUser = localStorage.getItem("loggedInUser");
        const currentUser = JSON.parse(loggedInUser);
        if (currentUser) {
            this.setState({
                selectedUserId: currentUser._id,
                addUser: false,
                currentUser: currentUser,
            });
        }
    }
    componentDidMount() {
        let viewUserCheck = permissionCheck("USER", "view");
        if (!viewUserCheck) {
            this.props.history.push("/");
        }
    }
    showToastInfo(message) {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT,
        });
    }
    showToastError(message) {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.userActionType !== prevProps.userActionType) {
            if (USER_LOADING_START_ACTIONS.includes(this.props.userActionType))
                this.setState({spinnerLoading: true});

            if (USER_LOADING_STOP_ACTIONS.includes(this.props.userActionType))
                this.setState({spinnerLoading: false});


            if (USER_TOAST_MESSAGES_ACTIONS.includes(this.props.userActionType)) {
                if (this.props.userActionType.includes('FAILURE'))
                    this.showToastError(languageService(this.props.userErrorMessage) || languageService(getWarningMessage(this.props.userActionType)));
                else if (this.props.userActionType.includes('SUCCESS'))
                    this.showToastInfo(languageService(getWarningMessage(this.props.userActionType)));
            }


            if (USER_LIST_TO_UPDATE.includes(this.props.userActionType))
                this.props.userListRequest();

            if (this.props.userActionType === 'USER_DELETE_SUCCESS') {
                const loggedInUser = localStorage.getItem("loggedInUser");
                const currentUser = JSON.parse(loggedInUser);
                this.setState({selectedUserId: currentUser._id});
            }

            if (this.props.userActionType === 'USER_UPDATE_SUCCESS') {
               this.props.getUserWithDetail(this.state.selectedUserId);
            }
        }

        if (this.props.userDetailActionType !== prevProps.userDetailActionType) {
            if (USER_LOADING_START_ACTIONS.includes(this.props.userDetailActionType))
                this.setState({spinnerLoading: true});

            if (USER_LOADING_STOP_ACTIONS.includes(this.props.userDetailActionType))
                this.setState({spinnerLoading: false});
        }


        if (this.state.selectedUserId !== prevState.selectedUserId) {
            const loggedInUser = localStorage.getItem("loggedInUser");
            const currentUser = JSON.parse(loggedInUser);
            if (this.state.selectedUserId)
                this.props.getUserWithDetail(this.state.selectedUserId);
            else
                this.props.getUserWithDetail(currentUser._id);

            this.setState({selfUser: this.state.selectedUserId === currentUser._id});
        }
    }

    render() {
        let userProfile = null;
        if (this.state.selectedUserId || this.state.addUser) {
            userProfile = (
                <Col md={7}>
                    <UserForm
                        userIdToFetch={this.state.selectedUserId}
                        isAddMode={this.state.addUser}
                        assetHelperActionType={this.props.assetHelperActionType}
                        userDetailActionType={this.props.userDetailActionType}
                        userWorkPlans={this.props.workplans}
                        templateHelperActionType={this.props.templateHelperActionType}
                        getUserInspectionPlan={this.props.inspectorsPlan}
                        getUserByEmail={this.props.getUserByEmail}
                        getUserWithDetail={this.props.getUserWithDetail}
                        passwordUpdate={this.props.updatePassword}
                        userList={this.props.userList}
                        userDetail={this.props.userDetail}
                        createUser={this.props.userCreate}
                        updateUser={this.props.userUpdate}
                        deleteUser={this.props.userDelete}
                        selfUser={this.state.selfUser}
                        userActionType={this.props.userActionType}
                    />
                </Col>
            );
        }

      return (
          <Row style={{ margin: "0px" }}>
              <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />
              {permissionCheck("USER", "view") && (
                  <Col md={5}>
                      <div style={{ background: "#fff", borderRadius: "5px" }}>
                          <Row style={{ ...{ margin: "0px" }, ...themeService(userStyles.staffTopRowStyle) }}>
                              <Col md={8} style={themeService(userStyles.staffListHeadingStyle)}>
                                  {languageService("Staff List")}
                              </Col>
                              {/* {_.find(JSON.parse(localStorage.getItem("loggedInUser")).userGroup.permissions, { name: "USER CREATE" }) && ( */}
                              {permissionCheck("USER", "create") && (
                                  <Col md={4} style={{ padding: "15px" }}>
                                      <div id="toolTipAddUser" style={{ width: "fit-content", float: "right" }}>
                                          <ButtonMain
                                              handleClick={this.handleAddUserClick}
                                              icon={personAdd}
                                              width="40px"
                                              iconSize={18}
                                              backgroundColor={themeService(userStyles.addButtonIconStyle.backgroundColor)}
                                              hoverBackgroundColor={themeService(userStyles.addButtonIconStyle.hoverBackground)}
                                              hoverBorder={themeService(userStyles.addButtonIconStyle.hoverBorder)}
                                          />
                                      </div>
                                      <Tooltip isOpen={this.state.tooltipOpen} target="toolTipAddUser" toggle={this.toggleTooltip}>
                                          {languageService("Add User")}
                                      </Tooltip>
                                  </Col>
                              )}
                          </Row>
                          <Col md={12} style={themeService(userStyles.staffListContainer)}>
                              <UserList
                                  getUserList={this.props.userListRequest}
                                  handleClick={this.handleClickUserList}
                                  addingUser={this.state.addUser}
                                  actionType={this.props.userActionType}
                                  userList={this.props.userList}
                              />
                          </Col>
                      </div>
                  </Col>
              )}

              {userProfile}
          </Row>
      );
  }
}

let variables = {
  userReducer: {
    userList: [],
    userDetail: null,
    userDetailActionType: null,
    userListByGroup: [],
    errorMessage: ''
  },
  templateHelperReducer: {
      workplans: []
  }
};

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    userListRequest,
    getUserWithDetail,
    getUserByEmail,
    userCreate,
    userUpdate,
    userDelete,
    updatePassword,
    inspectorsPlan
  },
};
let UserContainer = CRUDFunction(User, "userComp", actionOptions, variables, [
  "userReducer",
    "templateHelperReducer"
]);
export default UserContainer;

