import * as permitTypes from "../../config/permissions";
let controller = require("./WorkOrder.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");
router.get("/", [isAuthenticated, isAllowed(permitTypes.READ_WORKORDER)], controller.all);
router.get("/location/:id", [isAuthenticated, isAllowed(permitTypes.READ_WORKORDER)], controller.locationWO);
router.get("/multiLines", [isAuthenticated, isAllowed(permitTypes.READ_WORKORDER)], controller.multiLine);
router.get("/notStarted", [isAuthenticated, isAllowed(permitTypes.READ_WORKORDER)], controller.notStarted);
router.get("/:id", [isAuthenticated, isAllowed(permitTypes.READ_WORKORDER)], controller.show);
router.post("/", [isAuthenticated, isAllowed(permitTypes.CREATE_WORKORDER)], controller.create);
router.post("/mr", [isAuthenticated, isAllowed(permitTypes.CREATE_WORKORDER)], controller.createByMaintenanceRequest);
router.put("/:id", [isAuthenticated, isAllowed(permitTypes.UPDATE_WORKORDER)], controller.update);
router.delete("/:id", [isAuthenticated, isAllowed(permitTypes.DELETE_WORKORDER)], controller.delete);

module.exports = router;
