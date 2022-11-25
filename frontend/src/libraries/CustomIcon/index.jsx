import Icon from "react-icons-kit";
import { circle } from "react-icons-kit/fa/circle";
import { UncontrolledTooltip } from "reactstrap";
import React, { Component } from "react";
import { handleTouchClickEvents } from "./TouchService";
import './index.css'

// interface IProps {
//   iconGroup: IIconGroup;
//   status: string;
//   toggled?: boolean;
//   disabled?: boolean;
//   hidden?: boolean;
//   onShortPress?: { (): void } | undefined;
//   onLongPress?: { (): void } | undefined;
//   className?: string;
// }

const Defaults = {
  IconSize: 24,
  TooltipPlacement: "top"
}

class CustomIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
    };
    this.inputField = null;
    this.handleEventCallback = this.handleEventCallback.bind(this);
    this.onFileSelection = this.onFileSelection.bind(this);
  }

  componentDidMount() {
    this.setState({
      id: `${Math.floor(Math.random() * 100000000)}`,
    });
  }

  onFileSelection(e) {
    let { onShortPress, browseFile } = this.props;
    let {files} = e.target;
    browseFile && files && files.length > 0 && onShortPress && onShortPress(files);
  }
  handleEventCallback = (type, event) => {
    let { onShortPress, onLongPress, browseFile } = this.props;
    switch (type) {
      case "onTouch":
      case "click":
        if (browseFile) {
          this.inputField && this.inputField.click();
        }
        else {
          onShortPress && onShortPress();
        }
        break;
      case "rightClick":
      case "longPress":
        onLongPress && onLongPress();
        break;

      default:
        break;
    }
  };

  render() {
    let { props } = this;
    let { id } = this.state;
    const { status, iconGroup, className, style, browseFile } = props;
    let iconFound = false;
    let customIconProps = {
      iconProps: { icon: circle },
    };
    if (iconGroup.hasOwnProperty(status)) {
      customIconProps = iconGroup[status];
      iconFound = true;
    }
    let { tooltipPlacement, tooltipTitle, toggledTooltipTitle, toggleIconProps } = customIconProps;
    let iconProps = customIconProps.iconProps;

    let tooltip = tooltipTitle;
    if (props.toggled) {
      toggledTooltipTitle && (tooltip = toggledTooltipTitle);
      toggleIconProps && (iconProps = toggleIconProps);
    }

    let iconId = id ? `icon-id-${id}` : '';
    let fileId = id ? `file-id-${id}` : '';
    return (
      <React.Fragment>
        {!props.hidden && (
          <React.Fragment>
            <span
              className={`custom-icon-default ${className ? className : ""} ${props.toggled && !toggleIconProps ? "toggled" : ""} ${props.disabled ? "disabled" : ""}`}
              id={iconId}
              onClick={(e) => !props.disabled && handleTouchClickEvents(e, this.handleEventCallback)}
              onTouchStart={(e) => !props.disabled && handleTouchClickEvents(e, this.handleEventCallback)}
              onTouchEnd={(e) => !props.disabled && handleTouchClickEvents(e, this.handleEventCallback)}
              onTouchMove={(e) => !props.disabled && handleTouchClickEvents(e, this.handleEventCallback)}
              onContextMenu={(e) =>
                !props.disabled && handleTouchClickEvents(e, this.handleEventCallback)
              } /*onClick={props.onClick && props.onClick}*/
              style={style}
            >
              {iconFound && <Icon {...{ size: Defaults.IconSize, ...iconProps }} />}
            </span>
            {iconId && tooltip ? (
              <UncontrolledTooltip placement={tooltipPlacement ? tooltipPlacement : Defaults.TooltipPlacement} target={iconId}>
                {tooltip}
              </UncontrolledTooltip>
            ) : null}
            {browseFile ? <input onChange={this.onFileSelection} ref={input => this.inputField = input} type='file' id={fileId} name={`file-name-${id}`} style={{ visibility: 'hidden', height: 0, width: 0, position: 'absolute' }} /> : null}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default CustomIcon;
