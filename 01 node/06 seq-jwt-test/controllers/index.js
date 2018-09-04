var express = require('express');
var router = express.Router();


router.use('/users', require('./users'));

var authentication = require('../libs/authentication');
router.all('*',authentication, function(req,res,next){
    next();
});

router.use('/memo', require('./memo'));
module.exports = router;
