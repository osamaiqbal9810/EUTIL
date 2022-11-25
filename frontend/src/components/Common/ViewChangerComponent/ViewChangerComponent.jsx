import React, { Component } from "react";
import SvgIcon from "react-icons-kit";
import { Tooltip } from "reactstrap";
import { languageService } from "../../../Language/language.service";
import { themeService } from "../../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
class ViewChangerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: null,
    };
  }
  toggleTooltip = (tooltip) => {
    if (this.state.tooltip) {
      this.setState({ tooltip: null });
    } else {
      this.setState({ tooltip });
    }
  };
  render() {
    let paddingArround = "20px 0px 0px 10px";
    if (this.props.placement == "TOP_OF_PAGE") {
      paddingArround = "0px 0px 0px 10px";
    }
    return (
      <div style={{ paddingRight: "15px" }}>
        {this.props.LIST_VIEW_SELECTION.map((item, index) => {
          let color = "var(--fifth)";
          let backgroundColor = "rgb(196, 212, 228)";
          let boxShadow = "0 0 0 2px rgb(196, 212, 228)";
          if (item.title === this.props.listViewDataToShow) {
            color = "var(--first)";
            backgroundColor = "var(--fifth)";
            boxShadow = "0 0 0 2px rgb(255, 255, 255)";
          }

          return (
            <div
              style={{ display: "inline-block", float: "right", padding: paddingArround, cursor: "pointer" }}
              key={index}
              id={item.title}
              className={`view-changer-item ${this.props.listViewDataToShow === item.title ? "active" : ""}`}
            >
              <div>
                <div
                  style={themeService({
                    default: {
                      color: color,
                      //color: "var(--fifth)",
                      border: "2px solid ",
                      padding: "3px 6px",
                      backgroundColor: backgroundColor,
                      borderRadius: "50%",
                      boxShadow: boxShadow,
                      transform: "all .2s ease-in-out",
                    },
                    retro: {
                      //color: retroColors.fouth,
                      //color: "var(--fifth)",
                      border: "0px solid ",
                      padding: "3px 6px",
                      backgroundColor: "transparent",
                      borderRadius: "0",
                      transform: "all .2s ease-in-out",
                    },
                    electric: {
                      //color: electricColors.fouth,
                      //color: "var(--fifth)",
                      border: "0px solid ",
                      padding: "3px 6px",
                      backgroundColor: "transparent",
                      borderRadius: "0",
                      transform: "all .2s ease-in-out",
                    },
                  })}
                  onClick={() => (this.props.handleListViewSelection ? this.props.handleListViewSelection(item.title) : null)}
                >
                  <SvgIcon
                    icon={item.icon}
                    size={themeService({ default: "18px", retro: "30px", electric: "30px" })}
                    style={{ display: "block" }}
                  />
                </div>
              </div>

              <Tooltip
                isOpen={this.state.tooltip && this.state.tooltip.title === item.title}
                target={item.title}
                toggle={() => this.toggleTooltip(item)}
              >
                {languageService(item.tooltip.text)}
              </Tooltip>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ViewChangerComponent;

ViewChangerComponent.defaultProps = {
  LIST_VIEW_SELECTION: [],
};
