import React, { Component } from "react";
import { ButtonActionsTable } from "../Common/Buttons";
import { languageService } from "../../Language/language.service";
import ThisTable from "components/Common/ThisTable/index";
class GeneralInfoList extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 0 };
    this.columns = [
      // {
      //   Header: languageService("Name"),
      //   id: "title",
      //   accessor: "title",
      // },
      // {
      //   Header: languageService("Description"),
      //   id: "title",
      //   accessor: "title",
      // },
      {
        Header: languageService("File Name"),
        id: "fileName",
        accessor: "fileName",
      },
      {
        Header: languageService("Doc Type"),
        id: "type",
        accessor: "type",
      },
      {
        Header: languageService("Size KB"),
        id: "size",
        accessor: "size",
      },
      {
        Header: languageService("Actions"),
        id: "Action",
        accessor: (d) => {
          return (
            <div>
              <ButtonActionsTable
                handleClick={(e) => {
                  this.props.handleFileClick(d, "download");
                }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("Download")}
              />
              <ButtonActionsTable
                handleClick={(e) => {
                  this.props.handleFileClick(d, "delete");
                }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("Delete")}
              />
            </div>
          );
        },
      },
    ];
  }
  render() {
    return (
      <div style={{ margin: "0 30px", display: "block", width: "100%" }}>
        <ThisTable
          tableColumns={this.columns}
          tableData={this.props.tableFilesData}
          pageSize={25}
          minRows={15}
          pagination={true}
          // handlePageChange={(page) => this.handlePageSave(page)}
          // page={this.state.page}
          height={"auto"}
        />
      </div>
    );
  }
}

export default GeneralInfoList;
