var sqlite3     = require('sqlite3').verbose();
var path        = require('path');
var moment      = require('moment');

// var config      = require('../../config/app-config.json');
var http       = require('http');
var utils       = require('util');

// var dbCbraCommon    = config.db.common;

function getAccountInfo(req, cb)
{
	var param = req.query;
	var arrayValue = new Array();
	var where = '';
	if(!param.id){
		where = 'WHERE (1 = %s)'
		arrayValue.push(1);
		// console.log('Id is null.');
	}else{
		// console.log('Id is admin.');
		where = 'WHERE (a.id = "%s")';
		arrayValue.push(param.id);
	}

	var query = utils.format('PRAGMA empty_result_callbacks=1; SELECT a.id, a.password, a.perm, a.name, a.part, a.email, a.phone, a.lastdate, b.ip FROM master a inner join access_list b on a.id=b.id '+ where, arrayValue);
	console.log(query);
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

			id = data[0];
			perm = data[2];
			name = data[3];
			part = data[4];
			email = data[5];
			phone = data[6];
			lastdate = data[7];
			ip = data[8];

			var jsonResult = [{
				id : id,
				authority : perm,
				name : name,
				dept : part,
				email : email,
				phone : phone,
				reg_date : lastdate,
				access_address : ip
			}];

			console.log('\n\n********************************************************');
			console.log('  QUERY START | Get UserInfo');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);     
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | Get UserInfo');
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
		return cb(err);
	});
}

function setAccountInfo(req, cb)
{
	var param = req.body;
	if(!param) { return cb({ error: 'Not set parameter' }); }

	// var db = new sqlite3.Database(dbCbraCommon);
	//
	var filterAuth = "";
	var filterPassword = "";

	if( ( param.authority !== undefined ) && ( param.authority.length > 0 ) ){
		filterAuth += "perm = '" + param.authority + "',";
	}

	if( ( param.password !== undefined ) && ( param.password.length > 0 ) ){
		filterPassword += "password = '" + param.password + "',";
	}

	var query = utils.format("PRAGMA empty_result_callbacks=1; UPDATE master SET name='%s', part='%s', email='%s', phone='%s', password='%s' WHERE id = '%s'", param.name ,param.dept ,param.email, param.phone,param.password ,id);

	const options = {
		host: req.session.ip,
		port: req.session.port,
		path: "/main.a?act=config&order=ivs_sql_execute&db=./config/ivs_Login.dbb&sqlsize=" + query.length,
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
			console.log('\n\n********************************************************');
			console.log('  QUERY START | Get UserInfo');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);     
			console.log('result =>' + body);     
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | Get UserInfo');
            console.log('********************************************************\n'); 
			return cb(null);
		});
		_res.on('error', (err) => {
			callback(err);
		});
	});
	_req.write(query);
		_req.end();

	_req.on('error', (err) => {
		return cb(err);
	});
}

function checkAccountID(id, cb)
{
	// var db = new sqlite3.Database(dbCbraCommon);
	//
	// var param = {
	// 	$id: id
	// };
	//
	// var query = "\
	// 	SELECT\
	// 		id\
	// 	FROM\
	// 		user\
	// 	WHERE\
	// 		id = $id\
	// ";
	//
	// query = utils.minifize(query);
	//
	// db.prepare(query, param)
	// 	.all((err, rows)=>{
	// 		if(err) { return cb(err); }
	// 		return cb(null, rows);
	// 	})
	// 	.finalize();
	//
	// db.close();
	var id = req.body.id;
	var query = utils.format('PRAGMA empty_result_callbacks=1; SELECT id FROM master WHERE (id = "%s") ', id);

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

			id = data[0];

			var jsonResult = {
				id : id
			};

			return cb(null, jsonResult);
		});
		_res.on('error', (err) => {
			callback(err);
		});
	});
	_req.write(query);
		_req.end();

	_req.on('error', (err) => {
		return cb(err);
	});
}

function addAccountInfo(prmt, cb)
{
	// var db = new sqlite3.Database(dbCbraCommon);

	// var param = {
	// 	$id: prmt.id,
	// 	$authority: prmt.authority,
	// 	$name: prmt.name,
	// 	$password: prmt.password,
	// 	$access_address: prmt.access_address,
	// 	$email: prmt.email,
	// 	$dept: prmt.dept,
	// 	$phone: prmt.phone,
	// 	$reg_date: moment().format('YYYYMMDDHHmmss')
	// };

	// var query = "\
	// 	INSERT INTO\
	// 		user(\
	// 			id\
	// 			, authority\
	// 			, name\
	// 			, password\
	// 			, access_address\
	// 			, email\
	// 			, dept\
	// 			, phone\
	// 			, reg_date\
	// 		)\
	// 	VALUES(\
	// 		$id\
	// 		, $authority\
	// 		, $name\
	// 		, $password\
	// 		, $access_address\
	// 		, $email\
	// 		, $dept\
	// 		, $phone\
	// 		, $reg_date\
	// 	)\
	// ";

	// query = utils.minifize(query);

	// db.prepare(query, param)
	// 	.run((err)=>{
	// 		if(err) { return cb(err); }
	// 		return cb(null);
	// 	})
	// 	.finalize();

	// db.close();
}

function deleteAccount(prmt, cb)
{
	// var db = new sqlite3.Database(dbCbraCommon);

	// var ids = prmt.idlist.map((v)=>{ return ("'" + v + "'"); }).join(', ');

	// // var query = "\
	// // 	UPDATE\
	// // 		user\
	// // 	SET\
	// // 		del_yn = 1\
	// // 	WHERE\
	// // 		( id IN ( " + ids + " ) )\
	// // 		AND ( authority <> 0 )\
	// // ";

	// var query = "\
	// 	DELETE FROM\
	// 		user\
	// 	WHERE\
	// 		( id IN ( " + ids + " ) )\
	// 		AND ( authority <> 0 )\
	// ";

	// query = utils.minifize(query);

	// db.prepare(query)
	// 	.run((err)=>{
	// 		if(err) { return cb(err); }
	// 		return cb(null);
	// 	})
	// 	.finalize();

	// db.close();
}


module.exports = {
	getAccountInfo: getAccountInfo,
    setAccountInfo: setAccountInfo,
    checkAccountID: checkAccountID,
    addAccountInfo: addAccountInfo,
    deleteAccount: deleteAccount,
};
