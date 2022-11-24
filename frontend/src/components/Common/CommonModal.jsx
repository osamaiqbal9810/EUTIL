import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import { languageService } from "../../Language/language.service";
import PropTypes from "prop-types";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
class CommonModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
    this.getOpenModel = this.getOpenModel.bind(this);
    this.toggle = this.toggle.bind(this);
    this.submitCancelHandler = this.submitCancelHandler.bind(this);
  }

  componentDidMount() {
    this.props.setModalOpener(this.getOpenModel);
  }

  getOpenModel(state) {
    this.setState({
      modal: state != undefined ? state : true,
    });
  }
  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
    this.props.receiveToggleMethod && this.props.receiveToggleMethod(!this.state.modal);
  }
  submitCancelHandler(num) {
    this.setState({
      modal: false,
    });
    if (num) {
      this.props.handleSubmitClick();
    } else {
      if (this.props.handleCancelClick) {
        this.props.handleCancelClick();
      }
      this.props.receiveToggleMethod && this.props.receiveToggleMethod(false);
    }
  }

  render() {
    let footerButtonColmnMd = this.props.footerButtonsColumns ? this.props.footerButtonsColumns : "6";
    return (
      <Modal
        contentClassName={themeService({ default: this.props.className, retro: "retroModal "+ this.props.className })}
        isOpen={this.state.modal}
        toggle={this.toggle}
        style={this.props.modalStyle ? this.props.modalStyle : { maxWidth: "50vw" }}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {languageService(this.props.headerText)}
        </ModalHeader>
        <ModalBody style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.body))}>{this.props.children}</ModalBody>
        <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          {this.props.footerContent}
          {!this.props.disableDefaultfooterButtons && (
            <Row>
              {this.props.handleSubmitClick && (
                <Col md={footerButtonColmnMd}>
                  <MyButton
                    type="button"
                    style={themeService(ButtonStyle.commonButton)}
                    disabled={this.props.disabled}
                    onClick={(e) => {
                      this.submitCancelHandler(1);
                    }}
                  >
                    {this.props.footerSubmitText ? languageService(this.props.footerSubmitText) : languageService("Ok")}
                  </MyButton>
                </Col>
              )}
              <Col md={footerButtonColmnMd}>
                <MyButton
                  type="button"
                  style={themeService(ButtonStyle.commonButton)}
                  onClick={(e) => {
                    this.submitCancelHandler(0);
                  }}
                >
                  {this.props.footerCancelText ? languageService(this.props.footerCancelText) : languageService("Cancel")}
                </MyButton>
              </Col>
            </Row>
          )}
        </ModalFooter>
      </Modal>
    );
  }
}

export default CommonModal;

CommonModal.propTypes = {
  topRightStyle: PropTypes.object,

  //  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  headerText: PropTypes.string,
  handleSubmitClick: PropTypes.func,
  handleCancelClick: PropTypes.func,
  footerSubmitText: PropTypes.string,
  footerCancelText: PropTypes.string,
  footerButtonColmnMd: PropTypes.number,
};
