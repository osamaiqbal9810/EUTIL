import React, { Component } from 'react'
import ThisTable from 'components/Common/ThisTable/index'
import moment from 'moment'
import Gravatar from 'react-gravatar'
import { getStatusColor } from 'utils/statusColors.js'
import { Link, Route } from 'react-router-dom'
import { ButtonActionsTable } from 'components/Common/Buttons'
import CommonFilters from 'components/Common/Filters/CommonFilters'
import SvgIcon from 'react-icons-kit'
import { check } from 'react-icons-kit/metrize/check'
class PermissionList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: null,
      pageSize: 10,
      page: 0
    }
    this.handlePageSave = this.handlePageSave.bind(this)
    this.columns = [
      {
        Header: 'Name',
        id: 'name',
        accessor: 'name',
        minWidth: 100
      },
      {
        Header: 'Resource',
        accessor: 'resource',
        minWidth: 150
      },
      {
        Header: 'Action',
        accessor: 'action',
        minWidth: 150
      },
      {
        Header: 'Active',
        id: 'active',
        accessor: d => {
          return <div style={{ color: 'inherit' }}>{d.active && <SvgIcon size={20} icon={check} />}</div>
        },
        minWidth: 50
      },

      {
        Header: 'Actions',
        id: 'actions',
        accessor: d => {
          return (
            <div style={{ paddingLeft: '15px' }}>
              {!this.props.noEdit && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleEditClick('Edit', d)
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={'Edit'}
                />
              )}
              {this.props.removePermission && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleDeleteClick(d)
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={this.props.removeButtonText}
                />
              )}
              {this.props.addPermission && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleAddClick(d)
                  }}
                  noEffect
                  margin="0px 10px 0px 0px"
                  buttonText={'Add'}
                />
              )}
            </div>
          )
        },
        minWidth: 150
      }
    ]
  }

  handlePageSave(page, pageSize) {
    this.setState({
      page: page,
      pageSize: pageSize
    })
  }

  render() {
    return (
      <div style={{ padding: '0px 15px 15px' }}>
        <div style={{ boxShadow: '3px 3px 5px #cfcfcf' }}>
          <CommonFilters
            tableInFilter
            noFilters
            tableColumns={this.columns}
            tableData={this.props.tableData}
            pageSize={this.state.pageSize}
            pagination={true}
            handlePageSave={this.handlePageSave}
            page={this.state.page}
          />
        </div>
      </div>
    )
  }
}

export default PermissionList
