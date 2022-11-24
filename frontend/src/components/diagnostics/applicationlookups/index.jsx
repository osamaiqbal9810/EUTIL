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
import { Control, LocalForm, Errors, actions } from 'react-redux-form'
import { CRUDFunction } from 'reduxCURD/container'
import CategoriesList from './CategoriesList/index'
import CategoryAddEdit from './CategoryAddEdit/CategoryAddEdit'
import { commonPageStyle } from 'components/Common/Summary/styles/CommonPageStyle'
import './CategoryAddEdit/commonform.css'
import _ from 'lodash'
import { withPlus } from 'react-icons-kit/entypo/withPlus'
// import SvgIcon from 'react-icons-kit'
import { ButtonCirclePlus } from 'components/Common/Buttons'

// const Label = props => <label> {props.children}</label>
const Field = props => <div className="field">{props.children}</div>

// const Required = () => <span className="required-fld">*</span>

class Applicationlookups extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: {},
      categories: [],
      selectedCategoryDetails: [],
      selectedCategory: '',
      categoryOptions: [],
      selectedCategoryField: {},
      modalState: 'None',
      addModal: false,
      actionType: '',
      dropdownOpen: false
    }

    this.toggleDropDown = this.toggleDropDown.bind(this)

    this.handleAddEditModalClick = this.handleAddEditModalClick.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.getApplicationlookups()
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.applicationlookupss &&
      nextProps.applicationlookupss !== prevState.categories &&
      nextProps.actionType !== prevState.actionType &&
      nextProps.actionType == 'APPLICATIONLOOKUPSS_READ_SUCCESS'
    ) {
      return {
        categories: nextProps.applicationlookupss,
        actionType: nextProps.actionType
      }
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == 'APPLICATIONLOOKUPS_UPDATE_SUCCESS') {
      return {
        actionType: nextProps.actionType
      }
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == 'APPLICATIONLOOKUPS_CREATE_SUCCESS') {
      return {
        actionType: nextProps.actionType
      }
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == 'APPLICATIONLOOKUPS_DELETE_SUCCESS') {
      return {
        actionType: nextProps.actionType
      }
    } else if (nextProps.actionType !== prevState.actionType && nextProps.actionType == 'APPLICATIONLOOKUPS_DELETE_FAILURE') {
      return {
        actionType: nextProps.actionType
      }
    } else {
      return null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.categories &&
      prevProps.actionType !== this.state.actionType &&
      this.state.actionType == 'APPLICATIONLOOKUPSS_READ_SUCCESS'
    ) {
      let categoryListUnique = this.state.categoryOptions
      let selectedCategoryData = []
      let selectedCategory = this.state.selectedCategory
      this.state.categories.forEach(categoryObj => {
        let findExistingList = _.find(categoryListUnique, { value: categoryObj.listName })
        if (!findExistingList) {
          let obj = { value: categoryObj.listName }
          categoryListUnique.push(obj)
          if (categoryListUnique[0].value == categoryObj.listName) {
            selectedCategoryData.push(categoryObj)
          }
        } else {
          if (selectedCategory == '') {
            if (categoryListUnique[0].value == categoryObj.listName) {
              selectedCategoryData.push(categoryObj)
            }
          } else {
            if (selectedCategory == categoryObj.listName) {
              selectedCategoryData.push(categoryObj)
            }
          }
        }
      })
      if (selectedCategory == '' || selectedCategory == '') {
        if (categoryListUnique.length > 0) {
          selectedCategory = categoryListUnique[0].value
        }
      }
      this.setState({
        selectedCategoryDetails: selectedCategoryData,
        selectedCategory: selectedCategory,
        categoryOptions: categoryListUnique
      })
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == 'APPLICATIONLOOKUPS_UPDATE_SUCCESS') {
      this.props.getApplicationlookups()
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == 'APPLICATIONLOOKUPS_CREATE_SUCCESS') {
      this.props.getApplicationlookups()
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == 'APPLICATIONLOOKUPS_DELETE_SUCCESS') {
      this.props.getApplicationlookups()
    }
  }

  handleAddEditModalClick(modalState, field) {
    //console.log(modalState)
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedCategoryField: field
    })
  }

  handleAdd(field, newListName) {
    let copyField = { ...field }
    if (!newListName) {
      copyField.listName = this.state.selectedCategory
    }
    this.props.createApplicationlookups(copyField)
  }

  handleEdit(field) {
    let copyField = { ...field }
    copyField._id = this.state.selectedCategoryField._id
    this.props.updateApplicationlookups(copyField)
  }

  handleDeleteClick(field) {
    this.props.deleteApplicationlookups(field)
  }

  handleChange(category) {
    //console.log(category)
    let selectedCategoryData = []
    this.state.categories.forEach(categoryObj => {
      if (category == categoryObj.listName) {
        selectedCategoryData.push(categoryObj)
      }
    })
    this.setState({
      selectedCategory: category,
      selectedCategoryDetails: selectedCategoryData
    })
  }

  render() {
    let categoriesOptions = []
    if (this.state.categoryOptions) {
      categoriesOptions = this.state.categoryOptions.map((category, index) => {
        return (
          <option value={category.value} key={category.value}>
            {' '}
            {category.value}{' '}
          </option>
        )
      })
    }
    return (
      <Col md="12">
        <CategoryAddEdit
          modal={this.state.addModal}
          modalState={this.state.modalState}
          toggle={this.handleAddEditModalClick}
          handleAddSubmit={this.handleAdd}
          handleEditSubmit={this.handleEdit}
          selectedCategoryField={this.state.selectedCategoryField}
          categoryList={this.state.selectedCategoryDetails}
        />
        <Row style={{ borderBottom: '2px solid #d1d1d1', margin: '0px 15px', padding: '10px 0px' }}>
          <Col md="6" style={{ paddingLeft: '0px' }}>
            <div
              style={{
                float: 'left',
                fontFamily: 'Myriad Pro',
                fontSize: '24px',
                letterSpacing: '0.5px',
                color: ' rgba(64, 118, 179)'
              }}
            >
              Categories
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div style={commonPageStyle.commonSummaryHeadingContainer}>
              <h4 style={commonPageStyle.commonSummaryHeadingStyle}>Select Category</h4>
            </div>
          </Col>
        </Row>

        <Col md="12">
          <Row style={{ height: '80px', margin: '0px' }}>
            <div style={{ marginRight: '30px' }}>
              <LocalForm
                className="commonform"
                model="selectedCategory"
                style={{ width: '250px' }}
                validators={this.trackValidator}
                onChange={values => this.handleChange(values)}
                initialState={this.state.selectedCategory}
              >
                <Field>
                  <Control.select model="selectedCategory" placeholder="Categories">
                    {categoriesOptions}
                  </Control.select>
                </Field>
              </LocalForm>
            </div>

            <div>
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
            </div>
          </Row>
        </Col>

        <Row>
          <Col md="12">
            <div style={commonPageStyle.commonSummaryHeadingContainer}>
              <h4 style={commonPageStyle.commonSummaryHeadingStyle}>Categories Detail</h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <CategoriesList
              tableData={this.state.selectedCategoryDetails}
              handleEditClick={this.handleAddEditModalClick}
              handleDeleteClick={this.handleDeleteClick}
              handleViewClick={this.handleViewClick}
            />
          </Col>
        </Row>
      </Col>
    )
  }
}

// let actionOptions = {
//   create: true,
//   update: true,
//   read: true,
//   delete: true,
//   others: {}
// }

const ApplicationlookupsContainer = CRUDFunction(Applicationlookups, 'applicationlookups')

export default ApplicationlookupsContainer
