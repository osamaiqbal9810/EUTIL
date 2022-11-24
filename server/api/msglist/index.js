/**
 * Created by zqureshi on 10/12/2018.
 */
import * as permitTypes from '../../config/permissions';
let controller = require('./msglist.controller');
let isAuthenticated = require('../../auth/auth');
let express = require('express');
let router = express.Router();

// Permission Validation
let isAllowed = require('../../middlewares/validatePermission');

//var  permitTypes =require('../../config/permissions').default;
// router.get('/:id', [isAuthenticated], controller.show);
router.post('/', [isAuthenticated], controller.addOrUpdate); //router.put('/:id', [isAuthenticated], controller.update);

module.exports = router;