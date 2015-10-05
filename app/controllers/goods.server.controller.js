'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Good = mongoose.model('Good'),
	Category = mongoose.model('Category'),
	User = mongoose.model('User'),
	Collect = mongoose.model('Collect'),
	Visithistory = mongoose.model('Visithistory'),
	_ = require('lodash'),
	markdown = require('markdown').markdown;

/**
 * Create a Good
 */
exports.create = function(req, res) {
	var good = new Good(req.body);
	good.user = req.user;
	var cate = req.body.cate;
	good.detail = req.body.detail ? markdown.toHTML(req.body.detail) : '';
	good.markdown = req.body.detail;
	good.price = _.ceil(req.body.price,2);	
	good.suitable = req.body.suitable ? req.body.suitable.split(',') : '';
	good.img = req.body.img ? req.body.img.split(',') : '';
	good.therapy = req.body.therapy ? req.body.therapy.split(',') : '';
	good.feature = req.body.feature? req.body.feature.split(',') : '';
	good.status = 0;

	if(cate){
		good.category = cate;
		good.save(function (err,good){
			Category.findOne({_id:cate,subcat:req.body.subcat},function (err,category){
				if (err){console.log(err);}
				else if(category){
					category.update({$push:{good:good._id}}).exec(function (err){
						if(err){console.log(err);}
						else{
							res.jsonp(good);
						}
					});
				}else{
					Category.findOneAndUpdate({_id:cate},{$push:{goods:good._id,subcat:good.subcat}},function (err,category){
						if(err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							res.jsonp(good);
						}
					});
				}
			});
		});
	} 
};

/**
 * Show the current Good
 */
exports.read = function(req, res) {
	res.jsonp(req.good);
};

/**
 * Edit the good
 */
exports.edit = function (req,res){
	Good.findOne({_id:req.query.goodId},function (err,good){
		if(err){console.log(err);}
		res.send(good);
	});
};

/**
 * Update a Good
 */
exports.update = function(req, res) {
	var good = req.good;
	// console.log(req.body);
	good = _.extend(good , req.body);
	good.user = req.good.user._id;
	good.detail = req.good.markdown ? markdown.toHTML(req.good.markdown) : '';
	good.markdown = req.body.detail;
	good.tiaoma = req.good.tiaoma;

	good.img = req.good.img ? req.good.img.toString().split(',') : '';
	good.suitable = req.good.suitable ? req.good.suitable.toString().split(',') : '';
	good.therapy = req.good.therapy ? req.good.therapy.toString().split(',') : ',';
	good.feature = req.good.feature? req.good.feature.toString().split(',') : ',';
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
		Collect.findOne({user:req.user._id,good:goodId}, function (err,collect){
			if (err) {console.log(err);} 
			else if(collect){
				Good.findOneAndUpdate({_id:goodId},{$inc:{like:-1}}).exec(function (err,good){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						collect.update({$pull:{good:goodId}}).exec(function (err,collect){
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
						Collect.findOneAndUpdate({user:req.user._id},{$push:{good:goodId}}).exec(function (err,collect){
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

/**
 * Like a Good
 */
exports.collect = function(req, res) {
	var goodId = req.body._id;
	if (req.user._id){
		Collect.findOne({user:req.user._id, good:goodId}, function (err,collect){
			if (err) {console.log(err);} 
			else if(collect){
				Good.findOneAndUpdate({_id:goodId},{$inc:{collect:-1}}).exec(function (err,good){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						collect.update({$pull:{good:goodId}}).exec(function (err,collect){
							if (err){console.log(err);}
							else {
								res.send(good);
							}
						});
					}
				});				
			}
			else {
				Good.findOneAndUpdate({_id:goodId},{$inc:{collect:1}}).exec(function (err,good){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						Collect.findOneAndUpdate({user:req.user._id},{$push:{good:goodId}}).exec(function (err,collect){
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
	var query = new RegExp(q);
	if(query){
		Good.find({title:query},function (err,goods){
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
 * Del an Good
 */
exports.del = function(req, res) {
	Good.findOneAndRemove({_id:req.body._id},function (err,cb) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.send(cb);
	});
};

/**
 * List of Goods
 */
exports.list = function(req, res) {
	var subcat = req.query.subcat;
	var cat = req.query.catId;

	if(subcat){
		Good.find({'subcat':subcat}).sort('-updated').exec(function (err,goods){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(goods);
			}
		});
	} else if(cat){
		Good.find({category:cat}).skip(req.query.skip).limit(req.query.limit).sort('-created').exec(function(err, goods) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(goods);
			}
		});
	} else{
		Good.find().skip(req.query.skip).limit(req.query.limit).sort('-created').exec(function(err, goods) {
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
 * Modify a Good
 */
exports.modify = function(req, res) {
	Good.findOne({_id:req.body._id},function (err,good){
		if(err){console.log(err);}
		var goodObj = _.extend(good , req.body);
		good.detail = req.body.markdown ? markdown.toHTML(req.body.markdown) : '';

		goodObj.user = req.user._id;
		goodObj.tiaoma = req.body.tiaoma;
		goodObj.img = req.body.img ? req.body.img.toString().split(',') : '';
		goodObj.suitable = req.body.suitable ? req.body.suitable.toString().split(',') : '';
		goodObj.therapy = req.body.therapy ? req.body.therapy.toString().split(',') : '';
		goodObj.feature = req.body.feature? req.body.feature.toString().split(',') : '';
		goodObj.save(function (err,good){
			if(err){console.log(err);}
			res.send(good);
		});	
	});
};

/**
 * Good middleware
 */
exports.goodByID = function(req, res, next, id) {
	Good.update({_id:id},{$inc:{pv:1}},function(err,next){
	  if(err){
	  	console.log(err);
	    return next;
	  }
	});

	Good.findById(id).populate('user', 'displayName').populate('category','name').exec(function (err, good) {
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
