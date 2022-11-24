/* eslint eqeqeq: 0 */

import React, { Component } from 'react'
import {
  Row,
  Col,
  // Button,
  // Modal,
  // ModalHeader,
  // ModalBody,
  // ModalFooter,
  // Dropdown,
  // DropdownMenu,
  // DropdownToggle,
  // DropdownItem
} from 'reactstrap'
import { CRUDFunction } from 'reduxCURD/container'
import { ButtonCirclePlus } from 'components/Common/Buttons'
import { commonPageStyle } from 'components/Common/Summary/styles/CommonPageStyle'
import { withPlus } from 'react-icons-kit/entypo/withPlus'
import SvgIcon from 'react-icons-kit'
import PermissionList from './PermissionList/PermissionList'
import PermissionAddEdit from './PermissionAddEdit/PermissionAddEdit'
class Permissions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addModal: false,
      modalState: 'None',
      selectedPermission: null
    }
    this.handleAddEditModalClick = this.handleAddEditModalClick.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
  }

  handleAddEditModalClick(modalState, permission) {
    //console.log(modalState)
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedPermission: permission
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == 'PERMISSION_UPDATE_SUCCESS') {
      this.props.getPermission()
    }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == 'PERMISSION_CREATE_SUCCESS') {
      this.props.getPermission()
    }
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == 'PERMISSION_DELETE_SUCCESS') {
      this.props.getPermission()
    }
  }

  handleAdd(permission) {
    this.props.createPermission(permission)
  }

  handleEdit(permission) {
    this.props.updatePermission(permission)
  }

  componentDidMount() {
    this.props.getPermission()
  }

  render() {
    return (
      <Col md="12">
        <PermissionAddEdit
          modal={this.state.addModal}
          modalState={this.state.modalState}
          toggle={this.handleAddEditModalClick}
          handleAddSubmit={this.handleAdd}
          handleEditSubmit={this.handleEdit}
          selectedPermission={this.state.selectedPermission}
        />

        <Row style={{ height: '80px', margin: '0px' }}>
          <Col md={{ size: 1, offset: 11 }}>
            <ButtonCirclePlus
              iconSize={70}
              icon={withPlus}
              handleClick={e => {
                this.handleAddEditModalClick('Add')
              }}
              backgroundColor="#e3e9ef"
              margin="0px 0px 0px 0px"
              borderRadius="50%"
              hoverBackgroundColor="#e3e2ef"
              hoverBorder="0px"
              activeBorder="3px solid #e3e2ef "
              iconStyle={{
                color: '#c4d4e4',
                background: '#fff',
                borderRadius: '50%',
                border: '3px solid '
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <div style={commonPageStyle.commonSummaryHeadingContainer}>
              <h4 style={commonPageStyle.commonSummaryHeadingStyle}>Permission List</h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <PermissionList
              tableData={this.props.permissions}
              handleEditClick={this.handleAddEditModalClick}
              // handleDeleteClick={this.handleDeleteClick}
              // handleViewClick={this.handleViewClick}
            />
          </Col>
        </Row>
      </Col>
    )
  }
}

const PermissionsContainer = CRUDFunction(Permissions, 'permission')
export default PermissionsContainer
