import * as permitTypes from "../../../config/permissions";

let controller = require("./track.controller");
let isAuthenticated = require("../../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../../middlewares/validatePermission");

//var  permitTypes =require('../../config/permissions').default;

router.get("/", [isAuthenticated, isAllowed(permitTypes.READ_TRACK)], controller.all);
router.get("/:id", [isAuthenticated, isAllowed(permitTypes.READ_TRACK)], controller.find);
router.post("/", [isAuthenticated], isAllowed(permitTypes.CREATE_TRACK), controller.create);
router.post("/:id", [isAuthenticated], isAllowed(permitTypes.CREATE_TRACK), controller.createTemplate);
router.put("/:id", [isAuthenticated, isAllowed(permitTypes.UPDATE_TRACK)], controller.update);
router.delete("/:id", [isAuthenticated, isAllowed(permitTypes.DELETE_TRACK)], controller.delete);

module.exports = router;
