'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Thing Schema
 */
var ConferenceSchema = new Schema({
  conference: String,
  members: [],
  majorConf: Boolean,
  fbs: Boolean,
  fcs: Boolean,
  defunct: Boolean
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Conference', ConferenceSchema);
