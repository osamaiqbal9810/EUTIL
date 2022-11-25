import React from "react";

import DetailedSwitchInspection from "components/Reports/Timps/Switch/switchReport.jsx";
import SwitchInspection from "components/Reports/Timps/Switch/monthlySwitchInspection";

import Maintenance from "components/Reports/sims/batteryMaintenance";
import GI305Report from "components/Reports/sims/maintenance-305aView";
import GI303Report from "components/Reports/sims/maintenance-303View";
import BatteryTestReportsB12B24 from "components/Reports/sims/batteryTestReportsB12&B24";
import DefaultReport from "components/Reports/sims/defaultReport";
import SuviMargin from "components/Reports/sims/sudNicman/index";
import RelayTest from "components/Reports/sims/relayTest";
import InsulationResistance from "components/Reports/sims/insulationResistance";
import HighWayCrossing from "../../Reports/sims/highWayCrossingCombined/highWayCrossing";
import BridgeInspectionReport from "components/Reports/Timps/Bridge/monthlyBridgeInspectionView";
import CurveTestForm from "components/Reports/Timps/CurveReport/CurveReport";
import GI303BatteryMaintenance from "../../Reports/sims/batteryMaintenance";
import TurnoutInspectionReportView from "../../Reports/Timps/EtrSwitchReport/detailedTurnoutInspectionReportView";
import DefectReportView from "../../Reports/Timps/LineInspection/DefectReportView";

export function reportsPreview(name) {
  return reportName[name];
}

const reportName = {
  frmMonthlySI4QNS: <SwitchInspection />,
  frmAnnualSI4QNS: <SwitchInspection />,
  frmSwitchInspection: <DetailedSwitchInspection />,
  formFicheB24: <GI305Report assetsData={[]} />,
  formFicheB12: <GI305Report assetsData={[]} />,
  formGI303: <Maintenance assetsData={[]} />,
  formFicheB12B24: <BatteryTestReportsB12B24 assetsData={[]} />,
  gi334f: <DefaultReport />,
  scp901f: <DefaultReport />,
  scp902f: <DefaultReport />,
  scp907f: <DefaultReport />,
  suivimargingi335: <SuviMargin />,
  gi329fa: <DefaultReport />,
  gi329fb: <DefaultReport />,
  gi329fc: <DefaultReport />,
  gi329fd: <DefaultReport />,
  gi329f: <DefaultReport />,
  gi313f: <DefaultReport />,
  "form234.249B_M": <HighWayCrossing />,
  "form234.251B12_M": <HighWayCrossing />,
  "form234.251B_M": <HighWayCrossing />,
  "form234.253C_M": <HighWayCrossing />,
  "form234.257A_M": <HighWayCrossing />,
  "form234.257B_M": <HighWayCrossing />,
  "form234.253A_Y": <HighWayCrossing />,
  "form234.253B_Y": <HighWayCrossing />,
  "form234.259_Y": <HighWayCrossing />,
  "form234.249B12_M": <HighWayCrossing />,
  "form234.249B_M": <HighWayCrossing />,
  relayTestForm: <RelayTest />,
  insulationResistance: <InsulationResistance />,
  "form234.271_Q": <HighWayCrossing />,
  etrBridgeForm: <BridgeInspectionReport />,
  curveTestForm: <CurveTestForm />,
  etrRHSwitchForm: <TurnoutInspectionReportView assetData={{ assetType: "Switch RH" }} />,
  etrLHSwitchForm: <TurnoutInspectionReportView />,
  inspectionForm1: <DefectReportView basicData={{}} issuesData={[]} />,
  inspectionForm2: <DefectReportView basicData={{}} issuesData={[]} />,
  inspectionForm3: <DefectReportView basicData={{}} issuesData={[]} />,
};
