/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import SelectedTeam from "./SelectedTeam/SelectedTeam";
import SvgIcon from "react-icons-kit";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import AllMembers from "./AllMembers/AllMembers";
import { CRUDFunction } from "reduxCURD/container";
// import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { circle } from "react-icons-kit/fa/circle";
import { userListRequest, updateTeam, removeMembersTeam } from "reduxRelated/actions/userActions";
import AddToTeamModalBox from "./AddToTeamModalBox";
import { inspectorsPlan } from "reduxRelated/actions/templateHelperActions";
import _ from "lodash";
import { languageService } from "../../Language/language.service";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonStyles } from "../../theme/commonStyles";
class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "viewTeams",
      usersAll: [],
      showAddModel: false,
      unAssignUsers: [],
      supervisors: [],
      assignedInspectors: [],
      selectedSupervisor: {},
      assignedInspectorsOfSelectedTeam: [],
      teamMembersId: [],
      availableUsersUpdated: false,
      unAssignUsersOfSuper: [],
    };

    this.handleViewTeam = this.handleViewTeam.bind(this);
    this.handleBackToMainView = this.handleBackToMainView.bind(this);
    this.handleDeleteFromTeam = this.handleDeleteFromTeam.bind(this);
    this.handleAddTeamMembersButton = this.handleAddTeamMembersButton.bind(this);
    this.handleModalQuitOnButtons = this.handleModalQuitOnButtons.bind(this);
    this.resetAvailableUsersUpdatedCheck = this.resetAvailableUsersUpdatedCheck.bind(this);
  }
  componentDidMount() {
    this.props.userListRequest();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.userActionType == "USER_LIST_SUCCESS" && nextProps.userList !== prevState.userList) {
      return {
        usersAll: nextProps.userList,
        usersActionType: nextProps.myActionsType,
      };
    } else {
      return null;
    }
  }

  handleModalQuitOnButtons(response, usersToAdd) {
    if (response) {
      let usersEmails = [];
      usersToAdd.forEach(user => {
        let simple = {
          email: user.email,
        };
        usersEmails.push(simple);
      });

      if (usersToAdd.length > 0) {
        let toUpdate = {
          email: this.state.selectedSupervisor.email,
          superId: this.state.selectedSupervisor._id,
          newTeamMembers: usersEmails,
        };
        this.props.updateTeam(toUpdate);
        this.setState({
          showAddModel: false,
        });
      } else {
        // To DO : Show msg that no user to be added. nothing changed
      }
    } else {
      this.setState({
        showAddModel: false,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.usersAll !== prevState.userList &&
      this.props.userActionType == "USER_LIST_SUCCESS" &&
      this.props.userActionType !== prevProps.userActionType
    ) {
      let unAssignUsers = [];
      let supervisors = [];
      let assignedInspectors = [];
      let teamMembers = [];
      let teamMembersId = [];
      let availableUsers = [];
      this.state.usersAll.forEach(user => {
        if (user.group_id == "inspector" && !user.teamLead) {
          unAssignUsers.push(user);
        } else if (user.group_id == "inspector" && user.teamLead) {
          assignedInspectors.push(user);
        } else if (user.group_id == "supervisor") {
          supervisors.push(user);
        }
      });
      let currentSuperVisor = _.find(supervisors, {
        email: this.state.selectedSupervisor.email,
      });
      if (currentSuperVisor) {
        currentSuperVisor.team.forEach(teamMember => {
          assignedInspectors.forEach(assignedMember => {
            if (teamMember.email == assignedMember.email) {
              teamMembers.push(assignedMember);
              teamMembersId.push(assignedMember._id);
            }
          });
        });

        if (currentSuperVisor.subdivision == "All" || currentSuperVisor.subdivision == "") {
          availableUsers = unAssignUsers;
        } else {
          unAssignUsers.forEach(availUsers => {
            if (availUsers.subdivision == currentSuperVisor.subdivision) {
              availableUsers.push(availUsers);
            }
          });
        }
      } else {
        currentSuperVisor = {};
      }
      this.setState({
        unAssignUsers: unAssignUsers,
        teamLeaders: supervisors,
        assignedInspectors: assignedInspectors,
        availableUsersUpdated: true,
        selectedSupervisor: currentSuperVisor,
        assignedInspectorsOfSelectedTeam: teamMembers,
        teamMembersId: teamMembersId,
        unAssignUsersOfSuper: availableUsers,
      });
    }
    if (this.props.userActionType == "ADD_MEMEBERSTEAM_SUCCESS" && this.props.userActionType !== prevProps.userActionType) {
      this.props.userListRequest();
    }
    if (this.props.userActionType == "REMOVE_MEMEBERSTEAM_SUCCESS" && this.props.userActionType !== prevProps.userActionType) {
      this.props.userListRequest();
    }
    if (
      this.props.templateHelperActionType !== prevProps.templateHelperActionType &&
      this.props.templateHelperActionType == "GET_PLAN_USERS_SUCCESS" &&
      this.props.workplans
    ) {
      let users = _.cloneDeep(this.state.assignedInspectorsOfSelectedTeam);
      let plans = _.cloneDeep(this.props.workplans);
      //let userPlan = [];

      plans.forEach(plan => {
        let userfound = _.find(users, { _id: plan.user.id });
        if (userfound) {
          if (!userfound["plans"]) {
            userfound["plans"] = {};
          }

          userfound["plans"][plan.dayFreq] = plan;
        }
        console.log(userfound);
      });
      this.setState({ assignedInspectorsOfSelectedTeam: users });
      //users = [...userPlan];
    }
  }

  handleAddTeamMembersButton() {
    this.setState({
      showAddModel: !this.state.showAddModel,
    });
  }
  handleDeleteFromTeam(user, compName) {
    if (user) {
      let toUpdate = {
        email: this.state.selectedSupervisor.email,
        superId: this.state.selectedSupervisor._id,
        userToDelete: user.email,
      };
      this.props.removeMembersTeam(toUpdate);
    }
  }

  handleViewTeam(user, listName) {
    if (listName == "SupervisorsList") {
      let assigned = this.state.assignedInspectors;
      let teamMembers = [];
      let teamMembersId = [];
      if (user.team) {
        user.team.forEach(teamMember => {
          assigned.forEach(assignedMember => {
            if (teamMember.email == assignedMember.email) {
              teamMembers.push(assignedMember);
              teamMembersId.push(assignedMember._id);
            }
          });
        });
      }
      let availableUsers = [];
      if (user.subdivision == "All" || user.subdivision == "") {
        availableUsers = this.state.unAssignUsers;
      } else {
        this.state.unAssignUsers.forEach(availUsers => {
          if (availUsers.subdivision == user.subdivision) {
            availableUsers.push(availUsers);
          }
        });
      }
      this.props.inspectorsPlan(teamMembersId);
      this.setState({
        mode: "viewTeamDetail",
        selectedSupervisor: user,
        assignedInspectorsOfSelectedTeam: teamMembers,
        teamMembersId: teamMembersId,
        unAssignUsersOfSuper: availableUsers,
        availableUsersUpdated: true,
      });
    }
  }

  handleBackToMainView() {
    this.setState({
      mode: "viewTeams",
    });
  }
  resetAvailableUsersUpdatedCheck() {
    this.setState({
      availableUsersUpdated: false,
    });
  }

  render() {
    //console.log(this.props.workplans);
    //console.log(this.state.assignedInspectorsOfSelectedTeam);
    return (
      <div>
        <AddToTeamModalBox
          modal={this.state.showAddModel}
          toggle={this.handleAddTeamMembersButton}
          availableUsers={this.state.unAssignUsersOfSuper}
          userActionType={this.props.userActionType}
          availableUsersUpdated={this.state.availableUsersUpdated}
          resetAvailableUsersUpdatedCheck={this.resetAvailableUsersUpdatedCheck}
          headerText={this.state.selectedSupervisor.email ? this.state.selectedSupervisor.email : ""}
          handleResponse={this.handleModalQuitOnButtons}
          selectedSuper={this.state.selectedSupervisor}
        />
        <Col md={12}>
          <Row style={themeService(commonStyles.pageBorderRowStyle)}>
            <Col md="3" style={{ paddingLeft: "0px" }}>
              {this.state.mode == "viewTeamDetail" && (
                <div style={themeService(commonStyles.pageTitleDetailStyle)}>
                  <SvgIcon
                    size={25}
                    icon={ic_arrow_back}
                    style={{
                      marginRight: "5px",
                      marginLeft: "5px",
                      verticalAlign: "middle",
                      cursor: "pointer",
                    }}
                    onClick={this.handleBackToMainView}
                  />
                  <SvgIcon
                    size={12}
                    icon={circle}
                    style={{
                      marginRight: "10px",
                      marginLeft: "5px",
                    }}
                  />
                  {languageService("Team Detail")}
                </div>
              )}
              {this.state.mode == "viewTeams" && (
                <div style={themeService(commonStyles.pageTitleStyle)}>{languageService("Crew Groups")}</div>
              )}
            </Col>
          </Row>
        </Col>
        <Col xl="12" style={{ padding: "15px 15px 15px 30px" }}>
          <Row>
            <Col md="12" lg="12" sm="12">
              {this.state.mode == "viewTeams" && (
                <AllMembers
                  userList={this.state.teamLeaders}
                  headerName={languageService("Track Managers")}
                  handleViewTeam={this.handleViewTeam}
                  ComponentName="SupervisorsList"
                />
              )}
              {/* {this.state.mode == "add" && (
								<SelectedTeam
									usersAll={this.state.usersAll}
									teamLead={this.state.selectedSupervisor}
								/>
							)} */}
              {this.state.mode == "viewTeamDetail" && (
                <div>
                  <SelectedTeam
                    usersAll={this.state.usersAll}
                    teamLead={this.state.selectedSupervisor}
                    handleAddTeamMembers={this.handleAddTeamMembersButton}
                  />
                  <AllMembers
                    userList={this.state.assignedInspectorsOfSelectedTeam}
                    headerName="Inspectors"
                    handleViewTeam={this.handleViewTeam}
                    ComponentName="InspectorsList"
                    viewMode={this.state.mode}
                    workplans={this.props.workplans}
                    showAddTeamMemebersButton
                    noViewButton
                    deleteAction
                    handleDeleteFromTeam={this.handleDeleteFromTeam}
                  />
                </div>
              )}
            </Col>
            {
              //<Col md="6" lg="6" sm="12">
              // {this.state.mode == "add" &&   <AllMembers userList = {this.state.unAssignUsers} headerName = "Unassigned Inspectors" AddAction noViewButton handleAddtoTeam = {this.handleAddtoTeam} ComponentName = "InspectorsList"/>}
              // </Col>
            }
            {
              //<Col md="6" lg="3">
              //</Col>
            }
          </Row>
        </Col>
      </div>
    );
  }
}

let variables = {
  userReducer: {
    userList: [],
  },
  templateHelperReducer: {
    workplans: [],
  },
};

let actionOptions = {
  create: true,
  update: false,
  read: false,
  delete: false,
  others: { userListRequest, updateTeam, removeMembersTeam, inspectorsPlan },
};
let TeamContainer = CRUDFunction(Team, "team", actionOptions, variables, ["userReducer", "templateHelperReducer"]);
export default TeamContainer;
