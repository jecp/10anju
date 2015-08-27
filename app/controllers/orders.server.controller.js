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

/**
 * Create a Order
 */
exports.create = function(req, res) {
	console.log(req.body);

	if (req.body.detail){
		Order.findOne({user:req.user,cart:req.body.cart,status:false},function (err,order){
			if(err){console.log(err);}
			else if(order){
				return res.status(200).send({
					message: '此购物篮已提交过，不能重复提交〜'
				});
			}
			else{
				Cart.findOneAndUpdate({_id:req.body.cart},{order_status:true},function(err,cart){
					if(err){console.log(err);}
					else {
						var order = new Order(req.body);
						order.user = req.user;
						order.detail = cart.detail;
						order.total_amount = cart.total_amount;
						order.save(function (err,order){
							if(err){console.log(err);}
							else {
								for(var i=0;i<cart.detail.length;i++){
									Good.findOneAndUpdate({_id:cart.detail[i].goods},{$inc:{sold:cart.detail[i].amount}},function (err,good){
										if(err){console.log(err);}
									});
								};
								res.send(order);
							}
						});
					}
				});
			}
		});
	}else{
		Order.findOne({user:req.user,status:false,'detail.goods':req.body.goods},function (err,order){
			if(err){console.log(err);}
			else if(order){
				var i = order.detail.length;
				while(i--){
					if (req.body.goods.toString() === order.detail[i].goods.toString()){
						order.detail[i].amount += 1;
						order.total += order.detail[i].amount*order.detail[i].price;
					}
				}
				if (i){
					order.total_amount = _.sum(order.detail,'amount');
					order.total = _.ceil(order.total,2);
					Good.update({_id:req.body.goods},{$inc:{sold:1}},function(err){
						if (err){ console.log(err);}
					});
					order.save(function (err,order){
						if (err){console.log(err);}
						else {
							res.send(order);
						}
					});
				}
			}
			else{
				Order.findOne({user:req.user,status:false},function (err,order){
					if(err){console.log(err);}
					else if(order){
						Good.update({_id:req.body.goods},{$inc:{sold:1}},function(err){
							if (err){ console.log(err);}
						});
						Order.findOneAndUpdate({_id:order._id},{$push:{detail:{goods:req.body.goods,amount:req.body.amount,price:req.body.price}},$inc:{total:req.body.price,total_amount:req.body.amount}},function (err,order){
							if(err){console.log(err);}
							else{
								console.log(order);
								res.send(order);
							}
						});
					}
					else {
						var order = new Order(req.body);
						order.user = req.user;
						order.detail.push({goods:req.body.goods,amount:req.body.amount,price:req.body.price});
						order.total = req.body.total;
						order.total_amount = req.body.amount;
						Good.update({_id:req.body.goods},{$inc:{sold:1}},function(err){
							if (err){ console.log(err);}
						});
						order.save(function (err,order){
							if(err){console.log(err);}
							else{
								res.send(order);
							}
						});
					}
				});
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
	var userId = req.user._id;
	if (req.user){
		if(_.contains(req.user.roles,'admin')){
			Order.find({}).sort('-created').populate('user', 'username').populate('detail.goods', 'main_img title name amount price for_free free_try').exec(function(err, orders) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(orders);
				}
			});
		}else{
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
 * Count of Orders
 */
exports.count = function(req, res) {
	Order.count().exec(function(err, orders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(orders);
		}
	});
};

/**
 * Modify a Order
 */
exports.modify = function(req, res) {
	var orderObj = req.body;
	Order.findOneAndUpdate({_id:orderObj._id},{subcat:orderObj.subcat,name:orderObj.name,title:orderObj.title,price:orderObj.price},function (err,order) {
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
 * Show buy_list of Orders
 */
exports.buy_list = function(req, res) {
	var userId = req.user._id;
	console.log(Date.now());
	console.log(Date.now);
	console.log(new Date().getDate());
	if (req.user){
		if(_.contains(req.user.roles,'admin')){
			Order.find({}).sort('-created').populate('user', 'username').populate('detail.goods', 'main_img title name amount price for_free free_try').exec(function (err, orders) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else if(orders.length > 0){
					console.log(orders);
					console.log(orders[0].created);
					console.log((Date.now() - orders[0].created - 24 * 60 * 60 * 1000));
					if (Date.now() - orders[0].created < 24 * 60 * 60 * 1000){
						console.log('24小时内，当天订单');
					}else{
						console.log('历史订单');
					}

					var feeArray = _.flatten(orders,'total');
					console.log(feeArray);

					var newOrderArray = _.uniq(orders,'detail');
					console.log('newOrderArray is:'+ newOrderArray);

					var sum = _.reduce(feeArray,function (result,num){

						console.log(result);
						console.log(num);
						return result + num;
					});
					console.log(sum);

					res.jsonp(orders);
				} else{
					console.log(err);
					res.send(err);
				}
			});
		}
	}
};

/**
 * Change the goods total in cart
 */
exports.changeAmount = function(req, res) {
	var _goodId;
	Order.findOne({_id:req.body.order._id},function (err,order) {
		if(err){console.log(err);}
		var i = order.detail.length;
		while(i--){
			if (req.body.goodId.toString() === order.detail[i].goods.toString()){
				order.total += order.detail[i].price * (req.body.order_amount-order.detail[i].amount);
				order.detail[i].amount = req.body.order_amount;
				_goodId = order.detail[i].goods._id;
			}
		}
		var change = req.body.total_amount - order.total_amount;
		order.updated = Date.now();
		order.total_amount = req.body.total_amount;
		order.save(function (err,order){
			if (err){console.log(err);}
			else {
				Good.findOneAndUpdate({_id:req.body.goodId},{$inc:{sold:change}},function (err){
					if (err){ console.log(err);}
					else{
						res.send(order);
					}
				});
			}
		});
		// Good.findOneAndUpdate({_id:req.body.goodId},{$inc:{sold:change}},function (err){
		// 	if(err){console.log(err);}
		// });
	});
};


/**
 * Delete an Order.goods
 */
exports.deleteGoods = function(req, res) {
	var _total, goodObj;
	Order.findOne({_id:req.body.order._id,'detail._id':req.body.goodId._id},function (err,order){
		if(err){console.log(err);}
		else{
			var i = order.detail.length;
			if (i > 1){
				while (i--){
					if(req.body.goodId.goods._id.toString() === order.detail[i].goods.toString()){
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
				Good.findOneAndUpdate({_id:goodObj._id},{$inc:{sold:-goodObj.amount}},function (err){
					if(err){console.log(err);}
				});
			} else {
				Order.remove({_id:req.body.order._id},function (err){
					if (err){console.log(err);}
					else {
						res.send('delete success');
					}
				});
				Good.findOneAndUpdate({_id:req.body.goodId.goods._id},{$inc:{sold:-req.body.goodId.amount}},function (err){
					if(err){console.log(err);}
				});
			}
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
