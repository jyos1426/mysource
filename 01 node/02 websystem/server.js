var express = require('express'),
		app = express();
var config = require('./config');
var path = require('path');
var fs = require('fs');
var e = require('./libs/error');
var https = require('https');
var sensor = require('./libs/sensor');
var router = require('./routes/router');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session); 


//app.use(bodyParser.urlencoded({ extended: false }));

var cookieOptions = { maxAge: 1000 * 60 * 60 * 2 }; //2시간
if (app.get('env') == 'production') {
	cookieOptions.secure = true; //HTTPS일때만 생성
} 

app.use(session({ 
	secret: 'SIGNATURE_KEY', 
	resave: false, 
	saveUninitialized: false,
	cookie: cookieOptions,
	store: new FileStore({fileExtension :'.dat'})
}));

//static 파일 라우팅(angular)
app.use(express.static(path.join(__dirname, 'dist')));

//static 파일 라우팅(c/s)
app.use(express.static(config.path.sniper + '/activex/login'));

//HTTPS 키 로드
var httpsOption = {
	key: fs.readFileSync(path.join(__dirname, config.path.ssl.key)),
	cert: fs.readFileSync(path.join(__dirname, config.path.ssl.cert))
};

//환경별 설정
switch( app.get('env') ) {
	case 'development':
		app.use(require('morgan')('dev'));
		break;
	case 'production':
		break;
}

//라우트 설정
app.use('/', router);

//센서정보 로드
sensor.load( 
	(success) => {	
		var server = https.createServer(httpsOption, app).listen(config.location.port, () => {			
			console.log(' # Mode: ' + app.get('env'));		
			console.log(' # Location: ' + sensor.location.host + ':' + config.location.port);	
			console.log(' # Proxy Port: ' + sensor.location.s_port);					
		});		
	},	
	(fail) = (err) => {		
		console.log('[ERROR] ' + err.resultStr);		
	}
)