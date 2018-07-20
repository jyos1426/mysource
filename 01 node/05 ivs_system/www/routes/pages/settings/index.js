var express         = require('express');
var router          = express.Router();

var account         = require('./account');
var audit           = require('./audit');
var pcap            = require('./pcap');
var sensor_setting  = require('./sensor_setting');

router.use('/', account);
router.use('/', audit);
router.use('/', pcap);
router.use('/', sensor_setting);

module.exports = router;
