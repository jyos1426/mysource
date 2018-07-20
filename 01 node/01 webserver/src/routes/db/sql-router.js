const express = require('express');
const router = express.Router();

const path = require('../../config').path;
const db = require('../../libs/db');
const c = require('../../libs/code');
const log = require('../../libs/log');
const util = require('../../libs/util');

router.post('/sql', (req, res) => {
  const action = req.body.action;
  const query  = req.body.query;
  const dbName = req.body.dbname;

  if(!action || !query || !dbName) {
    log.write("ERROR",`[/sql] body data include empty data, action=${action}, query=${query}, dbname=${dbName}`);
    return res.status(c.status('1003')).json(c.json('1003'));
  }

  const dbPath = path.dbbpath + dbName + '.dbb';

  if(!dbPath) {
    log.write("ERROR",`[/sql] sqlite db path is empty, dbname=${dbName}, dbPath=${dbPath}`);
    return res.status(c.status('1003')).json(c.json('1003'));
  }

  const ip = util.getIpAddress(req)

  // switch 문으로 action에 따라 db.js 호출
  switch(action) {
    case 'select':
      db.select(dbPath, query, (err, results) => {
        if(err) {
          log.write("ERROR",`[/sql] sql select error, err=${err}, db=${dbPath}, ip=${ip}, query=${query}`);
          res.status(200).json({code: err.errno, message: err.message});
        }
        else {
          res.json({ datas: results.rows })
        }
      })
      break;

    case 'execute':
      var queries = query;
      // x-www-form-urlencoded support
      if(queries.constructor == String) {
        // in case regex, data can include \t or \n. so, remove that
        queries = queries.replace(/\t/g,'');
        queries = queries.replace(/\n/g,'');

        queries = JSON.parse(queries);
      }
      else if(queries.constructor !== Array) {
        log.write("ERROR",`[/sql] query is not array, query type = ${queries.constructor}, query=${queries}`);
        return res.status(c.status('1003')).json(c.json('1003'));
      }

      queries.unshift('BEGIN IMMEDIATE TRANSACTION'); // 배열의 맨 앞에 트랜잭션 시작 추가
      queries.push('END TRANSACTION');                // 배열의 맨 뒤에 트랜잭션 종료 추가
      queries = queries.join(';') + ';' ;  // join 수행 시, 맨 마지막 문자열에는 ;이 붙지 않는다.

      db.exec(dbPath, queries, (err, results) => {
        if(err) {
          log.write("ERROR",`[/sql] sql execute error, err=${err}, db=${dbPath}, ip=${ip}, query=${queries}`);
          res.status(200).json({code: err.errno, message: err.message});
        }
        else {
          return res.status(c.status('000')).json(c.json('000'));
        }
      })
      break;
  }
})

router.post('/getSlaveServerCode', (req, res) => {
    const ip  = req.body.ip;
    const sname = req.body.sname;
    const dbPath = path.tmspath;

    if(!ip)
      return res.status(c.status('1003')).json(c.json('1003'));

    db.selectServerCode(dbPath, (err, ret) => {
      if(err)
        return res.status(200).json({code: err.errno, message: err.message});

      var code = 0;
      const bRet = ret.rows.some((row) => {
                      if(row['SIP'] === ip) {
                          code = row.NSERVERCODE
                          return true;
                      }
                   })

      if(bRet == true) {
          return res.status(c.status('000')).json(code);
      }
      else {
        code =  ret.rows[0].NSERVERCODE + 100;
        const query = `INSERT INTO assets_server values(${code}, '${ip}', 20, '${sname}')`

        db.run(dbPath, query, (err, ret) => {
          if(err) return res.status(200).json({code: err.errno, message: err.message});
          else return res.status(c.status('000')).json(code);
        })
      }
    })
})

module.exports = router;
