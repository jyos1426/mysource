var express         = require('express');
var router          = express.Router();

var detect_log             = require('./detect_log');
var load_log             = require('./load_log');
var auditlog        = require('./audit_log');

router.use('/', detect_log);
router.use('/', load_log);
router.use('/', auditlog);

module.exports = router;
