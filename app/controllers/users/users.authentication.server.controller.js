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
	request = require('request');

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;
	var authCode = req.body.authCode;
	var mobile = req.body.mobile;

	if(!req.body.authCode){
			var now = new Date();
			var a=now.getSeconds();
			authCode=Math.ceil(Math.random()*1000000)+a+Math.round(Math.random()*10+1);
			var appkey = 'fe66303b0f83ddd916fda2884debbd2f';//用户appkey
			// var minutes = 1000*60*3;//3分钟
			var tpl_id = 5465;//信息模版id
			var con = '#code#='+authCode+'&#minutes#=3';
			console.log(con);
			var tpl_value=urlencode(con);
			console.log(tpl_value);
			var url = 'http://v.juhe.cn/sms/send?mobile='+mobile+'&tpl_id='+tpl_id+'&tpl_value='+tpl_value+'&key='+appkey;
			console.log(url);
			request({url:url},function (err,res,body){
				if(err){console.log(err);}
				else if(body.error_code === 0){
					console.log(body);
				}else{
					console.log(body.reason);
				}
			});
		// 米微
		// var mobile = req.body.mobile;
		// var now = new Date();
		// var a=now.getSeconds();
		// var authCode=Math.ceil(Math.random()*1000000)+a+Math.round(Math.random()*10+1);
		// var postData = {
		//     uid:'gdGKvjPIoGjf',
		//     pas:'q84gbcu8',
		//     mob:mobile,
		//     con:'【茗语e家】您的验证码是：'+authCode+'，3分钟内有效。如非您本人操作，可忽略本消息。',
		//     type:'json'
		// };
		// var content = querystring.stringify(postData);
		// var options = {
		//     host:'api.weimi.cc',
		//     path:'/2/sms/send.html',
		//     method:'POST',
		//     agent:false,
		//     rejectUnauthorized : false,
		//     headers:{
		//         'Content-Type' : 'application/x-www-form-urlencoded', 
		//         'Content-Length' :content.length
		//     }
		// };
		// var req = http.request(options,function(res){
		//     res.setEncoding('utf8');
		//     res.on('data', function (cb) {
		//         if(cb.msg === '短信接口调用成功'){
		//         	console.log(anthCode);
		//         	console.log(cb);
		//         }
		//     });
		//     res.on('end',function(){
		//         console.log('over');
		//     });
		// });
		// req.write(content);
		// req.end();
	}else if(req.body.authCode){
		if(req.body.authCode === authCode){
			console.log(authCode);
			// Init Variables			
			var user = new User(req.body);
			var message = null;

			// agreement == true,next,otherwise back
			if (req.body.agreement === true){
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
			else{
				return res.status(400).send({
					message: errorHandler.getErrorMessage('请确保同意注册协议！')
				});
			}
		}else{
			return res.status(400).send({
				message: errorHandler.getErrorMessage('验证码校验失败！请稍后重试！')
			});
		}
	}	
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {	
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
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
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
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
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
