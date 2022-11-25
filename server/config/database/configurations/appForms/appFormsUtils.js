import _ from "lodash";
import { crossingInspectionOpts } from "./TransDev_SITE_Forms/CrossingInspectionFRA234XXX";
export function getmodifiedOpts(mod) {
  let optsToRet = [...crossingInspectionOpts];
  let fIndex = _.findIndex(optsToRet, { id: mod.id });
  if (fIndex > -1) optsToRet[fIndex] = mod;
  return optsToRet;
}
