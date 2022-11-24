import * as permitTypes from "../../config/permissions";

let controller = require("./dashboard.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();
// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");

router.get("/", [isAuthenticated, isAllowed(permitTypes.VIEW_DASHBOARD)], controller.all);

module.exports = router;
