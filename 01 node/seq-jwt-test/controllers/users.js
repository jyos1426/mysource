var express = require('express');
var router = express.Router();

// var user = require('sequelize').sequelize.user;
var user = require('../models').User;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

router.post('/signup', function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  try{
    user.findOne({
        where: { email : email}
      }).then((memo) => {
        res.status(400).json({result: 'exist email'});
        return;
      })
    
    user.create({
      email : email,
      password : crypto.createHash('sha1').update(password).digest('base64')
    }).then((data) => {
      res.status(200).json({result: 'success'});        
      return;
    })

  }catch(err){
    return res.status(500).json({result: 'server error', message:err});
  }

});

router.post('/signin', function (req, res, next) {
  let email = req.body.email;
  let cryptoPassword =  crypto.createHash('sha1').update(req.body.password).digest('base64');

  try{
    user.findOne({
        where: { email : email}
      }).then((user) => {
        if ( user.password == cryptoPassword ){
          var token = jwt.sign({ email: user.email }, 'secret');
          res.setHeader('Auth',token);
          res.status(200).json({result: 'success'});   
          return;  
        } else {
          res.status(400).json({result: 'Wrong Password'});
          return;
        }
      })    

  }catch(err){
    return res.json({result: 'server error'});
  }
});

module.exports = router;