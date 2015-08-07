'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Good = mongoose.model('Good'),
	Category = mongoose.model('Category'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Good
 */
exports.create = function(req, res) {
	var good = new Good(req.body);
	good.user = req.user;
	var cate = req.body.category;
	console.log(req.body);
		
	good.suitable = req.body.suitable ? req.body.suitable.split(',') : '';
	good.img = req.body.img ? req.body.img.split(',') : ',';
	good.therapy = req.body.therapy ? req.body.therapy.split(',') : ',';
	good.feature = req.body.feature? req.body.therapy.split(',') : ',';

	good.save(function (err, good){
		if (err){
			console.log(err);
		}
		if (cate){
			Category.findById(cate, function (err,category){
				console.log(category);
				category.goods.push(good._id);

				category.save(function (err,category){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(good);
					}
				});
			});
		}
		else {
			var cateObj = new Category({
				name: cate,
				goods: [good._id]
			});

			cateObj.save(function (err,category){
				good.category = category._id;
				good.save(function (err,good){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(good);
					}
				});
			});
		}
	});
};

/**
 * Show the current Good
 */
exports.read = function(req, res) {
	res.jsonp(req.good);
};

/**
 * Update a Good
 */
exports.update = function(req, res) {
	var good = req.good ;
	good = _.extend(good , req.body);

	good.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(good);
		}
	});
};

/**
 * Like a Good
 */
exports.like = function(req, res) {
	var goodId = req.body._id;
	if (req.user._id){
		User.findOne({_id:req.user._id, goods_like:goodId}, function (err,user){
			if (err) {console.log(err);} 
			else if(user){
				Good.findOneAndUpdate({_id:goodId},{$inc:{like:-1}}).exec(function (err,good){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						user.update({$pull:{goods_like:goodId}}).exec(function (err,user){
							if (err){console.log(err);}
							else {
								res.send(good);
							}
						});
					}
				});				
			}
			else {
				Good.findOneAndUpdate({_id:goodId},{$inc:{like:1}}).exec(function (err,good){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						User.findOneAndUpdate({_id:req.user._id},{$push:{goods_like:goodId}}).exec(function (err,user){
							if (err){console.log(err);}
							else {
								res.send(good);
							}
						});
					}
				});				
			}
		});
	}
};

// search goods
exports.results = function (req,res){
	var q = req.body.keyword;
	var query = new RegExp('^' + q + '.*');
	if(query){
		Good.find({title:{ $all: [query]}},function (err,goods){
			if (err){console.log(err);}
			else {
				res.send(goods);
			}
		});
	}
};

/**
 * Delete an Good
 */
exports.delete = function(req, res) {
	var good = req.good ;

	good.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(good);
		}
	});
};

/**
 * List of Goods
 */
exports.list = function(req, res) {
	var subcat = req.query.subcat;

	if(subcat){
		Good.find({'subcat':subcat}).populate('user', 'username').populate('category', 'name').sort('-updated').exec(function (err,goods){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(goods);
			}
		});
	} else {
		Good.find().sort('-created').populate('user', 'username').populate('category', 'name').exec(function(err, goods) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(goods);
			}
		});
	}
};

/**
 * Good middleware
 */
exports.goodByID = function(req, res, next, id) {
	console.log(req.query.keyword);
	Good.update({_id:id},{$inc:{pv:1}},function(err,next){
	  if(err){
	  	console.log(err);
	    return next;
	  }
	});
	Good.findById(id).populate('user', 'displayName').populate('category','name').exec(function(err, good) {
		if (err) return next(err);
		if (! good) return next(new Error('Failed to load Good ' + id));
		req.good = good ;
		next();
	});
};

/**
 * Good authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.good.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
