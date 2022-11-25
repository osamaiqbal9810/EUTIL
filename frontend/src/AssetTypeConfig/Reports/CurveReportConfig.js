export function checkYardTrackMethod(aType) {
  return yTracks[aType] ? true : false;
}

export function checkIfParentTrack(aType) {
  return parentTrackAType[aType] ? true : false;
}

const yTracks = {
  "Yard Track": true,
  "Yard Track 1": true,
  "Yard Track 2": true,
  "Yard Track 3": true,
  "Customer Yard Track": true,
};

const parentTrackAType = {
  track: true,
  "Customer Track": true,
};
