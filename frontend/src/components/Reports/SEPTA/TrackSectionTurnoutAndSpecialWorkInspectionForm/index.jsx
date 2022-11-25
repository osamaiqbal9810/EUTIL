import React, { Component, Fragment } from "react";
import { getAllowedSwitches } from "../../../../AssetTypeConfig/Reports/SwitchinspectionReport";
import { ReportGeneratorUtils } from "../../utils/reportGeneratorUtils";
import { switchReportStyle } from "../../Timps/Switch/style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import _ from "lodash";
import ReportTitleSection from "../../../../libraries/ReportGenerator/ReportTitleSection";
import ReportTableSectionRenderer from "../../../../libraries/ReportGenerator";
import { SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionReportSchema } from "./SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionReportSchema";
import SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionReportInstructions from "./SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionReportInstructions";

const ReportView = (props) => {
  let { reportData } = props;
  let rowsData = reportData && reportData.assets && Array.isArray(reportData.assets) ? reportData.assets : [];

  return (
    <Fragment>
      <div id="mainContent" className="table-report" style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}>
        <ReportTitleSection title="SUBWAY / LIGHT RAIL TRACK SECTION TURNOUT AND SPECIAL WORK INSPECTION FORM" {...props} />

        <span className="spacer"></span>
        <table className="table-bordered">
          {SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionReportSchema.sections.map((section) => {
            return <ReportTableSectionRenderer section={section} rowsData={rowsData} />;
          })}
        </table>
      </div>
      <SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionReportInstructions />
    </Fragment>
  );
};

const SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionForm = (props) => {
  const { inspec } = props;
  return (
    <ReportView
      {...props}
      reportData={{
        assets: ReportGeneratorUtils.getInspectionAssetsWithForm(inspec, getAllowedSwitches, "nopbSwitchForm"),
        location: ReportGeneratorUtils.getInspectionLocation(inspec),
        date: ReportGeneratorUtils.getInspectionDate(inspec),
        user: ReportGeneratorUtils.getInspectionUser(inspec),
      }}
    />
  );
};

export default SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionForm;
