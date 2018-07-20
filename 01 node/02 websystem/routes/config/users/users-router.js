var express = require('express');
var router = express.Router();
var e = require('../../../libs/error');
var db = require('../../../libs/db');
const crypto = require('crypto');
const moment = require('moment');

router.get('/api/config/users', ( req, res, next ) => {
  var param = req.query;
  var query = `
  SELECT
    id,
    email,
    access_address,
    password_limit,
    authority,
    extension,
    phone
  FROM
    user
  WHERE
    deleted = 0;
  `;
  if ( param[ 'id' ] != undefined ) {
    var id = param[ 'id' ];
    var query = `
    SELECT
      id,
      email,
      access_address,
      password_limit,
      authority,
      extension,
      phone
    FROM
      user
    WHERE
        id = '${id}'
      AND
        deleted = 0;
    `;
  }
  db.select( db.getUserDbPath(), query, (error, results) => {
    if (error) {
      res.status(e.status('005')).json(e.json('005', error.stack));
    } else {
      for(var i =0; i < results.rows.length; i ++){
        if (results.rows[i].access_address === '') {
          continue;
        }
        results.rows[i].access_address =JSON.parse(results.rows[i].access_address);
      }
      res.json({ datas : results.rows })
    }
  });
});

router.get('/api/config/users/access_address', ( req, res, next ) => {
  var param = req.query;
  var query = `
  SELECT
    access_address
  FROM
    user
  WHERE
    deleted = 0;
  `;
  if ( param[ 'id' ] != undefined ) {
    var id = param[ 'id' ];
    var query = `
    SELECT
      access_address
    FROM
      user
    WHERE
        id = '${id}'
      AND
        deleted = 0;
    `;
  }
  db.select( db.getUserDbPath(), query, (error, results) => {
    if (error) {
      res.status(e.status('005')).json(e.json('005', error.stack));
    } else {
      for(var i =0; i < results.rows.length; i ++){
        if (results.rows[i].access_address === '') {
          continue;
        }
        results.rows[i].access_address =JSON.parse(results.rows[i].access_address);
      }
      res.json({ datas : results.rows });
    }
  });
});

router.get('/api/config/users/check', (req, res, next ) => {
  const params = req.query;
  password = crypto.createHash( 'sha256' ).update( params[ "id" ] + params[ "password" ] ).digest( 'hex' );
  params_password = crypto.createHash( 'sha256' ).update( params[ "id" ] + password ).digest( 'hex' );
  var query = `
  SELECT
    *
  FROM
    user
  WHERE
      id = '${params[ "id" ]}'
    AND
      deleted = 0;
  `;
  db.select(db.getUserDbPath(), query, (error, results) => {
    if (error) {
      return res.status(e.status('005')).json(e.json('005', error.stack));
    } else {
      var rows = results[ 'rows' ];
      check_password = crypto.createHash( 'sha256' ).update( params[ "id" ] + rows[0][ 'password' ]  ).digest( 'hex' );
      if ( check_password != params_password ){
        return res.status(e.status('011')).json(e.json('011'));
      } else {
        return res.status(e.status('000')).json(e.json('000'));
      }
    }
  });
});

router.post('/api/config/users', (req, res, next) => {
  const body = req.body;
  var password_update_time = moment().unix();

  if (body.email == undefined) {
    body.email = '';
  }
  if (body.authority == undefined) {
    body.email = 2;
  }
  if (body.password_limit == undefined) {
    body.password_limit = 1;
  }
  if (body.extension == undefined) {
    body.extension = '';
  }
  if (body.phone == undefined) {
    body.phone = '';
  }

  var query = `
  INSERT INTO 
    user
  VALUES 
  (
    '${body.id}',
    '${body.password}',
    '${body.email}',
    '${body.authority}',
    '[]',
    '0',
    '${password_update_time}',
    '${body.password_limit}',
    '0',
    '0',
    '${body.extension}',
    '${body.phone}'
  );
  `;

    db.run(db.getUserDbPath(), query, (error, results) => {
      if (error) {
        return res.status(e.status('005')).json(e.json('005', error.stack));
      } else {
        return res.status(e.status('000')).json(e.json('000'));
      }
    });
});

router.post('/api/config/users/access_address', (req, res, next) => {
  const body = req.body;
  var query = `
  SELECT
    access_address
  FROM
    user
  WHERE
    id = '${body.id}';
  `;
  db.select(db.getUserDbPath(), query, (error, results) => {
    if (error) {
      return res.status(e.status('005')).json(e.json('005', error.stack));
    } else {
      var rows = results[ 'rows' ];
      
      var row = rows[0];
      var access_address = '';

      if ( row.access_address == '' ) {
        access_address = body.access_address;
      }
      else {
        access_address = JSON.parse(row.access_address);
        for(var i=0; i < body.access_address.length; i++) {
          access_address.push(body.access_address[i]);
        }
      }
      access_address = access_address.reduce(function(a,b){
        if (a.indexOf(b) <0 ) a.push(b);
        return a;
      },[]);
      
      var query = `
      UPDATE
        user
      SET
        access_address = '${JSON.stringify(access_address)}'
      WHERE
          id = '${body.id}'
        AND 
          deleted = 0;
      `;
      db.run(db.getUserDbPath(), query, (error, results) => {
        if (error) {
          return res.status(e.status('005')).json(e.json('005', error.stack));
        } else {
          return res.status(e.status('000')).json(e.json('000'));
        }
      });
    }
  });
});

router.patch ('/api/config/users', (req, res, next ) => {
  const body =  req.body;
  var password_update_time = moment().unix();

  if ( body.password != undefined ) {
    body.password = `password = '${body.password}',`
  } else {
    body.password = '';
  }
  if (body.email == undefined) {
    body.email = '';
  }
  if (body.password_limit == undefined) {
    body.password_limit = 1;
  }
  if (body.extension == undefined) {
    body.extension = '';
  }
  if (body.phone == undefined) {
    body.phone = '';
  } 
  var query =`
  UPDATE user
  SET
    ${body.password}
    password_update_time = '${password_update_time}',
    password_limit = '${body.password_limit}',
    email = '${body.email}',
    extension = '${body.extension}',
    phone = '${body.phone}'
  WHERE
      id = '${body.id}'
    AND 
      deleted = 0;
  `;  
  db.run(db.getUserDbPath(), query, (error, results) => {
    if (error) {
      return res.status(e.status('005')).json(e.json('005', error.stack));
    } else {
      return res.status(e.status('000')).json(e.json('000'));
    }
  });
});

router.delete('/api/config/users', (req, res, next ) => {
  const body = req.body;
  var query = `
  UPDATE
    user
  SET
    deleted = 1
  WHERE
    id = '${body.id}'
  `;
  db.run(db.getUserDbPath(), query, (error, results) => {
    if (error) {
      return res.status(e.status('005')).json(e.json('005', error.stack));
    } else {
      return res.status(e.status('000')).json(e.json('000'));
    }
  });
});

router.delete('/api/config/users/access_address', (req, res, next) => {
  const body = req.body;
  var query = `
  SELECT
    access_address
  FROM
    user
  WHERE
      id = '${body.id}'
    AND 
      deleted = 0;
  `;

  db.select(db.getUserDbPath(), query, (error, results) => {
    var rows = results[ 'rows' ];
    var row = rows[0];
    access_address = JSON.parse(row.access_address);
    for(var i=0;i< body.access_address.length; i++) {
      var index = access_address.indexOf(body.access_address[i]);
      if (index !== -1) {
        access_address.splice(index, 1);
      } else {
        return res.status(e.status('003')).json(e.json('003'));
      }
    }
    var query = `
    UPDATE
      user
    SET
      access_address = '${JSON.stringify(access_address)}'
    WHERE
      id = '${body.id}';
    `;
    db.run(db.getUserDbPath(), query, (error, results) => {
      if (error) {
        return res.status(e.status('005')).json(e.json('005', error.stack));
      } else {
        return res.status(e.status('000')).json(e.json('000'));
      }
    });  
  });
});

module.exports = router;
