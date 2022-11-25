import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Rnd } from "react-rnd";
import "./style.css";
import { getMaxZIndex } from "../utils";
import { Icon } from "react-icons-kit";
import { languageService } from "../../Language/language.service";
// type IProps = {
//   isOpen: boolean;
//   title: string;
//   body?: any;
//   width?: number;
//   minWidth?: number;
//   footer?: any;
//   draggable?: boolean;
//   className?: string;
//   dockAble?: boolean;
//   dockCallback?: () => void;
//   closeDialog?: () => void;
//   closeButtonTitle?: string;
// };
// type IState = { isOpen: boolean; id: string; zIndex: number };

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: this.props.isOpen, id: "", zIndex: this.getZIndex(100) };
    this.toggle = this.toggle.bind(this);
    this.getZIndex = this.getZIndex.bind(this);
    this.updateZIndex = this.updateZIndex.bind(this);
  }
  toggle() {
    this.props.closeDialog && this.props.closeDialog();
  }
  componentDidMount() {
    this.setState({ id: `dialog-id-${Math.random()}` });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen !== prevProps.isOpen) {
      this.setState({ isOpen: this.props.isOpen });
      this.updateZIndex();
    }
  }

  getZIndex(zIndex) {
    // the dialog is opened
    let maxZIndex = getMaxZIndex();
    if (maxZIndex < zIndex) {
      maxZIndex = zIndex;
    } else {
      maxZIndex = maxZIndex + 10;
    }
    return maxZIndex;
  }

  updateZIndex() {
    if (this.props.isOpen) {
      // the dialog is opened
      this.setState({ zIndex: this.getZIndex(this.state.zIndex) });
    }
  }
  render() {
    let dialogWidth = this.props.width ? this.props.width : 800; // todo: define later
    let { innerWidth } = window;
    let xOffset = innerWidth / 2 - dialogWidth / 2;

    let { closeButtonTitle } = this.props;
    let footer = null;
    if (this.props.footer) {
      footer = this.props.footer;
    } else if (this.props.closeDialog) {
      footer = (
        <Button
          onClick={this.toggle}
          onTouchEnd={(e) => {
            e.stopPropagation();
            this.toggle();
          }}
        >
          {`${closeButtonTitle ? closeButtonTitle : languageService("Cancel")}`}
        </Button>
      );
    }
    return (
      <React.Fragment>
        {this.props.draggable ? (
          <React.Fragment>
            {this.state.isOpen ? (
              <React.Fragment>
                <Rnd
                  id={this.state.id}
                  default={{ width: dialogWidth, height: "fit-content", x: xOffset, y: 100 }}
                  minWidth={this.props.minWidth ? this.props.minWidth : 400}
                  minHeight={"fit-content"}
                  bounds=".main" // this bound is the parent class identifier
                  dragAxis="both"
                  enableResizing={{
                    bottom: true,
                    bottomLeft: false,
                    bottomRight: true,
                    left: false,
                    right: true,
                    top: false,
                    topLeft: false,
                    topRight: false,
                  }}
                  style={{ cursor: "default", zIndex: this.state.zIndex }}
                >
                  <ModalHeader>
                    <span>{this.props.title}</span>
                    {/* {this.props.dockAble && (
                      <div className="dock-icon">
                        <Icon status="dock" iconGroup={iconSchema} onShortPress={this.props.dockCallback} />
                      </div>
                    )} */}
                  </ModalHeader>
                  {this.props.body ? <ModalBody onMouseDown={(e) => e.stopPropagation()}>{this.props.body}</ModalBody> : null}
                  {footer && <ModalFooter onMouseDown={(e) => e.stopPropagation()}>{footer}</ModalFooter>}
                </Rnd>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        ) : (
          <Modal
            id={this.state.id}
            className={`custom-dialog ${this.props.className}`}
            isOpen={this.state.isOpen}
            toggle={this.toggle}
            centered={true}
            backdrop="static"
            keyboard={false}
          >
            <ModalHeader>{this.props.title}</ModalHeader>
            {this.props.body ? <ModalBody>{this.props.body}</ModalBody> : null}
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </Modal>
        )}
      </React.Fragment>
    );
  }
}
