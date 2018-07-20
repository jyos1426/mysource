var path = process.cwd();
var commonModule = require(path + '/routes/module/commonModule.js');
var crypto = require('crypto');


module.exports  = function(app, conn_obj){
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        // console.log('serialize ' + user.id);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        // console.log('deserializeUser  ' +id);
        var userId = id;
        var user;
        var sql = 'select * from admin where id=?';
        var data = [id];

        conn_obj.conn.getConnection(function(err, connection){
            if(err){
                console.log(err);
                res.status(500).send('user login Server Error : 3');                    
            }
            connection.query(sql, data, function(err, rows, fields){
                if(err){
                    console.log(err);
                    connection.release();
                    res.status(500).send('user login Server Error : 3');                    
                }else{
                    connection.release();
                    user = rows[0];
                    done(null, user);
                }
            });
        });
    });

    passport.use(new LocalStrategy(
      function(username, password, done) {
        var id = username;
        var pwd = password;

        console.log('new LocalStrategy  id : '+username+'  pw : '+password);

        var sql = 'select * from admin where id=? and passwd=old_password(?)';
        var data =[id, pwd];
        var user;

        conn_obj.conn.getConnection(function(err, connection){
            connection.query(sql, data, function(err, rows, fields){//old_passwd 유저 검색
                if(err){
                    console.log(err);
                    connection.release();
                    return done(null, false, { message: '로그인 실패' });
                }else{
                    user = rows[0];
                }

                if(!user){
                    //old_passwd 일치 안할경우 passwd()로 유저 검색
                    // console.log("!user!user!user!user!user!user!user");
                    sql = 'select * from admin where id=? and passwd=?';
                    var shasum = crypto.createHash('sha256');
                    shasum.update(pwd);
                    pwd = shasum.digest('hex');
                    data = [id, pwd];
                    connection.query(sql, data, function(err, rows, fields){
                        if(err){
                            console.log(err);
                            connection.release();
                            return done(null, false, { message: '로그인 실패' });
                        }else{
                            user = rows[0];
                        }
                        if(user){
                            connection.release();
                            return done(null, user);
                        }else{
                            var ip_address = 'x';
                            var dt = new Date(); 
                            var nowdate = commonModule.getFormatDate(dt).type2;

                            sql = 'insert into login_fail(date, ip, ser) values(?,?,?)';
                            var failData = [nowdate, ip_address, id];
                            conn_obj.conn.query(sql, failData, function(err, rows, fields){
                                if(err){
                                    console.log(err);
                                }else{
                                }

                            });
                            connection.release();
                            return done(null, false, { message: '로그인 실패' });
                        }               
                    });
     

                }else{
                    if(user){
                            connection.release();
                            return done(null, user);
                        }else{
                            connection.release();
                            return done(null, false, { message: '로그인 실패' });
                        }   
                }
            });
        });

      }
    ));

    return passport;
}