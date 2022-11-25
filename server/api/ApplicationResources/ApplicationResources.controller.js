/**
 * Created by zqureshi on 10/12/2018.
 */
let _ = require("lodash");
let fs = require("fs");
let config = require("../../config/environment");
let path = require("path");
let crypto = require("crypto");
// let thumb = require('node-thumbnail').thumb;
// let Jimp = require('jimp');
const configs = require('../../config/environment/index')
let ServiceLocator = require("../../framework/servicelocator");
//let ApplicationResourcesModel = require("./ApplicationResouces.model");

exports.show = function (req, res, next) {
  fs.readdir(config.uploadPath, function (err, items) {
    if (items === undefined) {
      items = [];
    }
    items = items.filter(function (value, index, arr) {
      return value != "thumbnails";
    });
    res.status(200);
    res.json(items);
  });
};

exports.showAssetImgs = function (req, res, next) {
  fs.readdir(config.assetImages, function (err, items) {
    if (items === undefined) {
      items = [];
    }
    items = items.filter(function (value, index, arr) {
      return value != "thumbnails";
    });
    res.status(200);
    res.json(items);
  });
};

exports.showAssetDocuments = function (req, res, next) {
  fs.readdir(config.assetDocuments, function (err, items) {
    if (items === undefined) {
      items = [];
    }
    res.status(200);
    res.json(items);
  });
};

exports.upload = function (req, res, next) {
  let files = req.files;
  let md5 = req.body.name;
  for (let i = 0; i < files.length; i++) {
    let fileObj = files[i];
    if (fileObj) {
      let file = fileObj.path;
      var md5Sum = crypto.createHash("md5");
      let s = fs.ReadStream(file);
      s.on("data", function (d) {
        md5Sum.update(d);
      });
      s.on("end", function () {
        // let tnHelper = ServiceLocator.resolve("ThumbnailHelper");
        // tnHelper.syncThumbnails(
        //   config.uploadPath,
        //   config.thumbnailsPath,
        //   {},
        //   {
        //     success: m => {
        //       //console.log(".");// + m); //thumbnail success:
        //     },
        //     error: m => {
        //       //console.log(".");//+ m); //thumbnail error:  // todo: log through logger in file
        //     },
        //   },
        // );
        let md5SumVerify = md5Sum.digest("hex");
        if (md5 === "" || md5SumVerify === md5) {
          res.status(201);
        } else {
          res.status(400);
          return res.json("md5 mismatch");
        }
        return res.json("saved");
      });
    }
  }
};
exports.uploadAudio = function (req, res, next) {
  let files = req.files;
  for (let i = 0; i < files.length; i++) {
    let fileObj = files[i];
    if (fileObj) {
      let file = fileObj.path;
      let s = fs.ReadStream(file);
      s.on("data", function (d) {});
      s.on("end", function () {
        res.status(201);
        return res.json("saved");
      });
    }
  }
};

exports.uploadSingle = function (req, res, next) {
  let file = req.file;

  if (file) {
    let s = fs.ReadStream(file.path);
    s.on("data", function (d) {});
    s.on("end", function () {
      // let tnHelper = ServiceLocator.resolve("ThumbnailHelper");
      // tnHelper.syncThumbnails(
      //   config.uploadPath,
      //   config.thumbnailsPath,
      //   {},
      //   {
      //     success: m => {
      //       //console.log(".");//+ m); //thumbnail success:
      //     },
      //     error: m => {
      //       //console.log(".");// + m); //thumbnail error: // todo: log throguh logger in file.
      //     },
      //   },
      // );
      res.status(201);
      return res.json("saved");
    });
  }
};
exports.uploadAssetImage = function (req, res, next) {
  let file = req.file;

  if (file) {
    let s = fs.ReadStream(file.path);
    s.on("data", function (d) {});
    s.on("end", function () {
      // let tnHelper = ServiceLocator.resolve("ThumbnailHelper");
      // tnHelper.syncThumbnails(
      //   config.uploadPath,
      //   config.thumbnailsPath,
      //   {},
      //   {
      //     success: m => {
      //       console.log("thumbnail success: " + m);
      //     },
      //     error: m => {
      //       console.log("thumbnail error: " + m);
      //     },
      //   },
      // );
      res.status(201);
      return res.json("saved");
    });
  }
};
exports.uploadAssetDocument = function (req, res, next) {
  let file = req.file;

  if (file) {
    let s = fs.ReadStream(file.path);
    s.on("data", function (d) {});
    s.on("end", function () {
      res.status(201);
      return res.json("saved");
    });
  }
};

exports.uploadEquipmentData = function(req, res, next) {
  let file = req.file;
  console.log('uploadAPI:',{req});
  if(file) {
    let s = fs.ReadStream(file.path);
    s.on("data", function (d) {});
    s.on("end", function () {
      res.status(201);
      return res.json("saved");
    });
  }
}

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}


exports.getAssetEquipmentData = async function (req, res) {
  let {filename} = req.params;
  console.log(`download asset equipment data file: ${filename}`);
  try {
    const fileURL = `${configs.assetEquipmentData}\\${filename}`;
    res.download(fileURL);
  } catch (e) {
    console.error(e)
    res.status(404).end();
  }
};