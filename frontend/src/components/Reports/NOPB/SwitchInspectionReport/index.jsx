import React, { Component } from "react";
import { getAllowedSwitches } from "../../../../AssetTypeConfig/Reports/SwitchinspectionReport";
import { ReportGeneratorUtils } from "../../utils/reportGeneratorUtils";
import { NOPB_SwitchInspectionReportSchema } from "./NOPB_SwitchInspectionReportSchema";
import { switchReportStyle } from "../../Timps/Switch/style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import _ from "lodash";
import ReportTitleSection from "../../../../libraries/ReportGenerator/ReportTitleSection";
import ReportInfoSection from "../../../../libraries/ReportGenerator/ReportInfoSection";
import ReportTableSectionRenderer from "../../../../libraries/ReportGenerator";
import { dataFormatters } from "../../../../utils/dataFormatters";
import { SignatureImage } from "../../utils/SignatureImage";

const ReportView = (props) => {
  let { reportData, signatureImage } = props;
  let rowsData = reportData && reportData.assets && Array.isArray(reportData.assets) ? reportData.assets : [];

  return (
    <div id="mainContent" className="table-report" style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}>
      <ReportTitleSection title="NEW ORLEANS PUBLIC BELT SWITCH INSPECTION REPORT" {...props} />
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
              title: "Signature",
              value: <SignatureImage placement={"tableCell"} signatureImage={signatureImage} />,
            },
          },
        ]}
      />

      <span className="spacer"></span>
      <table className="table-bordered">
        {NOPB_SwitchInspectionReportSchema.sections.map((section) => {
          return <ReportTableSectionRenderer section={section} rowsData={rowsData} />;
        })}
      </table>
    </div>
  );
};

const NOPB_SwitchInspectionReport = (props) => {
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

export default NOPB_SwitchInspectionReport;
