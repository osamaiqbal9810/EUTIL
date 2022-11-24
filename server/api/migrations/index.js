import * as permitTypes from "../../config/permissions";
import isAllowed from "../../middlewares/validatePermission";
let controller = require("./migrations.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();
function checkforFixUser()
{
    return function(req, res, next){
        if(req && req.user && req.user.userGroup && req.user.isAdmin && req.user.userGroup.isAdmin && req.user.email==='superadmin@timps.com')
        {
            next();
        }
        else
        {
            res.status(403);
            return res.send("Unauthorized");
        }
    }
}
// Permission Validation

router.get("/", [isAuthenticated, checkforFixUser(), isAllowed(permitTypes.CREATE_MAINTENANCE)], controller.all);
router.post("/",[isAuthenticated, checkforFixUser(), isAllowed(permitTypes.CREATE_MAINTENANCE)], controller.execute);

module.exports = router;
