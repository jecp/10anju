'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Collect = mongoose.model('Collect'),
	Good = mongoose.model('Good'),
	Ccenter = mongoose.model('Ccenter');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).populate('collect','goods articles subjects').populate('ccenter').exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Show the current user
 */
exports.read = function(req, res) {
	var userId = req.query.userId;
	if (userId){
		User.findOne({_id:userId}).populate('collect','goods articles subjects').populate('ccenter','name').exec(function (err,user){
			if (err) {console.log(err);}
			return res.json(user);
		});
	}
	else{
		User.find().populate('ccenter','name').exec(function (err,users){
			if (err) {console.log(err);}
			return res.json(users);
		});
	}
};

/**
 * Count of Users
 */
exports.count = function(req, res) {
	User.count().exec(function(err, users) {
		if (err) {console.log(err);
		} else {
			res.json(users);
		}
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};

/**
 * User admin routing middleware
 */
exports.adminRequired = function(req, res, next) {
	var _this = req.user;

	User.findOne({_id:_this._id,roles:'admin'},function (err,user){
		if (err){console.log(err);}
		else if(user){
			return next();
		}
		else {
			return res.status(403).send({
				message: 'User is not Admin'
			});
		}
	});
};
