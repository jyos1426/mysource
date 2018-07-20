var express         = require('express');
var router          = express.Router();

var account         = require('./account');
var audit           = require('./audit');
var pcap            = require('./pcap');

router.use('/account',  account);
router.use('/audit',    audit);
router.use('/pcap',     pcap);

module.exports = router;
