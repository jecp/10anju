'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Category = mongoose.model('Category'),
	_ = require('lodash');

/**
 * Create a Category
 */
exports.create = function(req, res) {
	var category = new Category(req.body);
	category.user = req.user;

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Show the current Category
 */
exports.read = function(req, res) {
	var catId = req.params.categoryId;

	if(catId){
		Category.findById(catId).populate('goods','title main_img price delivery').exec(function (err,category){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(category);
			}
		});
	} else{
		res.jsonp(req.category);
	}
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
	var category = req.category ;

	category = _.extend(category , req.body);

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Delete an Category
 */
exports.delete = function(req, res) {
	var category = req.category ;

	category.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
	console.log(res.header);
	res.header("Access-Control-Allow-Origin","*");
	Category.find().sort('-created').populate('goods','name main_img price title delivery').exec(function(err, categories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});			
		} else {
			res.jsonp(categories);
		}
	});
};

/**
 * List of Categories
 */
exports.admin_list = function(req, res) {
	Category.find().sort('-created').exec(function (err, categories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});			
		} else {
			res.jsonp(categories);
		}
	});
};

/**
 * Modify a Category
 */
exports.modify = function(req, res) {
	var categoryObj = req.body;
	Category.findById(req.body._id,function (err,category){
		if(err){console.log(err);}
		categoryObj = _.extend(category,categoryObj);
		categoryObj.user = category.user;
		categoryObj.subcat = req.body.subcat ? req.body.subcat.toString().split(',') : ''; 
		categoryObj.save(function (err,category){
			if(err){console.log(err);}
			res.send(category);
		});		
	});
};

/**
 * CatBySub
 */
exports.catBySub = function(req, res) {
	var subcat = req.params.subcat;
	Category.findOne({subcat:subcat},function (err, category) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});			
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) {
	Category.update({_id:id},{$inc:{pv:1}},function(err,next){
	  if(err){
	  	console.log(err);
	    return next;
	  }
	});
	Category.findById(id).populate('user', 'displayName').exec(function(err, category) {
		if (err) return next(err);
		if (! category) return next(new Error('Failed to load Category ' + id));
		req.category = category ;
		next();
	});
};

/**
 * Category authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.category.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
