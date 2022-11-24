import React from "react";
import { GITestStyle } from "./style/GITestStyle";
import { themeService } from "../../../theme/service/activeTheme.service";
import { retroColors } from "../../../style/basic/basicColors";

class AssetTypesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let selectedAssetType = this.props.selectedAssetType;
    let assetList =
      this.props.assetsTypes &&
      this.props.assetsTypes.map((item, i) => {
        let additionalStyle = selectedAssetType && item._id == selectedAssetType._id ? { background: retroColors.first } : {};
        return (
          <li
            key={item._id}
            style={{ ...themeService(GITestStyle.assetListStyle), ...additionalStyle }}
            onClick={e => {
              this.props.handleAssetTypeSelected(item);
            }}
          >
            <span className="item-cell">{item.assetType}</span>
          </li>
        );
      });
    return (
      <ul className="asset-list" style={{ paddingInline: "0" }}>
        {assetList}
      </ul>
    );
  }
}

export default AssetTypesList;
