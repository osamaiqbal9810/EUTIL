/**
 * Express configuration
 */

'use strict';

let express = require('express');
let favicon = require('serve-favicon');
let morgan = require('morgan');
let compression = require('compression');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
//let cookieParser = require('cookie-parser');
//let errorHandler = require('errorhandler');
let path = require('path');
let config = require('./environment');
//let passport = require('passport');

module.exports = function (app) {
    let env = app.get('env');

    app.set('views', config.root + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(compression());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    // app.use(cookieParser());
    // app.use(passport.initialize());
    if ('production' === env) {
        app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'public')));
        app.use(express.static(path.join(config.root, config.uploadPath)));
        app.set('appPath', path.join(config.root, 'public'));
        app.use(morgan('dev'));
    }

    if ('development' === env || 'test' === env) {
        //app.use(require('connect-livereload')()); // iahmed: this middleware was causing .tar.gz file to be corrupt at download
        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'client')));
        app.use(express.static(path.join(config.root, config.uploadPath)));
        app.set('appPath', path.join(config.root, 'client'));
        app.use(morgan('dev'));
        //app.use(errorHandler()); // Error handler - has to be last
    }
};