var path        = require('path');
var moment      = require('moment');
// var config      = require('../../config/app-config.json');

var util       = require('util');
var utils       = require('../util');
var http       = require('http');


function getAuditLog(req, cb){

	var param = req.query;
	var filterLimit = "";
	
	var year  = "";
    var month = "";
    var day   = "";
	var db    = "";

	if( ( param.ctime !== undefined ) && ( param.ctime.length > 0 ) ){
		if(!moment(param.ctime, 'YYYY.MM.DD').isValid()) {
			return cb({ error: 'No data'});
		}
		var datetime = param.ctime.split('.');	

		year  = datetime[0];
		month = datetime[1];
		day  = datetime[2];
		db    = util.format('./dbms/audit/ivs_audit_%s%s%s.dbb', year,month, day);		
	}else{
		var date  = moment().format('YYYYMMDD');
		db    = util.format('./dbms/audit/ivs_audit_%s.dbb', date);		
	}

	if((param.limit !== undefined) && (param.limit.length > 0)){
		filterLimit = " LIMIT " + param.limit;
	}
	
	var query = "PRAGMA empty_result_callbacks=1;\
	SELECT\
		date as ctime, userid as id, userip as access_ip, type, job as category, job_detail as action, result as status_code, message\
	FROM\
		master\
	ORDER BY\
		ctime DESC"
	+ filterLimit
	+ "\
	";

	query = utils.minifize(query);

    const options = {
        host: req.session.ip,
        port: req.session.port,
        path: util.format('/main.a?act=config&order=ivs_get_list&db=%s&sqlsize=%d', db, query.length),
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
            var jsonResult = body.replace(/null/g, "-");
            jsonResult = new Object(ConvertToJson(jsonResult, "|"));
            console.log(jsonResult);
            
			
			console.log('\n\n********************************************************');
			console.log('  QUERY START | getAuditLog');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);     
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | getAuditLog');
            console.log('********************************************************\n'); 

            return cb(null, jsonResult);
        });
        _res.on('error', (err) => {
            cb(err);
        });
    });
    _req.write(query);
    _req.end();
    _req.on('error', (err) => {
        cb(err);
    });
}

module.exports = {
	getAuditLog: getAuditLog,
};
