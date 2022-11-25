import React, { Component } from "react";
import { getAllowedSwitches } from "../../../../AssetTypeConfig/Reports/SwitchinspectionReport";
import { ReportGeneratorUtils } from "../../utils/reportGeneratorUtils";
import { switchReportStyle } from "../../Timps/Switch/style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import _ from "lodash";
import ReportTitleSection from "../../../../libraries/ReportGenerator/ReportTitleSection";
import ReportTableSectionRenderer from "../../../../libraries/ReportGenerator";
import { SFRTA_TracksRemovedFromServiceFormOReportSchema } from "./SFRTA_TracksRemovedFromServiceFormOReportSchema";

const ReportView = (props) => {
  let data = props.data ? props.data : {};

  let sectionsData = [{}, data, data.tbltes ? data.tbltes : [], [data]];

  return (
    <div id="mainContent" className="table-report" style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}>
      <span className="spacer"></span>
      <table className="table-bordered">
        {SFRTA_TracksRemovedFromServiceFormOReportSchema.sections.map((section, i) => {
          return <ReportTableSectionRenderer section={section} rowsData={sectionsData[i]} />;
        })}
      </table>
    </div>
  );
};

const SFRTA_TracksRemovedFromServiceFormOReport = (props) => <ReportView {...props} />

export default SFRTA_TracksRemovedFromServiceFormOReport;
