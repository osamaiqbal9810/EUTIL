export const primaryTrackAssetTypeChecks = ["Customer Track", "track"];
const ytrackMarkersATypes = {
  Switch: true,
  "Turnout 1": true,
  "Turnout 2": true,
  "Turnout 3": true,
  "Turnout 4": true,
  "Customer Switch LH": true,
  "Customer Switch RH": true,
  "Customer Switch": true,
  "Switch LH": true,
  "Switch RH": true,
};

export const getyTrackMarkerATypeCheck = (assetType) => {
  return ytrackMarkersATypes[assetType];
};
