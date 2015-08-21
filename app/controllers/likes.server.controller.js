'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Like = mongoose.model('Like'),
	Subject = mongoose.model('Subject'),
	Article = mongoose.model('Article'),
	Good = mongoose.model('Good'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Like
 */
exports.create = function (req,res) {

	var obj = req.body.obj,
		value = req.body.value,
		userId = req.user._id;
		
	if (obj === 'goods'){
		Like.findOne({user:userId,goods:value},function (err,like){
			if(err){console.log(err);}
			else if(like){
				Like.findOneAndUpdate({_id:like._id},{$pull:{goods:value}},function (err){
					if(err){console.log(err);}
				});
				Good.findOneAndUpdate({_id:value},{$inc:{like:-1}},function (err,good){
					if(err){console.log(err);}
					return res.send(good);
				});
			}
			else{
				Like.findOne({user:userId},function (err,like){
					if(err){console.log(err);}
					else if(like){
						Like.findOneAndUpdate({_id:like._id},{$push:{goods:value}},function (err){
							if(err){console.log(err);}
						});
						Good.findOneAndUpdate({_id:value},{$inc:{like:1}},function (err,good){
							if(err){console.log(err);}
							return res.send(good);
						});
					}
					else{
						var _like = new Like(req.body);
						_like.user = req.user;
						_like.goods = value;
						_like.save(function (err,like){
							if(err){console.log(err);}
							User.findOneAndUpdate({_id:userId},{like:like._id},function (err){
								if (err) {console.log(err);} 
							});							
							Good.findOneAndUpdate({_id:value},{$inc:{like:1}},function (err,good){
								if(err){console.log(err);}
								return res.send(good);
							});				
						});
					}
				});
			}
		});
	}
	else if (obj === 'subjects'){
		Like.findOne({user:userId,subjects:value},function (err,like){
			if(err){console.log(err);}
			else if(like){
				Like.findOneAndUpdate({_id:like._id},{$pull:{subjects:value}},function (err){
					if(err){console.log(err);}
				});
				Subject.findOneAndUpdate({_id:value},{$inc:{like:-1}},function (err,subject){
					if(err){console.log(err);}
					return res.send(subject);
				});
			}
			else{
				Like.findOne({user:userId},function (err,like){
					if(err){console.log(err);}
					else if(like){
						Like.findOneAndUpdate({_id:like._id},{$push:{subjects:value}},function (err){
							if(err){console.log(err);}
						});
						Subject.findOneAndUpdate({_id:value},{$inc:{like:1}},function (err,subject){
							if(err){console.log(err);}
							return res.send(subject);
						});
					}
					else{
						var _like = new Like(req.body);
						_like.user = req.user;
						_like.subjects = value;
						_like.save(function (err,like){
							if(err){console.log(err);}
							else{
								User.findOneAndUpdate({_id:userId},{like:like._id},function (err,user){
									if (err) {console.log(err);}
								});							
								Subject.findOneAndUpdate({_id:value},{$inc:{like:1}},function (err,subject){
									if(err){console.log(err);}
									return res.send(subject);
								});	
							}										
						});
					}
				});
			}
		});
	}else {
		Like.findOne({user:userId,articles:value},function (err,like){
			if(err){console.log(err);}
			else if(like){
				Like.findOneAndUpdate({_id:like._id},{$pull:{articles:value}},function (err){
					if(err){console.log(err);}
				});
				Article.findOneAndUpdate({_id:value},{$inc:{like:-1}},function (err,article){
					if(err){console.log(err);}
					return res.send(article);
				});
			}
			else{
				Like.findOne({user:userId},function (err,like){
					if(err){console.log(err);}
					else if(like){
						Like.findOneAndUpdate({_id:like._id},{$push:{articles:value}},function (err){
							if(err){console.log(err);}
						});
						Article.findOneAndUpdate({_id:value},{$inc:{like:1}},function (err,article){
							if(err){console.log(err);}
							return res.send(article);
						});
					}
					else{
						var _like = new Like(req.body);
						_like.user = req.user;
						_like.articles = value;
						_like.save(function (err,like){
							if(err){console.log(err);}
							User.findOneAndUpdate({_id:userId},{like:like._id},function (err){
								if (err) {console.log(err);} 
							});							
							Article.findOneAndUpdate({_id:value},{$inc:{like:1}},function (err,article){
								if(err){console.log(err);}
								return res.send(article);
							});				
						});
					}
				});
			}
		});
	}
};

/**
 * Show the current Like
 */
exports.read = function(req, res) {
	res.jsonp(req.like);
};

/**
 * Update a Like
 */
exports.update = function(req, res) {
	var like = req.like ;

	like = _.extend(like , req.body);

	like.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(like);
		}
	});
};

/**
 * Delete an Like
 */
exports.delete = function(req, res) {
	var like = req.like ;

	like.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(like);
		}
	});
};

/**
 * List of Likes
 */
exports.list = function(req, res) { 
	Like.find().sort('-created').populate('user', 'displayName').exec(function(err, likes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(likes);
		}
	});
};

/**
 * Like middleware
 */
exports.likeByID = function(req, res, next, id) { 
	Like.findById(id).populate('user', 'displayName').exec(function(err, like) {
		if (err) return next(err);
		if (! like) return next(new Error('Failed to load Like ' + id));
		req.like = like ;
		next();
	});
};

/**
 * Like authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.like.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
