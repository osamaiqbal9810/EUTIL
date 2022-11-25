import React from "react";
import { Row, Col } from "reactstrap";
import { languageService } from "../../Language/language.service";
import "../Common/DocumentGallery/style.css";
export const AddGeneralInfoFile = (props) => {
  return (
    <div>
      <label className="fullWidth">{languageService("Upload Document")}</label>
      <Row>
        <Col md={10}>
          <div className="fileinputs">
            <input
              type="file"
              id="imgUpload"
              name="imgFile"
              multiple={true}
              label={props.uploadDocumentFilePlaceHolder}
              onChange={props.handleDocumentUpload}
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
        {/* <Col md={2}>
          <MyButton
            onClick={this.handleDocumentUploadFileButton}
            style={{ height: "40px", width: "60px", ...themeService(ButtonStyle.commonButton) }}
          >
            {languageService("Upload")}
          </MyButton>
        </Col> */}
      </Row>
    </div>
  );
};
