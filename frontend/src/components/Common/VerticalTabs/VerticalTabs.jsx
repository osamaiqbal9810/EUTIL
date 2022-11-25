import React, { Component } from "react";
import propTypes from "prop-types";
import Radium from "radium";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { themeService } from "../../../theme/service/activeTheme.service";
class VerticalTabs extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let tabs =
      this.props.data &&
      this.props.data.map((tab) => {
        return <Tab tab={tab} tabValue={tab.value} key={tab.key} onTabClick={this.props.onTabClick} />;
      });
    return <div>{tabs}</div>;
  }
}

export default VerticalTabs;

const TabComp = (props) => {
  const styles = getStyles(props);
  return (
    <div
      style={themeService(styles.rowContainer)}
      onClick={(e) => {
        props.onTabClick(props.tab);
      }}
    >
      <div style={styles.linkText}>{props.tabValue} </div>
    </div>
  );
};
const Tab = Radium(TabComp);

VerticalTabs.propTypes = {
  data: propTypes.array.isRequired,
  onTabClick: propTypes.func.isRequired,
};

let getStyles = (props, state) => {
  return {
    rowContainer: {
      default: {
        backgroundColor: "var(--fifth)",
        borderBottom: "1px solid #e3e9ef",
        textAlign: "left",
        color: basicColors.first,
        fontWeight: "bold",
        fontFamily: "Arial",
        fontSize: "12px",
        letterSpacing: "0.35px",
        cursor: "pointer",
        boxShadow: "3px 3px 5px #cfcfcf",
        ":hover": {
          backgroundColor: basicColors.first,
          color: basicColors.fourth,
        },
      },
      retro: {
        backgroundColor: retroColors.fifth,
        border: "1px solid " + retroColors.second,
        textAlign: "left",
        color: retroColors.second,
        fontWeight: "bold",
        fontFamily: "Arial",
        fontSize: "12px",
        letterSpacing: "0.35px",
        cursor: "pointer",

        ":hover": {
          backgroundColor: retroColors.first,
        },
      },
      electric: {
        backgroundColor: electricColors.fifth,
        border: "1px solid " + electricColors.second,
        textAlign: "left",
        color: electricColors.second,
        fontWeight: "bold",
        fontFamily: "Arial",
        fontSize: "12px",
        letterSpacing: "0.35px",
        cursor: "pointer",

        ":hover": {
          backgroundColor: electricColors.first,
        },
      },
    },
    linkText: {
      padding: "10px 20px",
    },
    linkRow: {
      color: "inherit",
      textDecoration: "none",
      ":hover": {
        color: "inherit",
      },
    },
  };
};
