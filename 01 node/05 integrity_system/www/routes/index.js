var express         = require('express');
var router          = express.Router();

var passport        = require('../models/passport');

router.use(passport.initialize());
router.use(passport.session());

var pages           = require('./pages/index');
var api             = require('./api/index');
var custom          = require('./error');

router.use('/',         pages);
router.use('/api',      api);
router.use('/',         custom);

module.exports = router;
