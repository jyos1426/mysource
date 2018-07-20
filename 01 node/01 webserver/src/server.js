// import basic node module
const path = require('path');
const fs = require('fs');
const https = require('https');

// import npm install module
const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const MongoClient = require('mongodb').MongoClient;
const exphbs = require('express-handlebars');

// import user module
const config = require('./config');
const c = require('./libs/code');
const router = require('./routes/router');
const log = require('./libs/log');
const util = require('./libs/util');

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.html',
  defaultLayout: false
});

// handlerbars 뷰 엔진 로드
app.engine('.html', hbs.engine);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', '.html');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../views')));
app.use(express.static(path.join(__dirname, '../views/dashboard')));
app.use(express.static(path.join(__dirname, '../views/report')));

app.use(
  session({
    secret: 'TMS_SIGNATURE_KEY', // use to session encryption
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new FileStore({ fileExtension: '.dat', ttl : 60 * 10  })
  })
);

//환경별 설정
switch (app.get('env')) {
  case 'development':
    break;
  case 'production':
    break;
}

// mongoDB url 설정
const mongosUrl = 'mongodb://' + config.getConfigValue('mongos_ip') + ':' + config.getConfigValue('mongos_port');
const singleUrl = 'mongodb://' + config.getConfigValue('mongod_ip') + ':' + config.getConfigValue('mongod_port');

//라우트 설정
app.use('/', router);

// Use connect method to connect to the server
MongoClient.connect(mongosUrl, function(err, client) {
  if(err) {
    log.write("ERROR", `[MongoClient.connect] mongos connect fail, mongosUrl=${mongosUrl}, err=${err}`);
    mongoConnection(mongosUrl);
  }
  else {
    app.locals.client = client;
    log.write("INFO",`[MongoClient.connect] success mongos db connection, mongosUrl=${mongosUrl}`);

    // when mongo connection is destroyed, event generate.
    client.on('close', () => {
      log.write("ERROR","[MongoClient.connect] Mongos shutdown!!, try Mongos DB Connect per a 5 sec");
      mongoConnection(mongosUrl);
    })
  }
});

MongoClient.connect(singleUrl, function(err, client) {
  if(err) {
    log.write("ERROR", `[MongoClient.connect] mongod connect fail, singleUrl=${singleUrl}, err=${err}`);
    mongoConnection(singleUrl);
  }
  else {
    app.locals.capppedClient = client;
    log.write("INFO","[MongoClient.connect] success mongod db connection");

    // when mongo connection is destroyed, event generate.
    client.on('close', () => {
      log.write("ERROR","[MongoClient.connect] Mongod shutdown!!, try Mongod DB Connect per a 5 sec");
      mongoConnection(singleUrl);
    })
  }
});

//HTTPS 키 로드
const keyPath = path.join(__dirname, config.path.ssl.key)
const crtPath = path.join(__dirname, config.path.ssl.cert)
try {
  var httpsOption = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(crtPath)
  };
}
catch(err) {
  log.write("ERROR",`[server.js] SSL key, crt files error, webserver is died, keyPath=${keyPath}, crtPath=${crtPath}, err=${err}`);
  process.exit(0)
}


const mongoConnection = function(connectUrl) {
  const timer = setInterval(function() {
    MongoClient.connect(connectUrl, function(err, client) {
      if(err) log.write("ERROR",`[mongoConnection] mongo DB connect fail, err=${err}`);
      else {
        // 새로 생성된 커넥션풀에 이벤트 할당
        client.on('close', () => {
          log.write("ERROR",`[mongoConnection] Mongo shutdown!!, try Mongo DB Connect per a 5 sec, connectUrl=${connectUrl}`);
          mongoConnection(connectUrl);
        })

        if(connectUrl == mongosUrl)
          app.locals.client = client;
        else if(connectUrl == singleUrl)
          app.locals.capppedClient = client;

        clearInterval(timer);
        log.write("INFO",`[mongoConnection] success mongo db connect, connectUrl=${connectUrl}`);
      }
    });
  }, 5000);
}

const startServer = function(){
  const httpsPort = config.getConfigValue('https_port');

  if(!httpsPort) {
    log.write("INFO",`[startServer] port is null, https_port=${httpsPort}`);
    process.exit(1);
  }

  var server = https.createServer(httpsOption, app).listen(httpsPort, () => {
    log.write("INFO",`[startServer] https server start, operation mode= ${app.get('env')}, httpsPort=${httpsPort}`);
  });
}

startServer();

app.use(function(err, req, res, next){
  const ip = util.getIpAddress(req)
  log.write("ERROR",`[error-handling] unhandle error occur, err=${err}, query=${req.query}, ip=${ip}`);
  console.log(req.query)
  res.status(c.status('1999')).json(c.json('1999'));
});
