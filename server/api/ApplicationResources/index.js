/**
 * Created by zqureshi on 10/12/2018.
 */
import * as permitTypes from "../../config/permissions";
let controller = require("./ApplicationResources.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();
let multer = require("multer");
let path = require("path");
let config = require("../../config/environment");

// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");
//var  permitTypes =require('../../config/permissions').default;

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, config.uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage: storage });

let audioStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, config.audioPath);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
// asset image and asset document
let assetImgStorage = multer.diskStorage({
  destination:function(req, file, cb){ cb(null, config.assetImages);},
  filename: function(req, file, cb){ cb(null, file.originalname);}
});
let uploadAssetImg = multer({ storage: assetImgStorage });

let assetDocStorage = multer.diskStorage({
  destination:function(req, file, cb){ cb(null, config.assetDocuments);},
  filename: function(req, file, cb){ cb(null, file.originalname);}
});
let uploadAssetDoc = multer({storage: assetDocStorage});


let uploadAudio = multer({ storage: audioStorage });
router.get("/", [isAuthenticated], controller.show);
router.get("/showAssetImgs", [isAuthenticated], controller.showAssetImgs);
router.get("/showAssetDocuments", [isAuthenticated], controller.showAssetDocuments);
router.post("/uploadsingle", upload.single("file"), controller.uploadSingle);
router.post("/upload", upload.any(), controller.upload);
router.post("/uploadaudio", uploadAudio.any(), controller.uploadAudio);
// Asset images and document uploads
router.post("/uploadassetimage", uploadAssetImg.single("file"), controller.uploadAssetImage);
router.post("/uploadassetdocument", uploadAssetDoc.single("file"), controller.uploadAssetDocument);

module.exports = router;
