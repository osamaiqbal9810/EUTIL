import * as permitTypes from "../../../config/permissions";

let controller = require("./testSchedules.controller");
let isAuthenticated = require("../../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../../middlewares/validatePermission");
router.get("/", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.getReportFilter);
router.get("/getReportFilter", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.getReportFilter);

module.exports = router;
