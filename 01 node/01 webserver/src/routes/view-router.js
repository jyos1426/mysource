//기타 라우터 메인
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const log = require('../libs/log');
const c = require('../libs/code');

router.all('/', (req, res, next) => {
  //req.setTimeout(10000)
  if(req.method !== 'GET') {
    // OPTIONS method is enabled 취약점 제거
    return res.status(c.status('1300')).json(c.json('1300'));
  }
  res.redirect('/download');
});

router.get('/download', (req, res, next) => {
  res.render('download');
});

// TEST
router.get('/dashboardTest', (req, res, next) => {

  // 테스트 접속계정
  req.session.userid = 'root001';

  var theme = 'WHITE';    // default 값
  if (req.session != undefined && req.session.theme != undefined) {
    theme = req.session.theme;
  }

  res.render('dashboard/dashboard', {'host' : req.protocol + '://' + req.headers.host,
                                     'theme' : theme});
});

router.get('/reportTest', (req, res, next) => {

  // 테스트 접속계정
  req.session.userid = 'root001';

  res.render('report/report', {'host': req.protocol + '://' + req.headers.host});
});

module.exports = router;
