/* eslint eqeqeq: 0 */

import React, { Component } from "react";

import { languageService } from "Language/language.service";
import { pinOutline } from "react-icons-kit/typicons/pinOutline";
import { pin } from "react-icons-kit/typicons/pin";
import { Icon } from "react-icons-kit";

import { getStatusColor } from "../../../utils/statusColors";
import { themeService } from "../../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";

class ColorsLegend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pinned: true,
    };
    this.summaryLabels = {
      //second: this.props.template.overdue.label,
      third: this.props.template.missed.label,
      fourth: this.props.template.upcoming.secondVal,
      fifth: this.props.template.inProgress.label,
      sixth: this.props.template.completed.label,
    };

    this.summaryDesc = {
      //second: languageService(this.props.template.overdue.label),
      third: languageService(this.props.template.missed.label),
      fourth: languageService(this.props.template.upcoming.label),
      fifth: languageService(this.props.template.inProgress.label),
      sixth: languageService(this.props.template.completed.label),
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState((state) => ({
      pinned: !state.pinned,
    }));
  }
  render() {
    return (
      <div
        style={{
          padding: "0px 0px 0px 10px",
          background: "var(--fifth)",
          margin: "0 10px 0",
          position: this.state.pinned ? "absolute" : "fixed",
          right: "20px",
          bottom: this.state.pinned ? "0px" : "25vh",
          WebkitBoxShadow: "3px 5px 6px 1px rgba(0,0,0,0.75)",
          MozBoxShadow: "3px 5px 6px 1px rgba(0,0,0,0.75)",
          boxShadow: "3px 5px 6px 1px rgba(0,0,0,0.75)",
        }}
      >
        {/* <h6 style={{ fontFamily: "Myriad Pro", fontSize: "18px", letterSpacing: "0.5px", color: "var(--first)" }}>Legend:</h6> */}
        {Object.keys(this.summaryDesc).map((items) => (
          <div key={items} className={this.state.pinned ? "legend-container" : "legend-container open"}>
            <span
              style={{
                background: getStatusColor(this.summaryLabels[items]),
                height: "15px",
                width: "15px",
                display: "inline-block",
                marginRight: "10px",
                verticalAlign: "middle",
                borderRadius: "4px",
              }}
            ></span>
            <label
              className="legend-bar"
              style={themeService({ default: {}, retro: { color: retroColors.second }, electric: { color: electricColors.second } })}
            >
              {this.summaryDesc[items]}
            </label>
          </div>
        ))}
        <button
          onClick={this.handleClick}
          style={{
            background: "transparent",
            height: "21px",
            border: "none",
            width: "21px",
            display: "inline-block",
            marginRight: "10px",
            verticalAlign: "middle",
            outline: "none",
          }}
        >
          <Icon
            size={20}
            style={themeService({
              default: { color: "var(--first)", fill: "var(--first)" },
              retro: { color: retroColors.second, fill: retroColors.second },
              electric: { color: electricColors.second, fill: electricColors.second },
            })}
            icon={this.state.pinned ? pinOutline : pin}
          />
        </button>
      </div>
    );
  }
}

export default ColorsLegend;
