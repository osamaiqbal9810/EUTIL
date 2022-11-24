import React  from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ModalStyles } from 'components/Common/styles.js'

const MyButton = props => (
    <button className="setPasswordButton" {...props}>
        {props.children}
    </button>
);

const ConfirmationDialog  = ({toggle, headerText, warningMessage, handleResponse, modal, additionalMessages}) => (
    <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader style={ModalStyles.modalTitleStyle}> {headerText}</ModalHeader>
        <ModalBody>
            <div style={ModalStyles.modalBodyColor}>{warningMessage}</div>
            {additionalMessages && additionalMessages.length && (<div style={ModalStyles.modalBodyColor}>
                {additionalMessages.map(am=>{return (<li>{am}</li>)})}
            </div>)} 
        </ModalBody>
        <ModalFooter style={ModalStyles.footerButtonsContainer}>
            <MyButton
                onClick={() => {
                    handleResponse(false)
                }}
            >
                Ok
            </MyButton>
        </ModalFooter>
    </Modal>
);

export default ConfirmationDialog
