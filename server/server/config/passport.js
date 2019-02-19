'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

/**
 * Passport configuration
 */
module.exports = function () {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    User.findOne({
      _id: user._id
    }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
      done(err, user);
    });
  });

  // add other strategies for more authentication flexibility
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function (email, password, done) {
      User.findOne({
        email: email
      }, function (err, user) {
        if (err) return done(err);
        
        if (!user) {
          return done(null, false, {
            message: 'This email is not registered.'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'This password is not correct.'
          });
        }
        return done(null, user);
      });
    }
  ));
};