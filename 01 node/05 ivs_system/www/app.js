/**
 * Module dependencies
 */
var express = require('express');
var https = require('https');
var path = require('path');
var fs = require('fs');

// Middleware
var morgan = require('morgan');
var cookie = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var formidable = require('formidable');
var fs	=	require('fs');


/**
 * Create app instance
 */
var app = express();

/**
 * Setting Middleware mapping
 */
app.locals.errMsg = app.locals.errMsg || null;

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'static')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev')); // combined
app.use(cookie());
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(require('express-session')({
	secret: '',
	resave: false,
	saveUninitialized: true ,
	rolling: true
}));
app.use(flash());

/**
 * Routing - View page
 */

var index = require('./routes/index');
app.use('/', index);

app.listen(app.get('port'), function(){
	console.log('');
	console.log('=================================================');
	console.log('  Web server has been started!! (port : ' + app.get('port') + ')');
	console.log('=================================================');
});
