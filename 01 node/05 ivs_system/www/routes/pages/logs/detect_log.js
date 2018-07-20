var express         = require('express');
var router          = express.Router();

var utils           = require('../../../models/util');
var log 			= require('../../../models/log');

router.get('/detect_log', utils.checkAfterLogin, function(req, res){
	var params = {
		host: req.session.ip,
		port: req.session.port,
		userid: (req.user) ? req.user.id : 'UNKNOWN',
		request: utils.join(req.method, req.originalUrl),
		userip: utils.getUserIP(req),
		type: 'WEB',
		result: 1,
		job: '페이지 접근',
		job_detail: '[탐지테스트 로그] 페이지에 접근하였습니다.'
	};
	log.setSystemAuditLog(params, (err, rows) => {
			if(err){
					console.log('Error[AuditLog Inserting]');
			}
	});

	return res.render('logs/detect_log', {
			layout:false,
			session: req.session
	});
});
module.exports = router;
