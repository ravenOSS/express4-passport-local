var express = require('express');
var router = express.Router();
var passport = require('../utilities/setuppassport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express4-Passport-Local' });
});

/* GET registration page */
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Registration Page' });
});

/* POST registration */
router.post('/register',
  passport.authenticate('register', {
    successRedirect: '/dashboard',
    successFlash: true,
    failureRedirect: '/register',
    failureFlash: true })
);

/* GET dashboard page */
router.get('/dashboard', isLoggedIn, function (req, res, next) {
  res.render('dashboard', { title: 'You are logged in!', user: req.user.username });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login Page' });
});

/* Authenticate the login */
router.post('/login',
  passport.authenticate('login', { successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true })
);

/* GET logout */
router.get('/logout', function (req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

/* route middleware to make sure a user is logged in */
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
