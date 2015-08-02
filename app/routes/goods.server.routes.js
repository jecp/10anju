'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var goods = require('../../app/controllers/goods.server.controller');

	// Goods Routes
	app.route('/goods')
		.get(goods.list)
		.post(users.requiresLogin, users.adminRequired, goods.create);

	app.route('/goods/:goodId')
		.get(goods.read)
		.put(users.requiresLogin, users.adminRequired, goods.update)
		.delete(users.requiresLogin, users.adminRequired, goods.delete);

	app.route('/goods_like')
		.post(users.requiresLogin, goods.like);

	// Finish by binding the Good middleware
	app.param('goodId', goods.goodByID);
};
