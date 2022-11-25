import AssetsTypeModel from "../../../../api/assetTypes/assetTypes.model";
import AssetsService from "../../../../api/assets/assets.service";
import AssetsModel from "../../../../api/assets/assets.modal";
import AssetsTreeService from "../../../../api/assetsTree/assetsTreeService";
var ObjectId = require("mongodb").ObjectID;
module.exports = {
  async apply() {
    console.log("Patch: Remove other tracks and replicate to Side Tracks");
    let sideTracks = [];
    let assetService = new AssetsService();
    let assetTreeService = new AssetsTreeService();
    for (let loc in existingTracks) {
      for (let tItem of existingTracks[loc]) {
        let track = await AssetsModel.findOne({ assetType: "track", _id: tItem.id, unitId: tItem.name, isRemoved: false }).exec();

        if (track) {
          let newSTrack = {
            coordinates: track.coordinates,
            inspectable: track.inspectable,
            parentAsset: track.parentAsset,
            images: track.images,
            documents: track.documents,
            childAsset: track.childAsset,
            levels: track.levels,
            isRemoved: false,
            subdivision: track.subdivision,
            unitId: track.unitId,
            description: track.description,
            start: track.start,
            end: track.end,
            assetLength: track.assetLength,
            assetType: "Side Track",
            frequency: track.frequency,
            attributes: track.attributes,
            name: track.name,
            lineId: track.lineId,
          };
          if (track.attributes.primaryTrack)
            console.log(
              "Important :" + track.unitId + "with id " + track.id + " has a primary track value true while we are making it a side track",
            );
          // TODO : Delete existing track asset
          await assetService.deleteAsset(track.id, true);
          sideTracks.push(newSTrack);
        }
      }
    }

    for (let sTrack of sideTracks) {
      let result = await assetService.createAssetsLamp(sTrack, true);

      if (!result.errorVal) {
        let childAssets = await AssetsModel.find({ _id: { $in: sTrack.childAsset } }).exec();
        if (childAssets && childAssets.length > 0) {
          for (let child of childAssets) {
            child.isRemoved = false;
            child.parentAsset = result.value._id;
            await child.save();
            await assetService.assetCreateAssetTests(child);
          }
        }
      }
    }
    console.log("Recreating asset hierarchy Tree");
    await assetTreeService.createHierarchyTree();
    console.log("Following tracks are added as side tracks");
    console.log(sideTracks);
  },
};
let tOPt = {
  coordinates: [],
  inspectable: true,
  parentAsset: "60f0b8eb59db2c02ad6c3fcd",
  images: [],
  documents: [],
  childAsset: [],
  levels: {},
  isRemoved: false,
  subdivision: "",
  unitId: "Main Line",
  description: "track",
  start: 0,
  end: 21.85,
  assetLength: 21.85,
  assetType: "track",
  frequency: null,
  attributes: {},
  name: "track",
  lineId: "60f0b8eb59db2c02ad6c3fcd",
};
let existingTracks = {
  "Auburn Road": [
    { id: ObjectId("60e47904ab21d363c3ee58cc"), name: " ARRT Runaround Track" },
    { id: ObjectId("5f30494f7793382ba548ffc9"), name: "Blowers Track" },
    { id: ObjectId("5ed7f2582995eb1e9ca00ad9"), name: "Southern Runaround Track" },
    { id: ObjectId("5ed7f86c2995eb1e9ca00ae1"), name: "West Rock Lead Tracks" },
    { id: ObjectId("5ed7f22b2995eb1e9ca00ad8"), name: "Fairmount Runaround Track" },
    { id: ObjectId("5ed7efa72995eb1e9ca00ace"), name: "Frazer Runaround Track" },
  ],
  "Canadaigua Line": [
    { id: ObjectId("5efba1d80a85e03020e4126c"), name: "R.B. Crowell Runaround" },
    { id: ObjectId("5efba1700a85e03020e4126b"), name: "Long Runaround" },
    { id: ObjectId("5efba1560a85e03020e4126a"), name: "Short Runaround" },
    { id: ObjectId("5efba1310a85e03020e41269"), name: "Wine Runaround " },
  ],
  "Himrod Line": [
    { id: ObjectId("5f04dd200a85e03020e412fe"), name: "Cargill Runaround Track" },
    { id: ObjectId("5f04dd4e0a85e03020e412ff"), name: "Cargill Salt Lead" },
    { id: ObjectId("5f04ddab0a85e03020e41301"), name: "Falls Stub Track" },
    { id: ObjectId("5f04dec60a85e03020e41303"), name: "US Salt Runaround Track" },
    { id: ObjectId("5f04defc0a85e03020e41304"), name: "US Salt Track" },
    { id: ObjectId("5f04df3c0a85e03020e41305"), name: "Track 1" },
    { id: ObjectId("5f04df5d0a85e03020e41306"), name: "Track 2" },
    { id: ObjectId("5f04d7860a85e03020e412de"), name: "Randall Stub Track" },
    { id: ObjectId("5f04d7cc0a85e03020e412df"), name: "Connector Track" },
    { id: ObjectId("5f04d7f50a85e03020e412e0"), name: "Junction Stub Track" },
  ],
  "Kendaia Line": [
    { id: ObjectId("5ed81e48d7174e2fa0423a14"), name: "Track 3" },
    { id: ObjectId("5ed81e28d7174e2fa0423a13"), name: "Track 2" },
    { id: ObjectId("5ed81e04d7174e2fa0423a12"), name: "Track 1" },
  ],
  "Victor Line": [
    { id: ObjectId("5f04d2660a85e03020e412c9"), name: "West Victor Runaround Track" },
    { id: ObjectId("5f04d2010a85e03020e412c7"), name: "Victor Industrial Track" },
    { id: ObjectId("5f04d1ab0a85e03020e412c6"), name: "Victor Runaround Track" },
    { id: ObjectId("5f04d1510a85e03020e412c5"), name: "NVR Track" },
    { id: ObjectId("5f04d11f0a85e03020e412c4"), name: "Manchester Team Track" },
    { id: ObjectId("5f04d0f50a85e03020e412c3"), name: "Old T&K Track" },
    { id: ObjectId("5f04d0b90a85e03020e412c2"), name: "Shortsville Runaround Track" },
  ],
};
