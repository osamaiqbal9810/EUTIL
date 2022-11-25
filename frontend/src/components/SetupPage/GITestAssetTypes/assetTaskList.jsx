import React from "react";
import { GITestStyle } from "./style/GITestStyle";
import { themeService } from "../../../theme/service/activeTheme.service";
import { minus } from "react-icons-kit/icomoon/minus";
import { pencil } from "react-icons-kit/icomoon/pencil";
import SvgIcon from "react-icons-kit";
import permissionCheck from "../../../utils/permissionCheck";
import _ from "lodash";
class AssetTaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let testTypes = this.props.testTypes.map((item, i) => {
      let config =
        this.props.selectedAssetType && item.opt2 && _.find(item.opt2.config, { assetType: this.props.selectedAssetType.assetType });

      return (
        <li key={item._id} style={themeService(GITestStyle.assetListStyle)}>
          {
            <React.Fragment>
              <span
                style={{ width: "90%", display: "inline-block" }}
                onClick={(e) => {
                  permissionCheck("ASSET", "update") && this.props.handleEditClick(item);
                }}
              >
                {config ? config.name + " ( " + item.description + " )" : item.description}
              </span>
              <span
                onClick={(e) => {
                  permissionCheck("ASSET", "update") && this.props.handleEditClick(item);
                }}
              >
                {permissionCheck("ASSET", "update") && <SvgIcon icon={pencil} size={20} style={{ marginLeft: "10px" }} />}
              </span>
            </React.Fragment>
          }
          {permissionCheck("ASSET", "delete") && (
            <span style={themeService(GITestStyle.iconPlus)}>
              <SvgIcon
                onClick={() => {
                  this.props.handleDeleteClick(item);
                }}
                icon={minus}
                size={20}
              />
            </span>
          )}
        </li>
      );
    });
    return (
      <ul className="asset-list" style={{ paddingInline: "0" }}>
        {testTypes}
      </ul>
    );
  }
}

export default AssetTaskList;
