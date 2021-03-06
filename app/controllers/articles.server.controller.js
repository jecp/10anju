'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Article'),
	Like = mongoose.model('Like'),
	_ = require('lodash'),
	markdown = require('markdown').markdown;

/**
 * Create a article
 */
exports.create = function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;
	article.tags = req.body.tags ? req.body.tags.split(',') : '';
	article.content = req.body.content ? markdown.toHTML(req.body.content) : '';
	article.markdown = req.body.content;

	article.save(function (err,article) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var article = req.article;
	article = _.extend(article, req.body);
	article.content = markdown.toHTML(req.body.markdown);

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	if (_.has(req.query,'subcat')){
		Article.find({subcat:req.query.subcat}).sort('-created').exec(function(err, articles) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				return res.send(articles);
			}
		});
	} else{
		Article.find().sort('-created').populate('user', 'username').exec(function(err, articles) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(articles);
			}
		});
	}
};

/**
 * Modify a Article
 */
exports.modify = function(req, res) {
	var articleObj = req.body;
	Article.findById(req.body._id,function (err,article){
		if(err){console.log(err);}
		var user = article.user;
		articleObj = _.extend(article,articleObj);
		articleObj.user = null;
		articleObj.user = user;
		articleObj.save(function (err,article){
			if(err){console.log(err);}
			res.send(article);
		});		
	});
};

/**
 * Like a Article
 */
exports.like = function(req, res) {
	var articleId = req.body._id;
	if (req.user._id){
		Like.findOne({user:req.user._id,article:articleId}, function (err,like){
			if (err) {console.log(err);} 
			else if(like){
				Article.findOneAndUpdate({_id:articleId},{$inc:{like:-1}}).exec(function (err,article){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						like.update({$pull:{article:articleId}}).exec(function (err,like){
							if (err){console.log(err);}
							else {
								res.send(article);
							}
						});
					}
				});				
			}
			else {
				Article.findOneAndUpdate({_id:articleId},{$inc:{like:1}}).exec(function (err,article){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						Like.findOneAndUpdate({user:req.user._id},{$push:{article:articleId}}).exec(function (err,like){
							if (err){console.log(err);}
							else {
								res.send(article);
							}
						});
					}
				});				
			}
		});
	}
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
	Article.update({_id:id},{$inc:{pv:1}},function(err,next){
	  if(err){
	  	console.log(err);
	    return next;
	  }
	});
	Article.findById(id).populate('user', 'username').exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));
		req.article = article;
		next();
	});
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
