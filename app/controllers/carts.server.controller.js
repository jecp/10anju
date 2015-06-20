'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cart = mongoose.model('Cart'),
	Good = mongoose.model('Good'),
	_ = require('lodash');

/**
 * Create a Cart
 */
exports.create = function(req, res) {
	var cart = new Cart(req.body);
	cart.user = req.user;

	Good.update({_id:req.body.goods},{$inc:{sold:1}},function (err,next){
		if(err){
			console.log(err);
			return next;
		}
	});

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
 * List of Carts
 */
exports.list = function(req, res) {
	var userId = req.user._id;

	if (userId) {
		Cart.find({user:userId}).sort('-created').populate('goods', 'main_img price spec sale title for_free free_try').exec(function(err, carts) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(carts);
			}
		});
	}
};

/**
 * Cart middleware
 */
exports.cartByID = function(req, res, next, id) { 
	Cart.findById(id).populate('user', 'displayName').populate('goods', 'main_img price spec sale title for_free free_try').exec(function(err, cart) {
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
