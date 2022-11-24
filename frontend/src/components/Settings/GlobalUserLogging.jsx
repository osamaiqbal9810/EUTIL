import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import { Heading, Seperator } from "./common";
import InputCheckBoxField from "components/Common/Forms/InputCheckBoxField";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import { languageService } from "../../Language/language.service";
import { themeService } from "../../theme/service/activeTheme.service";
import { settingStyles } from "./style/settingStyle";
import { ButtonStyle } from "../../style/basic/commonControls";

class GlobalUserLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggingValue: true,
    };
    this.handleGeoLogginClick = this.handleGeoLogginClick.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  handleGeoLogginClick(value) {
    this.setState({
      userLoggingValue: value,
    });
  }
  handleSave() {
    this.props.saveGeoLocationLogging(this.state.userLoggingValue);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType !== prevProps.actionType && this.props.actionType == "GLOBAL_USER_LOGGING_GET_SUCCESS") {
      //console.log(this.props.userLogginVal);
      this.setState({
        userLoggingValue: this.props.userLogginVal,
      });
    }
  }

  render() {
    return (
      <div style={themeService(settingStyles.geoGlobalMainContainer)}>
        <Heading>GPS {languageService("Location")} </Heading>
        <div style={themeService(settingStyles.globalUserInputContainer)}>
          <InputCheckBoxField
            label={languageService("GPS Location Recording of Users In System")}
            labelPos={0}
            ClickHandler={this.handleGeoLogginClick}
            checked={this.state.userLoggingValue}
          />
        </div>
        <div>
          <MyButton onClick={this.handleSave} style={themeService(ButtonStyle.commonButton)}>
            {languageService("Save")}
          </MyButton>
        </div>
        <Seperator />
      </div>
    );
  }
}

export default GlobalUserLogging;
