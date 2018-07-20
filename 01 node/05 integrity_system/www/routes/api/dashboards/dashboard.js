var express = require('express');
var router = express.Router();

var dashboard = require('../../../models/dashboards/dashboard');
var utils = require('../../../models/util');
var log = require('../../../models/log');
var dut = require('../../../models/dut');
var fs = require('fs');




router.get('/get_dut_list', utils.checkAfterLogin, function(req, res) {
	// var param = req.query;
	dashboard.getDUTList(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});

router.get('/ivs_testing_check', utils.checkAfterLogin, function(req, res) {
	// var param = req.query;
	dashboard.ivsTestingCheck(req, (err, result) => {
		if(err) {
			return res.json(err);
		}
		return res.json(result);
	});
});

router.get('/get_sensor_info', utils.checkAfterLogin, function(req, res) {
	var param = req.query;
	dashboard.getSensorInfo(param, function(err, rows) {
	  if (err) {
		return res.json(err);
	  }
	  return res.json(rows);
	});
});

router.get('/connect_with_sensor', utils.checkAfterLogin, function(req, res) {
	var param = req.query;
	dashboard.connectWithSensor(req, (err, rows) => {
		if(err) {
			if(req.session.isConnected != true){						
				var params = {
					host: req.session.ip,
					port: req.session.port,
					userid: (req.user) ? req.user.id : 'UNKNOWN',
					request: utils.join(req.method, req.originalUrl),
					userip: utils.getUserIP(req),
					type: 'WEB',
					result: 0,
					job: '검증 센서 연결',
					job_detail: '[' + param.ip + ':' + param.port + '] 에 연결 실패하였습니다'
				};
				log.setSystemAuditLog(params, (err, rows) => {
						if(err){
								console.log('Error[AuditLog Inserting]');
						}
				}); 
			}
			return res.json(err);
		}
		if(req.session.isConnected != true){
			var params = {
				host: req.session.ip,
				port: req.session.port,
				userid: (req.user) ? req.user.id : 'UNKNOWN',
				request: utils.join(req.method, req.originalUrl),
				userip: utils.getUserIP(req),
				type: 'WEB',
				result: 1,
				job: '검증 센서 연결',
				job_detail: '[' + param.ip + ':' + param.port + '] 에 연결 성공하였습니다'
			};
			log.setSystemAuditLog(params, (err, rows) => {
					if(err){
							console.log('Error[AuditLog Inserting]');
					}
			}); 
		}
		req.session.isConnected = true;
		return res.json(rows);
	});
});

router.get('/update_dut_status_false', utils.checkAfterLogin, function(req, res) {
	var param = req.query;

	//세션 수정
	req.session.isConnected = false;

	//DUT status를 false로 수정
	dut.updateDUTstatusFalse(req, (err, rows) => {
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
			result: 1,
			job: '검증 센서 연결해제',
			job_detail: '[' + param.ip + ':' + param.port + '] 센서와 연결 해제 하였습니다'
		};
		log.setSystemAuditLog(params, (err, rows) => {
				if(err){
						console.log('Error[AuditLog Inserting]');
				}
		}); 
		return res.json(rows);
	});
});

router.get('/update_dut_latest', utils.checkAfterLogin, function(req, res) {
	dut.updateDUTlatest(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});

router.get('/ivs_dut_unset', utils.checkAfterLogin, function(req, res) {
	dut.ivsDUTUnset(req, (err, result) => {
		if(err) {
			return res.json(err);
		}
		return res.json(result);
	});
});


router.get('/insert_dut', utils.checkAfterLogin, function(req, res) {
	dut.insertDut(req, (err, result) => {
		if(err) {
			return res.json(err);
		}
		return res.json(result);
	});
});

router.get('/delete_dut', utils.checkAfterLogin, function(req, res) {
	dut.deleteDut(req, (err, result) => {
		if(err) {
			return res.json(err);
		}
		return res.json(result);
	});
});


router.get('/ivs_manual', utils.checkAfterLogin, function(req, res) {
	var filePath = "files/wins_ivs_manual_v2.pdf";
	console.log(filePath);
	fs.readFile(filePath , function (err,data){
		res.contentType("application/pdf");
		res.send(data);
	});
});


router.get('/get_ivs_info', utils.checkAfterLogin, function(req, res) {
	var param = {
			ip: req.session.ip,
			port: req.session.port
	};

	dashboard.getIVSInfo(param, function(err, rows) {
	  if (err) {
		return res.json(err);
	  }
	  return res.json(rows);
	});
});

module.exports = router;
