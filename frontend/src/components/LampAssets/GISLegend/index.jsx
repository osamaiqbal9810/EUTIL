import React, { Component } from "react";

import { languageService } from "Language/language.service";
import { pinOutline } from "react-icons-kit/typicons/pinOutline";
import { pin } from "react-icons-kit/typicons/pin";
import { Icon } from "react-icons-kit";
// import { inspectionTemplate } from "templates/InspectionTemplate";
// import { getStatusColor } from "../../../utils/statusColors";
import { themeService } from "../../../theme/service/activeTheme.service";
import { retroColors } from "../../../style/basic/basicColors";

class GISLegend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pinned: true,
    };

    // this.legendData=[{text: 'text 1', color:'yellow'},
    // {text: 'text 2', color:'blue'},
    // {text: 'text 3', color:'green'},
    // {text: 'text 4', color:'red'},
    // {text: 'text 5', color:'black'}];

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState((state) => ({
      pinned: !state.pinned,
    }));
  }
  render() {
    return (
      <React.Fragment>
        <div
          style={{
            position: "absolute",
            left: this.state.pinned ? "15px" : "-110px",
            top: "30px",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {/* <h6 style={{ fontFamily: "Myriad Pro", fontSize: "18px", letterSpacing: "0.5px", color: "rgb(64, 118, 179)" }}>Legend:</h6> */}
          <div style={{ display: "inline-block", width: "70%", background: "rgb(102, 102, 102)", padding: "10px", lineHeight: "normal" }}>
            {this.props.legendData &&
              this.props.legendData.map((item) => (
                <div
                  key={item.text}
                  className={this.state.pinned ? "legend-container gis" : "legend-container gis open"}
                  style={{ background: "#fff", padding: "5px" }}
                >
                  <span
                    style={{
                      background: item.color,
                      height: "5px",
                      width: "100%",
                      display: "inline-block",
                      marginRight: "10px",
                      verticalAlign: "middle",
                      borderRadius: "4px",
                    }}
                  ></span>
                  <label className="legend-bar" style={themeService({ default: {}, retro: { color: retroColors.second } })}>
                    {item.text.charAt(0).toUpperCase() + item.text.slice(1)}
                  </label>
                </div>
              ))}
          </div>
          <button
            onClick={this.handleClick}
            style={{
              background: "rgb(102, 102, 102)",
              border: "none",
              width: "30%",
              cursor: "pointer",
              display: "inline-block",
              verticalAlign: "top",
              outline: "none",
              fontSize: "12px",
              padding: "8px 0 0 0",
              marginTop: "10px",
            }}
          >
            {/* <Icon
              size={20}
              style={themeService({
                default: { color: "rgb(64, 118, 179)", fill: "rgb(64, 118, 179)" },
                retro: { color: retroColors.second, fill: retroColors.second },
              })}
              icon={this.state.pinned ? pinOutline : pin}
            /> */}
            <span
              style={{
                writingMode: "vertical-rl",
                textOrientation: "upright",
                textTransform: "uppercase",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Legend
            </span>
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default GISLegend;
