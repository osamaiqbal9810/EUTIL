import React, { Component } from "react";

import { languageService } from "Language/language.service";
import { Container, Col, Label, Button, FormGroup } from "reactstrap";
import { AvForm, AvInput, AvFeedback, AvGroup } from "availity-reactstrap-validation";
import { updatePassword } from "reduxRelated/actions/userActions";
import { CRUDFunction } from "reduxCURD/container";
import { ButtonStyle } from "style/basic/commonControls";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors.js";
import { themeService } from "theme/service/activeTheme.service";
class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      passwordConfirm: "",
      submitButtonDisabled: false,

      resetSuccess: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleToLoginClick = this.handleToLoginClick.bind(this);
    // this.handlePasswordChange = this.handlePasswordChange.bind(this);
    // this.showToastInfo = this.showToastInfo.bind(this);
    // this.showToastError = this.showToastError.bind(this);
  }

  handleChange(e) {
    let eventName = e.target.name;
    let submitButtonDisabled = true;
    if (eventName === "passwordConfirm") {
      submitButtonDisabled = e.target.value === this.state.password ? false : submitButtonDisabled;
    }
    if (eventName === "password") {
      submitButtonDisabled = e.target.value === this.state.passwordConfirm ? false : submitButtonDisabled;
    }
    this.setState({
      [eventName]: e.target.value,
      submitButtonDisabled: submitButtonDisabled,
    });
  }

  handleSubmit() {
    let userId = this.props.userToResetPass ? this.props.userToResetPass._id : null;
    this.props.updatePassword(this.state.password, userId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.userActionType !== prevProps.userActionType && this.props.userActionType === "PASSWORD_UPDATE_SUCCESS") {
      this.setState({
        resetSuccess: true,
      });
    }
  }
  handleToLoginClick() {
    this.props.history.push("/login");
  }

  render() {
    const props = this.props;
    let loginButtonStyleWithState = { ...props.loginButtonStyle };
    if (this.state.submitButtonDisabled) {
      loginButtonStyleWithState.cursor = "not-allowed";
    }
    return (
      <div className="App-container">
        <div
          className="App-login"
          style={themeService({
            default: {},
            retro: {
              borderRadius: "0",
              backgroundColor: retroColors.nine,
              width: "520px",
              height: " 300px",
            },
            electric: {
              borderRadius: "0",
              backgroundColor: electricColors.nine,
              width: "520px",
              height: " 300px",
            },
          })}
        >
          <Container style={props.formContainerStyle}>
            <React.Fragment>
              <p style={{ ...props.loginTitleBar, color: retroColors.second }}>{languageService("Reset Password")}</p>
            </React.Fragment>
            {!this.state.resetSuccess && (
              <AvForm model={props.defaultValues} onValidSubmit={this.handleSubmit}>
                <Col>
                  <AvGroup>
                    <Label
                      style={themeService({
                        default: { ...props.formLabelStyle },
                        retro: { fontWeight: "bold", display: "inline-block", width: "20%", color: retroColors.second },
                        electric: { fontWeight: "bold", display: "inline-block", width: "20%", color: electricColors.second },
                      })}
                      for="examplePassword"
                    >
                      {languageService("Password")}
                    </Label>
                    <AvInput
                      required
                      type="password"
                      name="password"
                      id="txtPassword"
                      placeholder="********"
                      value={this.state.password}
                      onChange={this.handleChange}
                      style={themeService({
                        default: { fontSize: "12px" },
                        retro: {
                          width: "80%",
                          color: retroColors.second,
                          borderRadius: "0",
                          border: "1px solid" + retroColors.fourth,
                          display: "inline-block",
                        },
                        electric: {
                          width: "80%",
                          color: electricColors.second,
                          borderRadius: "0",
                          border: "1px solid" + electricColors.fourth,
                          display: "inline-block",
                        },
                      })}
                    />
                    <AvFeedback tooltip>{languageService("Password Required")}</AvFeedback>
                  </AvGroup>
                </Col>
                <Col>
                  <AvGroup>
                    <Label
                      style={themeService({
                        default: { ...props.formLabelStyle },
                        retro: { fontWeight: "bold", display: "inline-block", width: "20%", color: retroColors.second },
                        electric: { fontWeight: "bold", display: "inline-block", width: "20%", color: electricColors.second },
                      })}
                      for="examplePassword"
                    >
                      {languageService("Confirm Password")}
                    </Label>
                    <AvInput
                      required
                      type="password"
                      name="passwordConfirm"
                      id="confirmtxtPassword"
                      placeholder="********"
                      value={this.state.passwordConfirm}
                      onChange={this.handleChange}
                      style={themeService({
                        default: { fontSize: "12px" },
                        retro: {
                          width: "80%",
                          color: retroColors.second,
                          borderRadius: "0",
                          border: "1px solid" + retroColors.fourth,
                          display: "inline-block",
                        },
                        electric: {
                          width: "80%",
                          color: electricColors.second,
                          borderRadius: "0",
                          border: "1px solid" + electricColors.fourth,
                          display: "inline-block",
                        },
                      })}
                    />
                    <AvFeedback tooltip>{languageService("Password Required")}</AvFeedback>
                  </AvGroup>
                </Col>
                {this.state.submitButtonDisabled && (
                  <Col>
                    <span style={props.passwordMatchStyle}>{languageService("Password does not match")}</span>
                  </Col>
                )}
                <Col>
                  <FormGroup>
                    <div style={{ textAlign: "right" }}>
                      <Button
                        style={{
                          ...props.loginButtonStyle,
                          ...themeService(ButtonStyle.commonButton),
                          verticalAlign: "middle",
                          width: "auto",
                        }}
                        disabled={this.state.submitButtonDisabled}
                      >
                        {languageService("Submit")}
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
              </AvForm>
            )}
            {this.state.resetSuccess && (
              <React.Fragment>
                <Col>
                  <span style={props.passwordUpdatedStyle}>Password Updated Successfully</span>
                </Col>
                <Col>
                  <Button style={props.loginButtonStyle} onClick={this.handleToLoginClick}>
                    {languageService("To Login")}
                  </Button>
                </Col>
              </React.Fragment>
            )}
          </Container>
        </div>
      </div>
    );
  }
}

let variables = {
  forgotPasswordReducer: { userToResetPass: "" },
  userReducer: { actionType: "" },
};

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { updatePassword },
};
let ResetPasswordContainer = CRUDFunction(ResetPassword, " resetPassword", actionOptions, variables, [
  "forgotPasswordReducer",
  "userReducer",
]);

export default ResetPasswordContainer;

ResetPassword.defaultProps = {
  defaultValues: {
    chkRemember: true,
  },
  loginTitleBar: {
    fontfamily: "Arial",
    fontSize: "23px",
    color: "#B3B3B3",
    marginBottom: "15px",
    textAlign: "center",
    textTransform: "uppercase",
  },

  formLabelStyle: {
    fontFamily: "Arial",
    fontSize: "14px",
    letterSpacing: "0.35px",
    color: "#4D4D4D",
  },

  loginButtonStyle: {
    width: "100%",
    height: "40px",
    backgroundColor: "var(--first)",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontFamily: "Arial",
    fontSize: "14px",
    letterSpacing: "0.35px",
    color: "#FFFFFF",
  },

  formContainerStyle: {
    color: "var(--first)",
  },
  passwordMatchStyle: {
    fontSize: "12px",
    color: "red",
  },
  passwordUpdatedStyle: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--first)",
  },
  //forgotPassButtonStyle: ForgotPasswordButton
};
