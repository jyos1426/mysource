// var config = require('../../config/app-config.json');
var util = require('util');
var path = require('path');
var http = require('http');


//부하테스트 이력 조회
function ivsGetLoadList(req, cb) {
    var parm = req.query; 
    var datetime = parm.date.split('.');

    var year  = datetime[0];
    var month = datetime[1];
    var day  = datetime[2];
    var date    = util.format('%s/%s/%s', year, month, day);

    var db      = './config/ivs_Config.dbb';    
    var query   = 'PRAGMA empty_result_callbacks=1; \
                    SELECT test_code, test, type, category, version, pcap_id as backtraffic, pcapdir as backtraffic_dir, interval, comment, save FROM test_list \
                    WHERE test = 2 AND date  LIKE "' + date + ' %" ORDER BY test_code DESC;';
    // console.log(query);
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?' +
                'act=config' +
                '&order=ivs_get_list' +
                '&db=' + db +
                '&sqlsize=' + query.length,
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
    // console.log(options);
    // console.log('=>' + options.path);
    var _req = http.request(options, (_res) => {
        var body = '';
        _res.on('data', (chunk) => {
            body += chunk;
        });
        _res.on('end', () => {
            var jsonResult = new Object(ConvertToJson(body, "|"));

			console.log('\n\n********************************************************');
			console.log('  QUERY START | get Overload Log ');
			console.log('--------------------------------------------------------');
			console.log(options);
            console.log('post =>' + query); 
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | get Overload Log ');
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


// 차트에 그리는 데이터 가져오기    
function getOverloadData(req, cb) {
    var parm = req.query;
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=test&order=ivs_overload_data&test_code='+parm.testcode,
        method: 'GET',
        rejectUnauthorized: false,
        headers: {
            "Accept": "text/html, */*",
            "User-Agent": "MSIE",
            "Connection": "Keep-Alive"
        }
    };
    // console.log(options);
    // console.log('=>' + options.path);
    var _req = http.request(options, (_res) => {
        var body = '';
        _res.on('data', (chunk) => {
            body += chunk;
        });
        _res.on('end', () => {
            var jsonResult = new Object(ConvertToJson(body, "|"));
			console.log('\n\n********************************************************');
			console.log('  QUERY START | get Overload Data (chart)');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('result =>' + body);    
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | get Overload Data (chart)');
            console.log('********************************************************\n'); 
            return cb(null, jsonResult);
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

function getRuleList(req, cb) {
  var parm = req.query;
  var query = '';
  if(parm.retest == 'true'){
      query = "PRAGMA empty_result_callbacks=1; "+
              "attach database './dbms/backup/" + parm.testcode + "/ivs_result.dbb' as result; "+ 
              "SELECT m.test_code, m.category, m.code, m.position as select_value, r.name, r.ncscrule "+ 
              "FROM master AS r INNER JOIN result.overload AS m "+
              "ON m.code = r.code "+
              "ORDER BY select_value asc, m.code asc;";
  }else{
      query = 'PRAGMA empty_result_callbacks=1; SELECT * FROM master WHERE ndelete = 0 ORDER BY code';
  }

//   console.log(query);
  const options = {
      host: req.session.ip,
      port: req.session.port,
      path: '/main.a?act=config&order=ivs_get_list&db=' + parm.dbpath + '/' + (parm.dbname).replace("\n", "") + '&col_del=TAB&sqlsize=' + Buffer.byteLength(query),
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
          var jsonResult = new Object(ConvertToJson(body, "\t"));
          
            console.log('\n\n********************************************************');
            console.log('  QUERY START | getRuleList ');
            console.log('--------------------------------------------------------');
            console.log(options); 
            console.log('post =>' + query);    
            console.log('--------------------------------------------------------');
            console.log('path =>' + options.path);     
            console.log('--------------------------------------------------------');
            console.log('  QUERY END | getRuleList ');
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

// run 직전에 SELECT된 결과들만 출력     
function getSelectedTestList(req, cb) {
	var parm = req.query;
  var query = 'PRAGMA empty_result_callbacks=1; ' +
              'attach database \'' + parm.dbpath + '/'+ parm.dbname + '\' as result; '+
              'select r.code, r.name, r.ncscrule, m.position as select_value from overload as m INNER JOIN result.master as r ON m.code = r.code order by m.position asc, r.code asc;';

	// console.log(query);
  const options = {
    host: req.session.ip,
    port: req.session.port,
    path: '/main.a?act=config&order=ivs_get_list&db=./dbms/backup/' + parm.testcode + '/ivs_result.dbb&col_del=TAB&sqlsize=' + query.length,
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
      var jsonResult = new Object(ConvertToJson(body, "\t"));
        console.log('\n\n********************************************************');
        console.log('  QUERY START | get Selected Rule List ');
        console.log('--------------------------------------------------------');
        console.log(options); 
        console.log('post =>' + query);    
        console.log('--------------------------------------------------------');
        console.log('path =>' + options.path);     
        console.log('--------------------------------------------------------');
        console.log('  QUERY END | get Selected Rule List ');
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

// Test 결과 SELECT : Test중 1.5초단위로 혹은 완료 시 사용     
function getTestList(req, cb) {
    var parm = req.query;
    var query = 'PRAGMA empty_result_callbacks=1; SELECT * FROM overload ORDER BY code asc;';
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=config&order=ivs_get_list&db=./dbms/backup/' + parm.testcode + '/ivs_result.dbb&col_del=TAB&sqlsize=' + query.length,
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
      var jsonResult = new Object(ConvertToJson(body, "\t"));
      console.log('\n\n****************************************************');
      console.log('                   getTestList');
      console.log('****************************************************\n');
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


function replaceString(str) {
    str = str.replace("%", "%25");
    str = str.replace("@", "%40");
    str = str.replace("#", "%23");
    str = str.replace("?", "%3F");
    str = str.replace("=", "%3D");
    str = str.replace("/", "%2F");
    str = str.replace(" ", "%20");
    str = str.replace("\n", "%0A");
    return str;
}

module.exports = {
    ivsGetLoadList: ivsGetLoadList,
    getSelectedTestList: getSelectedTestList,
    getRuleList: getRuleList,
    getTestList: getTestList,
    getOverloadData: getOverloadData,

};