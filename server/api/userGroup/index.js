let express = require("express");
import * as permitTypes from "../../config/permissions";
let controller = require("./userGroup.controller");
let isAuthenticated = require("../../auth/auth");

let router = express.Router();

// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");

router.get("/", isAuthenticated, controller.index);
router.put("/:id", [isAuthenticated, isAllowed(permitTypes.USER_GROUP_UPDATE)], controller.update);

module.exports = router;
