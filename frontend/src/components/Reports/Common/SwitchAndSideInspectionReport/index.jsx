import React, { Component } from "react";
import { getAllowedSwitches } from "../../../../AssetTypeConfig/Reports/SwitchinspectionReport";
import { ReportGeneratorUtils } from "../../utils/reportGeneratorUtils";
import { switchReportStyle } from "../../Timps/Switch/style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import _ from "lodash";
import ReportTitleSection from "../../../../libraries/ReportGenerator/ReportTitleSection";
import ReportInfoSection from "../../../../libraries/ReportGenerator/ReportInfoSection";
import ReportTableSectionRenderer from "../../../../libraries/ReportGenerator";
import { dataFormatters } from "../../../../utils/dataFormatters";
import { SignatureImage } from "../../utils/SignatureImage";
import { Common_SwitchAndSideInspectionReportSchema } from "./Common_SwitchAndSideInspectionReportSchema";

const ReportView = (props) => {
  let { reportData, signatureImage } = props;
  let rowsData = reportData && reportData.assets && Array.isArray(reportData.assets) ? reportData.assets : [];

  return (
    <div id="mainContent" className="table-report" style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}>
      <ReportTitleSection title="Switch and Side Track Inspection Report" />
      <ReportInfoSection
        rows={[
          {
            col1: {
              title: "Location",
              value: reportData.location,
            },
            col2: {
              title: "Date",
              value: dataFormatters.dateFormatter(reportData.date),
            },
          },
          {
            col1: {
              title: "Track Inspector",
              value: reportData.user.name,
            },
            col2: {
              title: "Weather",
              value: reportData.weather,
            },
          },
        ]}
      />
      <span className="spacer"></span>
      <table className="table-bordered">
        {Common_SwitchAndSideInspectionReportSchema.sections.map((section) => {
          return <ReportTableSectionRenderer section={section} rowsData={section.inlineData ? reportData : rowsData} />;
        })}
      </table>
    </div>
  );
};

const Common_SwitchAndSideInspectionReport = (props) => {
  const { inspec, usersSignatures } = props;
  return (
    <ReportView
      {...props}
      reportData={{
        assets: ReportGeneratorUtils.getInspectionAssetsWithForm(
          inspec,
          (sw) => {
            return getAllowedSwitches(sw) || sw === "Side Track";
          },
          "frmSwitchInspection",
          true,
          true,
          usersSignatures,
        ),
        location: ReportGeneratorUtils.getInspectionLocation(inspec),
        date: ReportGeneratorUtils.getInspectionDate(inspec),
        user: ReportGeneratorUtils.getInspectionUser(inspec),
        weather: ReportGeneratorUtils.getInspectionWeather(inspec),
      }}
    />
  );
};

export default Common_SwitchAndSideInspectionReport;
