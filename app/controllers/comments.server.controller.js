'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Comment = mongoose.model('Comment'),
	Subject = mongoose.model('Subject'),
	Article = mongoose.model('Article'),
	User = mongoose.model('User'),
	_ = require('lodash'),
	markdown = require('markdown').markdown;

/**
 * Create a Comment
 */
exports.create = function(req, res) {
	var obj = req.body.obj;

	var comment = new Comment(req.body);
	comment.user = req.user;
	comment.content = req.body.content ? markdown.toHTML(req.body.content) : '';
	comment.markdown = req.body.content;

	if (obj === 'articles'){
		comment.articles = req.body.value;
		comment.save(function (err,comment) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.send(comment);
			}
		});
	} else if(obj === 'subjects'){
		comment.subjects = req.body.value;
		comment.save(function (err,comment) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.send(comment);
				Subject.findOneAndUpdate({_id:req.body.value},{$inc:{pv:1},$push:{comment:comment._id}},function (err){
					if (err) {console.log(err);} 
				});
			}
		});
	}
};

/**
 * Show the current Comment
 */
exports.read = function(req, res) {
	res.jsonp(req.comment);
};

/**
 * Update a Comment
 */
exports.update = function(req, res) {
	var comment = req.comment ;

	comment = _.extend(comment , req.body);

	comment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	});
};

/**
 * Delete an Comment
 */
exports.delete = function(req, res) {
	var comment = req.comment ;

	comment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	});
};

/**
 * List of Comments
 */
exports.list = function(req, res) {
	var obj = req.query.obj;
	if (obj === 'articles'){
		Comment.find({articles:req.query.value}).sort('created').populate('user', 'username avatar created').exec(function(err, comments) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(comments);
			}
		});
	}else if(obj === 'subjects'){
		Comment.find({subjects:req.query.value}).sort('created').populate('user', 'username avatar created').exec(function(err, comments) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(comments);
			}
		});
	}else {
		Comment.find().sort('-created').populate('user','username').populate('subjects','title').populate('articles','title').populate('goods','title').exec(function (err,comments){
			if(err){console.log(err);}
			res.send(comments);
		});
	}
};

/**
 * Count of Comments
 */
exports.count = function(req, res) {
	Comment.count().exec(function(err, comments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(comments);
		}
	});
};

/**
 *  count of User comments 
 */
exports.userCount = function (req,res){

	Comment.count({user:req.user._id}, function (err,count){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(count);
		}
	});
};

/**
 * Modify a Comment
 */
exports.modify = function(req, res) {
	var commentObj = req.body;
	Comment.findOneAndUpdate({_id:commentObj._id},{subcat:commentObj.subcat,name:commentObj.name,title:commentObj.title,price:commentObj.price},function (err,comment) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	});
};

/**
 * Comment middleware
 */
exports.commentByID = function(req, res, next, id) { 
	Comment.findById(id).populate('user', 'displayName').exec(function(err, comment) {
		if (err) return next(err);
		if (! comment) return next(new Error('Failed to load Comment ' + id));
		req.comment = comment ;
		next();
	});
};

/**
 * Comment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.comment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
