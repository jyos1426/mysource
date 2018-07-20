var express         = require('express');
var router          = express.Router();

var path            = require('path');

var utils           = require('../../../models/util');
var log 			= require('../../../models/logs/detect_log');

router.get('/detect_log', utils.checkAfterLogin, (req, res) => {

    log.getDetectLog(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});

router.get('/detect_log_detail', utils.checkAfterLogin, (req, res) => {
    
        log.getDetectLogDetail(req, (err, rows) => {
            if(err) {
                return res.json(err);
            }
            return res.json(rows);
        });
    });

module.exports = router;
