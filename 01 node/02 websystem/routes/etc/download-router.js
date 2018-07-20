//다운로드 라우터 메인
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var e = require('../../libs/error');

router.get('/api/files/backup', (req, res, next) => {
  var params = req.query;
  const downloadPath = path.resolve(__dirname, '../../backup/' + params.filename);
  
  if (fs.existsSync(downloadPath)) 
  	res.download(downloadPath);
  else 
  	res.status(e.status('013')).json(e.json('013'));
});

module.exports = router;