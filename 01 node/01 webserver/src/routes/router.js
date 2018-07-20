//라우터 메인
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const c = require('../libs/code');
const log = require('../libs/log');

router.use(require('./login/login-router'));

router.use('/api/*', (req, res, next) => {  // 추후에 /api를 뺴고 *로 모든 쿼리에 대해 로그인 체크하도록.
  if (req.session.login2 == true) {
    console.log('touch ~!!!')
    //maxAge 갱신
    req.session.touch();
    next();
  } else {
    log.write("ERROR",`[/api] no login session access, req.session=${req.session}`)
    res.status(c.status('1008')).json(c.json('1008'));
  }
});

//JSON 포맷 체크 , limit : 1024 * 1024 * 10
router.use(bodyParser.urlencoded({ extended: false, limit : 1024 * 1024 * 10}), bodyParser.json(), (err, req, res, next) => {
  if (err) {
    log.write("ERROR",`body parse err=${err}`)
    res.status(c.status('1010')).json(c.json('1010'));
  }
});

router.use(require('./view-router'));
router.use(require('./db/dashboard-router'));
router.use(require('./db/report-router'));
router.use(require('./db/sql-router'));
router.use(require('./db/mongo-router'));
router.use(require('./integrity/integrity-router'));
router.use(require('./sensor/af-proxy'));
router.use(require('./sensor/sensor-proxy'));
router.use(require('./resource/resource-router'));
router.use(require('./scheduler-router'));

module.exports = router;
