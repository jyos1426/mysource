var fs = require('fs');
var schedule = require('node-schedule');
var moment = require('moment');
const express = require('express');
const log = require('../libs/log');
const router = express.Router();
var Path = require('path');
var root_path = require('../config').getConfigValue('root_path');
var exec = require('child_process').exec, child;

// 초기 config.json 설정 read
var configJson = JSON.parse(fs.readFileSync(Path.join(root_path, 'config.json')));

// 로그 삭제 스케쥴 초기화
var removeLogSchedule = schedule.scheduleJob(configJson.removeLogSheduleCron, function() {
    removeLogFile();
});

// 기본 스케쥴
var defaultSchedule = schedule.scheduleJob(configJson.updateSheduleJobCron, function(){

    // config.json 업데이트 스케쥴
    updateConfigJson()
    .then((config) => {

        // 로그 삭제 스케쥴 업데이트
        removeLogSchedule = schedule.scheduleJob(config.removeLogShedule, function() {
            removeLogFile();
        });

    }, (err) => {

        log.write('ERROR', 'Update Schedule Fail, err : ' + err);

    })

});

// configJson 설정 업데이트
function updateConfigJson() {
    return new Promise(function(resolve, reject) {
        // config.json 업데이트 스케쥴
        fs.readFile(Path.join(root_path, 'config.json'), 'utf8', function(err, data) {
            if (err) {
                reject(err);
            } else {
                log.write('INFO', 'Update Schedule ConfigJson : ' + data);
                configJson = JSON.parse(data);
                resolve(configJson);
            }
        });
    });
}

function removeLogFile() {
    
    log.write('INFO', 'Start Log Delete ScheDule');

    exec("ls -R " + root_path + '/log', function (error, stdout, stderr) {
        
        if (error != null) {
            log.write('ERROR', '[removeLogFile] removeLogFile Fail - exec Fail Err : ' + error);
        } else {
            var logFileList = stdout.split('\n').filter(function (path) {
                if (path.indexOf('log.') > -1) {
                    return path
                }
            })
            
            if (logFileList.length > 0) {
                for (var i = 0; i < logFileList.length; i++) {
                    var logDate = moment(logFileList[i].split('.')[1], 'YYYYMMDD');
                    
                    // 정확한 파일 포맷의 로그파일인경우 삭제 
                    if (logDate.isValid()) {
                        var diff = moment().diff(logDate, 'days');

                        if (diff > configJson.removeLogConditionDt) {   // 일수차이가 삭제일 기준 이상이면 삭제

                            // 로그 파일 삭제
                            try {
                                fs.unlinkSync(Path.join(root_path, 'log', logDate.format('YYYY'), logDate.format('MM'), logFileList[i]));
                            } catch (err) {
                                log.write('ERROR', 'Delete Log File Fail, File : ' + logFileList[i] + ', diff day : ' + diff + ', Delete Path : ' + Path.join(root_path, 'log', logDate.format('YYYY'), logDate.format('MM'), logFileList[i]));
                            }

                        }
                    }

                }
            }

            log.write('INFO', 'End Log Delete ScheDule');
        }
        
    });
}

module.exports = router;