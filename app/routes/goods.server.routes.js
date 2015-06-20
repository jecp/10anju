'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var goods = require('../../app/controllers/goods.server.controller');

	// Goods Routes
	app.route('/goods')
		.get(goods.list)
		.post(users.requiresLogin, goods.create);

	app.route('/goods/:goodId')
		.get(goods.read)
		.put(users.requiresLogin, goods.hasAuthorization, goods.update)
		.delete(users.requiresLogin, goods.hasAuthorization, goods.delete);

	// Finish by binding the Good middleware
	app.param('goodId', goods.goodByID);
};
