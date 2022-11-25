import { frmSwitchInspection } from "./FingerLake_TIMPS_Forms/fingerLakeSwitchInspectionForm";

import { form2 } from "./relayTestForm";
import { frmAnnualSI4QNS } from "./IOC_TIMPS_Forms/IOCSwitchAnnualForm";
import { frmMonthlySI4QNS } from "./IOC_TIMPS_Forms/IOCSwitchMonthlyForm";
import { inspectionForm1, inspectionForm2, inspectionForm3 } from "./LinearInspections/InspectionForms";
import { etrBridgeForm } from "./ETR_Forms/etrBridgeForm";
import { curveTestForm } from "./TXNW_Forms/CurveForm";
import { fixedAssetForm1, fixedAssetForm2, fixedAssetForm3 } from "./FixedInspections/FixedInspectionForm";
import { etrRHSwitchForm, etrLHSwitchForm } from "./ETR_Forms/EtrLHAndRHSwitchForm";
import { curveTestFormETR } from "./ETR_Forms/etrCurveForm";
import { onrDetailedMonthlyTurnoutForm } from "./ONR_Forms/TimpsForms/detailedMainlineTurnoutForm";
//import { tDisturbanceForm } from "./General/trackDisturabnceForm";
import { monthlyDetailedSwitchFormONR } from "./ONR_Forms/TimpsForms/monthlyDetailedSwitchFormONR";
export const timpsAppForms = [
  frmSwitchInspection,
  // tDisturbanceForm,
  form2,
  frmAnnualSI4QNS,
  frmMonthlySI4QNS,
  inspectionForm1,
  inspectionForm2,
  inspectionForm3,
  etrBridgeForm,
  curveTestForm,
  fixedAssetForm1,
  fixedAssetForm2,
  fixedAssetForm3,
  etrLHSwitchForm,
  etrRHSwitchForm,
  curveTestFormETR,
  onrDetailedMonthlyTurnoutForm,
  monthlyDetailedSwitchFormONR,
];
