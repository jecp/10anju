'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		categories = require('../../app/controllers/categories.server.controller');

	// Categories Routes
	app.route('/categories')
		.get(visithistory.vh_log, categories.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, categories.create);

	app.route('/categories/:categoryId')
		.get(visithistory.vh_log, categories.read)
		.put(users.requiresLogin, visithistory.vh_log, categories.hasAuthorization, users.adminRequired, categories.update)
		.delete(users.requiresLogin, visithistory.vh_log, categories.hasAuthorization, users.adminRequired, categories.delete);

	app.route('/categories/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, categories.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, categories.modify);

	// Finish by binding the Category middleware
	app.param('categoryId', categories.categoryByID);
};
