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
            borderBottom: "2px solid var(--first)",
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
            padding: "8px 8px 4px 0px ",
            borderBottom: "2px solid var(--first)",
            cursor: "pointer",
          }}
          onClick={(e) => {
            props.handleSelectTest(assetTest, props.multi);
          }}
          className={assetTest.showTestExecs ? "pill active" : "pill"}
        >
          {index > 0 && (
            <span
              style={{
                color: "var(--first)",
                fontWeight: "600",
                marginRight: "10px",
                fontSize: "40px",
                lineHeight: "0",
                verticalAlign: "middle",
              }}
            >
              &#92;
            </span>
          )}{" "}
          {assetTest.title}
        </div>
      );
    });
  }
  return assetTests;
};

SelectedAssetWithTests.propTypes = {
  handleSelectTest: propTypes.func.isRequired,
};
