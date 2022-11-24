import React, { Component } from "react";
import { Row, Col, Tooltip, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import AllMembers from "./AllMembers/AllMembers";
import { ModalStyles } from "components/Common/styles.js";
import _ from "lodash";
import { languageService } from "../../Language/language.service";
import { themeService } from "theme/service/activeTheme.service";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
const MyButton = props => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);
export default class AddToTeamModalBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersToAdd: [],
      availableUsers: [],
    };

    this.handleAddtoTeam = this.handleAddtoTeam.bind(this);
    this.removeAlreadySelectedMember = this.removeAlreadySelectedMember.bind(this);
    this.handleResetUsersToAdd = this.handleResetUsersToAdd.bind(this);
    this.handleAvailablUsersReset = this.handleAvailablUsersReset.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.availableUsers !== this.props.availableUsers && this.props.availableUsersUpdated == true) {
      this.props.resetAvailableUsersUpdatedCheck();
      this.setState({
        availableUsers: this.props.availableUsers,
      });
    }
  }
  handleResetUsersToAdd() {
    this.setState({
      usersToAdd: [],
    });
  }

  handleAvailablUsersReset() {
    let availableUsers = _.cloneDeep(this.state.availableUsers);

    availableUsers.forEach(element => {
      element.selected = false;
    });
    this.setState({
      availableUsers: availableUsers,
    });
  }

  handleAddtoTeam(user) {
    console.log(user);
    let users = this.state.usersToAdd;
    let updatedUsers = _.cloneDeep(users);
    updatedUsers.push(user);
    let availUsers = this.state.availableUsers;
    let availableUsers = _.cloneDeep(availUsers);
    let result = _.find(availableUsers, { email: user.email });
    if (result) {
      result.selected = true;
    }
    this.setState({
      usersToAdd: updatedUsers,
      availableUsers: availableUsers,
    });
  }

  removeAlreadySelectedMember(user) {
    let users = this.state.usersToAdd;
    let updatedUsers = _.cloneDeep(users);
    _.remove(updatedUsers, { email: user.email });
    let availUsers = this.state.availableUsers;
    let availableUsers = _.cloneDeep(availUsers);
    let result = _.find(availableUsers, { email: user.email });
    if (result) {
      result.selected = false;
    }
    this.setState({
      usersToAdd: updatedUsers,
      availableUsers: availableUsers,
    });
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.modal}
          toggle={this.props.toggle}
          size="lg"
          contentClassName={themeService({ default: this.props.className, retro: "retroModal" })}
        >
          <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}> {this.props.headerText}</ModalHeader>
          <ModalBody style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.body))}>
            <div style={ModalStyles.modalBodyColor}>
              <AllMembers
                userList={this.state.availableUsers}
                headerName={languageService("Available Inspectors")}
                addAction
                noViewButton
                handleAddtoTeam={this.handleAddtoTeam}
                ComponentName="InspectorsList"
                deleteFromTeamInModalButton
                handleRemoveFromAddInModal={this.removeAlreadySelectedMember}
              />
            </div>
          </ModalBody>
          <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
            <MyButton
              style={themeService(ButtonStyle.commonButton)}
              onClick={e => {
                this.props.handleResponse(true, this.state.usersToAdd);
                this.handleResetUsersToAdd();
              }}
            >
              {languageService("Confirm")}
            </MyButton>
            <MyButton
              style={themeService(ButtonStyle.commonButton)}
              onClick={e => {
                this.props.handleResponse(false);
                this.handleAvailablUsersReset();
              }}
            >
              {languageService("Cancel")}
            </MyButton>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
