import React from "react";
import LoginView from "./LoginView.js";
import { Row } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as types from "../../reduxRelated/ActionTypes/actionTypes.js";
import { languageService } from "../../Language/language.service.js";
//import PropTypes from 'prop-types';
import { themeService } from "theme/service/activeTheme.service";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { basicColors, retroColors, electricColors } from "../../style/basic/basicColors.js";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        email: "",
        password: "",
      },
      captchaResponse: "",
      captchaLoaded: false,
    };
    this.InputChangeHandler = this.InputChangeHandler.bind(this);
    this.SubmitButtonHandler = this.SubmitButtonHandler.bind(this);
    this.forgotPasswordHandle = this.forgotPasswordHandle.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.onCaptchaExpired = this.onCaptchaExpired.bind(this);
    this.onCaptchaLoad = this.onCaptchaLoad.bind(this);
    this.onCaptchaVerification = this.onCaptchaVerification.bind(this);
  }
  onCaptchaVerification(response) {
    this.setState({ captchaResponse: response });
  }
  onCaptchaExpired() {
    this.setState({ captchaResponse: "" });
  }
  onCaptchaLoad() {
    this.setState({ captchaLoaded: true });
  }
  InputChangeHandler(e) {
    let typeOfInput = e.target.name;
    let inputValueChanged = e.target.value;
    let user = this.state.user;
    let CopyOfuser = { ...user };

    if (typeOfInput === "email") {
      CopyOfuser.email = inputValueChanged;
      this.setState({
        user: CopyOfuser,
      });
    } else if (typeOfInput === "password") {
      CopyOfuser.password = inputValueChanged;
      this.setState({
        user: CopyOfuser,
      });
    }
  }

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      this.SubmitButtonHandler();
    }
  };
  SubmitButtonHandler() {
    //  console.log("Submit Button hit");
    //  this.showToastInfo("Submit Button Clicked!");
    /*  const  {captchaResponse,captchaLoaded} = this.state;
      if(!captchaLoaded){
          this.showToastError("reCAPTCHA Verification",new Error("You need to verify reCAPTCHA!"));
          return ;
      }
      if(captchaResponse===""){
        this.showToastError("reCAPTCHA Verification",new Error("Please click on reCAPTCHA! 'I'm not a robot"));
        return ;
      }*/
    let user = this.state.user;
    if (this.state.user.email !== "" && this.state.user.password !== "") {
      //  console.log(user);
      this.props.onLoginClick(user);
    }
  }

  forgotPasswordHandle() {
    this.props.history.push("/forgotPassword");
  }

  showToastInfo(message) {
    toast.warn(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  showToastError(message, error) {
    toast.error(message + ": " + error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  componentDidMount() {
    let loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      this.props.history.push("/");
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("permissions");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType === types.LOGIN_SUCCESS) {
      if (localStorage.getItem("loggedInUser")) {
        this.props.history.push("/");
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("permissions");
        this.showToastError(languageService("Retry"), languageService("Problem connecting to server"));
        this.props.history.push("/login");
      }
    }
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType === types.LOGIN_FAILURE) {
      // console.log(nextProps.errorMessage)
      // alert('sdfsdfsdfsdfsdfsdf')
      if (nextProps.errorMessage.status) {
        this.showToastError(languageService('Error'), languageService(nextProps.errorMessage.message))
      } else {
        this.showToastError(languageService('Retry'), languageService('Server is not accessible, Please retry in few seconds...'))
      }

    }
  }

  render() {
    return (
      <div className="App-container">
        <div className="App-login" style={themeService({
          default: {}, retro: {
            borderRadius: "0", backgroundColor: retroColors.nine, width: "520px",
            height: " 300px"
          }, electric: {
            borderRadius: "0", backgroundColor: electricColors.nine, width: "520px",
            height: " 300px"
          }
        })}>
          <Row>
            <LoginView
              isFetching={this.props.isFetching}
              onInputChange={this.InputChangeHandler}
              submitHandle={this.SubmitButtonHandler}
              inputValue={this.state.user}
              onKeyPress={this._handleKeyPress}
              clickForgotPasswordHandle={this.forgotPasswordHandle}
              recaptchaCallbacks={{
                verifyCallback: this.onCaptchaVerification,
                onloadCallback: this.onCaptchaLoad,
                expiredCallback: this.onCaptchaExpired,
              }}
            />
          </Row>
        </div>
      </div>
    );
  }
}

export default LoginPage;
