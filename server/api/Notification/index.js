import * as permitTypes from "../../config/permissions";
import isAllowed from "../../middlewares/validatePermission";
let controller = require("./Notification.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation

router.get("/", [isAuthenticated], controller.loggedInUserNotifications);
router.put("/:id", [isAuthenticated], controller.update);
router.delete("/:id", [isAuthenticated], controller.delete);

module.exports = router;
