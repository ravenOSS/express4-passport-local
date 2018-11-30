var express = require('express');
var router = express.Router();
var passport = require('../utilities/passport');

router.use(function (req, res, next) {
  res.locals.currentUser = req.username;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('frontpage', { title: 'Banco del Oro' });
});

/* GET registration page */
router.get('/register', function (req, res, next) {
  res.render('register2', { title: 'Registration Page', message: req.flash('registerMessage') });
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
  res.render('login', { title: 'Login Page', message: req.flash('loginMessage') });
});

/* Authenticate the login */
router.post('/login',
  passport.authenticate('login',
    { successRedirect: '/dashboard',
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

/* GET register2 page */
router.get('/register2', function (req, res, next) {
  res.render('register2', { title: 'Registration Page', message: req.flash('registerMessage') });
});

/* POST registration */
router.post('/register2',
  passport.authenticate('register', {
    successRedirect: '/dashboard',
    successFlash: true,
    failureRedirect: '/register2',
    failureFlash: true })
);

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

module.exports = router;

/*
router.use(function (req, res, next) {
  res.locals.currentUser = req.user;

  next();
});
*/

/* render datatable page. */
/*
router.get('/table', isLoggedIn, function (req, res, next) {
  res.render('userdetail', { title: 'dataTable' });
});
*/

/* This is the api route to get the datatable ajax data */
/*
router.get('/usertable', function (req, res, next) {
  User.find()
    .sort({ createdAt: 'descending' })
    .exec(function (err, users) {
      if (err) { return next(err); }
      res.json(users);
    });
});
*/

/* GET users listing. */
/*
router.get('/users', isLoggedIn, function (req, res, next) {
  User.find()
    .sort({ createdAt: 'descending' })
    .exec(function (err, users) {
      if (err) { return next(err); }
      res.render('userlist', { users: users });
    });
});
*/
