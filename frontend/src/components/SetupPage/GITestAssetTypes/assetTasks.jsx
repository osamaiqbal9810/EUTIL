import React from "react";
import { GITestStyle } from "./style/GITestStyle";
import { themeService } from "../../../theme/service/activeTheme.service";
import AssetTaskList from "./assetTaskList";
import { plus } from "react-icons-kit/icomoon/plus";
import SvgIcon from "react-icons-kit";
import { languageService } from "../../../Language/language.service";
import permissionCheck from "../../../utils/permissionCheck";

const AssetTasks = (props) => {
  return (
    <div className="card" style={{ margin: " 0 0 10px 10px" }}>
      <div className="card-header" style={themeService(GITestStyle.cardBodyHeader)}>
        {languageService("Tests")}
        {permissionCheck("ASSET", "update") && (
          <span style={themeService(GITestStyle.iconPlus)} onClick={props.onAddTestClick}>
            <SvgIcon icon={plus} size={20} />
          </span>
        )}
      </div>
      <div className="card-body scrollbar" style={themeService(GITestStyle.cardBodyHeight)}>
        {props.children}
      </div>
    </div>
  );
};
export default AssetTasks;
