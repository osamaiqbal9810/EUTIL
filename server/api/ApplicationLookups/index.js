/**
 * Created by zqureshi on 10/12/2018.
 */
import * as permitTypes from "../../config/permissions";
let controller = require("./ApplicationLookups.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");

//var  permitTypes =require('../../config/permissions').default;

router.get("/", [isAuthenticated], controller.show);
router.get("/assetTypeTests/:mode", [isAuthenticated], controller.getAssetTypeTests);
router.get("/:lists", [isAuthenticated], controller.show);
router.get("/getlist/:listname", [isAuthenticated], controller.getList);
router.get("/:listName/:codes", [isAuthenticated], controller.getCodes);
router.get("/:id", [isAuthenticated], controller.find);
router.put("/globalGeoLogging", [isAuthenticated], controller.updateGeoLogging);
router.post("/language", [isAuthenticated], controller.updateLanguage);
router.put("/languageedit", [isAuthenticated], controller.editLanguage);
router.delete("/languagedelete", [isAuthenticated], controller.deleteLanguage);
router.put("/:id", [isAuthenticated], controller.update);
router.post("/", [isAuthenticated], controller.create);
router.delete("/:id", [isAuthenticated], controller.delete);

module.exports = router;
