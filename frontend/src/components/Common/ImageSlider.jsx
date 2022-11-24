import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Tooltip } from "reactstrap";
import { Icon } from "react-icons-kit";
import { getServerEndpoint } from "../../utils/serverEndpoint";
import { redo } from "react-icons-kit/icomoon/redo";
import { undo } from "react-icons-kit/icomoon/undo";
import { circleLeft } from "react-icons-kit/icomoon/circleLeft";
import { circleRight } from "react-icons-kit/icomoon/circleRight";

import { ModalStyles } from "./styles";
import { languageService } from "../../Language/language.service";
import { CommonModalStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { retroColors, basicColors } from "style/basic/basicColors";
import { MyButton } from "components/Common/Forms/formsMiscItems";
const ROTATION_TOOLTIP = [
  {
    title: "REDO",
    icon: redo,
    rotate: "right",
    placement: "top",
    tooltip: {
      show: false,
      text: `${languageService("Rotate clockwise")}`,
    },
  },
  {
    title: "UNDO",
    icon: undo,
    placement: "right",
    rotate: "left",
    tooltip: {
      show: false,
      text: `${languageService("Rotate anti-clockwise")}`,
    },
  },
];

class ImageSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      selectedImageIndex: 0,
      tooltip: null,
      rotateIndex: 0,
    };

    this.handleImageTransition = this.handleImageTransition.bind(this);
    this.handelRotate = this.handelRotate.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.imgSlider && this.props.imgSlider !== prevProps.imgSlider) {
      this.setState({
        images: this.props.images,
        selectedImageIndex: this.props.initialIndex,
      });
    }
  }

  checkImageIndexExistence(images, index) {
    return typeof images[index] !== "undefined";
  }

  handleImageTransition(selectedImageIndex, images) {
    if (this.checkImageIndexExistence(images, selectedImageIndex)) this.setState({ selectedImageIndex });
  }

  handelRotate(direction) {
    //console.log("::", direction);
    if (direction === "right") {
      this.setState({ rotateIndex: this.state.rotateIndex + 90 });
    } else {
      this.setState({ rotateIndex: this.state.rotateIndex - 90 });
    }
  }

  toggleTooltip(tooltip) {
    if (this.state.tooltip) {
      this.setState({ tooltip: null });
    } else {
      this.setState({ tooltip });
    }
  }

  render() {
    let { selectedImageIndex, images } = this.state;
    const { imageDirectory } = this.props;

    let imgSelect = (
      <div
        className="scrollbar"
        style={{
          padding: "10px",
          transitionDuration: " 0.4s",
          background: "#f7f7f7",
          border: " 1px solid #e0e0e0",
          display: "inline-block",
          transform: "rotate(" + this.state.rotateIndex + "deg)",
          maxHeight: "70vh",
          overflow: "auto",
          position: "relative",
          display: "block",
        }}
      >
        <img
          src={`http://${getServerEndpoint()}${imageDirectory}/${
            images.length > 0 ? images[this.state.selectedImageIndex].imgName || images[this.state.selectedImageIndex] : ""
          }`}
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            border: "1px solid #e3e9ef",
            width: "100%",
          }}
          alt={"image"}
        />
      </div>
    );

    return (
      <Modal isOpen={this.props.imgSlider} toggle={this.handleToggle} style={{ height: "auto" }}>
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {this.state.imgDescription} Gallery View{" "}
          {images[this.state.selectedImageIndex] && images[this.state.selectedImageIndex].displayTitle
            ? `(${images[this.state.selectedImageIndex].displayTitle})`
            : ""}
        </ModalHeader>
        <div style={themeService({ default: { position: "absolute", top: "17px", right: "10px" } })}>
          {ROTATION_TOOLTIP.map((rt, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => this.handelRotate(rt.rotate)}
                id={rt.title}
                style={themeService({
                  default: {
                    marginRight: "10px",
                    background: basicColors.first,
                    color: "#fff",
                    padding: "5px 5px",
                    borderRadius: "5px",
                    height: "28px",
                    border: "none",
                    cursor: "pointer",
                  },
                  retro: {
                    marginRight: "10px",
                    background: retroColors.first,
                    color: retroColors.fifth,
                    padding: "5px 5px",
                    borderRadius: "5px",
                    height: "28px",
                    border: "none",
                    cursor: "pointer",
                  },
                })}
              >
                <Icon icon={rt.icon} />
              </button>
              <Tooltip
                placement={rt.placement}
                isOpen={this.state.tooltip && this.state.tooltip.title === rt.title}
                target={rt.title}
                toggle={() => this.toggleTooltip(rt)}
              >
                {languageService(rt.tooltip.text)}
              </Tooltip>
            </React.Fragment>
          ))}
        </div>
        <ModalBody style={{ ...themeService(CommonModalStyle.body), textAlign: "center", overflow: "auto" }}>{imgSelect}</ModalBody>
        <ModalFooter
          style={{ ...ModalStyles.footerButtonsContainer, ...themeService(CommonModalStyle.footer), display: "block", textAlign: "right" }}
        >
          <div style={{ textAlign: "center", display: "block", width: "100%" }}>
            <Icon
              icon={circleLeft}
              size={30}
              className="circle-left"
              onClick={() => this.handleImageTransition(selectedImageIndex - 1, images)}
              style={{
                cursor: "pointer",
                color: this.checkImageIndexExistence(images, selectedImageIndex - 1)
                  ? themeService({ default: basicColors.first, retro: retroColors.first })
                  : "grey",
              }}
            />
            <Icon
              icon={circleRight}
              size={30}
              className="circle-right"
              onClick={() => this.handleImageTransition(selectedImageIndex + 1, images)}
              style={{
                cursor: "pointer",
                color: this.checkImageIndexExistence(images, selectedImageIndex + 1)
                  ? themeService({ default: basicColors.first, retro: retroColors.first })
                  : "grey",
              }}
            />
          </div>
          <MyButton onClick={this.props.handleToggle}>{languageService("Close")} </MyButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ImageSlider;
