import React, { Component } from "react";
import classnames from "classnames";
import ReactTable from "react-table";
import PaginationComponent from "./PaginationComponent";
import "./custom.css";
import { Link, Route } from "react-router-dom";
import { languageService } from "../../../Language/language.service";
import PropTypes from "prop-types";
import { thisTableStyle } from "./style/index";
import { themeService } from "theme/service/activeTheme.service";
import Radium from "radium";
import { retroColors } from "../../../style/basic/basicColors";
class ThisTable extends Component {
  constructor(props) {
    super(props);
    let columnStyle = this.props.onColClick
      ? {
          getHeaderProps: (state, rowInfo, col, instance) => {
            return {
              onClick: () => {
                this.props.onColClick(state, rowInfo, col, instance);
              },
              style: {
                ...themeService(thisTableStyle.HeaderPropsStyle),
              },
            };
          },
        }
      : {
          getHeaderProps: () => {
            return {
              style: { ...themeService(thisTableStyle.HeaderPropsStyle) },
            };
          },
        };

    this.state = {
      columns: [],
      columnStyle: columnStyle,
      selected: null,
    };
  }

  componentDidMount() {
    this.updateColumns(this.props.tableColumns);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tableColumns !== this.props.tableColumns) {
      this.updateColumns(nextProps.tableColumns);
    }
  }

  updateColumns(newTableColms) {
    let columns = [];
    const { columnStyle } = this.state;

    let receivedColumns = newTableColms;
    receivedColumns.forEach(column => {
      let copyColumnStyle = { ...columnStyle };
      let columnKeys = Object.keys(column);
      columnKeys.forEach(key => {
        copyColumnStyle[key] = column[key];
      });
      columns.push(copyColumnStyle);
    });
    this.setState({
      columns: columns,
    });
  }

  render() {
    return (
      <div
        style={{
          ...themeService(thisTableStyle.outerStyle),
          overflowY: this.props.classNameCustom == "fillFullHeight" ? "none" : "auto",
        }}
        className={this.props.classNameCustom}
      >
        <ReactTable
          key={"reactTable"}
          defaultSorted={this.props.defaultSorted}
          previousText={languageService("previous")}
          nextText={languageService("next")}
          loadingText={languageService("Loading...")}
          noDataText={languageService("No rows found")}
          pageText={languageService("Page")}
          ofText={languageService("of")}
          rowsText={languageService("rows")}
          pageJumpText={languageService("jump to page")}
          rowsSelectorText={languageService("rows per page")}
          sortable={this.props.sortable}
          data={this.props.tableData}
          columns={this.state.columns}
          showPagination={this.props.pagination}
          pageSize={this.props.pageSize}
          manual={this.props.manual}
          defaultPageSize={this.props.pageSize || 15}
          pages={this.props.pages}
          showPaginationTop={this.props.showPaginationTop || false}
          showPaginationBottom={this.props.showPaginationBottom || true}
          pageSizeOptions={this.props.pageSizeOptions || [5, 10, 20, 25, 50, 100]}
          onPageChange={page => {
            if (this.props.handlePageChange) {
              this.props.handlePageChange(page);
            }
          }}
          page={this.props.page ? this.props.page : 0}
          minRows={this.props.minRows ? this.props.minRows : 1}
          style={{ ...themeService(thisTableStyle.tableStyle), height: this.props.height ? this.props.height : "inherit" }}
          getTbodyProps={(state, rowInfo, column, instance) => {
            return {
              className: "scrollbar",
            };
          }}
          getTrProps={(state, rowInfo, column, instance) => {
            let indexRow = null;
            let selected = "No Selected";
            if (rowInfo) {
              indexRow = rowInfo.index;
              if (rowInfo.original.selected == true) {
                selected = rowInfo.index;
              }
            }
            return {
              onClick: e => {
                //console.log(this.state.selected);
                let val = indexRow;
                this.state.selected == indexRow && (val = null);
                this.setState({
                  selected: val,
                });

                if (this.props.onClickSelect) {
                  this.props.handleSelectedClick && this.props.handleSelectedClick(e, rowInfo);
                }
              },

              style: themeService(thisTableStyle.rowStyle(indexRow, this.state, this.props, rowInfo)),
            };
          }}
          getTrGroupProps={(state, rowInfo, column, instance) => {
            return {
              style: {
                borderBottom: "1px solid rgb(227, 233, 239)",
              },
            };
          }}
          getTableProps={(state, rowInfo, column, instance) => {
            return {
              className: "scrollbarHor",
            };
          }}
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              style: themeService(thisTableStyle.cellStyle),
            };
          }}
          showPageJump={false}
          PaginationComponent={PaginationComponent}
          defaultSorted={this.props.defaultSorted}
          onSortedChange={this.props.onSortedChange}
          onFetchData={this.props.fetchData}
        />
        {this.props.forDashboard && (
          <Link
            to={this.props.fromDashboardToLink ? this.props.fromDashboardToLink : "#"}
            style={themeService(thisTableStyle.detailBtnStyle)}
          >
            {languageService("View Detail")}
          </Link>
        )}
      </div>
    );
  }
}

export default Radium(ThisTable);

ThisTable.defaultProps = {
  sortable: true,
};
