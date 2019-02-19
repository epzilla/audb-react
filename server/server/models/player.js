'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Thing Schema
 */
var PlayerSchema = new Schema({
  num: Number,
  fname: String,
  lname: String,
  pos: String,
  height: String,
  weight: Number,
  year: String,
  city: String,
  state: String,
  hs: String,
  retStart: Boolean,
  truePos: String,
  stringNum: Number,
  img: String,
  pid: Number,
  active: Boolean
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Player', PlayerSchema);
