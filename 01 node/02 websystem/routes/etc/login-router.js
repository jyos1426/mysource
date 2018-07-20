const express = require("express");
const router = express.Router();
var db = require('../../libs/db');
const crypto = require('crypto');

router.get('/auth/login1', ( req, res, next )  => {
  const params = req.query;
  req.session.userid = params[ "id" ];
  req.session.r1 = params[ "r1" ];

  if ( !req.session.userid ) {
      return res.json( { error: { msg: 'ID가 없습니다.' } } );
  }
  if ( !req.session.r1 ) {
      return res.json( { error: { msg: 'r1이 없습니다.' } } );
  }
  var query = `select * from user where id = '${req.session.userid}' and deleted = 0`;
  db.select(db.getUserDbPath(), query, (error, results) => {
    if (error) {
      return res.json( { error: { msg: '디비에 접속하지 못했습니다.' } } );
    } else {
      if (results["rows"].length === 0) {
        return res.json( { error: { msg: '존재하지 않는 사용자 입니다.' } } );
      } else {
        req.session.login1 = true;
        req.session.r2 = crypto.createHash( 'sha256' ).update( crypto.randomBytes(32) ).digest('hex');
        return res.json( { success : { msg: '로그인1이 성공하였습니다.', r2 : req.session.r2 } } );
      }
    }
  });
});

router.get( '/auth/login2', ( req, res, next ) => {
  const parmas = req.query;
  req.session.userid = parmas[ 'id' ];
  req.session.res2 = parmas[ 'res2' ];
  req.session.login2 = false;
  if ( !req.session.userid ) {
    return res.json( { error: { msg: 'ID가 없습니다.' } } );
  }
  
  if ( !req.session.res2 ) {
    return res.json( { error: { msg: 'r1이 없습니다.' } } );
  }

  if ( req.session.login1 == false ) {
    return res.json( { error: { msg: '비정상적인 로그인 입니다.' } } );
  }

  var query = `select * from user where id = '${req.session.userid}' and deleted = 0`;
  db.select(db.getUserDbPath(), query, (error, results) => {
    if (error) {
      req.session.destroy();
      return res.json( { error: { msg: '디비에 접속하지 못했습니다.' } } );
    } else {
      if ( results["rows"].length === 0 ) {
        req.session.destroy();
        return res.json( { error: { msg: '존재하지 않는 사용자 입니다.' } } );
      } else {
        var rows = results[ 'rows' ]
        req.session.password = crypto.createHash( 'sha256' ).update( req.session.userid + rows[0][ 'password' ]  ).digest( 'hex' );
        req.session.res1 = crypto.createHash( 'sha256' ).update( req.session.r1 + req.session.r2 + req.session.password ).digest( 'hex' );                
        if ( req.session.res1 == req.session.res2 ) {
          req.session.login2 = true;
          return res.json( { success : { msg: '로그인2이 성공하였습니다.' } } );
        } else {
          req.session.login2 = false;
          req.session.destroy();
          return res.json( { error : { msg: '패스워드가 실패하였습니다.' } } );
        }
      }
    }
  });    
});

router.get( '/auth/verify', ( req, res, next ) => {    
  if ( !req.session.login2 ) {
    return res.json( { token: false } );
  }   
  if ( req.session.login2 == true ) {
    return res.json( { token: true } );
  } else {
    return res.json( { token: false } );
  }
});

router.get( '/auth/logout', ( req, res, next ) => {
  if ( req.session.login2 == true ) {
    req.session.login2 = false;
    req.session.destroy();
    return res.json( { success: { msg: '정상적으로 처리 되었습니다.' } } );
  } else {
    return res.json( { error: { msg: '로그인 되지 않는 사용자 입니다.' } } );
  } 
});

module.exports = router;