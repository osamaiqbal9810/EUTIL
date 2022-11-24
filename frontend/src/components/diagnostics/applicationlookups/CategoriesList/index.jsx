/* eslint eqeqeq: 0 */
import React, { Component } from 'react'
import { ButtonActionsTable } from 'components/Common/Buttons'
import CommonFilters from 'components/Common/Filters/CommonFilters'
class CategoriesList extends Component {
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
        Header: 'Description',
        accessor: 'description',
        minWidth: 150
      },
      {
        Header: 'List Name',
        id: 'listName',
        accessor: d => {
          return d.listName
        },
        minWidth: 100
      },
      {
        Header: 'Code',
        id: 'code',
        minWidth: 50,
        accessor: d => {
          return d.code
        }
      },
      {
        Header: 'Option 1',
        id: 'opt1',
        minWidth: 100,
        accessor: d => {
          return d.opt1
        }
      },
      {
        Header: 'Option 2',
        id: 'opt2',
        minWidth: 200,
        accessor: d => {
          return d.opt2
        }
      },
      {
        Header: 'Actions',
        id: 'actions',
        accessor: d => {
          return (
            <div style={{ paddingLeft: '15px' }}>
              <ButtonActionsTable
                handleClick={e => {
                  this.props.handleEditClick('Edit', d)
                }}
                margin="0px 10px 0px 0px"
                buttonText={'Edit'}
              />
              <ButtonActionsTable
                handleClick={e => {
                  this.props.handleDeleteClick(d)
                }}
                margin="0px 10px 0px 0px"
                buttonText={'Delete'}
              />
            </div>
          )
        },
        minWidth: 150
      }

      // {
      // 	Header: "Edit",
      // 	Cell: ({ row }) => <div>AA</div>,
      // },
    ]
  }

  // handleUserClick(email) {
  // 	<Link
  // 		style={styles.linkRow}
  // 		to={`${this.props.path}/` + this.props.option}
  // 		onMouseDown={e => {
  // 			this.props.linkSelected(this.props.index);
  // 		}}
  // 	>
  // 		<div style={styles.linkText}>{this.props.option} </div>
  // 	</Link>;
  // }
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

export default CategoriesList
