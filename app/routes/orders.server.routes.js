'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		orders = require('../../app/controllers/orders.server.controller'),
		alipay = require('../../app/controllers/alipay.server.controller');

	// Orders Routes
	app.route('/orders/count')
		.get(visithistory.vh_log, orders.count);
		
	app.route('/orders')
		.get(users.requiresLogin, visithistory.vh_log, orders.list)
		.post(users.requiresLogin, visithistory.vh_log, orders.create);

	app.route('/orders/:orderId')
		.get(users.requiresLogin, visithistory.vh_log, orders.read)
		.put(users.requiresLogin, visithistory.vh_log, orders.hasAuthorization,  orders.update)
		.delete(users.requiresLogin, visithistory.vh_log, orders.hasAuthorization, orders.delete);

	app.route('/orders/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, orders.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, orders.modify);

	app.route('/orders_goods')
		.post(users.requiresLogin, visithistory.vh_log, orders.changeAmount);

	app.route('/orders_goods_delete')
		.post(users.requiresLogin, visithistory.vh_log, orders.deleteGoods);

	app.route('/order_submit')
		.post(users.requiresLogin, visithistory.vh_log, alipay.alipayto);

	app.route('/payreturn')
		.get(users.requiresLogin, visithistory.vh_log, orders.payreturn);

	app.route('/paynotify')
		.get(users.requiresLogin, visithistory.vh_log, alipay.paynotify);

	app.route('/order_buy_list')
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, orders.buy_list);

	// Finish by binding the Order middleware
	app.param('orderId', orders.orderByID);
};
