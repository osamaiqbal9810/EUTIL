import React, { Component } from "react";
import { ButtonCirclePlus } from "../Common/Buttons";
import { commonSummaryStyle } from "components/Common/Summary/styles/CommonSummaryStyle.js";
import { themeService } from "../../theme/service/activeTheme.service";
import { languageService } from "../../Language/language.service";
import { Row, Col, Tooltip } from "reactstrap";
import GeneralInfoList from "./GeneralInfoList";
import CommonModal from "../Common/CommonModal";
import { AddGeneralInfoFile } from "./AddGeneralInfoFile";

class GeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
    };
    this.openModalMethod;
    this.handleAddNewClick = this.handleAddNewClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDocumentUpload = this.handleDocumentUpload.bind(this);
  }
  handleAddNewClick(mode) {
    if (mode === "Add") {
      this.openModalMethod && this.openModalMethod(true);
    }
  }
  handleSubmit() {}
  handleDocumentUpload(e) {
    console.log("e", e);
    console.log("target", e.target.files);
  }
  render() {
    return (
      <React.Fragment>
        <CommonModal
          setModalOpener={(method) => {
            this.openModalMethod = method;
          }}
          handleSubmitClick={this.handleSubmit}
        >
          <AddGeneralInfoFile handleDocumentUpload={this.handleDocumentUpload} />
        </CommonModal>
        <Row>
          <Col md={11} />
          <Col md={1}>
            <AddDocsButton Col={1} handleAddNewClick={this.handleAddNewClick} />
          </Col>
          <span className="spacer" />
          <GeneralInfoList />
        </Row>
      </React.Fragment>
    );
  }
}

export default GeneralInfo;

const AddDocsButton = (props) => {
  return (
    <div>
      <div id={"toolTipAddDocs"}>
        <ButtonCirclePlus
          handleClick={(e) => {
            props.handleAddNewClick("Add");
          }}
          {...themeService(commonSummaryStyle.addButtonStyle(props))}
        />
      </div>

      <Tooltip isOpen={props.tooltipOpen} target={"toolTipAddDocs"} toggle={props.toggleTooltip}>
        {languageService("Add")} {languageService(props.addTootTipText)}
      </Tooltip>
    </div>
  );
};
