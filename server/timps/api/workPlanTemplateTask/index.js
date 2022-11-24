import * as permitTypes from "../../../config/permissions";
import isAllowed from "../../../middlewares/validatePermission";
let controller = require("./workPlanTemplateTask.controller");
let isAuthenticated = require("../../../auth/auth");
let express = require("express");
let router = express.Router();

//var  permitTypes =require('../../config/permissions').default;
router.post("/", [isAuthenticated, isAllowed(permitTypes.CREATE_INSPECTION_TASK)], controller.create);
router.put("/:id", [isAuthenticated, isAllowed(permitTypes.UPDATE_INSPECTION_TASK)], controller.update);
router.delete("/:id", [isAuthenticated, isAllowed(permitTypes.DELETE_INSPECTION_TASK)], controller.delete);

module.exports = router;
