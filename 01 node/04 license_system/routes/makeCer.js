
module.exports = function(conn_obj, ROOT_PATH){
    var express = require('express');
    var router = express.Router();
    var execSync = require('child_process').execSync;
    var makeCerModule = require(ROOT_PATH + '/routes/module/makeCerModule');
    var url = require('url');
    var moment = require('moment');

    router.get('/serial/:ser/:lic', function(req, res, next) {
        //시리얼 인증서
        if(!req.user){
            req.logout();
            req.session.save(function(){
                res.redirect('/login');
            });
            return;
        }

        var serial = req.params.ser;
        var license = req.params.lic;
        var id = req.user.id;
        var result;
        var cmd ='';

        cmd = 'rm -rf ' + ROOT_PATH +  '/util/cerdir/* ' ;
        result = execSync(cmd, {timeout: 30000, maxBuffer :200*1024});

        cmd = 'cd ' + ROOT_PATH + '/util ; ' + ROOT_PATH +  '/util/make_certificate.sh ' + serial + ' ' + license +' ' +id;
        result = execSync(cmd, {timeout: 30000, maxBuffer :200*1024});
        //id값이 이름인 폴더 와 인증서 파일 생성

        cmd = 'cd ' + ROOT_PATH + '/util ; ' +
                ROOT_PATH + '/util/verify_certificate.sh ' + serial + ' ' + license +' ' +id;
        execSync(cmd,{timeout: 30000, maxBuffer :200*1024, stdio:[0,1,2] });

        cmd = 'cd '+ ROOT_PATH + '/util ; ' +
            'tar czf ./cerdir/certificate.tar.gz ./'+ id+'/*.crt' ;
        execSync(cmd,{timeout: 30000, maxBuffer :200*1024, stdio:[0,1,2] });

        cmd = 'rm -rf ' + ROOT_PATH + '/util/' + id;
        execSync(cmd,{timeout: 30000, maxBuffer :200*1024, stdio:[0,1,2] });
        
        var downPath = ROOT_PATH + '/util/cerdir/certificate.tar.gz';
        res.download(downPath);

    });

/* 인증서 발급 모듈 사용법*/

    //ngfw 인증서 추가, cshyeon
    router.get(['/ngfw/:ser/:mac'], function(req, res, next) {
        if(!req.user){
            req.logout();
            req.session.save(function(){
                res.redirect('/login');
            });
            return;
        }

        var ser = req.params.ser;
        var id = req.user.id;
        var mac = req.params.mac;  
              
        var sql = 'SELECT a.ser, app, ips, vpn, av, tt, _as, _ssl, limit_date FROM ngfw_master a, master b WHERE a.ser = b.ser AND a.ser = ?';  
        var data =[ser];

        // 라이센스 정보 가져오기
        conn_obj.conn.getConnection(function(err, connection){
            if(err){
                res.status(500).send('ngfw cer Server Error : 1');
                return;
            }
            connection.query(sql, data, function(err, rows, fields){
                if(err){
                    connection.release();
                    res.status(500).send('ngfw cer Server Error : 1');
                    return;
                }
                // console.log(rows);
                
                // limit_days : limit_date 까지 일수 차이
                var limit_days = moment(rows[0].limit_date,'YYYYMMDD').diff(moment().format('YYYYMMDD'),'DAY') + 1;

                if(limit_days < 0){
                    connection.release();
                    res.status(500).send('ngfw cer Server Error : limit_date');
                    return;
                }

                // 라이센스 나열한 string으로 만들기 ex) APP,IPS,VPN,SSL,AV,AS,TT
                var lin = makeCerModule.return_ngfw_lin(rows[0]);
                
                var PATH = ROOT_PATH +'/util/ngfw/license';
                var CA_CERT = ROOT_PATH +'/util/ngfw/ca/-.crt';
                var CA_KEY = ROOT_PATH +'/util/ngfw/ca/-.key';
                // 환경변수를 /root/.bash_profile 에 저장했을 시 pm2 로 실행하면 안되는 문제 발생
                
                var cmd =                        
                        'export PATH=' + PATH + ';' 
                        + 'export CA_CERT=' + CA_CERT + ';' 
                        + 'export CA_KEY=' + CA_KEY + ';'                        
                        + ROOT_PATH + '/util/ngfw/sapa -s '+ ser +' -m '+ mac
                        + ' -e ' + limit_days
                        + ' -l '+ lin + ';';
                // console.log(cmd);
                execSync(cmd,{timeout: 30000, maxBuffer :200*1024, stdio:[0,1,2] });
                
                var downPath = SAPA_PATH + '/certs/' + ser + '.p12';   
                connection.release();
                res.download(downPath);
            });
        });

    });

return router; 
}