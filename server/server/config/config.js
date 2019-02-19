'use strict';

var _ = require('lodash');
var envConfig;

if (process.env.NODE_ENV !== 'development') {
  envConfig = require('./env/production.js');
} else {
  envConfig = require('./env/development.js');
}
/**
 * Load environment configuration
 */
module.exports = _.extend(
    require('./env/all.js'),
    envConfig
);