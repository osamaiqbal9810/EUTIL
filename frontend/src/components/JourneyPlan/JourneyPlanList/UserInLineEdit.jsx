/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { userVal } from "./variables.js";
import FormFields from "wigets/forms/formFields";
import "./inlineEditField.css";
import SvgIcon from "react-icons-kit";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import _ from "lodash";
class UserInLineEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userVal: _.cloneDeep(userVal),
    };
  }
  componentDidMount() {
    let { userVal } = this.state;
    if (userVal.inspector.config.options.length <= 0) {
      if (this.props.userList && this.props.userList.length > 0) {
        userVal.inspector.config.options = this.props.userList.map(user => ({ val: user._id, text: user.name }));
        // userVal.inspector.value = this.props.inspection.user.id;
        userVal.inspector.valid = true;
      }
    }
    if (this.props.inspection.user) {
      userVal.inspector.value = this.props.inspection.user._id;
    } else {
      userVal.inspector.value = this.props.inspection.user._id;
    }
    
    this.updateFrom({ userVal });
  }

  updateFrom = newState => {this.setState({ ...newState })};
  render() {
    return (
      <div>
        <div className="inlineEditField" style={{ display: "inline-block", zIndex: "1", position: "relative", width: "100%" }}>
          <FormFields userVal={this.state.userVal} fieldTitle={"userVal"} change={this.updateFrom} />
          {/* {this.props.inspection.user.name} */}
        </div>
        <div style={{ display: "inline-block", marginLeft: "-40px" }}>
          <div style={{ color: "inherit" }}>
            <SvgIcon
              size={15}
              icon={checkmark}
              onClick={e => {
                this.props.changeUserAndUpdate
                  ? this.props.changeUserAndUpdate(this.state.userVal.inspector.value, this.props.inspection)
                  : {};
              }}
              style={{
                marginRight: "5px",
                marginLeft: "5px",
                verticalAlign: "middle",
                cursor: "pointer",
                zIndex: "10",
                position: "relative",
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default UserInLineEdit;
