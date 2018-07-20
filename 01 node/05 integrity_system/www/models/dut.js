var path		= require('path');
var http        = require('http');
var utils       = require('util');



// 검증 센서를 삭제한다.
function deleteDut(req, cb) {
  var parm = req.query;

  var query = utils.format('PRAGMA empty_result_callbacks=1; DELETE FROM dut_list WHERE ip="%s"', parm.ip);

  const options = {
      host: req.session.ip,
      port: req.session.port,
      path: '/main.a?act=config&order=ivs_sql_execute&db=./config/ivs_Config.dbb&sqlsize=' + query.length,
      method: 'POST',
      rejectUnauthorized: false,
      headers: {
          "Accept": "text/html, */*",
          "User-Agent": "MSIE",
          "Connection": "Keep-Alive",
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(query)
      }
  };
//   console.log(options);
//   console.log('Post: ' + query);

  var _req = http.request(options, (_res) => {
      var body = '';
      _res.on('data', (chunk) => {
          body += chunk;
      });
      _res.on('end', () => {
          var jsonResult = new Object(ConvertToJson(body, "\t"));

        //   console.log(body);		  
			console.log('\n\n********************************************************');
			console.log('  QUERY START | delete Dut');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);     
			console.log('result =>' + body);     
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | delete Dut');
			console.log('********************************************************\n');    


          return cb(null, jsonResult);
      });
      _res.on('error', (err) => {
          callback(err);
      });
  });
  _req.write(query);
  _req.end();
  _req.on('error', (err) => {
      console.log(err);
  });
}


// 검증 센서를 추가한다.
function insertDut(req, cb) {
  var parm = req.query;

  var query = utils.format('PRAGMA empty_result_callbacks=1; INSERT OR REPLACE INTO dut_list ( ip, port, console_id, console_passwd, device_id, device_passwd, device_port, status, latest ) VALUES ( "%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s" ) ', 
                            parm.ip, parm.port, parm.console_id, parm.console_passwd, parm.device_id, parm.device_passwd, parm.device_port, 0, 0);

  const options = {
      host: req.session.ip,
      port: req.session.port,
      path: '/main.a?act=config&order=ivs_sql_execute&db=./config/ivs_Config.dbb&sqlsize=' + query.length,
      method: 'POST',
      rejectUnauthorized: false,
      headers: {
          "Accept": "text/html, */*",
          "User-Agent": "MSIE",
          "Connection": "Keep-Alive",
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(query)
      }
  };
//   console.log(options);
//   console.log('Post: ' + query);

  var _req = http.request(options, (_res) => {
      var body = '';
      _res.on('data', (chunk) => {
          body += chunk;
      });
      _res.on('end', () => {
          var jsonResult = new Object(ConvertToJson(body, "\t"));
          console.log('\n\n********************************************************');
          console.log('  QUERY START | INSERT DUT');
          console.log('--------------------------------------------------------');
          console.log(options);
          console.log('--------------------------------------------------------');
          console.log('path =>' + options.path);     
          console.log('result =>' + body);     
          console.log('--------------------------------------------------------');
          console.log('  QUERY END | INSERT DUT');
          console.log('********************************************************\n');    

          return cb(null, jsonResult);
      });
      _res.on('error', (err) => {
          callback(err);
      });
  });
  _req.write(query);
  _req.end();
  _req.on('error', (err) => {
      console.log(err);
  });
}


// [Req.2.4] DUT latest 업데이트
function updateDUTlatest(req, cb) {
  var parm = req.query;
  var query =   'BEGIN; UPDATE dut_list SET status = 0 , latest = 0 WHERE ip <> \'' + parm.ip + '\';'+
                'UPDATE dut_list SET status = 1 , latest = 1 WHERE ip == \'' + parm.ip + '\'; COMMIT;'
  const options = {
    host: req.session.ip,
    port: req.session.port,
    path: '/main.a?act=config&order=ivs_sql_execute&db=./config/ivs_Config.dbb&sqlsize=' + query.length,
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
      "Accept": "text/html, */*",
      "User-Agent": "MSIE",
      "Connection": "Keep-Alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(query)
    }
  };
//   console.log(options);
//   console.log('=>' + options.path);

  var _req = http.request(options, (_res) => {
    var body = '';
    _res.on('data', (chunk) => {
      body += chunk;
    });
    _res.on('end', () => {
      var jsonResult = new Object(ConvertToJson(body, "|"));

      console.log('\n\n********************************************************');
      console.log('  QUERY START | update DUT latest');
      console.log('--------------------------------------------------------');
      console.log(options);
      console.log('--------------------------------------------------------');
      console.log('path =>' + options.path);     
      console.log('result =>' + body);     
      console.log('--------------------------------------------------------');
      console.log('  QUERY END | update DUT latest');
      console.log('********************************************************\n');   
      return cb(null, jsonResult);
    });
    _res.on('error', (err) => {
      callback(err);
    });
  });
  _req.write(query);
  _req.end();
  _req.on('error', (err) => {
    console.log(err);
  });
}


// [Req.2.4] DUT 연결상태 업데이트 
function updateDUTstatusFalse(req, cb) {
    var parm = req.query;
    var query =   'BEGIN; UPDATE dut_list SET status = 0 WHERE ip == \'' + parm.ip + '\'; COMMIT;'
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=config&order=ivs_sql_execute&db=./config/ivs_Config.dbb&sqlsize=' + query.length,
        method: 'POST',
        rejectUnauthorized: false,
        headers: {
            "Accept": "text/html, */*",
            "User-Agent": "MSIE",
            "Connection": "Keep-Alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(query)
        }
    };
//   console.log(options);
//   console.log('=>' + options.path);

  var _req = http.request(options, (_res) => {
    var body = '';
    _res.on('data', (chunk) => {
      body += chunk;
    });
    _res.on('end', () => {
        var jsonResult = new Object(ConvertToJson(body, "|"));
      
        console.log('\n\n********************************************************');
        console.log('  QUERY START | update DUT status');
        console.log('--------------------------------------------------------');
        console.log(options);
        console.log('--------------------------------------------------------');
        console.log('path =>' + options.path);     
        console.log('result =>' + body);     
        console.log('--------------------------------------------------------');
        console.log('  QUERY END | update DUT status');
        console.log('********************************************************\n'); 
      return cb(null, jsonResult);
    });
    _res.on('error', (err) => {
      callback(err);
    });
  });
  _req.write(query);
  _req.end();
  _req.on('error', (err) => {
    console.log(err);
  });
}

//[Req.2.5] DUT 설정 해제
function ivsDUTUnset(req, cb) {
  var parm = req.query;  
  var path = '/main.a?act=config&order=ivs_dut_unset';
  const options = {
      host: req.session.ip,
      port: req.session.port,
      path: path,
      method: 'GET',
      rejectUnauthorized: false,
      headers: {
          "Accept": "text/html, */*",
          "User-Agent": "MSIE",
          "Connection": "Keep-Alive",
          "Content-Type": "application/x-www-form-urlencoded",
      }
  };
//   console.log(options);
//   console.log('=>' + options.path);
  var _req = http.request(options, (_res) => {
      var body = '';
      _res.on('data', (chunk) => {
          body += chunk;
      });
      _res.on('end', () => {
          // var result = body.split("|");            
            console.log('\n\n********************************************************');
            console.log('  QUERY START |  DUT 설정(연결)해제 ');
            console.log('--------------------------------------------------------');
            console.log(options);
            console.log('--------------------------------------------------------');
            console.log('path =>' + options.path);     
            console.log('result =>' + body);     
            console.log('--------------------------------------------------------');
            console.log('  QUERY END |  DUT 설정(연결)해제 ');
            console.log('********************************************************\n'); 
          return cb(null, body);
      });
      _res.on('error', (err) => {
          callback(err);
      });
  });
  _req.end();
  _req.on('error', (err) => {
      console.log(err);
  });
}

module.exports = {
    ivsDUTUnset: ivsDUTUnset,
    updateDUTlatest: updateDUTlatest,
    updateDUTstatusFalse: updateDUTstatusFalse,
    insertDut: insertDut,
    deleteDut: deleteDut,
};
