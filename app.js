var dotenv = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var createError = require('http-errors');
// var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var logger = require('morgan');
var passport = require('passport');
var path = require('path');
var routes = require('./routes/routes');
require('./database/db');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser()); Not required with express-sesssion. May lead to errors.

// Production app requires session storage (MongoDB/Redis) not memory store
app.use(session({
  secret: 'a top secret secret',
  cookie: { secure: false, maxAge: null },
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
/*
app.use(flash());

app.use(function(req, res, next){
 res.locals.success_message = req.flash('success_message');
 res.locals.error_message = req.flash('error_message');
 res.locals.error = req.flash('error');
 res.locals.user = req.user || null;
 next();
});
*/
