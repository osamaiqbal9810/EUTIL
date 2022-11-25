import React, { Component } from "react";
import { languageService } from "Language/language.service";
import { Container, Col, Label, Button, FormGroup } from "reactstrap";
import { AvForm, AvInput, AvFeedback, AvGroup } from "availity-reactstrap-validation";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { sendEmailForPasswordReset } from "reduxRelated/actions/forgotPassword.js";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors.js";
import { themeService } from "theme/service/activeTheme.service";
import { toast } from "react-toastify";
import * as types from "../../../reduxRelated/ActionTypes/actionTypes";
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
    this.submitHandle = this.submitHandle.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  onInputChange(e) {
    this.setState({
      email: e.target.value,
    });
  }
  submitHandle() {
    this.props.sendEmailForPasswordReset(this.state.email);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.forgotPasswordActionType !== prevProps.forgotPasswordActionType &&
      this.props.forgotPasswordActionType === "EMAIL_RESET_PASSWORD_FAILURE"
    ) {
      toast.error(languageService(this.props.forgotPasswordErrorMessage));
    }

    if (
      this.props.forgotPasswordActionType !== prevProps.forgotPasswordActionType &&
      this.props.forgotPasswordActionType === "EMAIL_RESET_PASSWORD_SUCCESS"
    ) {
      toast.success(languageService("Email sent, please check your email"));
    }
  }

  render() {
    const props = this.props;
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
            <div>
              <p style={{ ...props.loginTitleBar, color: retroColors.second }}>{languageService("Forgot Password")}</p>
            </div>
            <AvForm model={props.defaultValues} onValidSubmit={this.submitHandle}>
              <Col>
                <AvGroup>
                  <Label
                    style={themeService({
                      default: { ...props.formLabelStyle },
                      retro: { fontWeight: "bold", display: "inline-block", width: "20%", color: retroColors.second },
                      electric: { fontWeight: "bold", display: "inline-block", width: "20%", color: electricColors.second },
                    })}
                  >
                    {languageService("Email")}
                  </Label>
                  <AvInput
                    required
                    type="email"
                    name="email"
                    id="txtEmail"
                    placeholder="myemail@email.com"
                    value={this.state.email}
                    onChange={this.onInputChange}
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
                  <AvFeedback tooltip>{languageService("Please enter valid email address")}</AvFeedback>
                </AvGroup>
              </Col>
              <Col>
                <FormGroup>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ textAlign: "right", display: "inline-block", marginRight: "5px" }}>
                      <Button
                        style={{
                          ...props.loginButtonStyle,
                          ...themeService(ButtonStyle.commonButton),
                          verticalAlign: "middle",
                          width: "auto",
                          display: "inline-block",
                        }}
                      >
                        {languageService("Submit")}
                      </Button>
                    </div>
                    <div style={{ textAlign: "right", display: "inline-block" }}>
                      <Button
                        style={{
                          ...props.loginButtonStyle,
                          ...themeService(ButtonStyle.commonButton),
                          verticalAlign: "middle",
                          width: "auto",
                        }}
                        onClick={() => this.props.history.push("/login")}
                      >
                        {languageService("Cancel")}
                      </Button>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            </AvForm>
          </Container>
        </div>
      </div>
    );
  }
}

let variables = {
  forgotPasswordReducer: { userToResetPass: "" },
};

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { sendEmailForPasswordReset },
};
let ForgotPasswordContainer = CRUDFunction(ForgotPassword, "frgotPassEmailSend", actionOptions, variables, ["forgotPasswordReducer"]);

export default ForgotPasswordContainer;

ForgotPassword.defaultProps = {
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
  //forgotPassButtonStyle: ForgotPasswordButton
};
