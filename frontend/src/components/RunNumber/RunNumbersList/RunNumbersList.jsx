import React, { Component } from "react";
import CommonFilters from "components/Common/Filters/CommonFilters";
import { ButtonActionsTable } from "components/Common/Buttons";
import { Link, Route } from "react-router-dom";
import { languageService } from "../../../Language/language.service";
import { MODAL_TYPES } from "../../../utils/globals";
import permissionCheck from "utils/permissionCheck.js";

class RunNumbersList extends Component {
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
        Cell: (row) => {
          return <div style={{ textAlign: "center" }}>{row.index + 1}</div>;
        },
      },
      {
        Header: languageService("Run ID"),
        accessor: "runId",
        minWidth: 100,
      },
      {
        Header: languageService("Run Name"),
        accessor: "runName",
        minWidth: 150,
      },
      {
        Header: languageService("Actions"),
        id: "actions",
        accessor: (d) => {
          return (
            <div>
              {permissionCheck("RUN", "view") && (
                <Link to={`${this.props.path}s/` + d._id} className="linkStyleTable">
                  <ButtonActionsTable handleClick={(e) => {}} margin="0px 10px 0px 0px" buttonText={languageService("View")} />
                </Link>
              )}
              {/*<ButtonActionsTable*/}
              {/*handleClick={() => this.props.handleAddRunClick('Edit', d)} margin="0px 10px 0px 0px"*/}
              {/*buttonText={languageService("Edit")}*/}
              {/*/>*/}

              {permissionCheck("RUN", "delete") && (
                <ButtonActionsTable
                  handleClick={() => this.props.handleRunNumberModals(MODAL_TYPES.DELETE, d)}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Delete")}
                />
              )}
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
      <div>
        <CommonFilters
          tableInFilter
          noFilters
          tableColumns={this.columns}
          tableData={this.props.runs}
          pageSize={this.state.pageSize}
          pagination={true}
          handlePageSave={this.handlePageSave}
          page={this.state.page}

          // onClickSelect={true}
          // handleSelectedClick={this.props.handleSelectedClick}
        />
      </div>
    );
  }
}

export default RunNumbersList;
