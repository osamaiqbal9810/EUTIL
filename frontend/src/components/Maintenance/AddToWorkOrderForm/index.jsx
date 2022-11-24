import React from "react";
import _ from 'lodash';
//import {commonFields} from './variables';
//import FormFields from "../../../wigets/forms/formFields";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import {ModalStyles} from "../../Common/styles";
import {MyButton} from "../../Common/Forms/formsMiscItems";
import { languageService } from "../../../Language/language.service";
import EditableTable from "components/Common/EditableTable";

//import {processFromFields} from "../../../utils/helpers";
const WOTableCols=[
{id:"Select", header: languageService("Select"), type:"radio", field: "selected", editable: false, minWidth: 35},    
{id:"MWONO", header: languageService("MWO No."), field: "mwoNumber", editable: false, minWidth: 40},
{id:"createdAt", header: languageService("Created"), field: "createdAt", editable: false, minWidth: 50},
{id:"dueDate", header: languageService("Plan Date"), field: "dueDate", editable: false, minWidth: 50},
{id:"AssignedTo", header: languageService("Assigned To"), field: "assignedTo", editable: false, minWidth: 50}];


class AddToWorkOrderForm extends React.Component {
    state = {
        notStartedWorkOrders: []
    };
    constructor(props)
    {
        super(props);
        this.onChange=this.onChange.bind(this);
    }

    updateFrom = newState => this.setState({ ...newState });

    submitForm = () => {
        // this.setState({
        //     planFields: _.cloneDeep(commonFields)
        // });

        let dataToSubmit = {};// processFromFields(this.state.planFields);

        this.props.handleSubmit(dataToSubmit);
    };
    onChange(name, value, obj)
    {
    //   if(this.props.modalMode==='view')
    //     return;

      let nswos=_.cloneDeep(this.state.notStartedWorkOrders);

        for(let nswo of nswos)
        {
            if(nswo.mwoNumber===obj.mwoNumber)
            {
                if(nswo.hasOwnProperty(name))
                {
                    nswo[name]=!nswo[name];
                }
            }
            else
            {
                if(nswo.hasOwnProperty(name))
                {
                    nswo[name]=false;
                }                
            }
        }
        
        this.setState({notStartedWorkOrders: nswos});
    }
    componentDidUpdate(prevProps, prevState) 
    {
        if(prevProps.notStartedWorkOrders!==this.props.notStartedWorkOrders)
        {
            this.setNSWOS(this.props.notStartedWorkOrders);
        }
        if(prevProps.modal !== this.props.modal && this.props.modal)
        {
            if(this.state.notStartedWorkOrders.length)
            {
                let nswos=_.cloneDeep(this.state.notStartedWorkOrders);
                for(let nswo of nswos)
                 nswo.selected=false;
                 
                 this.setState({notStartedWorkOrders: nswos});
            }
        }

    }
    setNSWOS(notStartedWorkOrders)
    {
        let nswos=[];//_.cloneDeep(notStartedWorkOrders);
        for(let nswo of notStartedWorkOrders)
        {
            nswo.selected=false;
            nswos.push({selected: false, mwoNumber: nswo.mwoNumber, createdAt: nswo.createdAt, dueDate: nswo.dueDate, assignedTo: nswo.assignedTo});
        }
        this.setState({notStartedWorkOrders: nswos});   
    }


    render() {
        return (

            <div>
                <Modal isOpen={this.props.modal} toggle={this.props.toggle} >
                    <ModalHeader style={ModalStyles.modalTitleStyle}>
                        Add Maintenance To Work Order 
                    </ModalHeader>
                    <ModalBody>
                        <b> {this.props.maintenance.mrNumber} </b><br/>
                        <b> {this.props.maintenance.description} </b><br/>
                        <br/>
                        <br/>
                        {/* <div className={'commonform'}>
                            <FormFields
                                planFields={this.state.planFields}
                                fieldTitle={"planFields"}
                                change={this.updateFrom}
                            />
                        </div>
                        <b></b><br/> */}
                        <Row>
                        <Col md="12">
                        <EditableTable columns={WOTableCols} data={this.state.notStartedWorkOrders} handleActionClick={a=>{}} onChange={this.onChange} options={{}}/>
                        </Col>
                        </Row>
                        <Row>
                        <MyButton type="submit" onClick={this.createNewWO}> Create New Work Order </MyButton>
                        </Row>
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

export default AddToWorkOrderForm;
