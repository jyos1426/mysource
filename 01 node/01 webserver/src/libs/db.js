const sqlite3 = require('sqlite3').verbose();
var sqlcipherEncryptKey = require('../config').sqlcipherEncryptKey;
const async = require('async');
const moment = require('moment');

//조회전용 함수
exports.select = (databaseName, sql, callback = (error, results)) => {
  var res = new Object();
  var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.error = err;
      res.rows = [];
      callback(err, res);
    } else {
      const dbName = databaseName.split('/').pop()
      sqlcipherEncryptKey = sqlcipherEncryptKey.replace(/\n/g, "")

      db.run(`PRAGMA KEY = '${sqlcipherEncryptKey}'`);
      db.all(sql, (err, rows) => {
        if (err) {
          res.error = err;
          res.rows = [];
        } else {
          res.error = null;
          res.rows = rows;
        }
        db.close();
        callback(err, res);
      });
    }
  });
};

exports.selectAsync = (databaseName, sql) => {
  return new Promise(function(resolve, reject) {
    var res = new Object();
    var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        reject(err);
      } else {
        db.run(`PRAGMA KEY = '${sqlcipherEncryptKey}'`);
        db.all(sql, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows)
          }
          db.close();
        });
      }
    });
  })
};

exports.selectAfSensorInfoBySensorId = (databaseName, sensorId, callback = (error, results)) => {
  var res = new Object();
  var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.error = err;
      res.rows = [];
      callback(err, res);
    } else {
      db.run(`PRAGMA KEY = '${sqlcipherEncryptKey}'`);
      const sql = `SELECT sip, nmanageport, shttpsid, shttpspwd FROM ASSETS_DEVICE
                   WHERE NDEVICECODE = ${sensorId}`;
      db.all(sql, (err, rows) => {
        if (err) {
          res.error = err;
        } else {
          res = rows[0];
        }
        db.close();
        callback(err, res);
      });
    }
  });
};

exports.selectSensorInfoBySensorId = (databaseName, sensorId, callback = (error, results)) => {
  var res = new Object();
  var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.error = err;
      res.rows = [];
      callback(err, res);
    } else {
      db.run(`PRAGMA KEY = '${sqlcipherEncryptKey}'`);
      const sql = `SELECT sip, nmanageport, ndeviceversion FROM ASSETS_DEVICE WHERE NDEVICECODE = ${sensorId}`;
      db.all(sql, (err, rows) => {
        if (err) {
          res.error = err;
        } else {
          res = rows[0];
        }
        db.close();
        callback(err, res);
      });
    }
  });
};

exports.selectServerCode = (databaseName, callback = (error, results)) => {
  var res = new Object();
  var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.error = err;
      res.rows = [];
      callback(err, res);
    } else {
      db.run(`PRAGMA KEY = '${sqlcipherEncryptKey}'`);
      var sql = `SELECT * FROM ASSETS_SERVER ORDER BY NSERVERCODE desc`;

      db.all(sql, (err, rows) => {
        if (err) {
          res.error = err;
        } else {
          res.error = null;
          res.rows = rows;
        }
        db.close();
        callback(err, res);
      });
    }
  });
};


exports.selectIpFromUserAccount = (databaseName, callback = (error, results)) => {
  var res = new Object();
  var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.error = err;
      res.rows = [];
      callback(err, res);
    } else {
      db.run(`PRAGMA KEY = '${sqlcipherEncryptKey}'`);
      const sql = `SELECT * FROM USER_ACCOUNT`;

      db.all(sql, (err, rows) => {
        if (err) {
          res.error = err;
        } else {
          res.error = null;
          res.rows = rows;
        }
        db.close();
        callback(err, res);
      });
    }
  });
};

exports.insertIntoAuditLog = (databaseName, category, type, reference, detail, id, ip, callback = (error, results)) => {
  var res = new Object();
  var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      res.error = err;
      res.rows = [];
      callback(err, res);
    } else {
      db.run(`PRAGMA KEY = '${sqlcipherEncryptKey}'`);
      const sql = `INSERT INTO audit_log(NCATEGORY, NTYPE, SREFERENCE, SDETAIL, SUSERID, SUSERIP, DREGDATE )
                   VALUES(${category}, ${type}, ${reference}, '${detail}', '${id}', '${ip}', '${moment().format('YYYY-MM-DD HH:mm:ss')}')`;

      db.all(sql, (err, rows) => {
        if (err) {
          res.error = err;
          res.rows = [];
        } else {
          res.error = null;
          res.rows = [];
        }
        db.close();
        callback(err, res);
      });
    }
  });
};


//쓰기/읽기 모두 가능한 함수
exports.run = (databaseName, sql, callback = (error, results)) => {
  var res = new Object();
  var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      res.error = err;
      res.rows = [];
      callback(err, res);
    } else {
      db.run(`PRAGMA KEY = '${sqlcipherEncryptKey}'`);
      db.all(sql, (err, rows) => {
        if (err) {
          res.error = err;
          res.rows = [];
        } else {
          res.error = null;
          res.rows = rows;
        }
        db.close();
        callback(err, res);
      });
    }
  });
};

// 다중 쓰기 쿼리가 가능한 함수
exports.exec = (databaseName, sql, callback = (error, results)) => {
  var res = new Object();
  var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      res.error = err;
      res.rows = [];
      callback(err, res);
    } else {
      db.run(`PRAGMA KEY = '${sqlcipherEncryptKey}'`);
      db.exec(sql, (err, rows) => {
        if (err) {
          res.error = err;
          res.rows = [];
        } else {
          res.error = null;
          res.rows = [];
        }
        db.close();
        callback(err, res);
      });
    }
  });
};

exports.execAsync = (databaseName, sql) => {
  return new Promise(function(resolve, reject) {
    var res = new Object();
    var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err)
      } else {
        db.run(`PRAGMA KEY = '${sqlcipherEncryptKey}'`);
        db.exec(sql, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
          db.close();
        });
      }
    });
  })
};

exports.getUserDbPath = () => {
  return path.tmspath;
};
