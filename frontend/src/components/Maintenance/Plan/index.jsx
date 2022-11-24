import React from "react";
import _ from "lodash";
import { commonFields } from "./variables";
import FormFields from "../../../wigets/forms/formFields";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { ModalStyles } from "../../Common/styles";
import { MyButton } from "../../Common/Forms/formsMiscItems";
import { processFromFields } from "../../../utils/helpers";

class PlanMaintenanceForm extends React.Component {

  state = {
    planFields: _.cloneDeep(commonFields),
  };

  updateFrom = newState => this.setState({ ...newState });

  submitForm = () => {
    commonFields.assignedTo.config.options = this.props.userList.map(user => ({ val: user._id, text: user.name }));
    this.setState({
      planFields: _.cloneDeep(commonFields),
    });

    let dataToSubmit = processFromFields(this.state.planFields);

    this.props.handleSubmitPlan(dataToSubmit);
  };

  componentDidUpdate(prevProps, prevState) {
    let { planFields } = this.state;

    if (prevProps.userList !== this.props.userList && planFields.assignedTo.config.options.length === 0) {
      planFields.assignedTo.config.options = this.props.userList.map(user => ({ val: user._id, text: user.name }));
      planFields.assignedTo.value = planFields.assignedTo.config.options[0].val;
      planFields.assignedTo.valid = true;

      this.updateFrom({ planFields });
    }
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
          <ModalHeader style={ModalStyles.modalTitleStyle}>Plan Maintenance</ModalHeader>
          <ModalBody>
            <div style={{ color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" }}> {this.props.maintenance.mrNumber} </div>

            <div style={{ color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" }}> {this.props.maintenance.description} </div>

            <div className={"commonform"}>
              <FormFields planFields={this.state.planFields} fieldTitle={"planFields"} change={this.updateFrom} />
            </div>
            <div style={{ color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" }}>
              <p>*Once a maintenance is planned, a work order will be created </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <MyButton type="submit" onClick={this.submitForm}>
              Ok
            </MyButton>
            <MyButton type="submit" onClick={this.props.toggle}>
              Cancel
            </MyButton>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default PlanMaintenanceForm;
