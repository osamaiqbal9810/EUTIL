import React from "react";
import { GITestStyle } from "./style/GITestStyle";
import { themeService } from "../../../theme/service/activeTheme.service";
import { languageService } from "../../../Language/language.service";

const AssetTypes = props => {
  return (
    <div className="card" style={{ margin: " 0 0 10px 10px" }}>
      <div className="card-header " style={themeService(GITestStyle.cardBodyHeader)}>
        {languageService("Asset Type")}
      </div>
      <div className="card-body scrollbar" style={themeService(GITestStyle.cardBodyHeight)}>
        {props.children}
      </div>
    </div>
  );
};
export default AssetTypes;
