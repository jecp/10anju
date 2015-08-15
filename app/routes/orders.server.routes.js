'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var orders = require('../../app/controllers/orders.server.controller');
	var alipay = require('../../app/controllers/alipay.server.controller');

	// Orders Routes
	app.route('/orders')
		.get(users.requiresLogin, orders.list)
		.post(users.requiresLogin, orders.create);

	app.route('/orders/:orderId')
		.get(users.requiresLogin, orders.read)
		.put(users.requiresLogin, orders.hasAuthorization,  orders.update)
		.delete(users.requiresLogin, orders.hasAuthorization, orders.delete);

	app.route('/orders/admin/list')
		.get(users.requiresLogin, users.adminRequired, orders.list)
		.post(users.requiresLogin, users.adminRequired, orders.modify);

	app.route('/orders_goods')
		.post(users.requiresLogin, orders.changeAmount);

	app.route('/orders_goods_delete')
		.post(users.requiresLogin, orders.deleteGoods);

	app.route('/order_submit')
		.post(users.requiresLogin, alipay.alipayto);

	app.route('/payreturn')
		.get(users.requiresLogin, alipay.payreturn);

	app.route('/paynotify')
		.get(users.requiresLogin, alipay.paynotify);

	app.route('/order_buy_list')
		.post(users.requiresLogin, users.adminRequired, orders.buy_list);

	// Finish by binding the Order middleware
	app.param('orderId', orders.orderByID);
};
