var express = require('express');
var	app = express();
var config = require('./config');
var router = require('./routes/router.js');
var morgan = require('morgan');
var handlebars = require('express-handlebars').create({
	defaultLayout: 'layout',
	helpers: {
		eq: function(v1, v2) { return v1 == v2; },
		include: function(v1, v2) { return (v1 & v2) == v2; }
	}
});
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(morgan(':remote-addr :date :method :url :response-time'));
app.use(cookieParser('secret'));
app.use(session({
	//resave: false,
	resave: true,
	//saveUninitialized: false,
	saveUninitialized: true,
	secret: 'secret',
	cookie: {
	    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1분
	 },
	store: new RedisStore(
		{host: '127.0.0.1', port: 6379})
	})
);
app.use(bodyParser.urlencoded({extended: true}));

app.get('*', function(req,res,next){
	res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
	next();
});

app.get('*', function(req,res,next){
	var ip = req.connection.remoteAddress;
	if (!config.maintenance) {
		next();
		return;
	}
	res.render('maintenance', {layout:false});
});
app.use(router.flash);


app.use(router.error);

var http = app.listen(config.location.port, function() {
	console.log('RMS server running on port ' + config.location.port);
});
http.setTimeout(0);
