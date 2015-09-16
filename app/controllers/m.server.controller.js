'use strict';

/**
 * Module dependencies.
 */
var // mongoose = require('mongoose'),
 	errorHandler = require('./errors.server.controller'),
 	// Cart = mongoose.model('Cart'),
 	// Subject = mongoose.model('Subject'),
 	// Article = mongoose.model('Article'),
 	// Good = mongoose.model('Good'),
 	// User = mongoose.model('User'),
 	// Order = mongoose.model('Order'),
 	// Porder = mongoose.model('Porder'),
 	// Ccenter = mongoose.model('Ccenter'),
 	// Comment = mongoose.model('Comment'),
 	// Visithistory = mongoose.model('Visithistory'),
 	request = require('request'),
 	swig = require('swig');

/**
 * Index.
 */
exports.index = function(req, res) {

	console.log(typeof req.user);
	// var template = swig.compile('<p>{% block content %}</p>',{user:req.user});
	// var renderedHtml = template({goods:'111'});
	// console.log(renderedHtml);
/*
	request('http://127.0.0.1:3300/goods',function (err,resp,body){
		if(err){console.log(err);}
		console.log(body);
		// var goods = JSONArray.fromObject(body);
		console.log(typeof body);
		// var a = template.render({goods:'111'})
		// console.log(a);

		// renderedHtml = template({
		// 	title:'hello',
		// 	goods:[goods]
		// });
		// console.log(renderedHtml);

		// res.end(renderedHtml);
		// res.send(goodsObj);
		return body;
	});
*/
	
	var url = 'http://127.0.0.1:3300/goods';
	request.get(url,function (err,res,body){
		console.log(res,body);
		return body;
	});
	res.render('mobile/index', {
		user: req.user || null,
		request: req
	});

	// res.send(renderedHtml);
};
