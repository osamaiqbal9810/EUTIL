import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import { getServerEndpoint } from "./../../../utils/serverEndpoint";
import SvgIcon from "react-icons-kit";
import { plus } from "react-icons-kit/icomoon/plus";
import "./uploadbutton.css";
import noImage from "./../../../images/noImage.png";
import _ from "lodash";
import { FORM_MODES } from "../../../utils/globals";
import { themeService } from "theme/service/activeTheme.service";
import { retroColors } from "../../../style/basic/basicColors";

class MaintenanceImageArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainImageIndex: 0,
      imagesList: [],
    };
  }

  handleShowImageGallery = () => {
    this.props.addMaintenanceStateHandler({ formModes: FORM_MODES.IMAGE_SELECTION });
  };

  handleShowImageSlider = (selectedImageIndex) => {
    this.props.addMaintenanceStateHandler({
      formModes: FORM_MODES.IMAGE_GALLERY,
      selectedImageIndex,
    });
  };

  onClick(index) {
    //console.log('image gallery click:', imagename, index);
    // make clicked image as zero index
    this.setState({ mainImageIndex: index });
  }
  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.props.imagesList) !== JSON.stringify(prevProps.imagesList) && this.props.imagesList.length) {
      this.setState({ imagesList: _.cloneDeep(this.props.imagesList) });
    }
  }
  render() {
    let imagesList = null;
    // console.log(this.props.imagesList)
    if (this.props.imagesList) {
      imagesList = this.props.imagesList.map((imageName, index) => {
        if (index !== this.state.mainImageIndex) {
          return (
            <div style={{ display: "inline-block", width: "30%", margin: "0 3% 0 0", cursor: "pointer" }} key={imageName + index}>
              <ImageMainComp
                imageName={imageName}
                borderStyle={"1px solid rgba(64, 118, 179)"}
                width={"100%"}
                onClick={() => {
                  this.onClick(index);
                }}
              />
            </div>
          );
        }
      });
    }

    return (
      <div>
        <Row>
          <Col md={12}>
            <ImageMainComp
              imageName={this.props.imagesList[this.state.mainImageIndex]}
              onClick={() => {
                if (this.props.imagesList && this.props.imagesList.length > 0) this.handleShowImageSlider(this.state.mainImageIndex);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={10}>
            <div className="scrollbarHor" style={{ overflow: "auto", whiteSpace: "nowrap", padding: "10px 0px 5px 0px" }}>
              {imagesList}
            </div>
          </Col>
          <Col md={2} style={{ padding: "0px" }}>
            <div
              style={themeService({
                default: { padding: "25px 0px", margin: "auto", width: "50%", color: "rgba(64, 118, 179)" },
                retro: { padding: "25px 0px", margin: "auto", width: "50%", color: retroColors.second },
              })}
            >
              {/* <div className="upload-btn-wrapper">
                <SvgIcon icon={plus} size={20} />

                <input type="file" name="myfile" accept="image/*" onChange={this.props.addImage} />
              </div> */}
              <span style={{ cursor: "pointer" }}>
                <SvgIcon icon={plus} size={20} onClick={() => this.handleShowImageGallery(true)} />
              </span>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MaintenanceImageArea;

class ImageMainComp extends Component {
  render() {
    let path = "http://" + getServerEndpoint() + "applicationresources/" + this.props.imageName;
    if (!this.props.imageName) {
      path = noImage;
    }
    return (
      <div style={{ width: this.props.width ? this.props.width : "inherit" }}>
        <img
          style={{
            width: "inherit",
            border: themeService({ default: { ...(this.props.borderStyle ? this.props.borderStyle : "3px solid rgba(64, 118, 179)") }, retro: {} }),
            borderRadius: "5px",
          }}
          src={path}
          alt="img"
          onClick={this.props.onClick}
        />
      </div>
    );
  }
}
