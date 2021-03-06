var dbURI = 'mongodb://localhost/mongoose-authorize-test';
var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

var authorize = require('../')();

var defineModels = function (done) {
  // define User
  var userSchema = new mongoose.Schema({name: String});
  mongoose.model('User', userSchema);

  // define Team
  var teamSchema = new mongoose.Schema({name: String});
  teamSchema.plugin(authorize.teamPlugin);
  mongoose.model('Team', teamSchema);

  // define Organization
  var organizationSchema = new mongoose.Schema({name: String});
  organizationSchema.plugin(authorize.permissionsPlugin);
  mongoose.model('Organization', organizationSchema);

  done();
};

var insertDocs = function (done) {
  async.waterfall(
    [
      // create user1 and user2
      function (cb) {
        mongoose.model('User').create({name: 'nschloe'}, {name: 'andrenarchy'}, cb);
      },
      // create team1 with member user1
      function (user1, user2, cb) {
        mongoose.model('Team').create(
          {name: 'team nschloe', members: {users: [user1._id] }},
          function (err, team1) {
            if (err) return cb(err);
            return cb(null, user1, user2, team1);
          }
        );
      },
      // create team2 with members user2 and team1 -> user1 and user2
      function (user1, user2, team1, cb) {
        mongoose.model('Team').create(
          {
            name: 'team andrenarchy + friends',
            members: {
              users: [user2._id],
              teams: [team1._id]
            }
          },
          function (err, team2) {
            if (err) return cb(err);
            return cb(null, user1, user2, team1, team2);
          }
        );
      },
      // create orga1 with permissions
      function (user1, user2, team1, team2, cb) {
        mongoose.model('Organization').create(
          {
            name: 'c-base',
            permissions: [
              // team2: user1 and user2 (via team1)
              {team: team2, action: 'read', component: 'orgaInfo'},
              // team1: user1
              {team: team1, action: 'write', component: 'orgaInfo'}
            ]
          },
          function (err, orga1) {
            if (err) return cb(err);
            cb(null, user1, user2, team1, team2, orga1);
          }
        );
      }
    ],
    done
  );
};


module.exports = {
  authorize: authorize,
  defineModels: defineModels,
  insertDocs: insertDocs,
  dbURI: dbURI
};
