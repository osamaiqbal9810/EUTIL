import * as permitTypes from "../../config/permissions";

let controller = require("./permission.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");

//var  permitTypes =require('../../config/permissions').default;

router.get("/", [isAuthenticated], controller.all);
//router.get("/:id", [isAuthenticated], controller.find);
router.post("/", [isAuthenticated], controller.create);
router.put("/:id", [isAuthenticated], controller.update);
//router.delete("/:id", [isAuthenticated], controller.delete);

module.exports = router;
