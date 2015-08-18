'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cart = mongoose.model('Cart'),
	Category = mongoose.model('Category'),
	Good = mongoose.model('Good'),
	_ = require('lodash');
/**
 * Create a Cart
 */
exports.create = function(req, res) {
	var sgoods = req.body.detail.goods;
	var sprice = req.body.detail.price;
	var _total = req.body.total;
	var _goods = {
			goods:sgoods,
			amount:1,
			price:sprice,
		};
	if (sgoods){
		Cart.findOne({user:req.user,day:req.body.day,order_status:false,'detail.goods':sgoods},function(err,cart){
			if (err){console.log(err);}
			else if(cart){
				var i = cart.detail.length;
				while(i--){
					if (sgoods.toString() === cart.detail[i].goods.toString()){
						cart.detail[i].amount += 1;
						cart.total += sprice;
					}
				}
				if (i){				
					cart.save(function (err,cart){
						if (err){console.log(err);}
						else {
							res.send(cart);
						}
					});
				} else {
					cart.update({$push:{detail:_goods},$inc:{total:_total}},function (err,cart){
						res.send(cart);
					});
				}
			} else{
				Cart.findOneAndUpdate({user:req.user,day:req.body.day,order_status:false},{$push:{detail:_goods},$inc:{total:_total}},function (err,cart){
					if(err){console.log(err);}
					else if(cart){
						res.send(cart);
					}
					else {
						var _cart = new Cart(req.body);
						_cart.user = req.user;
						_cart.detail = _goods;
						_cart.save(function (err,cart) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								res.send(cart);
							}
						});
					}
				});
			}
		});
	}
};

/**
 * Show the current Cart
 */
exports.read = function(req, res) {
	res.jsonp(req.cart);
};

/**
 * Update a Cart
 */
exports.update = function(req, res) {
	var cart = req.cart ;

	cart = _.extend(cart , req.body);

	cart.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cart);
		}
	});
};

/**
 * Change the goods total in cart
 */
exports.changeAmount = function(req, res) {
	Cart.findOne({_id:req.body.cart._id},function (err,cart) {

		var i = cart.detail.length;
		while(i--){
			if (req.body.goodId.toString() === cart.detail[i].goods.toString()){
				cart.total += cart.detail[i].price * (req.body.cart_amount-cart.detail[i].amount);
				cart.detail[i].amount = req.body.cart_amount;
			}
		}			
		cart.save(function (err,cart){
			if (err){console.log(err);}
			else {
				res.jsonp(cart);
			}
		});
	});
};

/**
 * Delete an Cart
 */
exports.delete = function(req, res) {
	var cart = req.cart ;

	cart.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cart);
		}
	});
};

/**
 * Delete an Cart.goods
 */
exports.deleteGoods = function(req, res) {
	var _total, goodObj;
	Cart.findOne({_id:req.body.cart._id,'detail.goods':req.body.goodId._id},function (err,cart){

		var i = cart.detail.length;
		if (i > 1){
			while (i--){
				if(req.body.goodId._id.toString() === cart.detail[i].goods.toString()){
					goodObj = cart.detail[i];
					_total = cart.detail[i].price * cart.detail[i].amount;
				}
			}
			Cart.findOneAndUpdate({_id:req.body.cart._id},{$pull:{detail:goodObj},$inc:{total:-_total}},function (err,cart){
				if(err){console.log(err);}
				else {
					res.send(cart);
				}
			});
		} else {
			Cart.remove({_id:req.body.cart._id},function (err){
				if (err){console.log(err);}
				else {
					res.send('delete success');
				}
			});
		}
	});
};

/**
 * List of Carts
 */
exports.list = function(req, res) {
	if (req.user) {
		var userId = req.user._id;

		if (userId) {
			Cart.find({user:userId}).sort('-created').populate('detail.goods', 'category subcat main_img price spec weight origin delivery sale name title for_free free_try sold pv').exec(function(err, carts) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(carts);
				}
			});
		}
	}
};

/**
 * Modify a Cart
 */
exports.modify = function(req, res) {
	var cartObj = req.body;
	Cart.findOneAndUpdate({_id:cartObj._id},{subcat:cartObj.subcat,name:cartObj.name,title:cartObj.title,price:cartObj.price},function (err,cart) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cart);
		}
	});
};

/**
 * Cart middleware
 */
exports.cartByID = function(req, res, next, id) { 
	Cart.findById(id).populate('user', 'displayName').populate('detail.goods', 'main_img price spec sale title for_free free_try').exec(function(err, cart) {
		if (err) return next(err);
		if (! cart) return next(new Error('Failed to load Cart ' + id));
		req.cart = cart ;
		next();
	});
};

/**
 * Cart authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.cart.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
