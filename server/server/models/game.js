'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var GameSchema = new Schema({
  game: Number,
  result: String,
  opponent: String,
  opponentShortName: String,
  opponentAbbrev: String,
  teamScore: Number,
  opScore: Number,
  date: String,
  location: String,
  homeAwayNeutral: String,
  season: Number,
  confGame: Boolean,
  conference: String,
  currentConf: String,
  majorConf: Boolean,
  fbs: Boolean,
  gameId: Number
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Game', GameSchema);
