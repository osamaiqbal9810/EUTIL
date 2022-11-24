import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import { languageService } from "../../Language/language.service";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { retroColors } from "../../style/basic/basicColors";
const MyButton = props => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);
class ConfirmationDialog extends Component {
  render() {
    return (
      <Modal
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        contentClassName={themeService({ default: this.props.className, retro: "retroModal" })}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}> {this.props.headerText}</ModalHeader>
        <ModalBody style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.body))}>
          <div style={themeService({ default: { ...ModalStyles.modalBodyColor }, retro: { color: retroColors.second } })}>
            {this.props.confirmationMessage}
          </div>
        </ModalBody>
        <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          <MyButton
            style={themeService(ButtonStyle.commonButton)}
            onClick={e => {
              this.props.handleResponse(true);
            }}
          >
            {languageService("Confirm")}
          </MyButton>
          <MyButton
            style={themeService(ButtonStyle.commonButton)}
            onClick={e => {
              this.props.handleResponse(false);
            }}
          >
            {languageService("Cancel")}
          </MyButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmationDialog;
