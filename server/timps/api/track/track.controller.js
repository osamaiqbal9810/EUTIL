let Track = require("./track.model");
//import WorkplanTemplateCreatorService from "../../service/WPTService.js";
let ServiceLocator = require("../../../framework/servicelocator");
//import ValidationUtils from "../../utilities/ValidationUtils";
exports.all = function(req, res, next) {
  Track.find({ isRemoved: false }).exec(function(err, tracks) {
    let filteredTracks = [];
    let adminCheck = req.user.isAdmin;
    let subdivisionUser = req.user.subdivision;
    if (!adminCheck && subdivisionUser) {
      tracks.forEach(track => {
        if (subdivisionUser == track.subdivision) {
          filteredTracks.push(track);
        }
      });
    } else {
      filteredTracks = tracks;
    }
    if (err) {
      return handleError(res, err);
    }
    res.status(200);
    res.json(filteredTracks);
  });
};

exports.find = function(req, res, next) {
  Track.findOne({ _id: req.params.id }).exec(function(err, track) {
    if (err) {
      return handleError(res, err);
    }
    res.status(200);
    res.json(track);
  });
};

exports.create = function(req, res, next) {
  let newTrack = new Track(req.body.track);
  newTrack.save(function(err, track) {
    if (err) return handleError(res, err);
    res.status(200);
    return res.json(track);
  });
};
exports.update = function(req, res, next) {
  Track.findOne({ _id: req.params.id }).exec(function(err, track) {
    if (err) {
      return handleError(res, err);
    }
    track.title = req.body.title;
    track.start = req.body.start;
    track.end = req.body.end;
    track.length = req.body.length;
    track.trackType = req.body.trackType;
    track.trafficType = req.body.trafficType;
    track.weight = req.body.weight;
    track.class = req.body.class;
    track.units = req.body.units;
    track.save(async function(err, track) {
      if (err) {
        return next(err);
      }
      if (track.templateCreated) {
        let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
        let result = await workPlanTemplateService.updateTemplateOnAssetGroupUpdate(track);
        if (result.status == 200) {
          res.status(200);
          return res.json(track);
        } else {
          res.status(500);
          return res.send("Workplan Not Updated");
        }
      } else {
        res.status(200);
        return res.json(track);
      }
    });
  });
};
exports.delete = function(req, res, next) {
  Track.findOne({ _id: req.params.id }, (err, track) => {
    if (err) {
      return handleError(res, err);
    }
    if (!track) {
      res.status(404);
      return res.json("Track Not Found");
    }
    track.isRemoved = true;
    track.save(function(err, track) {
      if (err) {
        return next(err);
      }
      res.status(200);
      return res.json(track);
    });
  });
};

exports.createTemplate = async function(req, res, next) {
  let WorkplanTemplateService = ServiceLocator.resolve("WorkplanTemplateService");
  let AssetGroupModel = ServiceLocator.resolve("TrackModel");
  let template = await WorkplanTemplateService.buildWorkplanTemplate(req.body, req.user);
  try {
    let assetGroup = await AssetGroupModel.findById(req.body._id).exec();
    if (template && !assetGroup.templateCreated) {
      let workPlanModel = ServiceLocator.resolve("WorkPlanTemplateModel");
      let newTemplate = new workPlanModel(template);
      try {
        newTemplate.nextInspectionDate = new Date();
        newTemplate.nextInspectionDate.setDate(newTemplate.nextInspectionDate.getDate() + newTemplate.inspectionFrequency);
        let saved = await newTemplate.save();

        try {
          //let updateAssetGroup = await AssetGroupModel.findByIdAndUpdate(req.body._id, { $set: { templateCreated: newTemplate.id } });
          assetGroup.templateCreated = newTemplate.id;
          let savedAssetGroup = await assetGroup.save();
          res.status(202);
          res.json(savedAssetGroup);
        } catch (err) {
          console.log(err);
          handleError(res, err);
        }
      } catch (err) {
        handleError(res, err);
      }
    } else {
      res.status(404);
      res.send("Can Not Create Workplan from given AssetGroup");
    }
  } catch (errorFind) {
    res.status(404);
    console.log(errorFind);
    res.send("Can Not Find AssetGroup");
  }
};

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}
