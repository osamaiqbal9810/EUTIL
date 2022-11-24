import * as permitTypes from "../../config/permissions";
import isAllowed from "../../middlewares/validatePermission";
let controller = require("./Maintenance.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation

router.get("/", [isAuthenticated, isAllowed(permitTypes.READ_MAINTENANCE)], controller.all);
router.get("/multiLines", [isAuthenticated, isAllowed(permitTypes.READ_MAINTENANCE)], controller.multiLine);
router.get("/:id", [isAuthenticated, isAllowed(permitTypes.READ_MAINTENANCE)], controller.show);
router.post("/", [isAuthenticated, isAllowed(permitTypes.CREATE_MAINTENANCE)], controller.createWeb);
//router.post("/issue",[isAuthenticated, isAllowed(permitTypes.CREATE_MAINTENANCE)], controller.createByIssue);
//router.get('/pull/:z/', [isAuthenticated], controller.pull);
//router.get('/pull/:z/:timestamp/', [isAuthenticated], controller.pull);
//router.get('/:listName/:timestamp', [isAuthenticated], controller.show);
router.put("/:id", [isAuthenticated, isAllowed(permitTypes.UPDATE_MAINTENANCE)], controller.updateWeb);

module.exports = router;
