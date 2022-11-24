import React, { Component } from "react";
import ReactTable from "react-table";
import PaginationComponent from "components/Common/ThisTable/PaginationComponent";
import { ButtonActionsTable } from "components/Common/Buttons";
import CommonFilters from "components/Common/Filters/CommonFilters";
import { ic_keyboard_arrow_down } from "react-icons-kit/md/ic_keyboard_arrow_down";
import { ic_keyboard_arrow_up } from "react-icons-kit/md/ic_keyboard_arrow_up";
import SvgIcon from "react-icons-kit";
import { languageService } from "../../../Language/language.service";
import { MODAL_TYPES } from "../../../utils/globals";
class LineListIndex extends Component {
  constructor(props) {
    super(props);

    this.state = { pageSize: 30, page: 0 };
    this.columns = [
      {
        Header: languageService("AssetType"),
        id: "assetType",

        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.assetType} </div>;
        },
        minWidth: 150,
      },
      {
        Header: languageService("AssetTypeClassify"),
        id: "assetTypeClassify",

        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.assetTypeClassify} </div>;
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
                handleClick={e => {
                  this.props.handleAssetTypeModals(MODAL_TYPES.EDIT, d);
                }}
                margin="0px 10px 0px 0px"
                buttonText={"Edit"}
              />
              <ButtonActionsTable
                handleClick={e => {
                  this.props.handleAssetTypeModals(MODAL_TYPES.VIEW, d);
                }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("View")}
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
      <div>
        <CommonFilters
          tableInFilter
          noFilters
          //showCustomFilter
          //custom
          tableColumns={this.columns}
          tableData={this.props.assetsData}
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
export default LineListIndex;
