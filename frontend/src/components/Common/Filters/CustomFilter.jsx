import React, { Component } from "react";
import Radium from "radium";
import { languageService } from "Language/language.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { themeService } from "../../../theme/service/activeTheme.service";
class CustomFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  handleFilterClick(filter, index) {
    //console.log(this.props);
    filter.state = !filter.state;
    this.props.handleClick(filter, index);

    this.setState({
      active: !this.state.active,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { active: nextProps.filter.state };
  }

  componentDidMount() {
    this.setState({
      active: this.props.filter.state,
    });
  }

  render() {
    const styles = getStyles(this.props, this.state);
    return (
      <div
        style={styles.filterStyle}
        key={this.props.filter.id}
        onClick={(e) => {
          this.handleFilterClick(this.props.filter, this.props.index);
        }}
      >
        {languageService(this.props.filter.text)}
      </div>
    );
  }
}

export default Radium(CustomFilter);

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
    electric: electricColors.second,
  });
  if (state.active) {
    borders.borderTop = "3px solid  " + borderColorObj;
    borders.borderHoverTop = "3px solid  " + borderColorObj;
  } else {
    borders.borderTop = "1px solid #e3e9ef";
    borders.borderHoverTop = "1px solid  " + borderColorObj;
  }
  let commonStyle = {
    display: "inline-block",
    padding: "5px",
    margin: "0px 5px",
    fontSize: "12px",
    color: " " + borderColorObj,

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
    filterArea: { fontFamily: "Arial", fontSize: "12px" },
    filterStyle: {
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
