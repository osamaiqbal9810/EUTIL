import React, { Component } from "react";
import CommonFilters from "components/Common/Filters/CommonFilters";
import { languageService } from "../../../../Language/language.service";
import { ButtonActionsTable } from "../../../Common/Buttons";
import { Link } from "react-router-dom";
class RunRangeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 30,
      page: 0,
    };
    this.columns = [
      {
        Header: "#",
        id: "row",
        maxWidth: 50,
        filterable: false,
        Cell: row => {
          return <div style={{ textAlign: "center" }}>{row.index + 1}</div>;
        },
      },
      {
        Header: languageService("ID"),
        accessor: "runId",
        minWidth: 100,
      },
      {
        Header: languageService("Description"),
        accessor: "runDescription",
        minWidth: 200,
      },
      {
        Header: languageService("MP Start"),
        accessor: "mpStart",
        minWidth: 50,
      },
      {
        Header: languageService("MP End"),
        accessor: "mpEnd",
        minWidth: 50,
      },

      {
        Header: languageService("Line"),
        accessor: "lineName",
        minWidth: 100,
      },

      {
        Header: languageService("Actions"),
        id: "actions",
        accessor: d => {
          return (
            <div>
              <ButtonActionsTable
                handleClick={() => this.props.handleAddEditNewClick("Edit", d)}
                margin="0px 10px 0px 0px"
                buttonText={languageService("Edit")}
              />
            </div>
          );
        },
        minWidth: 100,
      },
    ];
    this.handlePageSave = this.handlePageSave.bind(this);
  }

  handlePageSave(page, pageSize) {
    this.setState({
      page: page,
      pageSize: pageSize,
    });
  }

  render() {
    return (
      <div style={{ padding: "15px" }}>
        <CommonFilters
          tableInFilter
          noFilters
          tableColumns={this.columns}
          tableData={this.props.runRange}
          pageSize={this.state.pageSize}
          pagination={true}
          handlePageSave={this.handlePageSave}
          page={this.state.page}
        />
      </div>
    );
  }
}

export default RunRangeList;
