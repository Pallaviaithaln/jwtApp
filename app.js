var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var jwt = require('jsonwebtoken');
var conf = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth',authRouter.authrouter);
// app.use(function(req, res, next) {
//   const token = req.headers['auth-token'] || req.query.token;
//   if (token) {
//       jwt.verify(token, conf.secret, (err, decodedResult) => {
//           if (err) res.json('Invalid Token');
//           req.validatedUser = decodedResult;
//           next();
//       });
//   } else res.json('Provide Proper Token in header or query with \'auth-token\'');
// });
app.use('/api', authRouter.jwtValidation);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
