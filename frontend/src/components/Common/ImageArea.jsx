/* eslint eqeqeq: 0 */
import React, { Component } from "react";

import { getServerEndpoint } from "utils/serverEndpoint";
import "./uploadbutton.css";
import noImage from "images/noImage.png";
import { Row, Col } from "reactstrap";
import { redo } from "react-icons-kit/icomoon/redo";
import { undo } from "react-icons-kit/icomoon/undo";

import ImageSlider from "./ImageSlider";
import { themeService } from "../../theme/service/activeTheme.service";
import { none } from "../../images/FileTypes";

class ImageArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainImageIndex: 0,
      path: "",
      imgModal: false,
      imgSlider: false,
      selectedImg: "",
      selectedImageIndex: 0,
      images: [],
      showMultipleImgs: false,
      showBackButton: false,
      tooltipOpen: false,
      tooltip: null,
      rotateIndex: 0,
    };
    this.handleImgShow = this.handleImgShow.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleImgShow(img, data, index) {
    let imgDescription = "";
    let images = [];
    if (data) {
      imgDescription = data.description;
      images = data.imagesList;
    }
    this.setState({
      imgSlider: !this.state.imgSlider,
      selectedImg: img,
      selectedImageIndex: index,
      images,
      showMultipleImgs: false,
      imgDescription: imgDescription,
      showBackButton: false,
    });
  }

  handleToggle() {
    this.setState({
      imgSlider: typeof this.state.imgSlider == "undefined" ? !this.state.imgSlider : false,
      showMultipleImgs: false,
      showBackButton: false,
    });
  }

  render() {
    let imagesList = null;
    if (this.props.imagesList) {
      imagesList = this.props.imagesList.map((image, index) => {
        if (index >= 0) {
          return (
            <div
              onClick={(e) => {
                this.handleImgShow(image.imgName, this.props, index);
              }}
              style={{ display: "inline-block", width: "30%", margin: "0 3% 0 0", cursor: "pointer" }}
              key={image.imgName + index}
            >
              <ImageMainComp imageName={image.imgName} borderStyle={"1px solid var(--first)"} width={"100%"} path={this.props.path} />
            </div>
          );
        }
      });
    }

    return (
      <div>
        <ImageSlider
          imgSlider={this.state.imgSlider}
          imageDirectory={this.props.path || "applicationresources"}
          images={this.state.images}
          initialIndex={this.state.selectedImageIndex}
          handleToggle={this.handleToggle}
        />
        <Row>
          <Col md={12}>
            <div className="scrollbarHor" style={{ overflow: "auto", whiteSpace: "nowrap", padding: "10px 0px 5px 0px" }}>
              {imagesList}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ImageArea;

class ImageMainComp extends Component {
  render() {
    let path = getServerEndpoint() + this.props.path + "/" + this.props.imageName;
    if (!this.props.imageName) {
      path = noImage;
    }
    return (
      <div style={{ width: this.props.width ? this.props.width : "inherit" }}>
        <img
          style={themeService({
            default: {
              width: "inherit",
              border: this.props.borderStyle ? this.props.borderStyle : "3px solid var(--first)",
              borderRadius: "5px",
            },
            retro: {
              width: "inherit",
              border: none,
              borderRadius: "0",
            },
            electric: {
              width: "inherit",
              border: none,
              borderRadius: "0",
            },
          })}
          src={path}
          alt="img"
        />
      </div>
    );
  }
}
