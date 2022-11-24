import * as permitTypes from "../../config/permissions";
import isAllowed from "../../middlewares/validatePermission";
let controller = require("./Alert.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation

router.get("/", [isAuthenticated, isAllowed(permitTypes.READ_MAINTENANCE)], controller.all);

module.exports = router;
