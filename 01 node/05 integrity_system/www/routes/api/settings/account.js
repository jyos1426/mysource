var express         = require('express');
var router          = express.Router();

var account			= require('../../../models/settings/account');
var utils       = require('../../../models/util');
var log 		  	= require('../../../models/log');

router.route('/').get(utils.checkAfterLogin, function(req, res){
		var param = req.query;
		account.getAccountInfo(req, function(err, rows){
			if(err) {
				return res.json(err);
			}
			return res.json(rows);
		});
	})
	.post(utils.checkAfterLogin, function(req, res){
		var param = req.body;
		account.setAccountInfo(req, function(err){
			if(err) {
				
				var params = {
					host: req.session.ip,
					port: req.session.port,
					userid: (req.user) ? req.user.id : 'UNKNOWN',
					request: utils.join(req.method, req.originalUrl),
					userip: utils.getUserIP(req),
					type: 'WEB',
					result : 0,
					job: '관리',
					job_detail: err.toString()
				};
				log.setSystemAuditLog(params, (err, rows) => {
						if(err){
								console.log('Error[AuditLog Inserting]');
						}
				});

				return res.json(err)
			}

			var params = {
					host: req.session.ip,
					port: req.session.port,
					userid: (req.user) ? req.user.id : 'UNKNOWN',
					request: utils.join(req.method, req.originalUrl),
					userip: utils.getUserIP(req),
					type: 'WEB',
					result : 1,
					job: '관리',
					job_detail: '[' + param.id + '] 계정정보를 변경하였습니다.'
			};
			log.setSystemAuditLog(params, (err, rows) => {
					if(err){
							console.log('Error[AuditLog Inserting]');
					}
			});

			return res.json(null);
		});
	})
	.put(utils.checkAfterLogin, function(req, res){
		var param = req.body;
		account.checkAccountID(req, function(err, rows){
			if(rows.length > 0){
				return res.json({ error: '입력하신 아이디는 이미 존재하는 아이디입니다.' });
			} else {
				account.addAccountInfo(param, function(err){
					if(err) {						
						var params = {
							host: req.session.ip,
							port: req.session.port,
							userid: (req.user) ? req.user.id : 'UNKNOWN',
							request: utils.join(req.method, req.originalUrl),
							userip: utils.getUserIP(req),
							type: 'WEB',
							result : 0,
							job: '관리',
							job_detail: err.toString()
						};
						log.setSystemAuditLog(params, (err, rows) => {
								if(err){
										console.log('Error[AuditLog Inserting]');
								}
						});
						return res.json(err)
					}
					
					var params = {
						host: req.session.ip,
						port: req.session.port,
						userid: (req.user) ? req.user.id : 'UNKNOWN',
						request: utils.join(req.method, req.originalUrl),
						userip: utils.getUserIP(req),
						type: 'WEB',
						result : 1,
						job: '관리',
						job_detail:'새로운 계정 [' + param.id + ']을 추가하였습니다.'
					};
					log.setSystemAuditLog(params, (err, rows) => {
							if(err){
									console.log('Error[AuditLog Inserting]');
							}
					});

					return res.json({ success: 1 });
				});
			}
		});
	})
	.delete(utils.checkAfterLogin, (req, res) => {
		var param = req.body;

		// console.log(param.idlist, req.user.id);
		// console.log(param.idlist.indexOf(req.user.id))
		if(param.idlist.indexOf(req.user.id) != -1){
			return res.json({error: '본인 계정은 삭제할 수 없습니다.'})
		} else {
			account.deleteAccount(param, (err)=>{
				if(err) {
					
					var params = {
						host: req.session.ip,
						port: req.session.port,
						userid: (req.user) ? req.user.id : 'UNKNOWN',
						request: utils.join(req.method, req.originalUrl),
						userip: utils.getUserIP(req),
						type: 'WEB',
						result : 0,
						job: '관리',
						job_detail: err.toString()
					};
					log.setSystemAuditLog(params, (err, rows) => {
							if(err){
									console.log('Error[AuditLog Inserting]');
							}
					});

					return res.json(err)
				}

				var params = {
					host: req.session.ip,
					port: req.session.port,
					userid: (req.user) ? req.user.id : 'UNKNOWN',
					request: utils.join(req.method, req.originalUrl),
					userip: utils.getUserIP(req),
					type: 'WEB',
					result : 1,
					job: '관리',
					job_detail: '[' + param.idlist.toString() + '] 계정을 삭제하였습니다.'
				};
				log.setSystemAuditLog(params, (err, rows) => {
						if(err){
								console.log('Error[AuditLog Inserting]');
						}
				});

				return res.json({ success: 1 });
			});
		}
	});

module.exports = router;
