//기타 라우터 메인
var express = require('express');
var router = express.Router();
var sensor = require('../../libs/sensor');
var category = require('../../libs/category');
var db = require('../../libs/db');
var e = require('../../libs/error');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

router.get('/api/info', (req, res, next) => {
  //응답 데이터 처리..
  res.json(makeJsonResult_info());
});
router.get('/api/info/category', (req, res, next) => {
  res.json(makeCategory_info());
});
router.get('/api/info/time', (req, res, next) => {
  
  res.json({
    infos: {
      currentDate: moment().format('YYYYMMDDHHmmss'),
      timestamp: moment().format('x')
    }
  });
});
router.get('/api/info/user', (req, res, next) => {

  if (typeof req.session !== 'undefined') {
    var infos = new Object();

    var userid = req.session.userid;
    infos['userid'] = userid;

    var sessionFile = path.join(__dirname, '../../sessions', req.session.id + '.dat');
    var sessionJSON, expireDate;
    if (fs.existsSync(sessionFile)) {
      var text = fs.readFileSync(sessionFile, 'utf8');
      sessionJSON = JSON.parse(text);

      expireDate = moment(sessionJSON.cookie.expires).format('YYYYMMDDHHmmss');
      infos['serverDate'] = moment().format('YYYYMMDDHHmmss');
      infos['expireDate'] = expireDate;
    }

    var query = `
      SELECT
        id
        , authority
        , access_address
      FROM
        user
      WHERE
        id = '${userid}'
    `;

    db.select( db.getUserDbPath(), query, (error, results) => {
      if (error) {
        res.status(e.status('005')).json(e.json('005', error.stack));
      } else {
        for(var i =0; i < results.rows.length; i ++){
          if (results.rows[i].access_address === '') {
            continue;
          }
          results.rows[i].access_address =JSON.parse(results.rows[i].access_address);
        }
        res.json({
          infos: infos,
          datas: results.rows
        });
      }
    });

  } else {
    req.json({
      error: 'wrong session'
    });
  }
});
makeJsonResult_info = () => {
  var json = new Object();
  json.sensor_info = sensor.sensorInfo();
  json.nic_info = sensor.nicList();
  json.license = sensor.licenseList();
  json.max_count = sensor.maxInfo();
  json.policy_config = sensor.policyConfigInfo();

  return json;
};
makeCategory_info = () => {
  var json = new Object();
  json.datas = category.getCategoryList();

  return json;
};

module.exports = router;
