// var config = require('../../config/app-config.json');
var utils = require('../util');

var path = require('path');
var moment = require('moment');
var util = require('util');
var http = require('http');
var sqlite3     = require('sqlite3').verbose();


function ivsCheckRule(req, cb) {
    var parm = req.body;
    var query = parm.ruleset;
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=test&order=ivs_check_rule&pcap_save=' + parm.pcap_save +'&col_del=TAB&filesize=' + query.length, 
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
			console.log('\n\n********************************************************');
			console.log('  QUERY START | ivsCheckRule');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
            console.log('path =>' + options.path);      
            
            if(body == 'ERROR_  1000'){
                console.log('result =>' + body);      
                console.log('--------------------------------------------------------');
                console.log('  QUERY END | ivsCheckRule');
                console.log('********************************************************\n'); 
                return cb(null, 'err');
            }else{
                var strArray = body.split("|");
                var result = {
                    testcode : strArray[0],
                    dbpath : strArray[1],
                    dbname : strArray[3].replace('\n','')
                }
                console.log('--------------------------------------------------------');
                console.log('  QUERY END | ivsCheckRule');
                console.log('********************************************************\n'); 
                return cb(null, result);
            }
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


function ivsGetList(req, cb) {
    var parm = req.query;
    var db    = util.format('./dbms/backup/%s/ivs_result.dbb', parm.testcode );		

    var query = 'PRAGMA empty_result_callbacks=1;\
    SELECT rule_code, rule, valid FROM rule_check;';
    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: '/main.a?act=config&order=ivs_get_list&db=' + db +'&col_del=TAB&sqlsize=' + query.length,
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
			console.log('  QUERY START | ivsGetList');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | ivsGetList');
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


function ivsRunCheck(req, cb) {
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
			console.log('  QUERY START | ivsRunCheck');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);      
			console.log('result =>' + body);      
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | ivsRunCheck');
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
module.exports = {
    ivsCheckRule: ivsCheckRule,   
    ivsGetList: ivsGetList, 
    ivsRunCheck: ivsRunCheck
};