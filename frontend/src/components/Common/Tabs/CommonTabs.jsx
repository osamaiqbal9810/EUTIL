import React, { Component } from "react";
import Radium from "radium";
import { themeService } from "../../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { getLanguageLocal, languageService } from "Language/language.service";
class CommonTabs extends Component {
  constructor(props) {
    super(props);

    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(tabValue) {
    this.props.handleTabClick(tabValue);
  }

  render() {
    const styles = getStyles(this.props, this.state);
    return (
      <div
        style={styles.assetTypeStyle}
        key={this.props.tabValue}
        onClick={(e) => {
          this.handleTabClick(this.props.tabValue);
        }}
      >
        {languageService(this.props.tabValue)}
      </div>
    );
  }
}

export default Radium(CommonTabs);

let getStyles = (props, state) => {
  // console.log('getStylsprops')
  // console.log(props)
  // console.log(state)
  let borders = themeService({
    default: {
      backgColor: "#e3e9ef",
      color: "var(--fifth)",
    },
    retro: {
      backgColor: retroColors.four,
      color: retroColors.second,
    },
  });

  if (props.tabState) {
    borders.backgColor = themeService({ default: basicColors.first, retro: retroColors.first, electric: electricColors.first });
    borders.color = "var(--fifth)";
    // borders.borderTop = '3px solid "var(--first)"'
    // borders.borderHoverTop = '3px solid "var(--first)"'
  } else {
    borders.backgColor = "#e3e9ef";
    borders.color = themeService({ default: basicColors.first, retro: retroColors.second, electric: electricColors.second });
  }
  let commonStyle = themeService({
    default: {
      display: "inline-block",
      padding: "10px 10px",
      fontSize: "14px",
      fontWeight: "bold",
      textTransform: "uppercase",
      cursor: "pointer",

      color: borders.color,
      // borderBottom: '1px solid #e3e9ef',
      // borderLeft: '1px solid #e3e9ef',
      // borderRight: '1px solid #e3e9ef',
      borderRadius: "30px",
    },
    retro: {
      display: "inline-block",
      padding: "10px 10px",
      fontSize: "14px",
      fontWeight: "bold",
      textTransform: "uppercase",
      cursor: "pointer",
      backgroundColor: retroColors.fourth,
      color: retroColors.second,
      borderRadius: "0px",
    },

    electric: {
      display: "inline-block",
      padding: "10px 10px",
      fontSize: "14px",
      fontWeight: "bold",
      textTransform: "uppercase",
      cursor: "pointer",
      backgroundColor: electricColors.fourth,
      color: electricColors.second,
      borderRadius: "0px",
    },
  });
  let hoverCommonStyle = themeService({
    default: {
      color: "var(--first)",
      borderBottom: "1px solid var(--first)",
      borderLeft: "1px solid var(--first)",
      borderRight: "1px solid var(--first)",
    },
    retro: {
      color: "var(--first)",
      borderBottom: "1px solid red",
      borderLeft: "1px solid red",
      borderRight: "1px solid red",
    },
    electric: {
      color: "var(--first)",
      borderBottom: "1px solid red",
      borderLeft: "1px solid red",
      borderRight: "1px solid red",
    },
  });

  // BORDERS
  return {
    filterArea: { fontFamily: "Arial", fontSize: "12px" },
    assetTypeStyle: {
      ...commonStyle,
      borderTop: borders.borderTop,
      backgroundColor: borders.backgColor,
      ":hover": {
        ...hoverCommonStyle,
        borderTop: borders.borderHoverTop,
        backgroundColor: borders.nine,
      },
    },

    pageSizeSelectorContainer: {
      display: "inline-block",
      paddingRight: "15px",
      paddingLeft: "5px",
      margin: "7px 0px",
    },
  };
};
