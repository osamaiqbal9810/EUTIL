import * as permitTypes from "../../../config/permissions";

let controller = require("./ATIVData.controller");
let isAuthenticated = require("../../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../../middlewares/validatePermission");

// todo add permissions
router.get("/", [isAuthenticated], controller.getAll);
router.delete("/:id", [isAuthenticated], controller.delete);
router.post("/", [isAuthenticated], controller.create);
router.put("/:id", [isAuthenticated], controller.addToWorkplan);

module.exports = router;
