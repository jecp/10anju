'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var orders = require('../../app/controllers/orders.server.controller');

	// Orders Routes
	app.route('/orders')
		.get(users.requiresLogin, orders.list)
		.post(users.requiresLogin, orders.create);

	app.route('/orders/:orderId')
		.get(orders.read)
		.put(users.requiresLogin, orders.hasAuthorization,  users.adminRequired, orders.update)
		.delete(users.requiresLogin, orders.hasAuthorization, orders.delete);

	app.route('/orders_goods')
		.post(users.requiresLogin, orders.changeAmount);

	app.route('/orders_goods_delete')
		.post(users.requiresLogin, orders.deleteGoods);

	// Finish by binding the Order middleware
	app.param('orderId', orders.orderByID);
};
