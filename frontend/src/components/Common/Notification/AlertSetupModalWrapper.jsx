import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import "components/Common/commonform.css";
import { ButtonStyle, CommonModalStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { languageService } from "../../../Language/language.service";
import AlertSetupForm from "./AlertSetupForm";

const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

const AlertSetupModalWrapper = (props) => {
  return (
    <Modal
      contentClassName={themeService({ default: props.className, retro: "retro", electric: "electric" })}
      isOpen={props.modal}
      toggle={props.toggle}
      style={{ maxWidth: "98vw" }}
    >
      <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>{"Alert setup"}</ModalHeader>

      <ModalBody style={themeService(CommonModalStyle.body)}>
        <AlertSetupForm {...props} />
      </ModalBody>

      <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
        <MyButton type="button" onClick={this.props.toggle} style={themeService(ButtonStyle.commonButton)}>
          {languageService("Close")}
        </MyButton>
      </ModalFooter>
    </Modal>
  );
};

export default AlertSetupModalWrapper;
