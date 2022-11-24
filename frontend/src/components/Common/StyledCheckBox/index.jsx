import React from "react";
import "./style.css";
class StyledCheckBox extends React.Component {
  render() {
    const {chkLabel, ...otherProps} = this.props;
    return (
        <div className="styled-chk-box" style={{ position: "relative", minHeight: "50px" }}>
        <input {...otherProps} className="chk" type="checkbox" />
        <label onClick={this.props.onClick} htmlFor="chk">{chkLabel}</label>
      </div>
    );
  }
}

export default StyledCheckBox;
