import * as permitTypes from "../../../config/permissions";

let isAuthenticated = require("../../../auth/auth");
let express = require("express");
let router = express.Router();
let wPlanSchedules = require("./wPlanSchedules.model");
// Permission Validation
let isAllowed = require("../../../middlewares/validatePermission");

//var  permitTypes =require('../../config/permissions').default;

router.get("/", [isAuthenticated, isAllowed(permitTypes.READ_WORKPLAN)], getAllOfTemplate);

module.exports = router;

function getAllOfTemplate(templateId) {
  wPlanSchedules.find().exec(async function (err, plan) {
    let plans = await getplans(req.user, plan);
    if (err) {
      return handleError(res, err);
    }
    let data = [];
    for (let p of plans) {
      data = [...data, plans.inspectionSchedules];
    }
    res.status(200);
    res.json(data);
  });
}
