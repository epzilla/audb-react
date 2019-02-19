'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Thing Schema
 */
var RecruitSchema = new Schema({
  fname: String,
  lname: String,
  pos: String,
  truePos: String,
  class: Number,
  city: String,
  state: String,
  hs: String,
  height: String,
  weight: Number,
  rivalsStars: Number,
  scoutStars: Number,
  avgStars: Number,
  avgRank: Number,
  rivalsRank: Number,
  scoutRank: Number,
  lat: Number,
  long: Number,
  earlyEnrollee: Boolean
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Recruit', RecruitSchema);
