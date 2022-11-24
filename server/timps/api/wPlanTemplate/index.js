import * as permitTypes from "../../../config/permissions";

let controller = require("./wPlanTemplate.controller");
let isAuthenticated = require("../../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../../middlewares/validatePermission");

//var  permitTypes =require('../../config/permissions').default;

router.get("/", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.all);
router.get("/userstemplate/:users", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.usersTemplate);
router.get("/:id", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.find);
router.post("/", [isAuthenticated, isAllowed(permitTypes.CREATE_WORKPLAN)], controller.create);
router.put("/", [isAuthenticated, isAllowed(permitTypes.WORKPLAN_SORTING)], controller.updateTemplatesPlanPrioritySorting);
router.put("/updatefutureInspection", [isAuthenticated, isAllowed(permitTypes.UPDATE_WORKPLAN)], controller.updateTemplatesTempChanges);
router.put("/:id", [isAuthenticated, isAllowed(permitTypes.UPDATE_WORKPLAN)], controller.update);
router.delete("/:id", [isAuthenticated, isAllowed(permitTypes.DELETE_WORKPLAN)], controller.delete);

module.exports = router;
