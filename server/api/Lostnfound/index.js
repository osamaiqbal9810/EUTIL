/**
 * Created by iahmed on 7/3/2022.
 */
 let controller = require('./lostnfound.controller');
 let isAuthenticated = require('../../auth/auth');
 let express = require('express');
 let router = express.Router();
 
 // Permission Validation
 let isAllowed = require('../../middlewares/validatePermission');
 
 router.get('/', [isAuthenticated], controller.getAll);
 router.delete('/:id/', [isAuthenticated], controller.deleteOne);
 router.put('/:id/', [isAuthenticated], controller.updateOne); 
 
 module.exports = router;