import React, { Component } from "react";
import ReactTable from "react-table";
import PaginationComponent from "components/Common/ThisTable/PaginationComponent";
import { ButtonActionsTable } from "components/Common/Buttons";
//import CommonFilters from "components/Common/Filters/CommonFilters";
import GisFilters from "components/Common/Filters/GisFilters";
import { ic_keyboard_arrow_down } from "react-icons-kit/md/ic_keyboard_arrow_down";
import { ic_keyboard_arrow_right } from "react-icons-kit/md/ic_keyboard_arrow_right";
import SvgIcon from "react-icons-kit";
import { languageService } from "../../../Language/language.service";
import { LocPrefixService } from "../../LocationPrefixEditor/LocationPrefixService";
class AssetsList extends Component {
  constructor(props) {
    super(props);

    this.state = { pageSize: 30, page: 0 };
    this.columns = [
      {
        Header: languageService("Assets"),
        id: "name",

        accessor: (d) => {
          let expand = null;

          //console.log("value", d.paddingLeft, !d.expanded, d.childAsset.length);

          if ((!d.expanded && d.childAsset.length > 0) || !d.lineId) {
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
                <SvgIcon size={20} icon={ic_keyboard_arrow_right} style={{ verticalAlign: "middle", height: "100%" }} />
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
              <div style={{ display: "inline-block", height: "100%", verticalAlign: "middle", lineHeight: "36px" }}>
                {languageService(d.assetType)}
              </div>
            </div>
          );
        },
        minWidth: 150,
      },
      {
        Header: languageService("Asset Name"),
        id: "assetId",

        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{d.unitId} </div>;
        },
        minWidth: 150,
      },

      {
        Header: languageService("Start (milepost)"),
        id: "start",

        accessor: (d) => {
          let prefix = !d.attributes["Marker Start"] && LocPrefixService.getPrefixMp(d.start, d.lineId);
          return (
            <div style={{ textAlign: "center" }}>
              {prefix} {d.attributes && d.attributes["Marker Start"] ? d.attributes["Marker Start"] : d.start}
            </div>
          );
        },
        minWidth: 100,
      },
      {
        Header: languageService("End (milepost)"),
        id: "end",

        accessor: (d) => {
          let prefix = !d.attributes["Marker End"] && LocPrefixService.getPrefixMp(d.end, d.lineId);
          return (
            <div style={{ textAlign: "center" }}>
              {prefix} {d.attributes && d.attributes["Marker End"] ? d.attributes["Marker End"] : d.end}
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
      <div className=" scrollbar" style={{ overflowY: "scroll", maxHeight: "75vh", overflowX: "hidden" }}>
        <GisFilters
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
          onClickSelect={true}
          handleSelectedClick={this.props.handleSelectedClick}
        />
      </div>
    );
  }
}
export default AssetsList;
