// var config = require('../../config/app-config.json');
var path = require('path');
var https = require('https');
var http = require('http');
var utils = require('util');
var async = require('async');


// (대시보드 열리면 기본수행) -  IVS Testing Check
function ivsTestingCheck(req, cb) {
    var parm = req.query;
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=test&order=ivs_run_check',
        method: 'GET',
        rejectUnauthorized: false,
        headers: {
            "Accept": "text/html, */*",
            "User-Agent": "MSIE",
            "Connection": "Keep-Alive",
        }
    };
    // console.log(options);

    var _req = http.request(options, (_res) => {
        var body = '';
        _res.on('data', (chunk) => {
            body += chunk;
        });
        _res.on('end', () => {
            var jsonResult = new Object(ConvertToJson(body, "|"));
            
			console.log('\n\n********************************************************');
			console.log('  QUERY START | IVS Testing Check');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | IVS Testing Check');
            console.log('********************************************************\n'); 
            return cb(null, jsonResult);
        });
        _res.on('error', (err) => {
            callback(err);
        });
    });
    _req.end();
    _req.on('error', (err) => {
        return cb(err);
    });
}

// (대시보드 열리면 기본수행) - 최근 연결 센서 가져오기
function getDUTList(req, cb) {
    var parm = req.query;

    var query = 'PRAGMA empty_result_callbacks=1; SELECT * FROM dut_list ORDER BY latest DESC;'
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=config&order=ivs_get_list&db=./config/ivs_Config.dbb&col_del=Delimeter&sqlsize=' + query.length,
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

    var _req = http.request(options, (_res) => {
        var body = '';
        _res.on('data', (chunk) => {
            body += chunk;
        });
        _res.on('end', () => {
            var jsonResult = new Object(ConvertToJson(body, "|"));
            
			console.log('\n\n********************************************************');
			console.log('  QUERY START | Get DUT List');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | Get DUT List');
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

function getSensorInfo(parm, cb) {
    var tasks = [
        function (callback) {
            const options = {
                host: parm.ip,
                port: parm.port,
                path: "/main.a?act=system&order=sys_cpu_mem_info&col_del=PIPE&",
                method: 'GET',
                rejectUnauthorized: false,
                headers: {
                    "Accept": "text/html, */*",
                    "User-Agent": "MSIE",
                    "Connection": "Keep-Alive",
                }
            };
            // if (parm.is_interval != '1') {
            //     console.log(options);
            // }
            var _req = https.request(options, (_res) => {
                var body = '';
                _res.on('data', (chunk) => {
                    body += chunk;
                });
                _res.on('end', () => {
                    // console.log('body'+body);
                    if (parm.is_interval != '1') {
                        console.log('\n\n****************************************************');   
                        console.log('  START | get Sensor Info  ');
                        console.log('--------------------------------------------------------');
                        console.log('  QUERY START | (1/2) get Sensor Basic Info   ');
                        console.log('--------------------------------------------------------');
                        console.log(options);
                        console.log('--------------------------------------------------------');
                        console.log('path =>' + options.path);      
                        console.log('result =>' + body);      
                        console.log('--------------------------------------------------------');
                        console.log('  QUERY END | (1/2) get Sensor Basic Info   ');
                    }
                    var resultBasicInfo = new Object(ConvertToJson(body, "|"));
                    callback(null, resultBasicInfo);
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
        function (resultBasicInfo, callback) {
            const options = {
                host: parm.ip,
                port: parm.port,
                path: "/main.a?act=traffic&order=trf_ips_realtime&col_del=PIPE&",
                method: 'GET',
                rejectUnauthorized: false,
                headers: {
                    "Accept": "text/html, */*",
                    "User-Agent": "MSIE",
                    "Connection": "Keep-Alive",
                }
            };
            // if (parm.is_interval != '1') {
            //     console.log(options);
            // }

            var _req = https.request(options, (_res) => {
                var body = '';
                _res.on('data', (chunk) => {
                    body += chunk;
                });
                _res.on('end', () => {
                    var resultNetworkInfo = new Object(ConvertToJson(body, "|"));
                    console.log('--------------------------------------------------------');
                    console.log('  QUERY START | (2/2) get Sensor Network Info   ');
                    console.log('--------------------------------------------------------');
                    console.log(options);
                    console.log('--------------------------------------------------------');
                    console.log('path =>' + options.path);      
                    console.log('result =>' + body);      
                    console.log('--------------------------------------------------------');
                    console.log('  QUERY END | (2/2) get Sensor Network Info   ');
                    console.log('--------------------------------------------------------');
                    console.log('  END | get Sensor Info  ');
                    console.log('*********************************************************\n');
                    callback(null, resultBasicInfo[0].datas[0], resultNetworkInfo[1].datas[0]);
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
    ];

    async.waterfall(tasks, function (err,resultBasicInfo,resultNetworkInfo ) {
        if(resultBasicInfo == null || typeof resultBasicInfo == 'undefined' ||
                resultNetworkInfo == null || typeof resultNetworkInfo == 'undefined' ){
            return cb(null, null);
        }
        var result = Object.assign(resultBasicInfo, resultNetworkInfo);
        if (err)
            return cb(null, err);
        else
            return cb(null, result);
    });
}

function connectWithSensor(req, cb){
    var parm = req.query;

    var tasks = [
        function (callback) {

            const options = {
                host: parm.ip,
                port: parm.port,
                path: "/main.a?ocx=ver?mode=0000?param=",
                method: 'GET',
                rejectUnauthorized: false,
                headers: {
                    "Accept": "text/html, */*",
                    "User-Agent": "MSIE",
                    "Connection": "Keep-Alive",
                }
            };
            // console.log(options);
            var _req = https.request(options, (_res) => {
                var body = '';
                _res.on('data', (chunk) => {
                    body += chunk;
                });
                _res.on('end', () => {
                    // console.log(body);
                    var versionData = {
                        version:'',
                        path:''
                    };
                    var strArray = body.split('');
                    if(strArray.length > 0){
                        versionData.version = strArray[1];
                        versionData.path = strArray[5];
                    }
                    
                    console.log('\n\n********************************************************');
                    console.log('  START | connect With Sensor  ');
                    console.log('--------------------------------------------------------');
                    console.log('  QUERY START | (1/3) get Sensor Version   ');
                    console.log('--------------------------------------------------------');
                    console.log(options);
                    console.log('--------------------------------------------------------');
                    console.log('path =>' + options.path);      
                    console.log('result =>' + body);      
                    console.log('--------------------------------------------------------');
                    console.log('  QUERY END | (1/3) get Sensor Version   ');

                    callback(null, versionData);
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
        function (versionData, callback) {
            var query = "PRAGMA empty_result_callbacks=1;Select use from license_list where reg=1 order by code;";
            const options = {
                host: parm.ip,
                port: parm.port,
                path: "/main.a?act=config&order=config_sql_select&path=../config&dbname=sn_licenses&sqlsize=" + query.length,
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
            var _req = https.request(options, (_res) => {
                var body = '';
                _res.on('data', (chunk) => {
                    body += chunk;
                });
                _res.on('end', () => {
                    var jsonResult = new Object(ConvertToJson(body, "|"));
                    var licenseData = {
                        license : ''
                    };
                    for (var i = 0; i < jsonResult[0].datas.length; i++) {
                        licenseData.license += jsonResult[0].datas[i].use
                    }
                    console.log('--------------------------------------------------------');
                    console.log('  QUERY START | (2/3) get Sensor License   ');
                    console.log('--------------------------------------------------------');
                    console.log(options);
                    console.log('--------------------------------------------------------');
                    console.log('path =>' + options.path);     
                    console.log('--------------------------------------------------------');
                    console.log('  QUERY END | (2/3) get Sensor License   ');
                    callback(null, versionData ,licenseData);
                });
                _res.on('error', (err) => {
                    return callback(err);
                });
            });
            _req.write(query);
            _req.end();
            _req.on('error', (err) => {
                return callback(err);
            });
        },
        function(versionData, licenseData, callback){
            var path = utils.format('/main.a?act=config&order=ivs_setting_dut' +
                '&ip=%s&port=%s&console_id=%s&console_pwd=%s&device_id=%s&device_port=%s&device_pwd=%s&version=%s&license=%s&path=%s',
                parm.ip,
                parm.port,
                parm.console_id,
                replaceString(parm.console_passwd),
                parm.device_id,
                parm.device_port,
                replaceString(parm.device_passwd),
                replaceString(versionData.version),
                licenseData.license,
                versionData.path);
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
                    var dutSettingResult = {
                        dut_setting_result : body
                    };
                    console.log('--------------------------------------------------------');
                    console.log('  QUERY START | (3/3) DUT Update   ');
                    console.log('--------------------------------------------------------');
                    console.log(options);
                    console.log('--------------------------------------------------------');
                    console.log('path =>' + options.path);      
                    console.log('result =>' + body);      
                    console.log('--------------------------------------------------------');
                    console.log('  QUERY END | (3/3) DUT Update   ');
                    console.log('--------------------------------------------------------');
                    console.log('  END | connect With Sensor  ');
                    console.log('****************************************************\n\n');
                    callback(null, versionData ,licenseData, dutSettingResult);
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
    ];

    async.waterfall(tasks, function (err, versionData, licenseData, dutSettingResult ) {
        if(versionData == null || typeof versionData == 'undefined' ||
            licenseData == null || typeof licenseData == 'undefined' ){
            return cb(null, null);
        }
        var result = Object.assign(versionData, licenseData, dutSettingResult);
        if (err)
            return cb(null, err);
        else
            return cb(null, result);
    });
}

function getIVSInfo(param, callback) {
    const options = {
        host: param.ip,
        port: param.port,
        path: "/main.a?act=config&order=ivs_resource_check",
        method: "GET",
        rejectUnauthorized: false,
        headers: {
            "Accept": "text/html, */*",
            "User-Agent": "MSIE",
            "Connection": "Keep-Alive",
        }
    };

    var _req = http.request(options, (_res) => {
        var body = '';
        var data;
        _res.setEncoding('utf8');
        _res.on('data', (chunk) => {
            try{
              data = JSON.parse(chunk);
              body += chunk;
            }catch(e){
              console.log('\n\n********************************************************');
              console.log('  !! JSON PARSING ERROR !! - GET IVS SYSTEM INFO');
              console.log('****************************************************\n\n');
            }
        });
        _res.on('end', () => {
            callback(null, body);
        });
        _res.on('error', (err) => {
            return callback(err);
        });
    });
    _req.end();
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
    getDUTList: getDUTList,
    ivsTestingCheck: ivsTestingCheck,
    getSensorInfo: getSensorInfo,
    connectWithSensor: connectWithSensor,
    getIVSInfo: getIVSInfo
};
