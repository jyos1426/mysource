
module.exports = function(conn_obj, ROOT_PATH){

    var express = require('express');
    var router = express.Router();
    var fs = require('fs');
    var addSerialModule = require(ROOT_PATH + '/routes/module/addSerialModule');
    var commonModule = require(ROOT_PATH + '/routes/module/commonModule.js');
    var SYNC_SERVER = require(ROOT_PATH + '/routes/model/syncServer.js');
    var nationPermissionModule = require(ROOT_PATH + '/routes/module/permissionModule.js');
    var async = require('async');

    router.get('/:ser', function(req, res, next) {
        if(!req.user){
            req.logout();
            req.session.save(function(){
                res.redirect('/login');
            });
            return;
        }

        var serial = req.params.ser;
        var sql = ` SELECT 
                        lic
                        , ser
                        , co
                        , admin
                        , tel
                        , mail
                        , limit_date
                        , charge
                        , business
                        , note2
                    FROM 
                        master
                    WHERE
                        ser = ? `;
        conn_obj.conn.getConnection(function(err, connection){
            if(err){
                console.log(err);
                res.status(500).send('modify sql Server Error : 1');
                return;
            }
            connection.query(sql, serial, function(err, rows, fields){
                if(err){
                  console.log(err);
                  connection.release();
                  res.status(500).send('modify sql Server Error : 1');
                  return;
                } 
                connection.release();
                res.render('modSerial', {serialInfo:rows, permission:req.user.permission, username:req.user.id});
                return;
            });
        });
    });


    router.put('/', function(req, res, next) {
        if(!req.user){
            req.logout();
            req.session.save(function(){
              res.render('login');
            });
            return;
        }

        var serial = req.body.ser;
        
        // 국가 권한 확인
        // 시리얼과 유저값을 주면 true / false로 리턴
        var nationPermission = nationPermissionModule.checkPermission(serial, req.user);
        // console.log(nationPermission);
        if( !nationPermission ){
            res.status(500).send('해당 시리얼(' + serial +') 수정 권한이 없습니다.');
            return;
        }

        var co = req.body.co;
        var admin = req.body.admin;
        var tel = req.body.tel;
        var mail = req.body.mail;
        var charge = req.body.charge;
        var business = req.body.business;
        var limit_date = req.body.limit_date;
        var note2 = req.body.note2;
        var license = req.body.lic;
        var timeInfo = commonModule.getFormatDate();
        var syncServer = new SYNC_SERVER.syncServer(conn_obj);

        var sql= '';
        var data;

        var tasks = [
            function(callback){
                sql = ` UPDATE master 
                        SET limit_date=?
                        WHERE ser=? `;
                data = [limit_date, serial];

                syncServer.syncSniper2Data(sql, data, function(sqlResult) {
                    if(sqlResult.SLmsg){
                        callback(sqlResult);
                    }else{
                        callback(null);
                    }
                });
            }
            , function(callback){
                syncServer.syncIpcomData(sql, data, function(sqlResult) {
                    if(sqlResult.SLmsg){
                        callback(sqlResult);
                    }else{
                        callback(null);
                    }
                });
            }
            , function(callback){
                syncServer.syncItmac1Data(sql, data, function(sqlResult) {
                    if(sqlResult.SLmsg){
                        callback(sqlResult);
                    }else{
                        callback(null);
                    }
                });
            }
            , function(callback){
                syncServer.syncItmac2Data(sql, data, function(sqlResult) {
                    if(sqlResult.SLmsg){
                        callback(sqlResult);
                    }else{
                        callback(null);
                    }
                });
            }
            , function(callback){
                syncServer.syncJsniper1Data(sql, data, function(sqlResult) {
                    if(sqlResult.SLmsg){
                        callback(sqlResult);
                    }else{
                        callback(null);
                    }
                });
            }
            , function(callback){
                syncServer.syncJsniper2Data(sql, data, function(sqlResult) {
                    if(sqlResult.SLmsg){
                        callback(sqlResult);
                    }else{
                        callback(null);
                    }
                });
            }            
            , function(callback){
                var sql = ` UPDATE
                                master 
                            SET 
                                co=?
                                , admin=?
                                , tel=?
                                , mail=?
                                , limit_date=?
                                , charge=?
                                , business=?
                                , note2=?
                                , sync=0
                            WHERE
                                ser =? AND lic=? `;
                var data = [co
                            , admin
                            , tel
                            , mail
                            , limit_date
                            , charge
                            , business
                            , note2
                            , serial
                            , license ];

                conn_obj.conn.getConnection(function(err, connection){
                    if(err){
                        res.status(500).send('modifyServer Error : 2');
                        return;
                    }
                    connection.query(sql, data, function(err, fields){
                        if(err){
                            console.log(err);
                            connection.release();
                            res.status(500).send('modifyServer Error : 2');
                            return;
                        }
                        connection.release();
                        callback(null);
                    });
                });
            }
        ];

        async.series(tasks, function(error, result) {
            var log = commonModule.makeLog(serial, req, timeInfo);
            if(error){
                log += "[Action] : Mod\n";
                log += syncServer.printLog();
                log += "[Result] : fail\n";
                commonModule.writeLog(ROOT_PATH + '/log/serial.log', log);
                res.send({errMsg:error});
                return;
            }else{
                log += "[Action] : Mod\n";
                log += syncServer.printLog();
                log += "[Result] : success\n";
                commonModule.writeLog(ROOT_PATH + '/log/serial.log', log);
                res.send({info:'ok', seial:serial});
            }
        });
    });

    return router;
}
