'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Forum = mongoose.model('Forum'),
	_ = require('lodash');

/**
 * Create a Forum
 */
exports.create = function(req, res) {
	var forum = new Forum(req.body);
	forum.user = req.user;

	forum.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forum);
		}
	});
};

/**
 * Show the current Forum
 */
exports.read = function(req, res) {
	res.jsonp(req.forum);
};

/**
 * Update a Forum
 */
exports.update = function(req, res) {
	var forum = req.forum ;

	forum = _.extend(forum , req.body);

	forum.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forum);
		}
	});
};

/**
 * Delete an Forum
 */
exports.delete = function(req, res) {
	var forum = req.forum ;

	forum.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forum);
		}
	});
};

/**
 * List of Forums
 */
exports.list = function(req, res) { 
	Forum.find().sort('-created').populate('user', 'displayName').exec(function(err, forums) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forums);
		}
	});
};

/**
 * Forum middleware
 */
exports.forumByID = function(req, res, next, id) { 
	Forum.update({_id:id},{$inc:{pv:1}},function(err,next){
	  if(err){
	  	console.log(err);
	    return next;
	  }
	});
	Forum.findById(id).populate('user', 'displayName').exec(function(err, forum) {
		if (err) return next(err);
		if (! forum) return next(new Error('Failed to load Forum ' + id));
		req.forum = forum ;
		next();
	});
};

/**
 * Forum authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.forum.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
