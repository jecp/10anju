'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Ccenter = mongoose.model('Ccenter');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

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
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Update user details
 */
exports.register = function(req, res) {
	if (req.user) {
		if (req.body.roomNum) {
			User.findOne({_id:req.user._id},function(err, user) {
				if (err){console.log(err);}
				else if(!user) {
					User.findOneAndUpdate({_id:req.user._id},{ccenter:req.body.ccenter._id,roomNum:req.body.roomNum},function (err,user){
						if(err){console.log(err);}
						else{
							Ccenter.findOneAndUpdate({_id:req.body.ccenter._id},{$push:{user:user._id}},function (err,ccenter){
								if (err){console.log(err);}
								else{
									res.send({
										message:'您已成功在小区安家'
									});
								}
							});	
						}
					});				
				}else{
					res.send({message:'您已入驻过啦！'});
				}
			});
		}
	}
};

/**
 * Count of User Subjects
 */
// exports.myCount = function(req, res) {
// 	console.log(req.user);

// 	User.findOne({user:req.user}).populate('comment').populate('subject').populate('collect').exec(function (err, user) {
// 		if (err) {
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else {
// 			res.jsonp(user);
// 		}
// 	});
// };

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};
