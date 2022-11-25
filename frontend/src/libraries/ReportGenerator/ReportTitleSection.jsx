import React from "react";
import { switchReportStyle } from "../../components/Reports/Timps/Switch/style/index";
import { themeService } from "../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../components/Reports/variables";
import { Row, Col } from "reactstrap";
import { trackReportStyle } from "../../components/Reports/Timps/style";
import _ from "lodash";

const ReportTitleSection = (props) => {
  let { title, hideLogo, displayRevisedAreaText } = props;
  return (
    <div className={`report-title-flex-container ${displayRevisedAreaText ? 'revised' : ''}`}>
      {hideLogo ? null : <div className="report-title-logo">
        <span>
          <img src={themeService(iconToShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
        </span>
      </div>}
      <div className="report-title-value">
        <h2 style={_.merge({ ...themeService(switchReportStyle.headingStyle), transform: "translateX(-21px)" }, { fontSize: "23px" })}>
          {title}
        </h2>
      </div>
      {displayRevisedAreaText ? <div className="report-title-revised-area">
        {displayRevisedAreaText}
      </div> : null}
    </div>
  );
};

export default ReportTitleSection;
