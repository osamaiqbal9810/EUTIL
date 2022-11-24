let User = require('../api/user/user.model');
let _ = require('lodash');

function isAllowed(permission) {
    return function (req, res, next) {
        //next();
        //return ;
        let permissions=req.user.userGroup.permissions || [];
        if(_.find(permissions, {resource: permission.resource , action: permission.action})){
        //if (_.includes(req.user.permissions, permission)) {
            next();
        }
        else {
            res.status(403);
            return res.send("You don't have permission");
        }
    };
}
module.exports = isAllowed;