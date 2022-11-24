import React, { Component } from "react";
import Radium from "radium";
import CommonTabsV2 from "components/Common/TabsV2/CommonTabs";
import { Col, Row } from "reactstrap";
import { languageService } from "Language/language.service";
import { TabWrapperStyle } from "./style/TabsWrapper";
import { themeService } from "theme/service/activeTheme.service";

import { retroColors, basicColors } from "../../../style/basic/basicColors";
class TabsWrapperV2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summaryColor: themeService(TabWrapperStyle.summaryColor).color,
      tabState: true,
    };
    this.handleColorClick = this.handleColorClick.bind(this);
  }

  handleColorClick(tab, color) {
    // console.log("hit", tab, color);
    //this.props.handleTabClick(tab);
    //this.setState({ summaryColor: color, displayName: tab });
  }
  render() {
    let tabsComp = null;
    //console.log(">>", );
    // let defaultElement= {
    //   children=
    // }
    // console.log(this.props.tabsArray);

    if (this.props.tabsArray) {
      let tabsCompObj = this.props.tabsArray.map((tab) => {
        //console.log(tab);
        //console.log("<<<<", this.props.assetTree[0]);
        // let trees = this.props.assetTree;
        // trees.forEach(tree => {
        //   console.log(tree);
        // });
        //console.log(tab.state);
        //let tabState = tab.state ? "active" : "";
        let tabObj = { value: tab.value, state: tab.state, id: tab.val };
        // if (tab == this.props.selectedTab) {
        //   tabObj.state = true;
        // } else {
        //   tabObj.state = false;
        // }
        return (
          <div className="common-wrapper" key={tab.val}>
            <CommonTabsV2
              tabValue={tabObj.value}
              tabState={tabObj.state}
              tabId={tabObj.id}
              handleTabClick={this.handleColorClick}
              handelParentClick={this.props.handelParentClick}
              index={tab.val}
              tab={tab}
              selectedTab={this.props.selectedTab}
              //summaryColor="rgb(255,255,255)"
              handleElementClick={this.props.handleElementClick}
              //tabStateClass={tabState}
              displayMenuAll={this.props.displayMenuAll}
            />
          </div>
        );
      });
      tabsComp = <div style={themeService(TabWrapperStyle.tabCompStyle)}> {tabsCompObj} </div>;
    }

    return (
      <div className={this.props.type + " tab-wraper"}>
        <div
          className={this.props.defaultMenuState ? "db-label" : "db-label off"}
          onClick={() => this.props.handleElementClick("All", "All", true)}
          style={{
            ...themeService(TabWrapperStyle.dbLabelStyle),
            ...themeService({
              default: {},
              retro: {
                paddingTop: this.props.defaultMenuState ? "10px" : "10px",
                borderBottom: this.props.defaultMenuState ? "3px solid " + retroColors.first : "3px solid " + retroColors.fourth,
              },
            }),
          }}
        >
          {languageService(this.props.defaultMenuItem)}
        </div>
        <div className="tabs-names">{tabsComp}</div>
        <div style={{ width: "100%" }}>
          <div className="line-tabs" style={{ background: this.state.summaryColor }}>
            <span style={themeService(TabWrapperStyle.barDisplayStyle)}>
              {this.props.displayName.all
                ? languageService("All")
                : this.props.displayName.multi
                ? languageService("Multiple")
                : languageService(this.props.displayName.name)}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default TabsWrapperV2;
