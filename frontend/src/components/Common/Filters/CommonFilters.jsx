import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Radium from "radium";
import propTypes from "prop-types";
import ThisTable from "components/Common/ThisTable/index";
//import CommonTypeFilter from './CommonTypeFilter'
import { themeService } from "../../../theme/service/activeTheme.service";
import { commonFilterStyles } from "./styles/CommonFilterStyle";
import { basicColors, retroColors } from "../../../style/basic/basicColors";
class CommonFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allFilter: false,
      todayFilter: true,
      trackIdFilter: false,
      categoryFilter: true,
      dropdownOpen: false,
      pageSize: this.props.pageSize,
    };

    this.handleFilterTodayAllClick = this.handleFilterTodayAllClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

    this.pageOptions = [5, 10, 15, 20, 25, 30, 40, 50];
  }

  componentDidMount() {
    if (this.props.filterTodayOrAll) {
      this.handleFilterTodayAllClick(this.props.filterTodayOrAll);
    }
  }

  handleFilterTodayAllClick(filterName) {
    if (filterName == "today") {
      this.setState({
        todayFilter: true,
        allFilter: false,
      });
    } else if (filterName == "all") {
      this.setState({
        todayFilter: false,
        allFilter: true,
      });
    }
    this.props.checkTodayAllFilter(filterName);
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  handlePageSizeChange(pageSize) {
    if (this.props.handlePageSave) {
      this.props.handlePageSave(0, pageSize);
    }
    if (this.props.handlePageSize) {
      this.props.handlePageSize(pageSize);
    }
    this.setState({
      pageSize: pageSize,
    });
  }

  render() {
    const styles = getStyles(this.props, this.state);
    let firstFilterName = "Today";
    if (this.props.firstFilterName) {
      firstFilterName = this.props.firstFilterName;
    }
    let pageOptions = null;
    pageOptions = this.pageOptions.map(option => {
      return (
        <DropdownItem
          onClick={e => {
            this.handlePageSizeChange(option);
          }}
          key={option}
          style={themeService(commonFilterStyles.pageSizeStyle)}
        >
          {option}
        </DropdownItem>
      );
    });
    let colPageSize,
      colFilter,
      colEditView = null;
    colPageSize = 1;
    colFilter = this.props.editorView ? this.props.colFilterSize : 10;
    colEditView = this.props.noFilters ? 11 : 11 - this.props.colFilterSize;

    return (
      <div style={{ width: "100%" }}>
        <Row>
          <Col md={colPageSize} style={styles.filterArea}>
            <div style={styles.pageSizeSelectorContainer} key="pageSize">
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} size="sm">
                <DropdownToggle style={themeService(commonFilterStyles.pageSizeTogglerStyle)} caret>
                  {this.state.pageSize}
                </DropdownToggle>
                <DropdownMenu style={{ minWidth: "auto", fontSize: "12px", padding: "0px" }}>{pageOptions}</DropdownMenu>
              </Dropdown>
            </div>
          </Col>
          <Col md={colFilter} style={{ padding: "5px 0px 0px 0px" }}>
            {!this.props.noFilters && (
              <div style={{ display: "inline-block" }}>
                <div
                  style={styles.allTodayCommonStyleToday}
                  key="today"
                  onClick={e => {
                    this.handleFilterTodayAllClick("today");
                  }}
                >
                  {firstFilterName}
                </div>
                <div style={themeService(styles.divider)} key="divider1">
                  |
                </div>
                <div
                  style={styles.allTodayCommonStyleAll}
                  key="all "
                  onClick={e => {
                    this.handleFilterTodayAllClick("all");
                  }}
                >
                  All
                </div>
              </div>
            )}
            {this.props.showCustomFilter && <div style={{ display: "inline-block" }}>{this.props.customFilterComp}</div>}
          </Col>
          {this.props.editorView && (
            <Col md={colEditView}>
              <div>{this.props.editorView}</div>
            </Col>
          )}
        </Row>
        <Row>
          <Col md={12}>
            <div style={{ boxShadow: "3px 3px 5px #cfcfcf", marginTop: "5px" }}>
              {this.props.tableInFilter && (
                <ThisTable
                  onColClick={this.props.onColClick}
                  onClickSelect
                  sortable={this.props.sortable}
                  tableColumns={this.props.tableColumns}
                  tableData={this.props.tableData}
                  pageSize={this.state.pageSize}
                  pagination={true}
                  onClickSelect={this.props.onClickSelect}
                  handleSelectedClick={this.props.handleSelectedClick}
                  handlePageChange={page => {
                    if (this.props.handlePageSave) {
                      this.props.handlePageSave(page, this.state.pageSize);
                    }
                  }}
                  page={this.props.page}
                  defaultSorted={this.props.defaultSorted}
                  onSortedChange={this.props.onSortedChange}
                  fetchData={this.props.fetchData}
                  manual={this.props.manual}
                  defaultPageSize={this.props.pageSize}
                  pages={this.props.pages}
                  showPagination={this.props.pagination}
                  showPaginationTop={this.props.showPaginationTop}
                  showPaginationBottom={this.props.showPaginationBottom}
                  pageSizeOptions={this.props.pageSizeOptions}
                  rowStyleMap={this.props.rowStyleMap}
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Radium(CommonFilter);

let getStyles = (props, state) => {
  // Borders ALL TODAY

  let borderColorObj = themeService({
    default: basicColors.first,

    retro: retroColors.second,
  });
  let borders = {
    allToday: {
      borderAllTop: "1px solid #e3e9ef",
      borderHoverTopAll: "1px solid  " + borderColorObj,
      borderHoverTopToday: "1px solid  " + borderColorObj,
      borderTodayTop: "1px solid #e3e9ef",
    },
  };
  if (state.allFilter) {
    borders.allToday.borderAllTop = "3px solid  " + borderColorObj;
    borders.allToday.borderHoverTopAll = "3px solid  " + borderColorObj;
  }
  if (state.todayFilter) {
    borders.allToday.borderTodayTop = "3px solid  " + borderColorObj;
    borders.allToday.borderHoverTopToday = "3px solid  " + borderColorObj;
  }

  let commonStyle = {
    display: "inline-block",
    padding: "5px",
    margin: "0px 5px",
    fontSize: "12px",
    color: " " + borderColorObj,
    cursor: "pointer",

    borderBottom: "1px solid #e3e9ef",
    borderLeft: "1px solid #e3e9ef",
    borderRight: "1px solid #e3e9ef",
    borderRadius: "5px",
  };
  let hoverCommonStyle = {
    color: themeService({ default: "rgba(64, 118, 179)", retro: retroColors.first }),
    borderBottom: "1px solid  " + borderColorObj,
    borderLeft: "1px solid  " + borderColorObj,
    borderRight: "1px solid  " + borderColorObj,
  };

  // BORDERS
  return {
    filterArea: { fontFamily: "Arial", fontSize: "12px" },
    allTodayCommonStyleToday: {
      ...commonStyle,
      borderTop: borders.allToday.borderTodayTop,
      ":hover": {
        ...hoverCommonStyle,
        borderTop: borders.allToday.borderHoverTopToday,
      },
    },
    allTodayCommonStyleAll: {
      ...commonStyle,
      borderTop: borders.allToday.borderAllTop,
      ":hover": {
        ...hoverCommonStyle,
        borderTop: borders.allToday.borderHoverTopAll,
      },
    },
    divider: commonFilterStyles.divider,
    pageSizeSelectorContainer: {
      display: "inline-block",
      paddingRight: "15px",
      paddingLeft: "5px",
      margin: "7px 0px",
    },
  };
};

CommonFilter.propTypes = {
  colFilterSize: propTypes.number.isRequired,
};

CommonFilter.defaultProps = {
  colFilterSize: 5,
};
