var express         = require('express');
var router          = express.Router();

var path            = require('path');
var utils           = require('../../../models/util');
var auditlog 			  = require('../../../models/logs/audit_log');

router.get('/', utils.checkAfterLogin, (req, res) => {
    auditlog.getAuditLog(req, (err, rows) => {
        if(err){
            return res.json(err);
        }else{
            return res.json(rows);
        }
    });
});

module.exports = router;
