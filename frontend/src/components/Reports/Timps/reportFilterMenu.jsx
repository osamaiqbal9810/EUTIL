import React from "react";
import { languageService } from "../../../Language/language.service";
import { trackReportStyle } from "./style/index";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors.js";

class ReportFilterMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    let menu = this.props.reports.map((report, i) => {
      return (
        <li
          key={i}
          onClick={() => this.props.handelTabsClick(report.name)}
          className={report.active ? "active" : ""}
          style={{ borderColor: report.active ? retroColors.first : retroColors.seventh }}
        >
          <span className="menu-tab">{languageService(report.title)}</span>
        </li>
      );
    });

    return (
      <React.Fragment>
        <ul className="menu-tabs">{menu}</ul>
      </React.Fragment>
    );
  }
}

export default ReportFilterMenu;
