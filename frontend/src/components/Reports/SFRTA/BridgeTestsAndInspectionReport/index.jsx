import React, { Component } from "react";
import { getAllowedSwitches } from "../../../../AssetTypeConfig/Reports/SwitchinspectionReport";
import { ReportGeneratorUtils } from "../../utils/reportGeneratorUtils";
import { switchReportStyle } from "../../Timps/Switch/style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import _ from "lodash";
import ReportTitleSection from "../../../../libraries/ReportGenerator/ReportTitleSection";
import ReportTableSectionRenderer from "../../../../libraries/ReportGenerator";
import { SFRTA_BridgeTestsAndInspectionReportSchema } from "./SFRTA_BridgeTestsAndInspectionReportSchema";
import ReportFraInfoSectionContainer from "../../../../libraries/ReportGenerator/ReportFraInfoSection";
import ReportFraConditionsMasterKey from "../../../../libraries/ReportGenerator/ReportFraConditionsMasterKey";

const masterKey = [
  { key: 'C', value: 'Test completed, no exceptions found, and condition left in compliance.' },
  { key: 'A', value: 'Adjustments made (identified in associated comments), test completed, and condition left in compliance.' },
  { key: 'R', value: 'Repairs and/or Replacements made (identified in associated comments), test completed, and condition left in compliance.' },
  { key: 'B', value: 'Baseline data matches that recorded during the most recent Baseline test, so full test not required.' },
  { key: 'G', value: 'Governed by Special Instruction.' },
  { key: 'NT', value: 'The equipment was not tested in this inspection.' },
  { key: 'N', value: 'Test Not Applicable.' },
  { key: 'NI', value: 'No Inspection Required.' },
  { key: 'CO', value: 'Compliant' },
  { key: 'NC', value: 'Not compliant' },
  { key: 'P', value: 'Pass' },
  { key: 'F', value: 'Fail' },
]

const ReportView = (props) => {
  let { reportData } = props;
  let rowsData = reportData && reportData.assets && Array.isArray(reportData.assets) ? reportData.assets : [];

  return (
    <div id="mainContent" className="table-report" style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}>
      <ReportTitleSection title="Inspection Report - Bridge Tests & Inspections" {...props} />
      <span className="spacer"></span>
      <ReportFraInfoSectionContainer />
      <ReportFraConditionsMasterKey masterKey={masterKey} />
      <span className="spacer"></span>

      <table className="table-bordered">
        {SFRTA_BridgeTestsAndInspectionReportSchema.sections.map((section) => {
          return <ReportTableSectionRenderer section={section} rowsData={rowsData} />;
        })}
      </table>
    </div>
  );
};

const SFRTA_BridgeTestsAndInspectionReport = (props) => {
  const { inspec } = props;
  return (
    <ReportView
      {...props}
      reportData={{
        // assets: ReportGeneratorUtils.getInspectionAssetsWithForm(inspec, getAllowedSwitches, "nopbSwitchForm"),
        // location: ReportGeneratorUtils.getInspectionLocation(inspec),
        // date: ReportGeneratorUtils.getInspectionDate(inspec),
        // user: ReportGeneratorUtils.getInspectionUser(inspec),
      }}
    />
  );
};

export default SFRTA_BridgeTestsAndInspectionReport;
