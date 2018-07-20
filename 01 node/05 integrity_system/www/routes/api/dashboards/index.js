var express         = require('express');
var router          = express.Router();

var dashboard          = require('./dashboard');

router.use('/dashboard', dashboard);

module.exports = router;
