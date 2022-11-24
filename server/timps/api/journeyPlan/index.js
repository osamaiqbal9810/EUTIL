import * as permitTypes from "../../../config/permissions";

let controller = require("./journeyPlan.controller");
let isAuthenticated = require("../../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../../middlewares/validatePermission");

router.get("/multiLines", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.multiLine);
router.get("/issue", [isAuthenticated, isAllowed(permitTypes.VIEW_ISSUE)], controller.getIssues);

router.get("/:id", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.find);

router.get("/:jPId/issue/:issueId", [isAuthenticated, isAllowed(permitTypes.VIEW_ISSUE)], controller.getJourneyIssueById);
router.get("/", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.all);
router.get("/report/:id", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.report);
router.post("/report", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], controller.inspections);
router.post("/issue", [isAuthenticated, isAllowed(permitTypes.UPDATE_ISSUE)], controller.updateIssue);
router.put("/issue/:id", [isAuthenticated, isAllowed(permitTypes.UPDATE_ISSUE)], controller.updateIssue);
router.post("/issueWorkorder", [isAuthenticated, isAllowed(permitTypes.UPDATE_ISSUE)], controller.issueWorkorder);
router.post("/", [isAuthenticated, isAllowed(permitTypes.CREATE_WORKPLAN)], controller.create);
router.put("/:id", [isAuthenticated, isAllowed(permitTypes.UPDATE_WORKPLAN)], controller.update);
router.delete("/:id", [isAuthenticated, isAllowed(permitTypes.DELETE_WORKPLAN)], controller.delete);

module.exports = router;
