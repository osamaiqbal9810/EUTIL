/**
 * Created by zqureshi on 8/30/2018.
 */
let controller = require('./attendance.controller');
let isAuthenticated = require('../../auth/auth');
let express = require('express');
let router = express.Router();

router.post('/', controller.create);
router.get('/:id', controller.read);
router.get('/custom/:id', controller.customQuery);
router.put('/:id', controller.update);

module.exports = router;