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

// Using named strategy "register". Default strategy = local
passport.use('register', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
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
        return done(null, false, req.flash('registerMessage', 'User already exists'));
      } else {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save(function (err) {
          if (err) {
            throw err;
          } else {
            return done(null, newUser);
          }
        });
      }
    });
  });
}));

// Using named strategy "login". Default strategy = local
passport.use('login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
},
function (req, username, password, done) {
  User.findOne({
    username: username
  }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, req.flash('loginMessage', 'No user found'));
    }
    if (!user.validPassword(password)) {
      return done(null, false, req.flash('loginMessage', 'Wrong password!!'));
    }
    return done(null, user);
  });
}));

/* Export passport functions */
module.exports = passport;
