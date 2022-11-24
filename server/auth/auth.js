let jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
let config = require("../config/environment/index"); // get our config file
let User = require("../api/user/user.model");
let tenantInfo = require("../utilities/tenantInfo");

function isAuthenticated(req, res, next) {
    let token = req.headers["authorization"];
    let tenantId = tenantInfo.getTenantId(req.hostname);
    if (!token) {
        res.status(401);
        return res.send({ message: "No token provided." });
    }
    jwt.verify(token, config.secrets.session, function(err, decoded) {
        if (err) {
            res.status(401);
            return res.send({ message: "Failed to authenticate token." });
        }
        User.findOne({ _id: decoded.userId, tenantId: tenantId }, (err, user) => {
            console.log(user)
            if (err) {
                res.status(500);
                return res.send("Problem retrieving User from Database!");
            }
            if (!user) {
                res.status(404);
                return res.send("User Not Found");
            } else {
                req.user = user;
                next();
            }
        }).populate({
            path: "userGroup",
            select: ["name", "isAdmin", "level"],
            populate: { path: "permissions", select: ["resource", "action", "name"] },
        });
    });
}

module.exports = isAuthenticated;
