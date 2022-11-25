import React, { Component } from "react";
import Radium from "radium";
import CommonTabs from "components/Common/Tabs/CommonTabs";
import { themeService } from "../../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
class TabsWrapper extends Component {
  render() {
    let tabsComp = null;
    if (this.props.tabsArray) {
      let tabsCompObj = this.props.tabsArray.map((tab, index) => {
        let tabObj = { value: tab, state: false };
        if (tab == this.props.selectedTab) {
          tabObj.state = true;
        } else {
          tabObj.state = false;
        }
        return (
          <div style={{ display: "inline-block" }} key={tab + index}>
            <CommonTabs tabValue={tabObj.value} tabState={tabObj.state} handleTabClick={(e) => this.props.handleTabClick(tab, index)} />
          </div>
        );
      });
      tabsComp = (
        <div
          style={themeService({
            default: { backgroundColor: "#e3e9ef", borderRadius: "30px", width: "fit-content", marginBottom: "20px" },
            retro: { backgroundColor: retroColors.four, borderRadius: "0px", width: "fit-content", marginBottom: "20px" },
            electric: { backgroundColor: electricColors.four, borderRadius: "0px", width: "fit-content", marginBottom: "20px" },
          })}
        >
          {" "}
          {tabsCompObj}{" "}
        </div>
      );
    }

    return <div>{tabsComp} </div>;
  }
}

export default TabsWrapper;
