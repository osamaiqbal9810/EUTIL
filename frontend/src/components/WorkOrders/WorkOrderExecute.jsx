import React from "react";
import _ from "lodash";
import { executionFields } from "./variables";
import FormFields from "../../wigets/forms/formFields";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { ModalStyles } from "../Common/styles";
import { MyButton } from "../Common/Forms/formsMiscItems";
import { processFromFields } from "../../utils/helpers";
import moment from "moment";
import { languageService } from "../../Language/language.service";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { retroColors } from "../../style/basic/basicColors";

class WorkOrderExecute extends React.Component {
  constructor(props) {
    super(props);
    let efs = _.cloneDeep(executionFields);
    this.state = { planFields: efs };
  }

  updateFrom = newState => this.setState({ ...newState });

  submitForm = () => {
    this.setState({
      planFields: _.cloneDeep(executionFields),
    });

    let dataToSubmit = processFromFields(this.state.planFields);

    this.props.handleSubmit(dataToSubmit);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.modal !== prevProps.modal && this.props.modal) {
      let efs = _.cloneDeep(executionFields);
      let dueDate = new Date(this.props.workOrder.dueDate);
      efs.executionDate.config.dayPickerProps = { modifiers: { disabled: { before: dueDate } }, initialMonth: dueDate }; // disable the days before due Date from selection
      this.setState({ planFields: efs });
    }
  }

  render() {
    let dueDate = moment(this.props.workOrder.dueDate).format("ll");

    return (
      <div>
        <Modal
          contentClassName={themeService({ default: this.props.className, retro: "retro" })}
          isOpen={this.props.modal}
          toggle={this.props.toggle}
        >
          <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
            {languageService("Select Execution Date For Work Order")}
          </ModalHeader>
          <ModalBody style={themeService(CommonModalStyle.body)}>
            <div
              style={themeService({
                default: { color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" },
                retro: { color: retroColors.second, fontSize: "14px", paddingBottom: "1em" },
              })}
            >
              {" "}
              {this.props.workOrder.mwoNumber}
            </div>
            {/* <div style={{ color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" }}>  {this.props.maintenance.workOrderNumber} </div> */}
            <div
              style={themeService({
                default: { color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" },
                retro: { color: retroColors.second, fontSize: "14px", paddingBottom: "1em" },
              })}
            >
              {" "}
              {this.props.workOrder.description}{" "}
            </div>
            <div
              style={themeService({
                default: { color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" },
                retro: { color: retroColors.second, fontSize: "14px", paddingBottom: "1em" },
              })}
            >
              {" "}
              {languageService("Due Date")}: {dueDate}{" "}
            </div>
            <div className={"commonform"}>
              <FormFields planFields={this.state.planFields} fieldTitle={"planFields"} change={this.updateFrom} />
            </div>
            <b></b>
            <br />
          </ModalBody>

          <ModalFooter style={themeService(CommonModalStyle.footer)}>
            <MyButton type="submit" onClick={this.submitForm}>
              {languageService("Save")}
            </MyButton>
            <MyButton type="submit" onClick={this.props.toggle}>
              {languageService("Cancel")}
            </MyButton>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default WorkOrderExecute;
