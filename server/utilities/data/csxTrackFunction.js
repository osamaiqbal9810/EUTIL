import { csxTrack1Sample, csxTrack1Cords } from "./csxData";
import { csxTrack2Sample, csxTrack2Cords } from "./csxDataT2";
import { guid } from "../UUID";
import { csxDataDemoLatLonCorrection, reverseLatLon } from "../latlonCorrection";
export function getDbTracksCSXSample() {
  let tracks = [];
  csxDataDemoLatLonCorrection(csxTrack1Sample);
  let newCsxT1Cord = reverseLatLon(csxTrack1Cords);
  csxDataDemoLatLonCorrection(csxTrack2Sample);
  let newCsxT2Cord = reverseLatLon(csxTrack2Cords);
  let trackOne = addTrack(csxTrack1Sample, 1, newCsxT1Cord);
  let trackTwo = addTrack(csxTrack2Sample, 2, newCsxT2Cord);
  //console.log("Db Tracks");
  tracks = [trackOne, trackTwo];
  //console.log((tracks = [trackOne, trackTwo]));
  return tracks;
}
function addTrack(tracks, tNum, csxTrackCords) {
  let units = [];

  let possibleAssetTypes = ["Crossing", "Bridge", "Access Point", "Switch", "Derail", "Xing", "Signal", "Overpass"];
  tracks.features.forEach((asset, index) => {
    let assetTypeName = "";
    possibleAssetTypes.forEach(atype => {
      let assetTypeFound = asset.properties.name.search(atype);
      if (assetTypeFound >= 0) {
        assetTypeName = atype;
        return;
      }
    });
    let unit = {
      assetType: assetTypeName,
      start: (index + 1).toString(),
      end: (index + 1).toString(),
      length: "0",
      id: guid(),
      unitId: asset.properties.name,
      coordinates: asset.geometry.coordinates,
      railRoad: "CSX",
    };
    units.push(unit);
  });
  let railUnit = {
    assetType: "Rail",
    start: "0",
    end: (tracks.features.length - 1).toString(),
    length: tracks.features.length.toString(),
    unitId: "Track-CSX-00" + tNum,
    id: guid(),
    coordinates: csxTrackCords ? csxTrackCords : [],
    railRoad: "CSX",
  };
  units.push(railUnit);
  let trackForDb = {
    subdivision: "Albany Subdivision",
    trackType: "Main Line",
    start: "0",
    end: (tracks.features.length - 1).toString(),
    length: tracks.features.length.toString(),
    trafficType: "Freight",
    trackId: "Rail-CSX-00" + tNum,
    units: units,
    coordinates: [],
    mp_prefix: "CSX",
    weight: "",
    class: "",
  };
  return trackForDb;
}
