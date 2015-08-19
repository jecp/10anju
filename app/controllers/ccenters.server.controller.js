'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ccenter = mongoose.model('Ccenter'),
	_ = require('lodash');

/**
 * Create a Ccenter
 */
exports.create = function(req, res) {
	var ccenter = new Ccenter(req.body);

	ccenter.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ccenter);
		}
	});
};

/**
 * Show the current Ccenter
 */
exports.read = function(req, res) {
	res.jsonp(req.ccenter);
};

/**
 * Update a Ccenter
 */
exports.update = function(req, res) {
	var ccenter = req.ccenter ;

	ccenter = _.extend(ccenter , req.body);

	ccenter.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ccenter);
		}
	});
};

/**
 * Delete an Ccenter
 */
exports.delete = function(req, res) {
	var ccenter = req.ccenter ;

	ccenter.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ccenter);
		}
	});
};

/**
 * List of Ccenters
 */
exports.list = function(req, res) {
	Ccenter.find().sort('-created').populate('user', 'username').exec(function(err, ccenters) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ccenters);
		}
	});
};

/**
 * Modify a Ccenter
 */
exports.modify = function(req, res) {
	var ccenterObj = req.body;
	Ccenter.findOneAndUpdate({_id:ccenterObj._id},{subcat:ccenterObj.subcat,name:ccenterObj.name,title:ccenterObj.title,price:ccenterObj.price},function (err,ccenter) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ccenter);
		}
	});
};

/**
 * List of Ccenters
 */
exports.findU = function(req, res) {
	Ccenter.findOne({user:req.user._id},function(err, ccenter) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.send(ccenter);
		}
	});
};

/**
 * Ccenter middleware
 */
exports.ccenterByID = function(req, res, next, id) { 
	Ccenter.update({_id:id},{$inc:{pv:1}},function(err,next){
	  if(err){
	  	console.log(err);
	    return next;
	  }
	});
	Ccenter.findById(id).populate('user', 'displayName').exec(function(err, ccenter) {
		if (err) return next(err);
		if (! ccenter) return next(new Error('Failed to load Ccenter ' + id));
		req.ccenter = ccenter ;
		next();
	});
};

/**
 * Ccenter authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ccenter.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
