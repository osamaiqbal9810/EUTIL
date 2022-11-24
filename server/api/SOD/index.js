/**
 * Created by zqureshi on 10/12/2018.
 */
import * as permitTypes from '../../config/permissions';
let controller = require('./SOD.controller');
let isAuthenticated = require('../../auth/auth');
let express = require('express');
let router = express.Router();

// Permission Validation
let isAllowed = require('../../middlewares/validatePermission');

//var  permitTypes =require('../../config/permissions').default;

router.get('/', [isAuthenticated], controller.show);
router.delete('/:id', [isAuthenticated], controller.destroy);

module.exports = router;