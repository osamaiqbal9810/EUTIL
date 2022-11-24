
//var indexRouter = require('./index');
let api_routes = require('./api-routes');
//let fallback = require('express-history-api-fallback');

let express = require('express');
let path = require('path');

module.exports = function(app) {
	app.use('/api', api_routes);
	//app.get('/',  indexRouter );
};

