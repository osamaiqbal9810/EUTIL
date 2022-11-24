import React from "react";
import _ from 'lodash';
import { commonFields } from './variables';
import FormFields from "../../../wigets/forms/formFields";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { ModalStyles } from "../../Common/styles";
import { MyButton } from "../../Common/Forms/formsMiscItems";
import { processFromFields } from "../../../utils/helpers";


class MaintenanceExecuteForm extends React.Component {
    state = {
        planFields: _.cloneDeep(commonFields)
    };

    updateFrom = newState => this.setState({ ...newState });

    submitForm = () => {
        this.setState({
            planFields: _.cloneDeep(commonFields)
        });

        let dataToSubmit = processFromFields(this.state.planFields);

        this.props.handleSubmit(dataToSubmit);
    };

    componentDidUpdate(prevProps, prevState) {
    }


    render() {
        return (

            <div>
                <Modal isOpen={this.props.modal} toggle={this.props.toggle} >
                    <ModalHeader style={ModalStyles.modalTitleStyle}>
                        Select Execution Date For Maintenance
                    </ModalHeader>
                    <ModalBody>
                        <div style={{ color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" }}>  {this.props.maintenance.mrNumber}</div>
                        <div style={{ color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" }}>  {this.props.maintenance.workOrderNumber} </div>
                        <div style={{ color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" }}>  {this.props.maintenance.description} </div>
                        <div style={{ color: "rgb(64, 118, 179)", fontSize: "14px", paddingBottom: "1em" }}>  Due Date: {this.props.maintenance.dueDate} </div>
                        <div className={'commonform'}>
                            <FormFields
                                planFields={this.state.planFields}
                                fieldTitle={"planFields"}
                                change={this.updateFrom}
                            />
                        </div>
                        <b></b><br />
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

export default MaintenanceExecuteForm;
