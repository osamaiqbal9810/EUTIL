import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import { CRUDFunction } from "reduxCURD/container";
import { loadAllDocuments, uploadDocuments } from "reduxRelated/actions/documentUpload.js";

import { getServerEndpoint } from "utils/serverEndpoint";
import "./style.css";
import * as extensionImage from "../../../images/FileTypes";
import { processFileExtension } from "../helperFunctions";
import { languageService } from "../../../Language/language.service";
import { ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class DocumentGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDocument: null,
      documentsList: [],
      uploadDocumentFilePlaceHolder: languageService("Choose File"),
      file: null,
      fileToUpload: false,
    };

    this.styles = themeService({
      default: {
        row: {
          fontSize: "12px",
          minHeight: "30px",
          color: "var(--first)",
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
      electric: {
        row: {
          fontSize: "12px",
          minHeight: "30px",
          color: electricColors.second,
          padding: "12px 10px 6px 12px",
          borderLeft: "1px solid #e3e9ef",
          borderRight: "1px solid #e3e9ef",
          borderBottom: "1px solid #e3e9ef",
          boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
          transitionDuration: "2s",
        },
      },
    });

    this.handleDocumentUpload = this.handleDocumentUpload.bind(this);
    this.handleDocumentUploadFileButton = this.handleDocumentUploadFileButton.bind(this);
  }

  componentDidMount() {
    if (this.props.loadDocumentPath) {
      this.props.loadAllDocuments(this.props.loadDocumentPath);
    } else {
      this.props.loadAllDocuments();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.docsList !== prevState.documentsList && nextProps.docsList && nextProps.docsActionType === "DOCUMENTS_LOAD_SUCCESS") {
      return {
        documentsList: nextProps.docsList,
        actionType: nextProps.docsActionType,
      };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.docsActionType === "DOCUMENT_UPLOAD_SUCCESS" && this.props.docsActionType !== prevProps.docsActionType) {
      this.setState({
        selectedDocument: this.state.file.name,
        file: null,
        fileToUpload: false,
      });
      if (this.props.loadDocumentPath) {
        this.props.loadAllDocuments(this.props.loadDocumentPath);
      } else {
        this.props.loadAllDocuments();
      }
    }
  }

  setSelectedDocument(document) {
    this.setState({
      selectedDocument: document,
    });
  }

  handleDocumentUpload(e) {
    let file = e.target.files[0];
    if (file) {
      this.setState({
        uploadDocumentFilePlaceHolder: file.name,
        file: file,
        fileToUpload: true,
      });
    }
  }

  handleDocumentUploadFileButton() {
    if (this.state.fileToUpload) {
      this.props.uploadDocuments(this.state.file, "uploadassetdocument");
    }
  }

  render() {
    let documentComp;
    documentComp = null;
    if (this.state.documentsList) {
      documentComp = this.state.documentsList.map((documentName) => {
        let [fileName, extension] = documentName.split(".");

        extension = processFileExtension(extension);

        return (
          <div className="colsImgs" key={documentName}>
            <img
              src={extensionImage[extension]}
              style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
              alt={extension}
              onClick={() => {
                this.setSelectedDocument(documentName);
              }}
            />
            <div>{fileName}</div>
          </div>
        );
      });
    }
    return (
      <div style={{ width: "100%" }} className={localStorage.getItem("theme")}>
        <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Select Document")}</ModalHeader>

        <ModalBody className="form-wrapper scrollbar">
          {this.props.uploadImageAllow && (
            <div>
              <label className="fullWidth">{languageService("Upload Document")}</label>
              <Row>
                <Col md={10}>
                  <div className="fileinputs">
                    <input
                      type="file"
                      id="imgUpload"
                      name="imgFile"
                      label={this.state.uploadDocumentFilePlaceHolder}
                      onChange={this.handleDocumentUpload}
                      style={{ width: "100%", border: "1px solid #ccc", background: "transparent", paddingLeft: "33px" }}
                    />
                    <div className="fakefile" style={{ pointerEvents: "none" }}>
                      <input
                        style={{
                          width: "0px",
                          backgroundColor: "var(--nine)",
                          border: "none",
                          height: " 40px",
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
                    onClick={this.handleDocumentUploadFileButton}
                    style={{ height: "40px", width: "60px", ...themeService(ButtonStyle.commonButton) }}
                  >
                    {languageService("Upload")}
                  </MyButton>
                </Col>
              </Row>
            </div>
          )}
          <div>
            <label className="fullWidth">{languageService("Selected Document")}</label>
            <div style={this.styles.row} onClick={this.handleUnitsAddView}>
              {this.state.selectedDocument}
            </div>
          </div>
          <div className="rowsOfImgs">{documentComp}</div>
        </ModalBody>
        <ModalFooter style={ModalStyles.footerButtonsContainer}>
          <MyButton
            onClick={() => {
              this.props.handleSave(this.state.selectedDocument);
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
  others: { loadAllDocuments, uploadDocuments },
};
let variableList = {
  docsReducer: {
    docsList: [],
  },
};
const DocumentGalleryContainer = CRUDFunction(DocumentGallery, "documentGallery", actionOptions, variableList, ["docsReducer"]);
export default DocumentGalleryContainer;
