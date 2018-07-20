var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var ROOT_PATH = '/home1/seriallicense';

var conn_obj = {
    'conn' : require(ROOT_PATH + '/config/conn.js'),
    'ipcom' : require(ROOT_PATH + '/config/conn_ipcom.js'),
    'itmac1' : require(ROOT_PATH + '/config/conn_itmac1.js'),
    'itmac2': require(ROOT_PATH + '/config/conn_itmac2.js'),
}

var app = express();

app.use(session({
    secret: 'sniper!@#!@#', 
    resave: false,
    rolling : true,
    saveUninitialized: true
}));

var passport = require(ROOT_PATH + '/config/passport.js')(app, conn_obj);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
var login = require('./routes/login')(passport);
var makeCer = require('./routes/makeCer')(conn_obj, ROOT_PATH);
var certificateOne = require('./routes/certificate/one')(conn_obj, ROOT_PATH);
var searchSerial = require('./routes/searchSerial')(conn_obj);
var test = require('./routes/test')(conn_obj, ROOT_PATH);

var userRegister = require('./routes/userRegister')(conn_obj);
var userList = require('./routes/userList')(conn_obj);

var mainSerial = require('./routes/mainSerial')(conn_obj, ROOT_PATH);
var mainIpcom = require('./routes/mainIpcom')(conn_obj);
var mainOne = require('./routes/mainOne')(conn_obj);
var mainLus = require('./routes/mainLus')(conn_obj);

var addSerial = require('./routes/addSerial')(conn_obj, ROOT_PATH);
var addIpcom = require('./routes/addIpcom')(conn_obj, ROOT_PATH);
var addBatchSerial = require('./routes/addBatchSerial')(conn_obj, ROOT_PATH);

var modSerial = require('./routes/modSerial')(conn_obj, ROOT_PATH);
var modOne = require('./routes/modOne')(conn_obj, ROOT_PATH);
var modLus = require('./routes/modLus')(conn_obj, ROOT_PATH);
var modNgfw = require('./routes/modNgfw')(conn_obj, ROOT_PATH);

var delSerial = require('./routes/delSerial')(conn_obj, ROOT_PATH);
var download = require('./routes/download')(ROOT_PATH);
var infoSerial = require('./routes/infoSerial')(conn_obj, ROOT_PATH);


app.use('/', routes);
app.use('/login', login);
app.use('/makecer', makeCer);
app.use('/certificate/one', certificateOne);
app.use('/searchserial', searchSerial);
app.use('/test', test);

app.use('/register', userRegister);
app.use('/userlist', userList);

app.use('/addserial', addSerial);
app.use('/addipcom', addIpcom);
app.use('/addbatchserial', addBatchSerial);

app.use('/modSerial', modSerial);
app.use('/modOne', modOne);
app.use('/modLus', modLus);
app.use('/modNgfw', modNgfw);

app.use('/delserial', delSerial);

app.use('/download', download);

app.use('/infoSerial', infoSerial);


app.use('/update/administrator/tsssolution.php', tssSolution);
app.use('/release_serial_make/serial_issued.php', serialIssued);
app.use('/release_serial_make/release_modify.php', releaseModify);
app.use('/release_serial_make/release_enroll.php', releaseEnroll);
app.use('/release_serial_make/multi_lin.php', multiLin);
app.use('/push_serial/check_serial.php', checkSerial);
app.use('/push_serial/push_search_serial.php', pushSearchSerial);
app.use('/push_serial/push_search_serial1.php', pushSearchSerial1);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('500', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
