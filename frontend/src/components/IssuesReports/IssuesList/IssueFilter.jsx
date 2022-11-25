import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Radium from "radium";
import IssueTypeFilter from "./IssueTypeFilter";

import CustomFilters from "components/Common/Filters/CustomFilters";
import { themeService } from "../../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";

class IssueFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allFilter: true,
      todayFilter: false,
      trackIdFilter: false,
      categoryFilter: true,
      issueStateFilter: [
        { text: "Open", state: this.props.issueStateFilter == "Open" ? true : false },
        { text: "Resolved", state: this.props.issueStateFilter == "Resolved" ? true : false },
        { text: "All", state: this.props.issueStateFilter == "All" ? true : false },
      ],
    };

    this.handleFilterTodayAllClick = this.handleFilterTodayAllClick.bind(this);
    this.handleIssueStateFilterClick = this.handleIssueStateFilterClick.bind(this);
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
  handleIssueStateFilterClick(filter) {
    if (filter.text === "Resolved" && filter.state) {
      this.props.filterIssuesState("Resolved");
    } else if (filter.text === "Open" && filter.state) {
      this.props.filterIssuesState("Open");
    } else if (filter.text === "All" && filter.state) {
      this.props.filterIssuesState("All");
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.filterTodayOrAll !== prevProps.filterTodayOrAll) {
      if (this.props.filterTodayOrAll == "today") {
        this.setState({
          todayFilter: true,
          allFilter: false,
        });
      } else if (this.props.filterTodayOrAll == "all") {
        this.setState({
          todayFilter: false,
          allFilter: true,
        });
      }
    }
  }

  render() {
    const styles = getStyles(this.props, this.state);
    return (
      // <Row>
      //   <Col md={6}>
      //     <div style={styles.filterArea}>
      //       <div
      //         style={styles.allTodayCommonStyleToday}
      //         key="today"
      //         onClick={e => {
      //           this.handleFilterTodayAllClick("today");
      //         }}
      //       >
      //         {("Today")}
      //       </div>
      //       <div style={styles.divider} key="divider1">
      //         |
      //       </div>
      //       <div
      //         style={styles.allTodayCommonStyleAll}
      //         key="all "
      //         onClick={e => {
      //           this.handleFilterTodayAllClick("all");
      //         }}
      //       >
      //         {("All")}
      //       </div>
      //     </div>
      <React.Fragment>
        <span style={{ marginLeft: "30px" }} />

        <CustomFilters
          handleClick={this.handleIssueStateFilterClick}
          filters={this.state.issueStateFilter}
          exclusive
          // displayText={""}
          // showDisplayText
        />
      </React.Fragment>

      //   </Col>
      // </Row>
    );
  }
}

export default Radium(IssueFilter);

let getStyles = (props, state) => {
  let borderColorObj = themeService({
    default: basicColors.first,

    retro: retroColors.second,
    electric: electricColors.second,
  });
  // Borders ALL TODAY
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
    margin: "0 5px",
    color: " " + borderColorObj,
    cursor: "pointer",

    borderBottom: "1px solid #e3e9ef",
    borderLeft: "1px solid #e3e9ef",
    borderRight: "1px solid #e3e9ef",
    borderRadius: "5px",
  };
  let hoverCommonStyle = {
    color: themeService({ default: "var(--first)", retro: retroColors.second, electric: electricColors.second }),
    borderBottom: "1px solid  " + borderColorObj,
    borderLeft: "1px solid  " + borderColorObj,
    borderRight: "1px solid  " + borderColorObj,
  };

  // BORDERS
  return {
    filterArea: { float: "left", fontFamily: "Arial", fontSize: "12px" },
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
      color: " " + borderColorObj,
    },
  };
};
