import * as permitTypes from "../../config/permissions";
let controller = require("./GpsLog.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");
router.get(
  "/:line",
  [isAuthenticated, isAllowed(permitTypes.READ_MAINTENANCE)],
  controller.all
);
router.get(
  "/line/:id",
  [isAuthenticated, isAllowed(permitTypes.READ_MAINTENANCE)],
  controller.show
);
//router.get('/pull/:z/', [isAuthenticated], controller.pull);
//router.get('/pull/:z/:timestamp/', [isAuthenticated], controller.pull);
//router.get('/:listName/:timestamp', [isAuthenticated], controller.show);
//router.put('/:id', [isAuthenticated], controller.update);

module.exports = router;
