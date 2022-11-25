export function checkYardTrackReportMethod(aType) {
  return yTracks[aType] ? true : false;
}

const yTracks = {
  "Yard Track": true,
  "Yard Track 1": true,
  "Yard Track 2": true,
  "Yard Track 3": true,
  "Customer Yard Track": true,
};
