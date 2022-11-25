import React, { Component } from "react";
import { CRUDFunction } from "reduxCURD/container";
import { sendUrlToServer } from "reduxRelated/actions/forgotPassword.js";
import { Container } from "reactstrap";
class VerifyResetPass extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let urlVerify = this.props.match && this.props.match.params && this.props.match.params.id ? this.props.match.params.id : null;
    this.props.sendUrlToServer(urlVerify);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.forgotPasswordActionType == "VERIFY_URL_SUCCESS" &&
      this.props.forgotPasswordActionType !== prevProps.forgotPasswordActionType
    ) {
      this.props.history.push("/resetPassword");
    }
  }
  render() {
    return (
      <div className="App-container">
        <div style={this.props.verifyContainerStyle}>
          <Container style={this.props.formContainerStyle}> Please Wait While Reset Password Request In Progress </Container>
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
  others: { sendUrlToServer },
};
let VerifyResetPassContainer = CRUDFunction(VerifyResetPass, "verifyResetPass", actionOptions, variables, ["forgotPasswordReducer"]);

export default VerifyResetPassContainer;

VerifyResetPass.defaultProps = {
  verifyContainerStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    WebkitTransform: " translate(-50%, -50%)",
    transform: "translate(-50%, -50%)",
  },
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
    fontSize: "12px",
    fontWeight: 600,
  },
  //forgotPassButtonStyle: ForgotPasswordButton
};
