/**
 * Model - audit log
 */

// var config		= require('../config/app-config.json');
var utils		= require('./util');
var util		= require('util');

var sqlite3		= require('sqlite3').verbose();
var http      = require('http');
var path			= require('path');
var moment		= require('moment');
var fs 				= require('fs');
var asyn = require('async');

// var dbCbraAudit = config.db.audit;

// ============================================================================


function setSystemAuditLog(prmt, cb)
{
	var date1 = moment().format('YYYYMMDD');
	var db = util.format('./dbms/audit/ivs_audit_%s.dbb', date1);

	date = '"'+moment().format('YYYYMMDDHHmmss')+'"';
	userid = '"'+prmt.userid+'"';
	userip = '"'+prmt.userip+'"';
	type = '"'+prmt.type+'"';
	job = '"'+prmt.job+'"';
	job_detail = '"'+prmt.job_detail+'"';
	result = '"'+prmt.result+'"';

	var tasks = [
			function(callback) {
					var dbPath = path.join(process.cwd(),'../ivs/dbms/audit/ivs_audit_'+date1+'.dbb');
					if(!fs.existsSync(dbPath)){
							// console.log('no file');
							var sqlite3db = new sqlite3.Database(dbPath);
							sqlite3db.serialize(function() {
									sqlite3db.run("BEGIN TRANSACTION");
									sqlite3db.run("CREATE TABLE master(date TEXT, userid TEXT, userip TEXT, type TEXT, job TEXT, job_detail TEXT, result TEXT, message TEXT);");
									sqlite3db.run("COMMIT", function(err){
											if(err) return;
											callback(null);
									});
							});
							sqlite3db.close();
					}else{
							// console.log('file exits');
							callback(null);
					}
			},
			function(callback) {
					var query =`PRAGMA empty_result_callbacks=1;
							INSERT INTO
								master(date
									, userid
									, userip
									, type
									, job
									, job_detail
									, result 
								)
							VALUES(
								${date}
								, ${userid}
								, ${userip}
								, ${type}
								, ${job}
								, ${job_detail}
								, ${result}
							)`;

					query = utils.minifize(query);

					const options = {
							host: prmt.host,
							port: prmt.port,
							path: util.format('/main.a?act=config&order=ivs_sql_execute&db=%s&sqlsize=%d', db, Buffer.byteLength(query)),
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
									// console.log('body:'+body)
									jsonResult = new Object(ConvertToJson(body, "\t"));
									// console.log(jsonResult);
									
									// console.log('\n\n********************************************************');
									// console.log('  QUERY START | setSystemAuditLog');
									// console.log('--------------------------------------------------------');
									// console.log(options);
									// console.log('--------------------------------------------------------');
									// console.log('path =>' + options.path);     
									// console.log('result =>' + jsonResult);     
									// console.log('--------------------------------------------------------');
									// console.log('  QUERY END | setSystemAuditLog');
									// console.log('********************************************************\n');

									callback(null, jsonResult);
									// return cb(null, jsonResult);
							});
							_res.on('error', (err) => {
									// cb(err);
									return callback(err);
							});
					});
					_req.write(query);
					_req.end();
					_req.on('error', (err) => {
							// cb(err);
							return callback(err);
					});
			}
	];

	asyn.series(tasks, function(error, result) {
			if (error) {
					// res.status(500).send('Server Error');
					return cb(error);
			} else {
					return cb(null, result);
			}
	});

}
// ============================================================================

/**
 * Export modules
 */

module.exports = {
	setSystemAuditLog: setSystemAuditLog
};
