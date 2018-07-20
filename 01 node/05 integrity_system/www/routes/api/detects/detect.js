var express         = require('express');
var router          = express.Router();

var path            = require('path');
// var config			= require('../../../config/app-config.json');
var utils			= require('../../../models/util');
var log				= require('../../../models/log');
var detect       	= require('../../../models/detects/detect');
var fs 				= require('fs');

var multer			= require('multer');	//file read
var upload			= multer({
	dest : 'tmp_rules'
});
var exec			= require("child_process").exec;


// 테스트 수행순서
// 1. ivs_setting             - [Req.4.1] 탐지테스트 설정 : 서버에 입력된 테스트 설정 전송 / path 리턴
// 2. set_tmp_rules
// 3. ivs_ruleset_upload      - [Req.4.2] 탐지테스트 정책 추가 : 선택한 임시 정책 업로드
// 4. get_rule_list           - db path를 포함한 쿼리 재전송 후 list 뷰로 리턴 => 모달 두번째 화면 그리드
// 5. ivs_update_rulelist     - [Req.4.3] 탐지테스트 선택 정책 적용 : rule들을 sam파일로 정리해서 POST
// 6. ivs_run

// 6. ivs_run_check           - [Req.4.5] 탐지테스트 실행 상태 확인
// 7. get_test_list           - Test 결과 SELECT : Test중 1.5초단위로 혹은 완료 시 사용     

// ivs_clear
// ivs_test_save 


router.get('/ivs_setting', utils.checkAfterLogin, (req, res) => {
	detect.ivsSetting(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}		
		var params = {
			host: req.session.ip,
			port: req.session.port,
			userid: (req.user) ? req.user.id : 'UNKNOWN',
			request: utils.join(req.method, req.originalUrl),
			userip: utils.getUserIP(req),
			type: 'WEB',
			result: 3,
			job: '테스트 SETTING',
			job_detail: '[검증 테스트] 탐지 검증 테스트가 SETTING 되었습니다.'
		};
		log.setSystemAuditLog(params, (err, rows) => {
				if(err){
						console.log('Error[AuditLog Inserting]');
				}
		}); 
		return res.json(rows);
	});
});


router.post('/set_tmp_ruleset', utils.checkAfterLogin, (req, res) => {	
    var upload = multer({
        storage: multer.diskStorage({
			destination: (req, file, cb) => {
				cb(null, 'tmp_rules');
			},
			filename: (req, file, cb) => {
				cb(null, file.originalname);
			}
		})
    }).single('file');
    
	//추후 수정
    upload(req, res, function(err) {
        if (err) {
            console.log("에러가 났음");            
			return res.json(err);
        } else {
			if( req.file.path != undefined){	
				fs.readFile(req.file.path, 'utf8',  function (err, data) {
					if (err) {
						console.log(err);
					}
					var jsonResult = [];
					var strArray = data.split('\n');
					for( var i=0; i < strArray.length ; i++){
						jsonResult[i] = { "ncscrule" : strArray[i] };
					}				
					exec("rm -rf tmp_rules", function (err, stdout, stderr) {
						if (err !== null) {
							console.log(err);
						} else {
							console.log(jsonResult);
							return res.json(jsonResult);
						}
					});			
				});
			}else{       
				return res.json(err);
			}
        }
    });	
});


router.post('/ivs_ruleset_upload', utils.checkAfterLogin, (req, res) => {
	detect.ivsRuleSetUpload(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});


router.get('/get_rule_list', utils.checkAfterLogin, (req, res) => {
	detect.getRuleList(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});


router.post('/ivs_update_rulelist', utils.checkAfterLogin, (req, res) => {
	detect.ivsUpdateRuleList(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});



router.get('/ivs_run', utils.checkAfterLogin, (req, res) => {
	detect.ivsRun(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		
		var params = {
			host: req.session.ip,
			port: req.session.port,
			userid: (req.user) ? req.user.id : 'UNKNOWN',
			request: utils.join(req.method, req.originalUrl),
			userip: utils.getUserIP(req),
			type: 'WEB',
			result: 3,
			job: '테스트 RUN',
			job_detail: '[검증 테스트] 탐지 검증 테스트가 RUN 되었습니다.'
		};
		log.setSystemAuditLog(params, (err, rows) => {
				if(err){
						console.log('Error[AuditLog Inserting]');
				}
		}); 

		return res.json(rows);
	});
});


router.get('/ivs_run_check', utils.checkAfterLogin, (req, res) => {
	detect.ivsRunCheck(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});


router.get('/get_test_list', utils.checkAfterLogin, (req, res) => {
	detect.getTestList(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});

router.get('/ivs_clear', utils.checkAfterLogin, (req, res) => {
	detect.ivsClear(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		var params = {
			host: req.session.ip,
			port: req.session.port,
			userid: (req.user) ? req.user.id : 'UNKNOWN',
			request: utils.join(req.method, req.originalUrl),
			userip: utils.getUserIP(req),
			type: 'WEB',
			result: 3,
			job: '테스트 초기화',
			job_detail: '[검증 테스트] 테스트를 초기화 하였습니다.'
		};
		log.setSystemAuditLog(params, (err, rows) => {
				if(err){
						console.log('Error[AuditLog Inserting]');
				}
		}); 
		return res.json(rows);
	});
});


router.post('/ivs_test_save', utils.checkAfterLogin, (req, res) => {
	detect.ivsTestSave(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		var params = {
			host: req.session.ip,
			port: req.session.port,
			userid: (req.user) ? req.user.id : 'UNKNOWN',
			request: utils.join(req.method, req.originalUrl),
			userip: utils.getUserIP(req),
			type: 'WEB',
			result: 3,
			job: '테스트 저장',
			job_detail: '[검증 테스트] 테스트가 저장 되었습니다.'
		};
		log.setSystemAuditLog(params, (err, rows) => {
				if(err){
						console.log('Error[AuditLog Inserting]');
				}
		}); 
		return res.json(rows);
	});
});


router.get('/ivs_test_reload', utils.checkAfterLogin, (req, res) => {
	detect.ivsTestReload(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		
		var params = {
			host: req.session.ip,
			port: req.session.port,
			userid: (req.user) ? req.user.id : 'UNKNOWN',
			request: utils.join(req.method, req.originalUrl),
			userip: utils.getUserIP(req),
			type: 'WEB',
			result: 3,
			job: '테스트 재수행',
			job_detail: '[검증 테스트] 테스트가 재수행 되었습니다.'
		};
		log.setSystemAuditLog(params, (err, rows) => {
				if(err){
						console.log('Error[AuditLog Inserting]');
				}
		}); 
		return res.json(rows);
	});
});


router.get('/ivs_get_detect_list', utils.checkAfterLogin, (req, res) => {
	detect.ivsGetDetectList(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});


router.get('/get_detect_count', utils.checkAfterLogin, (req, res) => {
	detect.getDetectCount(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});

module.exports = router;
