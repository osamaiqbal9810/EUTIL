import React from "react";
import _ from "lodash";
import { closeFields } from "./variables";
import FormFields from "../../wigets/forms/formFields";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { ModalStyles } from "../Common/styles";
import { MyButton } from "../Common/Forms/formsMiscItems";
import { processFromFields } from "../../utils/helpers";
import { languageService } from "../../Language/language.service";
import moment from "moment";
import { themeService } from "theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
class WorkOrderClose extends React.Component {
  state = {
    planFields: _.cloneDeep(closeFields),
  };

  updateFrom = (newState) => this.setState({ ...newState });

  submitForm = () => {
    this.setState({
      planFields: _.cloneDeep(closeFields),
    });

    let dataToSubmit = processFromFields(this.state.planFields);

    this.props.handleSubmit(dataToSubmit);
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props.modal !== prevProps.modal && this.props.modal) {
      let cfs = _.cloneDeep(closeFields);
      let executionDate = new Date(this.props.workOrder.executionDate);
      cfs.closedDate.config.dayPickerProps = { modifiers: { disabled: { before: executionDate } }, initialMonth: executionDate }; // disable the days before executionDate from selection
      this.setState({ planFields: cfs });
    }
  }

  render() {
    let dueDate = moment(this.props.workOrder.dueDate).format("ll");
    let executionDate = moment(this.props.workOrder.executionDate).format("ll");
    return (
      <div>
        <Modal
          isOpen={this.props.modal}
          toggle={this.props.toggle}
          contentClassName={themeService({ default: this.props.className, retro: "retro", electric: "electric" })}
        >
          <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
            {languageService("Select Close Date For Work Order")}
          </ModalHeader>
          <ModalBody style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.body))}>
            {/* <b> {this.props.workOrder.mrNumber} </b><br/> */}
            <label style={labelStyle}> {this.props.workOrder.mwoNumber} </label>
            <label style={labelStyle}> {this.props.workOrder.description} </label>
            <br />
            <label style={labelStyle}> {languageService("Due Date")}: </label> <span style={commonStyle}>{dueDate}</span>
            <br />
            <label style={labelStyle}> {languageService("Execution Date")}: </label> <span style={commonStyle}>{executionDate}</span>
            <br />
            <div className={"commonform"}>
              <FormFields planFields={this.state.planFields} fieldTitle={"planFields"} change={this.updateFrom} />
            </div>
            <b></b>
            <br />
          </ModalBody>

          <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
            <MyButton type="submit" onClick={this.submitForm} style={themeService(ButtonStyle.commonButton)}>
              {languageService("Save")}
            </MyButton>
            <MyButton type="submit" onClick={this.props.toggle} style={themeService(ButtonStyle.commonButton)}>
              {languageService("Cancel")}
            </MyButton>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default WorkOrderClose;

let commonStyle = themeService({
  default: {
    display: "inline-block",
    color: "var(--first)",

    fontSize: "14px",
    paddingBottom: "0.5em",
  },
  retro: {
    display: "inline-block",
    color: retroColors.second,

    fontSize: "14px",
    paddingBottom: "0.5em",
  },
  electric: {
    display: "inline-block",
    color: electricColors.second,

    fontSize: "14px",
    paddingBottom: "0.5em",
  },
});
let labelStyle = {
  fontWeight: "600",
  marginRight: "10px",
  ...commonStyle,
};
