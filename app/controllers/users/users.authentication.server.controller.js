'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	urlencode = require('urlencode'),
	request = require('request'),
	ccap = require('ccap'),
	nodemailer = require('nodemailer');

var captcha = ccap();
var ary,txt,buf;
var recCode;

/**
 * nodemailer
 */
 // create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
	service: 'QQ',
	auth: {
		user: 'info@havemay.cn',
		pass: ''
	}
});

/**
 *  Auth
 */
var auth = function (req,res){
	if (req.agreement && req.agreement === true){
		if (req.authimg && req.authimg.toUpperCase() === txt){
			if(!req.authCode){
				var now = new Date();
				var a = now.getSeconds();
				var authCode = Math.ceil(Math.random()*1000000)+a+Math.round(Math.random()*10+1);
				var appkey = 'fe66303b0f83ddd916fda2884debbd2f';//用户appkey
				console.log(authCode);
				// var minutes = 1000*60*3;//3分钟
				var tpl_id = 5465;//信息模版id
				var con = '#code#='+authCode+'&#minuetes#=10';
				var tpl_value=urlencode(con);
				var url = 'http://v.juhe.cn/sms/send?mobile='+req.mobile+'&tpl_id='+tpl_id+'&tpl_value='+tpl_value+'&key='+appkey;
				if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(req.mobile))){
					return res.status(400).send('wrong mobile format');
				}
				request({url:url},function (err,res,body){
					if(err){console.log(err);}
				});
				return authCode;
			}
		}
		else{
			return res.status(400).send({
				message:('图形验证码校验失败！请稍后重试！')
			});
		}
	}
	else{
		return res.status(400).send({
			message:('请确保同意注册协议！')
		});
	}
 };

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;
	var mobile = req.body.mobile;

	//if (req.body.agreement && req.body.agreement === true){
		if (!req.body.authCode){
			if(req.body.authimg && req.body.authimg.toUpperCase() === txt){
				req = req.body;
				recCode = auth(req);
				return res.status(200).send({
					message:('手机验证码发送成功！')
				});
			}
			else{
				return res.status(400).send({
					message:('图形验证码校验失败！请稍后重试！')
				});
			}
		}
		else if(req.body.authCode){
			if(req.body.authCode.toString() === recCode.toString()){
				// Init Variables
				var user = new User(req.body);
				var message = null;

				// Add missing user fields
				user.provider = 'local';

				// Then save the user 
				user.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						// Remove sensitive data before login
						user.password = undefined;
						user.salt = undefined;

						var email = req.body.email;
						var mailOptions = {
						    from: 'info@havemay.cn', // sender address
						    to: email, // list of receivers
						    subject: '欢迎入驻 茗语e家！ ✔', // Subject line
						    // text: 'Hello world ✔', // plaintext body
						    html: '<b>欢迎入驻 茗语e家 ✔</b><br />您的用户名是：'+req.body.username +'<br />购物答疑QQ群：374986752'// html body
						};
						transporter.sendMail(mailOptions, function(error, info){
						    if(error){
						        return console.log(error);
						    }
						});

						req.login(user, function(err) {
							if (err) {
								return res.status(400).send(err);
							} else {
								transporter.sendMail(mailOptions, function(error, info){
								    if(error){
								        return console.log(error);
								    }
								});
								return res.json(user);
							}
						});
					}
				});
			}
			else{
				return res.status(400).send({
					message:('手机验证码校验失败！请稍后重试！')
				});
			}
		}
	/* }
	else{
		return res.status(400).send({
			message:('请确保同意注册协议！')
		});
	} */
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	if (req.body.authimg.toUpperCase() === txt){
		txt = null;
		passport.authenticate('local', function(err, user, info) {
			if (err || !user) {
				res.status(400).send(info);
			} else {
				// Remove sensitive data before login
				user.password = undefined;
				user.salt = undefined;

				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		})(req, res, next);
	} else{
		txt = null;
		return res.status(400).send({message: '图形验证码校验失败！请刷新页面后重试！'});
	}	
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 *  authimg
 */
exports.ccap = function(req, res) {	
	ary = captcha.get(),
	txt = ary[0],
	buf = ary[1];
	res.send(buf);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleMobile = providerUserProfile.mobile || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueMobile(possibleMobile, null, function(availableMobile) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							mobile: availableMobile,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	}
};
