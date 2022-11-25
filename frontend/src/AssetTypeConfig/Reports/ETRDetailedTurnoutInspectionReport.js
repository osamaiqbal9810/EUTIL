export const switchTurnoutsIncluded = ["Switch LH", "Switch RH", "Customer Switch LH", "Customer Switch RH"];

export const switchLhTypes = ["Switch LH", "Customer Switch LH"];
export const switchRhTypes = ["Switch RH", "Customer Switch RH"];

export function switchFormCodeAllowed(formCode) {
  return switchFormCodes[formCode] ? switchFormCodes[formCode] : false;
}

const switchFormCodes = {
  etrLHSwitchForm: true,
  etrRHSwitchForm: true,
};
