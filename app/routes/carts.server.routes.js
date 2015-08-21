'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		carts = require('../../app/controllers/carts.server.controller');

	// Carts Routes
	app.route('/carts/count')
		.get(visithistory.vh_log, carts.count);

	app.route('/carts')
		.get(visithistory.vh_log, carts.list)
		.post(users.requiresLogin, visithistory.vh_log, carts.create);

	app.route('/carts/:cartId')
		.get(users.requiresLogin, visithistory.vh_log, carts.hasAuthorization, carts.read)
		.put(users.requiresLogin, visithistory.vh_log, carts.hasAuthorization, carts.update)
		.delete(users.requiresLogin, visithistory.vh_log, carts.hasAuthorization, carts.delete);

	app.route('/carts_goods')
		.post(users.requiresLogin, visithistory.vh_log, carts.changeAmount);

	app.route('/carts_goods_delete')
		.post(users.requiresLogin, visithistory.vh_log, carts.deleteGoods);

	app.route('/carts/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, carts.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, carts.modify);

	// Finish by binding the Cart middleware
	app.param('cartId', carts.cartByID);
};
