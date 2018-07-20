/**
 * Module - passport.js
 */
var passport		= require('passport');
var LocalStrategy	= require('passport-local').Strategy;

var login			= require('./login');
var util			= require('./util');

// ============================================================================

/**
 * Configure and settings
 */
passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(user, cb) {
	cb(null, user);
});

// ============================================================================

/**
 * Strategies
 */
passport.use('local-login', new LocalStrategy({
		usernameField : 'userid',
        passwordField : 'token',
        passReqToCallback : true
    },
    function(req, id, pw, cb) {
    	process.nextTick(function() {
    		if(req.body.ts === undefined) { return cb(null, false); }
    		if(!util.checkResponseTime(req.body.ts)) { return cb(null, false) }

				login.loginUserInfo(id, pw, req, function(err, user){
					if(err) {
						console.log(err);
						return cb(null, false);
					}
					if(!user) { return cb(null, false); }

					return cb(null, user);
				});
		});
}));

// ============================================================================

/**
 * Export Module
 */
module.exports = passport;
