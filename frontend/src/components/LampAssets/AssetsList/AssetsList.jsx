import React, { Component } from "react";
import ReactTable from "react-table";
import PaginationComponent from "components/Common/ThisTable/PaginationComponent";
import { ButtonActionsTable } from "components/Common/Buttons";
import CommonFilters from "components/Common/Filters/CommonFilters";
import { ic_keyboard_arrow_down } from "react-icons-kit/md/ic_keyboard_arrow_down";
import { ic_keyboard_arrow_right } from "react-icons-kit/md/ic_keyboard_arrow_right";
import { ic_keyboard_arrow_up } from "react-icons-kit/md/ic_keyboard_arrow_up";
import { ic_arrow_upward } from "react-icons-kit/md/ic_arrow_upward";
import { ic_arrow_downward } from "react-icons-kit/md/ic_arrow_downward";
import { ruble } from "react-icons-kit/fa/ruble";
import SvgIcon from "react-icons-kit";
import { languageService } from "../../../Language/language.service";
import permissionCheck from "utils/permissionCheck.js";
import _ from "lodash";
function format2DigitNumber(num) {
  return num && !isNaN(parseFloat(num)) ? parseFloat(num).toFixed(2) : "0.00";
}
const SortedBar = (props) => {
  const { sorted } = props;
  let sortedColumn = sorted[0] && sorted[0].id;
  let sortOrder = sorted[0] && sorted[0].desc ? 1 : 0;
  let icon =
    props.column === sortedColumn ? (
      sortOrder === 0 ? (
        <SvgIcon size={20} icon={ic_arrow_upward} style={{ verticalAlign: "middle", height: "100%" }} />
      ) : (
        <SvgIcon size={20} icon={ic_arrow_downward} style={{ verticalAlign: "middle", height: "100%" }} />
      )
    ) : null;
  return icon;
};
const lineName = {
  Header: () => (
    <div>
      {languageService("Location Name")}
      <SortedBar column={"locationName"} sorted={this.props.sorted} />
    </div>
  ),
  id: "locationName",
  show: true,
  accessor: (d) => {
    //console.log(this.props.assetsData);
    return <div style={{ textAlign: "center" }}>{d.locationName} </div>;
  },
};
class AssetsList extends Component {
  constructor(props) {
    super(props);

    this.state = { pageSize: 30, page: 0 };
    this.columns = [
      {
        Header: () => (
          <div>
            {`${languageService("Asset Name")}`}
            <SortedBar column={"unitId"} sorted={this.props.sorted} />
          </div>
        ),
        id: "unitId",

        accessor: (d) => {
          let expand = null;

          let primaryTrack = null;

          if (d.attributes && d.attributes.primaryTrack)
            primaryTrack = (
              <SvgIcon size={15} icon={ruble} style={{ color: "rgb(58, 179, 74)", verticalAlign: "middle", height: "100%" }} />
            );

          //console.log("value", d.paddingLeft, !d.expanded, d.childAsset.length);
          //console.log("this.props.assetsData.locationName", this.props.assetsData);
          if (!d.expanded && this.props.assetGroupByParent[d._id]) {
            expand = (
              <div
                style={{
                  height: "100%",
                  display: "inline-block",
                  verticalAlign: "top",
                }}
                onClick={(e) => {
                  this.props.handleExpandClick(d);
                }}
              >
                <SvgIcon size={20} icon={ic_keyboard_arrow_right} style={{ marginLeft: "5px", verticalAlign: "middle", height: "100%" }} />
              </div>
            );
          } else {
            expand = (
              <div
                style={{
                  width: "2px",
                  height: "100%",
                }}
              />
            );
          }
          if (d.expanded) {
            expand = (
              <div
                style={{
                  height: "100%",
                  display: "inline-block",
                  verticalAlign: "top",
                }}
                onClick={(e) => {
                  this.props.handleContractClick(d);
                }}
              >
                <SvgIcon size={20} icon={ic_keyboard_arrow_down} style={{ verticalAlign: "middle", height: "100%" }} />
              </div>
            );
          }

          if (d.paddingLeft == 10) {
            expand = (
              <React.Fragment>
                <span
                  style={{
                    paddingLeft: d.paddingLeft ? d.paddingLeft - 20 : "0px",
                    height: "100%",
                    borderLeft: d.paddingLeft ? "2px solid #ccc" : "",
                    marginLeft: d.paddingLeft ? "8px" : "0px",
                    width: "2px",
                    display: "inline-block",
                  }}
                />
                {expand}
              </React.Fragment>
            );
          }
          if (d.paddingLeft > 10) {
            expand = (
              <React.Fragment>
                <span
                  style={{
                    paddingLeft: d.paddingLeft ? d.paddingLeft - 20 : "0px",
                    height: "100%",
                    borderLeft: d.paddingLeft ? "2px solid #ccc" : "",
                    marginLeft: d.paddingLeft ? "8px" : "0px",
                    width: "2px",
                    display: " inline-block",
                  }}
                />
                <span
                  style={{
                    paddingLeft: d.paddingLeft ? d.paddingLeft - 20 : "0px",
                    height: "100%",
                    borderLeft: d.paddingLeft ? "2px solid #ccc" : "",
                    marginLeft: d.paddingLeft ? "8px" : "0px",
                    display: "inline-block",
                    width: "2px",
                  }}
                />
                {expand}
              </React.Fragment>
            );
          }

          return (
            <div style={{ height: "100%" }}>
              <div style={{ display: "inline-block", paddingRight: "5px", height: "100%", verticalAlign: "middle" }}>{expand}</div>
              <div style={{ display: "inline-block", height: "100%", verticalAlign: "middle", lineHeight: "36px" }}>{d.unitId} </div>
              {primaryTrack}
            </div>
          );
        },
        minWidth: 150,
      },
      {
        Header: () => (
          <div>
            {languageService("Asset Type")}
            <SortedBar column={"unitId"} sorted={this.props.sorted} />
          </div>
        ),
        id: "assetType",

        accessor: (d) => {
          return <div style={{}}>{languageService(d.assetType)} </div>;
        },
        minWidth: 80,
      },
      // {
      //   Header: () => (
      //     <div>
      //       {languageService("Location Name")}
      //       <SortedBar column={"locationName"} sorted={this.props.sorted} />
      //     </div>
      //   ),
      //   id: "locationName",
      //   show: true,
      //   accessor: d => {
      //     //console.log(this.props.assetsData);
      //     return <div style={{ textAlign: "center" }}>{d.locationName} </div>;
      //   },
      //   minWidth: 100,
      // },
      {
        Header: languageService("Location"),
        id: "locationOfAsset",
        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{d.locationName} </div>;
        },
        minWidth: 100,
      },
      {
        Header: () => (
          <div>
            {languageService("Start (milepost)")}
            <SortedBar column={"start"} sorted={this.props.sorted} />
          </div>
        ),
        id: "start",

        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{d.attributes && d.attributes["Marker Start"] ? d.attributes["Marker Start"]: format2DigitNumber(d.start)} </div>;
          //return <div style={{ textAlign: "center" }}>{format2DigitNumber(d.start)} </div>;
        },
        minWidth: 100,
      },
      {
        Header: () => (
          <div>
            {languageService("End (milepost)")}
            <SortedBar column={"end"} sorted={this.props.sorted} />
          </div>
        ),
        id: "end",

        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{d.attributes && d.attributes["Marker End"] ? d.attributes["Marker End"]: format2DigitNumber(d.end)} </div>;
          //return <div style={{ textAlign: "center" }}>{ format2DigitNumber(d.end)} </div>;
        },
        minWidth: 100,
      },
      {
        Header: () => (
          <div>
            {languageService("Length (milepost)")}
            <SortedBar column={"length"} sorted={this.props.sorted} />
          </div>
        ),
        id: "length",

        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{format2DigitNumber(d.assetLength)} </div>;
        },
        minWidth: 100,
      },
      {
        Header: languageService("Actions"),
        id: "actions",
        accessor: (d) => {
          return (
            <div>
              {permissionCheck("ASSET", "create") && (
                <ButtonActionsTable
                  handleClick={() => {
                    this.props.addAssetHandler("Add", d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Add")}
                />
              )}
              {permissionCheck("ASSET", "update") && (
                <ButtonActionsTable
                  handleClick={() => {
                    this.props.editAsset("Edit", d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Edit")}
                />
              )}
              {permissionCheck("ASSET", "delete") && (
                <ButtonActionsTable
                  handleClick={() => {
                    this.props.deleteAsset(d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Delete")}
                />
              )}

              {/* <ButtonActionsTable
                handleClick={() => {
                  this.props.viewAssetDetail(d);
                }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("View")}
              /> */}
              {/*<ButtonActionsTable*/}
              {/*handleClick={() => {*/}
              {/*this.props.deleteAsset(d);*/}
              {/*}}*/}
              {/*margin="0px 10px 0px 0px"*/}
              {/*buttonText={languageService("Delete")}*/}
              {/*/>*/}
            </div>
          );
        },
        minWidth: 110,
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

  handlePageReset = () => {
    this.setState({
      page: 0,
    });
  };

  componentDidMount() {
    this.props.setPageResetHandler(this.handlePageReset);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType == "ASSETS_READ_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      this.setState({
        page: 0,
      });
    }

    // if (this.props.assetsData !== prevProps.assetsData) {
    //   let columns = this.columns;
    //   if (this.props.currentAssetFilter == "Default") {
    //     _.remove(columns, { id: "locationName" });
    //     //console.log("columns", columns);
    //   } else {
    //     //let columns = this.columns;
    //     columns.splice(1, 0, lineName);
    //     //this.columns = [...this.columns];
    //   }
    //   this.columns = [...columns];
    //   //console.log("columns", columns);
    // }
  }
  handlePageSize(pageSize) {
    // this.handleUpdateFilterState({
    //   pageSize,
    // });
  }
  render() {
    //console.log("this.props.currentAssetFilter", this.props.currentAssetFilter);
    // if (this.props.currentAssetFilter == "Default") {
    //   _.remove(this.columns, { id: "locationName" });
    // } else {
    //   this.columns.splice(1, 0, lineName);
    // }
    let columns = [...this.columns];
    return (
      <div>
        <CommonFilters
          tableInFilter
          noFilters
          //showCustomFilter
          //custom
          onColClick={this.props.onColClick}
          sortable={this.props.sortable}
          tableColumns={columns}
          tableData={this.props.assetsData}
          pageSize={this.state.pageSize}
          pagination={true}
          handlePageSave={this.handlePageSave}
          page={this.state.page}
          onClickSelect={true}
          handleSelectedClick={this.props.handleSelectedClick}
          onSortedChange={this.props.onSortedChange}
          fetchData={this.props.fetchData}
          manual={this.props.manual}
          defaultPageSize={this.props.pageSize}
          pages={this.props.pages}
          showPagination={this.props.pagination}
          showPaginationTop={this.props.showPaginationTop}
          showPaginationBottom={this.props.showPaginationBottom}
          pageSizeOptions={this.props.pageSizeOptions}
          handlePageSize={this.handlePageSize}
        />
      </div>
    );
  }
}
export default AssetsList;
