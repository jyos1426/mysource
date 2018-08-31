var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

const index = require('./controllers/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', index);

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

const models = require('./models');
models.sequelize.sync()
  .then(() => {
    console.log('✓ DB connection success.');
  })
  .catch(err => {
    console.error(err);
    console.log('✗ DB connection error. Please make sure about DB connection.');
    process.exit();
  });

module.exports = app;


// https://jongmin92.github.io/2017/04/08/Node/sequelize/
// 정리가 아주 잘되어있음