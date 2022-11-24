export function reverseLatLon(gisData) {
  let newGisData = [];
  gisData.forEach(element => {
    let newObj = [element[1], element[0]];
    newGisData.push(newObj);
  });
  return newGisData;
}

export function csxDataDemoLatLonCorrection(csxSample) {
  csxSample.features.forEach(asset => {
    asset.geometry.coordinates = [[asset.geometry.coordinates[1], asset.geometry.coordinates[0]]];
  });
}
