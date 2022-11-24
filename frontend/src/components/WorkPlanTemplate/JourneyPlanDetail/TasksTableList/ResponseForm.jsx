/* eslint eqeqeq: 0 */
import React, { Component } from 'react'
import { CRUDFunction } from 'reduxCURD/container'
import { getAppMockupsTypes } from 'reduxRelated/actions/diagnosticsActions'
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap'
import { ModalStyles } from 'components/Common/styles.js'
import _ from 'lodash'
import Switch from 'react-switch'

const MyButton = props => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
)

const MyButtonDisabled = props => (
  <button className="disabledButton" disabled {...props}>
    {props.children}
  </button>
)
class ResponseForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentAssetTypeForm: {},
      currentAssetTypeName: '',
      unitOfTask: 0,
      prevButton: true,
      nextButton: true
    }
    this.handlePrev = this.handlePrev.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleFindUnit= this.handleFindUnit.bind(this)
  }

  componentDidMount() {
    if (this.props.assetTypes.length > 0) {
      this.handleFindUnit(0)
    } else {
      this.props.getAppMockupsTypes('assetType')
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.task.taskId !== prevProps.task.taskId) {
      if (this.props.assetTypes.length > 0) {
        this.handleFindUnit(0)
      }
    }
    if (
      this.props.diagnosticsActionType == 'ASSETTYPE_LIST_GET_SUCCESS' &&
      this.props.diagnosticsActionType !== prevProps.diagnosticsActionType
    ) {
      if (this.props.taskId) {
        this.handleFindUnit(0)
      }
    }
  }

  handlePrev() {
    let currentUnit = this.state.unitOfTask
    if (currentUnit > 0) {
      this.handleFindUnit(currentUnit - 1)
    }
  }

  handleNext() {
    let currentUnit = this.state.unitOfTask
    if (currentUnit < this.props.task.units.length - 1) {
      this.handleFindUnit(currentUnit + 1)
    }
  }

  handleFindUnit(unitIndex) {
    if (this.props.task.units) {
      let result = _.find(this.props.assetTypes, { description: this.props.task.units[unitIndex].assetType })
      if (result) {
        if (result.opt1) {
          let form_sel = this.props.task.units[unitIndex]['form-sel']
          let opt1_Orig = JSON.parse(result.opt1)
          let opt1 = _.cloneDeep(opt1_Orig)
          if (form_sel) {
            let formKeys = Object.keys(form_sel)
            opt1.fields.forEach(field => {
              field.data.forEach(row => {
                let elements = row.elements
                formKeys.forEach(key => {
                  let formKeyString = form_sel[key].toString().toLowerCase()
                  if (elements[2].tag == key && (formKeyString == 'true' || formKeyString == 'false')) {
                    elements[0].value = true
                    elements[2].value = form_sel[key]
                  }
                })
              })
            })
          }
          this.setState({
            currentAssetTypeForm: opt1,
            currentAssetTypeName: result.description + ' - ' + this.props.task.units[unitIndex].unitId,
            unitOfTask: unitIndex
          })
        }
        if (this.props.task.units.length == 1) {
          this.setState({
            nextButton: false,
            prevButton: false
          })
        } else if (unitIndex == 0) {
          this.setState({
            nextButton: true,
            prevButton: false
          })
        } else if (unitIndex == this.props.task.units.length - 1) {
          this.setState({
            nextButton: false,
            prevButton: true
          })
        } else {
          this.setState({
            nextButton: true,
            prevButton: true
          })
        }
      } else {
        this.setState({
          prevButton: false,
          nextButton: false
        })
      }
    }
  }

  render() {
    let forms = null

    // if (this.props.assetTypes.length > 0) {
    //   let opt1 = this.props.assetTypes[1].opt1
    //   let json = JSON.parse(opt1)
    //   console.log(json)
    // }
    if (this.state.currentAssetTypeForm.fields) {
      forms = this.state.currentAssetTypeForm.fields.map((field, index) => {
        return <ResponseFormFieldArea key={index} field={field} />
      })
    }
    let prevButton = this.state.prevButton ? (
      <MyButton onClick={this.handlePrev}>Previous </MyButton>
    ) : (
      <MyButtonDisabled onClick={e => {}}>Previous </MyButtonDisabled>
    )
    let nextButton = this.state.nextButton ? (
      <MyButton onClick={this.handleNext}>Next </MyButton>
    ) : (
      <MyButtonDisabled onClick={e => {}}>Next </MyButtonDisabled>
    )

    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
        <ModalHeader style={ModalStyles.modalTitleStyle}>{this.state.currentAssetTypeName}</ModalHeader>
        <ModalBody> {forms}</ModalBody>
        <ModalFooter style={ModalStyles.footerButtonsContainer}>
          {prevButton}
          <MyButton onClick={this.props.handleClose}>Close </MyButton>
          {nextButton}
        </ModalFooter>
      </Modal>
    )
  }
}

let variables = {
  diagnosticsReducer: {
    assetTypes: []
  }
}

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getAppMockupsTypes }
}
let ResponseFormContainer = CRUDFunction(ResponseForm, 'ResponseForm', actionOptions, variables, ['diagnosticsReducer'])
export default ResponseFormContainer

class ResponseFormFieldArea extends Component {
  render() {
    let row = null
    if (this.props.field.data) {
      row = this.props.field.data.map((row, index) => {
        return <FieldRowData key={row.id} data={row} />
      })
    }
    return (
      <div style={{ fontSize: '12px', color: 'rgba(64, 118, 179)' }}>
        <div style={{ fontWeight: '700', fontSize: '14px', paddingLeft: '5px' }}> {this.props.field.title}</div>
        {row}
      </div>
    )
  }
}

class FieldRowData extends Component {
  render() {
    return (
      <Row
        style={{
          border: '1px solid ##e7e7e7',
          boxShadow: ' rgba(0, 0, 0, 0.15) 1px 1px 5px',
          borderRadius: '4px',
          padding: '5px',
          margin: '10px 5px'
        }}
      >
        <Col md={1}>
          <SingleView element={this.props.data.elements[0]} />
        </Col>
        <Col md={9} style={{ margin: 'auto' }}>
          <SingleView element={this.props.data.elements[1]} />
        </Col>
        <Col md={2}>
          <SingleView element={this.props.data.elements[2]} />
        </Col>
      </Row>
    )
  }
}

class SingleView extends Component {
  render() {
    return (
      <div>
        {this.props.element.type == 'BOOLEAN_CHECKBOX' && (
          <div style={{ marginLeft: '15px' }}>
            <Input
              type="checkbox"
              disabled
              checked={this.props.element.value ? this.props.element.value : this.props.element.defaultValue}
            />
          </div>
        )}
        {this.props.element.type == 'STRING' && <div> {this.props.element.description} </div>}
        {this.props.element.type == 'BOOLEAN_SWITCH' && (
          <SwitchButton checked={this.props.element.value ? this.props.element.value : this.props.element.defaultValue} />
        )}
      </div>
    )
  }
}

class SwitchButton extends Component {
  render() {
    return (
      <div>
        <Switch
          checked={this.props.checked}
          onColor="#63b3b3"
          onChange={e => {}}
          onHandleColor="rgba(64, 118, 179)"
          handleDiameter={22}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={15}
          width={32}
          disabled
          className="react-switch"
          id="material-switch"
        />
      </div>
    )
  }
}
