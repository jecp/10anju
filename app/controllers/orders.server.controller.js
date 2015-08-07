'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Order = mongoose.model('Order'),
	Cart = mongoose.model('Cart'),
	Good = mongoose.model('Good'),
	Ccenter = mongoose.model('Ccenter'),
	_ = require('lodash');
	// alipay = require('./alipay/alipay.config');

/**
 * Create a Order
 */
exports.create = function(req, res) {
	var order = new Order(req.body);
	var order_detail = new Array();
	var _detail;

	if (req.body.detail){// If come from cart, change to order
		for (var i =0; i < req.body.detail.length; i++){
			_detail = req.body.detail[i];
			order_detail.push({goods:_detail.goods._id,amount:_detail.amount,price:_detail.price});
		}
		Good.update({_id:_detail.goods._id},{$inc:{sold:1}},function(err){
			if (err){ console.log(err);}
		});

		// change cart status to true
		Cart.update({_id:req.body.cart},{order_status:true},function(err){
			if (err){console.log(err);}
		});
	} else {
		Good.update({_id:req.body.goods},{$inc:{sold:1}},function(err){
			if (err){ console.log(err);}
		});	
		order_detail.push({goods:req.body.goods,amount:req.body.amount,price:req.body.total});
	}
	// save order
	order.detail = order_detail;
	order.user = req.user;

	order.save(function (err,order) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.send(order);
		}
	});
};

/**
 * Show the current Order
 */
exports.read = function(req, res) {
	res.jsonp(req.order);
};

/**
 * Update a Order
 */
exports.update = function(req, res) {
	var order = req.order ;

	order = _.extend(order , req.body);
	order.updated = Date.now();

	order.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * Delete an Order
 */
exports.delete = function(req, res) {
	var order = req.order ;

	order.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * List of Orders
 */
exports.list = function(req, res) {
	if (req.user){
		var userId = req.user._id;
		if (userId) {
			Order.find({user:userId}).sort('-created').populate('user', 'username').populate('detail.goods', 'main_img title name amount price for_free free_try').exec(function(err, orders) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(orders);
				}
			});
		}
	}
};

/**
 * Change the goods total in cart
 */
exports.changeAmount = function(req, res) {
	var goodId;
	Order.findOne({_id:req.body.order._id},function (err,order) {

		var i = order.detail.length;
		while(i--){
			if (req.body.goodId.toString() === order.detail[i].goods.toString()){
				order.total += order.detail[i].price * (req.body.order_amount-order.detail[i].amount);
				order.detail[i].amount = req.body.order_amount;
				goodId = order.detail[i].goods._id;
			}
		}
		order.updated = Date.now();
		order.save(function (err,order){
			if (err){console.log(err);}
			else {
				Good.update({_id:req.body.goodId},{$inc:{sold:req.body.order_amount-1}},function(err){
					if (err){ console.log(err);}
					else{
						res.send(order);
					}
				});
			}
		});
		Good.findOneAndUpdate({_id:req.body.goods._id},{$inc:{sold:req.body.order_amount}},function (err){
			if(err){console.log(err);}
		});
	});
};


/**
 * Delete an Order.goods
 */
exports.deleteGoods = function(req, res) {
	var _total, goodObj;
	Order.findOne({_id:req.body.order._id,'detail.goods':req.body.goodId._id},function (err,order){

		var i = order.detail.length;
		if (i > 1){
			while (i--){
				if(req.body.goodId._id.toString() === order.detail[i].goods.toString()){
					goodObj = order.detail[i];
					_total = goodObj.price * goodObj.amount;
				}
			}
			Order.findOneAndUpdate({_id:req.body.order._id},{$pull:{detail:goodObj},$inc:{total:-_total},updated:Date.now()},function (err,order){
				if(err){console.log(err);}
				else {
					res.send(order);
				}
			});
			Good.findOneAndUpdate({_id:goodObj._id},{$inc:{sold:-1}},function (err){
				if(err){console.log(err);}
			});
		} else {
			Order.remove({_id:req.body.order._id},function (err){
				if (err){console.log(err);}
				else {
					res.send('delete success');
				}
			});
			Good.findOneAndUpdate({_id:req.body.goodId._id},{$inc:{sold:-1}},function (err){
				if(err){console.log(err);}
			});
		}
	});
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) { 
	Order.findById(id).populate('user', 'displayName username mobile roomNum ccenter').populate('detail.goods','main_img title name amount price for_free free_try').populate('user.ccenter','name detail').exec(function(err, order) {
		if (err) return next(err);
		if (! order) return next(new Error('Failed to load Order ' + id));
		req.order = order ;
		next();
	});
};

/**
 * Order authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.order.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
