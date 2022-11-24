import React, { Component } from "react";
import { ButtonActionsTable } from "components/Common/Buttons";
import CommonFilters from "components/Common/Filters/CommonFilters";
import { ic_keyboard_arrow_down } from "react-icons-kit/md/ic_keyboard_arrow_down";
import { ic_keyboard_arrow_up } from "react-icons-kit/md/ic_keyboard_arrow_up";
import { languageService } from "../../../Language/language.service";
import { MODAL_TYPES } from "../../../utils/globals";
class AttributesTable extends Component {
  constructor(props) {
    super(props);

    this.state = { pageSize: 30, page: 0 };
    this.columns = [
      {
        Header: languageService("SR#"),
        id: "SR#",

        Cell: d => {
          return <div style={{ textAlign: "center" }}>{d.index + 1} </div>;
        },
        minWidth: 50,
      },
      {
        Header: languageService("title"),
        id: "title",

        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.title} </div>;
        },
        minWidth: 150,
      },
      {
        Header: languageService("Actions"),
        id: "actions",
        accessor: d => {
          return (
            <div>
              <ButtonActionsTable
                handleClick={() => {
                  this.props.handleAssetTypeAttributeAction(MODAL_TYPES.EDIT, d);
                }}
                margin="0px 10px 0px 0px"
                buttonText={"Edit"}
              />
              <ButtonActionsTable
                handleClick={() => {
                  this.props.handleAssetTypeAttributeAction(MODAL_TYPES.VIEW, d);
                }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("View")}
              />
            </div>
          );
        },
        minWidth: 50,
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
          //showCustomFilter
          //custom
          tableColumns={this.columns}
          tableData={this.props.data}
          pageSize={this.state.pageSize}
          pagination={true}
          handlePageSave={this.handlePageSave}
          page={this.state.page}
          onClickSelect={false}
          handleSelectedClick={this.props.handleSelectedClick}
        />
      </div>
    );
  }
}
export default AttributesTable;
