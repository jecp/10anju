'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		goods = require('../../app/controllers/goods.server.controller');

	// Goods Routes
	app.route('/goods/total')
		.get(visithistory.vh_log, goods.list);

	app.route('/goods')
		.get(visithistory.vh_log, goods.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, goods.create);

	app.route('/goods/edit')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, goods.edit);

	app.route('/goods/:goodId')
		.get(visithistory.vh_log, goods.read)
		.put(users.requiresLogin, visithistory.vh_log, users.adminRequired, goods.update)
		.delete(users.requiresLogin, visithistory.vh_log, users.adminRequired, goods.delete);

	app.route('/goods_like')
		.post(users.requiresLogin, visithistory.vh_log, goods.like);

	app.route('/goods/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, goods.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, goods.modify)
		.delete(users.requiresLogin, visithistory.vh_log, users.adminRequired, goods.delete);

	app.route('/goods/admin/delete')
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, goods.del);

	app.route('/search').post(visithistory.vh_log, goods.results);
	app.route('/goodGDS').get(visithistory.vh_log, goods.GDSresult);
	app.route('/goodSame').get(visithistory.vh_log, goods.findSame);

	// Finish by binding the Good middleware
	app.param('goodId', goods.goodByID);
};
