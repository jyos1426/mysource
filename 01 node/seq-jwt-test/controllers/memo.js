var express = require('express');
var router = express.Router();

// var user = require('sequelize').sequelize.user;
var memo = require('../models').Memo;

router.get('/', function (req, res, next) {
  memo.findAll().then((data) => {
    res.status(200).json(data);        
    return;
  })
});

router.post('/', function (req, res, next) {
  console.log(req.user);
  memo.create({
    email : req.user,
    body : req.body.content
  }).then((data) => {
    res.status(200).json({result: 'success'});        
    return;
  })
});



module.exports = router;