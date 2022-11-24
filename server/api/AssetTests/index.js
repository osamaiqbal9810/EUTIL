import * as permitTypes from "../../config/permissions";

let controller = require("./assetTests.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");

router.get("/:id", [isAuthenticated], controller.find);

module.exports = router;
