'use strict';

var express = require('express'),
    exSession = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    morgan = require('morgan'),
    serveStatic = require('serve-static'),
    path = require('path'),
    config = require('./config'),
    passport = require('passport'),
    mongoStore = require('connect-mongo')(exSession);

/**
 * Express configuration
 */
module.exports = function (app, options) {

  var env = process.env.NODE_ENV || 'development';
  if ('development' !== env) {
    app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(serveStatic(path.join(config.root, 'public')));
    app.set('views', config.root + '/views');
  } else {
    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(serveStatic(path.join(config.root, '.tmp')));
    app.use(serveStatic(path.join(config.root, 'client')));
    app.use(errorHandler());
    app.set('views', config.root + '/client/views');
  }

  app.set('view engine', 'pug');
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(methodOverride());

  // Persist sessions with mongoStore
  app.use(exSession({
    secret: 'audb-vanilla secret',
    resave: true,
    saveUninitialized: false,
    store: new mongoStore({
      url: config.mongo.uri,
      collection: 'sessions',
      mongooseConnection: options.mongooseConnection
    })
  }));

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());
};