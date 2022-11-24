/**
 * Created by zqureshi on 11/8/2017.
 */
"use strict";
let express = require("express");
let router = express.Router();
let User = require("../../api/user/user.model");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
let config = require("../../config/environment/index");
let tenantInfo = require("../../utilities/tenantInfo");
let ServiceLocator = require("../../framework/servicelocator");
import * as permitTypes from "../../config/permissions";
import { unitsFactors } from "@turf/turf";

let loginUser = async function(req, res, next) {
  let tenantId = tenantInfo.getTenantId(req.hostname);

  //console.log(tenantId);
  //let user= await User.findOne({tenantId:'ps19'}).populate({path:'userGroup',populate :{path: 'permissions'}}).exec();
  User.findOne({ tenantId: tenantId, email: req.body.user.email }, function(err, result) {
    if (err) return res.send({ "Error on the server.": err });
    if (!result) {
      res.status(403);
      return res.send("No user found.");
    }
    if (result.isRemoved) {
      res.status(404);
      return res.send("No user found.");
    }
    if (!result.active) {
      res.status(403);
      return res.send("User is not active");
    }
    let passwordIsValid = bcrypt.compareSync(req.body.user.password, result.hashedPassword);
    if (!passwordIsValid) {
      res.status(401);
      return res.send("Invalid Password");
    }
    let token = jwt.sign({ userId: result._id }, config.secrets.session, {
     // expiresIn: '10 days', // 86400, // expires in 24 hours
    });
    let userHoursModel = ServiceLocator.resolve("UserHours");

    //===== result.userHours will not work becuase userHours attribute not added in user model =====//
    userHoursModel.findOne({ userId: result._id }, (err, userHoursDoc) => {
      if (userHoursDoc) {
        result.userHours = userHoursDoc;
      }

      let AssetsModel = ServiceLocator.resolve("AssetsModel");

      AssetsModel.findOne({_id: result.assignedLocation}, async (err, assignedLocation) => {
        if(assignedLocation) {
          result.assignedLocationName = assignedLocation.unitId;
        }

        // Pull user notifications
        const notificationService = ServiceLocator.resolve('NotificationService');
        let notifications = await notificationService.pullNotificationForUser(result._id);

        const versionService = ServiceLocator.resolve('VersionService');
        let versionInfo = await versionService.getVersionInfo();

        return res.send({ result, token, notifications, versionInfo });
      })
    });

    //return res.send({result, token, permissions: permitTypes});
  }).populate({
    path: "userGroup",
    select: ["name", "isAdmin", "level", "group_id"],
    populate: { path: "permissions", select: ["resource", "action", "name"] },
  });
};

router.post("/", loginUser);
module.exports = router;
