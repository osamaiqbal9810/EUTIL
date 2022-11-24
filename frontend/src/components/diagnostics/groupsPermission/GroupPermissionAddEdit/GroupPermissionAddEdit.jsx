/* eslint eqeqeq: 0 */
import React, { Component } from 'react'
import { ModalStyles } from 'components/Common/styles.js'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import 'components/Common/commonform.css'
import _ from 'lodash'
import PermissionList from 'components/diagnostics/permissions/PermissionList/PermissionList'

const MyButton = props => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
)
class GroupPermissionsAddEdit extends Component {
  constructor(props) {
    super(props)
    this.state = { permissionsToAdd: [], availablePermissions: [] }
    this.handleSelectPermissionToAdd = this.handleSelectPermissionToAdd.bind(this)
  }
  // Check change between avaialable permissions and the flag which comes as true in props when avaialable permisions changes.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.availablePermissions !== this.props.unAssignedPermissions && this.props.unAssignedPermissionsUpdated == true) {
      this.props.resetAvailableUsersUpdatedCheck()
      this.setState({
        availablePermissions: this.props.unAssignedPermissions
      })
    }
  }
  // adds the selected permission to the permissionsToAdd state and  change its selected to available permissions to true for background color in table.
  handleSelectPermissionToAdd(permission, index) {
    const { permissionsToAdd, availablePermissions } = this.state
    let permToAdd = [...permissionsToAdd]
    permToAdd.push(permission._id)
    let availablePerm = _.cloneDeep(availablePermissions)
    _.find(availablePerm, perm => {
      if (perm._id == permission._id) {
        perm.selected = true
      }
    })
    this.setState({
      permissionsToAdd: permToAdd,
      availablePermissions: availablePerm
    })
  }

  // after Confirm button the state of avaialable permissions to be set to empty. so next time the modal opens the default state is empty( modal compoent does not unmount on close or confirm.)
  handleResetAvaialablePermissions() {
    const { permissionsToAdd } = this.state
    let newPerms = [...permissionsToAdd]
     this.props.addNewPermissions(newPerms)
    this.setState({
      availablePermissions: [],
      permissionsToAdd: []
    })
  }

  handleAvailablePermissionReset() {
    let availablePermissions = _.cloneDeep(this.state.availablePermissions)

    availablePermissions.forEach(element => {
      element.selected = false
    })
    this.setState({
      availablePermissions: availablePermissions,
      permissionsToAdd: []
    })
  }

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className} size="lg">
        <ModalHeader style={ModalStyles.modalTitleStyle}>Available Permissions</ModalHeader>
        <ModalBody>
          <PermissionList
            tableData={this.state.availablePermissions}
            noEdit
            addPermission
            handleAddClick={this.handleSelectPermissionToAdd}
          />
        </ModalBody>
        <ModalFooter style={ModalStyles.footerButtonsContainer}>
          <MyButton
            type="button"
            onClick={e => {
              this.handleResetAvaialablePermissions()
            }}
          >
            Save
          </MyButton>
          <MyButton
            type="button"
            onClick={e => {
              this.handleAvailablePermissionReset()
              this.props.toggle()
            }}
          >
            Close
          </MyButton>
        </ModalFooter>
      </Modal>
    )
  }
}

export default GroupPermissionsAddEdit
