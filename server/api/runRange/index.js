import * as permitTypes from "../../config/permissions";
let express = require("express");
let router = express.Router();
let controller = require("./runRange.controller");
let isAuthenticated = require("../../auth/auth");
// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");

// router.get("/", [isAuthenticated], controller.all);
// router.get("/:id", [isAuthenticated], controller.read);
router.post("/", [isAuthenticated, isAllowed(permitTypes.CREATE_RUN_RANGE)], controller.create);
// router.post("/:id", [isAuthenticated], isAllowed(permitTypes.CREATE_TRACK), controller.createTemplate);
router.put("/:id", [isAuthenticated, isAllowed(permitTypes.CREATE_RUN_RANGE)], controller.update);
// router.delete("/:id", [isAuthenticated, isAllowed(permitTypes.DELETE_TRACK)], controller.delete);

module.exports = router;
