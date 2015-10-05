'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
 	errorHandler = require('./errors.server.controller'),
 	Cart = mongoose.model('Cart'),
 	Subject = mongoose.model('Subject'),
 	Article = mongoose.model('Article'),
 	Good = mongoose.model('Good'),
 	User = mongoose.model('User'),
 	Order = mongoose.model('Order'),
 	Porder = mongoose.model('Porder'),
 	Ccenter = mongoose.model('Ccenter'),
 	Comment = mongoose.model('Comment'),
 	Visithistory = mongoose.model('Visithistory'),
 	//_ = require('lodash'),
 	request = require('request'),
 	fs = require('fs');
 	// node_xj = require('xls-to-json');

/**
 * Index.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

/**
 * member-rights.
 */
exports.member_rights = function(req, res) {
	res.render('static/member-rights', {
		user: req.user || null,
		request: req
	});
};

/**
 * about.
 */
exports.about = function(req, res) {
	res.render('static/css3', {
		user: req.user || null,
		request: req
	});
};

/**
 *  Data Summary.
 */
exports.summary = function(req, res) {
	var goodsCount,
		cartsCount,
		ordersCount,
		pordersCount,
		ccentersCount,
		usersCount,
		fusersCount,
		subjectsCount,
		commentsCount,
		articlesCount,
		visithistorysCount;

	Good.count(function(err, goods) {
		if (!err) goodsCount = goods;
		Cart.count(function(err, carts) {
			if (!err)cartsCount = carts;
			Order.count(function(err, orders) {
				if (!err) ordersCount = orders;
				Porder.count(function(err, porders) {
					if (!err)pordersCount = porders;
					Ccenter.count(function(err, ccenters) {
						if (!err) ccentersCount = ccenters;
						User.count(function(err, users) {
							if (!err) usersCount = users;
							User.count(function(err, fusers) {
								if (!err)fusersCount = fusers;
								Subject.count(function(err, subjects) {
									if (!err)subjectsCount = subjects;
									Comment.count(function(err, comments) {
										if (!err) commentsCount = comments;
										Article.count(function(err, articles) {
											if (!err) articlesCount = articles;
											Visithistory.count(function(err, visithistorys) {
												if (!err) visithistorysCount = visithistorys;
												var summary = {
													goodsCount:goodsCount,
													cartsCount:cartsCount,
													ordersCount:ordersCount,
													pordersCount:pordersCount,
													ccentersCount:ccentersCount,
													usersCount:usersCount,
													fusersCount:fusersCount,
													subjectsCount:subjectsCount,
													commentsCount:commentsCount,
													articlesCount:articlesCount,
													visithistorysCount:visithistorysCount
													};
												res.send(summary);
											});
										});
									});
								});
							});							
						});						
					});
				});
			});
		});
	});	
};

/**
 * today weather api.
 */
/*exports.test = function(req, res) {
	// var txt='hello,world,你好。'
	// fs.writeFile('a.txt',txt,function (err){
	// 	if(err) {console.log(err);}
	// 	console.log('saved');
	// });
	node_xj({
		input:'全店商品资料.xls',
		output:'out.json',
		sheet:'sheetname',
	}, function(err,result){
		if(err){console.log(err);}
		else{
			console.log(result);
		}
	});

};*/
