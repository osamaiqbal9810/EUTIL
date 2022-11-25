import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import Radium from "radium";
import { Link, Route } from "react-router-dom";
import { siteOptionsTexts, timpsOptionsTexts } from "./options";
import { languageService } from "../../Language/language.service";
import { themeService } from "theme/service/activeTheme.service";
import { setupOptionStyle } from "./style/SetupOptions";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import permissionCheck from "../../utils/permissionCheck";
import { versionInfo } from "../MainPage/VersionInfo";
class SetupOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null,
    };
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick(index) {
    this.setState({ selectedIndex: index });
  }
  componentDidMount() {
    // this.props.path == "/setup" && this.props.history.push("setup/staff");
  }

  render() {
    let optionsTexts = [];
    let timpsSignalApp = versionInfo.isSITE();

    optionsTexts = timpsSignalApp ? siteOptionsTexts : timpsOptionsTexts;

    let content = optionsTexts.map((option, index) => {
      let selectedCheck = false;
      if (index == this.state.selectedIndex || (!this.state.selectedIndex && index == 0)) {
        selectedCheck = true;
      }
      let permissionCheckBool = option.checkPermission ? permissionCheck(option.permissionResource, option.permissionAction) : true;
      return permissionCheckBool ? (
        <OptionRow
          key={index}
          option={option}
          index={index}
          selected={selectedCheck}
          path={this.props.path}
          linkSelected={this.handleLinkClick}
        />
      ) : null;
    }, this);
    return <div>{content}</div>;
  }
}

export default SetupOptions;

class OptionRow extends Component {
  render() {
    const styles = getStyles(this.props, this.state);
    let option = this.props.option;
    return (
      <Col md={themeService(setupOptionStyle.colSize).size} style={themeService(setupOptionStyle.colStyle)}>
        <div style={{ ...styles.rowContainer, borderRadius: "3px" }} key={this.props.index}>
          <Link
            style={styles.linkRow}
            to={`${this.props.path}/` + this.props.option.path}
            onMouseDown={(e) => {
              this.props.linkSelected(this.props.index);
            }}
          >
            <div style={styles.linkText}>{languageService(this.props.option.displayName)} </div>
          </Link>
        </div>
      </Col>
    );
  }
}

OptionRow = Radium(OptionRow);

let getStyles = (props, state) => {
  let color = themeService({
    default: basicColors.first,

    retro: retroColors.second,
    electric: electricColors.second,
  });
  let borderBottomActiveRetro = "1px solid var(--fourth)";
  let fontWeight = "normal";
  let fontSize = "11px";
  let textPadding = "10px 20px";
  if (props.selected) {
    color = color;
    fontWeight = "bold";
    fontSize = "12px";
    textPadding = "10px 20px 6px";
    borderBottomActiveRetro = "4px solid var(--first)";
  }
  return {
    rowContainer: themeService({
      default: {
        backgroundColor: "var(--fifth)",
        borderBottom: "1px solid #e3e9ef",
        textAlign: "left",
        color: color,
        fontWeight: fontWeight,
        fontFamily: "Arial",
        fontSize: fontSize,
        letterSpacing: "0.35px",
        cursor: "pointer",
        boxShadow: "3px 3px 5px #cfcfcf",
        ":hover": {
          backgroundColor: "var(--first)",
          color: "var(--fifth)",
        },
      },
      retro: {
        backgroundColor: retroColors.fifth,
        // border: "1px solid" + retroColors.fourth,
        borderBottom: borderBottomActiveRetro,
        textAlign: "left",
        color: color,
        fontWeight: "bold",
        fontFamily: "Arial",
        fontSize: fontSize,
        letterSpacing: "0.35px",
        cursor: "pointer",
        minWidth: "150px",
        boxShadow: "none",
        ":hover": {
          borderBottomSize: "4px",
        },
        ":active": {
          fontWeight: "bold",
          fontFamily: "Arial",
          fontSize: fontSize,
        },
      },
      electric: {
        backgroundColor: electricColors.fifth,
        // border: "1px solid" + retroColors.fourth,
        borderBottom: borderBottomActiveRetro,
        textAlign: "left",
        color: color,
        fontWeight: "bold",
        fontFamily: "Arial",
        fontSize: fontSize,
        letterSpacing: "0.35px",
        cursor: "pointer",
        minWidth: "150px",
        boxShadow: "none",
        ":hover": {
          borderBottomSize: "4px",
        },
        ":active": {
          fontWeight: "bold",
          fontFamily: "Arial",
          fontSize: fontSize,
        },
      },
    }),
    linkText: {
      padding: textPadding,
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
