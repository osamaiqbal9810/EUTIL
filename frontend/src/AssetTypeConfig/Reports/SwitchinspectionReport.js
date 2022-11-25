export function getAllowedSwitches(aType) {
  return switchAssets[aType] ? switchAssets[aType] : false;
}

const switchAssets = {
  Switch: true,
  "Customer Switch": true,
  Turnout: true,
  "Turnout 1": true,
  "Turnout 2": true,
  "Turnout 3": true,
  "Turnout 4": true,
  "Switch LH": true,
  "Switch RH": true,
  "Customer Switch LH": true,
  "Customer Switch RH": true,
  "Yard Switch": true
};
