import React from "react";
import ChkBox from "../../components/Common/StyledCheckBox/index";
let labelStyle = {
  float: "left",
  fontFamily: "Myriad Pro",
  fontSize: "24px",
  letterSpacing: "0.5px",
  color: "var(--first)",
};
class AssetsNotFound extends React.Component {
  render() {
    return (
      <div style={{ margin: "0px 30px 0 45px" }}>
        <div className="row" style={{ borderBottom: "2px solid rgb(209, 209, 209)", padding: "10px 0px" }}>
          <div className="col-md-3" style={{ paddingLeft: "0px" }}>
            <h4 style={labelStyle}>No {this.props.AssetName} Found</h4>
          </div>
        </div>
        <div
          className="row"
          style={{ textTransform: "uppercase", width: "70%", lineHeight: "26px", marginTop: "15px", color: "var(--first)" }}
        >
          No {this.props.AssetName} found kindly contact Administrator
        </div>
        {/* <ChkBox chkLabel="welcome" /> */}
      </div>
    );
  }
}

export default AssetsNotFound;
