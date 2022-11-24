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
          onClick={e => {
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
          onClick={e => {
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
  if (state.trackIdFilter) {
    borders.pivotBy.borderAllTop = "3px solid rgba(64, 118, 179)";
    borders.pivotBy.borderHoverTopAll = "3px solid rgba(64, 118, 179)";
  }
  if (state.categoryFilter) {
    borders.pivotBy.borderTodayTop = "3px solid rgba(64, 118, 179)";
    borders.pivotBy.borderHoverTopToday = "3px solid rgba(64, 118, 179)";
  }

  let commonStyle = {
    display: "inline-block",
    padding: "5px",
    margin: "5px",
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
    filterArea: { float: "left", fontFamily: "Arial", fontSize: "12px" },
    divider: {
      display: "inline-block",
      color: "rgba(64, 118, 179)",
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
