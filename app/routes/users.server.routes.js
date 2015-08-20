'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller');

	// Setting up the users profile api
	app.route('/users/me').get(visithistory.vh_log, users.me);
	app.route('/users').put(visithistory.vh_log, users.update);
	app.route('/users/accounts').delete(visithistory.vh_log, users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/users/password').post(visithistory.vh_log, users.changePassword);
	app.route('/auth/forgot').post(visithistory.vh_log, users.forgot);
	app.route('/auth/reset/:token').get(visithistory.vh_log, users.validateResetToken);
	app.route('/auth/reset/:token').post(visithistory.vh_log, users.reset);

	// Register in an ccenter
	app.route('/users_ccenter/').post(visithistory.vh_log, users.register);

	// User count
	// app.route('/user_count').get(users.myCount);

	// Setting up the users authentication api
	app.route('/auth/signup').post(visithistory.vh_log, users.signup);
	app.route('/auth/signin').post(visithistory.vh_log, users.signin);
	app.route('/auth/signout').get(visithistory.vh_log, users.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(users.oauthCallback('github'));

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
