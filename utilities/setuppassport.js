var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var TotpStrategy = require('passport-totp').Strategy;
var User = require('../models/user');

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) { // user id ??
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Using named strategy "login". Default strategy = local
passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
function (req, username, password, done) {
  User.findOne({
    username: username
  }, function (err, user) { // Uses mongoose method findOne
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: 'No user of that username!'
      });
    }

    user.checkPassword(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Invalid password.'
        });
      }
    });
  });
}));

passport.use('register', new LocalStrategy({
  passReqToCallback: true
},
function (req, username, password, done) {
  process.nextTick(function () {
    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, {
          message: 'User already exists'
        });
      } else {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save(function (err) {
          if (err) {
            throw err;
            return done(null, newUser);
          }
        });
      }
    });
  });
}));
/* Export passport functions */
module.exports = passport;
