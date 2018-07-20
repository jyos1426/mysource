var express         = require('express');
var router          = express.Router();

var consistency     = require('./consistency');

router.use('/consistency', consistency);

module.exports = router;
