import React, { Component } from "react";
import { CRUDFunction } from "../../reduxCURD/container";

class AssetTests extends Component {
  componentDidMount() {}

  render() {
    return <div></div>;
  }
}
const AssetTestContainer = CRUDFunction(AssetTests, "assetTest");
export default AssetTestContainer;
