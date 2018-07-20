var express         = require('express');
var router          = express.Router();

var path            = require('path');

var utils           = require('../../../models/util');
var log 			= require('../../../models/logs/load_log');

router.get('/load_log', utils.checkAfterLogin, (req, res) => {

    log.getLoadLog(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});

router.get('/load_log_detail', utils.checkAfterLogin, (req, res) => {
    
        log.getLoadLogDetail(req, (err, rows) => {
            if(err) {
                return res.json(err);
            }
            return res.json(rows);
        });
    });

module.exports = router;
