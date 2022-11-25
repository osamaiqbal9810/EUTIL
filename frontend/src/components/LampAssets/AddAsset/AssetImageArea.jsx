/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { getServerEndpoint } from "utils/serverEndpoint";
import SvgIcon from "react-icons-kit";
import { plus } from "react-icons-kit/icomoon/plus";
import "./uploadbutton.css";
import noImage from "images/noImage.png";
import { themeService } from "theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
class AssetImageArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainImageIndex: 0,
    };
  }

  onClick(imagename, index) {
    // console.log('image gallery click:', imagename, index);
    // make clicked image as zero index
    this.setState({ mainImageIndex: index });
  }

  render() {
    let imagesList = null;
    // console.log(this.props.imagesList)
    if (this.props.imagesList) {
      imagesList = this.props.imagesList.map((imageName, index) => {
        if (index !== this.state.mainImageIndex) {
          return (
            <div style={{ display: "inline-block", width: "30%", margin: "0 3% 0 0", cursor: "pointer" }} key={index}>
              <ImageMainComp
                imageName={imageName}
                borderStyle={"0px solid var(--first)"}
                width={"100%"}
                onClick={() => {
                  this.onClick(imageName, index);
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
                this.props.showImgaeSlider(this.state.mainImageIndex);
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
          {this.props.acctionBtn && (
            <Col md={2} style={{ padding: "0px" }}>
              <div
                style={themeService({
                  default: { padding: "25px 0px", margin: "auto", width: "50%", color: "var(--first)" },
                  retro: { padding: "25px 0px", margin: "auto", width: "50%", color: retroColors.second },
                  electric: { padding: "25px 0px", margin: "auto", width: "50%", color: electricColors.second },
                })}
              >
                {/* <div className="upload-btn-wrapper">
                          <SvgIcon icon={plus} size={20} />

                          <input type="file" name="myfile" accept="image/*" onChange={this.props.addImage} />
                        </div> */}
                <span style={{ cursor: "pointer" }}>
                  <SvgIcon icon={plus} size={20} onClick={this.props.showImageGallery} />
                </span>
              </div>
            </Col>
          )}
        </Row>
      </div>
    );
  }
}

export default AssetImageArea;

class ImageMainComp extends Component {
  render() {
    let path = getServerEndpoint() + "assetImages/" + this.props.imageName;
    if (!this.props.imageName) {
      path = noImage;
    }
    return (
      <div style={{ width: this.props.width ? this.props.width : "inherit" }}>
        <img
          style={{
            width: "inherit",
            border: themeService({
              default: { ...(this.props.borderStyle ? this.props.borderStyle : "3px solid var(--first)") },
              retro: {},
              electric: {},
            }),
            borderRadius: "5px",
          }}
          src={path}
          alt="img"
          onClick={() => {
            this.props.imageName ? this.props.onClick() : "";
          }}
        />
      </div>
    );
  }
}
