var express         = require('express');
var router          = express.Router();

var dashboards      = require('./dashboards/index');
var consistencys    = require('./consistencys/index');
var detects         = require('./detects/index');
var loads           = require('./loads/index');
var logs            = require('./logs/index');
var settings        = require('./settings/index');

router.use('/dashboards',       dashboards);
router.use('/consistencys',     consistencys);
router.use('/detects',          detects);
router.use('/loads',            loads);
router.use('/logs',             logs);
router.use('/settings',         settings);

module.exports = router;
