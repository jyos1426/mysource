var express = require('express');
var router = express.Router();
const moment = require('moment');
var config = require('../../../config');
var db = require('../../../libs/db');
var e = require('../../../libs/error');
var fs = require('fs');
var ip = require('ip');

router.get('/api/dashboard/rankby/attack_name', (req, res, next) => {
  var param = req.query;
  if (param['iscurrentdate'] === '1') {
    var date = moment().format('YYYYMMDD');
  } else {
    var date = moment(new Date())
      .add(-1, 'days')
      .format('YYYYMMDD');
  }
  var dbName = 'Detect_hackname' + date + '.dbb';
  var subPath = date.slice(0, 4) + '/' + date.slice(4, 6) + '/' + date.slice(6, 8) + '/';
  var pathdb = config.path.sniper + '/dbms/log/' + subPath + dbName;

  if (!fs.existsSync(pathdb)) {
    return res.json({datas:[]});
  }
  var query = `
SELECT
	category, 
	code, 
	attack_name, 
	sum(detect_count) as detect_count, 
	sum(count) as count, 
	sum(d_size) as d_size 
FROM 
	master 
GROUP BY
	category, code 
ORDER BY 
	sum(detect_count) DESC 
LIMIT
  5;
  `;
  db.select(pathdb, query, (error, results) => {
    if (error) {
      res.status(e.status('005')).json(e.json('005', error.stack));
    } else {
      var query = `
      SELECT
        sum(detect_count) as detect_attack_name_count
      FROM
        master;
      `;
      var body = results.rows;
      db.select(pathdb, query, (error, results) => {
        if (error) {
          res.status(e.status('005')).json(e.json('005', error.stack));
        } else {
          var result = new Object();
          var datas = {};
          var detect_attack_name = [];
          for (var i = 0; i < body.length; i++) {
            detect_attack_name.push(body[i]);
          }
          datas.detect_attack_name = detect_attack_name;
          result.info = results.rows[0];
          result.datas = datas;
          res.json(result);
        }
      });
    }
  });
});

router.get('/api/dashboard/rankby/victim_ip', (req, res, next) => {
  var param = req.query;
  if (param['iscurrentdate'] === '1') {
    var date = moment().format('YYYYMMDD');
  } else {
    var date = moment(new Date())
      .add(-1, 'days')
      .format('YYYYMMDD');
  }
  var dbName = 'Detect_vip' + date + '.dbb';
  var subPath = date.slice(0, 4) + '/' + date.slice(4, 6) + '/' + date.slice(6, 8) + '/';
  var pathdb = config.path.sniper + '/dbms/log/' + subPath + dbName;

  if (!fs.existsSync(pathdb)) {
    return res.json({datas:[]});
  }
  var query = `
SELECT
	victim_ip, 
	sum(detect_count) as detect_count, 
	sum(count) as count, 
	sum(d_size) as d_size 
FROM MASTER
WHERE 
  ip_version = 4  
GROUP BY 
  victim_ip 
ORDER BY 
  sum(detect_count) 
DESC 
LIMIT 5;
  `;
    db.select(pathdb, query, (error, results) => {
    if (error) {
      res.status(e.status('005')).json(e.json('005', error.stack));
    } else {
      var query = `
      SELECT
        sum(detect_count) as detect_victim_ip_count
      FROM
        master;
      `;
      var body = results.rows;
      db.select(pathdb, query, (error, results) => {
        if (error) {
          res.status(e.status('005')).json(e.json('005', error.stack));
        } else {
          var result = new Object();
          var datas = {};
          var detect_victim_ip = [];
          for (var i = 0; i < body.length; i++) {
            body[i].victim_ip = ip.fromLong(body[i].victim_ip);            
            detect_victim_ip.push(body[i]);
          }
          datas.detect_victim_ip = detect_victim_ip;
          result.info = results.rows[0];
          result.datas = datas;
          res.json(result);
        }
      });
    }
  });
});

router.get('/api/dashboard/rankby/hacker_ip', (req, res, next) => {
  var param = req.query;
  if (param['iscurrentdate'] === '1') {
    var date = moment().format('YYYYMMDD');
  } else {
    var date = moment(new Date())
      .add(-1, 'days')
      .format('YYYYMMDD');
  }
  var dbName = 'ippool_Detect_hip' + date + '.dbb';
  var subPath = date.slice(0, 4) + '/' + date.slice(4, 6) + '/' + date.slice(6, 8) + '/';
  var pathdb = config.path.sniper + '/dbms/log/' + subPath + dbName;

  if (!fs.existsSync(pathdb)) {
    return res.json({datas:[]});
  }
  var query = `
SELECT
  hacker_ip, 
	sum(detect_count) as detect_count, 
	sum(count) as count, 
	sum(d_size) as d_size 
FROM MASTER
WHERE 
  ip_version = 4  
GROUP BY 
  hacker_ip 
ORDER BY 
  sum(detect_count) 
DESC 
LIMIT 5;
  `;
    db.select(pathdb, query, (error, results) => {
    if (error) {
      res.status(e.status('005')).json(e.json('005', error.stack));
    } else {
      var query = `
      SELECT
        sum(detect_count) as detect_hacker_ip_count
      FROM
        master;
      `;
      var body = results.rows;
      db.select(pathdb, query, (error, results) => {
        if (error) {
          res.status(e.status('005')).json(e.json('005', error.stack));
        } else {
          var result = new Object();
          var datas = {};
          var detect_hacker_ip = [];
          for (var i = 0; i < body.length; i++) {
            body[i].hacker_ip = ip.fromLong(body[i].hacker_ip);            
            detect_hacker_ip.push(body[i]);
          }
          datas.detect_hacker_ip = detect_hacker_ip;
          result.info = results.rows[0];
          result.datas = datas;
          res.json(result);
        }
      });
    }
  });
}); 

module.exports = router;
