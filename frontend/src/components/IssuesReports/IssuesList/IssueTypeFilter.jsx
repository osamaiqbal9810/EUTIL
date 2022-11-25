import React, { Component } from "react";
import Radium from "radium";
class IssueTypeFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackIdFilter: false,
      categoryFilter: true,
    };
    this.handleFilterPivotBy = this.handleFilterPivotBy.bind(this);
  }
  handleFilterPivotBy(filterName) {
    if (filterName === "trackId") {
      this.setState({
        trackIdFilter: true,
        categoryFilter: false,
      });
    } else if (filterName === "category") {
      this.setState({
        trackIdFilter: false,
        categoryFilter: true,
      });
    }
    this.props.handleFilterPivotBy(filterName);
  }

  render() {
    const styles = getStyles(this.props, this.state);
    return (
      <div style={{ ...styles.filterArea, marginLeft: "15px" }}>
        <div
          style={styles.pivotByCommonStyleCategory}
          key="category"
          onClick={(e) => {
            this.handleFilterPivotBy("category");
          }}
        >
          Category
        </div>
        <div style={styles.divider} key="divider1">
          |
        </div>
        <div
          style={styles.pivotByCommonStyleTrackId}
          key="trackId "
          onClick={(e) => {
            this.handleFilterPivotBy("trackId");
          }}
        >
          Track ID
        </div>
      </div>
    );
  }
}

export default Radium(IssueTypeFilter);

let getStyles = (props, state) => {
  // Borders ALL TODAY
  let borders = {
    pivotBy: {
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
  if (state.trackIdFilter) {
    borders.pivotBy.borderAllTop = "3px solid var(--first)";
    borders.pivotBy.borderHoverTopAll = "3px solid var(--first)";
  }
  if (state.categoryFilter) {
    borders.pivotBy.borderTodayTop = "3px solid var(--first)";
    borders.pivotBy.borderHoverTopToday = "3px solid var(--first)";
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
    divider: {
      display: "inline-block",
      color: "var(--first)",
    },
    pivotByCommonStyleCategory: {
      ...commonStyle,
      borderTop: borders.pivotBy.borderTodayTop,
      ":hover": {
        ...hoverCommonStyle,
        borderTop: borders.pivotBy.borderHoverTopToday,
      },
    },
    pivotByCommonStyleTrackId: {
      ...commonStyle,
      borderTop: borders.pivotBy.borderAllTop,
      ":hover": {
        ...hoverCommonStyle,
        borderTop: borders.pivotBy.borderHoverTopAll,
      },
    },
  };
};
