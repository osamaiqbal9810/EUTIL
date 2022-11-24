import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import { CRUDFunction } from "reduxCURD/container";
import { loadAllImgs, uploadImgs } from "reduxRelated/actions/imgsUpload.js";

import { getServerEndpoint } from "utils/serverEndpoint";
import "./style.css";
import { languageService } from "../../../Language/language.service";
import { ButtonStyle, CommonModalStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { retroColors } from "../../../style/basic/basicColors";
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImg: null,
      imgsList: [],
      uploadImgFilePlaceHolder: languageService("Choose File"),
      file: null,
      fileToUpload: false,
    };

    this.styles = themeService({
      default: {
        row: {
          fontSize: "12px",
          minHeight: "30px",
          color: "rgba(64, 118, 179)",
          padding: "12px 10px 6px 12px",
          borderLeft: "1px solid #e3e9ef",
          borderRight: "1px solid #e3e9ef",
          borderBottom: "1px solid #e3e9ef",
          boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
          transitionDuration: "2s",
        },
      },
      retro: {
        row: {
          fontSize: "12px",
          minHeight: "30px",
          color: retroColors.second,
          padding: "12px 10px 6px 12px",
          borderLeft: "1px solid #e3e9ef",
          borderRight: "1px solid #e3e9ef",
          borderBottom: "1px solid #e3e9ef",
          boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
          transitionDuration: "2s",
        },
      },
    });

    this.handleImgUpload = this.handleImgUpload.bind(this);
    this.handleImageUploadFileButton = this.handleImageUploadFileButton.bind(this);
  }

  componentDidMount() {
    if (this.props.loadImgPath) {
      this.props.loadAllImgs(this.props.loadImgPath);
    } else {
      this.props.loadAllImgs();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.imgsList !== prevState.imgsList && nextProps.imgsList && nextProps.imgActionType == "IMGS_LOAD_SUCCESS") {
      return {
        imgsList: nextProps.imgsList,
        actionType: nextProps.imgActionType,
      };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.imgActionType == "IMG_UPLOAD_SUCCESS" && this.props.imgActionType !== prevProps.imgActionType) {
      this.setState({
        selectedImg: this.state.file.name,
        file: null,
        fileToUpload: false,
      });
      if (this.props.loadImgPath) {
        this.props.loadAllImgs(this.props.loadImgPath);
      } else {
        this.props.loadAllImgs();
      }
    }
  }

  setSelectedImg(img) {
    this.setState({
      selectedImg: img,
    });
  }

  handleImgUpload(e) {
    let file = e.target.files[0];
    if (file) {
      this.setState({
        uploadImgFilePlaceHolder: file.name,
        file: file,
        fileToUpload: true,
      });
    }
  }

  handleImageUploadFileButton() {
    if (this.state.fileToUpload) {
      this.props.uploadImgs(this.state.file, this.props.uploadCustomPath ? this.props.uploadCustomPath : "upload");
    }
  }

  render() {
    let imgComp, paths;
    imgComp = null;
    if (this.state.imgsList) {
      imgComp = this.state.imgsList.map((imgName, index) => {
        paths = this.props.customFolder
          ? "http://" + getServerEndpoint() + this.props.customFolder + "/" + imgName
          : "http://" + getServerEndpoint() + "thumbnails/" + imgName;
        //  console.log(paths)
        return (
          <div className="colsImgs" key={imgName}>
            <img
              src={paths}
              style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
              alt={imgName}
              onClick={(e) => {
                this.setSelectedImg(imgName);
              }}
            />
          </div>
        );
      });
    }
    return (
      <div className={localStorage.getItem("theme")}>
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {languageService("Select Image")}
        </ModalHeader>

        <ModalBody
          style={
            (ModalStyles.footerButtonsContainer, { ...themeService(CommonModalStyle.footer), display: "block", border: "1px solid #ccc" })
          }
        >
          {this.props.uploadImageAllow && (
            <div>
              <label className="fullWidth">{languageService("Upload Image")}</label>
              <Row>
                <Col md={8}>
                  <div className="fileinputs">
                    <input
                      type="file"
                      id="imgUpload"
                      name="imgFile"
                      label={this.state.uploadImgFilePlaceHolder}
                      onChange={this.handleImgUpload}
                      accept="image/*"
                      style={{ width: "100%", border: "1px solid #ccc", paddingLeft: "33px", background: "transparent" }}
                    />
                    <div className="fakefile" style={{ pointerEvents: "none" }}>
                      <input
                        style={{
                          width: "0px",
                          backgroundColor: "rgb(64, 118, 179)",
                          border: "none",
                          height: " 36px",
                          // borderRight: "1px solid #ccc",
                        }}
                      />
                      <label className="upload-file" style={{ pointerEvents: "none" }}>
                        {languageService("Choose File")}
                      </label>
                    </div>
                  </div>
                </Col>
                <Col md={2}>
                  <MyButton
                    onClick={this.handleImageUploadFileButton}
                    style={{ height: "40px", width: "60px", ...themeService(ButtonStyle.commonButton), minWidth: "134px" }}
                  >
                    {languageService("Upload")}
                  </MyButton>
                </Col>
              </Row>
            </div>
          )}
          <div>
            <label className="fullWidth">{languageService("Selected Image")}</label>
            <div style={this.styles.row} onClick={this.handleUnitsAddView}>
              {this.state.selectedImg}
            </div>
          </div>
          <div className="rowsOfImgs form-wrapper scrollbarHor">{imgComp}</div>
        </ModalBody>
        <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          <MyButton
            onClick={(e) => {
              this.props.handleSave(this.state.selectedImg);
            }}
            style={themeService(ButtonStyle.commonButton)}
          >
            {languageService("Select")}
          </MyButton>
          <MyButton onClick={this.props.handleCancel} style={themeService(ButtonStyle.commonButton)}>
            {languageService("Cancel")}{" "}
          </MyButton>
        </ModalFooter>
      </div>
    );
  }
}

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { loadAllImgs, uploadImgs },
};
let variableList = {
  imgReducer: {
    imgsList: [],
  },
};
const ImageGalleryContainer = CRUDFunction(ImageGallery, "imageGallery", actionOptions, variableList, ["imgReducer"]);
export default ImageGalleryContainer;
