'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Visithistory = mongoose.model('Visithistory'),
	_ = require('lodash');

/**
 * Create a Visithistory
 */
exports.create = function(req, res) {
	var visithistory = new Visithistory(req.body);
	visithistory.user = req.user;

	visithistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visithistory);
		}
	});
};

/**
 * Show the current Visithistory
 */
exports.read = function(req, res) {
	res.jsonp(req.visithistory);
};

/**
 * Update a Visithistory
 */
exports.update = function(req, res) {
	var visithistory = req.visithistory ;

	visithistory = _.extend(visithistory , req.body);

	visithistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visithistory);
		}
	});
};

/**
 * Delete an Visithistory
 */
exports.delete = function(req, res) {
	var visithistory = req.visithistory ;

	visithistory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visithistory);
		}
	});
};

/**
 * List of Visithistorys
 */
exports.list = function(req, res) { 
	Visithistory.find().sort('-created').populate('user', 'displayName').exec(function(err, visithistorys) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visithistorys);
		}
	});
};

/**
 * Modify a Visithistory
 */
exports.modify = function(req, res) {
	var visithistoryObj = req.body;
	Visithistory.findOneAndUpdate({_id:visithistoryObj._id},{subcat:visithistoryObj.subcat,name:visithistoryObj.name,title:visithistoryObj.title,price:visithistoryObj.price},function (err,visithistory) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visithistory);
		}
	});
};

/**
 * Visithistory middleware
 */
exports.visithistoryByID = function(req, res, next, id) { 
	Visithistory.findById(id).populate('user', 'displayName').exec(function(err, visithistory) {
		if (err) return next(err);
		if (! visithistory) return next(new Error('Failed to load Visithistory ' + id));
		req.visithistory = visithistory ;
		next();
	});
};

/**
 * Visithistory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.visithistory.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
