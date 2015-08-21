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
	_ = require('lodash');

/**
 * Create a Good
 */
exports.create = function(req, res) {
	var good = new Good(req.body);
	good.user = req.user;
	var cate = req.body.cate;

	good.suitable = req.body.suitable ? req.body.suitable.split(',') : '';
	good.img = req.body.img ? req.body.img.split(',') : '';
	good.therapy = req.body.therapy ? req.body.therapy.split(',') : '';
	good.feature = req.body.feature? req.body.feature.split(',') : '';

	if(cate && cate.length === 24){
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
	} else{
		Category.findOne({name:cate},function (err,category){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else if(category) {
				good.category = category._id;
				good.save(function (err,good){
					if(err){
						console.log(err);
					} else {
						category.update({$push:{goods:good._id,subcat:good.subcat}},function (err){
							if(err){console.log(err);}
							else{
								res.jsonp(good);
							}
						});
					}
				});				
			}else{
				var cateObj = new Category({
					name: cate,
					user: req.user,
					subcat:req.body.subcat
				});
				cateObj.save(function (err,category){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						good = new Good(req.body);
						good.user = req.user;
						good.category = category._id;
						good.suitable = req.body.suitable ? req.body.suitable.split(',') : '';
						good.img = req.body.img ? req.body.img.split(',') : ',';
						good.therapy = req.body.therapy ? req.body.therapy.split(',') : ',';
						good.feature = req.body.feature? req.body.feature.split(',') : ',';

						good.save(function (err,good){
							if(err){
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								category.update({$push:{goods:good._id}},function (err){
									if(err){console.log(err);}
									else{
										res.jsonp(good);
									}
								});
							}
						});
					}
				});
			}
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
 * Update a Good
 */
exports.update = function(req, res) {
	var good = req.good ;
	good = _.extend(good , req.body);

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
 * Count of Goods
 */
exports.count = function(req, res) {
	Good.count().exec(function(err, goods) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(goods);
		}
	});
};

/**
 * Modify a Good
 */
exports.modify = function(req, res) {
	var goodObj = req.body;
	Good.findOneAndUpdate({_id:goodObj._id},{subcat:goodObj.subcat,name:goodObj.name,title:goodObj.title,price:goodObj.price},function (err,good) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(good);
		}
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
