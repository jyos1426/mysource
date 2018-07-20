var express = require('express');
var router = express.Router();
var e = require('../../../libs/error');
var legacy = require('../../../libs/legacy');

router.get('/api/dashboard/resources', (req,res,next)=> {
  var api = req['api'];
  var params = req.query;
  legacy.request(api, params, (err, result) => {
    if (err) {
      res.status(e.status('002')).json(e.json('002')); 
    }	else {
      var hardware = Object();
      row = result[0];
      hardware.hardware =row.datas[0];
      res.json({datas : hardware});
    }
  });
});

module.exports = router;


