import { tracks } from "./Centerline";
import { milePosts } from "./MilePosts";
import { guid } from "../UUID";
import { bridges } from "./bridges";
import { crossings } from "./crossings";
import { diamonds } from "./diamonds";
import { switches } from "./switches";
import { whistlePost } from "./whistlepost";
import { signals } from "./signals";
import { culvets } from "./culvets";
import { signs } from "./signs";
import { fieldFromDescription } from "./helper";
import _ from "lodash";

export function tracks_Transformation_From_KmlJSON_DBTracks() {
  // let latLon = {
  //   lon: tracks.features[0].geometry.coordinates[0][0][0] * 100000000000000,
  //   lat: tracks.features[0].geometry.coordinates[0][0][1] * 100000000000000
  // }
  // let newlatLon = {
  //   x1: tracks.features[0].geometry.coordinates[0][0][0] + 0.0000000000005,
  //   x2: tracks.features[0].geometry.coordinates[0][0][0] - 0.0000000000005,
  //   y1: tracks.features[0].geometry.coordinates[0][0][1] + 0.0000000000005,
  //   y2: tracks.features[0].geometry.coordinates[0][0][1] - 0.0000000000005
  // }
  // // console.log(latLon)
  // // console.log(newlatLon)
  let distanceUnit = 0.00500000000005;
  let updatedTracksGuid = [];
  let foundMilepost = [];
  let notFoundMilePost = [];
  let uniquePosts = {};
  let MainLineMilePost = _.cloneDeep(milePosts);
  let milePostDuplicateCount = 0;

  let unique = [];
  MainLineMilePost.features.forEach(post => {
    let railroad = fieldFromDescription("railroad", post.properties.description);
    if (!railroad || railroad == "") {
      railroad = "SCFE";
    }
    let nameSplit = post.properties.Name.split(" ");
    let name = nameSplit[0];
    let found = false;
    unique.forEach(uniqueVal => {
      if (uniqueVal.name == name) {
        found = true;
      }
    });
    if (!found) {
      unique.push({ name: name, railroad: railroad });
    }
  });

  // console.log(unique)
  MainLineMilePost.features.forEach(milePost => {
    if (milePost.added) {
      milePostDuplicateCount++;
    }
    let milePostFlag = false;
    let newlatLon = {
      x1: milePost.geometry.coordinates[0] + distanceUnit,
      x2: milePost.geometry.coordinates[0] - distanceUnit,
      y1: milePost.geometry.coordinates[1] + distanceUnit,
      y2: milePost.geometry.coordinates[1] - distanceUnit,
    };
    tracks.features.forEach((track, index) => {
      track.sortId = index;
      track.railRoad = fieldFromDescription("railroad", track.properties.description);
      // if (track.properties.Name == 'Mainline') {
      let flag = { guid: null, val: false };

      track.geometry.coordinates[0].forEach(coordinate => {
        let latLon = {
          x: coordinate[0],
          y: coordinate[1],
        };

        if (latLon.x > newlatLon.x2 && latLon.x < newlatLon.x1 && latLon.y > newlatLon.y2 && latLon.y < newlatLon.y1) {
          let railroad = fieldFromDescription("railroad", track.properties.description);
          //// console.log(railroad)
          if (!railroad || railroad == "") {
            //  // console.log('empty Found')
            railroad = "Unnamed";
          }
          let milePostPrefix = milePost.properties.Name.split(" ");
          let uniqueResult = _.find(unique, { railroad: railroad, name: milePostPrefix[0] });
          let checkRailRoad = false;

          if (milePostPrefix[0] == "SCFEC") {
            // console.log('SCFEC FOUND')
          }
          if (uniqueResult) {
            checkRailRoad = milePost.properties.Name.includes(railroad);
          }
          if (milePostPrefix[0] == "FEC") {
            if (milePostPrefix[0] == "FEC" && railroad == "SCFE") {
              checkRailRoad = true;
            }
          }
          if (checkRailRoad && !milePost.added) {
            let newGuid = guid();
            flag.val = true;
            milePost.added = true;
            if (!track.guid) {
              flag.guid = newGuid;
              milePost.trackGuid = newGuid;
            } else {
              milePost.trackGuid = track.guid;
              let mpAlreadyExist = _.find(uniquePosts[milePost.trackGuid], function(milepost) {
                return milePost.properties.Name == milepost.properties.Name;
              });
              if (!mpAlreadyExist) {
                uniquePosts[milePost.trackGuid].push(milePost);
              }
            }
            milePostFlag = true;
            return;
          }
        }
      });

      if (flag.val && flag.guid && milePostFlag) {
        track.guid = flag.guid;
        updatedTracksGuid.push(track);
        uniquePosts[flag.guid] = [milePost];
        return;
      } else if (flag.val && milePostFlag) {
        return;
      }
      //    }
    });

    if (!milePostFlag) {
      notFoundMilePost.push(milePost);
    } else {
      foundMilepost.push(milePost);
    }
  });
  // // console.log('Updated Tracks')
  // // console.log(tracks)
  // let latLon = {
  //   x: 1000,
  //   y: 500
  // }

  // let newlatLon = {
  //   x1: 1200,
  //   x2: 800,
  //   y1: 700,
  //   y2: 300
  // }
  // if (latLon.x > newlatLon.x2 && latLon.x < newlatLon.x1 && latLon.y > newlatLon.y2 && latLon.y < newlatLon.y1) {
  //   // console.log('found')
  // }
  // console.log('milePostDuplicateCount : ' + milePostDuplicateCount)
  // console.log('foundMilepost')
  // console.log(foundMilepost)
  // console.log('notFoundMilePost')
  // console.log(notFoundMilePost)
  // console.log('uniquePosts')
  // console.log(uniquePosts)
  let uniquePostskeys = Object.keys(uniquePosts);
  // console.log(uniquePostskeys.length)

  uniquePostskeys.forEach(key => {
    let smallestVal = null;
    let greatestVal = null;
    let name = "";

    let Mp = uniquePosts[key][0].properties.Name.split(" ");
    let nameMP = Mp[0];

    uniquePosts[key].forEach(post => {
      let str = post.properties.Name;
      let split = str.split(" ");
      name = split[0];

      if (name == "USSCF") {
        //  // console.log(post)
      }
      if (name == nameMP) {
        if (split[1] == 0) {
          // // console.log('Found 0')
          // // console.log(post)
          // // console.log(uniquePosts[key])
        }
        if (smallestVal) {
          if (split[1] < smallestVal) {
            smallestVal = split[1];
          }
        } else {
          smallestVal = split[1];
        }
        if (greatestVal) {
          if (split[1] > greatestVal) {
            greatestVal = split[1];
          }
        } else {
          greatestVal = split[1];
        }
      }
    });
    if (smallestVal == 0) {
      //    // console.log(uniquePosts[key])
    }
    // Update Track INFO from Milepost
    let result = _.find(updatedTracksGuid, track => {
      return track.guid == key;
    });
    if (result) {
      if (nameMP == "USSCF") {
        //// console.log('USSCF')
      }
      result.startEnd = { start: smallestVal, end: greatestVal };
      result.length = greatestVal - smallestVal;
      result.trackId = name + " " + smallestVal + "-" + greatestVal;
      result.MP_PREFIX = name;
      result.units = [];
    }
  });

  // console.log('updated tracks with Assets')
  // console.log(updatedTracksGuid)
  let mergedTracks = mergeTracksWithRails(updatedTracksGuid);

  getAssetFromProperties(bridges, mergedTracks);
  getAssetFromProperties(crossings, mergedTracks);
  getAssetFromProperties(diamonds, mergedTracks);
  getAssetFromDescription(switches, mergedTracks, "switches");
  getAssetFromDescription(whistlePost, mergedTracks, "whistle post");
  getAssetFromDescription(signals, mergedTracks, "signals");
  getAssetFromDescription(culvets, mergedTracks, "culvets");
  getAssetFromDescription(signs, mergedTracks, "signs");
  let finalTrackData = finishedTracksforDataBase(mergedTracks);
  return finalTrackData;
}

function mergeTracksWithRails(tracksData) {
  let updatedTracksMerged = [];
  let sortedData = _.sortBy(tracksData, [
    function(track) {
      return parseInt(track.startEnd.start);
    },
  ]);
  // console.log('sortedData')
  // console.log(sortedData)
  sortedData.forEach(track => {
    let exists = _.find(updatedTracksMerged, { MP_PREFIX: track.MP_PREFIX });
    let unit = {
      assetType: "rail",
      start: track.startEnd.start,
      end: track.startEnd.end,
      id: guid(),
      length: parseInt(track.startEnd.end) - parseInt(track.startEnd.start),
      unitId: track.trackId,
      coordinates: track.geometry.coordinates[0],
      railRoad: track.railRoad,
      altitudeMode: track.properties.altitudeMode,
    };
    if (exists) {
      exists.startEnd.end = track.startEnd.end;

      exists.geometry.coordinates[0] = [...exists.geometry.coordinates[0], ...track.geometry.coordinates[0]];

      exists.units.push(unit);
      exists.trackId = track.MP_PREFIX + " " + exists.startEnd.start + "-" + track.startEnd.end;

      exists.length = track.startEnd.end - exists.startEnd.start;
    } else {
      track.units.push(unit);
      updatedTracksMerged.push(track);
    }
  });
  return updatedTracksMerged;
}

function finishedTracksforDataBase(tracksUpdated) {
  let dbTracks = [];
  tracksUpdated.forEach(dataTrack => {
    let track = {
      subdivision: "US-Sugar",
      trackType: dataTrack.properties.Name,
      start: dataTrack.startEnd.start,
      end: dataTrack.startEnd.end,
      length: dataTrack.length.toString(),
      trafficType: "Unknown",
      weight: "",
      class: "",
      trackId: dataTrack.trackId,
      units: dataTrack.units,
      coordinates: dataTrack.geometry.coordinates[0],
      mp_prefix: dataTrack.MP_PREFIX,
    };
    dbTracks.push(track);
  });
  // console.log("TRACKS FOR DB");
  // console.log(dbTracks);
  return dbTracks;
}

function getAssetFromProperties(assetTypeData, tracksData) {
  let tracksWithAsset = [];
  let foundAsset = [];
  let count = 0;
  assetTypeData.features.forEach(asset => {
    tracksData.forEach(track => {
      let assetMilePost = asset.properties.MP_Number;
      if (asset.properties.MP_Prefix == track.MP_PREFIX) {
        if (parseFloat(assetMilePost) > parseFloat(track.startEnd.start) && parseFloat(assetMilePost) < parseFloat(track.startEnd.end)) {
          let railRoad = asset.properties.Railroad;
          if (!railRoad) {
            railRoad = asset.properties.RR;
          }
          let unit = {
            assetType: assetTypeData.name.toLowerCase(),
            start: asset.properties.MP_Number,
            end: asset.properties.MP_Number,
            length: "0",
            id: guid(),
            unitId: asset.properties.Name + "-" + asset.properties.MP_Number,
            coordinates: asset.geometry.coordinates,
            railRoad: railRoad,
            altitudeMode: asset.properties.altitudeMode,
          };
          track.units.push(unit);
          count++;
          tracksWithAsset.push(track);
          foundAsset.push(asset);
        }
      }
    });
  });
  // console.log('Tracks With : ' + assetTypeData.name)
  // console.log(tracksWithAsset)
  // console.log(assetTypeData.name)
  // console.log(foundAsset)
}

function getAssetFromDescription(assetTypeData, tracksData, assetName) {
  if (assetName == "switches") {
    // console.log('breakPoint')
  }
  let assetWithoutMP = [];
  let tracksWithAsset = [];
  let foundAsset = [];
  let count = 0;
  assetTypeData.features.forEach(asset => {
    let assetMilePost = fieldFromDescription("MP_Number", asset.properties.description);
    let railRoad = fieldFromDescription("railroad", asset.properties.description);
    if (!assetMilePost && assetMilePost.trim() == "") {
      assetWithoutMP.push(asset);
    }
    tracksData.forEach(track => {
      if (fieldFromDescription("MP_Prefix", asset.properties.description) == track.MP_PREFIX) {
        if (parseFloat(assetMilePost) > parseFloat(track.startEnd.start) && parseFloat(assetMilePost) < parseFloat(track.startEnd.end)) {
          if (!railRoad) {
            railRoad = fieldFromDescription("RR", asset.properties.description);
          }
          let unit = {
            assetType: assetName,
            start: assetMilePost,
            end: assetMilePost,
            length: "0",
            id: guid(),
            unitId: assetName + "-" + assetMilePost,
            coordinates: asset.geometry.coordinates,
            railRoad: railRoad,

            //altitudeMode: asset.properties.altitudeMode
          };
          track.units.push(unit);
          asset.found = true;
          count++;
          tracksWithAsset.push(track);
          foundAsset.push(asset);
        }
      }
    });
  });

  // console.log('Tracks With : ' + assetName)
  // console.log(tracksWithAsset)
  // console.log(assetName)
  // console.log(foundAsset)
  // console.log('assets Without MP NUMBER')
  // console.log(assetWithoutMP)
}
