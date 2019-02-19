'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var OpponentSchema = new Schema({
  name: String,
  shortName: String,
  abbrev: String
});

mongoose.model('Opponent', OpponentSchema);
