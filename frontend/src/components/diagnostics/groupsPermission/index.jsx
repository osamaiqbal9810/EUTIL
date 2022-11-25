/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Control, LocalForm } from "react-redux-form";
import { CRUDFunction } from "reduxCURD/container";
import GroupPermissionList from "../permissions/PermissionList/PermissionList";
import GroupPermissionAddEdit from "./GroupPermissionAddEdit/GroupPermissionAddEdit";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import "./GroupPermissionAddEdit/commonform.css";
import _ from "lodash";
import { curdActions } from "reduxCURD/actions";
import { withPlus } from "react-icons-kit/entypo/withPlus";
// import SvgIcon from 'react-icons-kit'
import { ButtonCirclePlus } from "components/Common/Buttons";

// const Label = props => <label> {props.children}</label>
const Field = (props) => <div className="field">{props.children}</div>;

// const Required = () => <span className="required-fld">*</span>

class UserGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selectedGroupDetailsPermissionIds: [],
      selectedGroupDetailsPermission: [],
      selectedGroup: "",
      addModal: false,
      actionType: "",
      dropdownOpen: false,
      unAssignedPermissions: [],
      unAssignedPermissionsUpdated: false,
    };

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.addNewPermissions = this.addNewPermissions.bind(this);
    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.handleRemovePermissionClick = this.handleRemovePermissionClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.resetAvailableUsersUpdatedCheck = this.resetAvailableUsersUpdatedCheck.bind(this);
  }

  componentDidMount() {
    this.props.getPermission();
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.userGroups &&
      nextProps.userGroups !== prevState.groups &&
      nextProps.actionType !== prevState.actionType &&
      nextProps.actionType == "USERGROUPS_READ_SUCCESS"
    ) {
      return {
        groups: nextProps.userGroups,
        actionType: nextProps.actionType,
      };
    }
    //  else if (nextProps.permissionActionType == 'PERMISSIONS_READ_SUCCESS' || nextProps.permissionActionType !== prevState.actionType) {
    //   return {
    //     actionType: nextProps.permissionActionType
    //   }
    // }
    else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "USERGROUP_UPDATE_SUCCESS") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "USERGROUP_CREATE_SUCCESS") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "USERGROUP_DELETE_SUCCESS") {
      return {
        actionType: nextProps.actionType,
      };
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == "USERGROUP_DELETE_FAILURE") {
      return {
        actionType: nextProps.actionType,
      };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.groups && prevProps.actionType !== this.state.actionType && this.state.actionType == "USERGROUPS_READ_SUCCESS") {
      let selectedGroup = this.state.selectedGroup;
      let selectedGroupDetailsPermissionIds = [];
      let selectedGroupDetailsPermission = [];
      let unAssignedPermissions = this.props.permissions;
      if (selectedGroup == "") {
        selectedGroupDetailsPermissionIds = this.state.groups[0].permissions;
        selectedGroup = this.state.groups[0].group_id;
        let permissions = this.props.permissions;
        let filtered = _.filter(this.props.permissions, (permission) => {
          return _.includes(selectedGroupDetailsPermissionIds, permission._id);
        });
        if (filtered) {
          selectedGroupDetailsPermission = filtered;
          let unCommon = _.difference(permissions, filtered);
          unAssignedPermissions = unCommon;
        }
      } else {
        let result = _.find(this.state.groups, { group_id: this.state.selectedGroup });
        if (result) {
          selectedGroupDetailsPermissionIds = result.permissions;
          let permissions = this.props.permissions;
          let filtered = _.filter(this.props.permissions, (permission) => {
            return _.includes(selectedGroupDetailsPermissionIds, permission._id);
          });
          if (filtered) {
            selectedGroupDetailsPermission = filtered;
            let unCommon = _.difference(permissions, filtered);
            unAssignedPermissions = unCommon;
          }
        }
      }

      this.setState({
        selectedGroupDetailsPermissionIds: selectedGroupDetailsPermissionIds,
        selectedGroupDetailsPermission: selectedGroupDetailsPermission,
        selectedGroup: selectedGroup,
        unAssignedPermissions: unAssignedPermissions,
        unAssignedPermissionsUpdated: true,
      });
    }
    if (
      this.props.permissionActionType !== prevProps.permissionActionType &&
      this.props.permissionActionType == "PERMISSIONS_READ_SUCCESS"
    ) {
      this.props.getUserGroup();
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "USERGROUP_UPDATE_SUCCESS") {
      this.props.getUserGroup();
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "USERGROUP_CREATE_SUCCESS") {
      this.props.getUserGroup();
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == "USERGROUP_DELETE_SUCCESS") {
      this.props.getUserGroup();
    }
  }

  handleModalToggle() {
    //console.log(modalState)
    this.setState({
      addModal: !this.state.addModal,
    });
  }

  handleChange(group) {
    //console.log(group)
    let result = _.find(this.state.groups, { group_id: group });
    let selectedGroupDetailsPermissionIds = result ? result.permissions : [];
    let selectedGroupDetailsPermission = [];

    let permissions = this.props.permissions;
    let filtered = _.filter(permissions, (permission) => {
      return _.includes(selectedGroupDetailsPermissionIds, permission._id);
    });
    let unAssignedPermissions = this.props.permissions;
    if (filtered) {
      selectedGroupDetailsPermission = filtered;
      let unCommon = _.difference(permissions, filtered);
      unAssignedPermissions = unCommon;
    }
    this.setState({
      selectedGroup: group,
      selectedGroupDetailsPermissionIds: selectedGroupDetailsPermissionIds,
      selectedGroupDetailsPermission: selectedGroupDetailsPermission,
      unAssignedPermissions: unAssignedPermissions,
      unAssignedPermissionsUpdated: true,
    });
  }
  resetAvailableUsersUpdatedCheck() {
    this.setState({
      unAssignedPermissionsUpdated: false,
    });
  }
  addNewPermissions(permissions) {
    let result = _.find(this.state.groups, { group_id: this.state.selectedGroup });
    if (result) {
      let copyResult = { ...result };
      copyResult.permissions = [...result.permissions, ...permissions];
      this.props.updateUserGroup(copyResult);
    }
    this.setState({
      addModal: false,
    });
  }

  handleRemovePermissionClick(permission) {
    let result = _.find(this.state.groups, { group_id: this.state.selectedGroup });

    if (result) {
      let copyResult = _.cloneDeep(result);
      _.remove(copyResult.permissions, (perm) => {
        return perm == permission._id;
      });
      this.props.updateUserGroup(copyResult);
    }
  }

  render() {
    let groupsOptions = [];
    if (this.state.groups) {
      groupsOptions = this.state.groups.map((group, index) => {
        return (
          <option value={group.group_id} key={group.group_id}>
            {group.name}
          </option>
        );
      });
    }
    return (
      <Col md="12">
        <GroupPermissionAddEdit
          modal={this.state.addModal}
          modalState={this.state.modalState}
          toggle={this.handleModalToggle}
          unAssignedPermissions={this.state.unAssignedPermissions}
          unAssignedPermissionsUpdated={this.state.unAssignedPermissionsUpdated}
          resetAvailableUsersUpdatedCheck={this.resetAvailableUsersUpdatedCheck}
          addNewPermissions={this.addNewPermissions}
        />
        <Row style={{ borderBottom: "2px solid #d1d1d1", margin: "0px 15px", padding: "10px 0px" }}>
          <Col md="6" style={{ paddingLeft: "0px" }}>
            <div
              style={{
                float: "left",
                fontFamily: "Myriad Pro",
                fontSize: "24px",
                letterSpacing: "0.5px",
                color: "var(--first)",
              }}
            >
              User Groups
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div style={commonPageStyle.commonSummaryHeadingContainer}>
              <h4 style={commonPageStyle.commonSummaryHeadingStyle}>Select Group</h4>
            </div>
          </Col>
        </Row>

        <Col md="12">
          <Row style={{ height: "80px", margin: "0px" }}>
            <div style={{ marginRight: "30px" }}>
              <LocalForm
                className="commonform"
                model="selectedGroup"
                style={{ width: "250px" }}
                validators={this.trackValidator}
                onChange={(values) => this.handleChange(values)}
                initialState={this.state.selectedGroup}
              >
                <Field>
                  <Control.select model="selectedGroup" placeholder="Groups">
                    {groupsOptions}
                  </Control.select>
                </Field>
              </LocalForm>
            </div>

            <div>
              <ButtonCirclePlus
                iconSize={70}
                icon={withPlus}
                handleClick={(e) => {
                  this.handleModalToggle("Add");
                }}
                backgroundColor="#e3e9ef"
                margin="0px 0px 0px 0px"
                borderRadius="50%"
                hoverBackgroundColor="#e3e2ef"
                hoverBorder="0px"
                activeBorder="3px solid #e3e2ef "
                iconStyle={{
                  color: "#c4d4e4",
                  background: "var(--fifth)",
                  borderRadius: "50%",
                  border: "3px solid ",
                }}
              />
            </div>
          </Row>
        </Col>

        <Row>
          <Col md="12">
            <div style={commonPageStyle.commonSummaryHeadingContainer}>
              <h4 style={commonPageStyle.commonSummaryHeadingStyle}>Groups Detail</h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <GroupPermissionList
              tableData={this.state.selectedGroupDetailsPermission}
              handleEditClick={this.handleAddEditModalClick}
              handleDeleteClick={this.handleRemovePermissionClick}
              handleViewClick={this.handleViewClick}
              noEdit
              removePermission
              removeButtonText={"Remove"}
            />
          </Col>
        </Row>
      </Col>
    );
  }
}
const getPermission = curdActions.getPermission;
let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getPermission },
};
let variableList = {
  permissionReducer: {
    permissions: [],
  },
};

const UserGroupContainer = CRUDFunction(UserGroup, "userGroup", actionOptions, variableList, ["permissionReducer"]);

export default UserGroupContainer;
