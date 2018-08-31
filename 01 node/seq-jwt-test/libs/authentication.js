var jwt = require('jsonwebtoken');
var user = require('../models').User;

module.exports = function (req, res, next) {
    try{
        var token = jwt.decode(req.header("Auth"),'secret');
        var currentTime = Date.now() / 1000;

        if ( token.exp < currentTime) {
            next(new Error(402, "token expired"));
            return;
        }
        user.findOne({
            where: {
                email: token.email
            }
        }).then((user) => {
            // if(token.time)  
            if(user){
                console.log(token.email);
                req.user = token.email;
                next();
                return;
            }else{
                return next(new Error("no user token"));
            }
            //  userFromReq: req.user, // this exists because you added in the middleware
            // userFromSession: req.session.user, // this was already in the session, so you can access
            // userFromRes: [DO NOT NEED TO DO THIS] // because res.locals are sent straight to the view (Jade).        
        });

    }catch(err){
        return next(new Error("invalid token."));
    }
};