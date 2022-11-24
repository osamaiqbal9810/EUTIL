import CommonModal from "components/Common/CommonModal";
import CloseIssue from "../CloseIssue";
import React, { Component } from "react";
import IssueFixedOnSiteDetail from "../IssueFixedOnSiteDetail";
import {languageService} from "../../../Language/language.service";
export class CloseIssueModal extends Component {
  constructor(props) {
    super(props);
    this.state = { validReason: false, closeValue: "", firstTime: true };

    // this.handleValidReason = this.handleValidReason.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancelOrToggleModal = this.handleCancelOrToggleModal.bind(this);
  }

  handleChange(e) {
    this.setState({
      closeValue: e.target.value,
      validReason: e.target.value ? true : false,
      firstTime: false,
    });
  }

  handleSubmit() {
    if (this.state.closeValue && this.state.validReason) {
      this.props.handleCloseSubmitClick(this.state.closeValue);
      this.setState({
        validReason: false,
        closeValue: "",
        firstTime: true,
      });
    } else {
      this.setState({
        validReason: false,
        closeValue: "",
        firstTime: true,
      });
    }
  }

  handleCancelOrToggleModal() {
    this.setState({
      validReason: false,
      closeValue: "",
      firstTime: true,
    });
  }
  render() {
    return (
      <CommonModal
        headerText={`Manual ${languageService('Close')}`}
        setModalOpener={this.props.openCloseModal}
        footerCancelText={this.props.selectedIssue && this.props.selectedIssue.closeReason ? "Ok" : "Cancel"}
        footerSubmitText={languageService("Save")}
        handleSubmitClick={
          this.props.selectedIssue && this.props.selectedIssue.status == "Resolved" && this.props.selectedIssue.closeReason
            ? null
            : this.handleSubmit
        }
        disabled={!this.state.validReason}
        receiveToggleMethod={this.handleCancelOrToggleModal}
      >
        <CloseIssue
          issue={this.props.selectedIssue}
          validReason={this.state.validReason}
          closed={
            this.props.selectedIssue && this.props.selectedIssue.status == "Resolved" && this.props.selectedIssue.closeReason ? true : false
          }
          handleValidReason={this.handleValidReason}
          firstTime={this.state.firstTime}
          handleChange={this.handleChange}
        />
      </CommonModal>
    );
  }
}

export const FixedOnSiteDetailModal = props => {
  
  const renderHeaderText = (issue) => {
    let text = '';

    if (!issue)
      return text;

    if (issue.marked)
      text = 'Fixed on Site';
    else
      text = issue.remedialAction;

    return text;
  };

  return (
    <CommonModal headerText={renderHeaderText(props.selectedIssue)} setModalOpener={props.openCloseModal} footerCancelText="Close">
      <IssueFixedOnSiteDetail issue={props.selectedIssue} />
    </CommonModal>
  );
};
