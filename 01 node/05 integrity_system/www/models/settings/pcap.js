var sqlite3     = require('sqlite3').verbose();
var path        = require('path');
var utils       = require('util');
var http        = require('http');
var asyn				= require('async');


// Pcap 리스트를 가져오는 함수
// dbb : /home1/ivs/config/ivs_Config.dbb

function GetPcapList(req, cb) {
	// post data
	var query = "PRAGMA empty_result_callbacks=1; SELECT rowid, code, category, filename, comment FROM pcap_list ORDER BY code asc";
	
	const options = {
		host: req.session.ip,
		port: req.session.port,
		path: "/main.a?act=config&order=ivs_get_list&db=./pcap/ivs_pcap_list.dbb&col_del=Delimeter&sqlsize=" + query.length,
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
	// console.log("post : " + query)

	var _req = http.request(options, (_res) => {
		var body = '';
		_res.on('data', (chunk) => {
			body += chunk;
		});

		_res.on('end', () => {
			var jsonResult = new Object(ConvertToJson(body, "|"));

			console.log('\n\n********************************************************');
			console.log('  QUERY START | GetPcapList');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);     
			// console.log('result =>' + body);     
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | GetPcapList');
			console.log('********************************************************\n'); 
			return cb(null, jsonResult);
		});


		_res.on('error', (err) => {
            // callback(err);
            return cb(err);
		});
	});

	_req.write(query);

	_req.end();

	_req.on('error', (err) => {
        console.log(err);
        return cb(err);
	});
}



// pcap 리스트를 삭제하는 함수
function DeletePcap(req, cb) {
	console.log('\n\n****************************************************');
	console.log('  QUERY START | Delete Pcap');

	var parm = req.query;

	var query = utils.format('PRAGMA empty_result_callbacks=1; DELETE FROM pcap_list WHERE code=%s', parm.code);

	const options = {
		host: req.session.ip,
		port: req.session.port,
		path: "/main.a?act=config&order=ivs_sql_execute&db=./pcap/ivs_pcap_list.dbb&col_del=TAB&sqlsize=" + query.length,
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
	// console.log('Post: ' + query);

	var _req = http.request(options, (_res) => {
		var body = '';
		_res.on('data', (chunk) => {
			body += chunk;
		});
		_res.on('end', () => {
			var jsonResult = new Object(ConvertToJson(body, "\t"));

			console.log('\n\n********************************************************');
			console.log('  QUERY START | Delete Pcap');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);     
			console.log('result =>' + body);     
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | Delete Pcap');
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

function DeleteAllPcap(req, cb){
		var query = utils.format('PRAGMA empty_result_callbacks=1; DELETE FROM pcap_list');

		const options = {
			host: req.session.ip,
			port: req.session.port,
			path: "/main.a?act=config&order=ivs_sql_execute&db=./pcap/ivs_pcap_list.dbb&col_del=TAB&sqlsize=" + query.length,
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
		// console.log('Post: ' + query);

		var _req = http.request(options, (_res) => {
			var body = '';
			_res.on('data', (chunk) => {
				body += chunk;
			});
			_res.on('end', () => {
				var jsonResult = new Object(ConvertToJson(body, "\t"));				
				console.log('\n\n********************************************************');
				console.log('  QUERY START | DeleteAll Pcap');
				console.log('--------------------------------------------------------');
				console.log(options);
				console.log('--------------------------------------------------------');
				console.log('path =>' + options.path);     
				console.log('result =>' + body);     
				console.log('--------------------------------------------------------');
				console.log('  QUERY END | DeleteAll Pcap');
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

// pcap 리스트를 등록하는 함수
function InsertPcap(param, comment, folder, root, cb){
		var pcapDb = new sqlite3.Database(root + '/pcap/ivs_pcap_list.dbb');
		str = param.split('\n');
		str2 = '';
		// regEx = '\/home1\/ivs\/pcap\/'+folder+'\/';
		regEx = root +'/pcap/'+folder+'/';
		for(var i=0; i<str.length; i++){
				str[i] = str[i].replace(regEx,'');
		}

		var tasks = [
				function(callback) {
            pcapDb.serialize(function() {
								pcapDb.run("BEGIN TRANSACTION");
                var query = pcapDb.prepare('INSERT OR REPLACE INTO pcap_list(category,filename,comment,code) VALUES(?,?,?,?)');
								for(var i=0; i<str.length-1; i++){
										var pattern = /[0-9]\_[0-9]\_*/;
										str2 = str[i].split('_');
										if(pattern.test(str[i])){
												filename = root + '/pcap/' + str[i];
												query.run(str2[1], filename, comment, str2[0]);
												// if(folder=='')	query.run(str2[1], filename, comment, str2[0]);
												// else query.run(str2[1], filename, comment, str2[0]);
										}else{
												filename = root + '/pcap/' + str[i];
												query.run(0, filename, comment, 0);
										}
								}
								pcapDb.run("COMMIT", function(err){
										if(err) return;
										callback(null);
								});
                query.finalize();
            });
            pcapDb.close();
        }
    ];

    asyn.series(tasks, function(error, result) {
        if (error) {
            res.status(500).send('Server Error');
            return;
        } else {						
				console.log('\n\n********************************************************');
				console.log('  QUERY START | InsertPcap');
				console.log('--------------------------------------------------------');
				console.log('result =>' + result);     
				console.log('--------------------------------------------------------');
				console.log('  QUERY END | InsertPcap');
				console.log('********************************************************\n'); 
        		return cb(null, {result:1});
        }
    });

}


function GetPcapPath(req, cb) {
	// post data
	var parm = req.query;
	var query = "PRAGMA empty_result_callbacks=1; SELECT a.filename as filename FROM pcap_list a, ( SELECT rowid, code FROM pcap_list ORDER BY code asc) b WHERE b.rowid = " + parm.rowid + " AND a.code = b.code";

	const options = {
		host: req.session.ip,
		port: req.session.port,
		path: "/main.a?act=config&order=ivs_get_list&db=./pcap/ivs_pcap_list.dbb&col_del=Delimeter&sqlsize=" + query.length,
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
	// console.log("post : " + query)

	var _req = http.request(options, (_res) => {
		var body = '';

		_res.on('data', (chunk) => {
			body += chunk;
		});

		_res.on('end', () => {
			var jsonResult = new Object(ConvertToJson(body, "|"));
			// console.log(jsonResult);		
			
			console.log('\n\n********************************************************');
			console.log('  QUERY START | GetPcapPath');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);     
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | GetPcapPath');
			console.log('********************************************************\n'); 
			return cb(null, jsonResult);
		});


		_res.on('error', (err) => {
			// callback(err);
			return cb(err);
		});
	});

	_req.write(query);

	_req.end();

	_req.on('error', (err) => {
		console.log(err);
		return cb(err);
	});
}
module.exports = {
		GetPcapList: GetPcapList,
		DeletePcap: DeletePcap,
		DeleteAllPcap: DeleteAllPcap,
		InsertPcap: InsertPcap,
		GetPcapPath: GetPcapPath
};
