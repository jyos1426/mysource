// var config = require('../../config/app-config.json');
var utils = require('../util');

var path = require('path');
var moment = require('moment');
var util = require('util');
var http = require('http');

// 탐지 테스트 로그를 가져온다.
function getDetectLog(req, cb) {
    var param = req.query;

    //db 파일 형식
    var datetime = param.date.split('.');

    var year  = datetime[0];
    var month = datetime[1];
    var day  = datetime[2];
    var db    = util.format('./dbms/log/%s/%s/%s/ivs_log_%s%s%s.dbb', year, month, day, year, month, day);

    // 필터 조건
    var test_code = "";
    var rule_category = "";
    var rule_code = "";
    var rule_name = "";
    var rule_pattern = "";
    var include = "";

    // console.log(param);

	if( ( param.test_code !== undefined ) && ( param.test_code.length > 0 ) ){
		test_code += " AND ( test_code = '" + param.test_code + "')";
	}

	if( ( param.rule_category !== undefined ) && ( param.rule_category.length > 0 ) ){
		rule_category += " AND ( rule_category = " + param.rule_category + ")";
    }

	if( ( param.rule_code !== undefined ) && ( param.rule_code.length > 0 ) ){
		rule_code += " AND ( rule_code = " + param.rule_code + ")";
	}

	if( ( param.rule_name !== undefined ) && ( param.rule_name.length > 0 ) ){
		rule_name += " AND ( rule_name LIKE '%" + param.rule_name + "%')";
    }

    if( ( param.rule_pattern !== undefined ) && ( param.rule_pattern.length > 0 ) ){
		rule_name += " AND ( rule_pattern LIKE '%" + param.rule_pattern + "%')";
	}

    if( ( param.include !== undefined ) && ( param.include.length > 0 ) ){

        if (param.include == "true"){
            param.include = 1;
        } else {
            param.include = 0;
        }

		include += " AND ( include = " + param.include + ")";
	}

    // Post Data
	var query = `PRAGMA empty_result_callbacks=1; 
        SELECT
            *
        FROM
            detect
        WHERE 1
            ${test_code}
            ${rule_category}
            ${rule_code}
            ${rule_name}
            ${rule_pattern}
            ${include}
        ORDER BY
    date DESC;
    `;

    query = utils.minifize(query);

    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: util.format('/main.a?act=config&order=ivs_get_list&db=%s&col_del=TAB&sqlsize=%d', db, query.length),
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
    // console.log("Post: " + query);

    var _req = http.request(options, (_res) => {
        var body = '';
        _res.on('data', (chunk) => {
            body += chunk;
        });
        _res.on('end', () => {

            var jsonResult = new Object(ConvertToJson(body, "\t"));

            // console.log(jsonResult);
            
			console.log('\n\n********************************************************');
			console.log('  QUERY START | get DetectLog');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | get DetectLog');
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
        callback(err);
    });
}


// 탐지 테스트 상세 로그를 가져온다.
function getDetectLogDetail(req, cb) {

    var param = req.query;
    // 필터 조건
    var test_code = "";

    // console.log(param);

	if( ( param.test_code !== undefined ) && ( param.test_code.length > 0 ) ){
		test_code += " AND ( test_code = '" + param.test_code + "')";
	}

    // Post Data
	var query = `PRAGMA empty_result_callbacks=1;
    SELECT
        test_code, test, type, category, version, pcap_id as backtraffic, interval, comment
    FROM
        test_list
    WHERE 1
        ${test_code}
    ORDER BY
        date DESC;
    `;

    query = utils.minifize(query);

    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: util.format('/main.a?act=config&order=ivs_get_list&db=./config/ivs_Config.dbb&sqlsize=%d',query.length),
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
    // console.log("Post: " + query);

    var _req = http.request(options, (_res) => {
        var body = '';
        _res.on('data', (chunk) => {
            body += chunk;
        });
        _res.on('end', () => {

            var jsonResult = new Object(ConvertToJson(body, "|"));

            // console.log(jsonResult);
            
			console.log('\n\n********************************************************');
			console.log('  QUERY START | get DetectLog Detail');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | get DetectLog Detail');
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
        callback(err);
    });
}
module.exports = {
    getDetectLog: getDetectLog,
    getDetectLogDetail: getDetectLogDetail
};
