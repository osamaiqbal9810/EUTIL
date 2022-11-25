import React, { Component } from "react";
import SvgIcon from "react-icons-kit";
import { floppyDisk } from "react-icons-kit/icomoon/floppyDisk";
import { locationListStyle } from "./LocationListStyle";
import { themeService } from "../../theme/service/activeTheme.service";
import { cross } from "react-icons-kit/icomoon/cross";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import { Tooltip } from "reactstrap";
import { languageService } from "../../Language/language.service";
export default class AddNewInputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value ? this.props.value : "",
      tooltip: false,
      saveTooltip: false,
    };
  }

  render() {
    return (
      <div>
        <input
          style={themeService(locationListStyle.addNewInputField)}
          onChange={(e) => {
            this.setState({
              value: e.target.value,
            });
          }}
          defaultValue={this.props.value ? this.props.value : ""}
          placeholder="name"
        />
        {!this.props.noDelete && (
          <React.Fragment>
            <span
              id={`save-delete-btn-${this.props.index}`}
              style={{ ...themeService(locationListStyle.saveInputIcon), ...{ color: "#840f0f" } }}
              onClick={(e) => {
                this.setState({
                  value: "",
                });
                this.props.handleAddNewLocation(false);
              }}
            >
              <SvgIcon style={{ verticalAlign: "middle" }} icon={cross} size="15" />
            </span>

            <Tooltip
              isOpen={this.state.tooltip}
              target={`save-delete-btn-${this.props.index}`}
              toggle={() => this.setState({ tooltip: !this.state.tooltip })}
            >
              {languageService("Delete")}
            </Tooltip>
          </React.Fragment>
        )}
        <span
          id={`save-btn-${this.props.index || 99}`}
          style={{
            ...themeService(locationListStyle.saveInputIcon),
            ...{ color: this.props.color ? this.props.color : "var(--first)" },
          }}
          onClick={(e) => {
            this.setState({
              value: "",
            });
            this.props.handleSaveField(this.state.value);
          }}
        >
          <SvgIcon icon={floppyDisk} size="15" style={{ verticalAlign: "middle" }} />
        </span>

        <Tooltip
          isOpen={this.state.saveTooltip}
          target={`save-btn-${this.props.index || 99}`}
          toggle={() => this.setState({ saveTooltip: !this.state.saveTooltip })}
        >
          {languageService("Save")}
        </Tooltip>
      </div>
    );
  }
}
