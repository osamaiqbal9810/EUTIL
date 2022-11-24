import React, { Component } from "react";
import { UserCreateProfileViewAvatar } from "./UserCreateProfileView.jsx";
import { UserPrmissionView, UserProfileViewTitleBar } from "../UserProfile/UserProfileView.jsx";
import { Row, Col, Button, Checkbox, FormGroup, ControlLabel, FormControl, Modal } from "react-strap";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from "react-form-with-constraints";
import { UserProfileHeaderIcon } from "../../../images/imageIcons/index.js";
import _ from "lodash";
import * as types from "../../../reduxRelated/ActionTypes/actionTypes.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingOverlay, Loader } from "react-overlay-loader";
import NumberFormat from "react-number-format";

import "react-overlay-loader/styles.css";
import { languageService } from "../../../../Language/language.service.js";
class UserCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      address: "",
      phone: "",
      mobile: "",
      submitButtonDisabled: true,
      permisssionsAvailable: [],
      permissionsAssigned: [],
      showModal: false,
      modalMsg: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleMobileChange = this.handleMobileChange.bind(this);
  }

  componentDidMount() {
    const { permissionList } = this.props;
    if (permissionList.length == 0) {
      this.props.getPermissionList();
    } else {
      this.setState({
        permisssionsAvailable: permissionList,
      });
    }
  }

  handlePhoneChange(e) {
    if (e.value !== "") {
      if (e.value.length == 10 && this.state.mobile.replace("_", "").length == 17) {
        this.setState({ submitButtonDisabled: false });
      } else {
        if (!this.state.submitButtonDisabled) {
          this.setState({ submitButtonDisabled: true });
        }
      }
    } else this.setState({ submitButtonDisabled: false });
    this.setState({ phone: e.formattedValue });
  }

  handleMobileChange(e) {
    if (e.value.length == 10 && (this.state.phone == "" || this.state.phone.replace("_", "").length == 17)) {
      this.setState({ submitButtonDisabled: false });
    } else {
      if (!this.state.submitButtonDisabled) {
        this.setState({ submitButtonDisabled: true });
      }
    }
    this.setState({ mobile: e.formattedValue });
  }
  handleChange(e) {
    const target = e.currentTarget;

    this.form.validateFields(target);

    this.setState({
      [target.name]: target.value,
      submitButtonDisabled: !this.form.isValid(),
    });
    if (this.state.mobile.replace("_", "").length == 17 && (this.state.phone == "" || this.state.phone.replace("_", "").length == 17)) {
      this.setState({ submitButtonDisabled: false });
    } else this.setState({ submitButtonDisabled: true });
  }

  handlePasswordChange(e) {
    this.form.validateFields("passwordConfirm");

    this.handleChange(e);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.form.validateFields();
    let mobPattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/m; ///\d{3}-\d{3}-\d{4}/;
    let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailPattern.test(this.state.email)) {
      this.setState({
        showModal: true,
        modalMsg: "Please Enter Email Address in correct format: example@zoneguard.com",
      });
    } /*else if(this.state.mobile==''){
         this.setState({
         showModal: true,
         modalMsg: "Please Enter Email Address in correct format: example@zoneguard.com"
         });
         }*/ else {
    /*else if (this.state.phone !== '' && !mobPattern.test(this.state.phone)) {
         this.setState({showModal: true, modalMsg: "Please Enter Phone Number in correct US Domestic format:" +
         "<br/> Such as:<br/>(541) 754-3010 <br/> 541-754-3010<br/>(541).754.3010<br/>(541) 754 3010"});
         } else if (!mobPattern.test(this.state.mobile)) {
         this.setState({showModal: true, modalMsg: "Please Enter Mobile Number in correct US Domestic format:" +
         "<br/> Such as:<br/>(541) 754-3010 <br/> 541-754-3010<br/>(541).754.3010<br/>(541) 754 3010"});
         } */
      this.setState({ submitButtonDisabled: !this.form.isValid() });

      if (this.form.isValid()) {
        //  console.log("Submited")
        const user = {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          address: this.state.address,
          phone: this.state.phone,
          mobile: this.state.mobile,
          permissions: this.state.permissionsAssigned,
        };
        this.props.createUser(user);
      }
    }
  }

  AddPermission(permission) {
    //  console.log("Add This Permission : " + permission);
    const permissionList = this.state.permisssionsAvailable;
    const permissionListAssigned = this.state.permissionsAssigned;
    let availablePermissionList = [...permissionList];
    let assignedPermissionList = [...permissionListAssigned];

    assignedPermissionList.push(permission);
    _.remove(availablePermissionList, function (element) {
      return element.value == permission.value;
    });
    this.setState({
      permisssionsAvailable: availablePermissionList,
      permissionsAssigned: assignedPermissionList,
    });
  }

  RemovePermission(permission) {
    //    console.log("Remove This Permission : " + permission);
    const permissionList = this.state.permisssionsAvailable;
    const permissionListAssigned = this.state.permissionsAssigned;
    let availablePermissionList = [...permissionList];
    let assignedPermissionList = [...permissionListAssigned];

    availablePermissionList.push(permission);
    _.remove(assignedPermissionList, function (element) {
      return element.value == permission.value;
    });
    this.setState({
      permisssionsAvailable: availablePermissionList,
      permissionsAssigned: assignedPermissionList,
    });
  }

  showToastInfo(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  showToastError(message, error) {
    toast.error(message + ": " + error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  componentWillReceiveProps(nextProps) {
    //Handled User Create Responses
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_CREATE_SUCCESS) {
      //this.showToastInfo("User Successfully Created !");
      let reinit = "";
      this.setState({
        name: reinit,
        email: reinit,
        password: reinit,
        passwordConfirm: reinit,
        address: reinit,
        phone: reinit,
        mobile: reinit,
        permissions: reinit,
      });
      //this.showToastInfo("User Created Successfully !");
    }
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_CREATE_FAILURE) {
      //this.showToastError("Failed to Create User !", nextProps.errorMessage);
    }
  }

  render() {
    return (
      <Row>
        {/*<ToastContainer />*/}
        {this.state.showModal && (
          <div className="static-modal">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Validation Error</Modal.Title>
              </Modal.Header>

              <Modal.Body>{this.state.modalMsg}</Modal.Body>

              <Modal.Footer>
                <Button
                  bsStyle="warning"
                  onClick={() => {
                    this.setState({ showModal: false });
                  }}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>
        )}
        <Col md={12} className="scrollbar" style={{ overflowY: "auto", height: this.props.heightScroll }}>
          <Row>
            <UserProfileViewTitleBar profileTitlebarImg={UserProfileHeaderIcon} titleName="Add New User" />
          </Row>
          <Row>
            <UserCreateProfileViewAvatar />
          </Row>
          <Row className="row-eq-height">
            <Col mdOffset={2} md={8}>
              <FormWithConstraints ref={(formWithConstraints) => (this.form = formWithConstraints)} onSubmit={this.handleSubmit} noValidate>
                <FormGroup>
                  <label htmlFor="name">{languageService("Name")}</label>
                  <FormControl
                    type="name"
                    name="name"
                    id="name"
                    placeholder="Full Name "
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="email">{languageService("Email")}</label>
                  <FormControl
                    type="email"
                    name="email"
                    id="email"
                    placeholder="e.g: user@serviceprovider.com"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                    minLength={3}
                  />
                  <FieldFeedbacks for="email" show="all">
                    <FieldFeedback when="valueMissing" />
                    {/*<FieldFeedback style={{color: 'red'}}
                                                       when={value => !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
                                         } warning>Format: example@zoneguard.com</FieldFeedback>*/}
                  </FieldFeedbacks>
                  <FieldFeedbacks for="email">
                    <FieldFeedback when="*" />
                  </FieldFeedbacks>
                </FormGroup>

                <FormGroup>
                  <label htmlFor="password">{languageService("Password")}</label>
                  <FormControl
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Minimum Six digit Password"
                    ref={(password) => (this.password = password)}
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                    required
                    pattern=".{5,}"
                  />
                  <FieldFeedbacks for="password" show="all">
                    <FieldFeedback when="valueMissing" />
                    <FieldFeedback when="patternMismatch">{languageService("Should be at least 6 characters long")}</FieldFeedback>
                  </FieldFeedbacks>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="password-confirm">{languageService("Confirm Password")}</label>
                  <FormControl
                    type="password"
                    name="passwordConfirm"
                    id="password-confirm"
                    placeholder="Should be same as password"
                    value={this.state.passwordConfirm}
                    onChange={this.handleChange}
                  />
                  <FieldFeedbacks for="passwordConfirm">
                    <FieldFeedback when={(value) => value !== this.state.password}>
                      {languageService("Not the same password")}
                    </FieldFeedback>
                  </FieldFeedbacks>
                </FormGroup>

                <FormGroup>
                  <label htmlFor="address">{languageService("Address (Optional)")}</label>
                  <FormControl
                    type="address"
                    name="address"
                    id="address"
                    componentClass="textarea"
                    style={{ resize: "none " }}
                    placeholder="Complete Address of User"
                    value={this.state.address}
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="phone">{languageService("Phone (Optional)")}</label>
                  <NumberFormat
                    className="form-control"
                    name="phone"
                    id="phone"
                    placeholder="Phone Number"
                    value={this.state.phone}
                    onValueChange={this.handlePhoneChange}
                    format="+1 (###) ###-####"
                    mask="_"
                  />
                  {/*<FieldFeedbacks for="phone" show="all">
                                        <FieldFeedback when="valueMissing"/>
                                        <FieldFeedback style={{color: 'red'}} when={value => {
                                            if (value !== '' && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
                                                return true
                                            } else return false
                                        }} warning>Format: 123-456-7890</FieldFeedback>
                                     /!*<FieldFeedback when={value => !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)} warning>Should be at least valid Number</FieldFeedback>*!/
                                     </FieldFeedbacks>*/}
                </FormGroup>
                <FormGroup>
                  <label htmlFor="mobile">{languageService("Mobile Phone")}</label>
                  <NumberFormat
                    className="form-control"
                    name="mobile"
                    id="mobile"
                    placeholder="Mobile Number"
                    required
                    value={this.state.mobile}
                    onValueChange={this.handleMobileChange}
                    format="+1 (###) ###-####"
                    mask="_"
                  />
                  <FieldFeedbacks for="mobile" show="all">
                    <FieldFeedback when="valueMissing" />
                  </FieldFeedbacks>
                  {/*<FieldFeedbacks for="mobile" show="all">
                                     <FieldFeedback when="valueMissing"/>
                                     <FieldFeedback style={{color: 'red'}}
                                     when={value => !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)}
                                     warning>Domestic Format: 541-754-3010 or (541) 754-3010</FieldFeedback>
                                     </FieldFeedbacks>*/}
                </FormGroup>
                <Button
                  className="custom-button-theme-1"
                  style={{ marginBottom: "20px" }}
                  disabled={this.state.submitButtonDisabled}
                  onClick={this.handleSubmit}
                >
                  {languageService("Add User")}
                </Button>
              </FormWithConstraints>
            </Col>
            {/* <Col md={5}>
                            <UserPrmissionView
                                availAblePermissions={this.state.permisssionsAvailable}
                                assignedPermissions={this.state.permissionsAssigned}
                                handleAddPermission={this.AddPermission}
                                handleRemovePermission={this.RemovePermission}

                            />
                        </Col> */}
          </Row>
        </Col>
      </Row>
    );
  }
}

export default UserCreate;
