'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    games = require('./controllers/games');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Cache-Control')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });

  // app.use('/api/*', middleware.auth);

  // Server API Routes
  app.post('/api/users', users.create);
  app.put('/api/users', users.update);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);
  app.put('/api/avatar', users.upsertAvatar);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  // User defined
  app.get('/api/year/:season', api.year);
  app.get('/api/playersByPos', api.playersByPos);
  app.get('/api/players', api.activePlayers);
  app.get('/api/players/inactive', api.inactivePlayers);
  app.post('/api/player/:id', api.updatePlayer);
  app.get('/api/recruits/:year', api.recruits);
  app.get('/api/recruits/:year/early', api.earlyEnrollees);
  app.post('/api/recruits', api.upsertRecruit);
  app.delete('/api/recruit/:id', api.deleteRecruit);
  app.post('/api/updateAttendance/:gameId', api.updateAttendance);
  app.post('/api/checkIn/:gameId', api.checkIn);
  app.get('/api/gamesByUser/:userId', api.gamesByUser);
  app.get('/api/conferences', api.conferences);
  app.get('/api/opponents', api.opponents);
  app.get('/api/locations', api.locations);
  app.post('/api/statsByopponent', api.statsByopponent);
  app.get('/api/userByEmail/:email', api.userByEmail);
  app.get('/api/checkinInfo', api.checkinInfo);
  app.post('/api/recruits/enroll', api.enrollRecruits);
  app.post('/api/posChange', api.posChange);
  app.post('/api/games', games.add);
  app.delete('/api/games/:id', games.remove);
  app.post('/api/advancePlayers', api.advancePlayers);
  app.post('/api/fixStringNumbers', api.fixStringNumbers);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};
