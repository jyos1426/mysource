var express         = require('express');
var router          = express.Router();

var audit			= require('../../../models/settings/audit');
var utils     = require('../../../models/util');
var log 			= require('../../../models/log');

router.get('/', utils.checkAfterLogin, (req, res) => {
	audit.getAuditLog(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});

module.exports = router;
