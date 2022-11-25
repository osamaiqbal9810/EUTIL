import * as permitTypes from "../../config/permissions";

let controller = require("./assetTests.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");
router.get("/aTypeFreqTests", [isAuthenticated], controller.testsByAssetTypeAndFreq);
router.get("/:id", [isAuthenticated], controller.find);
router.put("/disableMulti", [isAuthenticated], controller.updateActiveMultiple);

module.exports = router;
