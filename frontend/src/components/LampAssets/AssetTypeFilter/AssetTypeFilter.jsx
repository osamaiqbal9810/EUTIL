import React, { Component } from "react";
import Radium from "radium";
import { languageService } from "Language/language.service.js";
import { retroColors, basicColors } from "../../../style/basic/basicColors";
import { themeService } from "../../../theme/service/activeTheme.service";
class AssetTypeFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  handleFilterClick(assetType) {
    this.props.handleAssetTypeFilterClick(assetType);
    this.setState({
      active: !this.state.active,
    });
  }

  componentDidMount() {
    this.setState({
      active: this.props.assetType.filterState,
    });
  }

  render() {
    const styles = getStyles(this.props, this.state);
    return (
      <div
        style={styles.assetTypeStyle}
        key={this.props.assetType.assetType}
        onClick={e => {
          this.handleFilterClick(this.props.assetType);
        }}
      >
        {languageService(this.props.assetType.assetType)}
      </div>
    );
  }
}

export default Radium(AssetTypeFilter);

let getStyles = (props, state) => {
  // console.log('getStylsprops')
  // console.log(props)
  // console.log(state)
  let borders = {
    borderTop: "1px solid #e3e9ef",
    borderHover: "1px solid  " + borderColorObj,
  };
  let borderColorObj = themeService({
    default: basicColors.first,

    retro: retroColors.second,
  });

  if (props.filterState) {
    borders.borderTop = "3px solid " + borderColorObj;
    borders.borderHoverTop = "3px solid " + borderColorObj;
  } else {
    borders.borderTop = "1px solid #e3e9ef";
    borders.borderHoverTop = "1px solid " + borderColorObj;
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
    color: themeService({ default: "rgba(64, 118, 179)", retro: retroColors.second }),
    borderBottom: "1px solid rgba(64, 118, 179)",
    borderLeft: "1px solid rgba(64, 118, 179)",
    borderRight: "1px solid rgba(64, 118, 179)",
  };

  // BORDERS
  return {
    filterArea: { fontFamily: "Arial", fontSize: "12px" },
    assetTypeStyle: {
      ...commonStyle,
      borderTop: borders.borderTop,
      ":hover": {
        ...hoverCommonStyle,
        borderTop: borders.borderHoverTop,
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
