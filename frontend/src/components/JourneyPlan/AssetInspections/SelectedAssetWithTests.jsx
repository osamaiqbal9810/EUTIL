import React, { Component } from "react";
import propTypes from "prop-types";
class SelectedAssetWithTests extends Component {
  render() {
    return (
      <React.Fragment>
        <div
          style={{
            display: "inline-block",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            borderBottom: "2px solid rgba(64, 118, 179)",
          }}
          onClick={this.props.selectedAsset.title ? this.props.openModal : ""}
        >
          {" "}
          <div className="db-label"> {this.props.selectedAsset.title ? this.props.selectedAsset.title : "No Assets"}</div>
        </div>
        {this.props.selectedAsset.title ? (
          <div
            style={{
              display: "inline-block",
            }}
          >
            <AssetTestsArea
              assetTests={this.props.assetTests}
              handleSelectTest={this.props.handleSelectTest}
              multi={this.props.multiTestSelection}
            />
          </div>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

export default SelectedAssetWithTests;

const AssetTestsArea = (props) => {
  let assetTests = null;
  if (props.assetTests) {
    assetTests = props.assetTests.map((assetTest, index) => {
      return (
        <div
          style={{
            display: "inline-block",
            fontSize: "14px",
            padding: "8px 8px 4px 10px ",
            borderBottom: "2px solid rgba(64, 118, 179)",
          }}
          onClick={(e) => {
            props.handleSelectTest(assetTest, props.multi);
          }}
        >
          {index > 0 && <span style={{ color: "rgba(64, 118, 179)", fontWeight: "600" }}>&#92;</span>} {assetTest.title}
        </div>
      );
    });
  }
  return assetTests;
};

SelectedAssetWithTests.propTypes = {
  handleSelectTest: propTypes.func.isRequired,
};
