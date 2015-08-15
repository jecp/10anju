'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Subject = mongoose.model('Subject'),
	Forum = mongoose.model('Forum'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Subject
 */
exports.create = function(req, res) {
	var subject = new Subject(req.body);
	subject.user = req.user;
	subject.updated = subject.created = Date.now();
	console.log('body'+ req.body.forum);

	if (req.body.forum){
		subject.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(subject);
				User.findOneAndUpdate({_id:req.user._id},{$push:{subject:subject._id}},function (err){
					if (err) {console.log(err);} 
				});
				Forum.findOneAndUpdate({_id:req.body.forum},{$inc:{pv:1},$push:{subject:subject._id}},function (err){
					if (err) {console.log(err);} 
				});
			}
		});		
	}
};

/**
 * Show the current Subject
 */
exports.read = function(req, res) {
	res.jsonp(req.subject);
};

/**
 * Update a Subject
 */
exports.update = function(req, res) {
	var subject = req.subject,
		_updated = Date.now(),
		_content = req.body.content;

	Subject.findOneAndUpdate({_id:req.subject._id},{updated:_updated,content:_content},function (err,subject){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.send(subject);
		}
	});
};


/**
 * Like a Subject
 */
exports.like = function(req, res) {
	var subjectId = req.body._id;
	if (req.user._id){
		User.findOne({_id:req.user._id, subjects_like:subjectId}, function (err,user){
			if (err) {console.log(err);} 
			else if(user){
				Subject.findOneAndUpdate({_id:subjectId},{$inc:{like:-1}}).exec(function (err,subject){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						user.update({$pull:{subjects_like:subjectId}}).exec(function (err,user){
							if (err){console.log(err);}
							else {
								res.send(subject);
							}
						});
					}
				});				
			}
			else {
				Subject.findOneAndUpdate({_id:subjectId},{$inc:{like:1}}).exec(function (err,subject){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						User.findOneAndUpdate({_id:req.user._id},{$push:{subjects_like:subjectId}}).exec(function (err,user){
							if (err){console.log(err);}
							else {
								res.send(subject);
							}
						});
					}
				});				
			}
		});
	}
};



/**
 * Delete an Subject
 */
exports.delete = function(req, res) {
	var subject = req.subject ;

	subject.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subject);
		}
	});
};

/**
 * List of Subjects
 */
exports.list = function(req, res) { 
	Subject.find().sort('-created').populate('user', 'username avatar').exec(function(err, subjects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subjects);
		}
	});
};

/**
 * Modify a Subject
 */
exports.modify = function(req, res) {
	var subjectObj = req.body;
	Subject.findOneAndUpdate({_id:subjectObj._id},{subcat:subjectObj.subcat,name:subjectObj.name,title:subjectObj.title,price:subjectObj.price},function (err,subject) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subject);
		}
	});
};

/**
 * Subject middleware
 */
exports.subjectByID = function(req, res, next, id) { 
	Subject.update({_id:id},{$inc:{pv:1}},function(err,next){
	  if(err){
	  	console.log(err);
	    return next;
	  }
	});
	Subject.findById(id).populate('user', 'username avatar created').populate('forum','name title').populate('comment', 'created').exec(function(err, subject) {
		if (err) return next(err);
		if (! subject) return next(new Error('Failed to load Subject ' + id));
		req.subject = subject ;
		next();
	});
};

/**
 * Subject authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.subject.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
