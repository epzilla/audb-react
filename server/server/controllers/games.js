'use strict';

var mongoose = require('mongoose'),
    Opponent = mongoose.model('Opponent'),
    Conference = mongoose.model('Conference'),
    Game = mongoose.model('Game');

exports.show = function (req, res, next) {
  return Game.find({season: req.params.season}, function (err, games) {
    if (!err) {
      return res.json(games);
    } else {
      return res.send(err);
    }
  });
};

function findAndReturnGame (id, body, res) {
  return Game.findOneAndUpdate({ gameId: id }, body, { upsert: true }, function (err, games) {
    if (!err) {
      return res.json(games);
    } else {
      return res.send(err);
    }
  });
}

exports.add = function (req, res, next) {
  var game = req.body;
  if (game.teamScore > game.opScore) {
    game.result = 'W';
  }
  else if (game.teamScore < game.opScore) {
    game.result = 'L';
  }
  else {
    game.result = 'T';
  }

  Opponent.findOne({'name': game.opponent}, function (err, opp) {
    if (err) {
      res.send(err);
    }

    let oppName = opp ? opp.name : game.opponent;
    Conference.findOne({'members': oppName}, function (err, conference) {
        if (opp) {
          game.opponentShortName = opp.shortName;
          game.opponentAbbrev = opp.abbrev;
        }

        if (conference) {
          game.confGame = (conference.conference.toLowerCase().indexOf(game.conference.toLowerCase()) !== -1);
        }

        if (game.gameId) {
          return findAndReturnGame(game.gameId, game, res);
        }
        else {
          Game.findOne({})
            .sort('-gameId')
            .exec(function (err, g) {
              game.gameId = g.gameId + 1;
              return findAndReturnGame(game.gameId, game, res);
            });
        }
      });
  });
};

exports.remove = function (req, res, next) {
  return Game.remove({_id: req.params.id}, function (err, game) {
    if (!err) {
      return res.send(204);
    } else {
      return res.send(err);
    }
  });
};