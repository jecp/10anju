'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Admin = mongoose.model('Admin'),
	Gds = mongoose.model('Gds'),
	_ = require('lodash');

/**
 * Create a Admin
 */
exports.create = function(req, res) {
	var admin = new Admin(req.body);
	admin.user = req.user;

	admin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admin);
		}
	});
};

/**
 * Admin Login
 */
exports.login = function(req, res) {
	var aname = req.body.username;
	var apwd = req.body.password;
	console.log(req.body);
	console.log('username:'+req.body.username+';password:'+req.body.password);

	Admin.findOne({name:aname},function (err,admin){
		if (err) {console.log(err);}
		if (!admin){
			console.log(admin);
			res.redirect('/#!/goods');
		}
	});
};

/**
 * Show the current Admin
 */
exports.read = function(req, res) {
	res.jsonp(req.admin);
};

/**
 * Update a Admin
 */
exports.update = function(req, res) {
	var admin = req.admin ;

	admin = _.extend(admin , req.body);

	admin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admin);
		}
	});
};

/**
 * Delete an Admin
 */
exports.delete = function(req, res) {
	var admin = req.admin ;

	admin.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admin);
		}
	});
};

/**
 * List of Admins
 */
exports.list = function(req, res) { 
	Admin.find().sort('-created').populate('user', 'displayName').exec(function(err, admins) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admins);
		}
	});
};

/**
 * Modify a Admin
 */
exports.modify = function(req, res) {
	var adminObj = req.body;
	Admin.findOneAndUpdate({_id:adminObj._id},{subcat:adminObj.subcat,name:adminObj.name,title:adminObj.title,price:adminObj.price},function (err,admin) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admin);
		}
	});
};

/**
 * Find List of Gds
 */
exports.findGds = function(req, res) { 
	Gds.find().sort('-created').exec(function(err, gdss) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gdss);
		}
	});
};

/**
 * update a Gds
 */
exports.updateGds = function(req, res) { 
	Gds.findById(req.body._id,function (err, gds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var gdsObj = _.extend(gds,req.body);
			gdsObj.save(function (err,doc){
				if(err){console.log(err);}
				res.send(doc);
			});
		}
	});
};

/**
 * Delete a Gds
 */
exports.delGds = function(req, res) { 
	Gds.findOneAndRemove(req.query.gds,function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.send('ok');
		}
	});
};

/**
 * Admin middleware
 */
exports.adminByID = function(req, res, next, id) { 
	Admin.findById(id).populate('user', 'displayName').exec(function(err, admin) {
		if (err) return next(err);
		if (! admin) return next(new Error('Failed to load Admin ' + id));
		req.admin = admin ;
		next();
	});
};

/**
 * Admin authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.admin.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
