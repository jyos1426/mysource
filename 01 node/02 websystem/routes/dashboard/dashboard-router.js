//상황판 라우터 메인
var express = require('express');
var router = express.Router();

router.use(require('./rankby/rankby-router'));
router.use(require('./resources/resources-router'));
module.exports = router;