import React, { Component } from 'react'
import { CRUDFunction } from 'reduxCURD/container'
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Label } from 'components/Common/Forms/formsMiscItems'
import { ModalStyles } from 'components/Common/styles.js'
import 'components/Common/commonform.css'
import MapBox from './';


const MyButton = props => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
)


class GISDisplayModal extends Component{
    constructor(props)
    {
        super(props);
        
        this.handleOkClick = this.handleOkClick.bind(this);        

        this.state = {
                lineAsset:[],
                selectedAsset: ''
        };

    }
    handleOkClick()
    {
        this.props.toggle();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return {lineAsset: nextProps.lineAsset, selectedAsset: nextProps.selectedAsset};
    }

    render()
    {
        // return (<Modal isOpen={this.props.modal} toggle={this.props.toggle} style={{ maxWidth: '50vw' }}>
        // <ModalBody>
        // <Row>
        //     <ModalHeader style={ModalStyles.modalTitleStyle}>Geographic position</ModalHeader>
        // </Row>
        // <Row>
        return (<div> {this.props.modalGISState==="view" && <MapBox assets={{}} lineAsset={this.state.lineAsset} selectedAsset={this.state.selectedAsset} displayState={this.props.modalGISState} />} </div>);
        // </Row>
        // <Row>
        // <Col md="12">
        // <MyButton type="button" onClick={this.handleOkClick}>  Close </MyButton>
        // </Col>
        // </Row>
        // </ModalBody>
        // </Modal>);
    }

}

export default GISDisplayModal;