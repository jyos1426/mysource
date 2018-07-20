// var config = require('../../config/app-config.json');
var util = require('util');
var path = require('path');
var http = require('http');
var async = require('async');

// 테스트 수행순서
// 1. ivsSetting            - [Req.4.1] 탐지테스트 설정 : 서버에 입력된 테스트 설정 전송 / path 리턴
// 2. ivsRuleSetUpload      - [Req.4.2] 탐지테스트 정책 추가 : 선택한 임시 정책 업로드
// 3. getRuleList           - db path를 포함한 쿼리 재전송 후 list 뷰로 리턴 => 모달 두번째 화면 그리드
// 4. ivsUpdateRuleList     - [Req.4.3] 탐지테스트 선택 정책 적용 : rule들을 sam파일로 정리해서 POST
// 5. ivsRun

// 6. ivsRunCheck           - [Req.4.5] 탐지테스트 실행 상태 확인
// 7. getTestList           - Test 결과 SELECT : Test중 1.5초단위로 혹은 완료 시 사용     

// ivsClear
// ivsSave 


//[Req.4.1] 탐지테스트 설정
function ivsSetting(req, cb) {
    var parm = req.query;
    var path = util.format('/main.a?act=test&order=ivs_setting&test=%s&category=%s&type=%s&interval=%s&pcap_index=%s',
        parm.test, parm.category, parm.type, parm.interval, parm.pcap_index);
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
    // console.log(options);
    // console.log('=>' + options.path);
    var _req = http.request(options, (_res) => {
        var body = '';
        _res.on('data', (chunk) => {
            body += chunk;
        });
        _res.on('end', () => {
            console.log('\n\n********************************************************');
            console.log('  QUERY START | [ 1. ivsSetting ] - [2] - [3] - [4] ');
            console.log('--------------------------------------------------------');
            console.log(options);
            console.log('--------------------------------------------------------');
            console.log('path =>' + options.path);     

            if(body == 'ERROR_  1000'){ 
                console.log('result =>' + body);  
                console.log('--------------------------------------------------------');
                console.log('  QUERY END | [ 1. ivsSetting ] - [2] - [3] - [4] ');
                console.log('********************************************************\n');  
                return cb(null, 'err'); 
            }else{             
                // console.log(body);   
                var strArray = body.split("|");
                var result = {
                    testcode : strArray[0],
                    dbpath : strArray[1],
                    dbname : strArray[3].replace('\n','')
                }    
                console.log('--------------------------------------------------------');
                console.log('  QUERY END | [ 1. ivsSetting ] - [2] - [3] - [4] ');
                console.log('********************************************************\n'); 
                return cb(null, result);
            }
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

//[Req.4.2] 탐지테스트 정책 추가
function ivsRuleSetUpload(req, cb) {
    var parm = req.body;
    var query = parm.ruleset;
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=test&order=ivs_ruleset_upload&test_code=' + parm.testcode +'&filesize=' + query.length,
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
            var jsonResult = new Object(ConvertToJson(body, "\t"));
            // console.log(body);
            
			console.log('\n\n********************************************************');
			console.log('  QUERY START | [1] - [ 2. ivsRuleSetUpload ] - [3] - [4] ');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | [1] - [ 2. ivsRuleSetUpload ] - [3] - [4] ');
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

function getRuleList(req, cb) {
    var parm = req.query;
    var query = '';
    if(parm.retest == 'true'){
        query = "PRAGMA empty_result_callbacks=1; "+
                "attach database './dbms/backup/" + parm.testcode + "/ivs_result.dbb' as result; "+ 
                "select m.test_code, m.category, m.code, m.position as select_value, m.automake, m.pcap, m.detect, r.name, r.ncscrule "+ 
                "from master as r "+ 
                "INNER JOIN result.master as m ON m.code = r.code "+ 
                "order by select_value asc, m.code asc;";
    }else{
        query = 'PRAGMA empty_result_callbacks=1; SELECT * FROM master WHERE ndelete = 0 ORDER BY code';
    }

    // console.log(query);
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
    // console.log(options);
    // console.log('=>' + options.path);
    var _req = http.request(options, (_res) => {
        var body = '';
        _res.on('data', (chunk) => {
            body += chunk;
        });
        _res.on('end', () => {
            var jsonResult = new Object(ConvertToJson(body, "\t"));     

			console.log('\n\n********************************************************');
			console.log('  QUERY START | [1] - [2] - [ 3. getRuleList ] - [4] ');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | [1] - [2] - [3. getRuleList ] - [4] ');
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

//[Req.4.3] 탐지테스트 선택 정책 적용
function ivsUpdateRuleList(req, cb) {
    var parm = req.body;
    var query = parm.sam;
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=test&order=ivs_update_list&test_code=' + parm.testcode + '&filesize=' + query.length,
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
            var jsonResult = new Object(ConvertToJson(body, "\t"));            
            
			console.log('\n\n********************************************************');
			console.log('  QUERY START | [1] - [2] - [3] - [ 4. ivs Update RuleList ] ');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('result =>' + body);      
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | [1] - [2] - [3] - [ 4. ivs Update RuleList ] ');
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

function ivsRun(req, cb) {
	var parm = req.query;
  // var query = 'PRAGMA empty_result_callbacks=1; SELECT * FROM master WHERE ndelete = 0 ORDER BY code';
  const options = {
    host: req.session.ip,
    port: req.session.port,
    path: '/main.a?act=test&order=ivs_run&test_code=' + parm.testcode,
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
      "Accept": "text/html, */*",
      "User-Agent": "MSIE",
      "Connection": "Keep-Alive",
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
        console.log('  QUERY START | ivs Run ');
        console.log('--------------------------------------------------------');
        console.log(options);
        console.log('--------------------------------------------------------');
        console.log('path =>' + options.path);      
        console.log('result =>' + body);      
        console.log('--------------------------------------------------------');
        console.log('  QUERY END | ivs Run  ');
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

//[Req.4.5] 탐지테스트 실행 상태 확인
function ivsRunCheck(req, cb) {
	var parm = req.query;
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=test&order=ivs_run_check&test_code='+parm.testcode,
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
            // console.log(body);
            console.log('\n\n****************************************************');
            console.log('                   ivsRunCheck');
            console.log('****************************************************\n\n');
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

// Test 결과 SELECT : Test중 1.5초단위로 혹은 완료 시 사용     
function getTestList(req, cb) {
	var parm = req.query;
  var query = 'PRAGMA empty_result_callbacks=1;attach database \'' + parm.dbpath + '/'+ parm.dbname + '\' as regex; '+
            'select m.test_code, m.category, m.code, m.automake, m.pcap, m.detect, m.position as select_value, r.name, r.ncscrule, m.detect_code, m.include '+
            'from master as m INNER JOIN regex.master as r ON m.code = r.code '+
            'order by select_value asc, m.code asc; ';

	// console.log(query);
  const options = {
    host: req.session.ip,
    port: req.session.port,
    path: '/main.a?act=config&order=ivs_get_list&db=./dbms/backup/' + parm.testcode + '/ivs_result.dbb&col_del=TAB&sqlsize=' + Buffer.byteLength(query),
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
    //   console.log(body);
    console.log('\n\n****************************************************');
    console.log('                   getTestList');
    console.log('****************************************************\n\n');
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

function ivsClear(req, cb) {
    var parm = req.query;
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=test&order=ivs_clear&step='+parm.step,
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
            console.log('  QUERY START  IVS CLEAR [초기화]');
            console.log('--------------------------------------------------------');
            console.log(options);
            console.log('--------------------------------------------------------');
            console.log('path =>' + options.path);      
            console.log('result =>' + body);      
            console.log('--------------------------------------------------------');
            console.log('  QUERY END | IVS CLEAR [초기화]');
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

function ivsTestSave(req, cb) {
    var parm = req.body;
    var comment = parm.comment;
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: "/main.a?act=test&order=ivs_test_save&test_code="+ parm.test_code +"&delete="+ parm.delete + "&filesize="+ Buffer.byteLength(comment),
        method: 'POST',
        rejectUnauthorized: false,
        headers: {
            "Accept": "text/html, */*",
            "User-Agent": "MSIE",
            "Connection": "Keep-Alive",            
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            "Content-Length": Buffer.byteLength(comment)
        },
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
            console.log('  QUERY START |   IVS Test SAVE');
            console.log('--------------------------------------------------------');
            console.log(options);
            console.log('--------------------------------------------------------');
            console.log('path =>' + options.path);      
            console.log('result =>' + body);      
            console.log('--------------------------------------------------------');
            console.log('  QUERY END | IVS Test SAVE');
            console.log('********************************************************\n'); 
            return cb(null, jsonResult);
        });
        _res.on('error', (err) => {
            callback(err);
        });
    });
    _req.write(replaceString(comment));
    _req.end();
    _req.on('error', (err) => {
        return cb(null, jsonResult);
    });
}



// function ivsTestReload(req, cb) {
//     console.log('\n\n****************************************************');
//     console.log('  QUERY START | IVS TestReload ');
//     var parm = req.query;
//     const options = {
//         host: req.session.ip,
//         port: req.session.port,
//         path: '/main.a?act=test&order=ivs_test_reload&test_code='+parm.testcode,
//         method: 'GET',
//         rejectUnauthorized: false,
//         headers: {
//             "Accept": "text/html, */*",
//             "User-Agent": "MSIE",
//             "Connection": "Keep-Alive"
//         }
//     };
//     console.log(options);
//     console.log('=>' + options.path);
//     var _req = http.request(options, (_res) => {
//         var body = '';
//         _res.on('data', (chunk) => {
//             body += chunk;
//         });
//         _res.on('end', () => {
//             if(body == 'ERROR_  1000'){
//                 return cb(null, 'err');
//             }else{  
//                 var strArray = body.split("|");
//                 var result = {
//                     testcode : strArray[0],
//                     dbpath : strArray[1],
//                     dbname : strArray[3].replace('\n','')
//                 }
//                 console.log('  QUERY END | IVS TestReload ');
//                 console.log('****************************************************\n\n');
//                 return cb(null, result);
//             }
//         });
//         _res.on('error', (err) => {
//             callback(err);
//         });
//     });
//     _req.end();
//     _req.on('error', (err) => {
//         console.log(err);
//     });
// }




function ivsTestReload(req, cb){
    var parm = req.query;

    var tasks = [
        function (callback) {
            var parm = req.query;
            const options = {
                host: req.session.ip,
                port: req.session.port,
                path: '/main.a?act=test&order=ivs_test_reload&test_code='+parm.testcode,
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
                    console.log('\n\n********************************************************');
                    console.log('  START | IVS TEST RELOAD ');
                    console.log('--------------------------------------------------------');
                    console.log('  QUERY START | [ 1. ivsTestReload ] - [2]');
                    console.log('--------------------------------------------------------');
                    console.log(options);
                    console.log('--------------------------------------------------------');
                    console.log('path =>' + options.path);      
                    console.log('result =>' + body);      
                    console.log('--------------------------------------------------------');
                    console.log('  QUERY END | [ 1. ivsTestReload ] - [2]');
                    if(body == 'ERROR_  1000'){
                        callback(null, 'err', null);
                    }else{  
                        var strArray = body.split("|");
                        var result = {
                            testcode : strArray[0],
                            dbpath : strArray[1],
                            dbname : strArray[3].replace('\n','')
                        }
                        callback(null, 'success', result);
                    }
                });
                _res.on('error', (err) => {
                    return callback(err);
                });
            });
            _req.end();
            _req.on('error', (err) => {
                return callback(err);
            });
        },
        function(status, testingData, callback){
            if(status == 'success'){
                callback(null, status, null, testingData);
            }else{
                var parm = req.query;
                const options = {
                    host: req.session.ip,
                    port: req.session.port,
                    path: '/main.a?act=test&order=ivs_run_check&test_code='+parm.testcode,
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
                        if(jsonResult.length > 0){
                            var comment = jsonResult[0].datas[0].comment;
                            var test_status = jsonResult[0].datas[0].test_status;
                            
                            console.log('--------------------------------------------------------');
                            console.log('  QUERY START | [1] - [ 2. ivs Run Check ]');
                            console.log('--------------------------------------------------------');
                            console.log(options);
                            console.log('--------------------------------------------------------');
                            console.log('path =>' + options.path);      
                            console.log('result =>' + body);      
                            console.log('--------------------------------------------------------');
                            console.log('  QUERY END | [1] - [ 2. ivs Run Check ]');
                            console.log('  END | IVS TEST RELOAD ');
                            console.log('****************************************************\n');

                            callback(null, 'err', test_status , comment);
                            // if(test_status == 'NO_TEST'){
                            //     callback(null, 'err', , comment);
                            // }else if( comment.includes('[ERROR ]')){
                            //     callback(null, 'err',test_status , comment);
                            // }else{
                            //     callback(null, 'err',test_status , '알수 없음');
                            // }
                        }else{
    
                        }
                    });
                    _res.on('error', (err) => {
                        return callback(err);
                    });
                });
                _req.end();
                _req.on('error', (err) => {
                    return callback(err);
                });
            }
        }    
    ];

    async.waterfall(tasks, function (err, _status, _test_status, _result) {    
        var json = [];    
        if( err || _result === null || typeof _result === undefined){
            return cb(null, {status:'err', test_status:_test_status , result: _result} );
        }else{
            return cb(null, {status:_status, test_status:_test_status, result: _result} );
        }
    });
}


//[Req.7.2] 탐지테스트 이력 조회
function ivsGetDetectList(req, cb) {
    var parm = req.query; 
    var datetime = parm.date.split('.');

    var year  = datetime[0];
    var month = datetime[1];
    var day  = datetime[2];
    var date    = util.format('%s/%s/%s', year, month, day);

    var db      = './config/ivs_Config.dbb';    
    var query   = 'PRAGMA empty_result_callbacks=1; \
                    SELECT test_code, test, type, category, version, pcap_id as backtraffic, pcapdir as backtraffic_dir, interval, comment, save FROM test_list \
                    WHERE test = 1 AND date  LIKE "' + date + ' %" ORDER BY test_code DESC;';
    // if (parm.test_code  != null || parm.test_code != undefined || parm.test_code != ''){
    //     query += ' WHERE test_code = ' + parm.test_code;
    // }
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?' +
                'act=config' +
                '&order=ivs_get_list' +
                '&db=' + db +
                '&sqlsize=' + Buffer.byteLength(query),
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
            // console.log(body);
            
            console.log('\n\n********************************************************');
            console.log('  QUERY START |  get Detect List (Log)');
            console.log('--------------------------------------------------------');
            console.log(options);
            console.log('--------------------------------------------------------');
            console.log('path =>' + options.path);      
            console.log('query =>' + query);      
            console.log('--------------------------------------------------------');
            console.log('  QUERY END | get Detect List (Log)');
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


function getDetectCount(req, cb) {
    var parm = req.query;
    var db      = './config/ivs_Config.dbb';    
    var query   = 'SELECT COUNT(test_code) AS count FROM test_list';
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
            console.log('  QUERY START |  get Detect Count ');
            console.log('--------------------------------------------------------');
            console.log(options);
            console.log('--------------------------------------------------------');
            console.log('path =>' + options.path);      
            console.log('query =>' + query);      
            console.log('--------------------------------------------------------');
            console.log('  QUERY END | get Detect Count ');
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
    ivsSetting: ivsSetting,
    ivsRuleSetUpload: ivsRuleSetUpload,
    getRuleList: getRuleList,
    ivsUpdateRuleList: ivsUpdateRuleList,
    getTestList: getTestList,
    ivsRun: ivsRun,
    ivsClear: ivsClear,
    ivsTestSave: ivsTestSave,
    ivsTestReload: ivsTestReload,
    ivsRunCheck: ivsRunCheck,

    ivsGetDetectList: ivsGetDetectList,
    getDetectCount: getDetectCount
};