const fs = require('fs');
const crypto = require('crypto');
const schedule = require('node-schedule');
const os = require('os')
const sensor = require('./sensor')
const log = require('./log');

exports.asyncForNewHash = (async (fileList, callback) => {
	var sqls = [];
	for (let i = 0; i <= fileList.length; i++) {
		if( i == fileList.length ) return callback(null, sqls);
		var path = fileList[i].SFILENAME;

		// 파일이 없거나 디레토리일 때 에러처리
		if (!fs.existsSync(path) || fs.lstatSync(path).isDirectory()) {
			return callback(e.json('1003'),null);
		}

		var newHash = await getFileHash(path);
		sqls.push(`UPDATE file_integrity SET snewhash = '${newHash}' WHERE ntype = '${fileList[i].NTYPE}'; `);
    }

    function getFileHash (filePath){
        return new Promise(function(resolve, reject) {
        fs.createReadStream(filePath)
        .pipe(crypto.createHash('sha256').setEncoding('hex'))
        .on('finish', function () {
            resolve(this.read());
        });
        });
    }
});

exports.asyncForOriginHash = ((fileList, callback) => {
	var sqls = [];
	for (let i = 0; i <= fileList.length; i++) {
		if( i == fileList.length ) return callback(sqls);

		sqls.push(`UPDATE file_integrity SET soriginhash = '${fileList[i].SNEWHASH}' WHERE ntype = '${fileList[i].NTYPE}'; `);
	}
});

var jobs;

exports.setTimer = (time) => {
	jobs = schedule.scheduleJob(`*/${time} * * * *`, function() {
  	sensor.afBackup();
	});
}

exports.cancelAndSetTimer = (time) => {
	if(jobs)
		jobs.cancel();
	this.setTimer(time)
}
exports.jsonPrint = (object) => {
	if(typeof(object) !== "object") {
		return object;
	}
	return JSON.stringify(object);
}
exports.getMd5Hash= (seed) => {
	return crypto.createHash('md5').update(seed).digest("hex");
}
