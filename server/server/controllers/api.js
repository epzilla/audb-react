'use strict';

var mongoose = require('mongoose'),
    Game = mongoose.model('Game'),
    Player = mongoose.model('Player'),
    User = mongoose.model('User'),
    Recruit = mongoose.model('Recruit'),
    Conference = mongoose.model('Conference'),
    Opponent = mongoose.model('Opponent'),
    _ = require('lodash');

/**
 * Get all games for a given season
 */
exports.year = function (req, res) {
  return Game.find({season: req.params.season})
    .sort({'date':'asc'})
    .exec(function (err, games) {
    if (!err) {
      return res.json(games);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get list of players grouped by position
 */
exports.playersByPos = function (req, res) {
  return Player.find({active: true}).sort('stringNum').exec(function (err, pls) {
    if (!err) {
      return res.json(_.groupBy(pls, 'truePos'));
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get list of inactive players, sorted by last name
 */
exports.inactivePlayers = function (req, res) {
  return Player.find({active: false}).sort('lname').exec(function (err, pls) {
    if (!err) {
      return res.json(pls);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get list of all active players
 */
exports.activePlayers = function (req, res) {
  return Player.find({active: true}).exec(function (err, pls) {
    if (!err) {
      return res.json(pls);
    } else {
      return res.send(err);
    }
  });
};

exports.updatePlayer = function (req, res) {
  return Player.update({_id: req.params.id}, req.body, function (err, updatedPlayer) {
    if (err) { return res.send(err);}
    return res.json(updatedPlayer);
  });
};

/**
 * Get all recruits for a given class
 */
exports.recruits = function (req, res) {
  return Recruit.find({class: parseInt(req.params.year)}, function (err, recs) {
    if (!err) {
      return res.json(recs);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get all recruits for a given class that are planning to (or did) enroll early
 */
exports.earlyEnrollees = function (req, res) {
  return Recruit.find({class: req.params.year, earlyEnrollee: true}, function (err, recs) {
    if (!err) {
      return res.json(recs);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Add/Update a recruit
 */
exports.upsertRecruit = function (req, res) {
  var rec = req.body;

  if (rec._id) {
    Recruit.findOneAndUpdate({_id: rec._id}, rec, {new: true, upsert: true}, function (err, recruit) {
      if (err) {
        return res.send(400, err);
      }
      return res.json(recruit);
    });
  }
  else {
    Recruit.create({
      fname: rec.fname,
      lname: rec.lname,
      pos: rec.pos,
      truePos: getRecruitPos(rec),
      class: rec.class,
      city: rec.city,
      state: rec.state,
      hs: rec.hs,
      height: rec.height,
      weight: rec.weight,
      rivalsStars: rec.rivalsStars,
      scoutStars: rec.scoutStars,
      avgStars: (rec.scoutStars + rec.rivalsStars)/2,
      avgRank: (rec.rivalsRank + rec.scoutRank)/2,
      rivalsRank: rec.rivalsRank,
      scoutRank: rec.scoutRank,
      earlyEnrollee: !!rec.earlyEnrollee
    }, function (err, data) {
      if (err) {
        console.log(err);
        return res.send(err);
      }

      return res.json(data);
    });
  }
};

exports.deleteRecruit = function (req, res) {
  Recruit.deleteOne({ _id: req.params.id }, function (err) {
    if (err) {
      res.send(400);
    }
    res.send(200);
  })
};

function getRecruitPos (recruit) {
  if (recruit.truePos) {
    return recruit.truePos;
  }

  switch (recruit.pos) {
    case 'OL':
      var options = ['LT', 'LG', 'C', 'RG', 'RT'];
      return options[_.random(0, options.length - 1)];
    case 'DL':
      var options = ['NG', 'DT'];
      return options[_.random(0, options.length - 1)];
    case 'DE':
      var options = ['WDE', 'SDE'];
      return options[_.random(0, options.length - 1)];
    case 'LB':
      var options = ['WLB', 'MLB', 'SLB'];
      return options[_.random(0, options.length - 1)];
    case 'S':
      var options = ['FS', 'SS'];
      return options[_.random(0, options.length - 1)];
    case 'CB':
      var options = ['LCB', 'RCB'];
      return options[_.random(0, options.length - 1)];
    case 'WR':
      var options = ['WR2', 'WR9', 'Slot'];
      return options[_.random(0, options.length - 1)];
    default:
      return recruit.pos;
  }
}

/**
 * Enroll recruits for the class
 * (optional param "early" to only enroll early enrollee recruits)
 */
exports.enrollRecruits = function (req, res) {
  var thisYear = new Date().getFullYear();
  var options = {'class': thisYear};

  if (req.query.early) {
    options.earlyEnrollee = true;
  }

  Player.find().sort({'pid': 'desc'}).exec(function (err, players) {
    if (err) return err;
    console.log('I got: ' + players[0].pid);
    var nextPID = players[0].pid;

    Recruit.find(options, function (err, recs) {
      if (err) {
        console.log(err);
        return res.send(err);
      }

      for (var i = 0; i < recs.length; i++) {
        var rec = recs[i];
        var existingPlayer = _.find(players, {
          fname: rec.fname,
          lname: rec.lname,
          hs: rec.hs,
          active: true
        });

        if (!existingPlayer) {
          nextPID++;
          console.log(nextPID);
          var newPlayer = new Player({
            fname: rec.fname,
            lname: rec.lname,
            pos: rec.pos,
            height: rec.height || '6-2',
            weight: rec.weight || 200,
            year: 'FR',
            city: rec.city,
            state: rec.state,
            hs: rec.hs,
            num: 0,
            retStart: false,
            truePos: getRecruitPos(rec),
            stringNum: 5,
            pid: nextPID,
            active: true
          });

          newPlayer.save(function (err, data) {
            if (err) {
              console.log(err);
            }
          });
        } else {
          console.log('Recruit ' + rec.fname + ' ' + rec.lname + ' was already enrolled. Skipping...');
        }
      }

      return res.send(200);
    });
  });
};

/**
 *  Update attendance of specified user for game
 */
exports.updateAttendance = function (req, res, next) {
  var userId = req.user._id;
  var gameId = req.params.gameId;
  return User.findById(userId, function (err, user) {
    if (err) return next(new Error('Failed to load User'));
    if (user) {
      var ind = user.games.indexOf(gameId);
      if (ind === -1) {
        // Add it
        user.games.push(gameId);
      } else {
        // Remove it
        user.games.splice(ind, 1);
      }
      // Save
      user.save(function (err, user) {
        if (err) {
          return res.send(500, err);
        } else {
          return res.json(user);
        }
      });
    } else {
      return res.send(404, 'USER_NOT_FOUND');
    }
  });
};

/**
 * Get all games a user has attended
 */
exports.gamesByUser = function (req, res, next) {
  var userId = req.params.userId;
  return User.findById(userId, function (err, user) {
    if (err) return next(new Error('Failed to load User'));
    if (user) {
      Game.find().where('_id').in(user.games).exec(function (err, games) {
        if (err) return next(new Error('Failed to load Game'));
        if (games) {
          return res.json(games);
        }
      });
    }
  });
};

/**
 * Get a user by email address
 */
exports.userByEmail = function (req, res, next) {
  var em = req.params.email;
  return User.findOne({email: em}, function (err, user) {
    if (err) return next(new Error('Failed to find User'));
    return res.json(user);
  });
};

exports.opponents = function (req, res, next) {
  return Opponent.find()
    .sort({'name': 'asc'})
    .exec(function (err, opponents) {
      if (err) res.send(err);
      return res.json(opponents);
    });
};

exports.locations = function (req, res, next) {
  return Game.find(function (err, games) {
    if (err) res.send(err);
    return res.json(_.uniq(_.map(games, function(c) {
      return c.location;
    })).sort());
  });
};

/**
 * Get a list of all conferences
 */
exports.conferences = function (req, res, next) {
  return Conference.find(function (err, confs) {
    if (err) res.send(err);
    return res.json(confs);
  });
};

/**
 * Get W/L/T record against specified opponents/conferences
 * over a specified span of years
 */
exports.statsByopponent = function (req, res, next) {
  var teams = req.body.teams;
  var confs = req.body.confs;
  var curr = req.body.curr;
  var startYear = req.body.startYear;
  var endYear = req.body.endYear;
  if (confs.indexOf('Pac-12') !== -1) {
    confs.push('Pac-10');
    confs.push('Pac-8');
  }
  if (teams.indexOf('ULL') !== -1) {
    teams.push('SW Louisiana');
  }
  if (teams.indexOf('ULM') !== -1) {
    teams.push('NE Louisiana');
  }
  if (teams.indexOf('ALL-OPP') !== -1) {
    return Game.find().where('season').gte(startYear).lte(endYear)
      .sort({'season': 'asc'})
      .exec(function (err, games) {
        if (err) return next(new Error('Failed to get games.'));
        if (games) {
          return res.json(filterResults(games, req.body));
        }
      });
  } else if (confs.indexOf('SEC') !== -1) {
    return Game.find().where('season').gte(startYear).lte(endYear)
      .or([{opponent: { $in: teams}}, {conference: {$in: confs}}, {currentConf: {$in: curr}}, {confGame: 'y'}])
      .sort({'season': 'asc'})
      .exec(function (err, games) {
        if (err) res.send(err);
        return res.json(filterResults(games, req.body));
      });
  } else if (confs.indexOf('SEC East') !== -1 || confs.indexOf('SEC West') !== -1) {
    if (confs.indexOf('SEC East') !== -1) {
      _.remove(confs, function (c) { return c === 'SEC East'; });
      confs.push('SECEast');
    }
    if (confs.indexOf('SEC West') !== -1) {
      _.remove(confs, function (c) { return c === 'SEC West'; });
      confs.push('SECWest');
    }
    return Game.find().where('season').gte(startYear).lte(endYear)
      .or([{opponent: { $in: teams}}, {conference: {$in: confs}}, {currentConf: {$in: curr}}])
      .sort({'season': 'asc'})
      .exec(function (err, games) {
        if (err) res.send(err);
        return res.json(filterResults(games, req.body));
      });
  } else {
    return Game.find().where('season').gte(startYear).lte(endYear)
      .or([{opponent: { $in: teams}}, {conference: {$in: confs}}, {currentConf: {$in: curr}}])
      .sort({'season': 'asc'})
      .exec(function (err, games) {
        if (err) res.send(err);
        return res.json(filterResults(games, req.body));
      });
  }
};

var filterResults = function (input, query) {
  var results = input;
  if (!_.isNil(query['minTeamScore'])) {
    results = _.filter(results, r => r.teamScore >= query.minTeamScore);
  }

  if (!_.isNil(query['maxTeamScore'])) {
    results = _.filter(results, r => r.teamScore < query.maxTeamScore);
  }

  if (!_.isNil(query['minOppScore'])) {
    results = _.filter(results, r => r.opScore >= query.minOppScore);
  }

  if (!_.isNil(query['maxOppScore'])) {
    results = _.filter(results, r => r.opScore < query.maxOppScore);
  }

  if (!_.isNil(query['homeAwayNeutral'])) {
    results = _.filter(results, r => r.homeAwayNeutral === query.homeAwayNeutral);
  }

  return results;
};

/**
 * Get info on the game that's happening today
 */
exports.checkinInfo = function (req, res, next) {
  var date = new Date();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month.toString();
  }
  if (date < 10) {
    date = '0' + date.toString();
  }
  var dateString = date.getFullYear() + '-' + month + '-' + date.getDate();
  return Game.findOne({'date': dateString}, function (err, game) {
    if (err) return next( new Error('Couldn\'t find a game.'));
    return res.json(game);
  });
};

/**
 * Check a user in to a game
 * (similar to the updateAttendance method, but only
 * lets user check in, not un-check in.)
 */
exports.checkIn = function (req, res, next) {
  var userId = req.user._id;
  var gameId = req.params.gameId;
  return User.findById(userId, function (err, user) {
    if (err) return next(new Error('Failed to load User'));
    if (user) {
      var ind = user.games.indexOf(gameId);
      if (ind === -1) {
        // New, legit check-in
        user.games.push(gameId);
        user.save(function (err, user) {
          if (err) {
            return res.send(500, err);
          } else {
            return res.json(user);
          }
        });
      } else {
        // They've already checked in before
        return res.send('REPEAT');
      }
    } else {
      return res.send(404, 'USER_NOT_FOUND');
    }
  });
};

var reRank = function (truePos, cb) {
  Player.find({truePos: truePos})
    .sort({'stringNum': 1})
    .exec(function (err, players) {
      var savedPlayers = [];

      for (var i = 0; i < players.length; i++) {
        players[i].stringNum = i + 1;

        players[i].save(function (err, player) {
          if (err) {
            cb(err);
          }

          savedPlayers.push(player);
          if (i === players.length - 1 || savedPlayers.length === players.length) {
            cb(null, savedPlayers);
          }
        });
      }
    });
};

exports.posChange = function (req, res, next) {
  var playerMoving = req.body.player;
  var playerReplaced = req.body.replacedPlayer;

  Player.findOne({ _id: playerMoving._id }, function(err, player) {
    Player.find({ truePos: playerReplaced.truePos, 'active': true })
      .sort({ 'stringNum': 1 })
      .exec(function (err, players) {
        if (err) {
          res.send(400, err);
        }

        player.truePos = playerReplaced.truePos;
        player.pos = playerReplaced.pos;

        var savedPlayers = [];
        if (req.body.insertFirst) {
          // Make the player 1st string, and rerank the rest...
          // Loop through each player that was already at that position,
          // and make sure none are higher than 2nd string
          for (var i = 0; i < players.length; i++) {
            players[i].stringNum = i + 2;

            players[i].save(function (err, playerr) {
              if (err) {
                res.send(500, err);
              }

              savedPlayers.push(playerr);

              if (savedPlayers.length === players.length) {
                player.stringNum = 1;
                player.save(function (err, pl) {
                  savedPlayers.unshift(pl);
                  res.json(savedPlayers);
                });
              }
            });
          }
        }
        else if (req.body.insertLast) {
          // Make the player last string, no need to re-rank
          var max = players.reduce(function (prev, cur) {
            return prev.stringNum > cur.stringNum ? prev.stringNum : cur.stringNum;
          }, 1);
          player.stringNum = max + 1;
          player.save(function (err, pl) {
            if (err) {
              res.send(500, err);
            }
            savedPlayers.unshift(pl);
            res.json(players.concat(savedPlayers));
          });
        }
        else {
          // Player replacing another at specific spot in depth chart
          player.stringNum = playerReplaced.stringNum;

          // Only need to re-rank the ployers below the one being replaced
          var playersBelow = players.filter(function (pl) {
            return pl.stringNum >= playerReplaced.stringNum;
          });

          playersBelow.forEach(function (pl) {
            pl.stringNum++;
            pl.save(function (err, playerr) {
              if (err) {
                res.send(500, err);
              }

              savedPlayers.push(playerr);

              if (savedPlayers.length === playersBelow.length) {
                player.save(function (err, pl) {
                  savedPlayers.unshift(pl);
                  res.json(savedPlayers);
                });
              }
            })
          })
        }
      });
  });
};

/**
 * Get list of players grouped by position
 */
exports.advancePlayers = function (req, res) {
  return Player.find({active: true}, function (err, players) {
    if (err) {
      return res.send(err);
    }

    var groupedPlayers = _.groupBy(players, 'truePos');
    var changedPlayers = [];
    players.forEach(function (pl) {
      if (pl.year === 'SR') {
        pl.active = false;
        pl.year = 'GRAD';
        console.log(pl.fname + ' ' + pl.lname + ' graduated');
      }
      else {
        if (playerWasStarter(pl, groupedPlayers[pl.truePos])) {
          pl.retStart = true;
        }

        if (pl.year === 'JR') {
          pl.year = 'SR';
        }
        else if (pl.year === 'SO') {
          pl.year = 'JR';
        }
        else {
          pl.year = 'SO';
        }

        var logString = pl.fname + ' ' + pl.lname + ' is now a ' + pl.year;
        if (pl.retStart) {
          logString += ', and is a returning starter';
        }
        console.log(logString);
      }

      pl.save(function (err, savedPlayer) {
        if (err) {
          return res.send(500, err);
        }
        changedPlayers.push(savedPlayer);
        if (changedPlayers.length === players.length) {
          changedPlayers = [];
          console.log('==== Now re-ordering player string nums... ===');
          return fixStringNumbers(req, res);
        }
      });
    });
  });
};

function fixStringNumbers (req, res) {
  return Player.find({active: true}).sort('stringNum').exec(function (err, players) {
    if (err) {
      return res.send(500, err);
    }

    var groupedPlayers = _.groupBy(players, 'truePos');
    var changedPlayers = [];

    _.forEach(groupedPlayers, function (plGroup) {
      var sortedPlayers = _.sortBy(plGroup, 'stringNum');

      _.forEach(sortedPlayers, function (pl, i) {
        pl.stringNum = i + 1;
        console.log(pl.fname + ' ' + pl.lname + ' is now string ' + pl.stringNum + ' at ' + pl.truePos);

        pl.save(function (err, savedRemainingPlayer) {
          if (err) {
            return res.send(500, err);
          }

          changedPlayers.push(savedRemainingPlayer);
          if (changedPlayers.length === players.length) {
            res.json(changedPlayers);
          }
        });
      });
    });
  });
};

exports.fixStringNumbers = fixStringNumbers;

function playerWasStarter (player, posGroup) {
  var maxString = _.reduce(posGroup, function (result, p) {
    return p.stringNum < result ? p.stringNum : result;
  }, 100);

  return player.stringNum <= maxString;
}