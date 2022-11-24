/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import {
  Row,
  Col,
  DropdownItem,
} from "reactstrap";
import Radium from "radium";
import propTypes from "prop-types";
import ThisTable from "components/Common/ThisTable/index";
//import CommonTypeFilter from './CommonTypeFilter'
class GisFilters extends Component {
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
    this.setState({
      pageSize: pageSize,
    });
  }

  render() {
    // const styles = getStyles(this.props, this.state);
    let firstFilterName = "Today";
    // if (this.props.firstFilterName) {
    //   firstFilterName = this.props.firstFilterName;
    // }
    // let pageOptions = null;
    // pageOptions = this.pageOptions.map(option => {
    //   return (
    //     <DropdownItem
    //       onClick={e => {
    //         this.handlePageSizeChange(option);
    //       }}
    //       key={option}
    //       style={{ color: "rgba(64, 118, 179)", padding: ".25rem 0.75rem", border: "1px solid #ededed", borderRadius: "3px" }}
    //     >
    //       {option}
    //     </DropdownItem>
    //   );
    // });
    // let colPageSize,
    //   colFilter,
    //   colEditView = null;
    // colPageSize = 1;
    // colFilter = this.props.editorView ? this.props.colFilterSize : 10;
    // colEditView = this.props.noFilters ? 11 : 11 - this.props.colFilterSize;

    return (
      <div style={{ width: "100%" }}>
        {/* <Row>
          <Col md={colPageSize} style={styles.filterArea}>
            <div style={styles.pageSizeSelectorContainer} key="pageSize">
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} size="sm">
                <DropdownToggle
                  style={{
                    background: "#e3e9ef",
                    color: "rgba(64, 118, 179)",
                    borderColor: "rgba(64, 118, 179)",
                    padding: "0.15rem 0.5rem",
                    fontSize: "12px",
                    height: "25px",
                    width: "40px",
                  }}
                  caret
                >
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
                <div style={styles.divider} key="divider1">
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
        </Row> */}
        <Row>
          <Col md={12}>
            <div style={{ marginTop: "5px" }}>
              {this.props.tableInFilter && (
                <ThisTable
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
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Radium(GisFilters);

let getStyles = (props, state) => {
  // Borders ALL TODAY
  let borders = {
    allToday: {
      borderAllTop: "1px solid #e3e9ef",
      borderHoverTopAll: "1px solid rgba(64, 118, 179)",
      borderHoverTopToday: "1px solid rgba(64, 118, 179)",
      borderTodayTop: "1px solid #e3e9ef",
    },
  };
  if (state.allFilter) {
    borders.allToday.borderAllTop = "3px solid rgba(64, 118, 179)";
    borders.allToday.borderHoverTopAll = "3px solid rgba(64, 118, 179)";
  }
  if (state.todayFilter) {
    borders.allToday.borderTodayTop = "3px solid rgba(64, 118, 179)";
    borders.allToday.borderHoverTopToday = "3px solid rgba(64, 118, 179)";
  }

  let commonStyle = {
    display: "inline-block",
    padding: "5px",
    margin: "0px 5px",
    fontSize: "12px",
    color: "rgba(64, 118, 179)",
    cursor: "pointer",

    borderBottom: "1px solid #e3e9ef",
    borderLeft: "1px solid #e3e9ef",
    borderRight: "1px solid #e3e9ef",
    borderRadius: "5px",
  };
  let hoverCommonStyle = {
    color: "rgba(64, 118, 179)",
    borderBottom: "1px solid rgba(64, 118, 179)",
    borderLeft: "1px solid rgba(64, 118, 179)",
    borderRight: "1px solid rgba(64, 118, 179)",
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
    divider: {
      display: "inline-block",
      color: "rgba(64, 118, 179)",
    },
    pageSizeSelectorContainer: {
      display: "inline-block",
      paddingRight: "15px",
      paddingLeft: "5px",
      margin: "7px 0px",
    },
  };
};

GisFilters.propTypes = {
  colFilterSize: propTypes.number.isRequired,
};

GisFilters.defaultProps = {
  colFilterSize: 5,
};
