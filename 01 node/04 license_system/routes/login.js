module.exports = function(passport){
    var express = require('express');
    var router = express.Router();

    router.get('/', function(req, res, next){
        if(!req.user){
            req.logout();
            req.session.save(function(){
                res.render('login');
            });
            return;
        }
        res.redirect('/mainSerial');
    });

    router.post('/', 
        passport.authenticate('local', { 
                successRedirect: '/userlist',
                failureRedirect: '/login',
                failureFlash: false
            }
        )
    );


    router.get('/logout', function(req, res, next){
        req.logout();
        req.session.save(function(){
            res.redirect('/login');
        });
    });

    return router;
}