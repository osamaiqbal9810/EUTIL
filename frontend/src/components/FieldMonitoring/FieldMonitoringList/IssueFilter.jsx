import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Radium from "radium";
import IssueTypeFilter from "./IssueTypeFilter";
class IssueFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allFilter: false,
      todayFilter: true,
      trackIdFilter: false,
      categoryFilter: true,
    };

    this.handleFilterTodayAllClick = this.handleFilterTodayAllClick.bind(this);
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
      <Row>
        <Col md={6}>
          <div style={styles.filterArea}>
            <div
              style={styles.allTodayCommonStyleToday}
              key="today"
              onClick={(e) => {
                this.handleFilterTodayAllClick("today");
              }}
            >
              Today
            </div>
            <div style={styles.divider} key="divider1">
              |
            </div>
            <div
              style={styles.allTodayCommonStyleAll}
              key="all "
              onClick={(e) => {
                this.handleFilterTodayAllClick("all");
              }}
            >
              All
            </div>
          </div>
          <IssueTypeFilter handleFilterPivotBy={this.props.handleFilterPivotBy} />
        </Col>
      </Row>
    );
  }
}

export default Radium(IssueFilter);

let getStyles = (props, state) => {
  // Borders ALL TODAY
  let borders = {
    allToday: {
      borderAllTop: "1px solid #e3e9ef",
      borderHoverTopAll: "1px solid var(--first)",
      borderHoverTopToday: "1px solid var(--first)",
      borderTodayTop: "1px solid #e3e9ef",
    },
  };
  if (state.allFilter) {
    borders.allToday.borderAllTop = "3px solid var(--first)";
    borders.allToday.borderHoverTopAll = "3px solid var(--first)";
  }
  if (state.todayFilter) {
    borders.allToday.borderTodayTop = "3px solid var(--first)";
    borders.allToday.borderHoverTopToday = "3px solid var(--first)";
  }

  let commonStyle = {
    display: "inline-block",
    padding: "5px",
    margin: "5px",
    color: "var(--first)",
    cursor: "pointer",

    borderBottom: "1px solid #e3e9ef",
    borderLeft: "1px solid #e3e9ef",
    borderRight: "1px solid #e3e9ef",
    borderRadius: "5px",
  };
  let hoverCommonStyle = {
    color: "var(--first)",
    borderBottom: "1px solid var(--first)",
    borderLeft: "1px solid var(--first)",
    borderRight: "1px solid var(--first)",
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
      color: "var(--first)",
    },
  };
};
