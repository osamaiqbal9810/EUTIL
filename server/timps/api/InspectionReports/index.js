import * as permitTypes from "../../../config/permissions";

let controller = require("./InspectionReports.controller");
let isAuthenticated = require("../../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../../middlewares/validatePermission");

router.get("/assetsReports", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.assetsReports);

module.exports = router;
