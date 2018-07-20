var express 		= require('express');

var passport 		= require('../../models/passport');
var utils 			= require('../../models/util');
var log 			= require('../../models/log');

var router 			= express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.route('/login')
    .get(utils.checkBeforeLogin, function(req, res){
        return res.render('login');
    })
    .post(function(req, res, next) {
        req.session.ip = req.body.ip;
        req.session.port = req.body.port;

        var params = {
            ip : req.session.ip,
            port : req.session.port,
        }                     
        utils.getRoot(params, (err, result) => {
            if(err) {
                return res.json(err);
            }
            req.session.root = result;
        });       

        passport.authenticate('local-login',
            function(err, user, info) {
                if (err) {
                    return next(err); // 500 error
                }
                if (!user) {
                    var params = {
              					host: req.session.ip,
              					port: req.session.port,
              					userid: (req.user) ? req.user.id : 'UNKNOWN',
              					request: utils.join(req.method, req.originalUrl),
              					userip: utils.getUserIP(req),
                                type: 'WEB',
                                result : 0,
              					job: '로그인',
              					job_detail: '[계정정보]가 일치하지 않습니다.'
              			};
              			log.setSystemAuditLog(params, (err, rows) => {
              					if(err){
              							console.log('Error[AuditLog Inserting]');
              					}
              			});

                    return res.status(409).render('login', { errCode: 409, errMsg: 'Conflict', userid: req.body.userid });    // 409 error
                }
                req.login(user, function(err){
                    if(err){
                        console.error(err);
                        return next(err);
                    }
                    var params = {
              					host: req.session.ip,
              					port: req.session.port,
              					userid: (req.user) ? req.user.id : 'UNKNOWN',
              					request: utils.join(req.method, req.originalUrl),
              					userip: utils.getUserIP(req),
              					type: 'WEB',
                                result : 2,
              					job: '로그인',
              					job_detail: utils.getUserIP(req) + '이 [로그인]을 성공하였습니다.'
              			};
              			log.setSystemAuditLog(params, (err, rows) => {
              					if(err){
              							console.log('Error[AuditLog Inserting]');
              					}
                          });                                         

                    return res.redirect('/dashboards/dashboard');
                });
            })(req, res, next);
    });

router.get('/logout', function(req, res){
    var params = {
        host: req.session.ip,
        port: req.session.port,
        userid: (req.user) ? req.user.id : 'UNKNOWN',
        request: utils.join(req.method, req.originalUrl),
        userip: utils.getUserIP(req),
        type: 'WEB',
        job: '로그아웃',
        result : 2,
        job_detail: utils.getUserIP(req) + '이 [로그아웃]을 완료하였습니다.'
    };
    log.setSystemAuditLog(params, (err, rows) => {
        if(err){
            console.log('Error[AuditLog Inserting]');
        }
    });

    req.logout();
    req.session.destroy();
    return res.redirect('/');
});

module.exports = router;
