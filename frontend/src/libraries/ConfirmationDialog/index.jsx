import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./style.css";
import { themeService } from "theme/service/activeTheme.service";
import { ButtonStyle, CommonModalStyle } from "style/basic/commonControls";
// type IProps = {
//   title: string;
//   confirmationCallback: (action: string, info: any) => void;
//   cancelCallback: () => void;
//   body: string | JSX.Element;
//   confirmButtonLabel?: string;
//   action: string;
//   additionalInfo?: any;
// };
// type IState = {};

export const confirmationDialogWarningMessage = (message) => {
  return <b className="confirmation-dialog-warning-message">{message}</b>;
};
class ConfirmationDialog extends Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
  }

  callback() {
    let { confirmationCallback, action, additionalInfo } = this.props;
    confirmationCallback && confirmationCallback(action, additionalInfo);
  }

  render() {
    let { confirmButtonLabel, body, cancelCallback } = this.props;
    return (
      <React.Fragment>
        <Modal className={"confirmation-dialog"} isOpen={true}>
          <ModalHeader>{this.props.title}</ModalHeader>
          <ModalBody>{body}</ModalBody>
          <ModalFooter>
            <Button onTouchEnd={this.callback} onClick={this.callback} style={themeService(ButtonStyle.commonButton)}>
              {confirmButtonLabel ? confirmButtonLabel : "Confirm"}
            </Button>
            <Button onTouchEnd={cancelCallback} onClick={cancelCallback} style={themeService(ButtonStyle.commonButton)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ConfirmationDialog;
