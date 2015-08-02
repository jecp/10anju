'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Order = mongoose.model('Order'),
	Cart = mongoose.model('Cart'),
	Good = mongoose.model('Good'),
	_ = require('lodash');

/**
 * Create a Order
 */
exports.create = function(req, res) {
	var order = new Order(req.body);
	var order_detail = new Array();
	var _;

	if (req.body.detail){// If come from cart, change to order
		for (var i =0; i < req.body.detail.length; i++){
			_ = req.body.detail[i];
			order_detail.push({goods:_.goods._id,amount:_.amount,price:_.price});
		}
		
		Good.update({_id:_.goods._id},{$inc:{sold:1}},function(err){
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
		order.detail = order_detail;
		order.user = req.user;

		order.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(order);
			}
		});
	}
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
	Order.findOne({_id:req.body.order._id},function (err,order) {

		var i = order.detail.length;
		while(i--){
			if (req.body.goodId.toString() === order.detail[i].goods.toString()){
				order.total += order.detail[i].price * (req.body.order_amount-order.detail[i].amount);
				order.detail[i].amount = req.body.order_amount;
			}
		}			
		order.save(function (err,order){
			if (err){console.log(err);}
			else {
				res.jsonp(order);
			}
		});
	});
};


/**
 * Delete an Order.goods
 */
exports.deleteGoods = function(req, res) {
	Order.findOne({_id:req.body.order._id,'detail.goods':req.body.goodId._id},function (err,order){

		var i = order.detail.length;
		while(i--){
			if (req.body.goodId._id.toString() === order.detail[i].goods.toString()){
				// order.detail.slice(i,1);
				order.detail.pull(order.detail[i]);
				order.total -= req.body.total;
			}
		}
		order.save(function (err,order){
			if (err) {console.log(err);}
			else{
				res.send(order);
			}
		});		
	});
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) { 
	Order.findById(id).populate('user', 'displayName username mobile ccenter.name ccenter.detail').populate('detail.goods','main_img title name amount price for_free free_try').populate('user.ccenter','province city district street detail').exec(function(err, order) {
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
