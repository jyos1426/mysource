var path       = require('path');
var moment     = require('moment');
var util       = require('util');
var http       = require('http');
var sqlite3    = require('sqlite3').verbose();

// var config     = require('../../config/app-config.json');
var utils      = require('../util');


function getAuditLog(req, cb) {
    var param = req.query;

    if(param.date == undefined){
        callback(err);
    }
    var datetime = param.date.split('.');

    var year  = datetime[0];
    var month = datetime[1];
    var day  = datetime[2];
    var db    = util.format('./dbms/audit/ivs_audit_%s%s%s.dbb', year, month, day);

    var type = "";
    var result = "";
    var userip = "";
    // var userid = "";
    // var job = "";
    // var job_detail = "";
    // var message = "";

    if( ( param.type !== undefined ) && ( param.type.length > 0 ) ){
  		type += " AND ( type = '" + param.type + "')";
  	}

    if( ( param.result !== undefined ) && ( param.result.length > 0 ) ){
      result += " AND ( result = '" + param.result + "')";
    }

    if( ( param.userip !== undefined ) && ( param.userip.length > 0 ) ){
  		userip += " AND ( userip = '" + param.userip + "')";
    }

  	// if( ( param.userid !== undefined ) && ( param.userid.length > 0 ) ){
  	// 	userid += " AND ( userid = '" + param.userid + "')";
  	// }

  	// if( ( param.job !== undefined ) && ( param.job.length > 0 ) ){
  	// 	job += " AND ( job = '" + param.job + "')";
    // }
    //
    // if( ( param.job_detail !== undefined ) && ( param.job_detail.length > 0 ) ){
  	// 	job_detail += " AND ( job_detail = '" + param.job_detail + "')";
  	// }

    // if( ( param.message !== undefined ) && ( param.message.length > 0 ) ){
  	// 	message += " AND ( message  = '" + param.message + "')";
  	// }

  	var query = `PRAGMA empty_result_callbacks=1;
      SELECT
          date, userid, userip, type, job, job_detail, result, message
      FROM
          master
      WHERE 1
          ${type}
          ${result}
          ${userip}
      ORDER BY
          date DESC;
      `;

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
    getAuditLog: getAuditLog
};
