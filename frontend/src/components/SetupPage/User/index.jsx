import React, { Component } from "react";
import UserList from "containers/Setup/User/UserListContainer";
import UserForm from "containers/Setup/User/UserFormContainer";
import { Row, Col } from "reactstrap";
import { ButtonMain } from "components/Common/Buttons";
import { personAdd } from "react-icons-kit/ionicons/personAdd";
import * as types from "./../../../reduxRelated/ActionTypes/actionTypes.js";
import permissionCheck from "utils/permissionCheck.js";
import { Tooltip } from "reactstrap";
import { languageService } from "../../../Language/language.service";
import { themeService } from "../../../theme/service/activeTheme.service";
import { userStyles } from "./style/userStyles";
import SpinnerLoader from "../../Common/SpinnerLoader";

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
    };
    this.handleClickUserList = this.handleClickUserList.bind(this);
    this.handleAddUserClick = this.handleAddUserClick.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
  }

  handleAddUserClick(e) {
    this.setState({
      selectedUserId: "",
      addUser: true,
    });
  }

  handleClickUserList(e, rowInfo) {
    //console.log(rowInfo);
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

    // this.props.getUserGroups();
    // this.props.getUserAssets();
    // this.props.getApplicationLists(['departments']);
  }

    componentDidUpdate(prevProps, prevState) {
        // if (this.props.assetActionType !== prevProps.assetActionType && (this.props.assetActionType === 'ASSETS_READ_SUCCESS' || this.props.assetActionType === 'ASSETS_READ_FAILURE')) {
        //     this.props.getAssetLinesWithSelf();
        //     this.setState({spinnerLoading: false});
        // }
        //
        // if (this.props.assetActionType !== prevProps.assetActionType && this.props.assetActionType === 'ASSETS_READ_REQUEST') {
        //     this.setState({spinnerLoading: true});
        // }
        //
        //
        if (this.props.actionType !== prevProps.actionType && (this.props.actionType === 'USER_LIST_SUCCESS' || this.props.actionType === 'USER_LIST_FAILURE')) {
            this.setState({spinnerLoading: false});
        }

        if (this.props.actionType !== prevProps.actionType && this.props.actionType === 'USER_LIST_REQUEST') {
            this.setState({spinnerLoading: true});
        }

        if (this.props.userDetailActionType !== prevProps.userDetailActionType && (this.props.userDetailActionType === 'USER_WITH_DETAIL_SUCCESS' || this.props.userDetailActionType === 'USER_WITH_DETAIL_FAILURE')) {
            this.setState({spinnerLoading: false});
        }

        if (this.props.userDetailActionType !== prevProps.userDetailActionType && this.props.userDetailActionType === 'USER_WITH_DETAIL_REQUEST') {
            this.setState({spinnerLoading: true});
        }
    }

    componentWillReceiveProps(nextProps) {
    // if (this.props.userGroups !== nextProps.userGroups && nextProps.actionType == types.USER_GROUP_GET_SUCCESS) {
    //   this.setState({
    //     userGroups: nextProps.userGroups,
    //   });
    // }


    // if(this.props.applicationlookupsActionType !== nextProps.applicationlookupsActionType && nextProps.applicationlookupsActionType==="APPLICATIONLOOKUPSS_READ_SUCCESS")
    // {
    //   this.setApplicationLists(this.props.applicationlookupss);
    // }
  }

  render() {
    let userProfile = null;
    if (this.state.selectedUserId || this.state.addUser) {
      userProfile = (
        <Col md={7}>
          <UserForm
            subdivisions={this.props.subdivisions}
            userGroups={this.state.userGroups}
            userIdToFetch={this.state.selectedUserId}
            isAddMode={this.state.addUser}
            assets={this.props.assets}
            departments={this.state.departments}
            lineAssets={this.props.lineAssets}
            assetHelperActionType={this.props.assetHelperActionType}
            userDetailActionType={this.props.userDetailActionType}
            userWorkPlans={this.props.userWorkPlans}
            templateHelperActionType={this.props.templateHelperActionType}
            getUserInspectionPlan={this.props.getUserInspectionPlan}
            getUserByEmail={this.props.getUserByEmail}
            getUserWithDetail={this.props.getUserWithDetail}
            userList={this.props.userList}
            userDetail={this.props.userDetail}
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
                <UserList handleClick={this.handleClickUserList} addingUser={this.state.addUser} />
              </Col>
            </div>
          </Col>
        )}

        {userProfile}
      </Row>
    );
  }
}

export default User;
