import { sfrtaSwitchLockRodNormal, sfrtaSwitchLockRodReverse } from "./SFRTA/SFRTA_SITE/switchMonthlyLockRod";
import { insulationResistance } from "./TransDev_SITE_Forms/InsulationResistanceForm";
import { relaytestForm } from "./TransDev_SITE_Forms/RelayTestForm";
import { formGI303 } from "./IOCGIForms/Form303";
import { formFicheB12 } from "./IOCGIForms/Form305B12";
import { formFicheB24 } from "./IOCGIForms/Form305B24";
import { formFicheB12B24 } from "./IOCGIForms/Form305B12B24";
import { gi329fa } from "./IOCGIForms/Form329a";
import { gi329fb } from "./IOCGIForms/Form329b";
import { gi329fc } from "./IOCGIForms/Form329c";
import { gi329fd } from "./IOCGIForms/Form329d";
import { gi313f } from "./IOCGIForms/Form313";
import { gi334f } from "./IOCGIForms/Form334";
import { scp907f } from "./IOCGIForms/Form907";
import { scp902f } from "./IOCGIForms/Form902";
import { scp901f } from "./IOCGIForms/Form901";
import { suivimargingi335 } from "./IOCGIForms/Form335";
import {
  fra234_249_B12,
  fra234_249_B,
  fra234_251_B12,
  fra234_251_B,
  fra234_253C,
  fra234_257A,
  fra234_257B,
  fra234_271,
  fra234_253A,
  fra234_253B,
  fra234_259,
} from "./TransDev_SITE_Forms/CrossingInspectionFRA234XXX";
import { fixedAssetForm1, fixedAssetForm2, fixedAssetForm3 } from "./FixedInspections/FixedInspectionForm";
import { gradeFormGet } from "./ONR_Forms/SiteForms/gradeCrossingForms";
import { fraFormGet } from "./FRASite/FRAForms";
import {
  sfrtaSwitchshuntFouling,
  sfrtaSwitchcircuitControllerReverse,
  sfrtaSwitchcircuitControllerNormal,
} from "./SFRTA/SFRTA_SITE/switchQuarterlyForms";
import { sfrtaBridgeLockingForm } from "./SFRTA/SFRTA_SITE/bridgeLockingForm";
import { nopbDetailedMonthlyTurnoutForm } from "./NOPB/SwitchForm/nopbSwitchForm";
import { sfrtaHotBox30Days, sfrtaHotBox90Days, sfrtaDraggingEquip30Days } from "./SFRTA/SFRTA_SITE/HotBoxDetectorForms";
import { sfrtaMechanical, sfrtaApproach, sfrtaTime, sfrtaRoute, sfrtaIndication, sfrtaTraffic } from "./SFRTA/SFRTA_SITE/InterlockingForms";

export const scimAppForms = [
  formGI303,
  formFicheB12,
  formFicheB24,
  formFicheB12B24,
  gi329fa,
  gi329fb,
  gi329fc,
  gi329fd,
  gi313f,
  gi334f,
  scp901f,
  scp902f,
  scp907f,
  suivimargingi335,
  insulationResistance,
  relaytestForm,
  fra234_249_B12,
  fra234_249_B,
  fra234_251_B12,
  fra234_251_B,
  fra234_253C,
  fra234_257A,
  fra234_257B,
  fra234_271,
  fra234_253A,
  fra234_253B,
  fra234_259,
  fixedAssetForm1,
  fixedAssetForm2,
  fixedAssetForm3,
  ...gradeFormGet(),
  ...fraFormGet(),
  sfrtaSwitchLockRodNormal,
  sfrtaSwitchLockRodReverse,
  sfrtaSwitchcircuitControllerNormal,
  sfrtaSwitchcircuitControllerReverse,
  sfrtaSwitchshuntFouling,
  sfrtaBridgeLockingForm,
  nopbDetailedMonthlyTurnoutForm,
  sfrtaHotBox30Days,
  sfrtaHotBox90Days,
  sfrtaDraggingEquip30Days,
  sfrtaMechanical,
  sfrtaApproach,
  sfrtaTime,
  sfrtaRoute,
  sfrtaIndication,
  sfrtaTraffic,
];
