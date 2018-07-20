var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var async = require('async');
var e = require('./error');

//조회전용 함수
exports.select = (databaseName, sql, callback = (error, results) ) => {
	var res = new Object();	
	var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READONLY, (err) => {
		if (err) {
			res.error = err;
			res.rows = [];			
			callback(err, res);
		} else {
			db.all(sql, (err, rows) => {		
				if (err) {					
					res.error = err;
					res.rows = [];			
				} else {		
					res.error = null;				
					res.rows = rows;
				}	 			
				db.close();		
				callback(err, res);
			});	
		}
	});
};

//쓰기/읽기 모두 가능한 함수
exports.run = (databaseName, sql, callback = (error, results) ) => {
	var res = new Object();	
	var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			res.error = err;
			res.rows = [];			
			callback(err, res);
		} else {
			db.all(sql, (err, rows) => {		
				if (err) {					
					res.error = err;
					res.rows = [];			
				} else {		
					res.error = null;				
					res.rows = rows;
				}	 			
				db.close();		
				callback(err, res);
			});	
		}
	});
};

//databaseName을 Open하고,
//attachDB가 있으면 attach하고
//sqls는 BEGIN-COMMIT으로 실행된다.
//※주의: attach 여부에 따라 sql문이 달라지므로, 잘못된 sql이 실행되지 않도록 유의.
exports.serialize = (databaseName, sqls, attachDB = [], callback = (error, results) ) => {

	if (attachDB.length > 10) {
		var err = e.json('005', 'Exceed max attach count(10).');
		return callback(err, res);
	}

	var res = new Object();	
	var asyncTask = [];
	var db = new sqlite3.Database(databaseName, sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			res.error = err;
			res.rows = [];			
			callback(err, res);
		} else {
			
			//serializae() 안에서는 db.run() 만 sync하게 동작하고, 나머지 구문은 모두 비동기 처리된다.
			//작업로직의 경우에도 serialize()안에서 처리하면 비동기 함수를 만나는순간 순서대로 처리되지 않는다. 에러 핸들링과 트랜잭션을 처리하기 위해서 async를 사용하였다.

			db.serialize(() => {
				if (attachDB.length > 0)  {
					attachDB.forEach( (adb) => {
						const aliasName = path.basename(adb, '.dbb');
						db.run(`ATTACH DATABASE "${adb}" as ${aliasName};`);
					})
				}

				//Write작업시에는 BEGIN IMMEDIATE 사용필수(선도와 협의)
				db.run('BEGIN IMMEDIATE;');

				sqls.forEach((sql, i) => {
					//console.log(sql);
					asyncTask.push((callback) => {
						db.run(sql, [], (err) => {
							if (err) {
								console.log(err.stack);
								
								res.error = e.json('012', `[index:${i}] ${err.stack}`);
								res.rows = [];
								callback(res.error, [])
							}
							else callback();
						})
					});
				});

				async.series(
					//비동기 작업함수들 순차적으로 실행
					asyncTask,

					(err, results) => {
						if (err) {
							db.run('ROLLBACK;');
							callback(err, res);
						} else {
							db.run('COMMIT;');
							callback(null, res);
						}
						db.close();
					}
				)
			})
		}
	});
};

exports.getUserDbPath = () => {	
    return path.resolve(__dirname, '../dbb/user.dbb' );
}