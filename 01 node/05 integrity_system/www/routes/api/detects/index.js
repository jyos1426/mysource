var express         = require('express');
var router          = express.Router();

var detect		= require('./detect');

router.use('/detect',      detect);

module.exports = router;
