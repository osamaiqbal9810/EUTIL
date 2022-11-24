import React, { Component } from "react";
import { Label } from "components/Common/Forms/formsMiscItems";
import { languageService } from "../../Language/language.service";
import { themeService } from "theme/service/activeTheme.service";
import { basicColors, retroColors } from "style/basic/basicColors";

class CloseIssue extends Component {
  render() {
    return (
      <React.Fragment>
        <div>
          <Label
            styles={themeService({
              default: { color: basicColors.first, fontSize: "14px" },
              retro: { fontSize: "14px", color: retroColors.second },
            })}
          >
            {languageService("Reason")}{" "}
          </Label>
        </div>
        {!this.props.closed && (
          <textarea
            style={themeService({
              default: { color: "rgba(64, 118, 179)", fontSize: "12px", resize: "auto", width: "100%", minHeight: "100px" },
              retro: { color: retroColors.second, fontSize: "12px", resize: "auto", width: "100%", minHeight: "100px" },
            })}
            type="textbox"
            onChange={this.props.handleChange}
          />
        )}
        {this.props.closed && (
          <p
            style={themeService({
              default: { color: "rgba(64, 118, 179)", fontSize: "12px" },
              retro: { color: retroColors.second, fontSize: "12px" },
            })}
          >
            {" "}
            {this.props.issue.closeReason}
          </p>
        )}
        {!this.props.validReason && !this.props.firstTime && (
          <p
            style={themeService({
              default: { fontSize: "12px", color: "red" },
              retro: { fontSize: "12px", color: "red" },
            })}
          >
            {languageService("Please enter reason for closing")}{" "}
          </p>
        )}
      </React.Fragment>
    );
  }
}

export default CloseIssue;
