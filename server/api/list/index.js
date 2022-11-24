/**
 * Created by zqureshi on 10/12/2018.
 */
import * as permitTypes from '../../config/permissions';
let controller = require('./list.controller');
let isAuthenticated = require('../../auth/auth');
let express = require('express');
let router = express.Router();

// Permission Validation
let isAllowed = require('../../middlewares/validatePermission');

//var  permitTypes =require('../../config/permissions').default;

router.get('/pull/:z/', [isAuthenticated], controller.pull);
router.get('/pull/:z/:timestamp/', [isAuthenticated], controller.pull);
router.get('/summary/', controller.summary); //todo add [isAuthenticated]
router.get('/:listName/:z/:timestamp/',[isAuthenticated], controller.show);
router.get('/:listName/:z/', [isAuthenticated], controller.show);

//router.get('/:listName/:timestamp', [isAuthenticated], controller.show);
//router.put('/:id', [isAuthenticated], controller.update);

module.exports = router;