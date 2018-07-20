//라우터 메인
var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var e = require('../libs/error');

router.use(require('./proxy-router'));

router.use(require('./etc/login-router'));

router.use( '/api/*', ( req, res, next ) => {
  if ( req.session.login2 == true ) { 
    	//maxAge 갱신
  	req.session.touch(); 	
    next();
  } else {
    res.status( e.status( '008' ) ).json( e.json( '008' ) );
  }
});

//JSON 포맷 체크
router.use(
  bodyParser.urlencoded({ extended: false }), 
  bodyParser.json(), 
    (err, req, res, next) => {
      if (err) res.status(e.status('010')).json(e.json('010'));
  }
);

router.use(require('./api-router'));
router.use(require('./etc/etc-router'));
router.use(require('./etc/download-router'));
router.use(require('./monitor/monitor-router'));
router.use(require('./log/log-router'));
router.use(require('./policy/policy-router'));
router.use(require('./config/config-router'));
router.use(require('./dashboard/dashboard-router'));

if ( process.env.NODE_ENV == 'production') {
  router.use('*', (req, res, next) => {
      res.sendFile(path.join(__dirname, '/../dist/index.html'));
  });
}

module.exports = router;
