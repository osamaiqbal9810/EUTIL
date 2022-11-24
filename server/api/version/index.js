/**
 * Created by zqureshi on 10/12/2018.
 */
import * as permitTypes from '../../config/permissions';
let controller = require('./version.controller');
let isAuthenticated = require('../../auth/auth');
let express = require('express');
let router = express.Router();
let rateLimit = require('express-rate-limit');

// Permission Validation
//let isAllowed = require('../../middlewares/validatePermission');
//var  permitTypes =require('../../config/permissions').default;
const rateLimiter = rateLimit({windowMs: 1000, max: 1}); // only 1 call per second allowed for this open (not requiring authentication) api to prevent unwanted bombarment.
router.get('/', rateLimiter,  controller.show);

module.exports = router;