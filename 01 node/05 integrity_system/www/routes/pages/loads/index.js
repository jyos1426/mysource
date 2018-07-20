var express         = require('express');
var router          = express.Router();

var load     = require('./load');

router.use('/', load);

module.exports = router;
