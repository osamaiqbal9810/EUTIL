import * as permitTypes from "../../config/permissions";
let express = require("express");
let router = express.Router();
let controller = require("./assets.controller");
let isAuthenticated = require("../../auth/auth");
// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");

//var  permitTypes =require('../../config/permissions').default;
router.get("/location/:id", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.getLocationSetup);
router.get("/getAssetTypesAsset/:assetObj", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.getAssetTypeAssets);
router.get("/getLines", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.getParentLines);
router.post("/getLinesWithSelf", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.getParentLinesWithSelf);
router.get("/getAssetsForLine", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.getAssetsForLine);
router.get("/getInspectableAssets", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.getInspectableAssets);
router.get("/getUnAssignedAssets", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.getUnAssignedAssets);
router.get("/getAssetTree", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.getAssetTree);
router.get("/", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.all);
router.get("/multiLines", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.multiLine);
// router.get("/:line", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.all);
router.get("/:id", [isAuthenticated, isAllowed(permitTypes.READ_ASSET)], controller.find);
router.post("/", [isAuthenticated], isAllowed(permitTypes.CREATE_ASSET), controller.create);

// todo change permission to import permission instead of this create one
router.post("/multiple", [isAuthenticated], isAllowed(permitTypes.CREATE_ASSET), controller.createMultiple);

// router.post("/:id", [isAuthenticated], isAllowed(permitTypes.CREATE_ASSET), controller.createTemplate);
router.put("/multi", [isAuthenticated, isAllowed(permitTypes.UPDATE_ASSET)], controller.updateMultipleAssets);
router.put("/location/:id", [isAuthenticated, isAllowed(permitTypes.UPDATE_ASSET)], controller.updateLocationSetup);

router.put("/:id", [isAuthenticated, isAllowed(permitTypes.UPDATE_ASSET)], controller.update);

router.delete("/:id", [isAuthenticated, isAllowed(permitTypes.DELETE_ASSET)], controller.delete);
module.exports = router;
