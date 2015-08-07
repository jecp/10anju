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
exports.create = function(req, res) {
	if(req.body){
		if (req.body.articleObj){
			Collect.findOne({user:req.user._id,article:req.body.articleObj._id}).exec(function (err,collect){
			if(err){console.log(err);}
			else if(collect){
				Collect.findOneAndUpdate({_id:collect._id},{$pull:{article:req.body.articleObj._id}},function (err,cb){
					if(err){console.log(err);}
					else {
						res.send(collect);
						Article.findOneAndUpdate({_id:req.body.articleObj._id},{$inc:{collect:-1}},function (err){
							if(err){console.log(err);}
						});
					}
				});
			}else {
				Collect.findOne({user:req.user._id}).exec(function (err,collect){
					if(err){console.log(err);}

					else if(collect){
						Collect.findOneAndUpdate({_id:collect._id},{$push:{article:req.body.articleObj._id}},function (err,cb){
							if(err){console.log(err);}
							else {
								res.send(collect);
								Article.findOneAndUpdate({_id:req.body.articleObj._id},{$inc:{collect:1}},function (err){
									if(err){console.log(err);}
								});
							}
						});
					} else {
						var _collect = new Collect(req.body);
						_collect.user = req.user;
						_collect.article = req.body.articleObj._id;

						_collect.save(function (err,collect) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								User.findOneAndUpdate({_id:req.user._id},{collect:collect._id},function (err){
									if (err) {console.log(err);} 
								});
								Article.findOneAndUpdate({_id:req.body.articleObj._id},{$inc:{collect:1}},function (err){
									if(err){console.log(err);}
								});
								res.send(collect);
							}
						});
					}
				});
			}
		});
		} else if (req.body.goodObj){
			Collect.findOne({user:req.user._id,good:req.body.goodObj._id}).exec(function (err,collect){
				if(err){console.log(err);}

				else if(collect){
					Collect.findOneAndUpdate({_id:collect._id},{$pull:{good:req.body.goodObj._id}},function (err,cb){
						if(err){console.log(err);}
						else {
							res.send(collect);
							Good.findOneAndUpdate({_id:req.body.goodObj._id},{$inc:{collect:-1}},function (err){
								if(err){console.log(err);}
							});
						}
					});
				}else {
					Collect.findOne({user:req.user._id}).exec(function (err,collect){
						if(err){console.log(err);}

						else if(collect){
							Collect.findOneAndUpdate({_id:collect._id},{$push:{good:req.body.goodObj._id}},function (err,cb){
								if(err){console.log(err);}
								else {
									res.send(collect);
									Good.findOneAndUpdate({_id:req.body.goodObj._id},{$inc:{collect:1}},function (err){
										if(err){console.log(err);}
									});
								}
							});
						} else {
							var _collect = new Collect(req.body);
							_collect.user = req.user;
							_collect.good = req.body.goodObj._id;

							_collect.save(function (err,collect) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									User.findOneAndUpdate({_id:req.user._id},{collect:collect._id},function (err){
										if (err) {console.log(err);} 
									});
									Good.findOneAndUpdate({_id:req.body.goodObj._id},{$inc:{collect:1}},function (err){
										if(err){console.log(err);}
									});
									res.send(collect);
								}
							});
						}
					});
				}
			});
		} else if (req.body.subjectObj){
			Collect.findOne({user:req.user._id,subject:req.body.subjectObj._id}).exec(function (err,collect){
				if(err){console.log(err);}

				else if(collect){
					Collect.findOneAndUpdate({_id:collect._id},{$pull:{subject:req.body.subjectObj._id}},function (err,cb){
						if(err){console.log(err);}
						else {
							res.send(collect);
							Subject.findOneAndUpdate({_id:req.body.subjectObj._id},{$inc:{collect:-1}},function (err){
								if(err){console.log(err);}
							});
						}
					});
				}else {
					Collect.findOne({user:req.user._id}).exec(function (err,collect){
						if(err){console.log(err);}

						else if(collect){
							Collect.findOneAndUpdate({_id:collect._id},{$push:{subject:req.body.subjectObj._id}},function (err,cb){
								if(err){console.log(err);}
								else {
									res.send(collect);
									Subject.findOneAndUpdate({_id:req.body.subjectObj._id},{$inc:{collect:1}},function (err){
										if(err){console.log(err);}
									});
								}
							});
						} else {
							var _collect = new Collect(req.body);
							_collect.user = req.user;
							_collect.subject = req.body.subjectObj._id;

							_collect.save(function (err,collect) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									User.findOneAndUpdate({_id:req.user._id},{collect:collect._id},function (err){
										if (err) {console.log(err);} 
									});
									Subject.findOneAndUpdate({_id:req.body.subjectObj._id},{$inc:{collect:1}},function (err){
										if(err){console.log(err);}
									});
									res.send(collect);
								}
							});
						}
					});
				}
			});
		}
	}
};

		// var x,y,z;
		// if (req.body.articleObj){
		// 	x = 'article';
		// 	y = req.body.articleObj._id;
		// 	z = 'Article';
		// } else if (req.body.goodObj){
		// 	x = 'good';
		// 	y = req.body.goodObj._id;
		// 	z = 'Good';
		// } else if (req.body.subjectObj){
		// 	x = 'subject';
		// 	y = req.body.subjectObj._id;
		// 	z = Subject;
		// }

		// Collect.findOne({user:req.user._id,x:y._id}).exec(function (err,collect){
		// 	if(err){console.log(err);}

		// 	else if(collect){
		// 		console.log(collect);
		// 		Collect.findOneAndUpdate({_id:collect._id},{$pull:{x:y._id}},function (err,cb){
		// 			if(err){console.log(err);}
		// 			else {
		// 				res.send(collect);
		// 				z.findOneAndUpdate({_id:y._id},{$inc:{collect:-1}},function (err){
		// 					if(err){console.log(err);}
		// 				});
		// 			}
		// 		});
		// 	}else {
		// 		var _collect = new Collect(req.body);
		// 		_collect.user = req.user;
		// 		console.log(x);
		// 		console.log(y);
		// 		console.log(_collect.x);
		// 		// console.log(_collect.x.push(y));

		// 		// _collect.x.push = _collect.x.push(y);
				

		// 		_collect.save(function (err,collect) {
		// 			if (err) {
		// 				return res.status(400).send({
		// 					message: errorHandler.getErrorMessage(err)
		// 				});
		// 			} else {
		// 				User.findOneAndUpdate({_id:req.user._id},{collect:collect._id},function (err,collect){
		// 					if (err) {console.log(err);} 
		// 				});
		// 				z.findOneAndUpdate({_id:y},{$inc:{collect:1}},function (err){
		// 					if(err){console.log(err);}
		// 				});
		// 				console.log(collect);
		// 			}
		// 			Collect.findOneAndUpdate({_id:collect._id},{$push:{x:y}},function (err,doc){
		// 				if(err){console.log(err);}
		// 				else {
		// 					console.log('x:'+x+',y:'+y);
		// 					console.log(doc);
		// 					res.send(doc);
		// 				}
		// 			});
		// 		});
		// 	}
		// });

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
 *  My Collects
 */
exports.mycollect = function (req,res){
	Collect.findOne({_id:req.body.collect},function (err,collect) {
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
	Collect.findById(id).populate('user', 'displayName').exec(function(err, collect) {
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
