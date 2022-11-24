import * as permitTypes from "../../config/permissions";
let express = require("express");
let router = express.Router();
let controller = require("./run.controller");
let isAuthenticated = require("../../auth/auth");
// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");

router.get("/", [isAuthenticated, isAllowed(permitTypes.VIEW_RUN)], controller.all);
router.get("/runLines", [isAuthenticated, isAllowed(permitTypes.VIEW_RUN)], controller.lineRuns);
router.get("/:id", [isAuthenticated, isAllowed(permitTypes.VIEW_RUN)], controller.read);
router.post("/", [isAuthenticated, isAllowed(permitTypes.CREATE_RUN)], controller.create);
router.delete("/:id", [isAuthenticated, isAllowed(permitTypes.DELETE_RUN)], controller.delete);

// router.post("/:id", [isAuthenticated], isAllowed(permitTypes.CREATE_TRACK), controller.createTemplate);
// router.put("/:id", [isAuthenticated, isAllowed(permitTypes.UPDATE_TRACK)], controller.update);

module.exports = router;
