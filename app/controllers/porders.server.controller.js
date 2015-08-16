'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Porder = mongoose.model('Porder'),
	_ = require('lodash');

/**
 * Create a Porder
 */
exports.create = function(req, res) {
	console.log(req.body.goods);
	var porder = new Porder(req.body);
	porder.user = req.user;
	porder.goods = req.body.goods;

	porder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(porder);
		}
	});
};

/**
 * Show the current Porder
 */
exports.read = function(req, res) {
	res.jsonp(req.porder);
};

/**
 * Update a Porder
 */
exports.update = function(req, res) {
	var porder = req.porder ;

	porder = _.extend(porder , req.body);

	porder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(porder);
		}
	});
};

/**
 * Delete an Porder
 */
exports.delete = function(req, res) {
	var porder = req.porder ;

	porder.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(porder);
		}
	});
};

/**
 * List of Porders
 */
exports.list = function(req, res) { 
	Porder.find().sort('-created').populate('user', 'displayName').exec(function(err, porders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(porders);
		}
	});
};

/**
 * Porder middleware
 */
exports.porderByID = function(req, res, next, id) { 
	Porder.findById(id).populate('user', 'username mobile roomNum buyer_email').exec(function(err, porder) {
		if (err) return next(err);
		if (! porder) return next(new Error('Failed to load Porder ' + id));
		req.porder = porder ;
		next();
	});
};

/**
 * Porder authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.porder.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
