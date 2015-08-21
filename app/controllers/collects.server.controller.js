'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Collect = mongoose.model('Collect'),
	Subject = mongoose.model('Subject'),
	Article = mongoose.model('Article'),
	Good = mongoose.model('Good'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Collect
 */
exports.create = function (req,res) {

	var obj = req.body.obj,
		value = req.body.value,
		userId = req.user._id;
		
	if (obj === 'goods'){
		Collect.findOne({user:userId,goods:value},function (err,collect){
			if(err){console.log(err);}
			else if(collect){
				Collect.findOneAndUpdate({_id:collect._id},{$pull:{goods:value}},function (err){
					if(err){console.log(err);}
				});
				Good.findOneAndUpdate({_id:value},{$inc:{collect:-1}},function (err,good){
					if(err){console.log(err);}
					return res.send(good);
				});
			}
			else{
				Collect.findOne({user:userId},function (err,collect){
					if(err){console.log(err);}
					else if(collect){
						Collect.findOneAndUpdate({_id:collect._id},{$push:{goods:value}},function (err){
							if(err){console.log(err);}
						});
						Good.findOneAndUpdate({_id:value},{$inc:{collect:1}},function (err,good){
							if(err){console.log(err);}
							return res.send(good);
						});
					}
					else{
						var _collect = new Collect(req.body);
						_collect.user = req.user;
						_collect.goods = value;
						_collect.save(function (err,collect){
							if(err){console.log(err);}
							User.findOneAndUpdate({_id:userId},{collect:collect._id},function (err){
								if (err) {console.log(err);} 
							});							
							Good.findOneAndUpdate({_id:value},{$inc:{collect:1}},function (err,good){
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
		Collect.findOne({user:userId,subjects:value},function (err,collect){
			if(err){console.log(err);}
			else if(collect){
				Collect.findOneAndUpdate({_id:collect._id},{$pull:{subjects:value}},function (err){
					if(err){console.log(err);}
				});
				Subject.findOneAndUpdate({_id:value},{$inc:{collect:-1}},function (err,subject){
					if(err){console.log(err);}
					return res.send(subject);
				});
			}
			else{
				Collect.findOne({user:userId},function (err,collect){
					if(err){console.log(err);}
					else if(collect){
						Collect.findOneAndUpdate({_id:collect._id},{$push:{subjects:value}},function (err){
							if(err){console.log(err);}
						});
						Subject.findOneAndUpdate({_id:value},{$inc:{collect:1}},function (err,subject){
							if(err){console.log(err);}
							return res.send(subject);
						});
					}
					else{
						var _collect = new Collect(req.body);
						_collect.user = req.user;
						_collect.subjects = value;
						_collect.save(function (err,collect){
							if(err){console.log(err);}
							else{
								User.findOneAndUpdate({_id:userId},{collect:collect._id},function (err,user){
									if (err) {console.log(err);}
								});							
								Subject.findOneAndUpdate({_id:value},{$inc:{collect:1}},function (err,subject){
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
		Collect.findOne({user:userId,articles:value},function (err,collect){
			if(err){console.log(err);}
			else if(collect){
				Collect.findOneAndUpdate({_id:collect._id},{$pull:{articles:value}},function (err){
					if(err){console.log(err);}
				});
				Article.findOneAndUpdate({_id:value},{$inc:{collect:-1}},function (err,article){
					if(err){console.log(err);}
					return res.send(article);
				});
			}
			else{
				Collect.findOne({user:userId},function (err,collect){
					if(err){console.log(err);}
					else if(collect){
						Collect.findOneAndUpdate({_id:collect._id},{$push:{articles:value}},function (err){
							if(err){console.log(err);}
						});
						Article.findOneAndUpdate({_id:value},{$inc:{collect:1}},function (err,article){
							if(err){console.log(err);}
							return res.send(article);
						});
					}
					else{
						var _collect = new Collect(req.body);
						_collect.user = req.user;
						_collect.articles = value;
						_collect.save(function (err,collect){
							if(err){console.log(err);}
							User.findOneAndUpdate({_id:userId},{collect:collect._id},function (err){
								if (err) {console.log(err);} 
							});							
							Article.findOneAndUpdate({_id:value},{$inc:{collect:1}},function (err,article){
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
 * Show the current Collect
 */
exports.read = function(req, res) {
	res.jsonp(req.collect);
};

/**
 * Update a Collect
 */
exports.update = function(req, res) {
	var collect = req.collect ;

	collect = _.extend(collect , req.body);

	collect.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(collect);
		}
	});
};

/**
 * Delete an Collect
 */
exports.delete = function(req, res) {
	var collect = req.collect ;

	collect.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(collect);
		}
	});
};

/**
 * List of Collects
 */
exports.list = function(req, res) { 
	Collect.find().sort('-created').populate('user', 'displayName').exec(function(err, collects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(collects);
		}
	});
};

/**
 * Modify a Collect
 */
exports.modify = function(req, res) {
	var collectObj = req.body;
	Collect.findOneAndUpdate({_id:collectObj._id},{subcat:collectObj.subcat,name:collectObj.name,title:collectObj.title,price:collectObj.price},function (err,collect) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(collect);
		}
	});
};

/**
 *  My Collects
 */
exports.mycollect = function (req,res){
	Collect.findOne({_id:req.body.collect}).populate('goods','title main_img like pv sold collect subcat created price summary detail').populate('subjects', 'title subcat forum comment content created pv like collect user').populate('articles','title pv like collect content user subcat').exec(function (err,collect) {
		if (err){console.log(err);}
		else {
			res.send(collect);
		}
	});
};

/**
 * Collect middleware
 */
exports.collectByID = function(req, res, next, id) { 
	Collect.findById(id).populate('user', 'username avatar').populate('subject', 'title subcat forum comments user').exec(function(err, collect) {
		if (err) return next(err);
		if (! collect) return next(new Error('Failed to load Collect ' + id));
		req.collect = collect ;
		next();
	});
};

/**
 * Collect authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.collect.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
