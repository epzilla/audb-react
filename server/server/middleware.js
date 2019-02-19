'use strict';

/**
 * Custom middleware used by the application
 */
module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */
  auth: function auth(req, res, next) {
    if (req.method === 'OPTIONS' || req.isAuthenticated()) {
      return next();
    } else if (req.originalUrl.indexOf('session') === -1 ) {
      return res.send(401);
    } else {
      return next();
    }
  },

  /**
   * Set a cookie for angular so it knows we have an http session
   */
  setUserCookie: function setUserCookie(req, res, next) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.userInfo));
    }
    next();
  }
};