import React, { Component } from "react";
//import ThisTable from "components/Common/ThisTable/index";
//import moment from 'moment'
//import Gravatar from 'react-gravatar'
//import { getStatusColor } from 'utils/statusColors.js'
//import { Link, Route } from 'react-router-dom'
import { ButtonActionsTable } from "components/Common/Buttons";
import CommonFilters from "components/Common/Filters/CommonFilters";
import { languageService } from "Language/language.service";
class LanguageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      pageSize: 10,
      page: 0,
    };
    //this.handlePageSave = this.handlePageSave.bind(this)

    this.columns = [
      {
        Header: "Key",
        id: "key",
        minWidth: 50,
        accessor: (d) => {
          return d.key;
        },
      },
      {
        Header: "English",
        id: "en",
        minWidth: 80,
        accessor: (d) => {
          return d.en;
        },
      },
      {
        Header: "Español",
        id: "es",
        minWidth: 80,
        accessor: (d) => {
          return d.es;
        },
      },
        {
            Header: "Française",
            id: "fr",
            minWidth: 80,
            accessor: (d) => {
                return d.fr;
            },
        },
      {
        Header: "Actions",
        id: "actions",
        accessor: (d) => {
          return (
            <div style={{ paddingLeft: "15px" }}>
              <ButtonActionsTable
                handleClick={(e) => {
                  this.props.handleEditClick("Edit", d);
                }}
                margin="0px 10px 0px 0px"
                buttonText={"Edit"}
              />
              <ButtonActionsTable
                handleClick={(e) => {
                  this.props.handleDeleteClick(d);
                }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("Delete")}
              />
            </div>
          );
        },
        minWidth: 150,
      },

      // {
      // 	Header: "Edit",
      // 	Cell: ({ row }) => <div>AA</div>,
      // },
    ];
    this.handlePageSave = this.handlePageSave.bind(this);
  }

  handlePageSave(page, pageSize) {
    this.setState({
      page: page,
      pageSize: pageSize,
    });
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
  //   handlePageSave(page, pageSize) {
  //     this.setState({
  //       page: page,
  //       pageSize: pageSize
  //     })
  //   }

  render() {
    return (
      <div style={{ padding: "0px 15px 15px" }}>
        <div style={{ boxShadow: "3px 3px 5px #cfcfcf", textTransform: "capitalise" }}>
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
    );
  }
}

export default LanguageList;
