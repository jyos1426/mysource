/**
 * Model - login auth
 */

var sqlite3			= require('sqlite3').verbose();
var path				= require('path');

// var config			= require('../config/app-config.json');
var utils       = require('util');
var util 				= require('./util');
var http       	= require('http');

// var dbCbraCommon	= config.db.common;

// ============================================================================

function loginUserInfo(id, pw, req, cb)
{
	var ip = util.getUserIP(req);
	var query = utils.format('PRAGMA empty_result_callbacks=1; SELECT a.id, a.password, a.perm, a.name, a.part, a.email, a.phone, a.lastdate, b.ip FROM master a inner join access_list b on a.id=b.id WHERE (a.id = "%s") AND (a.password = "%s") ', id, pw);
	const options = {
		host: req.session.ip,
		port: req.session.port,
		path: "/main.a?act=config&order=ivs_get_list&db=./config/ivs_Login.dbb&col_del=Delimeter&sqlsize=" + query.length,
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

	var _req = http.request(options, (_res) => {
		var body = '';
		_res.on('data', (chunk) => {
			body += chunk;
		});
		_res.on('end', () => {
			var strArray = body.split("\n");
			var data = strArray[2].split("|");
			var row = strArray[0].split(",");

			if(row[1] == 0) return cb({ error: 'No data'});
			if((data[8] != '' && data[8] != '0.0.0.0') && ip != data[8]) return cb({ error: 'ip different'});

			id = data[0];
			perm = data[2];
			name = data[3];
			part = data[4];
			email = data[5];
			phone = data[6];
			lastdate = data[7];

			var jsonResult = {
				id : id,
				perm : perm,
				name : name,
				part : part,
				email : email,
				phone : phone,
				lastdate : lastdate,
				host : req.session.ip,
				port : req.session.port
			};
			console.log('\n\n********************************************************');
			console.log('  QUERY START | loginUserInfo');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);     
			console.log('result =>' + jsonResult);     
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | ' + name + 'loginUserInfo SUCCESS');
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
		return cb(err);
	});

}

// ============================================================================

/**
 * Export modules
 */

module.exports = {
	loginUserInfo: loginUserInfo,
	// findUserID: findUserID
};
